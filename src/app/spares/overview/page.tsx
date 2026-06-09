'use client';
import { useSpares, useSparesOrders } from '../_hooks/useSpares';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';

export default function SparesOverviewPage() {
  const { spares, loading } = useSpares();
  const { orders } = useSparesOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div>
      <PageHeader title="Spares Overview" subtitle="Summary of inventory performance and order metrics" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total SKUs" value={spares.length} trend="2 added this week" trendUp={true} />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} trend="12% vs last week" trendUp={true} />
        <StatCard label="Orders Delivered" value={delivered} trend="80% success rate" trendUp={true} />
        <StatCard label="Low/Out Stock" value={spares.filter(s => s.status !== 'In Stock').length} trend="Needs attention" trendUp={false} />
      </div>

      {!loading && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Inventory Status</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['SKU', 'Name', 'Category', 'Stock', 'Price', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spares.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#6366f1' }}>{s.sku}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.category}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.stock}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹{s.price}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><Badge label={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
