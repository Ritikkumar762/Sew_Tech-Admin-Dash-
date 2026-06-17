import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
        `}
      </style>

      {/* Key Insights */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Key Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          
          <div className="hover-card" style={{ backgroundColor: '#f0fdf4', borderRadius: '0.5rem', padding: '1.25rem', border: '1px solid #dcfce7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Top Performing Mechanic
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Rajesh Kumar</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'white', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                500 Jobs <span style={{ color: '#6b7280', fontWeight: 400 }}>(₹5,00,000)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
              </div>
            </div>
          </div>

          <div className="hover-card" style={{ backgroundColor: '#eff6ff', borderRadius: '0.5rem', padding: '1.25rem', border: '1px solid #dbeafe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Top Performing Service
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Instant Booking</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'white', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                500 Jobs <span style={{ color: '#6b7280', fontWeight: 400 }}>(38% Revenue)</span>
              </div>
            </div>
          </div>

          <div className="hover-card" style={{ backgroundColor: '#fef2f2', borderRadius: '0.5rem', padding: '1.25rem', border: '1px solid #fee2e2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Low Performing Mechanics
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>12</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'white', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                22% <span style={{ color: '#6b7280', fontWeight: 400 }}>cancellation</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="btn-animate">
                Download List <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
            </div>
          </div>

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
          <ResponsiveContainer>
            {isCompare ? (
              <AreaChart data={compareData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCat1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCat2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }} />
                <Tooltip cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="Category2" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorCat2)" activeDot={{ r: 6 }} animationDuration={1000} />
                <Area type="monotone" dataKey="Category1" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorCat1)" activeDot={{ r: 6 }} animationDuration={1000} />
              </AreaChart>
            ) : (
              <AreaChart data={singleLineData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }} />
                <Tooltip cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Orders']} />
                <Area type="monotone" dataKey="Orders" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorOrders)" activeDot={{ r: 6 }} animationDuration={1000} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mechanic Leaderboard */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>Mechanic Leaderboard</h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search by Mechanic Name" style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '0.875rem' }} />
          </div>
          <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', cursor: 'pointer' }}>
            Select Time <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </button>
          <select style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '0.875rem', color: '#4b5563' }}>
            <option>Select Service</option>
          </select>
          <button className="btn-animate" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            Apply Filters <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Rank ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Mechanic ID ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Service Type ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>City Coverage ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Jobs Completed ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Net Payout ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Availability ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Rating ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Status ↑↓</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((row, idx) => (
                <tr key={idx} className="table-row-hover" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>{row.rank}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                        {/* Placeholder avatar */}
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#fbbf24' }}></div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{row.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.125rem 0.25rem', display: 'inline-block', marginTop: '0.25rem' }}>Mechanic ID <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{row.city}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{row.jobs}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{row.payout}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{row.avail}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 600 }}>{row.rating} <span style={{ color: '#fbbf24' }}>★</span></td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 500 }}>{row.status}</span>
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
