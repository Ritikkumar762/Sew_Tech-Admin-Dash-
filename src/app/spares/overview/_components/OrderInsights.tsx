'use client';

import { useState } from 'react';
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
  const [selectedFunnel, setSelectedFunnel] = useState<'all' | 'return' | 'replacement' | 'cancellation'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    'Total Orders': true,
    'Return': true,
    'Replacement': true,
    'Cancellation': false
  });

  const toggleSeries = (name: string) => {
    setVisibleSeries(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const funnelDatasets: Record<string, FunnelStage[]> = {
    all: funnel.length ? funnel : [
      { name: 'Order Confirmed', value: 1000, subtitle: '▲ 5% (L7D)', color: '#8CBAF0' },
      { name: 'Packed', value: 200, subtitle: 'On-Schedule: 80%', color: '#0460CA', badge: '#10b981' },
      { name: 'Shipped', value: 150, subtitle: 'On-Schedule: 80%', color: '#034B9E', badge: '#10b981' },
      { name: 'Out for Delivery', value: 50, subtitle: 'On-Schedule: 70%', color: '#023A7A', badge: '#f59e0b' },
      { name: 'Delivered', value: 25, subtitle: 'On-Schedule: 10%', color: '#001B3B', badge: '#ef4444' },
    ],
    return: [
      { name: 'Return Requested', value: 1000, subtitle: '▲ 5% (L7D)', color: '#8CBAF0' },
      { name: 'Action Taken', value: 200, subtitle: 'On-Schedule: 80%', color: '#0460CA' },
      { name: 'Pickup Scheduled', value: 150, subtitle: 'On-Schedule: 80%', color: '#034B9E' },
      { name: 'Item Received', value: 50, subtitle: 'On-Schedule: 70%', color: '#023A7A' },
      { name: 'Refund Initiated', value: 25, subtitle: 'On-Schedule: 10%', color: '#001B3B' },
    ],
    replacement: [
      { name: 'Replacement Requested', value: 1000, subtitle: '▲ 5% (L7D)', color: '#8CBAF0' },
      { name: 'Action Taken', value: 200, subtitle: 'On-Schedule: 80%', color: '#0460CA' },
      { name: 'Pickup Scheduled', value: 150, subtitle: 'On-Schedule: 80%', color: '#034B9E' },
      { name: 'Replacement Shipped', value: 50, subtitle: 'On-Schedule: 70%', color: '#023A7A' },
      { name: 'Delivered', value: 25, subtitle: 'On-Schedule: 10%', color: '#001B3B' },
    ],
    cancellation: [
      { name: 'Cancellation Requested', value: 1000, subtitle: '▲ 5% (L7D)', color: '#8CBAF0' },
      { name: 'Action Taken', value: 200, subtitle: 'On-Schedule: 80%', color: '#0460CA' },
      { name: 'Pickup Scheduled', value: 150, subtitle: 'On-Schedule: 80%', color: '#034B9E' },
      { name: 'Refund Initiated', value: 50, subtitle: 'On-Schedule: 70%', color: '#023A7A' },
      { name: 'Refund Completed', value: 25, subtitle: 'On-Schedule: 10%', color: '#001B3B' },
    ]
  };

  const activeFunnel = funnelDatasets[selectedFunnel];
  const numStages = activeFunnel.length;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Order Funnel ─────────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Order Funnel</h2>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.select}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1f2937',
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '160px',
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
            >
              <span>
                {selectedFunnel === 'all' && 'Funnel View'}
                {selectedFunnel === 'return' && 'Return Funnel'}
                {selectedFunnel === 'replacement' && 'Replacement Funnel'}
                {selectedFunnel === 'cancellation' && 'Cancellation Funnel'}
              </span>
              <svg 
                width="10" 
                height="6" 
                viewBox="0 0 10 6" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s ease',
                  flexShrink: 0
                }}
              >
                <path d="M1 1L5 5L9 1" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  onClick={() => setIsDropdownOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 49
                  }}
                />
                
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  zIndex: 50,
                  minWidth: '180px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {[
                    { value: 'all', label: 'All Orders Funnel' },
                    { value: 'return', label: 'Return Funnel' },
                    { value: 'replacement', label: 'Replacement Funnel' },
                    { value: 'cancellation', label: 'Cancellation Funnel' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedFunnel(option.value as any);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        padding: '10px 16px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: selectedFunnel === option.value ? '#3b82f6' : '#374151',
                        backgroundColor: selectedFunnel === option.value ? '#f0f6ff' : 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFunnel !== option.value) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFunnel !== option.value) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className={styles.scrollContainer}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${numStages}, 1fr)`, 
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'white',
            marginTop: '1.5rem',
            height: '240px',
            position: 'relative',
            minWidth: '768px'
          }}>
          {/* Vertical dividers & text */}
          {activeFunnel.map((stage, idx) => (
            <div 
              key={`${selectedFunnel}-${idx}`} 
              style={{ 
                padding: '24px 20px', 
                borderRight: idx < numStages - 1 ? '1px solid rgba(211, 208, 255, 0.4)' : 'none',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                zIndex: 2,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, lineHeight: 1.2 }}>{stage.name}</span>
                {idx === 0 ? (
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                    ▲ 5% <span style={{ color: '#6b7280', fontWeight: 500 }}>(L7D)</span>
                  </span>
                ) : (
                  <span style={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 700, 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    background: idx === 1 || idx === 2 ? '#d1fae5' : idx === 3 ? '#fef3c7' : '#fee2e2',
                    color: idx === 1 || idx === 2 ? '#065f46' : idx === 3 ? '#92400e' : '#991b1b',
                    whiteSpace: 'nowrap',
                    marginTop: '2px'
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
            <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
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
                <Area type="monotone" dataKey="val" stroke="none" fill="url(#colorFunnel)" fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
      </div>

      <div className={styles.grid2ColEqual}>
        
        {/* ── Order Outcome Overview ─────────────────────────── */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Order Outcome Overview</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {/* Donut Chart */}
            <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className={styles.donutCenter}>
                <div className={styles.donutTotal}>400</div>
                <div className={styles.donutSub}>Orders</div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={orderOutcome} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={70} 
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    stroke="none"
                  >
                    {orderOutcome.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                </PieChart>
              </ResponsiveContainer>
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
          <div className={styles.cardHeaderRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Orders Trend</h2>
            
            {/* Custom Interactive Legend */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { name: 'Cancellation', color: '#9ca3af' },
                { name: 'Replacement', color: '#fbbf24' },
                { name: 'Return', color: '#f87171' },
                { name: 'Total Orders', color: '#3b82f6' }
              ].map((item) => {
                const isActive = visibleSeries[item.name];
                return (
                  <div 
                    key={item.name} 
                    onClick={() => toggleSeries(item.name)}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    {/* Toggle Switch */}
                    <span style={{ 
                      width: '24px', 
                      height: '12px', 
                      borderRadius: '6px', 
                      backgroundColor: isActive ? item.color : '#d1d5db', 
                      position: 'relative', 
                      display: 'inline-block',
                      transition: 'background-color 0.2s'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: '2px',
                        left: isActive ? '14px' : '2px',
                        transition: 'left 0.2s'
                      }} />
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
              <BarChart data={orderTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip 
                  trigger="click" 
                  wrapperStyle={{ pointerEvents: 'auto' }} 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'transparent' }} 
                />
                {visibleSeries['Total Orders'] && <Bar dataKey="Total Orders" fill="#3b82f6" radius={[4,4,0,0]} barSize={12} />}
                {visibleSeries['Return'] && <Bar dataKey="Return" fill="#f87171" radius={[4,4,0,0]} barSize={12} />}
                {visibleSeries['Replacement'] && <Bar dataKey="Replacement" fill="#fbbf24" radius={[4,4,0,0]} barSize={12} />}
                {visibleSeries['Cancellation'] && <Bar dataKey="Cancellation" fill="#9ca3af" radius={[4,4,0,0]} barSize={12} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Cancellation & Return Reasons ────────────────────── */}
      <div className={styles.grid2ColEqual}>
        <div className={styles.card}>
          <div className={styles.cardHeaderRow} style={{ marginBottom: '1.25rem' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Top Cancellation Reasons
              <img 
                src="/refresh_logo.svg" 
                alt="Link" 
                style={{ width: '14px', height: '14px', cursor: 'pointer', display: 'inline-block' }}
              />
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 0.5rem' }}>
            {cancelReasons.map((reason, i) => (
              <div key={i} style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                background: '#eff6ff', 
                padding: '4px 4px 4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                color: '#1e293b', 
                fontWeight: 500,
                gap: '8px'
              }}>
                <span>{reason.label}</span>
                <span style={{ 
                  background: '#dbeafe', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#1e293b'
                }}>
                  <strong style={{ fontWeight: 700 }}>{reason.count}</strong>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({reason.percentage})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeaderRow} style={{ marginBottom: '1.25rem' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Top Return Reasons
              <img 
                src="/refresh_logo.svg" 
                alt="Link" 
                style={{ width: '14px', height: '14px', cursor: 'pointer', display: 'inline-block' }}
              />
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 0.5rem' }}>
            {cancelReasons.map((reason, i) => (
              <div key={i} style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                background: '#eff6ff', 
                padding: '4px 4px 4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                color: '#1e293b', 
                fontWeight: 500,
                gap: '8px'
              }}>
                <span>{reason.label}</span>
                <span style={{ 
                  background: '#dbeafe', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#1e293b'
                }}>
                  <strong style={{ fontWeight: 700 }}>{reason.count}</strong>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({reason.percentage})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
