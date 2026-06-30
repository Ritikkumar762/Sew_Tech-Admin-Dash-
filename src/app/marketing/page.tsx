'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketing } from './_hooks/useMarketing';

export default function MarketingPage() {
  const router = useRouter();
  const { campaigns, stats, loading } = useMarketing();
  const [activeTab, setActiveTab] = useState('Home Screen');

  // Dynamic tabs mapping with counts calculated from loaded campaigns
  const tabs = [
    { label: 'Home Screen', count: campaigns.filter(c => c.tabCategory === 'Home Screen').length },
    { label: 'ST Spares', count: campaigns.filter(c => c.tabCategory === 'ST Spares').length },
    { label: 'ST Mechanic', count: campaigns.filter(c => c.tabCategory === 'ST Mechanic').length },
    { label: 'ST Kaarigar', count: campaigns.filter(c => c.tabCategory === 'ST Kaarigar').length },
    { label: 'ST Exchange', count: campaigns.filter(c => c.tabCategory === 'ST Exchange').length },
    { label: 'ST Academics', count: campaigns.filter(c => c.tabCategory === 'ST Academics').length }
  ];

  const filteredCampaigns = campaigns.filter(c => c.tabCategory === activeTab);

  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-stat-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .animate-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
          border-color: #9ca3af !important;
          background-color: #fafbfc !important;
        }
        .animate-tab {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-tab:hover {
          color: #111827 !important;
          transform: translateY(-1px);
        }
        .animate-tab:active {
          transform: translateY(1px);
        }
        .animate-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .animate-button:active {
          transform: translateY(1px);
        }
        .animate-table-row {
          transition: all 0.2s ease;
        }
        .animate-table-row:hover {
          background-color: #f9fafb !important;
        }
        .animate-input {
          transition: all 0.2s ease;
        }
        .animate-input:focus {
          border-color: #111827 !important;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>All Banners</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Ads & Marketing <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>All Banners</span>
          </div>
        </div>
        <button className="btn btn-dark animate-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111827', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
          Export 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
        {stats.map((stat, i) => (
          <div key={i} className="animate-stat-card" style={{ flex: 1, minWidth: '150px', borderRight: i < stats.length - 1 ? '1px solid #e5e7eb' : 'none', padding: '1rem', borderRadius: '0.375rem', border: '1px solid transparent' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{stat.value}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontWeight: 500 }}>
              {stat.label}
              {stat.trend && <span style={{ color: stat.color, fontWeight: 600, fontSize: '0.75rem' }}>{stat.trend}</span>}
              {stat.trendLabel && <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{stat.trendLabel}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Search by Banner Name" 
            className="animate-input"
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }} 
          />
        </div>
        <div className="animate-button" style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem 1rem', background: '#fff', cursor: 'pointer', gap: '0.5rem' }}>
          <span style={{ color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>Created on</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          <div style={{ borderLeft: '1px solid #e5e7eb', height: '100%', margin: '0 0.5rem' }}></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', gap: '2rem', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <div 
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="animate-tab"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                cursor: 'pointer', 
                paddingBottom: '1rem',
                marginBottom: '-1rem',
                borderBottom: activeTab === tab.label ? '2px solid #111827' : '2px solid transparent',
                color: activeTab === tab.label ? '#111827' : '#6b7280',
                fontWeight: activeTab === tab.label ? 600 : 500,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
              <span style={{ 
                background: activeTab === tab.label ? '#ef4444' : '#f3f4f6', 
                color: activeTab === tab.label ? '#fff' : '#6b7280', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {tab.count}
              </span>
            </div>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', width: '40px' }}>
                  <input type="checkbox" style={{ accentColor: '#3b82f6', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                </th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem' }}>Spare Name <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Campaign Date <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Impressions L30D <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Current Impressions <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Current Clicks <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Current CTR <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                    No banners found for <strong style={{ color: '#6b7280' }}>{activeTab}</strong>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign, idx) => (
                  <tr key={campaign.id} className="animate-table-row" style={{ borderBottom: '1px solid #e5e7eb', animation: `fadeInUp 0.3s ease-out ${idx * 0.05}s both` }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <input type="checkbox" style={{ accentColor: '#3b82f6', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{campaign.spareName}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#111827', textAlign: 'center', fontWeight: 600 }}>{campaign.startDate} - {campaign.endDate}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600 }}>{campaign.impressionsL30D}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600 }}>{campaign.currentImpressions}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: 600 }}>{campaign.currentClicks}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{campaign.currentCTR}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => router.push(`/marketing/${campaign.id}`)}
                          className="animate-button"
                          style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#111827', padding: '6px 12px', borderRadius: '24px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        >
                          Update
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        </button>
                        <button style={{ border: 'none', background: '#111827', color: '#fff', padding: '6px 12px', borderRadius: '24px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          View
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
