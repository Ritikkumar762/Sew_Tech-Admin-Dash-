'use client';
import { useState, useEffect, useCallback } from 'react';
import { Mechanic } from '@/types';
import { ENDPOINTS } from '@/lib/endpoints';

// ── Auth token (hardcoded temporarily — replace with real auth flow later) ────
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJleHAiOjE3ODI5OTExODMsImlhdCI6MTc4MjM4NjM4M30.DAmKNvtQT2y-_AvnB2g9U588udsdLt72FofspB_sTIM';

// ── Fallback mock data (used if API fails / returns empty) ────────────────────
const MOCK_MECHANICS: Mechanic[] = [
  { id: 'm1', name: 'Nishant Kumar', phone: '9876543210', location: 'Delhi',     expertise: 'Instant Smart Booking',  status: 'Available', rating: 4.5, totalJobs: 30 },
  { id: 'm2', name: 'Suresh Yadav',  phone: '9765432109', location: 'Mumbai',    expertise: 'Video Call Assistance',   status: 'Available', rating: 4.5, totalJobs: 30 },
  { id: 'm3', name: 'Ajay Nair',     phone: '9654321098', location: 'Bangalore', expertise: 'Invite Quote',            status: 'Available', rating: 4.5, totalJobs: 30 },
  { id: 'm4', name: 'Vijay Pandey',  phone: '9543210987', location: 'Pune',      expertise: 'Instant Smart Booking',   status: 'Available', rating: 4.5, totalJobs: 30 },
  { id: 'm5', name: 'Ramesh Sharma', phone: '9432109876', location: 'Delhi',     expertise: 'Video Call Assistance',   status: 'Available', rating: 4.5, totalJobs: 30 },
];

/** Map a raw API application object → internal Mechanic shape */
function mapApplication(app: any, index: number): Mechanic {
  // API fields: display_name, application_id, status (APPROVED/PENDING/REJECTED), submitted_at, user_id, profile_id
  const fullName =
    app.display_name ||
    [app.firstName, app.lastName].filter(Boolean).join(' ') ||
    app.name ||
    `Mechanic ${index + 1}`;

  // Preserve actual API status casing and values
  let status: Mechanic['status'] = 'Active';
  if (app.status) {
    const s = String(app.status).toUpperCase();
    if (s === 'ACTIVE' || s === 'AVAILABLE' || s === 'APPROVED') status = 'Active';
    else if (s === 'BUSY') status = 'Busy';
    else if (s === 'PENDING') status = 'Pending';
    else if (s === 'SUSPENDED') status = 'Suspended';
    else if (s === 'OFFLINE') status = 'Offline';
    else if (s === 'REJECTED') status = 'Rejected';
    else status = (app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()) as any;
  } else {
    status = 'Active';
  }

  return {
    id:        String(app.application_id ?? app._id ?? app.id ?? `api-${index}`),
    name:      fullName,
    phone:     app.phone ?? app.mobile ?? '',
    location:  app.city  ?? app.location ?? app.address?.city ?? '',
    expertise: app.serviceType ?? app.expertise ?? app.specialization ?? 'Sewing Machine',
    status,
    rating:    typeof app.rating === 'number' ? app.rating : 4.5,
    totalJobs: app.totalJobs ?? app.jobsCompleted ?? 0,
    userId:    app.user_id ?? app.userId ?? '',
    aadharName: app.aadharName ?? app.aadhaarName ?? '',
    aadharNumber: app.aadharNumber ?? app.aadhaarNumber ?? '',
    panName:   app.panName ?? '',
    panNumber: app.panNumber ?? '',
    panCardFile: app.panCardFile ?? app.panCard ?? '',
    availability: app.availability ?? '',
  };
}

export function useMechanics() {
  const [mechanics, setMechanics]         = useState<Mechanic[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [totalCount, setTotalCount]       = useState(0);
  const [metrics, setMetrics]             = useState({
    totalMechanics: 1500,
    activeMechanics: 1000,
    averageRating: 4.5,
    flags: 100
  });

  const fetchMechanics = useCallback(async (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const queryParts = [];
      if (params.page) queryParts.push(`page=${params.page}`);
      if (params.limit) queryParts.push(`limit=${params.limit}`);
      if (params.status) queryParts.push(`status=${params.status}`);
      if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') ?? localStorage.getItem('adminToken') : null) || HARDCODED_TOKEN;
      const url = `http://localhost:8000/api/v1/admin/care/mechanics/applications${queryString}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

      const json = await res.json();
      console.log('[useMechanics] API response:', json);

      const raw: any[] = Array.isArray(json)
        ? json
        : json.data ?? json.applications ?? json.mechanics ?? json.results ?? [];

      const total = json.meta?.total ?? json.total ?? raw.length;
      setTotalCount(total);

      if (json.metrics) {
        setMetrics({
          totalMechanics: json.metrics.totalMechanics ?? 1500,
          activeMechanics: json.metrics.activeMechanics ?? 1000,
          averageRating: json.metrics.averageRating ?? 4.5,
          flags: json.metrics.flags ?? 100
        });
      }

      if (raw.length === 0) {
        console.warn('[useMechanics] API returned empty array — using fallback mock data');
        setMechanics(MOCK_MECHANICS);
        setTotalCount(MOCK_MECHANICS.length);
        setUsingFallback(true);
      } else {
        setMechanics(raw.map(mapApplication));
      }
    } catch (err: any) {
      console.warn('[useMechanics] API call failed — using fallback mock data:', err);
      setMechanics(MOCK_MECHANICS);
      setTotalCount(MOCK_MECHANICS.length);
      setUsingFallback(true);
      setError(err?.message || 'Failed to fetch mechanics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMechanicDetails = useCallback(async (id: string) => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') ?? localStorage.getItem('adminToken') : null) || HARDCODED_TOKEN;
      const res = await fetch(`http://localhost:8000/api/v1/admin/care/mechanics/applications/${id}`, {
        method: 'GET',
        headers: {
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch details: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error('[useMechanics] Error fetching single mechanic details:', err);
      return null;
    }
  }, []);

  const updateMechanic = useCallback(async (id: string, payload: any) => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') ?? localStorage.getItem('adminToken') : null) || HARDCODED_TOKEN;
      const res = await fetch(`http://localhost:8000/api/v1/admin/care/mechanics/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Failed to update mechanic: ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      console.error('[useMechanics] Error updating mechanic details:', err);
      throw err;
    }
  }, []);

  const updateMechanicStatus = useCallback(async (id: string, status: string, reason?: string) => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') ?? localStorage.getItem('adminToken') : null) || HARDCODED_TOKEN;
      const res = await fetch(`http://localhost:8000/api/v1/admin/care/mechanics/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type':  'application/json',
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, reason })
      });
      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      console.error('[useMechanics] Error updating status:', err);
      throw err;
    }
  }, []);

  const fetchMechanicJobs = useCallback(async (id: string, params: { tab?: string; status?: string; page?: number; limit?: number } = {}) => {
    try {
      const queryParts = [];
      if (params.tab) queryParts.push(`tab=${params.tab}`);
      if (params.status) queryParts.push(`status=${params.status}`);
      if (params.page) queryParts.push(`page=${params.page}`);
      if (params.limit) queryParts.push(`limit=${params.limit}`);
      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') ?? localStorage.getItem('adminToken') : null) || HARDCODED_TOKEN;
      const res = await fetch(`http://localhost:8000/api/v1/admin/care/mechanics/applications/${id}/jobs${queryString}`, {
        method: 'GET',
        headers: {
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      console.error('[useMechanics] Error fetching jobs:', err);
      return { success: false, data: [] };
    }
  }, []);

  const fetchMechanicPerformance = useCallback(async (id: string, timeframe: string = 'this_week') => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') ?? localStorage.getItem('adminToken') : null) || HARDCODED_TOKEN;
      const res = await fetch(`http://localhost:8000/api/v1/admin/care/mechanics/applications/${id}/performance?timeframe=${timeframe}`, {
        method: 'GET',
        headers: {
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch performance: ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      console.error('[useMechanics] Error fetching performance:', err);
      return { success: false, data: null };
    }
  }, []);

  useEffect(() => {
    fetchMechanics();
  }, [fetchMechanics]);

  return {
    mechanics,
    loading,
    error,
    usingFallback,
    totalCount,
    metrics,
    refetch: fetchMechanics,
    fetchMechanicDetails,
    updateMechanic,
    updateMechanicStatus,
    fetchMechanicJobs,
    fetchMechanicPerformance
  };
}
