'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import OrderDetailOrdered from './OrderDetailOrdered';
import OrderDetailReturn from './OrderDetailReturn';
import OrderDetailReplacement from './OrderDetailReplacement';
import OrderDetailCancelled from './OrderDetailCancelled';

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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string)?.toLowerCase();

  const initialOrder: OrderDetail = MOCK_ORDER_DETAILS[orderId] || MOCK_ORDER_DETAILS['sth-rh-2045'];

  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleUpdateStatus = (newStatus: string) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
  };

  const handleCancelOrder = () => {
    setOrder((prev) => ({ ...prev, status: 'Cancelled' }));
    setShowCancelModal(false);
  };

  // Determine which layout component to render based on status
  const renderDetailContent = () => {
    const status = order.status;

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

    if (status.includes('Return') || status.includes('Refund') || status === 'Requested' || status.includes('Pickup')) {
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

    if (status.includes('Replacement')) {
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
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
