'use client';

import { useState } from 'react';
import SummaryCards from './SummaryCards';
import RequestInsights from './RequestInsights';
import RevenueInsights from './RevenueInsights';
import PerformanceInsights from './PerformanceInsights';

export default function SmartViewDashboard() {
  const [activeTab, setActiveTab] = useState<'request' | 'revenue' | 'performance'>('request');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>Smart View Dashboard</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Sewtech Mechanic <span style={{ margin: '0 0.5rem' }}>•</span> Overview
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', outline: 'none', cursor: 'pointer', fontWeight: 500 }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
          <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Export
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
        <SummaryCards />

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e5e7eb', marginTop: '2rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'request', label: 'Request Insights' },
            { id: 'revenue', label: 'Revenue Insights' },
            { id: 'performance', label: 'Performance Insights' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 0',
                border: 'none',
                background: 'none',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {activeTab === 'request' && <RequestInsights />}
          {activeTab === 'revenue' && <RevenueInsights />}
          {activeTab === 'performance' && <PerformanceInsights />}
        </div>
      </div>
    </div>
  );
}
