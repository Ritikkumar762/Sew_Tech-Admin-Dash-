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

  const rawStatus = (app.status ?? '').toUpperCase();
  const status: Mechanic['status'] =
    rawStatus === 'SUSPENDED' || rawStatus === 'OFFLINE' ? 'Offline' :
    rawStatus === 'BUSY'                                 ? 'Busy'    : 'Available';

  return {
    id:        String(app.application_id ?? app._id ?? app.id ?? `api-${index}`),
    name:      fullName,
    phone:     app.phone ?? app.mobile ?? '',
    location:  app.city  ?? app.location ?? app.address?.city ?? '',
    expertise: app.serviceType ?? app.expertise ?? app.specialization ?? 'Sewing Machine',
    status,
    rating:    typeof app.rating === 'number' ? app.rating : 4.5,
    totalJobs: app.totalJobs ?? app.jobsCompleted ?? 0,
  };
}

export function useMechanics() {
  const [mechanics, setMechanics]         = useState<Mechanic[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchMechanics = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const res = await fetch(ENDPOINTS.mechanics.applications, {
        method: 'GET',
        headers: {
          'Accept':        'application/json',
          'Authorization': `Bearer ${HARDCODED_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

      const json = await res.json();
      console.log('[useMechanics] API response:', json);

      // Handle different possible shapes: { data:[...] } | { applications:[...] } | [...]
      const raw: any[] = Array.isArray(json)
        ? json
        : json.data ?? json.applications ?? json.mechanics ?? json.results ?? [];

      if (raw.length === 0) {
        console.warn('[useMechanics] API returned empty array — using fallback mock data');
        setMechanics(MOCK_MECHANICS);
        setUsingFallback(true);
      } else {
        setMechanics(raw.map(mapApplication));
      }
    } catch (err) {
      console.warn('[useMechanics] API call failed — using fallback mock data:', err);
      setMechanics(MOCK_MECHANICS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMechanics(); }, [fetchMechanics]);

  return { mechanics, loading, error, usingFallback, refetch: fetchMechanics };
}
