'use client';

import React, { useState, useCallback } from 'react';
import OrdersSummaryCards from './OrdersSummaryCards';
import OrdersToolbar from './OrdersToolbar';
import AllBookings from './AllBookings';
import InstantSmartBooking from './InstantSmartBooking';
import InviteQuote from './InviteQuote';
import VideoCallAssistance from './VideoCallAssistance';
import AssistedBooking from './AssistedBooking';

type TabType = 'All' | 'Instant Smart Booking' | 'Invite Quote' | 'Video Call Assistance' | 'Assisted Booking';

export default function OrdersDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [counts, setCounts] = useState<Record<string, number>>({
    All: 0,
    'Instant Smart Booking': 0,
    'Invite Quote': 0,
    'Video Call Assistance': 0,
    'Assisted Booking': 0,
  });

  const handleCounts = useCallback((newCounts: Record<string, number>) => {
    setCounts(prev => ({ ...prev, ...newCounts }));
  }, []);

  const tabs: { id: TabType; label: string; alert?: boolean }[] = [
    { id: 'All', label: 'All' },
    { id: 'Instant Smart Booking', label: 'Instant Smart Booking', alert: true },
    { id: 'Invite Quote', label: 'Invite Quote', alert: true },
    { id: 'Video Call Assistance', label: 'Video Call Assistance' },
    { id: 'Assisted Booking', label: 'Assisted Booking', alert: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .tab-btn { transition: color 0.2s, border-color 0.2s; }
        `}
      </style>

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>Service Requests</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Sewtech Mechanic <span style={{ margin: '0 0.5rem' }}>•</span> Orders/Service Requests
          </div>
        </div>
        <div>
          <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Export
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
        </div>
      </div>

      <OrdersSummaryCards />
      
      {/* Main Content Area */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        
        <OrdersToolbar />

        {/* Primary Tabs */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', paddingBottom: '2px' }}>
          {tabs.map((tab) => {
            const count = counts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tab-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0',
                  border: 'none',
                  background: 'none',
                  color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #1f2937' : '2px solid transparent',
                  marginBottom: '-2px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label} <span style={{ backgroundColor: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 500 }}>({count})</span>
                {tab.alert && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginLeft: '0.25rem' }}></div>}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'All' && <AllBookings onCounts={handleCounts} />}
        {activeTab === 'Instant Smart Booking' && <InstantSmartBooking onCounts={handleCounts} />}
        {activeTab === 'Invite Quote' && <InviteQuote onCounts={handleCounts} />}
        {activeTab === 'Video Call Assistance' && <VideoCallAssistance onCounts={handleCounts} />}
        {activeTab === 'Assisted Booking' && <AssistedBooking onCounts={handleCounts} />}

      </div>
    </div>
  );
}
