
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import OrderDetailOrdered from './OrderDetailOrdered';
import OrderDetailReturn from './OrderDetailReturn';
import OrderDetailReplacement from './OrderDetailReplacement';
import OrderDetailCancelled from './OrderDetailCancelled';

// Rich Mock Data for Detail Retrieval (fallback)
const MOCK_ORDER_DETAILS: Record<string, any> = {
  'sth-rh-2045': { id: 'sth-rh-2045', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0001', type: 'replacement', items: [{ productId: 'p1', name: 'Motor Brush Set', sku: 'SKU-101', qty: 2, price: 350.0, image: '/spares/motor-brush.png' }] },
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
  type?: string;
  items?: any[];
}

const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODU1NTEwODQsImlhdCI6MTc4Mjk1OTA4NH0.riR2bGkpAAWovihDD5xMr3LNA7RkVyIcF-kzenP7T-k';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReturnReasons, setSelectedReturnReasons] = useState<string[]>([]);
  const [isOtherReturnSelected, setIsOtherReturnSelected] = useState(true);
  const [toastConfig, setToastConfig] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3500);
  };

  // Fetch Order Details from Database
  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/spares/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to load order details (Status: ${res.status})`);
      }
      const json = await res.json();
      if (json && json.success && json.data) {
        setOrder(json.data);
      } else {
        throw new Error(json?.message || 'Failed to parse order details.');
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to load spares order.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId, fetchOrderDetail]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 1500);
  };

  // Live PATCH to Update Spares Order Status in DB
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const url = `/api/v1/admin/spares/orders/${orderId}/status`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      };
      
      let res = await fetch(url, { method: 'PATCH', ...options });
      
      // If the server rejects PATCH (e.g. older backend on Render expects PUT), fallback to PUT
      if (res.status === 405) {
        // The older backend on Render requires the exact UPPERCASE enum value
        const fallbackOptions = { ...options, body: JSON.stringify({ status: newStatus.toUpperCase() }) };
        res = await fetch(url, { method: 'PUT', ...fallbackOptions });
      }
      
      if (res.ok) {
        // Automatically determine corrected order type based on updated status
        const isCancelled = newStatus === 'Cancelled' || newStatus.toLowerCase().includes('cancelled') || newStatus.toLowerCase().includes('reject');
        const isReturn = newStatus.toLowerCase().includes('return') || newStatus.toLowerCase().includes('refund');
        const isReplacement = newStatus.toLowerCase().includes('replacement') || newStatus.toLowerCase().includes('pickup') || newStatus === 'Requested';
        
        setOrder((prev: any) => {
          if (!prev) return null;
          let dynamicType = prev.type || 'order';
          if (dynamicType !== 'return' && dynamicType !== 'replacement' && dynamicType !== 'cancelled') {
            if (isCancelled) dynamicType = 'cancelled';
            else if (isReturn) dynamicType = 'return';
            else if (isReplacement) dynamicType = 'replacement';
          }
          return { ...prev, status: newStatus, type: dynamicType };
        });
        showToast(`Status updated to "${newStatus}" successfully!`, 'success');
      } else {
        showToast('Failed to update spares order status in the database.', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Error updating status. Please try again.', 'error');
    }
  };

  // Live POST to Cancel Spares Order in DB
  const handleCancelOrder = async () => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const reasonsList = [...selectedReturnReasons, isOtherReturnSelected ? 'Other' : ''].filter(Boolean);
      const res = await fetch(`/api/v1/admin/spares/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ reason: reasonsList.join(', ') || 'Customer cancelled the request' })
      });
      if (res.ok) {
        setOrder((prev: any) => prev ? { ...prev, status: 'Cancelled' } : null);
        setShowCancelModal(false);
        showToast('Order cancelled successfully!', 'success');
      } else {
        showToast('Failed to cancel spares order in the database.', 'error');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      showToast('Error cancelling order. Please try again.', 'error');
    }
  };

  // Determine which layout component to render based on status/type
  const renderDetailContent = () => {
    if (!order) return null;
    const status = order.status;

    if (status === 'Completed' || status === 'Delivered') {
      return (
        <OrderDetailOrdered
          order={order}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          copiedText={copiedText}
          handleCopy={handleCopy}
        />
      );
    }

    if (status === 'Cancelled') {
      return (
        <OrderDetailCancelled
          order={order}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          copiedText={copiedText}
          handleCopy={handleCopy}
        />
      );
    }

    if (order.type === 'return') {
      return (
        <OrderDetailReturn
          order={order}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          copiedText={copiedText}
          handleCopy={handleCopy}
        />
      );
    }

    if (order.type === 'replacement') {
      return (
        <OrderDetailReplacement
          order={order}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          copiedText={copiedText}
          handleCopy={handleCopy}
        />
      );
    }

    if (status === 'Return Requested' || status.includes('Refund')) {
      return (
        <OrderDetailReturn
          order={order}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          copiedText={copiedText}
          handleCopy={handleCopy}
        />
      );
    }

    if (
      status === 'Requested' || 
      status.includes('Pickup') || 
      status.includes('Replacement') || 
      status.includes('Delivery')
    ) {
      return (
        <OrderDetailReplacement
          order={order}
          onUpdateStatus={handleUpdateStatus}
          onCancelOrder={handleCancelOrder}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          copiedText={copiedText}
          handleCopy={handleCopy}
        />
      );
    }

    return (
      <OrderDetailOrdered
        order={order}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
        showCancelModal={showCancelModal}
        setShowCancelModal={setShowCancelModal}
        copiedText={copiedText}
        handleCopy={handleCopy}
      />
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem' }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.975rem' }}>Loading spares order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
        <div style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>⚠</div>
        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Could not load order</div>
        <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error || 'Order not found.'}</div>
        <button onClick={() => router.back()} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

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
        `}
      </style>

      {renderDetailContent()}

      {/* Cancel Order Dialog Modal */}
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
              ].map((reason, index) => (
                <label 
                  key={reason} 
                  htmlFor={`return-reason-${index}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#4b5563' }}
                >
                  <input 
                    id={`return-reason-${index}`}
                    type="checkbox" 
                    checked={selectedReturnReasons.includes(reason)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReturnReasons([...selectedReturnReasons, reason]);
                      } else {
                        setSelectedReturnReasons(selectedReturnReasons.filter(r => r !== reason));
                      }
                    }}
                    style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer' }} 
                  />
                  {reason}
                </label>
              ))}
              
              <label 
                htmlFor="return-reason-other"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}
              >
                <input 
                  id="return-reason-other"
                  type="checkbox" 
                  checked={isOtherReturnSelected} 
                  onChange={(e) => setIsOtherReturnSelected(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer' }} 
                />
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
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastConfig.show && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: toastConfig.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 1200,
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastConfig.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          {toastConfig.message}
        </div>
      )}
    </div>
  );
}
