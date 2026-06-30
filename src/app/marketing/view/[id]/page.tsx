'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { apiClient, ENDPOINTS } from '@/lib';

// Dummy data for the chart
const chartData = [
  { name: '1 Feb', impressions: 7800, clicks: 4900, converts: 3100 },
  { name: '2 Feb', impressions: 6800, clicks: 4200, converts: 2800 },
  { name: '3 Feb', impressions: 8800, clicks: 5900, converts: 4100 },
  { name: '4 Feb', impressions: 8900, clicks: 5800, converts: 4200 },
  { name: '5 Feb', impressions: 7900, clicks: 4800, converts: 3100 },
  { name: '6 Feb', impressions: 6600, clicks: 3700, converts: 1900 },
  { name: '7 Feb', impressions: 7800, clicks: 4800, converts: 3100 },
  { name: '8 Feb', impressions: 8900, clicks: 5900, converts: 4100 },
  { name: '9 Feb', impressions: 6900, clicks: 4100, converts: 2300 },
  { name: '10 Feb', impressions: 5900, clicks: 3000, converts: 1200 },
  { name: '11 Feb', impressions: 8800, clicks: 5900, converts: 4100 },
];

export default function ViewBannerPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params?.id as string;
  const [bannerName, setBannerName] = useState<string>('ST Spares Banner 1');
  const [endDate, setEndDate] = useState<string>('29.03.26');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    impressions: '1500',
    clicks: '500',
    ctr: '50%',
    conversions: '200',
    impressionsFunnel: '1000',
    clicksFunnel: '200',
    convertsFunnel: '150'
  });

  useEffect(() => {
    if (!bannerId) return;

    if (bannerId === 'banner-hs-1') {
      setBannerName('Hero Banner — Summer Sale');
    } else {
      setBannerName('ST Spares Banner 1');
    }

    if (bannerId.startsWith('banner-')) {
      return;
    }

    const fetchBannerDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ success: boolean; data: any }>(ENDPOINTS.marketing.creativeById(bannerId));
        if (response && response.success && response.data) {
          const c = response.data;
          const name = c.name || c.title || 'ST Spares Banner 1';
          setBannerName(name);
          setEndDate(c.date || (c.startDate ? c.startDate.split(',')[0] : '29.03.26'));
          
          const idNum = parseInt(c.id?.replace(/\D/g, '') || '0') || 5;
          setStats({
            impressions: c.currentImpressions || '1500',
            clicks: c.currentClicks || '500',
            ctr: c.currentCTR || '50%',
            conversions: c.conversions || '200',
            impressionsFunnel: c.impressionsL30D || `${(idNum % 3 + 1) * 0.85 + 0.5}`.substring(0, 4) + 'L',
            clicksFunnel: c.currentClicks || ((idNum % 5 + 1) * 7500).toLocaleString(),
            convertsFunnel: c.conversions || '150'
          });
        }
      } catch (err) {
        console.error('Failed to fetch banner details for view page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerDetails();
  }, [bannerId]);

  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', color: '#111827' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-card {
          flex: 1;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }
        .stat-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-action {
          background: #fff;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .funnel-path {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{bannerName}</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Ads & Marketing <span>•</span> All Banners <span>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>{bannerName}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-action">
            Update <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.6-6.4L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 1 0-2.6 6.4L3 16"/></svg>
          </button>
          <button className="btn-action" onClick={() => router.push('/marketing/' + bannerId)}>
            Edit <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button className="btn-action" style={{ background: '#111827', color: '#fff', border: 'none' }}>
            Export <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <span style={{ fontWeight: 600, color: '#4b5563' }}>Impressions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.impressions}</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 19-9-9 19-2-8-8-2Z"/></svg>
              </div>
              <span style={{ fontWeight: 600, color: '#4b5563' }}>Clicks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.clicks}</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <span style={{ fontWeight: 600, color: '#4b5563' }}>CTR</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.ctr}</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: '#d1fae5' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <span style={{ fontWeight: 600, color: '#4b5563' }}>Conversions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.conversions}</div>
        </div>
      </div>

      {/* Middle Section */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Banner Performance Funnel */}
        <div style={{ flex: '2 1 600px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Banner Performance Funnel</h2>
          
          <div style={{ display: 'flex', height: '180px', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            
            {/* Column 1: Impressions */}
            <div style={{ flex: 1, zIndex: 3, position: 'relative', background: '#ffffff', boxShadow: '4px 0 15px -3px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ padding: '1rem', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Impressions</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827' }}>{stats.impressionsFunnel}</div>
              </div>
              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '110px', zIndex: 1 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,20 L75,20 C95,20 95,50 100,50 L100,100 L0,100 Z" fill="#85aef2" />
              </svg>
            </div>

            {/* Column 2: Clicks */}
            <div style={{ flex: 1, zIndex: 2, position: 'relative', background: '#f8fafc', boxShadow: '4px 0 15px -3px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ padding: '1rem', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Clicks</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
                    <span style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>CTR: 80%</span>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827' }}>{stats.clicksFunnel}</div>
              </div>
              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '110px', zIndex: 1 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,50 L75,50 C95,50 95,75 100,75 L100,100 L0,100 Z" fill="#0062cc" />
              </svg>
            </div>

            {/* Column 3: Converts */}
            <div style={{ flex: 1, zIndex: 1, position: 'relative', background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1rem', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Converts</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> 5% <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L7D)</span>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827' }}>{stats.convertsFunnel}</div>
              </div>
              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '110px', zIndex: 1 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,75 L100,75 L100,100 L0,100 Z" fill="#004bb5" />
              </svg>
            </div>

          </div>
        </div>

        {/* Banner Preview Placeholder */}
        <div style={{ flex: '1 1 300px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{bannerName} - {endDate}</h2>
          <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '0.5rem', minHeight: '150px' }}>
             {/* Empty placeholder for preview as per design */}
          </div>
        </div>
      </div>

      {/* Bottom Section - Performance Trend */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Performance Trend</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></div> Impressions</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div> Clicks</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div> Converts</div>
            </div>
            <button className="btn-action" style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.4rem 0.75rem' }}>
              Compare <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
            </button>
          </div>
        </div>

        <div style={{ height: '300px', width: '100%', position: 'relative' }}>
          {/* Using AreaChart to mimic the dotted lines with fills */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                label={{ value: 'Orders', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12, fontWeight: 600, dy: 30 }}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
                dx={-10}
                domain={[0, 10000]}
                ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '0.875rem', fontWeight: 600 }}
                labelStyle={{ color: '#111827', fontWeight: 700, marginBottom: '0.5rem' }}
              />
              <Area type="monotone" dataKey="impressions" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorImp)" activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorClick)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="converts" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorConv)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
