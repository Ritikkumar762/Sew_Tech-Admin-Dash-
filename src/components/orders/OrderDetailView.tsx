'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AssignMechanicModal from './AssignMechanicModal';
import CancelRequestModal from './CancelRequestModal';

interface OrderDetailViewProps {
  orderId: string;
}

const TIMELINE_STEPS = [
  { label: 'Service Booked',      date: '21st March, 2025 at 11:06 AM', done: true,  alert: false, top: true  },
  { label: 'Mechanic Alloted',    date: '21st March, 2025 at 11:06 AM', done: true,  alert: false, top: false },
  { label: 'Ongoing Service',     date: '21st March, 2025 at 11:06 AM', done: true,  alert: false, top: true  },
  { label: 'Completed',           date: '21st March, 2025 at 11:06 AM', done: true,  alert: false, top: false },
  { label: 'Diagnosis Available', date: '21st March, 2025 at 11:06 AM', done: true,  alert: true,  top: true  },
  { label: 'Completed',           date: '21st March, 2025 at 11:06 AM', done: true,  alert: false, top: false },
  { label: 'Pick Up',             date: '21st March, 2025',             done: false, alert: false, top: true  },
];

// Sewing machine SVG icon used as placeholder for media thumbnails
const SewingMachineIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', padding: '12px' }}>
    <ellipse cx="40" cy="56" rx="26" ry="10" fill="#cbd5e1" opacity=".4"/>
    <rect x="20" y="18" width="40" height="32" rx="8" fill="#94a3b8"/>
    <rect x="26" y="24" width="28" height="20" rx="5" fill="#e2e8f0"/>
    <circle cx="40" cy="34" r="7" fill="#64748b"/>
    <circle cx="40" cy="34" r="4" fill="#cbd5e1"/>
    <rect x="36" y="10" width="8" height="14" rx="4" fill="#64748b"/>
    <rect x="18" y="46" width="44" height="6" rx="3" fill="#64748b"/>
    <rect x="30" y="52" width="20" height="10" rx="3" fill="#94a3b8"/>
    <circle cx="40" cy="62" r="3" fill="#64748b"/>
  </svg>
);

export default function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'summary' | 'tracking'>('summary');
  const [isPlaying, setIsPlaying]   = useState(false);
  const [tlOffset, setTlOffset]     = useState(0);
  const [showAssign, setShowAssign] = useState(false);
  const [assignedMechanic, setAssignedMechanic] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const VISIBLE = 5;
  const visibleSteps = TIMELINE_STEPS.slice(tlOffset, tlOffset + VISIBLE);
  const canPrev = tlOffset > 0;
  const canNext = tlOffset + VISIBLE < TIMELINE_STEPS.length;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#111827' }}>
      <style>{`
        @keyframes odFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .od-fade    { animation: odFade 0.35s ease both; }
        .od-hov     { transition: box-shadow .18s, transform .18s; }
        .od-hov:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.10); }
        .od-tab     { transition: color .15s, border-color .15s; }
        .od-row-sep { border-bottom: 1px dashed #e5e7eb; }
        .od-thumb   { transition: transform .2s; }
        .od-thumb:hover { transform: scale(1.03); }
      `}</style>

      {/* ════════════════════════════════════
          HEADER CARD
      ════════════════════════════════════ */}
      <div className="od-fade" style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
        padding: '1.125rem 1.5rem 1.25rem', marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>

        {/* ── Row 1: back + name + badges + action buttons ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>

          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="od-hov"
              style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', color: '#374151' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            {/* Name */}
            <span style={{ fontSize: '1.3125rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
              Aditya Bhargav
            </span>

            {/* Order ID */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 500, color: '#3b82f6', border: '1.5px dashed #93c5fd', borderRadius: '5px', padding: '3px 7px', cursor: 'pointer', userSelect: 'none' }}>
              Order ID
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </span>

            {/* Booking type */}
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '20px', padding: '3px 10px' }}>
              Instant Smart Booking
            </span>
          </div>

          {/* Right – action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="od-hov" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', background: '#fff', color: '#374151', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Invoice
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <button
              className="od-hov"
              onClick={() => setShowCancel(true)}
              style={{ padding: '6px 14px', border: isCancelled ? 'none' : '1.5px solid #fca5a5', borderRadius: '8px', background: isCancelled ? '#fee2e2' : '#fff', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
            >
              {isCancelled ? '✕ Cancelled' : 'Cancel Request'}
            </button>
            <button className="od-hov" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Update Status
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>

        {/* ── Row 2: divider ── */}
        <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1rem' }} />

        {/* ── Row 3: info strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
          {[
            { label: 'Email ID:',        value: 'demoemail@gmail.com',   type: 'text'  },
            { label: 'Phone Number:',    value: '+91 9876543210',        type: 'phone' },
            { label: 'Payment Method:',  value: 'UPI',                   type: 'text'  },
            { label: 'Order Value:',     value: '₹1,600',               type: 'text'  },
            { label: 'Status:',          value: 'Booked',               type: 'badge' },
          ].map((col, i) => (
            <div key={i} style={{ paddingRight: i < 4 ? '1.5rem' : 0, borderRight: i < 4 ? '1px solid #f0f0f0' : 'none', paddingLeft: i > 0 ? '1.5rem' : 0 }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '5px', fontWeight: 400 }}>{col.label}</div>
              {col.type === 'badge' ? (
                <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 }}>
                  {col.value}
                </span>
              ) : col.type === 'phone' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 500, color: '#111827' }}>
                  {col.value}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </span>
              ) : (
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#111827' }}>{col.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          TAB CARD
      ════════════════════════════════════ */}
      {showAssign && (
        <AssignMechanicModal
          onClose={() => setShowAssign(false)}
          onAssign={(m) => setAssignedMechanic(m.name)}
        />
      )}
      {showCancel && (
        <CancelRequestModal
          orderId={orderId}
          onClose={() => setShowCancel(false)}
          onConfirmed={() => setIsCancelled(true)}
        />
      )}

      <div className="od-fade" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', animationDelay: '0.05s' }}>

        {/* ── Tab row ── */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #e5e7eb', padding: '0 1.5rem' }}>
          {([['summary', 'Order Summary'], ['tracking', 'Tracking & Billing Details']] as const).map(([id, label]) => (
            <button
              key={id}
              className="od-tab"
              onClick={() => setActiveTab(id)}
              style={{
                padding: '14px 4px',
                marginRight: '2rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeTab === id ? 600 : 400,
                color: activeTab === id ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === id ? '2.5px solid #2563eb' : '2.5px solid transparent',
                marginBottom: '-1.5px',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════
            ORDER SUMMARY TAB
        ══════════════════════════════════ */}
        {activeTab === 'summary' && (
          <div style={{ padding: '1.5rem', animation: 'odFade .3s ease' }}>

            {/* Service Details heading row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>Service Details</span>
              <button
                className="od-hov"
                onClick={() => setShowAssign(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px', border: 'none', borderRadius: '8px', background: assignedMechanic ? '#059669' : '#111827', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
              >
                {assignedMechanic ? `✓ ${assignedMechanic}` : 'Assign Mechanic'}
                {!assignedMechanic && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
              </button>
            </div>
            <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.25rem' }} />

            {/* Service pill */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d4ed8' }}>Service : Machine checkup</span>
            </div>

            {/* Date + Address row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Left */}
              <div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>Selected Date &amp; Time:</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.125rem' }}>28.02.2026 &nbsp;|&nbsp; 01:00 – 02:00 PM</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>Language Preference:</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Hindi</div>
              </div>
              {/* Right */}
              <div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '6px' }}>Address</div>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 14px', fontSize: '0.875rem', color: '#374151', lineHeight: 1.75 }}>
                  123, MG Road<br/>Connaught Place<br/>New Delhi – 110001<br/>DELHI, INDIA
                </div>
              </div>
            </div>

            {/* Machine Details */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Machine Details</div>
              <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.125rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[
                  ['Machine Type:', 'Industrial Lockstitch'],
                  ['Machine Brand:', 'Juki'],
                  ['Model Number:', 'DDL-8700'],
                  ['Serial Number:', 'JUK-DDL8700-IN-45821'],
                ].map(([lbl, val], i) => (
                  <div key={i}>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>{lbl}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Machine Complaint */}
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Machine Complaint</div>
              <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.125rem' }} />

              {/* Description + Error Code */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '5px' }}>Description:</div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
                    Machine fault description will come here, in more than 2 lines. Machine fault description will come here, in more than 2 lines.
                  </p>
                </div>
                <span style={{ flexShrink: 0, background: '#fee2e2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  Error Code : 178
                </span>
              </div>

              {/* Supporting Media + Audio Note */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                {/* Supporting Media */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>Supporting Media</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className="od-thumb" style={{ position: 'relative', aspectRatio: '1', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer' }}>
                        <SewingMachineIcon />
                        {/* expand icon top-left */}
                        <div style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(255,255,255,0.82)', borderRadius: '4px', padding: '3px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2">
                            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audio Note */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>Audio Note</div>

                  {/* Waveform row */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', whiteSpace: 'nowrap', fontWeight: 500 }}>00:20</span>
                    <div style={{ flex: 1, height: '30px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {Array.from({ length: 44 }).map((_, j) => {
                        const h = Math.max(4, Math.abs(Math.sin(j * 0.55 + 0.3)) * 24 + 4);
                        return (
                          <div key={j} style={{
                            flex: 1, height: `${h}px`,
                            background: j < 22 ? '#3b82f6' : '#d1d5db',
                            borderRadius: '2px',
                          }}/>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', whiteSpace: 'nowrap', fontWeight: 500 }}>01:20</span>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    {/* mute */}
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center' }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                    </button>
                    {/* -10s */}
                    <button style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid #d1d5db', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#374151' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-6.51"/><text x="7" y="17" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">10</text></svg>
                    </button>
                    {/* play/pause */}
                    <button
                      className="od-hov"
                      onClick={() => setIsPlaying(p => !p)}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: '#111827', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {isPlaying
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      }
                    </button>
                    {/* +10s */}
                    <button style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid #d1d5db', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#374151' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-6.51"/><text x="7" y="17" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">10</text></svg>
                    </button>
                    {/* download */}
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center' }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            TRACKING & BILLING TAB
        ══════════════════════════════════ */}
        {activeTab === 'tracking' && (
          <div style={{ padding: '1.5rem', animation: 'odFade .3s ease' }}>

            {/* Service Timeline */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>Service Timeline</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
              </div>
              <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.5rem' }} />

              {/* Timeline widget */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Prev */}
                <button
                  onClick={() => setTlOffset(o => Math.max(0, o - 1))}
                  disabled={!canPrev}
                  style={{ flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: canPrev ? 'pointer' : 'default', opacity: canPrev ? 1 : 0.35, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>

                {/* Steps */}
                <div style={{ flex: 1, position: 'relative' }}>
                  {/* Connecting line */}
                  <div style={{ position: 'absolute', top: '50%', left: `calc(100% / ${visibleSteps.length} / 2)`, right: `calc(100% / ${visibleSteps.length} / 2)`, height: '2px', background: '#e5e7eb', transform: 'translateY(-50%)', zIndex: 0 }}>
                    {/* Filled portion (blue) */}
                    <div style={{ height: '100%', width: `${(visibleSteps.filter(s => s.done).length / Math.max(1, visibleSteps.length - 1)) * 100}%`, background: 'linear-gradient(to right, #2563eb, #60a5fa)', borderRadius: '2px' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleSteps.length}, 1fr)`, position: 'relative', zIndex: 1 }}>
                    {visibleSteps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Top label */}
                        <div style={{ textAlign: 'center', marginBottom: '8px', minHeight: '42px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                          {step.top && (
                            <>
                              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{step.label}</div>
                              <div style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: '2px' }}>{step.date}</div>
                            </>
                          )}
                        </div>

                        {/* Dot */}
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: step.done ? (step.alert ? '#ef4444' : '#2563eb') : '#fff',
                          border: step.done
                            ? `3px solid ${step.alert ? '#ef4444' : '#2563eb'}`
                            : '3px solid #d1d5db',
                          boxShadow: step.done
                            ? `0 0 0 4px ${step.alert ? '#fee2e2' : '#dbeafe'}`
                            : 'none',
                          flexShrink: 0,
                          zIndex: 2,
                        }} />

                        {/* Bottom label */}
                        <div style={{ textAlign: 'center', marginTop: '8px', minHeight: '42px' }}>
                          {!step.top && (
                            <>
                              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{step.label}</div>
                              <div style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: '2px' }}>{step.date}</div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next */}
                <button
                  onClick={() => setTlOffset(o => Math.min(TIMELINE_STEPS.length - VISIBLE, o + 1))}
                  disabled={!canNext}
                  style={{ flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: canNext ? 'pointer' : 'default', opacity: canNext ? 1 : 0.35, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            {/* Service Request Billing Details */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>Service Request Billing Details</span>
                <button className="od-hov" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  Invoice
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              </div>
              <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.25rem' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Billing Summary */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.125rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Billing Summary</div>
                  <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '10px' }} />

                  {[
                    { lbl: 'Service Base Price :',   val: '₹4,500', lc: '#6b7280', vc: '#111827' },
                    { lbl: 'GST (5%) :',             val: '₹225',   lc: '#6b7280', vc: '#111827' },
                    { lbl: 'GST (5%) :',             val: '₹225',   lc: '#6b7280', vc: '#111827' },
                    { lbl: 'Coupon Code (SEW50):',   val: '- ₹225', lc: '#059669', vc: '#059669' },
                  ].map((r, i) => (
                    <div key={i} className="od-row-sep" style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0' }}>
                      <span style={{ fontSize: '0.8125rem', color: r.lc }}>{r.lbl}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: r.vc }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Final Invoice</span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>₹5,000</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.125rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Payment Details</div>
                  <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '14px' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '6px' }}>Payment Method</div>
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 10px', fontSize: '0.875rem', fontWeight: 500 }}>UPI</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '6px' }}>Transaction ID</div>
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 10px', fontSize: '0.8rem', fontWeight: 500 }}>TXN-DEL-20260203-0001</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '6px' }}>Billing Address</div>
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px 12px', fontSize: '0.875rem', color: '#374151', lineHeight: 1.75 }}>
                      123, MG Road<br/>Connaught Place<br/>New Delhi – 110001<br/>DELHI, INDIA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
