'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '../../../types';

// ── Backend direct URL (bypasses Next.js proxy redirects) ────────────────────
const API = '/api/v1/admin/users'; // Using admin/users to match Next.js proxy
const BASE_URL = '/api/v1/';

// ── Auth token ────────────────────────────────────────────────────────────────
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODQyNzc3MzYsImlhdCI6MTc4MzY3MjkzNn0.cj9MgoGPQokWFS-bLt9J2kJAtu_iYQ9C8f3BjqiSzO0';

function getToken() {
  if (typeof window === 'undefined') return HARDCODED_TOKEN;
  return (
    localStorage.getItem('adminToken') ??
    localStorage.getItem('auth_token') ??
    HARDCODED_TOKEN
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
      // Priority: admin > mechanic > seller > buyer
      if (u.role === 'admin')   return 'Admin';
      if (u.is_mechanic)        return 'Mechanic';
      if (u.role === 'seller')  return 'Seller';
      if (u.role === 'buyer')   return 'Customer';
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
  const [users,      setUsers]      = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  // ── LIST ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (search) qs.set('search', search);
      const res = await fetch(`${API}?${qs}`, { method: 'GET', headers: authHeaders() });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setUsers((data.users ?? []).map(mapUser));
      setTotalCount(data.total ?? 0);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  // ── GET SINGLE ───────────────────────────────────────────────────────────
  const fetchUser = useCallback(async (id: string): Promise<User | null> => {
    try {
      // Use admin detail endpoint (includes wallet, violations etc.)
      const res = await fetch(`${BASE_URL}admin/users/${id}`, { method: 'GET', headers: authHeaders() });
      if (!res.ok) throw new Error();
      const u = await res.json();
      return mapUser(u);
    } catch {
      // Fallback: search in already-loaded list
      return null;
    }
  }, []);

  // ── CREATE (Admin POST users) ───────────────────────────────────────────
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

    // Matches AdminUserCreateRequest schema exactly
    const payload: Record<string, unknown> = {
      full_name:         userData.name,
      phone_number:      userData.phone,
      role:              userData.role || 'Customer',
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

    const res = await fetch(`${API}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error();
    const created = await res.json();

    // Map returned user object (same as normal onboarding response)
    const newUser = mapUser({ ...created, wallet_balance: created.wallet_balance ?? 500 });
    setUsers(prev => [newUser, ...prev]);
    setTotalCount(prev => prev + 1);
    return newUser;
  }, []);

  // ── UPDATE STATUS (PATCH admin/users/{id}) ───────────────────────────────
  const updateStatus = useCallback(async (id: string, newStatus: User['status']) => {
    // Save original before optimistic update so rollback is always correct
    const original = users.find(u => u.id === id)?.status ?? 'Inactive';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    try {
      const res = await fetch(`${BASE_URL}admin/users/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body:   JSON.stringify({ is_active: newStatus === 'Active' }),
      });
      if (!res.ok) throw new Error();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update status');
      // Rollback to original status (works correctly for Suspended too)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: original } : u));
    }
  }, [users]);

  // ── UPDATE FIELDS (PATCH admin/users/{id}) ───────────────────────────────
  const updateUser = useCallback(async (id: string, fields: Partial<User>) => {
    const payload: Record<string, unknown> = {};
    if (fields.role   !== undefined) payload.role      = fields.role.toLowerCase();
    if (fields.status !== undefined) payload.is_active = fields.status === 'Active';
    if (Object.keys(payload).length > 0) {
      const res = await fetch(`${BASE_URL}admin/users/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
  }, []);

  // ── DEACTIVATE (soft delete) — DELETE users/{id}/deactivate ─────────────
  const deactivateUser = useCallback(async (id: string) => {
    const res = await fetch(`${API}/${id}/deactivate`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error();
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Inactive' } : u));
  }, []);

  // ── HARD DELETE ───────────────────────────────────────────────────────────
  const deleteUser = useCallback(async (id: string) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error();
    setUsers(prev => prev.filter(u => u.id !== id));
    setTotalCount(prev => Math.max(0, prev - 1));
  }, []);

  // ── MASTER DATA (public endpoints) ───────────────────────────────────────
  const fetchIndustries = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}onboarding/industries`);
      if (!res.ok) throw new Error();
      return res.json();
    } catch { return []; }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}onboarding/services`);
      if (!res.ok) throw new Error();
      return res.json();
    } catch { return []; }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return {
    users,
    totalCount,
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
