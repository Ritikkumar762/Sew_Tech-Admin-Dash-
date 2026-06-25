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
  'sth-rh-2045': { id: 'sth-rh-2045', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', orderValue: 5550, status: 'Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0001', type: 'replacement' },
  'sth-rh-2046': { id: 'sth-rh-2046', customerName: 'Rohan Sharma', email: 'rohan.sharma@gmail.com', phone: '+919988776655', orderValue: 4320, status: 'Pickup Scheduled', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0002', type: 'replacement' },
  'sth-rh-2047': { id: 'sth-rh-2047', customerName: 'Sneha Patil', email: 'sneha.patil@gmail.com', phone: '+919123456789', orderValue: 2150, status: 'Pickup Failed', paymentMethod: 'Card', txnId: 'TXN-DEL-20260203-0003', type: 'replacement' },
  'sth-rh-2048': { id: 'sth-rh-2048', customerName: 'Rahul Verma', email: 'rahul.verma@gmail.com', phone: '+919876543211', orderValue: 3500, status: 'Return Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0004', type: 'return' },
  'sth-rh-2049': { id: 'sth-rh-2049', customerName: 'Priya Nair', email: 'priya.nair@gmail.com', phone: '+918877665544', orderValue: 1200, status: 'Replacement in Process', paymentMethod: 'COD', txnId: 'TXN-DEL-20260203-0005', type: 'replacement' },
  'sth-rh-2050': { id: 'sth-rh-2050', customerName: 'Amit Gupta', email: 'amit.gupta@gmail.com', phone: '+917766554433', orderValue: 6700, status: 'Refund Completed', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0006', type: 'return' },
  'sth-rh-2051': { id: 'sth-rh-2051', customerName: 'Karan Malhotra', email: 'karan.m@gmail.com', phone: '+916655443322', orderValue: 5550, status: 'Pickup Completed', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0007', type: 'replacement' },
  'sth-rh-2052': { id: 'sth-rh-2052', customerName: 'Devendra Joshi', email: 'devendra.j@gmail.com', phone: '+915544332211', orderValue: 8900, status: 'Replacement Shipped', paymentMethod: 'Netbanking', txnId: 'TXN-DEL-20260203-0008', type: 'replacement' },
  'sth-rh-2053': { id: 'sth-rh-2053', customerName: 'Ananya Sen', email: 'ananya.s@gmail.com', phone: '+914433221100', orderValue: 4500, status: 'Delivery Failed', paymentMethod: 'Card', txnId: 'TXN-DEL-20260203-0009', type: 'replacement' },
  'sth-rh-2054': { id: 'sth-rh-2054', customerName: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', phone: '+913322110099', orderValue: 3100, status: 'Completed', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0010', type: 'replacement' },
  'sth-rh-2055': { id: 'sth-rh-2055', customerName: 'Meera Nair', email: 'meera.n@gmail.com', phone: '+912211009988', orderValue: 2400, status: 'Refund Initiated', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0011', type: 'return' },
  'sth-rh-2056': { id: 'sth-rh-2056', customerName: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+911100998877', orderValue: 5300, status: 'Pickup Scheduled', paymentMethod: 'Netbanking', txnId: 'TXN-DEL-20260203-0012', type: 'return' },
  'sth-rh-2057': { id: 'sth-rh-2057', customerName: 'Neha Sharma', email: 'neha.s@gmail.com', phone: '+919900112233', orderValue: 6200, status: 'Pickup Completed', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0013', type: 'return' },
  'sth-rh-2058': { id: 'sth-rh-2058', customerName: 'Arjun Kapoor', email: 'arjun.k@gmail.com', phone: '+919911223344', orderValue: 7500, status: 'Pickup Failed', paymentMethod: 'Card', txnId: 'TXN-DEL-20260203-0014', type: 'return' },
  
  // Ordered Tab matches (status is: 'Order Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered')
  'sth-rh-2059': { id: 'sth-rh-2059', customerName: 'Gaurav Mehta', email: 'gaurav.mehta@gmail.com', phone: '+919922334455', orderValue: 6700, status: 'Shipped', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0015', type: 'order' },
  'sth-rh-2060': { id: 'sth-rh-2060', customerName: 'Siddharth Rao', email: 'sid.rao@gmail.com', phone: '+919933445566', orderValue: 3450, status: 'Processing', paymentMethod: 'Card', txnId: 'TXN-DEL-20260203-0016', type: 'order' },
  'sth-rh-2061': { id: 'sth-rh-2061', customerName: 'Ishaan Verma', email: 'ishaan.v@gmail.com', phone: '+919944556677', orderValue: 8900, status: 'Order Received', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0017', type: 'order' },
  'sth-rh-2062': { id: 'sth-rh-2062', customerName: 'Rohan Deshmukh', email: 'rohan.d@gmail.com', phone: '+919955667788', orderValue: 4500, status: 'Out for Delivery', paymentMethod: 'COD', txnId: 'TXN-DEL-20260203-0018', type: 'order' },
  'sth-rh-2063': { id: 'sth-rh-2063', customerName: 'Deepa Krishnan', email: 'deepa.k@gmail.com', phone: '+919966778899', orderValue: 5800, status: 'Delivered', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0019', type: 'order' },

  // Cancelled Tab matches (status is: 'Cancelled')
  'sth-rh-2064': { id: 'sth-rh-2064', customerName: 'Ishita Sen', email: 'ishita.s@gmail.com', phone: '+919977889900', orderValue: 3100, status: 'Cancelled', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0020', type: 'order' },
  'sth-rh-2065': { id: 'sth-rh-2065', customerName: 'Kabir Bakshi', email: 'kabir.b@gmail.com', phone: '+919988990011', orderValue: 2400, status: 'Cancelled', paymentMethod: 'Card', txnId: 'TXN-DEL-20260203-0021', type: 'order' }
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
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string)?.toLowerCase();

  const initialOrder: OrderDetail = MOCK_ORDER_DETAILS[orderId] || MOCK_ORDER_DETAILS['sth-rh-2045'];

  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReturnReasons, setSelectedReturnReasons] = useState<string[]>([]);
  const [isOtherReturnSelected, setIsOtherReturnSelected] = useState(true);

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

  // Determine which layout component to render based on status/type
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
      status.includes('Delivery') || 
      status === 'Completed'
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
    </div>
  );
}
