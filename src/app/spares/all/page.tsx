'use client';
import { useSpares } from '../_hooks/useSpares';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { Spare } from '@/types';

const columns: Column<Spare>[] = [
  { key: 'sku', label: 'SKU', render: (r) => <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{r.sku}</span> },
  { key: 'name', label: 'Name', render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock', render: (r) => <span style={{ fontWeight: 700 }}>{r.stock}</span> },
  { key: 'price', label: 'Price', render: (r) => `₹${r.price}` },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
];

export default function AllSparesPage() {
  const { spares, loading, error } = useSpares();
  const router = useRouter();
  return (
    <div>
      <PageHeader
        title="All Spares"
        subtitle="Complete catalog of spare parts"
        actions={<button className="btn btn-dark">+ Add New Spare</button>}
      />
      <div className="card">
        {loading && <p className="text-muted">Loading spares...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={spares} onRowClick={(r) => router.push(`/spares/${r.id}`)} />}
      </div>
    </div>
  );
}
