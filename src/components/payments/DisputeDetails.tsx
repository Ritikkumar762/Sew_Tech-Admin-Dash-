import React from 'react';

interface DisputeDetailsProps {
  onBack: () => void;
  onResolve: () => void;
  onRefund: () => void;
}

export default function DisputeDetails({ onBack, onResolve, onRefund }: DisputeDetailsProps) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>
        {`
          .action-btn { transition: all 0.2s ease; }
          .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
          .action-btn:active { transform: translateY(0); }
        `}
      </style>
      
      {/* 1. Header Card (includes Title, Action buttons, and Info fields) */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        {/* Title and Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Simple thin back chevron */}
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', color: '#111827' }} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Rajdhani Exports Pvt. Ltd.
              <span style={{ fontSize: '0.75rem', color: '#2563eb', border: '1px dashed #bfdbfe', borderRadius: '0.375rem', padding: '0.2rem 0.5rem', fontWeight: 500, backgroundColor: '#eff6ff', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Dispute ID
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onRefund} className="action-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1px solid #111827', backgroundColor: 'white', color: '#111827', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Refund
            </button>
            <button onClick={onResolve} className="action-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#111827', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Resolve
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.25rem' }}>Email ID:</div>
            <div style={{ fontSize: '0.925rem', fontWeight: 600, color: '#111827' }}>demoemail@gmail.com</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.25rem' }}>Phone Number:</div>
            <div style={{ fontSize: '0.925rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              +919876543210
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" style={{ transform: 'rotate(-45deg)', cursor: 'pointer' }}><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.25rem' }}>Status:</div>
            <span style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.2rem 0.625rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem', display: 'inline-block' }}>Active</span>
          </div>
        </div>
      </div>

      {/* 2. Reported Issue Card */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '1rem' }}>Reported Issue</h3>
        <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0 0 1rem 0' }} />
        <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.5rem' }}>Issue Description:</div>
        <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
          had booked a service for my sewing machine because it was skipping stitches and making noise. The mechanic visited and serviced the machine, but the issue is still not resolved. The machine continues to skip stitches while sewing and the thread keeps breaking. I request a recheck or proper repair of the machine.
        </p>
      </div>

      {/* 3. Service Details Card */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '1rem' }}>Service Details</h3>
        <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0 0 1.5rem 0' }} />
        
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', color: '#2563eb', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
          Service : Instant Smart Booking
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.25rem' }}>Selected Date & Time:</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>28.02.2026 | 01:00-02:00 PM</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.25rem' }}>Language Preference:</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Hindi</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Address</div>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5, fontWeight: 500 }}>
              123, MG Road<br/>Connaught Place<br/>New Delhi - 110001<br/>DELHI, INDIA
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
