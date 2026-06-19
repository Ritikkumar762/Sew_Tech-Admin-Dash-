'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight,
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  Clock, 
  AlertCircle,
  FileText,
  Maximize2,
  X
} from 'lucide-react';

interface RequestDetail {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  orderValue: number;
  status: 'Requested' | 'Pickup Scheduled' | 'Pickup Failed';
  paymentMethod: string;
  txnId: string;
  reason: string;
}

const MOCK_REQUEST_DETAILS: Record<string, RequestDetail> = {
  'sth-rh-2051': { id: 'sth-rh-2051', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 1600, status: 'Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0001', reason: 'Defected product received' },
  'sth-rh-2052': { id: 'sth-rh-2052', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 1600, status: 'Pickup Scheduled', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0002', reason: 'Need to change address' },
  'sth-rh-2053': { id: 'sth-rh-2053', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 1600, status: 'Pickup Failed', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0003', reason: 'Ordered by mistake' },
};

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = (params.id as string)?.toLowerCase();

  const initialRequest = MOCK_REQUEST_DETAILS[requestId] || MOCK_REQUEST_DETAILS['sth-rh-2051'];

  // State
  const [request, setRequest] = useState<RequestDetail>(initialRequest);
  const [activeTab, setActiveTab] = useState<'returnDetails' | 'summary' | 'tracking'>('returnDetails');
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleUpdateStatus = (newStatus: 'Requested' | 'Pickup Scheduled' | 'Pickup Failed') => {
    setRequest(prev => ({ ...prev, status: newStatus }));
    setIsStatusMenuOpen(false);
  };

  const handleCancelRequest = () => {
    // Navigate back or alert
    alert('Return request has been cancelled.');
    router.push('/spares/requests');
  };

  const handleInitiateReturn = () => {
    setRequest(prev => ({ ...prev, status: 'Pickup Scheduled' }));
    alert('Return initiated! Status updated to Pickup Scheduled.');
  };

  const handleInitiatePickup = () => {
    setRequest(prev => ({ ...prev, status: 'Pickup Scheduled' }));
    alert('Pickup re-initiated! Status updated to Pickup Scheduled.');
  };

  // Mock Products list matching order summary
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
          .badge-orange {
            background-color: #fffbeb;
            color: #d97706;
            border: 1px solid #fef3c7;
          }
          .badge-red {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
          }
          .badge-process {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
            font-size: 0.7rem;
            font-weight: 600;
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
          .media-box {
            position: relative;
            width: 136px;
            height: 136px;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            overflow: hidden;
            background-color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .media-box:hover {
            border-color: #cbd5e1;
            transform: scale(1.01);
          }
          .media-zoom-overlay {
            position: absolute;
            top: 0.375rem;
            right: 0.375rem;
            width: 24px;
            height: 24px;
            background-color: white;
            border-radius: 50%;
            border: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4b5563;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
          }
          .media-zoom-overlay:hover {
            opacity: 1;
          }
        `}
      </style>

      {/* Top Banner Info Detail */}
      <div className="detail-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Back Nav, Customer Name, and Request badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => router.push('/spares/requests')}
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
            
            {/* Copyable Order ID Badge */}
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
              
              {copiedText === 'requestId' && (
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

            {/* Return in Process red badge */}
            <span className="badge badge-process">
              Return in Process
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', alignItems: 'center' }}>
            {/* Invoice Button */}
            <button 
              onClick={() => {
                const numericId = request.id.endsWith('6') ? '6' : '5';
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

            {/* Middle Button - Dynamic based on status */}
            {request.status === 'Requested' && (
              <button 
                onClick={handleInitiateReturn}
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
                Initiate Return
              </button>
            )}

            {request.status === 'Pickup Failed' && (
              <button 
                onClick={handleInitiatePickup}
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
                Initiate Pickup
              </button>
            )}

            {/* Cancel Request red button */}
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
            <span className={`badge ${request.status === 'Pickup Failed' ? 'badge-red' : 'badge-orange'}`}>
              {request.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('returnDetails')}
          className={`tab-btn ${activeTab === 'returnDetails' ? 'tab-btn-active' : ''}`}
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

      {/* Content */}
      {activeTab === 'returnDetails' && (
        <div className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Return Request Details</h3>
            
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
                    {/* Reticle SVG target mark icon matching the screenshot */}
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="7"></circle>
                      <line x1="12" y1="3" x2="12" y2="7"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                      <line x1="3" y1="12" x2="7" y2="12"></line>
                      <line x1="17" y1="12" x2="21" y2="12"></line>
                    </svg>
                    
                    <button 
                      className="media-zoom-overlay" 
                      onClick={() => setZoomImage('active')}
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

          {/* Shipping Timeline Accordion */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div className="accordion-header" onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Shipping Timeline</span>
              {isTimelineExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isTimelineExpanded && (
              <div style={{ padding: '2rem 1.5rem', backgroundColor: 'white', display: 'flex', alignItems: 'center', position: 'relative', overflowX: 'auto' }}>
                
                <button style={{
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
                  flexShrink: 0,
                  marginRight: '0.5rem',
                  zIndex: 5
                }}>
                  <ChevronLeft size={16} />
                </button>

                <div style={{ display: 'flex', flex: 1, position: 'relative', alignItems: 'center', minWidth: '800px', padding: '1rem 0' }}>
                  
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
                    { title: 'Order Received', date: "21st March, 2025 at 11:06 AM", completed: true, position: 'top' },
                    { title: 'Payment Completed', date: "21st March, 2025 at 11:06 AM", completed: true, position: 'bottom' },
                    { title: 'Order Shipped', date: "21st March, 2025 at 11:06 AM", completed: true, position: 'top' },
                    { title: 'Out for Delivery', date: "21st March, 2025 at 11:06 AM", completed: true, position: 'bottom' },
                    { title: 'Delivered', date: "21st March, 2025 at 11:06 AM", completed: true, position: 'top' },
                    { title: 'Return Requested', date: "21st March, 2025 at 11:06 AM", completed: true, error: true, position: 'bottom' },
                    { title: 'Picked', date: "21st March, 2025 at 11:06 AM", completed: true, position: 'top' },
                  ].map((node, idx) => (
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
                        backgroundColor: node.error ? '#dc2626' : '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 0 0 4px white',
                        zIndex: 3
                      }}>
                        {node.error ? (
                          <span style={{ fontSize: '8px', fontWeight: 800, transform: 'scale(0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</span>
                        ) : (
                          <span style={{ fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
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

                <button style={{
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
                  flexShrink: 0,
                  marginLeft: '0.5rem',
                  zIndex: 5
                }}>
                  <ChevronRight size={16} />
                </button>

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
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Cancel Return Request</h3>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to cancel the return request for order <strong>{request.id.toUpperCase()}</strong>? This action cannot be undone.
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
                onClick={handleCancelRequest}
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
              backgroundColor: '#f8fafc'
            }}>
              <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="7"></circle>
                <line x1="12" y1="3" x2="12" y2="7"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
                <line x1="3" y1="12" x2="7" y2="12"></line>
                <line x1="17" y1="12" x2="21" y2="12"></line>
              </svg>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563' }}>High-Speed Rotary Hook Assembly supporting media verification</p>
          </div>
        </div>
      )}
    </div>
  );
}
