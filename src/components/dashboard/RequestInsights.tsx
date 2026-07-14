import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

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
    areaData: [
      { stage: '0', val: 1000 }, { stage: '1', val: 1000 },
      { stage: '1.5', val: 400 }, { stage: '2', val: 200 },
      { stage: '2.5', val: 180 }, { stage: '3', val: 150 },
      { stage: '3.5', val: 100 }, { stage: '4', val: 50 }
    ],
    gradientStops: [
      { offset: "25%", color: "#93c5fd" },
      { offset: "25%", color: "#3b82f6" },
      { offset: "50%", color: "#3b82f6" },
      { offset: "50%", color: "#1d4ed8" },
      { offset: "75%", color: "#1d4ed8" },
      { offset: "75%", color: "#1e3a8a" },
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
    areaData: [
      { stage: '0', val: 1000 }, { stage: '1', val: 1000 },
      { stage: '1.5', val: 400 }, { stage: '2', val: 200 },
      { stage: '2.5', val: 180 }, { stage: '3', val: 150 },
      { stage: '3.5', val: 100 }, { stage: '4', val: 50 },
      { stage: '4.5', val: 30 }, { stage: '5', val: 25 }
    ],
    gradientStops: [
      { offset: "20%", color: "#93c5fd" },
      { offset: "20%", color: "#3b82f6" },
      { offset: "40%", color: "#3b82f6" },
      { offset: "40%", color: "#1d4ed8" },
      { offset: "60%", color: "#1d4ed8" },
      { offset: "60%", color: "#1e3a8a" },
      { offset: "80%", color: "#1e3a8a" },
      { offset: "80%", color: "#0f172a" },
    ]
  };

  const [hoveredStageIdx, setHoveredStageIdx] = useState<number | null>(null);

  const currentFunnel = funnelFilter === 'Invite Quotes' ? inviteQuotesData : defaultFunnelData;

  const pieData = [
    { name: 'Completed', value: 20, fill: '#10b981' },
    { name: 'Escalated', value: 20, fill: '#ef4444' },
    { name: 'Cancelled', value: 60, fill: '#9ca3af' },
  ];

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
            background-color: #f9fafb;
            border-radius: 0.75rem;
            overflow: hidden;
          }
          .dashboard-funnel-grid-5 {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            background-color: #f9fafb;
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
        `}
      </style>
      {/* Funnel Section */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{currentFunnel.title}</h3>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              {funnelFilter}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
                borderRight: idx !== currentFunnel.stages.length - 1 ? '1px solid #e5e7eb' : 'none',
                backgroundColor: hoveredStageIdx === idx ? '#f3f4f6' : '#f9fafb',
                transform: hoveredStageIdx === idx ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s ease-in-out',
                boxShadow: hoveredStageIdx === idx ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
                zIndex: hoveredStageIdx === idx ? 10 : 1,
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>{item.name}</span>
                {item.trend && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{item.trend}</span>}
                {item.link && <span style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{item.link} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span>}
                {item.status && <span style={{ fontSize: '0.75rem', color: item.status.includes('80%') ? '#10b981' : '#d97706', fontWeight: 600 }}>{item.status}</span>}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{item.value}</div>
            </div>
          ))}
          {/* Mock area chart below numbers */}
          <div style={{ gridColumn: '1 / -1', height: '120px', width: '100%' }}>
            <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
              <AreaChart data={currentFunnel.areaData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorVal-${currentFunnel.stages.length}`} x1="0" y1="0" x2="1" y2="0">
                    {currentFunnel.gradientStops.map((stop, i) => (
                      <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={1}/>
                    ))}
                  </linearGradient>
                </defs>
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
              <div style={{ position: 'relative', width: '151px', height: '151px', flexShrink: 0 }}>
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
                      data={pieData} 
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
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', minWidth: '110px', flexShrink: 0 }}>
                {pieData.map(d => {
                  const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
                  const percent = Math.round((d.value / total) * 100);
                  return (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.fill }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{d.name} - {percent}%</span>
                    </div>
                  );
                })}
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
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div 
                  onClick={() => setOrdersVisibleSeries({ ...ordersVisibleSeries, total: !ordersVisibleSeries.total })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: ordersVisibleSeries.total ? 1 : 0.4 }}
                >
                  <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
                  Total Requests
                </div>
                <div 
                  onClick={() => setOrdersVisibleSeries({ ...ordersVisibleSeries, escalated: !ordersVisibleSeries.escalated })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: ordersVisibleSeries.escalated ? 1 : 0.4 }}
                >
                  <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#ef4444' }}></div>
                  Escalated
                </div>
                <div 
                  onClick={() => setOrdersVisibleSeries({ ...ordersVisibleSeries, cancelled: !ordersVisibleSeries.cancelled })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: ordersVisibleSeries.cancelled ? 1 : 0.4 }}
                >
                  <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#9ca3af' }}></div>
                  Cancelled
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%', flexGrow: 1 }}>
            <ResponsiveContainer minWidth={0} minHeight={0}>
              {ordersChartType === 'bar' ? (
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip cursor={false} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  {ordersVisibleSeries.total && <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />}
                  {ordersVisibleSeries.escalated && <Bar dataKey="Escalated" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />}
                  {ordersVisibleSeries.cancelled && <Bar dataKey="Cancelled" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={12} />}
                </BarChart>
              ) : (
                <AreaChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip cursor={false} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  {ordersVisibleSeries.total && <Area type="monotone" dataKey="Total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2.5} />}
                  {ordersVisibleSeries.escalated && <Area type="monotone" dataKey="Escalated" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2.5} />}
                  {ordersVisibleSeries.cancelled && <Area type="monotone" dataKey="Cancelled" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.15} strokeWidth={2.5} />}
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
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div 
                onClick={() => setBreakupVisibleSeries({ ...breakupVisibleSeries, instant: !breakupVisibleSeries.instant })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: breakupVisibleSeries.instant ? 1 : 0.4 }}
              >
                <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
                Instant Smart Booking
              </div>
              <div 
                onClick={() => setBreakupVisibleSeries({ ...breakupVisibleSeries, assisted: !breakupVisibleSeries.assisted })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: breakupVisibleSeries.assisted ? 1 : 0.4 }}
              >
                <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#ef4444' }}></div>
                Assisted Booking
              </div>
              <div 
                onClick={() => setBreakupVisibleSeries({ ...breakupVisibleSeries, invite: !breakupVisibleSeries.invite })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: breakupVisibleSeries.invite ? 1 : 0.4 }}
              >
                <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#f59e0b' }}></div>
                Invite Quotes
              </div>
              <div 
                onClick={() => setBreakupVisibleSeries({ ...breakupVisibleSeries, video: !breakupVisibleSeries.video })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: breakupVisibleSeries.video ? 1 : 0.4 }}
              >
                <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#06b6d4' }}></div>
                Video Assistance
              </div>
              <div 
                onClick={() => setBreakupVisibleSeries({ ...breakupVisibleSeries, direct: !breakupVisibleSeries.direct })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer', opacity: breakupVisibleSeries.direct ? 1 : 0.4 }}
              >
                <div style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#8b5cf6' }}></div>
                Direct Booking
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            {breakupChartType === 'bar' ? (
              <BarChart data={breakupData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip cursor={false} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                {breakupVisibleSeries.instant && <Bar dataKey="Instant" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} />}
                {breakupVisibleSeries.assisted && <Bar dataKey="Assisted" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} />}
                {breakupVisibleSeries.invite && <Bar dataKey="Invite" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={8} />}
                {breakupVisibleSeries.video && <Bar dataKey="Video" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={8} />}
                {breakupVisibleSeries.direct && <Bar dataKey="Direct" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={8} />}
              </BarChart>
            ) : (
              <AreaChart data={breakupData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip cursor={false} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                {breakupVisibleSeries.instant && <Area type="monotone" dataKey="Instant" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />}
                {breakupVisibleSeries.assisted && <Area type="monotone" dataKey="Assisted" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />}
                {breakupVisibleSeries.invite && <Area type="monotone" dataKey="Invite" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />}
                {breakupVisibleSeries.video && <Area type="monotone" dataKey="Video" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />}
                {breakupVisibleSeries.direct && <Area type="monotone" dataKey="Direct" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />}
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
            <div key={reason} style={{ backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {reason} <span style={{ backgroundColor: '#e2e8f0', padding: '0.125rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', color: '#64748b' }}>25 <span style={{ opacity: 0.7 }}>(30%)</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
