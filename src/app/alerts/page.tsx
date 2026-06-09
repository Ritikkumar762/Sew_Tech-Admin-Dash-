'use client';
import { useAlerts } from './_hooks/useAlerts';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Alert } from '@/types';

const columns: Column<Alert>[] = [
  { key: 'title', label: 'Title' },
  { key: 'message', label: 'Message' },
  { key: 'type', label: 'Type', render: (row) => <Badge label={row.type === 'error' ? 'danger' : row.type} /> },
  { key: 'read', label: 'Status', render: (row) => <Badge label={row.read ? 'Read' : 'Unread'} /> },
  { key: 'createdAt', label: 'Time', render: (row) => new Date(row.createdAt).toLocaleString('en-IN') },
];

export default function AlertsPage() {
  const { alerts, loading, error, markRead } = useAlerts();
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="System notifications and warnings across all modules"
        actions={
          <button className="btn btn-dark" onClick={() => {}}>
            Mark All Read
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{color:'#6b7280',fontSize:'0.8rem',fontWeight:600}}>Total</div><div style={{fontSize:'1.5rem',fontWeight:700}}>{alerts.length}</div></div>
        <div className="card"><div style={{color:'#ef4444',fontSize:'0.8rem',fontWeight:600}}>Errors</div><div style={{fontSize:'1.5rem',fontWeight:700}}>{alerts.filter(a=>a.type==='error').length}</div></div>
        <div className="card"><div style={{color:'#f59e0b',fontSize:'0.8rem',fontWeight:600}}>Warnings</div><div style={{fontSize:'1.5rem',fontWeight:700}}>{alerts.filter(a=>a.type==='warning').length}</div></div>
        <div className="card"><div style={{color:'#3b82f6',fontSize:'0.8rem',fontWeight:600}}>Unread</div><div style={{fontSize:'1.5rem',fontWeight:700}}>{alerts.filter(a=>!a.read).length}</div></div>
      </div>

      <div className="card">
        {loading && <p className="text-muted">Loading alerts...</p>}
        {error && <p style={{color:'#ef4444'}}>{error}</p>}
        {!loading && !error && (
          <DataTable
            columns={columns}
            data={alerts}
            onRowClick={(row) => {
              markRead(row.id);
              router.push(`/alerts/${row.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
