'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight,
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  X
} from 'lucide-react';

import { downloadOrderInvoice } from '@/lib/api';

interface RequestDetailProps {
  request: {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    orderValue: number;
    status: string;
    paymentMethod: string;
    txnId: string;
    reason: string;
  };
  onUpdateStatus: (status: string) => void;
  onCancelRequest: () => void;
  showCancelModal: boolean;
  setShowCancelModal: (show: boolean) => void;
  copiedText: string | null;
  handleCopy: (text: string, type: string) => void;
}

const getTimelineState = (nodeTitle: string, currentStatus: string) => {
  switch (nodeTitle) {
    case 'Order Received':
    case 'Payment Completed':
    case 'Order Shipped':
    case 'Out for Delivery':
    case 'Delivered':
    case 'Replacement Requested':
      return { completed: true, error: false };
    case 'Picked':
      if (currentStatus === 'Pickup Failed') {
        return { completed: false, error: true };
      }
      return { completed: currentStatus === 'Pickup Scheduled', error: false };
    case 'Completed':
      return { completed: currentStatus === 'Pickup Scheduled', error: false };
    default:
      return { completed: false, error: false };
  }
};

const formatTimelineDate = (date: Date) => {
  const day = date.getDate();
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}${suffix} ${monthName}, ${year} at ${hours}:${minutes} ${ampm}`;
};

export default function RequestDetailReplacement({
  request,
  onUpdateStatus,
  onCancelRequest,
  showCancelModal,
  setShowCancelModal,
  copiedText,
  handleCopy
}: RequestDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'replacementDetails' | 'summary' | 'tracking'>('replacementDetails');
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const timelineScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      const scrollAmount = 200;
      timelineScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [timelineDates, setTimelineDates] = useState<string[]>([]);
  useEffect(() => {
    const now = new Date();
    const dates = [
      formatTimelineDate(new Date(now.getTime() - 7 * 3600000)),
      formatTimelineDate(new Date(now.getTime() - 6 * 3600000)),
      formatTimelineDate(new Date(now.getTime() - 5 * 3600000)),
      formatTimelineDate(new Date(now.getTime() - 4 * 3600000)),
      formatTimelineDate(new Date(now.getTime() - 3 * 3600000)),
      formatTimelineDate(new Date(now.getTime() - 2 * 3600000)),
      formatTimelineDate(new Date(now.getTime() - 1 * 3600000)),
      formatTimelineDate(now),
    ];
    setTimelineDates(dates);
  }, []);

  const handleInitiateReplacementClick = () => {
    onUpdateStatus('Replacement In Process');
    alert('Replacement initiated!');
  };

  const products = [
    { name: 'High-Speed Rotary Hook Assembly', code: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 },
    { name: 'High-Speed Rotary Hook Assembly', code: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 },
    { name: 'High-Speed Rotary Hook Assembly', code: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Info Detail */}
      <div className="detail-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => router.push('/spares/alerts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#4b5563',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{request.customerName}</h2>
            
            <div 
              onClick={() => handleCopy(request.id.toUpperCase(), 'requestId')}
              style={{
                fontSize: '0.75rem',
                color: '#2563eb',
                border: '1px dashed #bfdbfe',
                borderRadius: '0.375rem',
                padding: '0.125rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                backgroundColor: '#eff6ff',
                fontWeight: 600,
                position: 'relative'
              }}
            >
              {request.id.toUpperCase()}
              {copiedText === 'requestId' ? <Check size={10} style={{ color: '#16a34a' }} /> : <Copy size={10} />}
            </div>

            <span className="badge badge-process">
              Replacement in Process
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', alignItems: 'center' }}>
            <button 
              onClick={() => downloadOrderInvoice(request.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Invoice
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>

            <button 
              onClick={handleInitiateReplacementClick}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#111827',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Initiate Replacement
            </button>

            <button 
              onClick={() => setShowCancelModal(true)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Cancel Request
            </button>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Email ID:</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', wordBreak: 'break-all' }}>{request.email}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Phone Number:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{request.phone}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', padding: '1px' }}>
                <Check size={10} strokeWidth={4} />
              </div>
              <button 
                className="copy-btn" 
                onClick={() => handleCopy(request.phone, 'phone')}
                title="Copy Phone Number"
              >
                {copiedText === 'phone' ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Payment Method:</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{request.paymentMethod}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Order Value:</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>₹{request.orderValue.toLocaleString('en-IN')}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Status:</div>
            <span className="badge badge-orange">
              {request.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('replacementDetails')}
          className={`tab-btn ${activeTab === 'replacementDetails' ? 'tab-btn-active' : ''}`}
        >
          Replacement Request Details
        </button>
        <button 
          onClick={() => setActiveTab('summary')}
          className={`tab-btn ${activeTab === 'summary' ? 'tab-btn-active' : ''}`}
        >
          Order Summary
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`tab-btn ${activeTab === 'tracking' ? 'tab-btn-active' : ''}`}
        >
          Tracking & Billing Details
        </button>
      </div>

      {/* Content */}
      {activeTab === 'replacementDetails' && (
        <div className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Replacement Request Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Reason Selected</label>
              <div style={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>
                {request.reason}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Supporting Media</label>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="media-box">
                    <img src="/rotary-hook.png" alt="Supporting Media" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
                    <button 
                      className="media-zoom-overlay" 
                      onClick={() => setZoomImage('/rotary-hook.png')}
                      style={{ cursor: 'pointer' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="detail-card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem' }}>Order Summary</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Product ↑↓</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Spare Price ↑↓</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Quantity ↑↓</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Tax ↑↓</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Amount ↑↓</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          backgroundColor: '#ffedd5', 
                          color: '#c2410c',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem'
                        }}>
                          b
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1f2937' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>{prod.code}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#374151' }}>₹{prod.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: '#374151', paddingLeft: '2rem' }}>{prod.quantity}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#374151' }}>₹{prod.tax.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#111827' }}>₹{prod.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}

                <tr style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
                  <td colSpan={4} style={{ padding: '0.875rem 1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Discount Code (SEWSPARE-NEW)
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>
                    - ₹1,850
                  </td>
                </tr>

                <tr style={{ backgroundColor: '#4b5563', color: 'white' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Total</td>
                  <td style={{ padding: '1rem 1.25rem' }}></td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, paddingLeft: '2rem' }}>6</td>
                  <td style={{ padding: '1rem 1.25rem' }}></td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, fontSize: '1rem' }}>₹5,550</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Shipping Timeline Accordion */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div className="accordion-header" onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Shipping Timeline</span>
              {isTimelineExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isTimelineExpanded && (
              <div style={{ position: 'relative', backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
                
                <button 
                  onClick={() => scrollTimeline('left')}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#4b5563',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    zIndex: 10
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                <div 
                  ref={timelineScrollRef}
                  style={{ 
                    overflowX: 'auto', 
                    width: '100%', 
                    padding: '2rem 3rem',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                  className="timeline-scroll-container"
                >
                  <div style={{ display: 'flex', position: 'relative', alignItems: 'center', minWidth: '800px', padding: '1rem 0' }}>
                    
                    <div style={{
                      position: 'absolute',
                      left: '50px',
                      right: '50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '0px',
                      borderTop: '2.5px dashed #bfdbfe',
                      zIndex: 1
                    }} />

                    {[
                      { title: 'Order Received', position: 'top' },
                      { title: 'Payment Completed', position: 'bottom' },
                      { title: 'Order Shipped', position: 'top' },
                      { title: 'Out for Delivery', position: 'bottom' },
                      { title: 'Delivered', position: 'top' },
                      { title: 'Replacement Requested', position: 'bottom' },
                      { title: 'Picked', position: 'top' },
                      { title: 'Completed', position: 'bottom' },
                    ].map((rawNode, rawIdx) => {
                      const { completed, error } = getTimelineState(rawNode.title, request.status);
                      return {
                        ...rawNode,
                        date: timelineDates[rawIdx] || "21st March, 2025 at 11:06 AM",
                        completed,
                        error
                      };
                    }).map((node, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2, position: 'relative' }}>
                        
                        {node.position === 'top' ? (
                          <div style={{ height: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{node.title}</span>
                            <span style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: '2px', fontWeight: 500, whiteSpace: 'nowrap' }}>{node.date}</span>
                          </div>
                        ) : (
                          <div style={{ height: '52px', marginBottom: '10px' }} />
                        )}

                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: node.error ? '#dc2626' : (node.completed ? '#2563eb' : '#d1d5db'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: '0 0 0 4px white',
                          zIndex: 3
                        }}>
                          {node.error ? (
                            <span style={{ fontSize: '8px', fontWeight: 800, transform: 'scale(0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</span>
                          ) : node.completed ? (
                            <span style={{ fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                          ) : (
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }}></span>
                          )}
                        </div>

                        {node.position === 'bottom' ? (
                          <div style={{ height: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: '10px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{node.title}</span>
                            <span style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: '2px', fontWeight: 500, whiteSpace: 'nowrap' }}>{node.date}</span>
                          </div>
                        ) : (
                          <div style={{ height: '52px', marginTop: '10px' }} />
                        )}

                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => scrollTimeline('right')}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#4b5563',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    zIndex: 10
                  }}
                >
                  <ChevronRight size={16} />
                </button>

              </div>
            )}
          </div>

          {/* Payment Details Accordion */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div className="accordion-header" onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Payment Details</span>
              {isPaymentExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {isPaymentExpanded && (
              <div style={{ padding: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderTop: '1.5px dotted #e5e7eb', margin: '0 -1.5rem 0.5rem -1.5rem' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Payment Method</label>
                    <div className="form-field" style={{ backgroundColor: '#f3f4f6', color: '#1f2937', fontWeight: 600 }}>{request.paymentMethod}</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Transaction ID</label>
                    <div className="form-field" style={{ backgroundColor: '#f3f4f6', color: '#1f2937', fontWeight: 600 }}>{request.txnId}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Billing Address</label>
                    <div style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', color: '#1f2937', lineHeight: 1.6, fontWeight: 600 }}>
                      123, MG Road<br />
                      Connaught Place<br />
                      New Delhi - 110001<br />
                      DELHI, INDIA
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Shipping Address</label>
                    <div style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', color: '#1f2937', lineHeight: 1.6, fontWeight: 600 }}>
                      123, MG Road<br />
                      Connaught Place<br />
                      New Delhi - 110001<br />
                      DELHI, INDIA
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Request Dialog Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            width: '400px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#dc2626' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Cancel Replacement Request</h3>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to cancel the replacement request for order <strong>{request.id.toUpperCase()}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                No, Keep Request
              </button>
              
              <button 
                onClick={onCancelRequest}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supporting Media Image Zoom Modal */}
      {zoomImage && (
        <div className="modal-overlay" onClick={() => setZoomImage(null)}>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setZoomImage(null)}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', border: 'none', background: 'none', color: '#6b7280', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#111827', alignSelf: 'flex-start' }}>Supporting Media Zoom</h4>
            <div style={{
              width: '100%',
              height: '350px',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              overflow: 'hidden'
            }}>
              <img src={zoomImage} alt="Zoomed View" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563' }}>High-Speed Rotary Hook Assembly supporting media verification</p>
          </div>
        </div>
      )}
    </div>
  );
}
