'use client';

import React, { useState } from 'react';
import PaymentsSummaryCards from './PaymentsSummaryCards';
import PaymentsToolbar from './PaymentsToolbar';
import PaymentsTable from './PaymentsTable';
import DisputeDetails from './DisputeDetails';
import RemarksModal from './RemarksModal';

type TabType = 'Payments Received' | 'Mechanic Payouts' | 'Dispute/Escalations';

export default function PaymentsDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('Payments Received');
  const [viewState, setViewState] = useState<'table' | 'details'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs: { id: TabType, label: string, count?: number, alert?: boolean }[] = [
    { id: 'Payments Received', label: 'Payments Received', count: 1, alert: true },
    { id: 'Mechanic Payouts', label: 'Mechanic Payouts', count: 1 },
    { id: 'Dispute/Escalations', label: 'Dispute/Escalations', count: 1, alert: true }
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>Payments</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Payments
          </div>
        </div>
        <div>
          <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Export
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
        </div>
      </div>

      <PaymentsSummaryCards />
      
      {/* Main Content Area */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        
        <PaymentsToolbar />

        {/* Primary Tabs (Only visible when showing table) */}
        {viewState === 'table' && (
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
        )}

        {/* Dynamic Content */}
        <div style={{ margin: viewState === 'table' ? '0 -1.5rem -1.5rem -1.5rem' : '0' }}>
          {viewState === 'table' ? (
            <PaymentsTable 
              activeTab={activeTab} 
              onViewDispute={() => setViewState('details')} 
            />
          ) : (
            <DisputeDetails 
              onBack={() => setViewState('table')} 
              onResolve={() => setIsModalOpen(true)}
              onRefund={() => setIsModalOpen(true)}
            />
          )}
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
