'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import { Alert } from '@/types';
import { ENDPOINTS } from '@/lib/endpoints';

// Fallback mock data — same as in useAlerts so the detail page
// always has data even when the backend is offline.
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

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchAlert() {
      setLoading(true);
      try {
        // Try the dedicated GET /api/alerts/:id endpoint first
        const res = await fetch(ENDPOINTS.alerts.byId(id), {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const json = await res.json();
        // Handle { success, data: Alert } or bare Alert object
        const data: Alert = json?.data ?? json;
        if (!cancelled) setAlert(data);
      } catch {
        // Backend unavailable — fall back to mock data
        console.warn('[AlertDetail] API unavailable, using mock data.');
        const found = MOCK_ALERTS.find((a) => a.id === id) ?? null;
        if (!cancelled) {
          if (found) setAlert(found);
          else setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAlert();
    return () => { cancelled = true; };
  }, [id]);

  const typeColor: Record<string, string> = {
    error: '#fee2e2',
    warning: '#fef9c3',
    info: '#dbeafe',
    success: '#dcfce7',
  };

  if (loading) return <div className="card">Loading...</div>;
  if (notFound || !alert) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Alert not found.</p>
        <Link href="/alerts" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Alerts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Alert Detail"
        subtitle={`ID: ${alert.id}`}
        actions={<Link href="/alerts" className="btn btn-outline">← Back to Alerts</Link>}
      />
      <div
        className="card"
        style={{
          borderLeft: '4px solid',
          borderLeftColor: typeColor[alert.type] ?? '#e5e7eb',
          maxWidth: '700px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{alert.title}</h2>
          <Badge label={alert.type === 'error' ? 'danger' : alert.type} />
          <Badge label={alert.read ? 'Read' : 'Unread'} />
        </div>
        <p style={{ color: '#374151', lineHeight: 1.8 }}>{alert.message}</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
          Module: <strong>{alert.module}</strong>
        </p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          Received: {new Date(alert.createdAt).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}
