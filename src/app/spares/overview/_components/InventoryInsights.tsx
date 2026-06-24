'use client';

import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { DonutData, BarChartData, StockAlert, DeadStock } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

type Props = {
  invDonut: DonutData[];
  stockCategory: BarChartData[];
  stockAlerts: StockAlert[];
  deadStock: DeadStock[];
};

export default function InventoryInsights({ invDonut, stockCategory, stockAlerts, deadStock }: Props) {
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Top Row ───────────────────────────────────────────── */}
      <div className={styles.grid2ColEqual}>
        
        {/* Fast vs Slow Moving */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Fast vs Slow Moving Spares</h2>
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>
                {invDonut.reduce((acc, curr) => acc + curr.value, 0)}
              </div>
              <div className={styles.donutSub}>Spares</div>
            </div>
            <PieChart width={220} height={220}>
              <Pie data={invDonut} cx={110} cy={110} innerRadius={65} outerRadius={85} dataKey="value" startAngle={90} endAngle={-270}>
                {invDonut.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          {/* Custom legend */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {invDonut.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
              Slow-Moving Spares - {invDonut.find(d => d.name.includes('Slow'))?.value ?? 40}%
            </div>
            <a href="#" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>Download List</a>
          </div>
        </div>

        {/* Stock by Category */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Stock by Category</h2>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockCategory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', top: -30 }} />
                <Bar dataKey="In Stock" fill="#3b82f6" radius={[4,4,0,0]} barSize={20} />
                <Bar dataKey="Low-Stock" fill="#ef4444" radius={[4,4,0,0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Bottom Row (Lists) ───────────────────────────────── */}
      <div className={styles.grid2ColEqual}>
        
        {/* Stock Alerts */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Stock Alerts</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
            <span>Spare Name ↓↑</span>
            <span>Stock Status ↓↑</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {stockAlerts.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧵</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.sku}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.status === 'Out of Stock' ? (
                    <span style={{ color: '#ef4444', background: '#fef2f2', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>⚠️ Out of Stock</span>
                  ) : (
                    <span style={{ color: '#f59e0b', background: '#fef3c7', padding: '0.25rem 1rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{item.status}</span>
                  )}
                  <button style={{ background: '#111827', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                    Update ⎘
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Stock */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Dead Stock</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
            <span>Spare Name ↓↑</span>
            <span>Idle Since ↓↑</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {deadStock.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧵</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.sku}</div>
                  </div>
                </div>
                <div style={{ color: '#3b82f6', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {item.idleDays} Days
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
