'use client';
import { useSpares } from '../_hooks/useSpares';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

export default function SparesAlertsPage() {
  const { spares, loading } = useSpares();
  const alertItems = spares.filter(s => s.status !== 'In Stock');
  return (
    <div>
      <PageHeader title="Requests & Alerts" subtitle="Inventory alerts that need your attention" />
      <div className="card">
        {loading ? <p className="text-muted">Loading...</p> : alertItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem' }}>✅</div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>All inventory is well-stocked!</p>
          </div>
        ) : alertItems.map(s => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: s.status === 'Out of Stock' ? '#fee2e2' : '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                {s.status === 'Out of Stock' ? '🚫' : '⚠️'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{s.name} <span style={{ fontFamily: 'monospace', color: '#6366f1', fontSize: '0.8rem' }}>({s.sku})</span></div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.category} · {s.stock} units remaining</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Badge label={s.status} />
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>Reorder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
