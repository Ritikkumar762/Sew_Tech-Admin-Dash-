import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

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

const formatINR = (value: unknown) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// Cash-flow segments show the rupee amount, not a percentage — so it needs its own
// renderer instead of the shared percentage one used by Transaction Insights.
const renderCurrencyLabel = ({
  cx, cy, midAngle, outerRadius, value
}: any) => {
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!Number(value)) return null;

  const text = formatINR(value);
  const width = text.length * 4.4 + 10;

  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - 8}
        width={width}
        height={16}
        rx={4}
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
        fontSize="8px"
        fontWeight="bold"
      >
        {text}
      </text>
    </g>
  );
};

// Single source of truth for the Revenue by Service series, so the legend, the bars
// and the tooltip rows can never drift out of sync.
const SERVICES = [
  { key: 'Instant', label: 'Instant Smart Booking', color: '#3b82f6' },
  { key: 'Assisted', label: 'Assisted Booking', color: '#f87171' },
  { key: 'Invite', label: 'Invite Quotes', color: '#fbbf24' },
  { key: 'Video', label: 'Video Assistance', color: '#22d3ee' },
  { key: 'Direct', label: 'Direct Booking', color: '#a78bfa' },
];

const MONEY_TICKS = Array.from({ length: 11 }, (_, i) => i * 1000);
const formatTick = (value: unknown) => Number(value).toLocaleString('en-IN');

type ServiceTooltipProps = {
  active?: boolean;
  label?: unknown;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
};

const renderServiceTooltip = ({ active, payload, label }: ServiceTooltipProps) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((acc, p) => acc + Number(p.value || 0), 0);
  const row = (name: string, value: number, bold?: boolean) => (
    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', fontSize: '0.8125rem' }}>
      <span style={{ color: '#4b5563' }}>{name}:</span>
      <span style={{ color: '#111827', fontWeight: bold ? 700 : 600 }}>{formatINR(value)}</span>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.18)',
      padding: '0.875rem 1.125rem',
      minWidth: '235px'
    }}>
      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', paddingBottom: '0.625rem' }}>{String(label ?? '')}</div>
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {row('Total Revenue', total, true)}
        {payload.map(p => {
          const key = String(p.dataKey ?? '');
          return row(SERVICES.find(s => s.key === key)?.label ?? key, Number(p.value || 0));
        })}
      </div>
      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: '#2563eb',
        textDecoration: 'underline'
      }}>
        View Requests
      </div>
    </div>
  );
};

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
    <div className="revenue-grid">
      <style>
        {`
          .revenue-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
          }
          @media (max-width: 1024px) {
            .revenue-grid {
              grid-template-columns: 1fr;
            }
          }
          /* Rupee labels sit wider than the old percentage pills, so let them
             spill into the gap instead of being clipped at the SVG edge. */
          .cashflow-donut .recharts-surface {
            overflow: visible;
          }
        `}
      </style>
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Revenue Trend */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Revenue Trend</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>Revenue</div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer minWidth={0} minHeight={0}>
              <AreaChart data={lineData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  domain={[0, 10000]}
                  ticks={MONEY_TICKS}
                  tickFormatter={formatTick}
                  label={{ value: 'Amount (In Rupees)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }}
                />
                <Tooltip
                  cursor={false}
                  separator=""
                  labelStyle={{ display: 'none' }}
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 700 }}
                  formatter={(value: any) => [formatINR(value), '']}
                />
                <Area
                  type="linear"
                  dataKey="Revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  fill="url(#revenueTrendFill)"
                  dot={{ fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Service */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Revenue by Service</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem 1rem' }}>
              {SERVICES.map(s => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}>
                  <div style={{ width: '18px', height: '8px', borderRadius: '999px', backgroundColor: s.color, flexShrink: 0 }}></div>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer minWidth={0} minHeight={0}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 20, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  domain={[0, 10000]}
                  ticks={MONEY_TICKS}
                  tickFormatter={formatTick}
                  label={{ value: 'Amount (In Rupees)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={renderServiceTooltip} />
                {SERVICES.map(s => (
                  <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} barSize={12} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Cash-flow Breakup */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1rem' }}>Cash-flow Breakup</h3>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexGrow: 1, justifyContent: 'center' }}>
            
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {/* Doughnut Wrapper */}
              <div className="cashflow-donut" style={{ position: 'relative', width: '151px', height: '151px', flexShrink: 0 }}>
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
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                    {formatINR(cashflowData.reduce((acc, curr) => acc + curr.value, 0))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={cashflowData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      label={renderCurrencyLabel}
                      labelLine={false}
                      stroke="none"
                    >
                      {cashflowData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${Number(value || 0).toLocaleString()}`} wrapperStyle={{ zIndex: 1000 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', minWidth: '110px', flexShrink: 0 }}>
                {cashflowData.map(d => {
                  const total = cashflowData.reduce((acc, curr) => acc + curr.value, 0);
                  const percent = Math.round((d.value / total) * 100);
                  return (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.fill }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{d.name.split(' ')[0]} - {percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: 'center', width: '100%', borderTop: '1px dashed #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                20% Payouts Pending <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Insights */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1rem' }}>Transaction Insights</h3>
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
                  <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 600 }}>Orders</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={transactionData} 
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
                      {transactionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', minWidth: '110px', flexShrink: 0 }}>
                {transactionData.map(d => {
                  const total = transactionData.reduce((acc, curr) => acc + curr.value, 0);
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
