'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';

interface ReturnRequestItem {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  tax: number;
  amount: number;
}

interface DisputeDetail {
  id: string;
  disputeType: 'spares' | 'mechanics';
  raisedByName: string;
  raisedByType: string; // 'Customer' | 'Mechanic'
  customerPhone: string;
  customerEmail: string;
  paymentMethod?: string;
  orderValue?: number;
  status: string; // 'Requested' | 'In Process' | 'Active' | 'Resolved'
  reason?: string;
  images?: string[];
  items?: ReturnRequestItem[];
  discountCodeName?: string;
  discountAmount?: number;
  
  // Mechanics specific fields
  disputeId?: string;
  issueDescription?: string;
  serviceType?: string;
  selectedDateTime?: string;
  languagePreference?: string;
  address?: string;
}

const DEFAULT_DISPUTE_SPARES: DisputeDetail = {
  id: 'disp-1',
  disputeType: 'spares',
  raisedByName: 'Aditya Bhargav',
  raisedByType: 'Customer',
  customerPhone: '+91 9876543210',
  customerEmail: 'demoemail@gmail.com',
  paymentMethod: 'UPI',
  orderValue: 1600,
  status: 'Requested',
  reason: 'Defected product received',
  images: [
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60'
  ],
  items: [
    { name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 },
    { name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 },
    { name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', price: 1850, quantity: 2, tax: 1850, amount: 1850 }
  ],
  discountCodeName: 'SEWSPARE-NEW',
  discountAmount: 1850
};

const DEFAULT_DISPUTE_MECHANIC: DisputeDetail = {
  id: 'disp-2',
  disputeType: 'mechanics',
  raisedByName: 'Rajdhani Exports Pvt. Ltd.',
  raisedByType: 'Customer',
  customerPhone: '+91 9876543210',
  customerEmail: 'demoemail@gmail.com',
  disputeId: 'STM834849',
  status: 'Active',
  issueDescription: 'had booked a service for my sewing machine because it was skipping stitches and making noise. The mechanic visited and serviced the machine, but the issue is still not resolved. The machine continues to skip stitches while sewing and the thread keeps breaking. I request a recheck or proper repair of the machine.',
  serviceType: 'Service : Instant Smart Booking',
  selectedDateTime: '28.02.2026 | 01:00–02:00 PM',
  languagePreference: 'Hindi',
  address: '123, MG Road\nConnaught Place\nNew Delhi – 110001\nDELHI, INDIA'
};

export default function DisputeDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [dispute, setDispute] = useState<DisputeDetail>(DEFAULT_DISPUTE_SPARES);
  
  // Spares subtabs
  const [activeSubTab, setActiveSubTab] = useState<'Return Request Details' | 'Order Summary' | 'Tracking & Billing Details'>('Return Request Details');
  
  // Mechanics subtabs
  const [activeMechSubTab, setActiveMechSubTab] = useState<'Cancellation Request Details' | 'Order Summary' | 'Tracking & Billing Details'>('Cancellation Request Details');

  // Popover / Dropdowns
  const [showResolveDropdown, setShowResolveDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal Triggers
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Modal Inputs state
  const [remarksText, setRemarksText] = useState('');
  const [rescheduleDateTime, setRescheduleDateTime] = useState('28.02.2026, 01:00-02:00 PM');
  const [refundAmount, setRefundAmount] = useState('1,500');

  useEffect(() => {
    if (!id) return;
    const fetchDisputeDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ success: boolean; data: DisputeDetail }>(`/api/v1/support/disputes/${id}`);
        if (response && response.success && response.data) {
          setDispute(response.data);
        }
      } catch (err) {
        console.warn('Backend server offline. Carrying out static dispute summary fallback.');
        // If ID matches mechanic-based row or disp-2, disp-3, show mechanic layout
        if (id === 'disp-2' || id === 'disp-3' || id.includes('mech')) {
          setDispute(DEFAULT_DISPUTE_MECHANIC);
        } else {
          setDispute(DEFAULT_DISPUTE_SPARES);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDisputeDetails();
  }, [id]);

  const handleResolveAction = async (action: string) => {
    // Check if the action triggers a modal first
    if (action === 'Close' || action === 'Remarks') {
      setShowRemarksModal(true);
      setShowResolveDropdown(false);
      return;
    }
    if (action === 'Reschedule') {
      setShowRescheduleModal(true);
      setShowResolveDropdown(false);
      return;
    }
    if (action === 'PartialRefund') {
      setShowRefundModal(true);
      setShowResolveDropdown(false);
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(`/api/v1/support/disputes/${id}/action`, { action });
      setDispute(prev => ({ ...prev, status: 'Resolved' }));
      setShowResolveDropdown(false);
      alert(`Action "${action}" processed successfully.`);
    } catch (err) {
      console.error('Failed to trigger resolution action:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit modal decisions to backend
  const handleModalSubmit = async (modalType: 'remarks' | 'reschedule' | 'refund') => {
    setLoading(true);
    try {
      let payload = {};
      if (modalType === 'remarks') {
        payload = { remarks: remarksText };
        setShowRemarksModal(false);
      } else if (modalType === 'reschedule') {
        payload = { selectedDateTime: rescheduleDateTime };
        setShowRescheduleModal(false);
      } else if (modalType === 'refund') {
        payload = { refundAmount };
        setShowRefundModal(false);
      }
      await apiClient.post(`/api/v1/support/disputes/${id}/modal-action`, { modalType, ...payload });
      alert(`Action saved successfully!`);
    } catch (err) {
      console.error('Error submitting action payload to backend:', err);
      // fallback simulation to hide modals
      setShowRemarksModal(false);
      setShowRescheduleModal(false);
      setShowRefundModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      await apiClient.post(`/api/v1/support/disputes/${id}/cancel`, {});
      router.push('/support');
    } catch (err) {
      console.error('Failed to cancel dispute request:', err);
      router.push('/support');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading details...</div>;
  }

  const calculatedItemsTotalCount = (dispute.items || []).reduce((sum, x) => sum + x.quantity, 0);
  const calculatedGrandTotal = (dispute.items || []).reduce((sum, x) => sum + x.amount, 0) - (dispute.discountAmount || 0);

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .animate-btn:active { transform: translateY(1px); }
        .sub-tab-btn {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          transition: all 0.2s ease;
        }
        .dropdown-menu-list {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.25rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          borderRadius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          z-index: 50;
          width: 220px;
          padding: 6px 0;
        }
        .dropdown-item {
          padding: 0.65rem 1.25rem;
          font-size: 0.825rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.15s ease;
        }
        .dropdown-item:hover {
          background-color: #f3f4f6;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
      `}</style>

      {/* ─── RENDERING CONDITION 1: ST Spares Return Request Dispute ─── */}
      {dispute.disputeType === 'spares' && (
        <>
          {/* Header Info Panel Card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            {/* Row 1: Title, Tags, Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              {/* Back & Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => router.push('/support')}
                  style={{ background: 'none', border: '1px solid #e5e7eb', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                  {dispute.raisedByName}
                </h1>
                
                {/* Copy Tag */}
                <span style={{ border: '1px dashed #3b82f6', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  Order ID
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </span>

                {/* In Process Tag */}
                <span style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                  Return in Process
                </span>
              </div>

              {/* Action Header Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                <button 
                  style={{ background: '#fff', border: '1px solid #111827', color: '#111827', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  className="animate-btn"
                >
                  Invoice
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>

                {/* Resolve Trigger with Popover */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowResolveDropdown(!showResolveDropdown)}
                    style={{ background: '#111827', color: 'white', border: 'none', padding: '0.55rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    className="animate-btn"
                  >
                    Resolve
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  {/* Resolution Popover (Frame 1561849201) */}
                  {showResolveDropdown && (
                    <>
                      <div onClick={() => setShowResolveDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                      <div className="dropdown-menu-list">
                        {[
                          { label: 'Approve return request', act: 'Approve' },
                          { label: 'Reject return request', act: 'Reject', color: '#ef4444' },
                          { label: 'Initiate replacement', act: 'Replace' },
                          { label: 'Initiate partial refund', act: 'PartialRefund' },
                          { label: 'Initiate full refund', act: 'FullRefund' },
                          { label: 'Flag spare as misleading', act: 'FlagMisleading' },
                          { label: 'Deactivate spare listing', act: 'DeactivateListing' },
                          { label: 'Close dispute', act: 'Close' },
                        ].map((opt) => (
                          <div 
                            key={opt.label}
                            onClick={() => handleResolveAction(opt.act)}
                            className="dropdown-item"
                            style={opt.color ? { color: opt.color } : {}}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={handleCancelRequest}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.55rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer' }}
                  className="animate-btn"
                >
                  Cancel Request
                </button>
              </div>
            </div>

            {/* Row 2: Metadata Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email ID:</span>
                <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{dispute.customerEmail}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone Number:</span>
                <strong style={{ fontSize: '0.875rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {dispute.customerPhone}
                  <svg style={{ cursor: 'pointer', color: '#3b82f6' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Payment Method:</span>
                <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{dispute.paymentMethod}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Order Value:</span>
                <strong style={{ fontSize: '0.875rem', color: '#111827' }}>₹{dispute.orderValue?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status:</span>
                <span style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  {dispute.status}
                </span>
              </div>
            </div>

            {/* Row 3: Navigation Subtabs */}
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', marginTop: '2.5rem', marginBottom: '-2rem' }}>
              {(['Return Request Details', 'Order Summary', 'Tracking & Billing Details'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className="sub-tab-btn"
                  style={{
                    color: activeSubTab === tab ? '#3b82f6' : '#6b7280',
                    borderBottom: activeSubTab === tab ? '2.5px solid #3b82f6' : '2.5px solid transparent',
                    paddingBottom: '1rem',
                    marginBottom: '-1px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          {activeSubTab === 'Return Request Details' && (
            <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Return Request Details</h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Reason */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Reason Selected</span>
                  <div style={{ background: '#f3f4f6', borderRadius: '0.375rem', padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>
                    {dispute.reason}
                  </div>
                </div>

                {/* Images grid */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>Supporting Media</span>
                  <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', gap: '1rem' }}>
                    {(dispute.images || []).map((img, i) => (
                      <div 
                        key={i}
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          borderRadius: '0.5rem', 
                          border: '1px solid #e5e7eb', 
                          background: `url(${img}) center/cover`,
                          position: 'relative',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        {/* Expand icon */}
                        <div style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '24px', background: 'rgba(255,255,255,0.9)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'Order Summary' && (
            <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Order Summary</h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

              {/* Bordered table wrapper */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>Product <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Spare Price <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'center' }}>Quantity <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Tax <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Amount <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dispute.items || []).map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {/* Mock image circle icon */}
                            <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '1px solid #e5e7eb' }}>b</div>
                            <div>
                              <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block' }}>{item.name}</strong>
                              <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>{item.sku}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827', textAlign: 'center' }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                          ₹{item.tax.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#111827', textAlign: 'right' }}>
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}

                    {/* Discount Code Promo Applied */}
                    {dispute.discountCodeName && (
                      <tr style={{ background: '#f0fdf4', borderBottom: '1px solid #e5e7eb' }}>
                        <td colSpan={4} style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>
                          Discount Code ({dispute.discountCodeName})
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#16a34a', textAlign: 'right' }}>
                          - ₹{dispute.discountAmount?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )}

                    {/* Row totals summary */}
                    <tr style={{ background: '#1f2937', color: 'white' }}>
                      <td colSpan={2} style={{ padding: '1rem 1.5rem' }}></td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 800, textAlign: 'center' }}>
                        {calculatedItemsTotalCount}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}></td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 800, textAlign: 'right' }}>
                        ₹{calculatedGrandTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'Tracking & Billing Details' && (
            <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Payment Details</h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Payment Method</span>
                  <input type="text" readOnly value="UPI" style={{ background: '#f3f4f6' }} className="form-input" />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Transaction ID</span>
                  <input type="text" readOnly value="TXN-DEL-20260203-0001" style={{ background: '#f3f4f6' }} className="form-input" />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Billing Address</span>
                  <textarea readOnly value="123, MG Road&#10;Connaught Place&#10;New Delhi – 110001&#10;DELHI, INDIA" style={{ background: '#f3f4f6', minHeight: '100px', resize: 'none' }} className="form-input" />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Shipping Address</span>
                  <textarea readOnly value="123, MG Road&#10;Connaught Place&#10;New Delhi – 110001&#10;DELHI, INDIA" style={{ background: '#f3f4f6', minHeight: '100px', resize: 'none' }} className="form-input" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Shipping Timeline
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
            </div>
          )}
        </>
      )}

      {/* ─── RENDERING CONDITION 2: ST Mechanics Booking Dispute ─── */}
      {dispute.disputeType === 'mechanics' && (
        <>
          {/* Header Info Panel Card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            {/* Row 1: Title, Tags, Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              {/* Back & Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => router.push('/support')}
                  style={{ background: 'none', border: '1px solid #e5e7eb', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                  {dispute.raisedByName}
                </h1>
                
                {/* Copy Tag */}
                {dispute.disputeId && (
                  <span style={{ border: '1px dashed #3b82f6', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    Dispute ID
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </span>
                )}
              </div>

              {/* Action Header Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                <button 
                  onClick={() => setShowRefundModal(true)}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer' }}
                  className="animate-btn"
                >
                  Refund
                </button>

                {/* Resolve Trigger with Popover */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowResolveDropdown(!showResolveDropdown)}
                    style={{ background: '#111827', color: 'white', border: 'none', padding: '0.55rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    className="animate-btn"
                  >
                    Resolve
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  {/* Resolution Popover (Frame 1561849198) */}
                  {showResolveDropdown && (
                    <>
                      <div onClick={() => setShowResolveDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                      <div className="dropdown-menu-list" style={{ width: '240px' }}>
                        {[
                          { label: 'Issue warning to mechanic', act: 'Warning' },
                          { label: 'Reassign mechanic', act: 'Reassign' },
                          { label: 'Reschedule service', act: 'Reschedule' },
                          { label: 'Partial refund to customer', act: 'PartialRefund' },
                          { label: 'Full refund to customer', act: 'FullRefund' },
                          { label: 'Hold mechanic payout', act: 'HoldPayout' },
                          { label: 'Release held payout', act: 'ReleasePayout' },
                          { label: 'Force job cancellation', act: 'ForceCancel', color: '#ef4444' },
                          { label: 'Close dispute', act: 'Close' },
                        ].map((opt) => (
                          <div 
                            key={opt.label}
                            onClick={() => handleResolveAction(opt.act)}
                            className="dropdown-item"
                            style={opt.color ? { color: opt.color } : {}}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Metadata Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email ID:</span>
                <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{dispute.customerEmail}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone Number:</span>
                <strong style={{ fontSize: '0.875rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {dispute.customerPhone}
                  <svg style={{ cursor: 'pointer', color: '#3b82f6' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status:</span>
                <span style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  {dispute.status}
                </span>
              </div>
            </div>

            {/* Row 3: Navigation Subtabs */}
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', marginTop: '2.5rem', marginBottom: '-2rem' }}>
              {(['Cancellation Request Details', 'Order Summary', 'Tracking & Billing Details'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMechSubTab(tab)}
                  className="sub-tab-btn"
                  style={{
                    color: activeMechSubTab === tab ? '#3b82f6' : '#6b7280',
                    borderBottom: activeMechSubTab === tab ? '2.5px solid #3b82f6' : '2.5px solid transparent',
                    paddingBottom: '1rem',
                    marginBottom: '-1px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          {activeMechSubTab === 'Cancellation Request Details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Reported Issue Card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Reported Issue</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
                
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Issue Description:</span>
                  <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: '0.375rem', padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#1d2433', fontWeight: 500, lineHeight: '1.6' }}>
                    {dispute.issueDescription}
                  </div>
                </div>
              </div>

              {/* Service Details Card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Service Details</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Service Blue tag subheader */}
                  <div style={{ background: '#eff6ff', border: '1.2px solid #bfdbfe', color: '#3b82f6', borderRadius: '0.5rem', padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.875rem' }}>
                    {dispute.serviceType}
                  </div>

                  {/* Metadata fields columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Selected Date & Time:</span>
                        <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{dispute.selectedDateTime}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Language Preference:</span>
                        <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{dispute.languagePreference}</strong>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Address</span>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem 1.5rem', fontSize: '0.825rem', color: '#4b5563', fontWeight: 600, lineHeight: '1.5' }}>
                        {dispute.address?.split('\n').map((line, k) => (
                          <div key={k}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMechSubTab === 'Order Summary' && (
            <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Order Summary</h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Full spare part breakdown is not required for mechanic service booking disputes. Service order value total remains: <strong>₹{dispute.orderValue?.toLocaleString('en-IN') || '0'}</strong></p>
            </div>
          )}

          {activeMechSubTab === 'Tracking & Billing Details' && (
            <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Payment Details</h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Payment Method</span>
                  <input type="text" readOnly value="UPI" style={{ background: '#f3f4f6' }} className="form-input" />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Transaction ID</span>
                  <input type="text" readOnly value="TXN-DEL-20260203-0001" style={{ background: '#f3f4f6' }} className="form-input" />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Billing Address</span>
                  <textarea readOnly value="123, MG Road&#10;Connaught Place&#10;New Delhi – 110001&#10;DELHI, INDIA" style={{ background: '#f3f4f6', minHeight: '100px', resize: 'none' }} className="form-input" />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Shipping Address</span>
                  <textarea readOnly value="123, MG Road&#10;Connaught Place&#10;New Delhi – 110001&#10;DELHI, INDIA" style={{ background: '#f3f4f6', minHeight: '100px', resize: 'none' }} className="form-input" />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── MODAL 1: Remarks Modal (Frame 1561849197) ─── */}
      {showRemarksModal && (
        <div className="modal-overlay">
          <div style={{ background: '#fff', borderRadius: '1rem', width: '520px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', animation: 'fadeInUp 0.3s ease-out' }}>
            <button onClick={() => setShowRemarksModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 1.25rem 0' }}>Remarks</h3>
            <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0' }}></div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Enter Remarks <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea 
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                maxLength={200}
                placeholder="Enter Remarks before Resolving"
                style={{ width: '100%', minHeight: '120px', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827', resize: 'none' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>{remarksText.length}/200</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={() => setShowRemarksModal(false)} style={{ background: '#fff', border: '1.5px solid #111827', color: '#111827', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }} className="animate-btn">Cancel</button>
              <button onClick={() => handleModalSubmit('remarks')} style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }} className="animate-btn">Resolve Dispute</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Reschedule Service Modal (Frame 1561849199) ─── */}
      {showRescheduleModal && (
        <div className="modal-overlay">
          <div style={{ background: '#fff', borderRadius: '1rem', width: '420px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', animation: 'fadeInUp 0.3s ease-out' }}>
            <button onClick={() => setShowRescheduleModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 1.25rem 0' }}>Reschedule Service</h3>
            <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0' }}></div>

            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Selected Date & Time <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={rescheduleDateTime}
                  onChange={(e) => setRescheduleDateTime(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}
                />
                <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={() => setShowRescheduleModal(false)} style={{ background: '#fff', border: '1.5px solid #111827', color: '#111827', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }} className="animate-btn">Cancel</button>
              <button onClick={() => handleModalSubmit('reschedule')} style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }} className="animate-btn">Reschedule</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Partial Refund Modal (Frame 1561849200) ─── */}
      {showRefundModal && (
        <div className="modal-overlay">
          <div style={{ background: '#fff', borderRadius: '1rem', width: '420px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', animation: 'fadeInUp 0.3s ease-out' }}>
            <button onClick={() => setShowRefundModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 1.25rem 0' }}>Partial refund to customer</h3>
            <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0' }}></div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Enter amount for refund <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', fontSize: '0.875rem', color: '#4b5563' }}>₹</span>
                <input 
                  type="text" 
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={() => setShowRefundModal(false)} style={{ background: '#fff', border: '1.5px solid #111827', color: '#111827', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }} className="animate-btn">Cancel</button>
              <button onClick={() => handleModalSubmit('refund')} style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }} className="animate-btn">Process Refund</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

      {/* Tab Panels */}
      {activeSubTab === 'Return Request Details' && (
        <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Return Request Details</h2>
          <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Reason */}
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Reason Selected</span>
              <div style={{ background: '#f3f4f6', borderRadius: '0.375rem', padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>
                {dispute.reason}
              </div>
            </div>

            {/* Images grid */}
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>Supporting Media</span>
              <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', gap: '1rem' }}>
                {dispute.images.map((img, i) => (
                  <div 
                    key={i}
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '0.5rem', 
                      border: '1px solid #e5e7eb', 
                      background: `url(${img}) center/cover`,
                      position: 'relative',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Expand icon */}
                    <div style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '24px', background: 'rgba(255,255,255,0.9)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Order Summary' && (
        <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Order Summary</h2>
          <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

          {/* Bordered table wrapper */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>Product <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Spare Price <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'center' }}>Quantity <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Tax <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Amount <span style={{ color: '#d1d5db' }}>↓↑</span></th>
                </tr>
              </thead>
              <tbody>
                {dispute.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Mock image circle icon */}
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '1px solid #e5e7eb' }}>b</div>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827', textAlign: 'center' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                      ₹{item.tax.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#111827', textAlign: 'right' }}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}

                {/* Discount Code Promo Applied */}
                {dispute.discountCodeName && (
                  <tr style={{ background: '#f0fdf4', borderBottom: '1px solid #e5e7eb' }}>
                    <td colSpan={4} style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>
                      Discount Code ({dispute.discountCodeName})
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#16a34a', textAlign: 'right' }}>
                      - ₹{dispute.discountAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {/* Row totals summary */}
                <tr style={{ background: '#1f2937', color: 'white' }}>
                  <td colSpan={2} style={{ padding: '1rem 1.5rem' }}></td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 800, textAlign: 'center' }}>
                    {calculatedItemsTotalCount}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}></td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 800, textAlign: 'right' }}>
                    ₹{calculatedGrandTotal.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'Tracking & Billing Details' && (
        <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Payment Details</h2>
          <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Payment Method</span>
              <input type="text" readOnly value="UPI" style={{ background: '#f3f4f6' }} className="form-input" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Transaction ID</span>
              <input type="text" readOnly value="TXN-DEL-20260203-0001" style={{ background: '#f3f4f6' }} className="form-input" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Billing Address</span>
              <textarea readOnly value="123, MG Road&#10;Connaught Place&#10;New Delhi – 110001&#10;DELHI, INDIA" style={{ background: '#f3f4f6', minHeight: '100px', resize: 'none' }} className="form-input" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Shipping Address</span>
              <textarea readOnly value="123, MG Road&#10;Connaught Place&#10;New Delhi – 110001&#10;DELHI, INDIA" style={{ background: '#f3f4f6', minHeight: '100px', resize: 'none' }} className="form-input" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Shipping Timeline
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </h2>
          <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
        </div>
      )}
    </div>
  );
}
