'use client';

import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { FunnelStage, DonutData, BarChartData, ReasonChip } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

type Props = {
  funnel: FunnelStage[];
  orderOutcome: DonutData[];
  orderTrend: BarChartData[];
  cancelReasons: ReasonChip[];
};

export default function OrderInsights({ funnel, orderOutcome, orderTrend, cancelReasons }: Props) {
  
  // Custom Funnel Tick
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const stage = funnel.find(s => s.name === payload.value);
    if (!stage) return null;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={12} fontWeight={500}>{stage.name}</text>
        <text x={0} y={0} dy={40} textAnchor="middle" fill="#111827" fontSize={24} fontWeight={800}>{stage.value}</text>
        <text x={0} y={0} dy={60} textAnchor="middle" fill={stage.badge || '#6b7280'} fontSize={10} fontWeight={600}>{stage.subtitle}</text>
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Order Funnel ─────────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Order Funnel</h2>
          <select className={styles.select}><option>Funnel View</option></select>
        </div>
        <div style={{ height: 280, marginTop: '2rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={funnel} margin={{ top: 20, right: 30, left: 30, bottom: 60 }}>
              <defs>
                <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={true} horizontal={false} stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={<CustomXAxisTick />} axisLine={false} tickLine={false} interval={0} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="none" fill="url(#colorFunnel)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.grid2ColEqual}>
        
        {/* ── Order Outcome Overview ─────────────────────────── */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Order Outcome Overview</h2>
          <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>400</div>
              <div className={styles.donutSub}>Orders</div>
            </div>
            <PieChart width={200} height={200}>
              <Pie data={orderOutcome} cx={100} cy={100} innerRadius={60} outerRadius={80} dataKey="value">
                {orderOutcome.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
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
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', top: -30 }} />
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
