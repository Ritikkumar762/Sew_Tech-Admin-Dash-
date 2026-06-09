'use client';
import { useAlerts } from '../_hooks/useAlerts';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { alerts, loading } = useAlerts();

  if (loading) return <div className="card">Loading...</div>;

  const alert = alerts.find((a) => a.id === id);
  if (!alert) return notFound();

  const typeColor: Record<string, string> = {
    error: '#fee2e2', warning: '#fef9c3', info: '#dbeafe', success: '#dcfce7',
  };

  return (
    <div>
      <PageHeader
        title="Alert Detail"
        subtitle={`ID: ${alert.id}`}
        actions={<Link href="/alerts" className="btn btn-outline">← Back to Alerts</Link>}
      />
      <div className="card" style={{ borderLeft: `4px solid`, borderLeftColor: typeColor[alert.type], maxWidth: '700px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{alert.title}</h2>
          <Badge label={alert.type === 'error' ? 'danger' : alert.type} />
          <Badge label={alert.read ? 'Read' : 'Unread'} />
        </div>
        <p style={{ color: '#374151', lineHeight: 1.8 }}>{alert.message}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          Received: {new Date(alert.createdAt).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}
