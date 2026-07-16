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
  CreditCard,
  X
} from 'lucide-react';

interface OrderDetailProps {
  order: {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    orderValue: number;
    status: string;
    paymentMethod: string;
    txnId: string;
  };
  onUpdateStatus: (status: string) => void;
  onCancelOrder: () => void;
  showCancelModal: boolean;
  setShowCancelModal: (show: boolean) => void;
  copiedText: string | null;
  handleCopy: (text: string, type: string) => void;
}

const getTimelineState = (nodeTitle: string, currentStatus: string) => {
  const statusHierarchy: Record<string, number> = {
    'Order Received': 1,
    'Processing': 2,
    'Shipped': 3,
    'Out for Delivery': 4,
    'Delivered': 5,
    'Completed': 6,
  };

  const currentLevel = statusHierarchy[currentStatus] || 1;

  switch (nodeTitle) {
    case 'Order Received':
    case 'Payment Completed':
      return { completed: currentLevel >= 1, error: false };
    case 'Order Shipped':
      return { completed: currentLevel >= 3, error: false };
    case 'Out for Delivery':
      return { completed: currentLevel >= 4, error: false };
    case 'Delivered':
      return { completed: currentLevel >= 5, error: false };
    case 'Completed':
      return { completed: currentLevel >= 6, error: false };
    default:
      return { completed: false, error: false };
  }
};

const getStatusBadgeClass = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('completed') || s.includes('delivered')) {
    return 'badge-completed';
  }
  return 'badge-info';
};

export default function OrderDetailOrdered({
  order,
  onUpdateStatus,
  onCancelOrder,
  showCancelModal,
  setShowCancelModal,
  copiedText,
  handleCopy
}: OrderDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'summary' | 'tracking'>('summary');
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
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
              onClick={() => router.push('/spares/orders')}
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
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{order.customerName}</h2>
            
            <div 
              onClick={() => handleCopy(order.id.toUpperCase(), 'orderId')}
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
              {order.id.toUpperCase()}
              {copiedText === 'orderId' ? <Check size={10} style={{ color: '#16a34a' }} /> : <Copy size={10} />}
            </div>

            {order.status !== 'Completed' && (
              <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ marginLeft: '0.5rem' }}>
                {order.status}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
            {order.status !== 'Cancelled' && (
              <button 
                onClick={() => setShowCancelModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ef4444',
                  backgroundColor: 'white',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Cancel Order
              </button>
            )}

            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
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
                Update Status
                <ChevronDown size={14} />
              </button>

              {isStatusMenuOpen && (
                <>
                  <div onClick={() => setIsStatusMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} />
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    width: '160px',
                    zIndex: 100,
                    padding: '0.25rem 0'
                  }}>
                    {[
                      'Order Received',
                      'Shipped',
                      'Out of Delivery',
                      'Delivery Failed',
                      'Completed'
                    ].map((status) => {
                      const isCompleted = status.toLowerCase().includes('completed') || status.toLowerCase().includes('delivered');
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            onUpdateStatus(status);
                            setIsStatusMenuOpen(false);
                          }}
                          className="status-item"
                          style={{
                            color: isCompleted ? '#16a34a' : '#2563eb',
                            backgroundColor: isCompleted ? '#f0fdf4' : '#eff6ff',
                            margin: '4px 8px',
                            borderRadius: '6px',
                            width: 'calc(100% - 16px)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            padding: '6px 12px'
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Email ID:</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', wordBreak: 'break-all' }}>{order.email}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Phone Number:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{order.phone}</span>
              <button className="copy-btn" onClick={() => handleCopy(order.phone, 'phone')}>
                {copiedText === 'phone' ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Payment Method:</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{order.paymentMethod}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Order Value:</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>₹{order.orderValue.toLocaleString('en-IN')}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>Status:</div>
            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '1.5rem' }}>
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

      {/* Tab Panes */}
      {activeTab === 'summary' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '0.375rem', 
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            <img src="/rotary-hook.png" alt="Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, fontSize: '1rem' }}>₹{order.orderValue.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
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
                      { title: 'Order Received', date: "21st March, 2025 at 11:06 AM", position: 'top' },
                      { title: 'Payment Completed', date: "21st March, 2025 at 11:06 AM", position: 'bottom' },
                      { title: 'Order Shipped', date: "21st March, 2025 at 11:06 AM", position: 'top' },
                      { title: 'Out for Delivery', date: "21st March, 2025 at 11:06 AM", position: 'bottom' },
                      { title: 'Delivered', date: "21st March, 2025 at 11:06 AM", position: 'top' },
                      { title: 'Completed', date: "21st March, 2025 at 11:06 AM", position: 'bottom' },
                    ].map((node, idx) => {
                      const { completed, error } = getTimelineState(node.title, order.status);
                      return (
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
                            backgroundColor: error ? '#dc2626' : (completed ? '#2563eb' : '#d1d5db'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 0 0 4px white',
                            zIndex: 3
                          }}>
                            {completed ? (
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
                      );
                    })}
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
                    <div className="form-field" style={{ backgroundColor: '#f3f4f6', color: '#1f2937', fontWeight: 600 }}>{order.paymentMethod}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Transaction ID</label>
                    <div className="form-field" style={{ backgroundColor: '#f3f4f6', color: '#1f2937', fontWeight: 600 }}>{order.txnId}</div>
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
    </div>
  );
}
