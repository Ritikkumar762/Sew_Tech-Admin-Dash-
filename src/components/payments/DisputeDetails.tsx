import React from 'react';

interface DisputeDetailsProps {
  onBack: () => void;
  onResolve: () => void;
  onRefund: () => void;
}

export default function DisputeDetails({ onBack, onResolve, onRefund }: DisputeDetailsProps) {
  return (
    <div style={{ padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
      <style>
        {`
          .action-btn { transition: transform 0.2s, opacity 0.2s; }
          .action-btn:hover { transform: scale(1.02); opacity: 0.9; }
        `}
      </style>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Rajdhani Exports Pvt. Ltd.
            <span style={{ fontSize: '0.75rem', color: '#3b82f6', border: '1px dashed #bfdbfe', borderRadius: '0.25rem', padding: '0.125rem 0.375rem', fontWeight: 500 }}>Dispute ID <svg style={{ display: 'inline' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onRefund} className="action-btn" style={{ padding: '0.625rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #111827', backgroundColor: 'white', color: '#111827', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Refund
          </button>
          <button onClick={onResolve} className="action-btn" style={{ padding: '0.625rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Resolve
          </button>
        </div>
      </div>

      {/* Info Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e5e7eb', borderBottom: '1px dashed #e5e7eb', padding: '1.5rem 0', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>Email ID:</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>demoemail@gmail.com</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>Phone Number:</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            +91 9876543210 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>Status:</div>
          <span style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>Active</span>
        </div>
      </div>

      {/* Reported Issue */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '1rem' }}>Reported Issue</h3>
        <hr style={{ border: 'none', borderTop: '1px dashed #e5e7eb', margin: '0 0 1rem 0' }} />
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Issue Description:</div>
        <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
          had booked a service for my sewing machine because it was skipping stitches and making noise. The mechanic visited and serviced the machine, but the issue is still not resolved. The machine continues to skip stitches while sewing and the thread keeps breaking. I request a recheck or proper repair of the machine.
        </p>
      </div>

      {/* Service Details */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: '#f8fafc' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '1rem' }}>Service Details</h3>
        <hr style={{ border: 'none', borderTop: '1px dashed #e5e7eb', margin: '0 0 1.5rem 0' }} />
        
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1.5rem' }}>
          Service : Instant Smart Booking
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>Selected Date & Time:</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>28.02.2026 | 01:00-02:00 PM</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>Language Preference:</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Hindi</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Address</div>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5 }}>
              123, MG Road<br/>Connaught Place<br/>New Delhi - 110001<br/>DELHI, INDIA
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
