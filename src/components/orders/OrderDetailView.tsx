'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import AssignMechanicModal, { type Mechanic } from './AssignMechanicModal';
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
  const [assignedMechanic, setAssignedMechanic] = useState<Mechanic | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const timelineScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

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
          onAssign={(m) => setAssignedMechanic(m)}
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
              {!assignedMechanic && (
                <button
                  className="od-hov"
                  onClick={() => setShowAssign(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
                >
                  Assign Mechanic
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}
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

            {/* Mechanic Details Card — shown after assignment */}
            {assignedMechanic && (() => {
              const AVATAR_COLORS = ['#3b82f6','#f59e0b','#ef4444','#10b981','#8b5cf6','#ec4899','#06b6d4','#f97316'];
              const safeName = assignedMechanic.name || '';
              const getAvatarColor = (name: string) => {
                if (!name) return AVATAR_COLORS[0];
                let hash = 0;
                for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
                return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
              };
              const getInitials = (name: string) => {
                if (!name) return '?';
                return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
              };
              const jobs = assignedMechanic.jobsCompleted || assignedMechanic.totalJobs || 0;
              const avatarBg = assignedMechanic.avatarColor ?? getAvatarColor(safeName);
              const location = assignedMechanic.location || 'East Kailash';

              return (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>Mechanic details</span>
                    <button
                      className="od-hov"
                      onClick={() => setShowAssign(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '6px', background: '#0f172a', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Reassign Mechanic
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.13-5.87L21 8"/></svg>
                    </button>
                  </div>
                  
                  <div style={{ borderTop: '1px dashed #e2e8f0', marginBottom: '16px' }} />

                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', width: 'fit-content', minWidth: '340px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                          {safeName === 'Sameer Pant' ? (
                            <img src="/machanic.png" alt="Profile" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                          ) : (
                            <>
                              <img src="/avatar-clean.svg" alt="Profile" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', inset: 0, borderRadius: '8px', background: avatarBg + 'cc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                                {getInitials(safeName)}
                              </div>
                            </>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>{safeName || '–'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Service Start OTP- <span style={{ color: '#3b82f6', fontWeight: 600 }}>987654</span>
                            <svg style={{ marginLeft: '4px', cursor: 'pointer', verticalAlign: 'text-bottom' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          </div>
                        </div>
                      </div>
                      <svg style={{ cursor: 'pointer', color: '#3b82f6' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <div style={{ background: '#fff', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#64748b', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10"/><path d="M17 4v8a5 5 0 0 1-10 0V4"/><path d="M4 4h3v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h3"/></svg>
                        Master Mechanic
                      </div>
                      <div style={{ background: '#fff', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#64748b', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {location}
                      </div>
                      <div style={{ background: '#fff', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#64748b', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {jobs > 0 ? `${jobs}+ Bookings` : 'New Mechanic'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

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
                      <div key={i} className="od-thumb" style={{ position: 'relative', aspectRatio: '1', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/item_image.svg" alt="Supporting Media" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
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
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <img src="/recording.svg" alt="Audio Note" style={{ width: '100%', maxWidth: '100%', display: 'block' }} />
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            TRACKING & BILLING TAB
        ══════════════════════════════════ */}
        {activeTab === 'tracking' && (
          <div style={{ padding: '1.5rem', animation: 'odFade .3s ease', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Shipping Timeline Accordion */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div
                onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', cursor: 'pointer', backgroundColor: 'white' }}
              >
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Service Timeline</span>
                {isTimelineExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {isTimelineExpanded && (
                <div style={{ position: 'relative', backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => scrollTimeline('left')}
                    style={{
                      position: 'absolute',
                      left: '1rem',
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
                      zIndex: 10
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div
                    ref={timelineScrollRef}
                    style={{
                      overflowX: 'auto',
                      width: '100%',
                      padding: '2rem 3rem',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    } as React.CSSProperties}
                  >
                    <div style={{ display: 'flex', position: 'relative', alignItems: 'center', minWidth: '700px', padding: '1rem 0' }}>
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
                        { title: 'Service Booked',      date: '21st March, 2025 at 11:06 AM', position: 'top',    done: true,  alert: false },
                        { title: 'Mechanic Alloted',    date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: true,  alert: false },
                        { title: 'Ongoing Service',     date: '21st March, 2025 at 11:06 AM', position: 'top',    done: true,  alert: false },
                        { title: 'Diagnosis Available', date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: true,  alert: true  },
                        { title: 'Completed',           date: '21st March, 2025 at 11:06 AM', position: 'top',    done: false, alert: false },
                        { title: 'Pick Up',             date: '21st March, 2025',             position: 'bottom', done: false, alert: false },
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
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: node.done ? (node.alert ? '#dc2626' : '#2563eb') : '#d1d5db',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: node.done ? `0 0 0 4px ${node.alert ? '#fee2e2' : '#dbeafe'}` : '0 0 0 4px white',
                            zIndex: 3
                          }}>
                            {node.done && (
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
                  </div>

                  <button
                    onClick={() => scrollTimeline('right')}
                    style={{
                      position: 'absolute',
                      right: '1rem',
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
                      zIndex: 10
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Payment Details Accordion */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div
                onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', cursor: 'pointer', backgroundColor: 'white' }}
              >
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Payment Details</span>
                {isPaymentExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {isPaymentExpanded && (
                <div style={{ padding: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderTop: '1.5px dotted #e5e7eb', margin: '0 -1.5rem 0.5rem -1.5rem' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Payment Method</label>
                      <div style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>UPI</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Transaction ID</label>
                      <div style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>TXN-DEL-20260203-0001</div>
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
                      <label style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>Service Address</label>
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

          </div>
        )}

      </div>
    </div>
  );
}
