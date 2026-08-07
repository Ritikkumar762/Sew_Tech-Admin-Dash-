import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const RADIAN = Math.PI / 180;

const PIE_DATA = [
  { name: 'Completed', value: 60, fill: '#10b981' },
  { name: 'Escalated', value: 20, fill: '#f87171' },
  { name: 'Cancelled', value: 20, fill: '#9ca3af' },
];
const PIE_TOTAL = PIE_DATA.reduce((acc, d) => acc + d.value, 0);

// Derive the share from value/total rather than recharts' `percent`. Kept at module
// scope so the prop identity stays stable across renders.
const renderPercentLabel = ({
  cx, cy, midAngle, outerRadius, value
}: any) => {
  const radius = outerRadius + 12;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const percentageVal = Math.round((Number(value || 0) / PIE_TOTAL) * 100);
  if (!percentageVal) return null;

  const text = `${percentageVal}%`;
  const width = text.length * 5.4 + 10;

  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - 9}
        width={width}
        height={18}
        rx={5}
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
        fontSize="9px"
        fontWeight="bold"
      >
        {text}
      </text>
    </g>
  );
};

type OrdersKey = 'total' | 'escalated' | 'cancelled';
type BreakupKey = 'instant' | 'assisted' | 'invite' | 'video' | 'direct';

const ORDERS_SERIES: { key: string; stateKey: OrdersKey; label: string; color: string }[] = [
  { key: 'Total', stateKey: 'total', label: 'Total Requests', color: '#3b82f6' },
  { key: 'Escalated', stateKey: 'escalated', label: 'Escalated', color: '#f87171' },
  { key: 'Cancelled', stateKey: 'cancelled', label: 'Cancelled', color: '#9ca3af' },
];

const BREAKUP_SERIES: { key: string; stateKey: BreakupKey; label: string; color: string }[] = [
  { key: 'Instant', stateKey: 'instant', label: 'Instant Smart Booking', color: '#3b82f6' },
  { key: 'Assisted', stateKey: 'assisted', label: 'Assisted Booking', color: '#f87171' },
  { key: 'Invite', stateKey: 'invite', label: 'Invite Quotes', color: '#fbbf24' },
  { key: 'Video', stateKey: 'video', label: 'Video Assistance', color: '#22d3ee' },
  { key: 'Direct', stateKey: 'direct', label: 'Direct Booking', color: '#a78bfa' },
];

const ORDERS_TICKS = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
const ORDERS_AXIS_TICK = { fontSize: 10, fill: '#6b7280' };
const ORDERS_AXIS_LABEL = {
  value: 'Orders',
  angle: -90,
  position: 'insideLeft' as const,
  style: { textAnchor: 'middle' as const, fill: '#6b7280', fontSize: 10 },
};

// The legend markers read as little toggle switches in the design.
function TogglePill({ color }: { color: string }) {
  return (
    <span style={{ width: '26px', height: '14px', borderRadius: '999px', backgroundColor: color, display: 'inline-flex', alignItems: 'center', padding: '2px', flexShrink: 0 }}>
      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' }} />
    </span>
  );
}

type TrendTooltipProps = {
  active?: boolean;
  label?: unknown;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
};

// Orders Trend and Request Breakup Trend share one tooltip shape: date header,
// one row per visible series, then a View Requests link. Breakup also gets a
// summed total row; Orders doesn't, because its own Total Requests series is one.
const makeTrendTooltip = (totalLabel: string | null, series: { key: string; label: string }[]) =>
  function TrendTooltip({ active, payload, label }: TrendTooltipProps) {
    if (!active || !payload?.length) return null;

    const total = payload.reduce((acc, p) => acc + Number(p.value || 0), 0);
    const row = (name: string, value: number) => (
      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', fontSize: '0.8125rem' }}>
        <span style={{ color: '#4b5563' }}>{name}:</span>
        <span style={{ color: '#111827', fontWeight: 700 }}>{value}</span>
      </div>
    );

    return (
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.18)', padding: '0.875rem 1.125rem', minWidth: '215px' }}>
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', paddingBottom: '0.625rem' }}>{String(label ?? '')}</div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {totalLabel && row(totalLabel, total)}
          {payload.map(p => {
            const key = String(p.dataKey ?? '');
            return row(series.find(s => s.key === key)?.label ?? key, Number(p.value || 0));
          })}
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb', textDecoration: 'underline' }}>
          View Requests
        </div>
      </div>
    );
  };

const OrdersTrendTooltip = makeTrendTooltip(null, ORDERS_SERIES);
const BreakupTrendTooltip = makeTrendTooltip('Total Request', BREAKUP_SERIES);

export default function RequestInsights() {
  const [funnelFilter, setFunnelFilter] = useState('All Jobs');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ordersChartType, setOrdersChartType] = useState<'bar' | 'line'>('bar');
  const [ordersVisibleSeries, setOrdersVisibleSeries] = useState({
    total: true,
    escalated: true,
    cancelled: true
  });
  const [breakupChartType, setBreakupChartType] = useState<'bar' | 'line'>('bar');
  const [breakupVisibleSeries, setBreakupVisibleSeries] = useState({
    instant: true,
    assisted: true,
    invite: true,
    video: true,
    direct: true
  });

  const filterOptions = [
    'All Jobs',
    'Instant Smart Booking',
    'Assisted Booking',
    'Invite Quotes',
    'Video Assistance'
  ];

  interface FunnelStage {
    name: string;
    value: number;
    trend?: string;
    link?: string;
    status?: string;
  }

  // Data for "All Jobs" or default 4-stage funnel
  const defaultFunnelData: { title: string; stages: FunnelStage[]; areaData: any[]; gradientStops: any[] } = {
    title: 'Service Request Funnel',
    stages: [
      { name: 'Requests Received', value: 1000, trend: '▲ 5% (L7D)' },
      { name: 'Assigned', value: 200, link: 'View Unassigned' },
      { name: 'In Progress', value: 150, status: 'On-Schedule: 80%' },
      { name: 'Completed', value: 50, status: 'On-Schedule: 70%' },
    ],
    // Decorative funnel silhouette, not the stage values: 13 evenly spaced points so
    // vertices land on the column boundaries (25/50/75%), with a flat plateau inside
    // each column and the step happening within it. Scaled 0-100 against a fixed axis.
    areaData: [
      { stage: '0', val: 96 }, { stage: '1', val: 96 }, { stage: '2', val: 88 },
      { stage: '3', val: 80 }, { stage: '4', val: 78 }, { stage: '5', val: 60 },
      { stage: '6', val: 48 }, { stage: '7', val: 45 }, { stage: '8', val: 33 },
      { stage: '9', val: 27 }, { stage: '10', val: 22 }, { stage: '11', val: 20 },
      { stage: '12', val: 20 }
    ],
    gradientStops: [
      { offset: "25%", color: "#93c5fd" },
      { offset: "25%", color: "#0d6efd" },
      { offset: "50%", color: "#0d6efd" },
      { offset: "50%", color: "#0a4d94" },
      { offset: "75%", color: "#0a4d94" },
      { offset: "75%", color: "#0a2f5c" },
    ]
  };

  // Data for "Invite Quotes" 5-stage funnel
  const inviteQuotesData: { title: string; stages: FunnelStage[]; areaData: any[]; gradientStops: any[] } = {
    title: 'Order Funnel',
    stages: [
      { name: 'Quotes Invited', value: 1000, trend: '▲ 5% (L7D)' },
      { name: 'Bidding Closed', value: 200 },
      { name: 'Mechanic Selected', value: 150 },
      { name: 'In Progress', value: 50, status: 'On-Schedule: 70%' },
      { name: 'Completed', value: 25 },
    ],
    // Same silhouette approach, 11 points so vertices land on the 20/40/60/80% boundaries.
    areaData: [
      { stage: '0', val: 96 }, { stage: '1', val: 96 }, { stage: '2', val: 80 },
      { stage: '3', val: 76 }, { stage: '4', val: 62 }, { stage: '5', val: 56 },
      { stage: '6', val: 44 }, { stage: '7', val: 38 }, { stage: '8', val: 28 },
      { stage: '9', val: 20 }, { stage: '10', val: 20 }
    ],
    gradientStops: [
      { offset: "20%", color: "#93c5fd" },
      { offset: "20%", color: "#0d6efd" },
      { offset: "40%", color: "#0d6efd" },
      { offset: "40%", color: "#0a4d94" },
      { offset: "60%", color: "#0a4d94" },
      { offset: "60%", color: "#0a2f5c" },
      { offset: "80%", color: "#0a2f5c" },
      { offset: "80%", color: "#071d3a" },
    ]
  };

  const [hoveredStageIdx, setHoveredStageIdx] = useState<number | null>(null);

  const currentFunnel = funnelFilter === 'Invite Quotes' ? inviteQuotesData : defaultFunnelData;

  const barData = [
    { date: '1 Feb', Total: 85, Escalated: 45, Cancelled: 30 },
    { date: '2 Feb', Total: 60, Escalated: 20, Cancelled: 15 },
    { date: '3 Feb', Total: 40, Escalated: 15, Cancelled: 15 },
    { date: '4 Feb', Total: 90, Escalated: 50, Cancelled: 35 },
    { date: '5 Feb', Total: 60, Escalated: 25, Cancelled: 30 },
    { date: '6 Feb', Total: 75, Escalated: 20, Cancelled: 10 },
    { date: '7 Feb', Total: 85, Escalated: 50, Cancelled: 30 },
  ];

  const breakupData = [
    { date: '1 Feb', Instant: 75, Assisted: 60, Invite: 45, Video: 55, Direct: 30 },
    { date: '2 Feb', Instant: 60, Assisted: 50, Invite: 40, Video: 50, Direct: 20 },
    { date: '3 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '4 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '5 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '6 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '7 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>
        {`
          .dashboard-grid-1 {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 1.5rem;
          }
          .dashboard-funnel-grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            background-color: #f8fafc;
            border-radius: 0.75rem;
            overflow: hidden;
          }
          .dashboard-funnel-grid-5 {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            background-color: #f8fafc;
            border-radius: 0.75rem;
            overflow: hidden;
          }
          @media (max-width: 1024px) {
            .dashboard-grid-1 {
              grid-template-columns: 1fr;
            }
            .dashboard-funnel-grid-4, .dashboard-funnel-grid-5 {
              grid-template-columns: 1fr 1fr;
            }
          }
          @media (max-width: 640px) {
            .dashboard-funnel-grid-4, .dashboard-funnel-grid-5 {
              grid-template-columns: 1fr;
            }
          }
          /* Percentage pills sit outside the ring, so don't clip them at the SVG edge. */
          .outcome-donut .recharts-surface {
            overflow: visible;
          }
        `}
      </style>
      {/* Funnel Section */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{currentFunnel.title}</h3>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '3rem', cursor: 'pointer', fontSize: '0.9375rem', color: '#374151', minWidth: '170px', justifyContent: 'space-between' }}
            >
              {funnelFilter}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50, minWidth: '200px' }}>
                {filterOptions.map(opt => (
                  <div 
                    key={opt}
                    onClick={() => { setFunnelFilter(opt); setIsDropdownOpen(false); }}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', color: '#374151' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    {opt === 'All Jobs' ? 'All Jobs Funnel' : opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className={`dashboard-funnel-grid-${currentFunnel.stages.length}`}>
          {currentFunnel.stages.map((item, idx) => (
            <div 
              key={idx} 
              onMouseEnter={() => setHoveredStageIdx(idx)}
              onMouseLeave={() => setHoveredStageIdx(null)}
              style={{ 
                padding: '1.5rem', 
                position: 'relative', 
                borderRight: idx !== currentFunnel.stages.length - 1 ? '4px solid #ffffff' : 'none',
                backgroundColor: hoveredStageIdx === idx ? '#f1f5f9' : '#f8fafc',
                transform: hoveredStageIdx === idx ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s ease-in-out',
                boxShadow: hoveredStageIdx === idx ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
                zIndex: hoveredStageIdx === idx ? 10 : 1,
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>{item.name}</span>
                {item.trend && <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700, whiteSpace: 'nowrap' }}>{item.trend}</span>}
                {item.link && <span style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.link} <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span>}
                {item.status && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    borderRadius: '999px',
                    padding: '0.25rem 0.625rem',
                    color: item.status.includes('80%') ? '#059669' : '#d97706',
                    backgroundColor: item.status.includes('80%') ? '#dcfce7' : '#fef3c7',
                  }}>{item.status}</span>
                )}
              </div>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#111827' }}>{item.value}</div>
            </div>
          ))}
          {/* Mock area chart below numbers */}
          <div style={{ gridColumn: '1 / -1', height: '120px', width: '100%', position: 'relative' }}>
            {/* The column dividers carry on through the funnel band in the design. */}
            {Array.from({ length: currentFunnel.stages.length - 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `calc(${((i + 1) / currentFunnel.stages.length) * 100}% - 4px)`,
                  width: '4px',
                  backgroundColor: '#ffffff',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />
            ))}
            <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
              <AreaChart data={currentFunnel.areaData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorVal-${currentFunnel.stages.length}`} x1="0" y1="0" x2="1" y2="0">
                    {currentFunnel.gradientStops.map((stop, i) => (
                      <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={1}/>
                    ))}
                  </linearGradient>
                </defs>
                {/* Without a fixed domain the axis auto-scales to [min, max], which
                    flattens the last stage to zero height. */}
                <YAxis hide domain={[0, 100]} />
                <Area type="monotone" dataKey="val" stroke="none" fillOpacity={1} fill={`url(#colorVal-${currentFunnel.stages.length})`} isAnimationActive={true} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-1">
        {/* Order Outcome */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1rem' }}>Order Outcome Overview</h3>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexGrow: 1, justifyContent: 'center' }}>
            
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {/* Doughnut Wrapper */}
              <div className="outcome-donut" style={{ position: 'relative', width: '151px', height: '151px', flexShrink: 0 }}>
                <div style={{
                  position: 'absolute',
                  textAlign: 'center',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  pointerEvents: 'none',
                  zIndex: 10
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>400</div>
                  <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 600 }}>Request</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={PIE_DATA} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={42}
                      outerRadius={62}
                      dataKey="value"
                      startAngle={90} 
                      endAngle={-270}
                      label={renderPercentLabel}
                      labelLine={false}
                      stroke="none"
                    >
                      {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', fontWeight: 500, color: '#374151', minWidth: '100px', flexShrink: 0 }}>
                {PIE_DATA.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: d.fill, flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap' }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', width: '100%', borderTop: '1px dashed #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Request Cancellation Rate - 20%</div>
              <div style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>View Cancellation Reasons</div>
            </div>
          </div>
        </div>

        {/* Orders Trend */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Orders Trend</h3>
            
            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Chart Type Toggle */}
              <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid #cbd5e1', padding: '0.125rem', borderRadius: '0.375rem', backgroundColor: '#f8fafc' }}>
                <button 
                  onClick={() => setOrdersChartType('bar')}
                  style={{
                    border: 'none',
                    background: ordersChartType === 'bar' ? '#111827' : 'transparent',
                    color: ordersChartType === 'bar' ? 'white' : '#4b5563',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Bar
                </button>
                <button 
                  onClick={() => setOrdersChartType('line')}
                  style={{
                    border: 'none',
                    background: ordersChartType === 'line' ? '#111827' : 'transparent',
                    color: ordersChartType === 'line' ? 'white' : '#4b5563',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Line
                </button>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {ORDERS_SERIES.map(s => (
                  <div
                    key={s.stateKey}
                    onClick={() => setOrdersVisibleSeries({ ...ordersVisibleSeries, [s.stateKey]: !ordersVisibleSeries[s.stateKey] })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151', cursor: 'pointer', opacity: ordersVisibleSeries[s.stateKey] ? 1 : 0.4, whiteSpace: 'nowrap' }}
                  >
                    <TogglePill color={s.color} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%', flexGrow: 1 }}>
            <ResponsiveContainer minWidth={0} minHeight={0}>
              {ordersChartType === 'bar' ? (
                <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={ORDERS_AXIS_TICK} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={ORDERS_AXIS_TICK} domain={[0, 100]} ticks={ORDERS_TICKS} interval={0} label={ORDERS_AXIS_LABEL} />
                  <Tooltip cursor={false} content={OrdersTrendTooltip} />
                  {ORDERS_SERIES.filter(s => ordersVisibleSeries[s.stateKey]).map(s => (
                    <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} barSize={12} />
                  ))}
                </BarChart>
              ) : (
                <AreaChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={ORDERS_AXIS_TICK} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={ORDERS_AXIS_TICK} domain={[0, 100]} ticks={ORDERS_TICKS} interval={0} label={ORDERS_AXIS_LABEL} />
                  <Tooltip cursor={false} content={OrdersTrendTooltip} />
                  {ORDERS_SERIES.filter(s => ordersVisibleSeries[s.stateKey]).map(s => (
                    <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.15} strokeWidth={2.5} />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Request Breakup Trend */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Request Breakup Trend</h3>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Chart Type Toggle */}
            <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid #cbd5e1', padding: '0.125rem', borderRadius: '0.375rem', backgroundColor: '#f8fafc' }}>
              <button 
                onClick={() => setBreakupChartType('bar')}
                style={{
                  border: 'none',
                  background: breakupChartType === 'bar' ? '#111827' : 'transparent',
                  color: breakupChartType === 'bar' ? 'white' : '#4b5563',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Bar
              </button>
              <button 
                onClick={() => setBreakupChartType('line')}
                style={{
                  border: 'none',
                  background: breakupChartType === 'line' ? '#111827' : 'transparent',
                  color: breakupChartType === 'line' ? 'white' : '#4b5563',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Line
              </button>
            </div>

            {/* Clickable Legend Toggles */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {BREAKUP_SERIES.map(s => (
                <div
                  key={s.stateKey}
                  onClick={() => setBreakupVisibleSeries({ ...breakupVisibleSeries, [s.stateKey]: !breakupVisibleSeries[s.stateKey] })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151', cursor: 'pointer', opacity: breakupVisibleSeries[s.stateKey] ? 1 : 0.4, whiteSpace: 'nowrap' }}
                >
                  <TogglePill color={s.color} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            {breakupChartType === 'bar' ? (
              <BarChart data={breakupData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={ORDERS_AXIS_TICK} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={ORDERS_AXIS_TICK} domain={[0, 100]} ticks={ORDERS_TICKS} interval={0} label={ORDERS_AXIS_LABEL} />
                <Tooltip cursor={false} content={BreakupTrendTooltip} />
                {BREAKUP_SERIES.filter(s => breakupVisibleSeries[s.stateKey]).map(s => (
                  <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} barSize={8} />
                ))}
              </BarChart>
            ) : (
              <AreaChart data={breakupData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={ORDERS_AXIS_TICK} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={ORDERS_AXIS_TICK} domain={[0, 100]} ticks={ORDERS_TICKS} interval={0} label={ORDERS_AXIS_LABEL} />
                <Tooltip cursor={false} content={BreakupTrendTooltip} />
                {BREAKUP_SERIES.filter(s => breakupVisibleSeries[s.stateKey]).map(s => (
                  <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.1} strokeWidth={2} />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Cancellation Reasons */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Top Cancellation Reasons <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 8v6h6"></path></svg>
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['Requested by mistake', 'Change in schedule / plans', 'Found a better deal', 'Need to reschedule'].map(reason => (
            <div key={reason} style={{ backgroundColor: '#eff6ff', padding: '0.625rem 1rem', borderRadius: '999px', fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.625rem', whiteSpace: 'nowrap' }}>
              {reason} <span style={{ backgroundColor: '#dbeafe', padding: '0.1875rem 0.625rem', borderRadius: '999px', fontSize: '0.8125rem', color: '#1e293b', fontWeight: 700 }}>25 <span style={{ color: '#64748b', fontWeight: 400 }}>(30%)</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
