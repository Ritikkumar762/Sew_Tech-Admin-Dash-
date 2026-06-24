'use client';

import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { FunnelStage, DonutData, BarChartData, ReasonChip } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const pillW = 34;
  const pillH = 18;

  return (
    <g>
      <rect 
        x={x - pillW / 2} 
        y={y - pillH / 2 + 1} 
        width={pillW} 
        height={pillH} 
        rx={3} 
        fill="rgba(0,0,0,0.1)" 
      />
      <rect 
        x={x - pillW / 2} 
        y={y - pillH / 2} 
        width={pillW} 
        height={pillH} 
        rx={3} 
        fill="#ffffff" 
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minWidth: '180px',
        position: 'relative'
      }}>
        {/* Title */}
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', marginBottom: '8px' }}>
          {label} 2026
        </div>
        
        {/* Separator */}
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '12px' }} />
        
        {/* Data Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {payload.map((item: any) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', gap: '16px' }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>{item.name}:</span>
              <span style={{ color: '#111827', fontWeight: 700 }}>{item.value}</span>
            </div>
          ))}
        </div>
        
        {/* View Orders Link */}
        <div>
          <a href="#" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline', fontWeight: 600 }}>
            View Orders
          </a>
        </div>
        
        {/* Triangle arrow indicator on the left side of the tooltip */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '-6px',
          width: '12px',
          height: '12px',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          transform: 'rotate(45deg)'
        }} />
      </div>
    );
  }
  return null;
};

const renderLegendText = (value: string, entry: any) => {
  const { color } = entry;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '16px', color: '#4b5563', fontWeight: 600, fontSize: '0.8rem' }}>
      <span style={{ 
        width: '24px', 
        height: '12px', 
        borderRadius: '6px', 
        backgroundColor: color, 
        position: 'relative', 
        display: 'inline-block',
        opacity: 0.9
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: '2px',
          left: value === 'Cancellation' ? '2px' : '14px',
          transition: 'all 0.2s'
        }} />
      </span>
      <span>{value}</span>
    </span>
  );
};

type Props = {
  funnel: FunnelStage[];
  orderOutcome: DonutData[];
  orderTrend: BarChartData[];
  cancelReasons: ReasonChip[];
};

export default function OrderInsights({ funnel, orderOutcome, orderTrend, cancelReasons }: Props) {
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Order Funnel ─────────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Order Funnel</h2>
          <select className={styles.select}><option>Funnel View</option></select>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'white',
          marginTop: '1.5rem',
          height: '240px',
          position: 'relative'
        }}>
          {/* Vertical dividers & text */}
          {funnel.map((stage, idx) => (
            <div 
              key={stage.name} 
              style={{ 
                padding: '24px 20px', 
                borderRight: idx < 4 ? '1px solid #e5e7eb' : 'none',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                zIndex: 2,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', width: '100%' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{stage.name}</span>
                {idx === 0 ? (
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    ▲ 5% <span style={{ color: '#6b7280', fontWeight: 500 }}>(L7D)</span>
                  </span>
                ) : (
                  <span style={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 700, 
                    padding: '2px 4px', 
                    borderRadius: '4px', 
                    background: idx === 1 || idx === 2 ? '#d1fae5' : idx === 3 ? '#fef3c7' : '#fee2e2',
                    color: idx === 1 || idx === 2 ? '#065f46' : idx === 3 ? '#92400e' : '#991b1b',
                    whiteSpace: 'nowrap'
                  }}>
                    {stage.subtitle}
                  </span>
                )}
              </div>
              <div>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>{stage.value}</span>
              </div>
            </div>
          ))}

          {/* AreaChart Wave rendered absolutely at the bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', zIndex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={[
                  { x: 0, val: 109.32 },
                  { x: 0.8, val: 109.32 },
                  { x: 1.2, val: 86.87 },
                  { x: 1.8, val: 86.87 },
                  { x: 2.2, val: 54.66 },
                  { x: 2.8, val: 54.66 },
                  { x: 3.2, val: 32.21 },
                  { x: 3.8, val: 32.21 },
                  { x: 4.2, val: 16.59 },
                  { x: 5.0, val: 16.59 }
                ]} 
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="x" type="number" hide domain={[0, 5]} padding={{ left: 0, right: 0 }} allowDataOverflow />
                <YAxis type="number" hide domain={[0, 120]} />
                <defs>
                  <linearGradient id="colorFunnel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8CBAF0" />
                    <stop offset="20%" stopColor="#8CBAF0" />
                    <stop offset="20%" stopColor="#0460CA" />
                    <stop offset="40%" stopColor="#0460CA" />
                    <stop offset="40%" stopColor="#034B9E" />
                    <stop offset="60%" stopColor="#034B9E" />
                    <stop offset="60%" stopColor="#023A7A" />
                    <stop offset="80%" stopColor="#023A7A" />
                    <stop offset="80%" stopColor="#001B3B" />
                    <stop offset="100%" stopColor="#001B3B" />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="none" fill="url(#colorFunnel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.grid2ColEqual}>
        
        {/* ── Order Outcome Overview ─────────────────────────── */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Order Outcome Overview</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%', marginTop: '0.5rem' }}>
            {/* Donut Chart */}
            <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className={styles.donutCenter}>
                <div className={styles.donutTotal}>400</div>
                <div className={styles.donutSub}>Orders</div>
              </div>
              <PieChart width={260} height={260}>
                <Pie 
                  data={orderOutcome} 
                  cx={130} 
                  cy={130} 
                  innerRadius={50} 
                  outerRadius={70} 
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {orderOutcome.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Side Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orderOutcome.map((entry) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color, display: 'inline-block' }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', width: '100%' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>Order Return Rate - 20%</div>
            <a href="#" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>View Return Reasons</a>
          </div>
        </div>

        {/* ── Orders Trend ─────────────────────────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Orders Trend</h2>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip 
                  trigger="click" 
                  wrapperStyle={{ pointerEvents: 'auto' }} 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'transparent' }} 
                />
                <Legend 
                  iconSize={0} 
                  formatter={renderLegendText} 
                  align="right" 
                  verticalAlign="top" 
                  wrapperStyle={{ 
                    fontSize: '11px', 
                    paddingBottom: '16px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'nowrap',
                    top: -30,
                    right: 0
                  }} 
                />
                <Bar dataKey="Total Orders" fill="#3b82f6" radius={[4,4,0,0]} barSize={12} />
                <Bar dataKey="Return" fill="#f87171" radius={[4,4,0,0]} barSize={12} />
                <Bar dataKey="Replacement" fill="#fbbf24" radius={[4,4,0,0]} barSize={12} />
                <Bar dataKey="Cancellation" fill="#9ca3af" radius={[4,4,0,0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Cancellation & Return Reasons ────────────────────── */}
      <div className={styles.grid2ColEqual}>
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Top Cancellation Reasons <span style={{color:'#3b82f6'}}>↗</span></h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {cancelReasons.map((reason, i) => (
              <div key={i} style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                {reason.label} <span style={{ marginLeft: '4px', color: '#111827', fontWeight: 700 }}>{reason.count}</span> <span style={{ color: '#94a3b8' }}>({reason.percentage})</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Top Return Reasons <span style={{color:'#3b82f6'}}>↗</span></h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {cancelReasons.map((reason, i) => (
              <div key={i} style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                {reason.label} <span style={{ marginLeft: '4px', color: '#111827', fontWeight: 700 }}>{reason.count}</span> <span style={{ color: '#94a3b8' }}>({reason.percentage})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
