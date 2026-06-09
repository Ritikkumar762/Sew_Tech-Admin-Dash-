'use client';
import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart,
  BarChart, Bar,
} from 'recharts';
import { DonutMetric, LineChartData, BarChartData } from '../_hooks/useDashboard';
import styles from './Insights.module.css';

type Props = {
  perfDonuts: DonutMetric[];
  trendModule: LineChartData[];
  trendUserType: LineChartData[];
  trendCity: BarChartData[];
};

export default function PerformanceInsights({ perfDonuts, trendModule, trendUserType, trendCity }: Props) {
  const [filter, setFilter] = useState<'module' | 'userType' | 'city'>('module');

  return (
    <div className={styles.container}>
      
      {/* ── 4 Donuts Row ────────────────────────────────────────── */}
      <div className={styles.donutsRow}>
        {perfDonuts.map((donut, idx) => (
          <div key={donut.label} className={styles.chartCard}>
            <h3 className={styles.cardTitle}>{donut.label}</h3>
            <div className={styles.donutWrapper}>
              <PieChart width={160} height={160}>
                <Pie data={donut.data} cx={80} cy={80} innerRadius={55} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                  {donut.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                {/* Labels outside */}
                <Tooltip />
              </PieChart>
              <div className={styles.donutCenter}>
                <div className={styles.donutTotal}>{donut.centerValue}</div>
                <div className={styles.donutSub}>{donut.centerLabel}</div>
              </div>
              <div className={styles.donutPcts}>
                <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '0.7rem', color: '#6b7280' }}>40%</div>
                <div style={{ position: 'absolute', bottom: '10px', left: '20px', fontSize: '0.7rem', color: '#6b7280' }}>60%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue Trend Chart ─────────────────────────────────── */}
      <div className={styles.trendCard}>
        <div className={styles.trendHeader}>
          <h2 className={styles.cardTitle}>Revenue Trend</h2>
          <div className={styles.filters}>
            <select className={styles.select}><option>Time Period</option></select>
            <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="module">By Module</option>
              <option value="userType">By User Type</option>
              <option value="city">By City</option>
            </select>
          </div>
        </div>

        <div className={styles.trendChart}>
          <ResponsiveContainer width="100%" height={250}>
            {filter === 'city' ? (
              <BarChart data={trendCity} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 10000]} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} barSize={24} />
              </BarChart>
            ) : (
              <LineChart data={filter === 'module' ? trendModule : trendUserType} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 10000]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                {filter === 'module' ? (
                  <>
                    <Line type="linear" dataKey="Spares" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#ef4444' }} name="ST Spares" />
                    <Line type="linear" dataKey="Mechanic" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#10b981' }} name="ST Mechanic" />
                  </>
                ) : (
                  <>
                    <Line type="linear" dataKey="Customer" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#3b82f6' }} name="Customer" />
                    <Line type="linear" dataKey="Mechanic" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#f59e0b' }} name="Mechanic" />
                  </>
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
