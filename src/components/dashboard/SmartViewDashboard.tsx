'use client';

import { useState } from 'react';
import SummaryCards from './SummaryCards';
import RequestInsights from './RequestInsights';
import RevenueInsights from './RevenueInsights';
import PerformanceInsights from './PerformanceInsights';

import { exportToCSV } from '@/lib/api';

export default function SmartViewDashboard() {
  const [activeTab, setActiveTab] = useState<'request' | 'revenue' | 'performance'>('request');

  const handleExport = () => {
    // Generate a comprehensive daily status report over 50 days
    const rows = Array(50).fill(null).map((_, i) => {
      const dateVal = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
      const baseOrders = 50 + (i % 25) * 5;
      const baseRevenue = baseOrders * 450;
      return {
        'Date': dateVal,
        'Care Services - Total Bookings': String(baseOrders),
        'Care Services - Revenue': `₹${baseRevenue.toLocaleString('en-IN')}`,
        'ST Spares - Total Bookings': String(Math.floor(baseOrders * 0.7)),
        'ST Spares - Revenue': `₹${Math.floor(baseRevenue * 0.6).toLocaleString('en-IN')}`,
        'Active Mechanics': String(25 + (i % 10)),
        'NPS Rating': (4.2 + (i % 9) * 0.1).toFixed(1) + '★',
        'Customer Satisfaction': (90 + (i % 11)) + '%',
        'Cancelled Bookings': String(1 + (i % 5))
      };
    });

    exportToCSV('smart_view_daily_performance', rows);
  };

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
          <button onClick={handleExport} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/Export button _logo.svg" alt="Export" style={{ width: '112px', height: '40px', display: 'block' }} />
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
