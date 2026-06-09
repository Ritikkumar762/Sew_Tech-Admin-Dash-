'use client';
import { useState, useEffect, useCallback } from 'react';
import { Alert } from '@/types';

// ─── Mock Data ─── Replace with real API calls ───────────────────
const MOCK_ALERTS: Alert[] = [
  { id: 'a1', title: 'Low Inventory Alert', message: 'SKU-102 stock is below threshold (5 units remaining)', type: 'warning', createdAt: '2026-06-09T08:00:00Z', read: false },
  { id: 'a2', title: 'Payment Failure', message: 'Order #ORD-884 payment failed. Customer notified.', type: 'error', createdAt: '2026-06-09T07:30:00Z', read: false },
  { id: 'a3', title: 'New Mechanic Registered', message: 'Ramesh Kumar has registered as a mechanic in Delhi.', type: 'info', createdAt: '2026-06-08T15:00:00Z', read: true },
  { id: 'a4', title: 'Refund Approved', message: 'Refund of ₹1,200 approved for Order #ORD-820.', type: 'success', createdAt: '2026-06-08T12:00:00Z', read: true },
  { id: 'a5', title: 'Server Response Slow', message: 'API latency exceeded 2s for /api/orders endpoint.', type: 'error', createdAt: '2026-06-07T11:00:00Z', read: true },
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
