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
            <div className={styles.donutContainerBox}>
              <div className={styles.donutWrapper}>
                <div className={styles.donutCenter}>
                  <div className={styles.donutTotal}>{donut.centerValue}</div>
                  <div className={styles.donutSub}>{donut.centerLabel}</div>
                </div>
                <PieChart width={160} height={160}>
                  <Pie data={donut.data} cx={80} cy={80} innerRadius={55} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                    {donut.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              {/* absolute-positioned pills matching screenshot */}
              <div className={styles.donutPill} style={{ top: '12px', right: '12px' }}>40%</div>
              <div className={styles.donutPill} style={{ bottom: '12px', left: '12px' }}>60%</div>
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
              <AreaChart data={filter === 'module' ? trendModule : trendUserType} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorMechanic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorCustomer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 10000]} />
                <Tooltip 
                  labelFormatter={(label) => `${label} 2026`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} 
                />
                {filter === 'module' ? (
                  <>
                    <Area type="linear" dataKey="Spares" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorSpares)" dot={{ r: 4, fill: '#ef4444' }} name="ST Spares" />
                    <Area type="linear" dataKey="Mechanic" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorMechanic)" dot={{ r: 4, fill: '#10b981' }} name="ST Mechanic" />
                  </>
                ) : (
                  <>
                    <Area type="linear" dataKey="Customer" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorCustomer)" dot={{ r: 4, fill: '#3b82f6' }} name="Customer" />
                    <Area type="linear" dataKey="Mechanic" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorWarning)" dot={{ r: 4, fill: '#f59e0b' }} name="Mechanic" />
                  </>
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
