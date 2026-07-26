'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '../../../types';

// NEXT_PUBLIC_API_URL = /api/v1  →  proxy rewrites to http://127.0.0.1:8000/api/v1
const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

// ── Correct API paths (no double /api/v1) ────────────────────────────────────
const ADMIN_USERS_URL  = `${BASE}/admin/users`;   // GET list, GET detail, PATCH, violations, wallet
const USERS_URL        = `${BASE}/users`;          // POST create, DELETE deactivate, DELETE hard

// ── Auth token ────────────────────────────────────────────────────────────────
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjIwOTk4ODU4MjYsImlhdCI6MTc4NDUyNTgyNn0.VbN8ps-Ucul8Evkyo0X9iltdU43Fn2IDfE9cf7VtKcI';

function getToken() {
  if (typeof window === 'undefined') return DEV_TOKEN;
  return (
    localStorage.getItem('auth_token') ??
    localStorage.getItem('adminToken') ??
    DEV_TOKEN
  );
}

function authHeaders(extra: Record<string, string> = {}) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
    ...extra,
  };
}

// ── Map backend → frontend User ───────────────────────────────────────────────
function mapUser(u: any): User {
  return {
    id:           String(u.user_id),
    name:         u.full_name       || 'Unknown',
    email:        u.email           || '',
    role: (() => {
      const r = String(u.role || '').toLowerCase().trim();
      if (u.is_mechanic || r === 'mechanic' || r === 'mechanics') return 'Mechanic';
      if (r === 'admin' || r === 'super-admin' || r === 'super_admin') return 'Admin';
      if (r === 'seller') return 'Seller';
      if (r === 'buyer' || r === 'customer') return 'Customer';
      return u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'Customer';
    })(),
    status:        u.is_active ? 'Active' : 'Inactive',
    joinedAt:      u.created_at
      ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
      : '-',
    avatar:        u.profile_picture_url || undefined,
    phone:         u.phone_number        || '',
    location:      u.city                || 'Unknown',
    lastLogin:     u.updated_at
      ? new Date(u.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
      : '-',
    lifetimeValue: u.wallet_balance != null
      ? `₹${Number(u.wallet_balance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
      : '₹0',
    membership:    u.membership_type      || 'Free',
    dob:           u.date_of_birth        || undefined,
    userType:      u.business_owner_type  || undefined,
    typeOfUser:    u.business_owner_type  || undefined,
    businessName:  u.business_name        || undefined,
    businessType:  u.business_type        || undefined,
    gstNumber:     u.gst_number           || undefined,
    isVerified:    u.is_verified          ?? false,
    modulesUsed:   [],
    activities:    [],
    escalations:   [],
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useUsers({ page = 1, pageSize = 10, search = '' } = {}) {
  const [users,            setUsers]            = useState<User[]>([]);
  const [totalCount,       setTotalCount]       = useState(0);
  const [newUsersCount,    setNewUsersCount]    = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState<string | null>(null);

  // ── LIST — GET /admin/users ───────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        page:      String(page),
        size:      String(pageSize),
      });
      if (search) qs.set('q', search);

      const res = await fetch(`${ADMIN_USERS_URL}?${qs}`, {
        method:  'GET',
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      const data = await res.json();

      // Backend returns: { users: [...], total, new_users_7d, active_users_30d }
      const userList = data.users || data.items || (Array.isArray(data) ? data : []);
      setUsers(userList.map(mapUser));
      setTotalCount(data.total ?? data.count ?? userList.length);
      setNewUsersCount(data.new_users_7d ?? 0);
      setActiveUsersCount(data.active_users_30d ?? 0);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  // ── GET SINGLE — GET /admin/users/{id} ───────────────────────────────────
  const fetchUser = useCallback(async (id: string): Promise<User | null> => {
    try {
      const res = await fetch(`${ADMIN_USERS_URL}/${id}`, {
        method:  'GET',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const u = await res.json();
      return mapUser(u);
    } catch {
      return null;
    }
  }, []);

  // ── CREATE — POST /users/ ─────────────────────────────────────────────────
  const createUser = useCallback(async (userData: {
    name:              string;
    phone:             string;
    email?:            string;
    role?:             string;
    gender?:           string;
    dob?:              string;
    userType?:         string;
    businessName?:     string;
    businessType?:     string;
    gstNumber?:        string;
    industryIds?:      number[];
    serviceIds?:       number[];
    isActive?:         boolean;
    sendNotification?: boolean;
    [key: string]: any;
  }): Promise<User> => {
    const rawType  = (userData.userType || 'individual').toLowerCase().trim();
    const userType = ['business owner', 'business', 'corporate'].includes(rawType) ? 'business' : 'individual';

    const payload: Record<string, unknown> = {
      full_name:         userData.name,
      phone_number:      userData.phone,
      role:              userData.role ? userData.role.toLowerCase() : 'customer',
      user_type:         userType,
      industry_ids:      userData.industryIds      ?? [],
      service_ids:       userData.serviceIds        ?? [],
      is_active:         userData.isActive          ?? true,
      send_notification: userData.sendNotification  ?? false,
    };

    if (userData.email)        payload.email         = userData.email;
    if (userData.dob)          payload.date_of_birth = userData.dob;
    if (userData.gender)       payload.gender        = userData.gender.toLowerCase();
    if (userData.businessName) payload.business_name = userData.businessName;
    if (userData.businessType) payload.business_type = userData.businessType;
    if (userData.gstNumber)    payload.gst_number    = userData.gstNumber;

    const res = await fetch(`${USERS_URL}/`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || `Create failed: ${res.status}`);
    }
    const created = await res.json();
    const newUser = mapUser({ ...created, wallet_balance: created.wallet_balance ?? 500 });
    setUsers(prev => [newUser, ...prev]);
    setTotalCount(prev => prev + 1);
    return newUser;
  }, []);

  // ── UPDATE STATUS — PATCH /admin/users/{id} ──────────────────────────────
  const updateStatus = useCallback(async (id: string, newStatus: User['status']) => {
    const original = users.find(u => u.id === id)?.status ?? 'Inactive';
    // Optimistic update
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    try {
      const res = await fetch(`${ADMIN_USERS_URL}/${id}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ is_active: newStatus === 'Active' }),
      });
      if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update status');
      // Rollback
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: original } : u));
    }
  }, [users]);

  // ── UPDATE FIELDS — PATCH /admin/users/{id} ──────────────────────────────
  const updateUser = useCallback(async (id: string, fields: Partial<User>) => {
    const payload: Record<string, unknown> = {};
    if (fields.role     !== undefined) payload.role      = fields.role.toLowerCase();
    if (fields.status   !== undefined) payload.is_active = fields.status === 'Active';
    if (fields.location !== undefined) payload.city      = fields.location;
    if (Object.keys(payload).length > 0) {
      const res = await fetch(`${ADMIN_USERS_URL}/${id}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || `Update failed: ${res.status}`);
      }
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
  }, []);

  // ── DEACTIVATE — DELETE /users/{id}/deactivate ───────────────────────────
  const deactivateUser = useCallback(async (id: string) => {
    const res = await fetch(`${USERS_URL}/${id}/deactivate`, {
      method:  'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Deactivate failed: ${res.status}`);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Inactive' } : u));
  }, []);

  // ── HARD DELETE — DELETE /users/{id} ─────────────────────────────────────
  const deleteUser = useCallback(async (id: string) => {
    const res = await fetch(`${USERS_URL}/${id}`, {
      method:  'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    setUsers(prev => prev.filter(u => u.id !== id));
    setTotalCount(prev => Math.max(0, prev - 1));
  }, []);

  // ── MASTER DATA (public endpoints) ───────────────────────────────────────
  const fetchIndustries = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/onboarding/industries`);
      if (!res.ok) throw new Error();
      return res.json();
    } catch { return []; }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/onboarding/services`);
      if (!res.ok) throw new Error();
      return res.json();
    } catch { return []; }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return {
    users,
    totalCount,
    newUsersCount,
    activeUsersCount,
    loading,
    error,
    refetch:        fetchUsers,
    fetchUser,
    updateStatus,
    createUser,
    updateUser,
    deactivateUser,
    deleteUser,
    fetchIndustries,
    fetchServices,
  };
}
