'use client';
import { useState, useEffect, useCallback } from 'react';
import { Alert } from '@/types';

// ─── Mock Data ─── Replace with real API calls ───────────────────
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

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      // const res = await fetch('/api/alerts');
      // const json = await res.json();
      // setAlerts(json.data);
      await new Promise((r) => setTimeout(r, 400));
      setAlerts(MOCK_ALERTS);
    } catch {
      setError('Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    // TODO: await fetch(`/api/alerts/${id}/read`, { method: 'PATCH' });
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts, markRead };
}
