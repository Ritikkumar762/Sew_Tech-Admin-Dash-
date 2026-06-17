'use client';

import React, { useState } from 'react';
import OrdersSummaryCards from './OrdersSummaryCards';
import OrdersToolbar from './OrdersToolbar';
import OrdersTable from './OrdersTable';

type TabType = 'All' | 'Instant Smart Booking' | 'Invite Quote' | 'Video Call Assistance' | 'Assisted Booking';

export default function OrdersDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [activeFilter, setActiveFilter] = useState('All');

  const tabs: { id: TabType, label: string, count: number, alert?: boolean }[] = [
    { id: 'All', label: 'All', count: 1085 },
    { id: 'Instant Smart Booking', label: 'Instant Smart Booking', count: 1085, alert: true },
    { id: 'Invite Quote', label: 'Invite Quote', count: 1085, alert: true },
    { id: 'Video Call Assistance', label: 'Video Call Assistance', count: 1085 },
    { id: 'Assisted Booking', label: 'Assisted Booking', count: 1085, alert: true }
  ];

  const getFilters = (tab: TabType) => {
    switch (tab) {
      case 'Instant Smart Booking':
        return [
          { label: 'Flagged', count: 767 },
          { label: 'Delayed', count: null, active: true },
          { label: 'Support Required', count: 34 }
        ];
      case 'Assisted Booking':
        return [
          { label: 'All', count: null },
          { label: 'Call Requested', count: 767 },
          { label: 'Payment Pending', count: 767 },
          { label: 'Mechanic Allotted', count: 767 },
          { label: 'Ongoing', count: null },
          { label: 'Completed', count: null },
          { label: 'Cancelled', count: null }
        ];
      case 'Invite Quote':
        return [
          { label: 'All', count: null },
          { label: 'Bid Live', count: 767 },
          { label: 'Bid Ended', count: 767 },
          { label: 'Mechanic Selected', count: null },
          { label: 'Ongoing', count: null },
          { label: 'Completed', count: null },
        ];
      default:
        // All & Video Call
        return [
          { label: 'All', count: null },
          { label: 'Mechanic Allotted', count: 767 },
          { label: 'Ongoing', count: null },
          { label: 'Completed', count: null },
          { label: 'Diagnosis Available', count: null },
          { label: 'Cancelled', count: null }
        ];
    }
  };

  const currentFilters = getFilters(activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .tab-btn { transition: color 0.2s, border-color 0.2s; }
          .filter-pill { transition: background-color 0.2s, color 0.2s, transform 0.1s; }
          .filter-pill:hover { transform: scale(1.02); }
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveFilter(tab.id === 'Instant Smart Booking' ? 'Delayed' : 'All'); }}
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
              {tab.label} <span style={{ backgroundColor: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 500 }}>({tab.count})</span>
              {tab.alert && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginLeft: '0.25rem' }}></div>}
            </button>
          ))}
        </div>

        {/* Secondary Filter Pills */}
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
          {currentFilters.map((filter, idx) => {
            const isFilterActive = filter.label === activeFilter || filter.active;
            return (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter.label)}
                className="filter-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: isFilterActive ? '1px solid #1f2937' : '1px solid #e5e7eb',
                  backgroundColor: isFilterActive ? '#1f2937' : 'white',
                  color: isFilterActive ? 'white' : '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {filter.label} {filter.count !== null && <span style={{ color: isFilterActive ? '#9ca3af' : '#9ca3af' }}>({filter.count})</span>}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </button>
            );
          })}
        </div>

        {/* Table Container */}
        <div style={{ marginTop: '0', margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <OrdersTable activeTab={activeTab} />
        </div>

      </div>
    </div>
  );
}
