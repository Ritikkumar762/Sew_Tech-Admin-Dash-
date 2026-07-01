'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type TabType = 'All' | 'Instant Smart Booking' | 'Invite Quote' | 'Video Call Assistance' | 'Assisted Booking';

interface OrdersTableProps {
  activeTab: TabType;
  activeFilter: string;
}

export default function OrdersTable({ activeTab, activeFilter }: OrdersTableProps) {
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mock data tailored for the different tabs
  const getMockData = () => {
    const allRows = Array(16).fill(null).map((_, i) => {
      const status = getStatusForTab(activeTab, i);
      const isNoMechanic = ['Cancelled', 'Requested', 'Booked', 'Bid Live', 'Bid Ended'].includes(status);
      return {
        id: `REQ-${i}`,
        orderId: 'Aditya Bhargav',
        reqIdText: 'Request ID',
        serviceType: activeTab === 'All' ? ['Instant Smart Booking', 'Video Call Assistance', 'Assisted Booking', 'Invite Quote'][i % 4] : activeTab,
        location: i % 2 === 0 ? 'Delhi' : 'Bangalore',
        createdOn: "10:30 PM, 21 Jan' 26",
        mechanic: isNoMechanic ? '-' : 'Abhishek Pal',
        status: status,
        bidEnds: i % 2 === 0 ? '⏳ 24:15:10' : '⏳ 02:05:10',
        bidEndsDanger: i % 2 !== 0,
        quoteSelected: 'Abhishek Pal'
      };
    });

    if (!activeFilter || activeFilter === 'All') {
      return allRows;
    }

    return allRows.filter(row => {
      const status = row.status.toLowerCase();
      const filter = activeFilter.toLowerCase();
      
      if (filter === 'mechanic allotted') {
        return ['mechanic allotted', 'mechanic assigned', 'mechanic selected'].includes(status);
      }
      if (filter === 'flagged') {
        return row.id.endsWith('1') || row.id.endsWith('3') || row.id.endsWith('5') || row.id.endsWith('7');
      }
      if (filter === 'delayed') {
        return row.id.endsWith('0') || row.id.endsWith('2') || row.id.endsWith('4') || row.id.endsWith('6');
      }
      if (filter === 'support required') {
        return row.id.endsWith('2') || row.id.endsWith('5') || row.id.endsWith('8');
      }
      if (filter === 'call requested') {
        return row.id.endsWith('1') || row.id.endsWith('4') || row.id.endsWith('9');
      }
      if (filter === 'payment pending') {
        return row.id.endsWith('0') || row.id.endsWith('3') || row.id.endsWith('7');
      }
      
      return status === filter;
    });
  };

  const getStatusForTab = (tab: TabType, idx: number) => {
    if (tab === 'Instant Smart Booking' || tab === 'All') {
      const statuses = ['Mechanic Assigned', 'Requested', 'Cancelled', 'Completed', 'Booked', 'Mechanic Allotted', 'Ongoing', 'Diagnosis Available'];
      return statuses[idx % statuses.length];
    }
    if (tab === 'Invite Quote') {
      const statuses = ['Bid Live', 'Bid Ended', 'Mechanic Selected', 'Ongoing', 'Completed', 'Diagnosis Available', 'Cancelled'];
      return statuses[idx % statuses.length];
    }
    return ['Booked', 'Mechanic Allotted', 'Ongoing', 'Completed', 'Cancelled'][idx % 5];
  };

  const data = getMockData();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Mechanic Assigned':
      case 'Mechanic Allotted':
      case 'Mechanic Selected':
        return { bg: '#eff6ff', color: '#3b82f6' };
      case 'Requested':
      case 'Bid Live':
        return { bg: '#fef9c3', color: '#eab308' };
      case 'Cancelled':
        return { bg: '#fee2e2', color: '#ef4444' };
      case 'Completed':
        return { bg: '#dcfce7', color: '#10b981' };
      case 'Booked':
        return { bg: '#fef3c7', color: '#f59e0b' };
      case 'Ongoing':
        return { bg: '#cffafe', color: '#0891b2' };
      case 'Diagnosis Available':
        return { bg: '#fae8ff', color: '#d946ef' };
      case 'Bid Ended':
        return { bg: '#ffe4e6', color: '#e11d48' };
      default:
        return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const renderColumns = () => {
    if (activeTab === 'All' || activeTab === 'Instant Smart Booking') {
      return (
        <>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Service Type ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Location ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Created On ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Mechanic Assigned ↑↓</th>
        </>
      );
    } else if (activeTab === 'Invite Quote') {
      return (
        <>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Location ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Created On ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Bid Ends ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Quote Selected ↑↓</th>
        </>
      );
    } else {
      return (
        <>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Location ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Created On ↑↓</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Mechanic Assigned ↑↓</th>
        </>
      );
    }
  };

  const renderCells = (row: any) => {
    if (activeTab === 'All' || activeTab === 'Instant Smart Booking') {
      return (
        <>
          <td style={{ padding: '1rem' }}><span style={{ color: '#3b82f6', backgroundColor: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 500, fontSize: '0.75rem' }}>{row.serviceType}</span></td>
          <td style={{ padding: '1rem', fontWeight: 500 }}>{row.location}</td>
          <td style={{ padding: '1rem', fontWeight: 500 }}>{row.createdOn}</td>
          <td style={{ padding: '1rem' }}>
            {row.mechanic !== '-' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/avatar-clean.svg" alt={row.mechanic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {row.mechanic}
              </div>
            ) : <span style={{ fontWeight: 500 }}>-</span>}
          </td>
        </>
      );
    } else if (activeTab === 'Invite Quote') {
      return (
        <>
          <td style={{ padding: '1rem', fontWeight: 500 }}>{row.location}</td>
          <td style={{ padding: '1rem', fontWeight: 500 }}>{row.createdOn}</td>
          <td style={{ padding: '1rem', fontWeight: 500, color: row.bidEndsDanger ? '#ef4444' : '#4b5563' }}>{row.bidEnds}</td>
          <td style={{ padding: '1rem' }}>
            {row.quoteSelected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/avatar-clean.svg" alt={row.quoteSelected} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {row.quoteSelected}
              </div>
            ) : <span style={{ fontWeight: 500 }}>-</span>}
          </td>
        </>
      );
    } else {
      return (
        <>
          <td style={{ padding: '1rem', fontWeight: 500 }}>{row.location}</td>
          <td style={{ padding: '1rem', fontWeight: 500 }}>{row.createdOn}</td>
          <td style={{ padding: '1rem' }}>
            {row.mechanic !== '-' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/avatar-clean.svg" alt={row.mechanic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {row.mechanic}
              </div>
            ) : <span style={{ fontWeight: 500 }}>-</span>}
          </td>
        </>
      );
    }
  };

  return (
    <div style={{ backgroundColor: 'white', overflow: 'hidden' }}>
      <style>
        {`
          .row-hover { transition: box-shadow 0.2s ease, transform 0.2s ease; }
          .row-hover:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-1px); position: relative; z-index: 10; background-color: white; }
          .expand-anim { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; overflow: hidden; }
          .btn-hover { transition: background-color 0.2s ease, transform 0.1s ease; }
          .btn-hover:hover { background-color: #f3f4f6; }
          .btn-hover:active { transform: scale(0.95); }
        `}
      </style>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#111827', borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '1rem', width: '40px' }}><input type="checkbox" style={{ accentColor: '#111827' }} /></th>
            <th style={{ padding: '1rem', fontWeight: 600 }}>Order ↑↓</th>
            {renderColumns()}
            <th style={{ padding: '1rem', fontWeight: 600 }}>Status ↑↓</th>
            <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const isExpanded = expandedRows[row.id];
            const statusColor = getStatusColor(row.status);
            
            return (
              <React.Fragment key={row.id}>
                <tr className="row-hover" style={{ borderBottom: isExpanded ? 'none' : '1px solid #f3f4f6', borderLeft: isExpanded ? '3px solid #2563eb' : '3px solid transparent' }}>
                  <td style={{ padding: '1rem' }}><input type="checkbox" style={{ accentColor: '#111827' }} /></td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/avatar-clean.svg" alt={row.orderId} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827', cursor: 'pointer' }} onClick={() => toggleRow(row.id)}>{row.orderId}</div>
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.125rem 0.25rem', display: 'inline-block', marginTop: '0.25rem', cursor: 'pointer' }}>{row.reqIdText} <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
                      </div>
                    </div>
                  </td>
                  
                  {renderCells(row)}
                  
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: statusColor.bg, color: statusColor.color, padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 600, fontSize: '0.75rem', display: 'inline-block' }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-hover" onClick={() => router.push(`/mechanic/orders/${row.id}?serviceType=${encodeURIComponent(row.serviceType)}&status=${encodeURIComponent(row.status)}`)} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        View <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </button>
                      <button className="btn-hover" style={{ width: '32px', height: '32px', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expanded Details Row */}
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div className="expand-anim" style={{ maxHeight: isExpanded ? '200px' : '0', opacity: isExpanded ? 1 : 0 }}>
                      <div style={{ padding: '0 1rem 1.5rem 4.5rem', display: 'flex', gap: '1.5rem', borderLeft: '3px solid #2563eb', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', flex: 1 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Machine Details:</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Juki Single Needle Lockstitch <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>HCS000</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', flex: 2 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Issue Details:</div>
                          <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5 }}>
                            Machine fault description will come here, in more than 2 lines. Machine fault description will come here, in more than 2 lines. Machine fault description will come here, in more than 2 lines. Machine fault description will come here... <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>Read More</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination Footer */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>Rows per page: <select style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#374151', cursor: 'pointer' }}><option>10</option></select></div>
          <div>1-10 of 165</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#d1d5db' }}>❮</button>
          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#374151' }}>❯</button>
        </div>
      </div>
    </div>
  );
}
