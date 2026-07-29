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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = outerRadius + 8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const percentageVal = Math.round(percent * 100);
  if (percentageVal === 0) return null;

  return (
    <g>
      <rect
        x={x - 10}
        y={y - 6}
        width={20}
        height={12}
        rx={3}
        fill="white"
        stroke="#e5e7eb"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 0.5}
        fill="#374151"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="7px"
        fontWeight="bold"
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

export default function UserInsights({ userDonuts, newRepeat }: Props) {
  return (
    <div className={styles.container}>
      
      {/* ── 3 Donuts Row ────────────────────────────────────────── */}
      <div className={styles.userDonutsRow}>
        {userDonuts.map((donut) => (
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
            
            <div className={styles.userDonutContainerBox}>
              <div className={styles.userDonutWrapper} style={{ width: 140, height: 140, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={donut.data} 
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
                      {donut.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px',
                        padding: '6px 10px'
                      }}
                      itemStyle={{
                        color: '#1f2937',
                        fontWeight: 500
                      }}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutCenter}>
                  <div className={styles.donutTotal} style={{ fontSize: '0.9rem', fontWeight: 800 }}>{donut.centerValue}</div>
                  <div className={styles.donutSub} style={{ fontSize: '0.6rem' }}>{donut.centerLabel}</div>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '4px' }}>
                {donut.data.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
                    {d.name}
                  </div>
                ))}
              </div>
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
          <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height={250}>
            <AreaChart data={newRepeat} margin={{ top: 20, right: 10, left: 35, bottom: 10 }}>
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
              <XAxis dataKey="name" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }} 
                tickFormatter={(v) => v.toLocaleString('en-IN')}
                label={{ 
                  value: 'Orders', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 5, 
                  style: { textAnchor: 'middle', fill: '#4b5563', fontSize: 11, fontWeight: 500, fontFamily: 'Inter, sans-serif' } 
                }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#e5e7eb', strokeDasharray: '5 5' }}
              />
              <Area type="linear" dataKey="New" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#newGrad)" dot={{ r: 4, strokeWidth: 0, fill: '#f59e0b' }} />
              <Area type="linear" dataKey="Repeat" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="url(#repGrad)" dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
