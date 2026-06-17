import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

export default function RequestInsights() {
  const [funnelFilter, setFunnelFilter] = useState('All Jobs');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filterOptions = [
    'All Jobs',
    'Instant Smart Booking',
    'Assisted Booking',
    'Invite Quotes',
    'Video Assistance'
  ];

  // Data for "All Jobs" or default 4-stage funnel
  const defaultFunnelData = {
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
  const inviteQuotesData = {
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
    { date: '2 Feb', Instant: 0, Assisted: 0, Invite: 0, Video: 0, Direct: 0 },
    { date: '3 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '4 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '5 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '6 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
    { date: '7 Feb', Instant: 75, Assisted: 45, Invite: 60, Video: 45, Direct: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
        
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentFunnel.stages.length}, 1fr)`, backgroundColor: '#f9fafb', borderRadius: '0.75rem', overflow: 'hidden' }}>
          {currentFunnel.stages.map((item, idx) => (
            <div key={idx} style={{ padding: '1.5rem', position: 'relative', borderRight: idx !== currentFunnel.stages.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentFunnel.areaData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorVal-${currentFunnel.stages.length}`} x1="0" y1="0" x2="1" y2="0">
                    {currentFunnel.gradientStops.map((stop, i) => (
                      <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={1}/>
                    ))}
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="none" fillOpacity={1} fill={`url(#colorVal-${currentFunnel.stages.length})`} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Order Outcome */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Order Outcome Overview</h3>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>400</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Request</div>
              </div>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-end', marginTop: '-150px', marginRight: '20px', zIndex: 10 }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.fill }}></div>
                  {d.name}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '150px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Request Cancellation Rate - 20%</div>
              <div style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer' }}>View Cancellation Reasons</div>
            </div>
          </div>
        </div>

        {/* Orders Trend */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Orders Trend</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>Total Requests</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#ef4444' }}></div>Escalated</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#9ca3af' }}></div>Cancelled</div>
            </div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Escalated" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Cancelled" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Request Breakup Trend */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Request Breakup Trend</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>Instant Smart Booking</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#ef4444' }}></div>Assisted Booking</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#f59e0b' }}></div>Invite Quotes</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#06b6d4' }}></div>Video Assistance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#8b5cf6' }}></div>Direct Booking</div>
          </div>
        </div>
        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={breakupData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="Instant" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="Assisted" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="Invite" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="Video" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="Direct" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={8} />
            </BarChart>
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
