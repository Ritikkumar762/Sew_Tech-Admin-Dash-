'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { apiClient } from '@/lib/api';

// ── Hardcoded admin token (dev only) — change when expired ───────────────────
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODQyNzc3MzYsImlhdCI6MTc4MzY3MjkzNn0.cj9MgoGPQokWFS-bLt9J2kJAtu_iYQ9C8f3BjqiSzO0';
const AUTH_HEADERS = { 'Authorization': `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' };

// ── Always hits backend directly — bypasses Next.js proxy ────────────────────
const BACKEND = 'http://localhost:8000/api/v1';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

const EP = {
  list:       `${BASE}/admin/users`,
  create:     `${BASE}/users/`,
  byId:       (id: string) => `${BASE}/admin/users/${id}`,
  deactivate: (id: string) => `${BASE}/users/${id}/deactivate`,
  hardDelete: (id: string) => `${BASE}/users/${id}`,
  // Admin overrides (PATCH /api/v1/admin/users/{id})
  adminPatch: (id: string) => `${BASE}/admin/users/${id}`,
  // Public master data (no auth needed)
  industries: `${BASE}/onboarding/industries`,
  services:   `${BASE}/onboarding/services`,
};

// ── Map backend user object → frontend User type ─────────────────────────────
function mapUser(u: any): User {
  return {
    id:           String(u.user_id),
    name:         u.full_name || 'Unknown',
    email:        u.email    || '',
    role: (() => {
      if (u.is_mechanic)       return 'Mechanic';
      if (u.role === 'admin')  return 'Admin';
      if (u.role === 'seller') return 'Seller';
      if (u.role === 'buyer')  return 'Customer';
      return u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'Customer';
    })(),
    status:        u.is_active ? 'Active' : 'Inactive',
    joinedAt:      u.created_at
      ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
      : '-',
    avatar:        u.profile_picture_url || undefined,
    phone:         u.phone_number        || '',
    location:      'Unknown',
    lastLogin:     u.updated_at
      ? new Date(u.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
      : '-',
    lifetimeValue: u.wallet_balance != null
      ? `₹${Number(u.wallet_balance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
      : '-',
    membership:    u.membership_type || 'Free',
    dob:           u.date_of_birth   || undefined,
    userType:      u.business_owner_type || undefined,
    typeOfUser:    u.business_owner_type || undefined,
    businessName:  u.business_name  || undefined,
    businessType:  u.business_type  || undefined,
    gstNumber:     u.gst_number     || undefined,
    isVerified:    u.is_verified    ?? false,
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

  // ── Fetch user list (paginated) ──────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (search) qs.append('search', search);

      const res = await fetch(`${BACKEND}/users/?${qs}`, { headers: AUTH_HEADERS });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();

      setUsers((data.users ?? []).map(mapUser));
      setTotalCount(data.total ?? 0);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  // ── Fetch a single user by ID ────────────────────────────────────────────
  const fetchUser = useCallback(async (id: string): Promise<User | null> => {
    try {
      const u = await apiClient.get<any>(EP.byId(id));
      return mapUser(u);
    } catch (err: any) {
      console.error('fetchUser failed:', err?.message);
      // Fall back to already-loaded list
      return users.find(u => u.id === id) ?? null;
    }
  }, [users]);

  // ── Update user status → calls PATCH /admin/users/{id} ──────────────────
  const updateStatus = useCallback(async (id: string, newStatus: User['status']) => {
    // Optimistic UI update
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    try {
      await apiClient.patch(EP.adminPatch(id), { is_active: newStatus === 'Active' });
    } catch (err: any) {
      // Rollback on error
      setError(err?.message ?? 'Failed to update status.');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus === 'Active' ? 'Inactive' : 'Active' } : u));
    }
  }, []);

  // ── Create user (Admin POST /users/) ────────────────────────────────────
  const createUser = useCallback(async (
    userData: Omit<User, 'id' | 'joinedAt' | 'lastLogin' | 'lifetimeValue' | 'location'> & {
      location?:         string;
      industryIds?:      number[];
      serviceIds?:       number[];
      gender?:           string;
      membershipType?:   string;
      walletBalance?:    string;
      isActive?:         boolean;
      isVerified?:       boolean;
      sendNotification?: boolean;
      dob?:              string;
    }
  ): Promise<User> => {
    const rawType  = (userData.userType || 'individual').toLowerCase().trim();
    const userType = ['business owner', 'business', 'corporate'].includes(rawType) ? 'business' : 'individual';

    const payload: Record<string, unknown> = {
      full_name:         userData.name,
      phone_number:      userData.phone,
      role:              userData.role || 'Customer',
      user_type:         userType,
      industry_ids:      userData.industryIds  ?? [],
      service_ids:       userData.serviceIds   ?? [],
      is_active:         userData.isActive     ?? true,
      send_notification: userData.sendNotification ?? false,
    };

    // Optional fields — only include if set
    if (userData.email)        payload.email         = userData.email;
    if (userData.dob)          payload.date_of_birth = new Date(userData.dob).toISOString().split('T')[0];
    if (userData.gender)       payload.gender        = userData.gender.toLowerCase();
    if (userData.businessName) payload.business_name = userData.businessName;
    if (userData.businessType) payload.business_type = userData.businessType;
    if (userData.gstNumber)    payload.gst_number    = userData.gstNumber;

    const created = await apiClient.post<any>(EP.create, payload);

    const newUser: User = {
      ...userData,
      id:            String(created.user_id),
      location:      'Unknown',
      joinedAt:      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
      lastLogin:     '-',
      lifetimeValue: '₹500',
      modulesUsed:   userData.modulesUsed || [],
      activities:    [],
      escalations:   [],
    };

    setUsers(prev => [newUser, ...prev]);
    setTotalCount(prev => prev + 1);
    return newUser;
  }, []);

  // ── Deactivate user (soft delete) ────────────────────────────────────────
  const deactivateUser = useCallback(async (id: string) => {
    await apiClient.delete(EP.deactivate(id));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Inactive' } : u));
  }, []);

  // ── Hard delete user ─────────────────────────────────────────────────────
  const deleteUser = useCallback(async (id: string) => {
    await apiClient.delete(EP.hardDelete(id));
    setUsers(prev => prev.filter(u => u.id !== id));
    setTotalCount(prev => Math.max(0, prev - 1));
  }, []);

  // ── Update user fields via Admin PATCH ───────────────────────────────────
  const updateUser = useCallback(async (id: string, fields: Partial<User>) => {
    const payload: Record<string, unknown> = {};
    if (fields.role   !== undefined) payload.role      = fields.role.toLowerCase();
    if (fields.status !== undefined) payload.is_active = fields.status === 'Active';

    if (Object.keys(payload).length > 0) {
      await apiClient.patch(EP.adminPatch(id), payload);
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
  }, []);

  // ── Master data (public — no auth required) ──────────────────────────────
  const fetchIndustries = useCallback(async () => {
    try {
      return await apiClient.get<any[]>(EP.industries, { auth: false });
    } catch { return []; }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      return await apiClient.get<any[]>(EP.services, { auth: false });
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
