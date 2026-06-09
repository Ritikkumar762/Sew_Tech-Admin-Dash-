'use client';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, YAxis } from 'recharts';
import { FunnelStage, PieSlice, TrendPoint } from '../_hooks/useDashboard';
import styles from './OrderInsights.module.css';

type Props = {
  funnel: FunnelStage[];
  pie: PieSlice[];
  trend: TrendPoint[];
};

export default function OrderInsights({ funnel, pie, trend }: Props) {
  const total = pie.reduce((s, p) => s + p.value, 0);
  const completed = pie.find(p => p.name === 'Completed');
  const returnRate = pie.find(p => p.name === 'Return');

  return (
    <div className={styles.container}>
      {/* Funnel Chart */}
      <div className={styles.funnelCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Order Funnel</h2>
          <select className={styles.select}><option>Funnel View</option></select>
        </div>

        {/* Funnel Stage Labels */}
        <div className={styles.funnelLabels}>
          {funnel.map(stage => (
            <div key={stage.name} className={styles.funnelLabel}>
              <div className={styles.funnelStageName}>{stage.name}</div>
              {stage.rateLabel && <span className={styles.rateLabel}>{stage.rateLabel}</span>}
              {stage.onSchedule && <span className={styles.onSchedule} style={{ color: stage.onScheduleColor }}>On-Schedule: {stage.onSchedule}</span>}
              <div className={styles.funnelValue}>{stage.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Funnel Visual */}
        <div className={styles.funnelChart}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={funnel} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="funnelGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="30%" stopColor="#3b82f6" />
                  <stop offset="60%" stopColor="#1d4ed8" />
                  <stop offset="85%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="none" fill="url(#funnelGrad)" fillOpacity={1} />
              <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Orders']} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomGrid}>
        {/* Donut Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.cardTitle}>Order Outcome Overview</h2>
          <div className={styles.donutWrapper}>
            <PieChart width={200} height={200}>
              <Pie data={pie} cx={100} cy={100} innerRadius={62} outerRadius={82} paddingAngle={2} dataKey="value">
                {pie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>{total}</div>
              <div className={styles.donutLabel}>Orders</div>
            </div>
          </div>
          <div className={styles.legend}>
            {pie.map(p => (
              <div key={p.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: p.color }} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          <div className={styles.returnRate}>
            Order Return Rate - {Math.round(((returnRate?.value ?? 0) / total) * 100)}%
          </div>
          <div className={styles.returnLink}>View Return Reasons</div>
        </div>

        {/* Bar Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Orders Trend</h2>
            <div className={styles.trendLegend}>
              {[{ label: 'Total Orders', color: '#3b82f6' }, { label: 'Return', color: '#ef4444' }, { label: 'Replacement', color: '#f59e0b' }, { label: 'Cancellation', color: '#9ca3af' }].map(l => (
                <span key={l.label} className={styles.trendLegendItem}>
                  <span className={styles.trendDot} style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 100]} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="TotalOrders" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="Return" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="Replacement" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="Cancellation" fill="#9ca3af" radius={[3, 3, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
