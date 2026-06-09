'use client';
import Link from 'next/link';
import { useSpares, useSparesOrders } from './_hooks/useSpares';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';

export default function SparesPage() {
  const { spares } = useSpares();
  const { orders } = useSparesOrders();
  return (
    <div>
      <PageHeader title="Sewtech Spares" subtitle="Manage spare parts inventory and orders" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Spares" value={spares.length} trend="vs last month" trendUp={true} />
        <StatCard label="Low Stock" value={spares.filter(s => s.status === 'Low Stock').length} trendUp={false} trend="Needs restock" />
        <StatCard label="Out of Stock" value={spares.filter(s => s.status === 'Out of Stock').length} trendUp={false} trend="Urgent" />
        <StatCard label="Total Orders" value={orders.length} trend="this week" trendUp={true} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'Overview', path: '/spares/overview', icon: '📊', desc: 'Summary and insights' },
          { label: 'All Spares', path: '/spares/all', icon: '🔩', desc: 'Browse the full catalog' },
          { label: 'Inventory', path: '/spares/inventory', icon: '📦', desc: 'Stock and reorder management' },
          { label: 'Orders', path: '/spares/orders', icon: '🛒', desc: 'Customer order tracking' },
          { label: 'Requests', path: '/spares/requests', icon: '📋', desc: 'Pending order requests' },
          { label: 'Alerts', path: '/spares/alerts', icon: '⚠️', desc: 'Inventory alerts' },
        ].map(item => (
          <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ fontSize: '2rem' }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{item.label}</div>
                <div className="text-muted text-small">{item.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
