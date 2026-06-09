'use client';
import { useSparesOrders } from '../_hooks/useSpares';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

export default function RequestsPage() {
  const { orders, loading } = useSparesOrders();
  const pending = orders.filter(o => o.status === 'Confirmed');

  return (
    <div>
      <PageHeader title="Order Requests" subtitle="Pending orders awaiting processing" actions={<button className="btn btn-dark">Process All</button>} />
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Pending Requests ({pending.length})</h2>
        {loading && <p className="text-muted">Loading...</p>}
        {!loading && pending.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{o.customerName}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Order #{o.id.toUpperCase()} · {o.items} items · {o.createdAt}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 700 }}>₹{o.amount.toLocaleString('en-IN')}</span>
              <Badge label={o.status} />
              <button className="btn btn-dark" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Process</button>
            </div>
          </div>
        ))}
        {!loading && pending.length === 0 && <p className="text-muted">No pending requests!</p>}
      </div>
    </div>
  );
}
