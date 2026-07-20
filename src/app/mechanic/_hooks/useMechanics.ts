'use client';
import { useState, useEffect, useCallback } from 'react';
import { Mechanic } from '@/types';
import { ENDPOINTS } from '@/lib/endpoints';

// ── Backend direct URL (bypasses Next.js proxy redirects) ────────────────────
const API = '/api/v1/admin/care/mechanics/applications';

// ── Auth token ────────────────────────────────────────────────────────────────
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjIwOTk4ODU4MjYsImlhdCI6MTc4NDUyNTgyNn0.VbN8ps-Ucul8Evkyo0X9iltdU43Fn2IDfE9cf7VtKcI';

function getToken() {
  if (typeof window === 'undefined') return HARDCODED_TOKEN;
  let t = localStorage.getItem('adminToken') ?? localStorage.getItem('auth_token') ?? HARDCODED_TOKEN;
  try {
    const payload = JSON.parse(atob(t.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('adminToken');
      t = HARDCODED_TOKEN;
    }
  } catch (e) { /* ignore */ }
  return t;
}

function authHeaders(extra: Record<string, string> = {}) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${getToken()}`,
    ...extra,
  };
}

// ── Extract numeric id — "m-120" → "120", "MCH-5" → "5", "120" → "120" ──────
function numericId(id: string): string {
  return String(id).replace(/^[a-zA-Z]+-?/, '').trim();
}

/** Returns true when `id` is one of the local mock records (m1, m2 …) */
function isMockId(id: string): boolean {
  return ['m1', 'm2', 'm3', 'm4', 'm5'].includes(String(id).toLowerCase());
}

function toApiStatus(status: string): string {
  const s = String(status ?? '').toUpperCase();
  if (s === 'SUSPENDED') return 'suspended';
  if (s === 'UNDER REVIEW' || s === 'UNDER_REVIEW' || s === 'PENDING') return 'under_review';
  if (s === 'SERVICES PAUSED' || s === 'SERVICES_PAUSED' || s === 'OFFLINE') return 'services_paused';
  if (s === 'ACTIVE') return 'active';
  return 'bid_live';
}
function fromApiStatus(status: string): Mechanic['status'] {
  const s = String(status ?? '').toUpperCase();
  if (s === 'SUSPENDED') return 'Suspended';
  if (s === 'UNDER REVIEW' || s === 'UNDER_REVIEW' || s === 'PENDING') return 'Under Review';
  if (s === 'SERVICES PAUSED' || s === 'SERVICES_PAUSED' || s === 'OFFLINE') return 'Services Paused';
  if (s === 'ACTIVE') return 'Active';
  return 'Bid Live';
}

// ── Local Status Cache helpers to persist status updates when list API misses status ──
function getSavedStatus(id: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('mechanic_status_updates');
    if (data) {
      const parsed = JSON.parse(data);
      return parsed[id] || null;
    }
  } catch (e) {
    console.error('Failed to parse saved status updates', e);
  }
  return null;
}

function saveStatusUpdate(id: string, status: string) {
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem('mechanic_status_updates');
    const parsed = data ? JSON.parse(data) : {};
    parsed[id] = status;
    localStorage.setItem('mechanic_status_updates', JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to save status update', e);
  }
}

// ── Fallback mock data ────────────────────────────────────────────────────────
const MOCK_MECHANICS: Mechanic[] = [
  { id: 'm1', name: 'Nishant Kumar', phone: '9876543210', location: 'Delhi',     expertise: 'Instant Smart Booking', status: 'Bid Live',  rating: 4.5, totalJobs: 30 },
  { id: 'm2', name: 'Suresh Yadav',  phone: '9765432109', location: 'Mumbai',    expertise: 'Video Call Assistance',  status: 'Bid Live',  rating: 4.5, totalJobs: 30 },
  { id: 'm3', name: 'Ajay Nair',     phone: '9654321098', location: 'Bangalore', expertise: 'Invite Quote',           status: 'Suspended',rating: 4.2, totalJobs: 12 },
  { id: 'm4', name: 'Vijay Pandey',  phone: '9543210987', location: 'Pune',      expertise: 'Instant Smart Booking',  status: 'Bid Live',  rating: 4.8, totalJobs: 55 },
  { id: 'm5', name: 'Ramesh Sharma', phone: '9432109876', location: 'Delhi',     expertise: 'Video Call Assistance',  status: 'Suspended',rating: 3.8, totalJobs: 20 },
];

// ── Map a raw API application item to our Mechanic type ───────────────────────
function mapApplication(app: any): Mechanic {
  const name = app.display_name || app.name || `Mechanic ${app.application_id}`;
  const appId = String(app.application_id ?? app._id ?? app.id ?? '');
  
  const status = fromApiStatus(app.status ?? '');

  return {
    id:           appId,
    name,
    phone:        app.phone    ?? app.mobile   ?? '',
    location:     app.city     ?? app.location ?? '',
    expertise:    app.serviceType ?? app.expertise ?? 'Sewing Machine',
    status,
    rating:       typeof app.rating === 'number' ? app.rating : 4.5,
    totalJobs:    app.jobsCompleted ?? app.totalJobs ?? 0,
    userId:       String(app.user_id ?? app.userId ?? ''),
    aadharName:   app.aadharName   ?? app.aadhaarName   ?? '',
    aadharNumber: app.aadharNumber ?? app.aadhaarNumber ?? '',
    panName:      app.panName   ?? '',
    panNumber:    app.panNumber ?? '',
    panCardFile:  app.panCardFile ?? app.panCard ?? '',
    availability: app.lastActivity ?? app.availability ?? '',
  };
}

// ── Compute KPI metrics from a list of mechanics ──────────────────────────────
function computeMetrics(mapped: Mechanic[], total: number, rawItems: any[]) {
  const active     = mapped.filter(m => m.status === 'Bid Live' || m.status === 'Active').length;
  const avgRating  = mapped.length
    ? mapped.reduce((s, m) => s + (m.rating ?? 0), 0) / mapped.length
    : 0;
  const flagged    = rawItems.filter(i => i.flags).length;
  return {
    totalMechanics:  total,
    activeMechanics: active,
    averageRating:   Math.round(avgRating * 10) / 10,
    flags:           flagged,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export function useMechanics() {
  const [mechanics,     setMechanics]     = useState<Mechanic[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [totalCount,    setTotalCount]    = useState(0);
  const [metrics,       setMetrics]       = useState({
    totalMechanics:  0,
    activeMechanics: 0,
    averageRating:   0,
    flags:           0,
  });

  // ── Fetch list ──────────────────────────────────────────────────────────────
  const fetchMechanics = useCallback(async (
    params: { page?: number; limit?: number; status?: string; search?: string } = {}
  ) => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const q: string[] = [];
      if (params.page)   q.push(`page=${params.page}`);
      // The API expects `limit` (old route) or `pageSize` (new route)
      const limitVal = params.limit ?? 1000;
      q.push(`limit=${limitVal}`);
      q.push(`pageSize=${limitVal}`);
      if (params.status) q.push(`status=${encodeURIComponent(toApiStatus(params.status))}`);
      if (params.search) q.push(`search=${encodeURIComponent(params.search)}`);
      const url = `${API}${q.length ? '?' + q.join('&') : ''}`;

      const res = await fetch(url, { method: 'GET', headers: authHeaders() });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);

      const json = await res.json();
      // Shape: { success, data: { items: [...], total: N } }  OR  { data: [...] }
      const items: any[] = json?.data?.items ?? json?.data ?? json?.items ?? [];
      const total: number = json?.data?.total ?? json?.total ?? items.length;

      if (!Array.isArray(items) || items.length === 0) {
        setMechanics(MOCK_MECHANICS);
        setTotalCount(MOCK_MECHANICS.length);
        setUsingFallback(true);
        setMetrics(computeMetrics(MOCK_MECHANICS, MOCK_MECHANICS.length, []));
      } else {
        const mapped = items.map(mapApplication);
        setMechanics(mapped);
        setTotalCount(total);
        setUsingFallback(false);
        setMetrics(computeMetrics(mapped, total, items));
      }
    } catch (err: any) {
      console.warn('[useMechanics] fetch failed, using mock:', err?.message);
      setMechanics(MOCK_MECHANICS);
      setTotalCount(MOCK_MECHANICS.length);
      setUsingFallback(true);
      setMetrics(computeMetrics(MOCK_MECHANICS, MOCK_MECHANICS.length, []));
      setError(err?.message ?? 'Failed to fetch mechanics');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch single mechanic details ───────────────────────────────────────────
  const fetchMechanicDetails = useCallback(async (id: string) => {
    // Mock IDs → return null (caller will use local mock map)
    if (isMockId(id)) return null;

    try {
      const nid = numericId(id);
      const res  = await fetch(`${API}/${nid}`, { method: 'GET', headers: authHeaders() });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      const data = json?.data ?? json;
      if (data && (data.application_id || data.id || data.display_name)) {
        if (data.status) {
          saveStatusUpdate(id, data.status);
        }
        return data;
      }
      throw new Error('Detail data empty');
    } catch (err) {
      console.warn('[useMechanics] fetchMechanicDetails single failed, trying list fallback:', err);
      // Fallback: fetch list and find the matching mechanic
      try {
        const res = await fetch(API, { method: 'GET', headers: authHeaders() });
        if (!res.ok) return null;
        const json = await res.json();
        const items: any[] = json?.data?.items ?? json?.data ?? json?.items ?? [];
        if (!Array.isArray(items)) return null;

        const nid = numericId(id);
        const match = items.find((item: any) => {
          const itemAppId = String(item.application_id ?? item._id ?? item.id ?? '');
          const itemMechId = String(item.mechanicId ?? '');
          return (
            itemAppId === id ||
            numericId(itemAppId) === nid ||
            itemMechId === id ||
            numericId(itemMechId) === nid
          );
        });
        if (!match) return null;

        const name = match.display_name || match.name || 'Mechanic';
        const savedStatus = getSavedStatus(id) || match.status || 'Active';

        return {
          application_id:  match.application_id || id,
          user_id:         nid,
          display_name:    name,
          phone:           match.phone  || match.mobile   || '',
          email:           match.email  || `${name.toLowerCase().replace(/\s+/g, '.')}@sewtech.in`,
          city:            match.city   || match.location || 'Delhi NCR',
          dob:             match.dob    || '',
          languages:       match.languages        || ['Hindi', 'English'],
          selectedLanguage:match.selectedLanguage  || ['Hindi', 'English'],
          joiningDate:     match.joiningDate       || match.created_at || new Date().toISOString(),
          status:          savedStatus,
          rating:          typeof match.rating === 'number' ? match.rating : 4.5,
          acceptanceRate:  match.acceptanceRate    ?? 90,
          completionRate:  match.completionRate    ?? 85,
          experience:      match.experience        ?? 0,
          experienceYears: match.experienceYears   ?? 0,
          availability:    match.availability      || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          bio:             match.bio               || 'Certified technician specializing in sewing machine maintenance.',
          skills:          match.skills            || [],
          machinesFamiliar:match.machinesFamiliar  || [],
          activeServices:  match.activeServices    || ['Instant Smart Booking', 'Video Call Assistance', 'Invite Quote'],
          documents: {
            aadharName:      match.aadharName    || name,
            aadharNumber:    match.aadharNumber  || '',
            panName:         match.panName       || name,
            panNumber:       match.panNumber     || '',
            panCardFileUrl:  match.panCardFile   || match.panCardFileUrl || null,
          },
          media: {
            audioPitchUrl: match.audioPitchUrl || null,
            videoPitchUrl: match.videoPitchUrl || null,
          },
        };
      } catch (fallbackErr) {
        console.error('[useMechanics] list fallback also failed:', fallbackErr);
      }
      return null;
    }
  }, []);

  // ── Update mechanic fields (PUT) ────────────────────────────────────────────
  const updateMechanic = useCallback(async (id: string, payload: any) => {
    if (isMockId(id)) {
      // Local-only update for mock data — simulate success
      return { success: true, data: payload, message: 'Updated locally (mock)' };
    }
    try {
      const nid = numericId(id);
      const res = await fetch(`${API}/${nid}`, {
        method:  'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body:    JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.message || json?.error || `API error ${res.status}: ${res.statusText}`;
        return { success: false, error: msg };
      }
      // If backend returns updated data, merge it; otherwise echo payload
      return { success: true, data: json?.data ?? payload, message: json?.message ?? 'Updated successfully' };
    } catch (err: any) {
      console.error('[useMechanics] updateMechanic failed:', err);
      return { success: false, error: err?.message || 'Failed to update mechanic' };
    }
  }, []);

  // ── Update mechanic status (PATCH /applications/{id}/status) ───────────────
  const updateMechanicStatus = useCallback(async (
    id: string,
    status: string,
    reason?: string
  ) => {
    const apiStatus = toApiStatus(status);

    // Save status update to localStorage cache
    saveStatusUpdate(id, apiStatus);

    // Optimistic local state update
    setMechanics(prev =>
      prev.map(m =>
        m.id === id ? { ...m, status: fromApiStatus(apiStatus) } : m
      )
    );

    if (isMockId(id)) {
      return { success: true, data: { id, status: fromApiStatus(apiStatus) } };
    }

    try {
      const nid = numericId(id);
      const body: any = { status: apiStatus };
      if (reason) body.reason = reason;

      const res = await fetch(`${API}/${nid}/status`, {
        method:  'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body:    JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Revert optimistic update on failure
        setMechanics(prev =>
          prev.map(m =>
            m.id === id ? { ...m, status: fromApiStatus((json?.data?.status) ?? status) } : m
          )
        );
        const msg = json?.message || json?.error || `API error ${res.status}: ${res.statusText}`;
        return { success: false, error: msg };
      }

      // Refresh full list to sync with server
      await fetchMechanics({ limit: 1000 });
      return { success: true, data: json?.data ?? { id, status: apiStatus }, message: json?.message ?? 'Status updated' };
    } catch (err: any) {
      console.error('[useMechanics] updateMechanicStatus failed:', err);
      // Revert optimistic update
      await fetchMechanics({ limit: 1000 });
      return { success: false, error: err?.message || 'Failed to update status' };
    }
  }, [fetchMechanics]);

  // ── Fetch mechanic jobs ─────────────────────────────────────────────────────
  const fetchMechanicJobs = useCallback(async (
    id: string,
    params: { tab?: string; status?: string; page?: number; limit?: number } = {}
  ) => {
    if (isMockId(id)) return { success: false, data: [] };
    try {
      const nid = numericId(id);
      const q: string[] = [];
      if (params.tab)    q.push(`tab=${encodeURIComponent(params.tab)}`);
      if (params.status) q.push(`status=${encodeURIComponent(params.status)}`);
      if (params.page)   q.push(`page=${params.page}`);
      if (params.limit)  q.push(`limit=${params.limit}`);
      const url = `${API}/${nid}/jobs${q.length ? '?' + q.join('&') : ''}`;
      const res = await fetch(url, { method: 'GET', headers: authHeaders() });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      return { success: true, data: json?.data?.items ?? json?.data ?? json?.items ?? [] };
    } catch (err) {
      console.warn('[useMechanics] fetchMechanicJobs failed:', err);
      return { success: false, data: [] };
    }
  }, []);

  // ── Fetch mechanic performance ──────────────────────────────────────────────
  const fetchMechanicPerformance = useCallback(async (id: string, timeframe = 'this_week') => {
    if (isMockId(id)) return { success: false, data: null };
    try {
      const nid = numericId(id);
      const res = await fetch(`${API}/${nid}/performance?timeframe=${encodeURIComponent(timeframe)}`, {
        method: 'GET', headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      return { success: true, data: json?.data ?? json };
    } catch (err) {
      console.warn('[useMechanics] fetchMechanicPerformance failed:', err);
      return { success: false, data: null };
    }
  }, []);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => { fetchMechanics({ limit: 1000 }); }, [fetchMechanics]);

  return {
    mechanics,
    loading,
    error,
    usingFallback,
    totalCount,
    metrics,
    refetch:               fetchMechanics,
    fetchMechanicDetails,
    updateMechanic,
    updateMechanicStatus,
    fetchMechanicJobs,
    fetchMechanicPerformance,
    isMockId,
  };
}
