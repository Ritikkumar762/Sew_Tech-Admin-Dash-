'use client';

import React, { useState } from 'react';
import PaymentsSummaryCards from './PaymentsSummaryCards';
import PaymentsToolbar from './PaymentsToolbar';
import PaymentsTable from './PaymentsTable';
import DisputeDetails from './DisputeDetails';
import RemarksModal from './RemarksModal';
import { exportToCSV } from '@/lib/api';

type TabType = 'Payments Received' | 'Mechanic Payouts' | 'Dispute/Escalations';

export default function PaymentsDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('Payments Received');
  const [viewState, setViewState] = useState<'table' | 'details'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = () => {
    // Generate 50 detailed entries dynamically for a comprehensive Excel sheet
    const rows = Array(50).fill(null).map((_, i) => {
      const dateVal = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
      if (activeTab === 'Payments Received') {
        return {
          'Transaction ID': `TXN${456213178 + i}`,
          'Customer Name': ['Rajdhani Exports Pvt. Ltd.', 'Stitch Well', 'Balaji Logistics', 'Karan Johar', 'Aditya Bhargav'][i % 5],
          'Customer ID': `CUST-${2041 + i}`,
          'Amount': `₹${(1000 + i * 250).toLocaleString('en-IN')}`,
          'Date': dateVal,
          'Service Type': ['Video Call Assistance', 'Instant Smart Booking', 'Invite Quote', 'Assisted Booking'][i % 4],
          'Status': i % 8 === 0 ? 'FAILED' : 'SUCCESS'
        };
      } else if (activeTab === 'Mechanic Payouts') {
        const gross = 15000 + i * 500;
        return {
          'Payout ID': `PAY-${9000 + i}`,
          'Mechanic Name': ['Nishant Kumar', 'Anand Sharma', 'Rakesh Yadav', 'Suresh Raina', 'Amit Shah'][i % 5],
          'Mechanic ID': `MECH-${3041 + i}`,
          'Time Period': `${dateVal} - Present`,
          'Jobs Count': String(10 + (i % 15)),
          'Gross Amount': `₹${gross.toLocaleString('en-IN')}`,
          'Commission (15%)': `₹${(gross * 0.15).toLocaleString('en-IN')}`,
          'Net Payout': `₹${(gross * 0.85).toLocaleString('en-IN')}`,
          'Status': i % 10 === 0 ? 'PENDING' : 'PAID'
        };
      } else {
        return {
          'Dispute ID': `DIS-${5000 + i}`,
          'Raised By': i % 2 === 0 ? 'Mechanic' : 'Customer',
          'Disputee Name': ['Nishant Kumar', 'Anand Sharma', 'Aditya Bhargav', 'Priya Patel'][i % 4],
          'Issue Type': ['Payout Issue', 'Payment Related Issue', 'Service Issue', 'App Related Issue'][i % 4],
          'Date Raised': dateVal,
          'Status': i % 3 === 0 ? 'ACTIVE' : 'RESOLVED',
          'Assigned Agent': ['Karan S.', 'Rohan M.', 'Priya G.'][i % 3]
        };
      }
    });

    exportToCSV(`payments_report_${activeTab.toLowerCase().replace(/[\/\s]+/g, '_')}`, rows);
  };

  const tabs: { id: TabType, label: string, count?: number, alert?: boolean }[] = [
    { id: 'Payments Received', label: 'Payments Received', count: 1, alert: true },
    { id: 'Mechanic Payouts', label: 'Mechanic Payouts', count: 1 },
    { id: 'Dispute/Escalations', label: 'Dispute/Escalations', count: 1, alert: true }
  ];

  if (viewState === 'details') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out', width: '100%' }}>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
        <DisputeDetails 
          onBack={() => setViewState('table')} 
          onResolve={() => setIsModalOpen(true)}
          onRefund={() => setIsModalOpen(true)}
        />
        <RemarksModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={() => {
            setIsModalOpen(false);
            setViewState('table'); // Go back to table after resolving
          }}
        />
      </div>
    );
  }

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>Payments</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Payments
          </div>
        </div>
        <div>
          <button onClick={handleExport} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/Export button _logo.svg" alt="Export" style={{ width: '112px', height: '40px', display: 'block' }} />
          </button>
        </div>
      </div>

      <PaymentsSummaryCards />
      
      {/* Main Content Area */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        
        <PaymentsToolbar />

        {/* Primary Tabs (Only visible when showing table) */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', paddingBottom: '2px', marginBottom: '1rem' }}>
          {tabs.map((tab) => (
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
                color: activeTab === tab.id ? '#1f2937' : '#9ca3af',
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #1f2937' : '2px solid transparent',
                marginBottom: '-2px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label} {tab.count && <span style={{ backgroundColor: activeTab === tab.id && tab.alert ? '#ef4444' : '#f1f5f9', color: activeTab === tab.id && tab.alert ? 'white' : '#64748b', padding: '0.125rem 0.375rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <PaymentsTable 
            activeTab={activeTab} 
            onViewDispute={() => setViewState('details')} 
          />
        </div>

      </div>

      <RemarksModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={() => {
          setIsModalOpen(false);
          setViewState('table'); // Go back to table after resolving
        }}
      />
    </div>
  );
}
