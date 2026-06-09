'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { DonutData, LineChartData } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

type Props = {
  revenueTrend: LineChartData[];
  revenueRisk: DonutData[];
  transactions: DonutData[];
};

export default function RevenueInsights({ revenueTrend, revenueRisk, transactions }: Props) {
  
  // Custom Dot for AreaChart
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <circle cx={cx} cy={cy} r={4} stroke="#f59e0b" strokeWidth={2} fill="white" />
    );
  };

  return (
    <div className={styles.grid2Col}>
      
      {/* ── Left Column ────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Revenue Trend */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Revenue Trend</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
              Revenue
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="linear" dataKey="Revenue" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorRev)" dot={<CustomDot />} activeDot={{ r: 6, fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category (Reusing Stock Category visual style as per screenshot) */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Revenue by Category</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
              Revenue/Category
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Revenue" fill="#3b82f6" radius={[4,4,0,0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Right Column ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Revenue at Risk Trend */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Revenue at Risk Trend</h2>
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>₹1,00,000</div>
            </div>
            <PieChart width={220} height={220}>
              <Pie data={revenueRisk} cx={110} cy={110} innerRadius={65} outerRadius={85} dataKey="value" startAngle={90} endAngle={-270}>
                {revenueRisk.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div style={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '2rem' }}>
            {revenueRisk.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
            20% <span style={{ color: '#6b7280', fontWeight: 500 }}>of Total Revenue at Risk</span>
          </div>
        </div>

        {/* Transaction Insights */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Transaction Insights</h2>
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>400</div>
              <div className={styles.donutSub}>Orders</div>
            </div>
            <PieChart width={220} height={220}>
              <Pie data={transactions} cx={110} cy={110} innerRadius={65} outerRadius={85} dataKey="value" startAngle={90} endAngle={-270}>
                {transactions.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div style={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '2rem' }}>
            {transactions.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4b5563' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
            Payment Success Rate - 75%
          </div>
        </div>

      </div>

    </div>
  );
}
