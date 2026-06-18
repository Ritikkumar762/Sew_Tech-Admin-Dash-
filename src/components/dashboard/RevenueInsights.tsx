import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function RevenueInsights() {
  const lineData = [
    { date: '1 Feb', Revenue: 7500 },
    { date: '2 Feb', Revenue: 6000 },
    { date: '3 Feb', Revenue: 9000 },
    { date: '4 Feb', Revenue: 8500 },
    { date: '5 Feb', Revenue: 7000 },
    { date: '6 Feb', Revenue: 6500 },
    { date: '7 Feb', Revenue: 8500 },
  ];

  const cashflowData = [
    { name: 'Mechanic Payouts', value: 60000, fill: '#f59e0b' },
    { name: 'Commission', value: 40000, fill: '#10b981' },
  ];

  const barData = [
    { date: 'Instant Smart Booking', Instant: 7500, Assisted: 5000, Invite: 4000, Video: 6000, Direct: 3000 },
    { date: 'Assisted Booking', Instant: 2000, Assisted: 6000, Invite: 3000, Video: 4000, Direct: 2000 },
    { date: 'Invite Quotes', Instant: 3000, Assisted: 4000, Invite: 7000, Video: 5000, Direct: 4000 },
    { date: 'Video Assistance', Instant: 6000, Assisted: 5000, Invite: 4000, Video: 8000, Direct: 3000 },
    { date: 'Direct Booking', Instant: 4000, Assisted: 3000, Invite: 2000, Video: 4000, Direct: 7000 },
  ];

  const transactionData = [
    { name: 'Completed', value: 60, fill: '#10b981' },
    { name: 'Failed', value: 20, fill: '#ef4444' },
    { name: 'Pending', value: 20, fill: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Revenue Trend */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Revenue Trend</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>Revenue</div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={lineData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} label={{ value: 'Amount (in Rupees)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, 'Revenue']} />
                <Line type="linear" dataKey="Revenue" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                {/* Simulated background shaded area could be an Area chart with same data */}
                <Line type="linear" dataKey="Revenue" stroke="none" fill="#fef3c7" fillOpacity={0.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Service */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Revenue by Service</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>Instant Smart Booking</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#ef4444' }}></div>Assisted Booking</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#f59e0b' }}></div>Invite Quotes</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#06b6d4' }}></div>Video Assistance</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#8b5cf6' }}></div>Direct Booking</div>
            </div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} label={{ value: 'Amount (in Rupees)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }} />
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

      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Cash-flow Breakup */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Cash-flow Breakup</h3>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={cashflowData} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                    {cashflowData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>₹1,00,000</div>
              </div>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-end', marginTop: '-150px', zIndex: 10 }}>
              {cashflowData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.fill }}></div>
                  {d.name}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '130px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                20% of Mechanic Payouts Pending <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Insights */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Transaction Insights</h3>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={transactionData} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                    {transactionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>400</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Orders</div>
              </div>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-end', marginTop: '-150px', zIndex: 10 }}>
              {transactionData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.fill }}></div>
                  {d.name}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '130px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                Payment Success Rate - 75%
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
