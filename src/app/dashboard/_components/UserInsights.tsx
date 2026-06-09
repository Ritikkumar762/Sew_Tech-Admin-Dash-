'use client';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DonutMetric, LineChartData } from '../_hooks/useDashboard';
import styles from './Insights.module.css';

type Props = {
  userDonuts: DonutMetric[];
  newRepeat: LineChartData[];
};

export default function UserInsights({ userDonuts, newRepeat }: Props) {
  return (
    <div className={styles.container}>
      
      {/* ── 3 Donuts Row ────────────────────────────────────────── */}
      <div className={styles.donutsRow}>
        {userDonuts.map((donut) => (
          <div key={donut.label} className={styles.chartCard} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h3 className={styles.cardTitle}>{donut.label}</h3>
              <div className={styles.donutWrapper}>
                <div className={styles.donutCenter}>
                  <div className={styles.donutTotal}>{donut.centerValue}</div>
                  <div className={styles.donutSub}>{donut.centerLabel}</div>
                </div>
                <PieChart width={160} height={160}>
                  <Pie data={donut.data} cx={80} cy={80} innerRadius={50} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                    {donut.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div style={{ flex: 1, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {donut.data.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#4b5563' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── New vs Repeat Trend ─────────────────────────────────── */}
      <div className={styles.trendCard}>
        <div className={styles.trendHeader}>
          <h2 className={styles.cardTitle}>New User vs Repeat Users</h2>
          <div className={styles.filters}>
            <select className={styles.select}><option>Time Period</option></select>
          </div>
        </div>

        <div className={styles.trendChart}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={newRepeat} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 10000]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="linear" dataKey="New" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#newGrad)" dot={{ r: 4, fill: '#f59e0b' }} />
              <Area type="linear" dataKey="Repeat" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="url(#repGrad)" dot={{ r: 4, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
