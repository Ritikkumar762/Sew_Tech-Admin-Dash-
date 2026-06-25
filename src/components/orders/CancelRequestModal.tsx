'use client';

import React, { useState } from 'react';

interface CancelRequestModalProps {
  orderId?: string;
  onClose: () => void;
  onConfirmed: () => void;
}

const REASONS = [
  'Service provider unavailable',
  'Resource not assigned',
  'Service not supported in the selected area',
  'Unable to meet requested timeline',
  'Invalid or incomplete request details',
  'System error during processing',
  'Other',
];

export default function CancelRequestModal({ orderId = 'STS0193', onClose, onConfirmed }: CancelRequestModalProps) {
  const [step, setStep]           = useState<1 | 2>(1);
  const [checked, setChecked]     = useState<Set<string>>(new Set());
  const [note, setNote]           = useState('');

  const toggle = (r: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  };

  const handleReject = () => {
    onConfirmed();
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes crFade  { from { opacity:0 }                              to { opacity:1 } }
        @keyframes crSlide { from { opacity:0; transform:translateY(18px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        .cr-overlay { animation: crFade .2s ease; }
        .cr-modal   { animation: crSlide .25s cubic-bezier(.22,.68,0,1.15); }
        .cr-cb-row  { display:flex; align-items:center; gap:10px; padding:11px 0; border-bottom:1px solid #f3f4f6; cursor:pointer; transition:background .12s; border-radius:6px; }
        .cr-cb-row:last-of-type { border-bottom:none; }
        .cr-cb-row:hover { background:#f9fafb; }
        .cr-note:focus { outline:none; border-color:#2563eb !important; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
      `}</style>

      {/* Backdrop */}
      <div
        className="cr-overlay"
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}
      >
        <div
          className="cr-modal"
          onClick={e => e.stopPropagation()}
          style={{ background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'420px', boxShadow:'0 24px 72px rgba(0,0,0,0.2)', overflow:'hidden', position:'relative' }}
        >

          {/* ── STEP 1: Confirmation ── */}
          {step === 1 && (
            <div style={{ padding:'2rem 1.75rem 1.5rem' }}>

              {/* Close X */}
              <button onClick={onClose} style={{ position:'absolute', top:'14px', right:'14px', border:'none', background:'none', cursor:'pointer', color:'#9ca3af', padding:'4px', borderRadius:'6px', display:'flex', alignItems:'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              {/* Confirmation Illustration */}
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.25rem' }}>
                <img
                  src="/alert-02.svg"
                  alt="Confirmation"
                  style={{ width:'48px', height:'48px', objectFit:'contain' }}
                />
              </div>

              {/* Title */}
              <h2 style={{ margin:'0 0 0.625rem', fontSize:'1.0625rem', fontWeight:700, color:'#111827', textAlign:'center' }}>
                Cancelling Request #{orderId}
              </h2>
              <p style={{ margin:'0 0 1.75rem', fontSize:'0.875rem', color:'#6b7280', textAlign:'center', lineHeight:1.6 }}>
                Are you sure you want to cancel this request?<br/>This action cannot be undone.
              </p>

              {/* Buttons */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <button
                  onClick={onClose}
                  style={{ padding:'11px', border:'none', borderRadius:'10px', background:'#111827', color:'#fff', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#1f2937')}
                  onMouseLeave={e => (e.currentTarget.style.background='#111827')}
                >
                  Keep Order
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{ padding:'11px', border:'1.5px solid #fca5a5', borderRadius:'10px', background:'#fff', color:'#ef4444', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#fff5f5')}
                  onMouseLeave={e => (e.currentTarget.style.background='#fff')}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Select Reason ── */}
          {step === 2 && (
            <div style={{ padding:'1.75rem 1.75rem 1.5rem' }}>



              {/* Title */}
              <h2 style={{ margin:'0 0 1rem', fontSize:'1.0625rem', fontWeight:700, color:'#111827' }}>Select Reason</h2>

              {/* Reasons list */}
              <div style={{ marginBottom:'1rem' }}>
                {REASONS.map(reason => {
                  const isChecked = checked.has(reason);
                  return (
                    <div
                      key={reason}
                      className="cr-cb-row"
                      onClick={() => toggle(reason)}
                      style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 4px', borderBottom:'1px solid #f3f4f6', cursor:'pointer', borderRadius:'4px' }}
                    >
                      {/* Custom checkbox */}
                      <div style={{ width:'18px', height:'18px', borderRadius:'3px', border: isChecked ? 'none' : '1.5px solid #cbd5e1', background: isChecked ? '#2563eb' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .13s, border .13s' }}>
                        {isChecked && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize:'0.875rem', color:'#374151', fontWeight: isChecked ? 500 : 400, userSelect:'none' }}>{reason}</span>
                    </div>
                  );
                })}
              </div>

              {/* Add Note */}
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'0.8125rem', fontWeight:600, color:'#374151', marginBottom:'8px' }}>Add Note</div>
                <textarea
                  className="cr-note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add Note"
                  rows={3}
                  style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:'8px', padding:'10px 12px', fontSize:'0.875rem', color:'#374151', resize:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s, box-shadow .15s' }}
                />
              </div>

              {/* Footer Buttons — same grid as step 1 */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ padding:'11px', border:'1.5px solid #d1d5db', borderRadius:'10px', background:'#fff', color:'#374151', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background='#fff')}
                >
                  Back
                </button>
                <button
                  onClick={handleReject}
                  disabled={checked.size === 0}
                  style={{ padding:'11px', border:'none', borderRadius:'10px', background: checked.size > 0 ? '#f97316' : '#e5e7eb', color: checked.size > 0 ? '#fff' : '#9ca3af', fontSize:'0.9rem', fontWeight:600, cursor: checked.size > 0 ? 'pointer' : 'default', transition:'background .2s' }}
                >
                  Reject Request
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
