'use client';
import { useSupport } from './_hooks/useSupport';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { SupportTicket } from '@/types';

const columns: Column<SupportTicket>[] = [
  { key: 'id', label: 'Ticket ID', render: (r) => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>#{r.id.toUpperCase()}</span> },
  { key: 'subject', label: 'Subject', render: (r) => <span style={{ fontWeight: 500 }}>{r.subject}</span> },
  { key: 'raisedBy', label: 'Raised By' },
  { key: 'priority', label: 'Priority', render: (r) => <Badge label={r.priority} /> },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
  { key: 'createdAt', label: 'Date' },
];

export default function SupportPage() {
  const { tickets, loading, error } = useSupport();
  const router = useRouter();
  return (
    <div>
      <PageHeader title="Support & Disputes" subtitle="Manage customer support tickets and disputes" actions={<button className="btn btn-dark">+ New Ticket</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>Total</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{tickets.length}</div></div>
        <div className="card"><div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>Open</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{tickets.filter(t => t.status === 'Open').length}</div></div>
        <div className="card"><div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>In Progress</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{tickets.filter(t => t.status === 'In Progress').length}</div></div>
        <div className="card"><div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Resolved</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{tickets.filter(t => t.status === 'Resolved').length}</div></div>
      </div>
      <div className="card">
        {loading && <p className="text-muted">Loading tickets...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={tickets} onRowClick={(r) => router.push(`/support/${r.id}`)} />}
      </div>
    </div>
  );
}
