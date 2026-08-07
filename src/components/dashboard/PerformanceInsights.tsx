import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AXIS_TICKS = Array.from({ length: 11 }, (_, i) => i * 1000);
const formatAxisTick = (value: unknown) => Number(value).toLocaleString('en-IN');
const formatAmount = (value: unknown) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const AXIS_TICK_STYLE = { fontSize: 10, fill: '#6b7280' };
const AXIS_LABEL = {
  value: 'Orders',
  angle: -90,
  position: 'insideLeft' as const,
  style: { textAnchor: 'middle' as const, fill: '#6b7280', fontSize: 10 }
};
const TOOLTIP_CARD = {
  borderRadius: '0.5rem',
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const INSIGHT_TONES = {
  blue: { header: '#dbeafe', body: '#eff6ff' },
  red: { header: '#fcd9d1', body: '#fdeee9' },
};

const CLOCK_ICON = <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>;

// The three service badges appear both in the Key Insights card and in the
// leaderboard's Service Type column, so they live in one place.
const SERVICE_BADGES = [
  { color: '#10b981', glyph: CLOCK_ICON },
  { color: '#f59e0b', glyph: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></> },
  { color: '#06b6d4', glyph: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path> },
];

function ServiceBadges({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.375rem' }}>
      {SERVICE_BADGES.map(b => (
        <div key={b.color} style={{ width: size, height: size, borderRadius: '50%', backgroundColor: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">{b.glyph}</svg>
        </div>
      ))}
    </div>
  );
}

const LEADERBOARD_COLUMNS: { label: string; align: 'left' | 'center' }[] = [
  { label: 'Rank', align: 'center' },
  { label: 'Mechanic ID', align: 'left' },
  { label: 'Service Type', align: 'center' },
  { label: 'City Coverage', align: 'center' },
  { label: 'Jobs Completed', align: 'center' },
  { label: 'Net Payout', align: 'center' },
  { label: 'Availability', align: 'center' },
  { label: 'Rating', align: 'center' },
  { label: 'Status', align: 'center' },
];

function SortIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M3 1.5v9M3 10.5 1.2 8.4M3 10.5l1.8-2.1" />
      <path d="M7 10.5v-9M7 1.5 5.2 3.6M7 1.5l1.8 2.1" />
    </svg>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '0.4375rem 0.75rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
      {children}
    </div>
  );
}

function InsightCard({ tone, icon, title, value, children }: {
  tone: keyof typeof INSIGHT_TONES;
  icon: React.ReactNode;
  title: string;
  value: string;
  children: React.ReactNode;
}) {
  const t = INSIGHT_TONES[tone];
  return (
    <div className="hover-card" style={{ borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: t.body }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: t.header, padding: '0.75rem 1.25rem', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
        {title}
      </div>
      <div style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>{value}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PerformanceInsights() {
  const [isCompare, setIsCompare] = useState(false);
  const [compareMode, setCompareMode] = useState('By Service');

  const singleLineData = [
    { date: '1 Feb', Orders: 8000 },
    { date: '2 Feb', Orders: 6500 },
    { date: '3 Feb', Orders: 9000 },
    { date: '4 Feb', Orders: 9000 },
    { date: '5 Feb', Orders: 8000 },
    { date: '6 Feb', Orders: 6500 },
    { date: '7 Feb', Orders: 8000 },
    { date: '8 Feb', Orders: 9000 },
    { date: '9 Feb', Orders: 7000 },
    { date: '10 Feb', Orders: 6000 },
    { date: '11 Feb', Orders: 6000 },
    { date: '12 Feb', Orders: 9000 },
  ];

  const compareData = singleLineData.map((d) => ({
    ...d,
    Category1: d.Orders * 0.6,
    Category2: d.Orders,
  }));

  const leaderboardData = [
    { rank: 1, name: 'Nishant Kumar', id: 'Mechanic ID', city: 'Delhi', jobs: 30, payout: '₹30,000', avail: "21 Jan' 26", rating: 4.5, status: 'Active' },
    { rank: 2, name: 'Nishant Kumar', id: 'Mechanic ID', city: 'Delhi', jobs: 30, payout: '₹30,000', avail: "21 Jan' 26", rating: 4.5, status: 'Active' },
    { rank: 3, name: 'Nishant Kumar', id: 'Mechanic ID', city: 'Delhi', jobs: 30, payout: '₹30,000', avail: "21 Jan' 26", rating: 4.5, status: 'Active' },
    { rank: 4, name: 'Nishant Kumar', id: 'Mechanic ID', city: 'Delhi', jobs: 30, payout: '₹30,000', avail: "21 Jan' 26", rating: 4.5, status: 'Active' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hover-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .hover-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .btn-animate {
            transition: all 0.2s ease;
          }
          .btn-animate:hover {
            opacity: 0.9;
            transform: scale(1.02);
          }
          .table-row-hover {
            transition: background-color 0.2s ease;
          }
          .table-row-hover:hover {
            background-color: #f8fafc;
          }
          .perf-insights-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
          @media (max-width: 1024px) {
            .perf-insights-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      {/* Key Insights */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Key Insights</h3>
        <div className="perf-insights-grid">
          
          <InsightCard tone="blue" icon={CLOCK_ICON} title="Top Performing Mechanic" value="Rajesh Kumar">
            <Chip>500 Jobs <span style={{ color: '#6b7280', fontWeight: 400 }}>(₹5,00,000)</span></Chip>
            <ServiceBadges />
          </InsightCard>

          <InsightCard tone="blue" icon={CLOCK_ICON} title="Top Performing Service" value="Instant Booking">
            <Chip>500 Jobs <span style={{ color: '#6b7280', fontWeight: 400 }}>(38% Revenue)</span></Chip>
          </InsightCard>

          <InsightCard tone="red" icon={CLOCK_ICON} title="Low Performing Mechanics" value="12">
            <Chip>22% <span style={{ color: '#6b7280', fontWeight: 400 }}>cancellation</span></Chip>
            <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'underline', whiteSpace: 'nowrap' }} className="btn-animate">
              Download List <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
          </InsightCard>

        </div>
      </div>

      {/* Performance Trend */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>Performance Trend</h3>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => setIsCompare(!isCompare)}
              className="btn-animate"
              style={{ backgroundColor: isCompare ? '#374151' : '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Compare <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5"></path><path d="M21 3l-7 7"></path><path d="M8 21H3v-5"></path><path d="M3 21l7-7"></path></svg>
            </button>
            
            {isCompare ? (
              <>
                <select 
                  value={compareMode}
                  onChange={(e) => setCompareMode(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none' }}
                >
                  <option>By Service</option>
                  <option>By Time</option>
                </select>
                {compareMode === 'By Service' ? (
                  <>
                    <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', backgroundColor: '#fff7ed', color: '#f97316' }}>
                      <option>Select Service 1</option>
                    </select>
                    <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                      <option>Select Service 2</option>
                    </select>
                  </>
                ) : (
                  <>
                    <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none' }}>
                      <option>Demo Service</option>
                    </select>
                    <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', backgroundColor: '#fff7ed', color: '#f97316' }}>
                      <option>Yesterday</option>
                    </select>
                    <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                      <option>Last 3 Weeks</option>
                    </select>
                  </>
                )}
              </>
            ) : (
              <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none' }}>
                <option>Demo Service</option>
              </select>
            )}
          </div>
        </div>

        <div style={{ height: '300px', width: '100%', animation: 'fadeIn 0.8s ease' }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            {isCompare ? (
              <AreaChart data={compareData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCat1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="colorCat2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={AXIS_TICK_STYLE} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                  domain={[0, 10000]}
                  ticks={AXIS_TICKS}
                  tickFormatter={formatAxisTick}
                  label={AXIS_LABEL}
                />
                <Tooltip cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} contentStyle={TOOLTIP_CARD} formatter={(value) => formatAmount(value)} />
                <Area type="linear" dataKey="Category2" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" fill="url(#colorCat2)" dot={{ fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} animationDuration={1000} />
                <Area type="linear" dataKey="Category1" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 4" fill="url(#colorCat1)" dot={{ fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} animationDuration={1000} />
              </AreaChart>
            ) : (
              <AreaChart data={singleLineData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} tick={AXIS_TICK_STYLE} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                  domain={[0, 10000]}
                  ticks={AXIS_TICKS}
                  tickFormatter={formatAxisTick}
                  label={AXIS_LABEL}
                />
                <Tooltip
                  cursor={false}
                  separator=""
                  labelStyle={{ display: 'none' }}
                  contentStyle={{ ...TOOLTIP_CARD, fontWeight: 700 }}
                  formatter={(value) => [formatAmount(value), '']}
                />
                <Area
                  type="linear"
                  dataKey="Orders"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  fill="url(#colorOrders)"
                  dot={{ fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mechanic Leaderboard */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Mechanic Leaderboard</h3>
        
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search by Mechanic Name" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.875rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '0.9375rem', color: '#111827' }} />
          </div>
          <button style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '2.5rem', fontSize: '0.9375rem', color: '#374151', cursor: 'pointer' }}>
            Select Time <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </button>
          <select style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '0.9375rem', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }}>
            <option>Select Service</option>
          </select>
          <button className="btn-animate" style={{ padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: 'none', backgroundColor: '#111827', color: 'white', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9375rem', fontWeight: 500, cursor: 'pointer' }}>
            Apply Filters <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="8" y2="6"></line><line x1="21" y1="12" x2="12" y2="12"></line><line x1="21" y1="18" x2="16" y2="18"></line><circle cx="5" cy="6" r="2"></circle><circle cx="9" cy="12" r="2"></circle><circle cx="13" cy="18" r="2"></circle></svg>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {LEADERBOARD_COLUMNS.map(col => (
                  <th key={col.label} style={{ padding: '1rem', fontWeight: 600, color: '#0f172a', textAlign: col.align, whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      {col.label}
                      <SortIcon />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((row, idx) => (
                <tr key={idx} className="table-row-hover" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#111827', textAlign: 'center', backgroundColor: '#f8fafc' }}>{row.rank}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f59e0b', flexShrink: 0, backgroundColor: '#f3f4f6' }}>
                        <img src="/avatar-clean.svg" alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{row.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', border: '1px dashed #93c5fd', borderRadius: '0.375rem', padding: '0.1875rem 0.375rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', whiteSpace: 'nowrap' }}>
                          Mechanic ID
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}><ServiceBadges size={32} /></div>
                  </td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500, textAlign: 'center' }}>{row.city}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500, textAlign: 'center' }}>{row.jobs}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500, textAlign: 'center', whiteSpace: 'nowrap' }}>{row.payout}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500, textAlign: 'center', whiteSpace: 'nowrap' }}>{row.avail}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#fef3c7', borderRadius: '0.5rem', padding: '0.3125rem 0.625rem', color: '#111827', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      {row.rating} <span style={{ color: '#f59e0b' }}>★</span>
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#059669', fontWeight: 500, borderRadius: '999px', padding: '0.3125rem 0.875rem', display: 'inline-block', whiteSpace: 'nowrap' }}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
