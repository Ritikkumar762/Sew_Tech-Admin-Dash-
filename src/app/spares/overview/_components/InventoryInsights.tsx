'use client';

import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DonutData, BarChartData, StockAlert, DeadStock } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

type Props = {
  invDonut: DonutData[];
  stockCategory: BarChartData[];
  stockAlerts: StockAlert[];
  deadStock: DeadStock[];
};

const RADIAN = Math.PI / 180;
const STOCK_TICKS = Array.from({ length: 11 }, (_, i) => i * 10);

// The donut values are already percentages, so read `value` directly rather than
// deriving it from recharts' `percent`.
const renderCustomizedLabel = ({
  cx, cy, midAngle, outerRadius, value
}: any) => {
  const radius = outerRadius + 12;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!Number(value)) return null;

  const pillW = 34;
  const pillH = 18;

  return (
    <g>
      <rect x={x - pillW / 2} y={y - pillH / 2 + 1} width={pillW} height={pillH} rx={5} fill="rgba(0,0,0,0.08)" />
      <rect x={x - pillW / 2} y={y - pillH / 2} width={pillW} height={pillH} rx={5} fill="#ffffff" stroke="#e5e7eb" strokeWidth={0.5} />
      <text
        x={x}
        y={y}
        fill="#1f2937"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '10px', fontWeight: 700 }}
      >
        {`${value}%`}
      </text>
    </g>
  );
};

type StockTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: unknown }>;
};

// Design shows the hovered bar's value on its own in a small white pill.
const StockTooltip = ({ active, payload }: StockTooltipProps) => {
  if (!active || !payload?.length) return null;
  const entry = payload.find((p) => Number(p.value) > 0) ?? payload[0];
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      padding: '0.375rem 0.75rem',
      fontSize: '0.8125rem',
      fontWeight: 700,
      color: '#111827'
    }}>
      {Number(entry.value)}
    </div>
  );
};

export default function InventoryInsights({ invDonut, stockCategory, stockAlerts, deadStock }: Props) {
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Top Row ───────────────────────────────────────────── */}
      <div className={styles.inventoryGrid}>
        
        {/* Fast vs Slow Moving */}
        <div className={styles.card} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          height: '326px',
          padding: '25px 20px 20px 20px',
          boxSizing: 'border-box',
          gap: '10px'
        }}>
          <h2 className={styles.cardTitle} style={{ margin: 0 }}>Fast vs Slow Moving Spares</h2>
          
          {/* One light panel holds the donut, legend and footer, as in the design. */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '13.79px',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '16px' }}>
              <div className={styles.donutOverflow} style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '151.01px',
                height: '151.01px',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>400</div>
                  <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Orders</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={invDonut} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={36} 
                      outerRadius={56} 
                      dataKey="value" 
                      startAngle={90} 
                      endAngle={-270}
                      label={renderCustomizedLabel}
                      labelLine={false}
                      stroke="none"
                    >
                      {invDonut.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend — largest share first, matching the design's order */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[...invDonut].sort((a, b) => b.value - a.value).map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                Order Return Rate - 20%
              </div>
              <a href="#" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'underline', fontWeight: 600 }}>Download List</a>
            </div>
          </div>
        </div>

        {/* Stock by Category */}
        <div className={styles.card} style={{ 
          height: '326px', 
          padding: '20px', 
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className={styles.cardHeaderRow} style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Stock by Category</h2>
            {/* Legend lives beside the title in the design, not inside the plot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {[{ name: 'In Stock', color: '#3b82f6' }, { name: 'Low-Stock', color: '#ef4444' }].map(s => (
                <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <div style={{ height: '257px', width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
              <BarChart data={stockCategory} margin={{ top: 10, right: 14, left: 18, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} interval={0} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  width={56}
                  domain={[0, 100]}
                  ticks={STOCK_TICKS}
                  interval={0}
                  label={{ value: 'Amount (In Rupees)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={StockTooltip} />
                <Bar dataKey="In Stock" fill="#3b82f6" radius={[4,4,0,0]} barSize={14} />
                <Bar dataKey="Low-Stock" fill="#ef4444" radius={[4,4,0,0]} barSize={14} />
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
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>
            <span>Spare Name ↓↑</span>
            <span>Stock Status ↓↑</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.25rem', maxHeight: '260px', overflowY: 'auto' }}>
            {stockAlerts.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '0.875rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src="/sewing_machine _needle.svg" alt="Spare" style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.sku}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {item.status === 'Out of Stock' ? (
                    <span style={{ color: '#ef4444', background: '#fef2f2', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>⚠️ Out of Stock</span>
                  ) : (
                    <span style={{ color: '#f59e0b', background: '#fef3c7', padding: '0.25rem 1rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{item.status}</span>
                  )}
                  <button style={{ 
                    background: '#111827', 
                    color: 'white', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    Update
                    <img 
                      src="/refresh_logo.svg" 
                      alt="Link" 
                      style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} 
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Stock */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Dead Stock</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>
            <span>Spare Name ↓↑</span>
            <span>Idle Since ↓↑</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.25rem', maxHeight: '260px', overflowY: 'auto' }}>
            {deadStock.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '0.875rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src="/sewing_machine _needle.svg" alt="Spare" style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
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
