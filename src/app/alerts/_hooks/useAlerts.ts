'use client';
import { useState, useEffect, useCallback } from 'react';
import { Alert } from '@/types';
import { ENDPOINTS } from '@/lib/endpoints';

// ─── Fallback Mock Data ────────────────────────────────────────────
// Used automatically when the backend is unreachable or returns an error.
const MOCK_ALERTS: Alert[] = [
  { id: 'a1', title: 'Stock-out Industrial Sewing Needle', message: 'SKU-102 stock is at 0.', type: 'error', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a2', title: 'Stock-out Industrial Sewing Needle', message: 'SKU-105 stock is at 0.', type: 'error', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a3', title: 'Stock-out Industrial Sewing Needle', message: 'SKU-109 stock is at 0.', type: 'error', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a4', title: 'Stock-out Industrial Sewing Needle', message: 'SKU-202 stock is at 0.', type: 'error', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a5', title: 'Low stock approaching threshold', message: 'Mechanic toolkit running low.', type: 'warning', module: 'ST Mechanics', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a6', title: 'Low stock approaching threshold', message: 'Oil bottles running low.', type: 'warning', module: 'ST Mechanics', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a7', title: 'Low stock approaching threshold', message: 'Belts running low.', type: 'warning', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'a8', title: 'Stock healthy but trending down', message: 'Bobbin cases selling fast.', type: 'info', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'a9', title: 'Stock healthy but trending down', message: 'Needle plates selling fast.', type: 'info', module: 'ST Spares', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'a10', title: 'Stock healthy but trending down', message: 'Presser feet selling fast.', type: 'info', module: 'ST Mechanics', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'a11', title: 'Server Response Slow', message: 'API latency high.', type: 'error', module: 'Other', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false },
];
// ──────────────────────────────────────────────────────────────────

/** Normalise any response shape the backend may return into Alert[]. */
function parseAlertsResponse(json: unknown): Alert[] {
  if (Array.isArray(json)) return json as Alert[];
  const obj = json as Record<string, unknown>;
  if (obj?.data) {
    const d = obj.data as Record<string, unknown>;
    if (Array.isArray(d)) return d as Alert[];
    if (Array.isArray(d?.items)) return d.items as Alert[];
  }
  return [];
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.alerts.list, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const data = parseAlertsResponse(json);
      setAlerts(data);
      setUsingFallback(false);
    } catch (err) {
      // Backend unreachable or error — fall back to mock data silently
      console.warn('[useAlerts] API unavailable, using mock data.', err);
      setAlerts(MOCK_ALERTS);
      setUsingFallback(true);
      // Don't set error — UI should still be fully functional with mock data
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    // Optimistic update first — UI feels instant
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    try {
      await fetch(ENDPOINTS.alerts.markRead(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
    } catch (err) {
      // Non-fatal: optimistic update stays; log for debugging
      console.warn('[useAlerts] markRead API call failed (non-fatal).', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    // Optimistic update
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    try {
      await fetch(ENDPOINTS.alerts.markAll, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
    } catch (err) {
      console.warn('[useAlerts] markAllRead API call failed (non-fatal).', err);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  return { alerts, loading, error, usingFallback, refetch: fetchAlerts, markRead, markAllRead };
}
