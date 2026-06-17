'use client';
import { useMechanics } from './_hooks/useMechanics';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { Mechanic } from '@/types';

const columns: Column<Mechanic>[] = [
  { key: 'name', label: 'Name', render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: 'location', label: 'Location' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'phone', label: 'Phone' },
  { key: 'rating', label: 'Rating', render: (r) => <span>⭐ {r.rating}</span> },
  { key: 'totalJobs', label: 'Jobs Done' },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
];

export default function MechanicPage() {
  const { mechanics, loading, error } = useMechanics();
  const router = useRouter();
  return (
    <div>
      <PageHeader title="Sewtech Mechanic" subtitle="Manage all registered mechanics" actions={<button className="btn btn-dark">+ Add Mechanic</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>Total Mechanics</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{mechanics.length}</div></div>
        <div className="card"><div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Available</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{mechanics.filter(m => m.status === 'Available').length}</div></div>
        <div className="card"><div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>Busy / Offline</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{mechanics.filter(m => m.status !== 'Available').length}</div></div>
      </div>
      <div className="card">
        {loading && <p className="text-muted">Loading mechanics...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={mechanics} onRowClick={(r) => router.push(`/mechanic/${r.id}`)} />}
      </div>
    </div>
  );
}
