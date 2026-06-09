'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Badge from '@/components/ui/Badge';
import { InventoryItem } from '../_hooks/useDashboard';

type Props = { inventory: InventoryItem[] };

export default function InventoryInsights({ inventory }: Props) {
  const inStock = inventory.filter(i => i.status === 'In Stock').length;
  const lowStock = inventory.filter(i => i.status === 'Low Stock').length;
  const outOfStock = inventory.filter(i => i.status === 'Out of Stock').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>✅ In Stock</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{inStock}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>SKUs well stocked</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>⚠️ Low Stock</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{lowStock}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Below reorder level</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>🚫 Out of Stock</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{outOfStock}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Urgent restock needed</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Stock Level Chart */}
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.05rem' }}>Stock Levels vs Reorder Level</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inventory} margin={{ top: 5, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="sku" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="stock" name="Current Stock" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="reorderLevel" name="Reorder Level" fill="#fca5a5" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Table */}
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.05rem' }}>Critical Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {inventory.filter(i => i.status !== 'In Stock').map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f9fafb' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>{item.sku}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <Badge label={item.status} />
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{item.stock} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
