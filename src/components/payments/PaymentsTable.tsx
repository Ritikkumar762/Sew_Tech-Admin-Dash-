import React from 'react';

type TabType = 'Payments Received' | 'Mechanic Payouts' | 'Dispute/Escalations';

interface PaymentsTableProps {
  activeTab: TabType;
  onViewDispute: () => void;
}

export default function PaymentsTable({ activeTab, onViewDispute }: PaymentsTableProps) {
  
  const getMockData = () => {
    return Array(6).fill(null).map((_, i) => {
      if (activeTab === 'Payments Received') {
        return {
          id: i,
          customerName: 'Rajdhani Exports Pvt. Ltd.',
          customerId: 'Customer ID',
          transactionId: 'TXN456213178',
          amount: '₹12,000',
          date: "21 Jan' 26",
          serviceType: ['Video Call Assistance', 'Instant Smart Booking', 'Invite Quote', 'Video Call Assistance', 'Assisted Booking', 'Video Call Assistance'][i],
          status: i === 1 ? 'Failed' : 'Completed'
        };
      } else if (activeTab === 'Mechanic Payouts') {
        return {
          id: i,
          customerName: 'Nishant Kumar',
          customerId: 'Mechanic ID',
          timePeriod: "21 Jan' 26 - 28 Jan' 26",
          jobsCount: '20',
          grossAmount: '₹12,000',
          commission: '- ₹450',
          netPayout: '₹12,000'
        };
      } else {
        return {
          id: i,
          disputeId: 'STM834849',
          raisedBy: i % 2 === 0 ? 'Mechanic' : 'Customer',
          disputeeName: 'Nishant Kumar',
          issueType: ['Payout Issue', 'Payment Related Issue', 'Service Issue', 'App Related Issue', 'Payment Issue', 'Payment Issue'][i],
          status: i < 3 ? 'Active' : 'Resolved'
        };
      }
    });
  };

  const data = getMockData();

  const getStatusStyle = (status: string) => {
    if (status === 'Completed' || status === 'Resolved') return { color: '#10b981' };
    if (status === 'Failed' || status === 'Active') return { color: '#ef4444' };
    return { color: '#6b7280' };
  };

  const renderColumns = () => {
    if (activeTab === 'Payments Received') {
      return (
        <>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Customer ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Transaction ID</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Amount ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Date ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Service Type ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Payment Status ↑↓</th>
        </>
      );
    } else if (activeTab === 'Mechanic Payouts') {
      return (
        <>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Customer ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Time Period ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Jobs Count ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Gross Amount ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Commission ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Net Payout ↑↓</th>
        </>
      );
    } else {
      return (
        <>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Dispute ID ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Raised By ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Disputee Name ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Issue Type ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Status ↑↓</th>
        </>
      );
    }
  };

  const renderCells = (row: any) => {
    if (activeTab === 'Payments Received') {
      return (
        <>
          <td style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></div>
              <div>
                <div style={{ fontWeight: 600, color: '#111827' }}>{row.customerName}</div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.125rem 0.25rem', display: 'inline-block', marginTop: '0.25rem' }}>{row.customerId} <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
              </div>
            </div>
          </td>
          <td style={{ padding: '1rem', textAlign: 'center' }}>
            <span style={{ color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500 }}>{row.transactionId} <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span>
          </td>
          <td style={{ padding: '1rem', fontWeight: 600, color: '#111827', textAlign: 'center' }}>{row.amount}</td>
          <td style={{ padding: '1rem', fontWeight: 500, color: '#111827', textAlign: 'center' }}>{row.date}</td>
          <td style={{ padding: '1rem', textAlign: 'center' }}><span style={{ color: '#a855f7', backgroundColor: '#faf5ff', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 500, fontSize: '0.75rem' }}>{row.serviceType}</span></td>
          <td style={{ padding: '1rem', fontWeight: 500, textAlign: 'center', ...getStatusStyle(row.status) }}>{row.status}</td>
        </>
      );
    } else if (activeTab === 'Mechanic Payouts') {
      return (
        <>
          <td style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></div>
              <div>
                <div style={{ fontWeight: 600, color: '#111827' }}>{row.customerName}</div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.125rem 0.25rem', display: 'inline-block', marginTop: '0.25rem' }}>{row.customerId} <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
              </div>
            </div>
          </td>
          <td style={{ padding: '1rem', fontWeight: 500, color: '#111827', textAlign: 'center' }}>{row.timePeriod}</td>
          <td style={{ padding: '1rem', fontWeight: 500, color: '#111827', textAlign: 'center' }}>{row.jobsCount}</td>
          <td style={{ padding: '1rem', fontWeight: 600, color: '#111827', textAlign: 'center' }}>{row.grossAmount}</td>
          <td style={{ padding: '1rem', fontWeight: 600, color: '#ef4444', textAlign: 'center' }}>{row.commission}</td>
          <td style={{ padding: '1rem', fontWeight: 600, color: '#10b981', textAlign: 'center' }}>{row.netPayout}</td>
        </>
      );
    } else {
      return (
        <>
          <td style={{ padding: '1rem' }}>
            <span style={{ color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500 }}>{row.disputeId} <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span>
          </td>
          <td style={{ padding: '1rem', fontWeight: 500, color: '#a855f7', textAlign: 'center' }}>{row.raisedBy}</td>
          <td style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 500, color: '#111827' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></div>
              {row.disputeeName}
            </div>
          </td>
          <td style={{ padding: '1rem', fontWeight: 500, color: '#111827', textAlign: 'center' }}>{row.issueType}</td>
          <td style={{ padding: '1rem', fontWeight: 500, textAlign: 'center', ...getStatusStyle(row.status) }}>{row.status}</td>
        </>
      );
    }
  };

  return (
    <div style={{ backgroundColor: 'white', overflowX: 'auto', borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
      <style>
        {`
          .row-hover { transition: box-shadow 0.2s ease, transform 0.2s ease; background-color: white; }
          .row-hover:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-1px); position: relative; z-index: 10; }
          .btn-hover { transition: background-color 0.2s ease, transform 0.1s ease; }
          .btn-hover:hover { background-color: #f3f4f6; }
          .btn-hover:active { transform: scale(0.95); }
        `}
      </style>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ color: '#111827', borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '1rem', width: '40px' }}>
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.25rem', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
            </th>
            {renderColumns()}
            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="row-hover" style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1rem' }}><input type="checkbox" style={{ accentColor: '#111827' }} /></td>
              
              {renderCells(row)}
              
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={onViewDispute} className="btn-hover" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #111827', backgroundColor: '#111827', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </button>
                  {activeTab === 'Dispute/Escalations' && (
                    <button className="btn-hover" style={{ width: '32px', height: '32px', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
