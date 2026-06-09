'use client';
import { useSupport } from '../_hooks/useSupport';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tickets, loading } = useSupport();
  if (loading) return <div className="card">Loading...</div>;
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return notFound();

  return (
    <div>
      <PageHeader title={ticket.subject} subtitle={`Ticket #${ticket.id.toUpperCase()}`} actions={<Link href="/support" className="btn btn-outline">← Back</Link>} />
      <div className="card" style={{ maxWidth: '700px' }}>
        {[['Raised By', ticket.raisedBy], ['Priority', ticket.priority], ['Status', ticket.status], ['Date', ticket.createdAt]].map(([k, v]) => (
          <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>{k}</span>
            <span style={{ fontWeight: 600 }}>{['Priority', 'Status'].includes(String(k)) ? <Badge label={String(v)} /> : String(v)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-dark">Mark Resolved</button>
          <button className="btn btn-outline">Assign Agent</button>
          <button className="btn btn-outline" style={{ color: '#ef4444' }}>Escalate</button>
        </div>
      </div>
    </div>
  );
}
