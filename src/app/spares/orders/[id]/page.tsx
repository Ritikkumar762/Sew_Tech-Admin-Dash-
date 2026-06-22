'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight,
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  MapPin, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react';

// Rich Mock Data for Detail Retrieval (to fetch corresponding order detail)
const MOCK_ORDER_DETAILS: Record<string, any> = {
  'sth-rh-2045': { id: 'sth-rh-2045', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Order Received', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0001' },
  'sth-rh-2046': { id: 'sth-rh-2046', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Processing', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0002' },
  'sth-rh-2047': { id: 'sth-rh-2047', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Shipped', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0003' },
  'sth-rh-2048': { id: 'sth-rh-2048', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Out for Delivery', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0004' },
  'sth-rh-2049': { id: 'sth-rh-2049', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Delivered', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0005' },
  'sth-rh-2050': { id: 'sth-rh-2050', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Return Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0006' },
};

interface OrderDetail {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  orderValue: number;
  status: string;
  paymentMethod: string;
  txnId: string;
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
    case 'Return Requested':
      return { completed: currentStatus === 'Return Requested', error: currentStatus === 'Return Requested' };
    case 'Picked':
      return { completed: currentStatus === 'Return Requested', error: false };
    case 'Completed':
      return { completed: currentLevel >= 6, error: false };
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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = (params.id as string)?.toLowerCase();

  // Retrieve matching mock order or default to the first one
  const initialOrder: OrderDetail = MOCK_ORDER_DETAILS[orderId] || MOCK_ORDER_DETAILS['sth-rh-2045'];

  // State
  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [activeTab, setActiveTab] = useState<'return' | 'summary' | 'tracking'>('return');
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleUpdateStatus = (newStatus: string) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    setIsStatusMenuOpen(false);
  };

  const handleCancelOrder = () => {
    setOrder((prev) => ({ ...prev, status: 'Cancelled' }));
    setShowCancelModal(false);
  };

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Order Received':
      case 'Delivered':
      case 'Completed':
        return 'badge-completed';
      case 'Shipped':
        return 'badge-warning';
      case 'Out for Delivery':
        return 'badge-warning';
      case 'Cancelled':
      case 'Payment Failed':
      case 'Delivery Failed':
        return 'badge-danger';
      case 'Processing':
      case 'Return Requested':
      default:
        return 'badge-info';
    }
  };

  // Products List matching image
  const products = [
    { name: 'High-Speed Rotary Hook Assembly', code: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 },
    { name: 'High-Speed Rotary Hook Assembly', code: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 },
    { name: 'High-Speed Rotary Hook Assembly', code: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .timeline-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .detail-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            padding: 1.5rem;
          }
          .tab-btn {
            border: none;
            background: none;
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
          }
          .tab-btn-active {
            color: #2563eb;
            font-weight: 600;
            border-bottom-color: #2563eb;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .badge-completed {
            background-color: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
          }
          .badge-info {
            background-color: #eff6ff;
            color: #2563eb;
            border: 1px solid #dbeafe;
          }
          .badge-danger {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
          }
          .badge-warning {
            background-color: #fffbeb;
            color: #d97706;
            border: 1px solid #fef3c7;
          }
          .copy-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: #3b82f6;
            cursor: pointer;
            padding: 2px;
            border-radius: 4px;
            transition: background-color 0.15s;
          }
          .copy-btn:hover {
            background-color: #eff6ff;
          }
          .accordion-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.25rem;
            font-weight: 600;
            color: #1f2937;
            cursor: pointer;
            background-color: white;
            user-select: none;
            transition: background-color 0.15s;
          }
          .accordion-header:hover {
            background-color: #f9fafb;
          }
          .form-field {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #374151;
            font-weight: 500;
          }
          .status-item {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            color: #374151;
            cursor: pointer;
            transition: background-color 0.15s;
            text-align: left;
            width: 100%;
            border: none;
            background: none;
          }
          .status-item:hover {
            background-color: #f3f4f6;
            color: #111827;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100;
            backdrop-filter: blur(2px);
          }
          .timeline-node {
            display: flex;
            gap: 1rem;
            position: relative;
            padding-bottom: 2rem;
          }
          .timeline-node::before {
            content: '';
            position: absolute;
            left: 11px;
            top: 24px;
            bottom: 0;
            width: 2px;
            background-color: #e5e7eb;
          }
          .timeline-node:last-child::before {
            display: none;
          }
        `}
      </style>

      {/* Top Banner Info Detail */}
      <div className="detail-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Back Nav, Customer Name, and Order ID */}
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
            
            {/* Copyable Order ID Badge */}
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
              
              {copiedText === 'orderId' && (
                <span style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-4px)',
                  backgroundColor: '#1f2937',
                  color: 'white',
                  fontSize: '9px',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  Copied!
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
            {/* Invoice Button */}
            <button 
              onClick={() => {
                const numericId = order.id.endsWith('6') ? '6' : '5';
                window.open(`https://project-sewtech-mart.onrender.com/api/v1/mart/orders/${numericId}/invoice`, '_blank');
              }}
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

            {/* Dynamic Action Button */}
            <button 
              onClick={() => {
                if (order.status === 'Requested') handleUpdateStatus('Pickup Scheduled');
                else if (order.status === 'Pickup Scheduled') handleUpdateStatus('Refund Initiated');
                else if (order.status === 'Refund Initiated') handleUpdateStatus('Refund Completed');
              }}
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
              {order.status === 'Requested' ? 'Initiate Return' : order.status === 'Pickup Scheduled' ? 'Initiate Pickup' : order.status === 'Refund Initiated' ? 'Initiate Refund' : 'Initiate Return'}
            </button>

            {/* Cancel Request Button */}
            <button 
              onClick={() => setShowCancelModal(true)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Cancel Request
            </button>
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
              <button 
                className="copy-btn" 
                onClick={() => handleCopy(order.phone, 'phone')}
                title="Copy Phone Number"
              >
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
            <span className={`badge ${getBadgeClass(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Pages Content Tabs Switcher */}
      <div style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('return')}
          className={`tab-btn ${activeTab === 'return' ? 'tab-btn-active' : ''}`}
        >
          Return Request Details
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

      {/* Tab Panes */}
      {activeTab === 'return' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="detail-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem' }}>Return Request Details</h3>
            
            {/* Reason Selected */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Reason Selected</div>
              <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                Defected product received
              </div>
            </div>

            {/* Supporting Media */}
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Supporting Media</div>
              <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', gap: '1rem' }}>
                {[1, 2, 3].map((item) => (
                  <div key={item} style={{ position: 'relative', width: '120px', height: '120px', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'white', borderRadius: '50%', padding: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10, display: 'flex' }}>
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                    {/* Image of rotary hook */}
                    <img src="/rotary-hook.png" alt="Rotary Hook" style={{ width: '80%', height: '80%', objectFit: 'contain', borderRadius: '0.25rem' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'summary' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="detail-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem' }}>Order Summary</h3>
            
            {/* Products breakdown table */}
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

                  {/* Discount Banner Row */}
                  <tr style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
                    <td colSpan={4} style={{ padding: '0.875rem 1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                      Discount Code (SEWSPARE-NEW)
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>
                      - ₹1,850
                    </td>
                  </tr>

                  {/* Summary row */}
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
                      { title: 'Order Received', position: 'top' },
                      { title: 'Payment Completed', position: 'bottom' },
                      { title: 'Order Shipped', position: 'top' },
                      { title: 'Out for Delivery', position: 'bottom' },
                      { title: 'Delivered', position: 'top' },
                      { title: 'Return Requested', position: 'bottom' },
                      { title: 'Picked', position: 'top' },
                      { title: 'Completed', position: 'bottom' },
                    ].map((rawNode, rawIdx) => {
                      const { completed, error } = getTimelineState(rawNode.title, order.status);
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
                
                {/* Method & Txn ID input elements */}
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

                {/* Addresses display */}
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

      {/* Cancel Order Dialog Modal -> Select Reason Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            width: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowCancelModal(false)}
              style={{ position: 'absolute', top: '-12px', right: '-12px', background: '#1f2937', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              <X size={14} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '0.5rem' }}>Select Reason</h3>
            
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                'Product is not eligible for return',
                'Item shows signs of use or damage after delivery',
                'Issue reported does not match the returned item',
                'Original tags / packaging missing',
                'Invoice / order details mismatch',
                'Incorrect return reason selected'
              ].map((reason) => (
                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#4b5563' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer' }} />
                  {reason}
                </label>
              ))}
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer' }} />
                Other
              </label>

              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Add Note</div>
                <input type="text" placeholder="Add Note" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setShowCancelModal(false)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #111827', backgroundColor: 'white', color: '#111827', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Back
              </button>
              
              <button 
                onClick={handleCancelOrder}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#ff4444', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
