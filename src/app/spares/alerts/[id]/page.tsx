'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RequestDetailReturn from './RequestDetailReturn';
import RequestDetailReplacement from './RequestDetailReplacement';
import RequestDetailCancelled from './RequestDetailCancelled';

interface RequestDetail {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  orderValue: number;
  status: string;
  paymentMethod: string;
  txnId: string;
  reason: string;
  requestType: 'Return' | 'Replacement' | 'Cancellation';
}

const MOCK_REQUEST_DETAILS: Record<string, RequestDetail> = {
  'sth-rh-2051': { id: 'sth-rh-2051', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 1600, status: 'Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0001', reason: 'Defected product received', requestType: 'Cancellation' },
  'sth-rh-2052': { id: 'sth-rh-2052', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 1600, status: 'Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0002', reason: 'Defected product received', requestType: 'Replacement' },
  'sth-rh-2053': { id: 'sth-rh-2053', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', orderValue: 1600, status: 'Requested', paymentMethod: 'UPI', txnId: 'TXN-DEL-20260203-0003', reason: 'Defected product received', requestType: 'Return' },
};

export default function RequestDetailPage() {
  const params = useParams();
  const requestId = (params.id as string)?.toLowerCase();

  const initialRequest = MOCK_REQUEST_DETAILS[requestId] || MOCK_REQUEST_DETAILS['sth-rh-2053'];

  const [request, setRequest] = useState<RequestDetail>(initialRequest);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleUpdateStatus = (newStatus: string) => {
    setRequest(prev => ({ ...prev, status: newStatus }));
  };

  const handleCancelRequest = () => {
    setRequest(prev => ({ ...prev, status: 'Cancelled' }));
    setShowCancelModal(false);
  };

  // Select component based on requestType
  const renderDetailContent = () => {
    switch (request.requestType) {
      case 'Cancellation':
        return (
          <RequestDetailCancelled
            request={request}
            onUpdateStatus={handleUpdateStatus}
            onCancelRequest={handleCancelRequest}
            showCancelModal={showCancelModal}
            setShowCancelModal={setShowCancelModal}
            copiedText={copiedText}
            handleCopy={handleCopy}
          />
        );
      case 'Replacement':
        return (
          <RequestDetailReplacement
            request={request}
            onUpdateStatus={handleUpdateStatus}
            onCancelRequest={handleCancelRequest}
            showCancelModal={showCancelModal}
            setShowCancelModal={setShowCancelModal}
            copiedText={copiedText}
            handleCopy={handleCopy}
          />
        );
      case 'Return':
      default:
        return (
          <RequestDetailReturn
            request={request}
            onUpdateStatus={handleUpdateStatus}
            onCancelRequest={handleCancelRequest}
            showCancelModal={showCancelModal}
            setShowCancelModal={setShowCancelModal}
            copiedText={copiedText}
            handleCopy={handleCopy}
          />
        );
    }
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
      {renderDetailContent()}
    </div>
  );
}
