'use client';
import { useSpares } from '../_hooks/useSpares';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';

export default function InventoryPage() {
  const { spares, loading } = useSpares();
  const lowStock = spares.filter(s => s.status === 'Low Stock');
  const outOfStock = spares.filter(s => s.status === 'Out of Stock');

  return (
    <div>
      <PageHeader title="Inventory Management" subtitle="Monitor stock levels and trigger restocks" actions={<button className="btn btn-dark">+ Restock Order</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#b45309' }}>⚠️ Low Stock ({lowStock.length})</h2>
          {loading ? <p className="text-muted">Loading...</p> : lowStock.length === 0 ? <p className="text-muted">All items well stocked!</p> : lowStock.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.sku}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#b45309' }}>{s.stock} units</div>
                <Badge label="Low Stock" />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#b91c1c' }}>🚫 Out of Stock ({outOfStock.length})</h2>
          {loading ? <p className="text-muted">Loading...</p> : outOfStock.length === 0 ? <p className="text-muted">No items are out of stock!</p> : outOfStock.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.sku}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge label="Out of Stock" />
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#6366f1', cursor: 'pointer' }}>Reorder →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
