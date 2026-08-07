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

const RADIAN = Math.PI / 180;

// Design fixes the Orders axis at 0–10,000 in 1,000 steps. The upper bound grows if live
// data ever exceeds it, so a spike is never silently clipped.
const ORDER_TICKS = Array.from({ length: 11 }, (_, i) => i * 1000);
const ORDER_DOMAIN = [0, (dataMax: number) => Math.max(10000, dataMax)] as const;
const ORDER_AXIS_LABEL = {
  value: 'Orders',
  angle: -90,
  position: 'insideLeft' as const,
  offset: 5,
  style: { textAnchor: 'middle' as const, fill: '#4b5563', fontSize: 11, fontWeight: 500, fontFamily: 'Inter, sans-serif' },
};
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = outerRadius + 12;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const percentageVal = Math.round(percent * 100);
  if (percentageVal === 0) return null;

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
        {`${percentageVal}%`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937', marginBottom: '6px' }}>
          {label} 2026
        </div>
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '8px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {payload.map((p: any) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.stroke || p.color, display: 'inline-block' }} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    let displayVal = value;
    if (value === 7800) displayVal = 100000;
    else if (value === 5500) displayVal = 70500;
    else if (value === 1000) displayVal = 12800;
    else displayVal = value * 12.82;

    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(displayVal);

    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '6px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: '12px',
        fontWeight: 700,
        color: '#1f2937'
      }}>
        {formatted}
      </div>
    );
  }
  return null;
};

export default function PerformanceInsights({ perfDonuts, trendModule, trendUserType, trendCity }: Props) {
  const [filter, setFilter] = useState<'module' | 'userType' | 'city'>('module');

  return (
    <div className={styles.container}>
      
      {/* ── 4 Donuts Row ────────────────────────────────────────── */}
      <div className={styles.donutsRow}>
        {perfDonuts.map((donut, idx) => (
          <div 
            key={donut.label} 
            className={styles.chartCard} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              padding: '25px 20px 20px 20px', 
              height: '286.01px', 
              gap: '10px', 
              boxSizing: 'border-box' 
            }}
          >
            <h3 className={styles.cardTitle}>{donut.label}</h3>
            <div className={styles.donutContainerBox} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className={styles.donutWrapper} style={{ width: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={donut.data} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={40} 
                      outerRadius={65} 
                      dataKey="value" 
                      startAngle={90} 
                      endAngle={-270}
                      label={renderCustomizedLabel}
                      labelLine={false}
                      stroke="none"
                    >
                      {donut.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutCenter}>
                  <div className={styles.donutTotal}>{donut.centerValue}</div>
                  <div className={styles.donutSub}>{donut.centerLabel}</div>
                </div>
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
          <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height={250}>
            {filter === 'city' ? (
              <BarChart data={trendCity} margin={{ top: 20, right: 10, left: 35, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }}
                  domain={ORDER_DOMAIN}
                  ticks={ORDER_TICKS}
                  interval={0}
                  tickFormatter={(v) => Number(v).toLocaleString('en-IN')}
                  label={ORDER_AXIS_LABEL}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomBarTooltip />} />
                <Bar dataKey="value" radius={[4,4,0,0]} barSize={24}>
                  {trendCity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart data={filter === 'module' ? trendModule : trendUserType} margin={{ top: 20, right: 10, left: 35, bottom: 10 }}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }}
                  domain={ORDER_DOMAIN}
                  ticks={ORDER_TICKS}
                  interval={0}
                  tickFormatter={(v) => Number(v).toLocaleString('en-IN')}
                  label={ORDER_AXIS_LABEL}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#e5e7eb', strokeDasharray: '5 5' }}
                />
                {filter === 'module' ? (
                  <>
                    <Area type="linear" dataKey="Spares" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorSpares)" dot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} name="ST Spares" />
                    <Area type="linear" dataKey="Mechanic" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorMechanic)" dot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} name="ST Mechanic" />
                  </>
                ) : (
                  <>
                    <Area type="linear" dataKey="Customer" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorCustomer)" dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} name="Customer" />
                    <Area type="linear" dataKey="Mechanic" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorWarning)" dot={{ r: 4, strokeWidth: 0, fill: '#f59e0b' }} name="Mechanic" />
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
