'use client';
import { useSparesOrders } from '../_hooks/useSpares';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { Order } from '@/types';

const columns: Column<Order>[] = [
  { key: 'id', label: 'Order ID', render: (r) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.id.toUpperCase()}</span> },
  { key: 'customerName', label: 'Customer' },
  { key: 'items', label: 'Items', render: (r) => `${r.items} items` },
  { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
  { key: 'createdAt', label: 'Date' },
];

export default function OrdersPage() {
  const { orders, loading, error } = useSparesOrders();
  const router = useRouter();
  return (
    <div>
      <PageHeader title="Orders Management" subtitle="Track and manage all spare part orders" actions={<button className="btn btn-dark">Export CSV</button>} />
      <div className="card">
        {loading && <p className="text-muted">Loading orders...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={orders} onRowClick={(r) => router.push(`/spares/${r.id}`)} />}
      </div>
    </div>
  );
}
