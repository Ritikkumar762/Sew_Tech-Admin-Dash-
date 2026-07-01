'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import AssignMechanicModal, { type Mechanic } from './AssignMechanicModal';
import CancelRequestModal from './CancelRequestModal';
import { useMechanics } from '@/app/mechanic/_hooks/useMechanics';

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

export type OrderStatus = 
  | 'Booked' 
  | 'Requested' 
  | 'MechanicAlloted' 
  | 'MechanicAssigned' 
  | 'MechanicSelected' 
  | 'BidLive' 
  | 'BidEnded' 
  | 'Ongoing' 
  | 'DiagnosisAvailable' 
  | 'Completed' 
  | 'Cancelled' 
  | 'PickUp';

export default function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();

  // Helper to get initial status based on orderId
  const getInitialStatusAndFlow = (id: string): { status: OrderStatus; isDiag: boolean } => {
    if (!id || !id.startsWith('REQ-')) {
      return { status: 'Booked', isDiag: false };
    }
    const idx = parseInt(id.replace('REQ-', ''), 10);
    if (isNaN(idx)) {
      return { status: 'Booked', isDiag: false };
    }
    
    // Cycle matching all table statuses:
    const statusCycle = [
      'MechanicAssigned',
      'Requested',
      'Cancelled',
      'Completed',
      'Booked',
      'MechanicAlloted',
      'Ongoing',
      'DiagnosisAvailable'
    ];
    const statusStr = statusCycle[idx % statusCycle.length];
    
    const isDiag = (statusStr === 'DiagnosisAvailable' || idx === 11);
    
    let status: OrderStatus = 'Booked';
    if (statusStr === 'MechanicAssigned') status = 'MechanicAssigned';
    else if (statusStr === 'Requested') status = 'Requested';
    else if (statusStr === 'Cancelled') status = 'Cancelled';
    else if (statusStr === 'Completed') status = 'Completed';
    else if (statusStr === 'Booked') status = 'Booked';
    else if (statusStr === 'MechanicAlloted') status = 'MechanicAlloted';
    else if (statusStr === 'Ongoing') status = 'Ongoing';
    else if (statusStr === 'DiagnosisAvailable') status = 'DiagnosisAvailable';
    
    const finalStatus = idx === 11 ? 'Completed' : status;
    return { status: finalStatus, isDiag };
  };

  const searchParams = useSearchParams();
  const paramServiceType = searchParams?.get('serviceType');
  const paramStatus = searchParams?.get('status');

  const getMappedStatus = (statusStr: string | null): OrderStatus => {
    if (!statusStr) return 'BidLive';
    switch (statusStr) {
      case 'Bid Live': return 'BidLive';
      case 'Bid Ended': return 'BidEnded';
      case 'Mechanic Selected': return 'MechanicSelected';
      case 'Ongoing': return 'Ongoing';
      case 'Completed': return 'Completed';
      case 'Diagnosis Available': return 'DiagnosisAvailable';
      case 'Cancelled': return 'Cancelled';
      default: return 'BidLive';
    }
  };

  const isInviteQuote = paramServiceType === 'Invite Quote';

  const initialStatus = isInviteQuote 
    ? getMappedStatus(paramStatus) 
    : getInitialStatusAndFlow(orderId).status;

  const initialIsDiag = isInviteQuote 
    ? (paramStatus === 'Diagnosis Available') 
    : getInitialStatusAndFlow(orderId).isDiag;

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(initialStatus);
  const [isDiagnosisFlow, setIsDiagnosisFlow] = useState<boolean>(initialIsDiag);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'MechanicAlloted': return 'Mechanic Allotted';
      case 'MechanicAssigned': return 'Mechanic Assigned';
      case 'MechanicSelected': return 'Mechanic Selected';
      case 'BidLive': return 'Bid Live';
      case 'BidEnded': return 'Bid Ended';
      case 'DiagnosisAvailable': return 'Diagnosis Available';
      case 'PickUp': return 'Pick Up';
      default: return status;
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch(status) {
      case 'MechanicAssigned':
      case 'MechanicAlloted':
      case 'MechanicSelected':
        return { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' };
      case 'Requested':
      case 'BidLive':
        return { bg: '#fef9c3', color: '#eab308', border: '#fef08a' };
      case 'Cancelled':
        return { bg: '#fee2e2', color: '#ef4444', border: '#fca5a5' };
      case 'Completed':
      case 'PickUp':
        return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' };
      case 'Booked':
        return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      case 'Ongoing':
        return { bg: '#cffafe', color: '#0891b2', border: '#a5f3fc' };
      case 'DiagnosisAvailable':
        return { bg: '#f3e8ff', color: '#a855f7', border: '#e9d5ff' };
      case 'BidEnded':
        return { bg: '#ffe4e6', color: '#e11d48', border: '#fecdd3' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };
    }
  };

  const [activeTab, setActiveTab] = useState<'summary' | 'quotes' | 'tracking'>('summary');
  const [sentNotification, setSentNotification] = useState(false);
  const [searchQuoteQuery, setSearchQuoteQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [tlOffset, setTlOffset]     = useState(0);
  const [showAssign, setShowAssign] = useState(false);
  
  const [quotes, setQuotes] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const { mechanics: apiMechanics, loading: loadingMechanics } = useMechanics();

  // Backend Integration Note: Initialize mechanic data if already assigned based on status
  const [assignedMechanic, setAssignedMechanic] = useState<Mechanic | null>(null);

  // Sync mechanic details if status is updated externally
  React.useEffect(() => {
    const mechanicStatuses = ['MechanicAlloted', 'MechanicAssigned', 'MechanicSelected', 'Ongoing', 'DiagnosisAvailable', 'Completed', 'PickUp'];
    if (mechanicStatuses.includes(orderStatus) && !assignedMechanic) {
      setAssignedMechanic({ name: 'Sameer Pant', id: 'm1', avatarColor: '#3b82f6', location: 'East Kailash', jobsCompleted: 300, totalJobs: 300 });
    } else if (!mechanicStatuses.includes(orderStatus) && assignedMechanic) {
      const hasAcceptedQuote = quotes.some(q => q.status === 'accepted');
      if (!hasAcceptedQuote) {
        setAssignedMechanic(null);
      }
    }
    
    // Sync cancellation state
    setIsCancelled(orderStatus === 'Cancelled');
  }, [orderStatus, quotes]);

  // Seeding Quote Data from Mechanics API (Replace this with real quotes API call)
  React.useEffect(() => {
    if (!loadingMechanics && apiMechanics.length > 0) {
      const formattedQuotes = apiMechanics.map((m, idx) => ({
        id: `MECH-${2040 + idx}`,
        name: m.name || 'Unknown Mechanic',
        price: 25000 + (idx * 1500),
        proximity: m.location ? `${m.location}` : '5 km away',
        submitted: '10:30 PM, 21 Jan\' 26',
        available: '10:30 PM, 21 Jan\' 26',
        status: idx === 0 ? 'accepted' : 'pending' // default accept first quote
      }));
      setQuotes(formattedQuotes);
      
      setAssignedMechanic(prev => {
        if (!prev) {
          return {
            name: apiMechanics[0].name || 'Aditya Bhargav',
            id: 'm-selected',
            avatarColor: '#3b82f6',
            location: apiMechanics[0].location || '5 km away',
            jobsCompleted: 150,
            totalJobs: 150
          };
        }
        return prev;
      });
    }
  }, [apiMechanics, loadingMechanics]);

  // ── Quotes State Handlers (Easy to integrate with your backend APIs) ──
  const handleAcceptQuote = (quoteId: string) => {
    // API mock: PATCH /api/quotes/:id { status: 'accepted' }
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) return { ...q, status: 'accepted' };
      if (q.status === 'accepted') return { ...q, status: 'pending' }; // deselect old accepted quote
      return q;
    }));
    
    const selected = quotes.find(q => q.id === quoteId);
    if (selected) {
      setAssignedMechanic({
        name: selected.name,
        id: 'm-selected',
        avatarColor: '#3b82f6',
        location: selected.proximity,
        jobsCompleted: 150,
        totalJobs: 150
      });
    }
  };

  const handleRejectQuote = (quoteId: string) => {
    // API mock: PATCH /api/quotes/:id { status: 'rejected' }
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'rejected' } : q));
  };

  const handleUndoQuote = (quoteId: string) => {
    // API mock: PATCH /api/quotes/:id { status: 'pending' }
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'pending' } : q));
  };

  const handleDeselectQuote = (quoteId: string) => {
    // API mock: PATCH /api/quotes/:id { status: 'pending' }
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'pending' } : q));
    setAssignedMechanic(null);
  };
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
              {['BidLive', 'BidEnded'].includes(orderStatus) ? 'Invite Quote' : 'Instant Smart Booking'}
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
            <div style={{ position: 'relative' }}>
              <button 
                className="od-hov" 
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Update Status
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {showStatusMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '240px', padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {[
                    { label: 'Booked', value: 'Booked' as OrderStatus, isDiag: false },
                    { label: 'Requested', value: 'Requested' as OrderStatus, isDiag: false },
                    { label: 'Mechanic Assigned', value: 'MechanicAssigned' as OrderStatus, isDiag: false },
                    { label: 'Mechanic Allotted', value: 'MechanicAlloted' as OrderStatus, isDiag: false },
                    { label: 'Mechanic Selected', value: 'MechanicSelected' as OrderStatus, isDiag: false },
                    { label: 'Bid Live', value: 'BidLive' as OrderStatus, isDiag: false },
                    { label: 'Bid Ended', value: 'BidEnded' as OrderStatus, isDiag: false },
                    { label: 'Ongoing Service', value: 'Ongoing' as OrderStatus, isDiag: false },
                    { label: 'Completed (Normal Flow)', value: 'Completed' as OrderStatus, isDiag: false },
                    { label: 'Diagnosis Available', value: 'DiagnosisAvailable' as OrderStatus, isDiag: true },
                    { label: 'Completed (After Diagnosis)', value: 'Completed' as OrderStatus, isDiag: true },
                    { label: 'Pick Up (Normal Flow)', value: 'PickUp' as OrderStatus, isDiag: false },
                    { label: 'Pick Up (After Diagnosis)', value: 'PickUp' as OrderStatus, isDiag: true },
                    { label: 'Cancelled', value: 'Cancelled' as OrderStatus, isDiag: false },
                  ].map(opt => (
                    <div 
                      key={opt.label} 
                      onClick={() => { 
                        setOrderStatus(opt.value); 
                        setIsDiagnosisFlow(opt.isDiag);
                        setShowStatusMenu(false); 
                      }}
                      style={{ 
                        padding: '8px 12px', 
                        fontSize: '0.8rem', 
                        fontWeight: 500, 
                        cursor: 'pointer', 
                        borderRadius: '6px', 
                        background: (orderStatus === opt.value && isDiagnosisFlow === opt.isDiag) ? '#f3f4f6' : 'transparent', 
                        color: (orderStatus === opt.value && isDiagnosisFlow === opt.isDiag) ? '#111827' : '#4b5563' 
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            ...((orderStatus === 'BidLive' || orderStatus === 'BidEnded') ? [
              { label: 'Bid Ends:',      value: '28.02.2026 | 02:00 PM', type: 'text' }
            ] : [
              { label: 'Order Value:',   value: '₹1,600',                type: 'text' }
            ]),
            { label: 'Status:',          value: getStatusLabel(orderStatus), type: 'badge' },
          ].map((col, i) => (
            <div key={i} style={{ paddingRight: i < 4 ? '1.5rem' : 0, borderRight: i < 4 ? '1px solid #f0f0f0' : 'none', paddingLeft: i > 0 ? '1.5rem' : 0 }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '5px', fontWeight: 400 }}>{col.label}</div>
              {col.type === 'badge' ? (
                <span style={{ 
                  display: 'inline-block', 
                  background: getStatusStyles(orderStatus).bg, 
                  color: getStatusStyles(orderStatus).color, 
                  border: `1px solid ${getStatusStyles(orderStatus).border}`, 
                  borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 
                }}>
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
          {(() => {
            const tabs: [string, string][] = [
              ['summary', 'Order Summary']
            ];
            
            if (['BidLive', 'BidEnded'].includes(orderStatus)) {
              tabs.push(['quotes', 'Quotes']);
            }
            
            tabs.push(['tracking', 'Tracking & Billing Details']);
            
            return tabs.map(([id, label]) => (
              <button
                key={id}
                className="od-tab"
                onClick={() => setActiveTab(id as any)}
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
            ));
          })()}
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
              const mechanicAvatarUrl = assignedMechanic.avatarUrl || null;
              const mechanicOtp = assignedMechanic.otp || '987654';
              const mechanicLevel = assignedMechanic.level || 'Master Mechanic';

              return (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>Mechanic details</span>
                    {!['Completed', 'PickUp'].includes(orderStatus) && (
                      <button
                        className="od-hov"
                        onClick={() => setShowAssign(true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '6px', background: '#0f172a', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Reassign Mechanic
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.13-5.87L21 8"/></svg>
                      </button>
                    )}
                  </div>
                  
                  <div style={{ borderTop: '1px dashed #e2e8f0', marginBottom: '16px' }} />

                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', width: 'fit-content', minWidth: '340px', maxWidth: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                          {mechanicAvatarUrl ? (
                            <img src={mechanicAvatarUrl} alt="Profile" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b' }}>{safeName || '–'}</div>
                            <svg style={{ cursor: 'pointer', color: '#3b82f6' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </div>
                          
                          {['Completed', 'PickUp'].includes(orderStatus) ? (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              Service Rating |
                              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', fontSize: '0.9rem' }}>
                                <span>★</span><span>★</span><span>★</span><span>★</span><span style={{ color: '#cbd5e1' }}>★</span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {['Ongoing', 'DiagnosisAvailable'].includes(orderStatus) ? 'Service End OTP- ' : 'Service Start OTP- '}
                              <span style={{ color: '#3b82f6', fontWeight: 600 }}>{mechanicOtp}</span>
                              <svg style={{ marginLeft: '4px', cursor: 'pointer', verticalAlign: 'text-bottom' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {['Completed', 'PickUp'].includes(orderStatus) ? (
                      <div style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.6, marginTop: '4px' }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.
                      </div>
                    ) : (
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
                    )}
                  </div>



                  {/* Extended Service Details (Diagnosis Available State) */}
                  {isDiagnosisFlow && ['DiagnosisAvailable', 'Completed', 'PickUp'].includes(orderStatus) && (
                    <div style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Extended Service Details</div>
                      <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.25rem' }} />
                      
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d4ed8' }}>Service : Extra Part Required - (Part Name Comes here)</span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>Selected Date & Time:</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '1.25rem' }}>28.02.2026 | 01:00-02:00 PM</div>
                          
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>Language Preference:</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Hindi</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>Address</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', lineHeight: 1.5 }}>
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
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', width: '100%' }}>

                {/* Supporting Media */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', flex: '1 1 300px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>Supporting Media</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className="od-thumb" style={{ position: 'relative', width: '80px', height: '80px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                {/* 
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1.2 1 380px' }}>
                  <img src="/recording.svg" alt="Audio Note" style={{ width: '100%', maxWidth: '440px', display: 'block' }} />
                </div>
                */}

              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            QUOTES TAB
        ══════════════════════════════════ */}
        {activeTab === 'quotes' && (
          <div style={{ padding: '1.5rem', animation: 'odFade .3s ease' }}>
            {/* Search Quote Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search by Mechanic Name/ID"
                  value={searchQuoteQuery}
                  onChange={(e) => setSearchQuoteQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    color: '#374151',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                />
              </div>
            </div>

            {/* Notification Toast */}
            {showToast && (
              <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                animation: 'odFade 0.2s ease'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Push notification sent to nearby mechanics successfully!
              </div>
            )}

            {/* Content Switch: Empty state or Quotes List */}
            {(!sentNotification && (orderStatus === 'BidLive' || orderStatus === 'BidEnded')) ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1f2937' }}>No Quotes Received</span>
                <button
                  onClick={() => {
                    setShowToast(true);
                    setSentNotification(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.625rem 1.25rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'background-color 0.2s, transform 0.1s'
                  }}
                  className="od-hov"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  Push Notification Again
                </button>
              </div>
            ) : (
               <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Mechanic</th>
                      <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Bid Price</th>
                      <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Proximity</th>
                      <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Submitted On</th>
                      <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Available</th>
                      <th style={{ padding: '0.875rem 1rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes
                    .filter(item => item.name.toLowerCase().includes(searchQuoteQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuoteQuery.toLowerCase()))
                    .map((row, idx) => {
                      const quoteStatus = row.status;
                      
                      return (
                        <tr key={idx} style={{ 
                          borderBottom: '1px solid #f3f4f6',
                          backgroundColor: quoteStatus === 'accepted' ? '#ecfdf5' : quoteStatus === 'rejected' ? '#f3f4f6' : 'white',
                          opacity: quoteStatus === 'rejected' ? 0.6 : 1
                        }}>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <input
                                type="radio"
                                name="quote-selection"
                                checked={quoteStatus === 'accepted'}
                                onChange={() => handleAcceptQuote(row.id)}
                                style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer', margin: 0 }}
                              />
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3b82f6', overflow: 'hidden' }}>
                                <img src="/avatar-clean.svg" alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{row.name}</div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: 500, color: '#2563eb', border: '1.5px dashed #93c5fd', borderRadius: '4px', padding: '1px 4px', cursor: 'pointer', marginTop: '2px' }}>
                                  {row.id}
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <div style={{
                              display: 'inline-flex',
                              padding: '0.25rem 0.75rem',
                              backgroundColor: quoteStatus === 'accepted' ? '#d1fae5' : '#eff6ff',
                              color: quoteStatus === 'accepted' ? '#10b981' : '#3b82f6',
                              borderRadius: '9999px',
                              fontWeight: 600,
                              fontSize: '0.8125rem'
                            }}>
                              ₹{row.price.toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: '#4b5563' }}>{row.proximity}</td>
                          <td style={{ padding: '0.875rem 1rem', color: '#4b5563', fontWeight: 500 }}>{row.submitted}</td>
                          <td style={{ padding: '0.875rem 1rem', color: '#4b5563', fontWeight: 500 }}>{row.available}</td>
                          <td style={{ padding: '0.875rem 1rem', textAlign: 'center', position: 'relative' }}>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(openDropdownId === row.id ? null : row.id);
                              }}
                              style={{
                                width: '32px', height: '32px',
                                borderRadius: '50%', border: 'none',
                                backgroundColor: openDropdownId === row.id ? '#e5e7eb' : 'transparent',
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#374151', margin: '0 auto'
                              }}
                              className="od-hov"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                            </button>

                            {openDropdownId === row.id && (
                              <div style={{
                                position: 'absolute', right: '2rem', top: '2.5rem',
                                backgroundColor: 'white', border: '1px solid #e5e7eb',
                                borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                zIndex: 10, minWidth: '140px', padding: '0.5rem 0',
                                textAlign: 'left'
                              }}>
                                {quoteStatus === 'rejected' ? (
                                  <div 
                                    onClick={() => {
                                      handleUndoQuote(row.id);
                                      setOpenDropdownId(null);
                                    }}
                                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#374151' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                  >
                                    Undo
                                  </div>
                                ) : quoteStatus === 'accepted' ? (
                                  <div 
                                    onClick={() => {
                                      handleDeselectQuote(row.id);
                                      setOpenDropdownId(null);
                                    }}
                                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#374151' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                  >
                                    Deselect Quote
                                  </div>
                                ) : (
                                  <>
                                    <div 
                                      onClick={() => {
                                        handleAcceptQuote(row.id);
                                        setOpenDropdownId(null);
                                      }}
                                      style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#374151' }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      Accept Quote
                                    </div>
                                    <div 
                                      onClick={() => {
                                        handleRejectQuote(row.id);
                                        setOpenDropdownId(null);
                                      }}
                                      style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#374151' }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      Reject Quote
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            TRACKING & BILLING TAB
        ══════════════════════════════════ */}
        {activeTab === 'tracking' && (
          <div style={{ padding: '1.5rem', animation: 'odFade .3s ease', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Service Timeline Accordion */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem' }}>
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
                    <div style={{ display: 'flex', position: 'relative', alignItems: 'center', minWidth: isDiagnosisFlow ? '850px' : '700px', padding: '1rem 0' }}>
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

                      {(() => {
                        const nodes = isDiagnosisFlow ? [
                          { title: 'Service Booked',      date: '21st March, 2025 at 11:06 AM', position: 'top',    done: true,  active: false },
                          { title: 'Mechanic Alloted',    date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: true,  active: false },
                          { title: 'Ongoing Service',     date: '21st March, 2025 at 11:06 AM', position: 'top',    done: true,  active: false },
                          { title: 'Completed',           date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: true,  active: false },
                          { title: 'Diagnosis Available', date: '21st March, 2025 at 11:06 AM', position: 'top',    done: true,  active: orderStatus === 'DiagnosisAvailable' },
                          { title: 'Completed',           date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: ['Completed', 'PickUp'].includes(orderStatus), active: orderStatus === 'Completed' },
                          { title: 'Pick Up',             date: '21st March, 2025',             position: 'top',    done: orderStatus === 'PickUp', active: orderStatus === 'PickUp' },
                        ] : [
                          { title: 'Service Booked',      date: '21st March, 2025 at 11:06 AM', position: 'top',    done: true,  active: ['Booked', 'Requested', 'BidLive'].includes(orderStatus) },
                          { title: 'Mechanic Alloted',    date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: !['Booked', 'Requested', 'BidLive'].includes(orderStatus),  active: ['MechanicAlloted', 'MechanicAssigned', 'MechanicSelected', 'BidEnded'].includes(orderStatus) },
                          { title: 'Ongoing Service',     date: '21st March, 2025 at 11:06 AM', position: 'top',    done: ['Ongoing', 'Completed', 'PickUp'].includes(orderStatus),  active: orderStatus === 'Ongoing' },
                          { title: 'Completed',           date: '21st March, 2025 at 11:06 AM', position: 'bottom', done: ['Completed', 'PickUp'].includes(orderStatus), active: orderStatus === 'Completed' },
                          { title: 'Pick Up',             date: '21st March, 2025',             position: 'top',    done: orderStatus === 'PickUp', active: orderStatus === 'PickUp' },
                        ];
                        
                        return nodes.map((node, idx) => (
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
                            backgroundColor: node.done ? '#2563eb' : '#d1d5db',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: node.active ? '0 0 0 4px #dbeafe' : (node.done ? '0 0 0 4px white' : '0 0 0 4px white'),
                            zIndex: 3
                          }}>
                            {(node.done && !node.active) && (
                              <span style={{ fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                            )}
                            {node.active && (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
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
                      ))})()
                      }
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

            {/* Service Request Billing Details Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827' }}>Service Request Billing Details</span>
              <button
                className="od-hov"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '6px', background: '#111827', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Invoice
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>

            {/* Billing & Payment Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Left: Billing Summary */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Billing Summary</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.8125rem', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Service Base Price :</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>₹4,500</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (5%) :</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>₹225</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (5%) :</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>₹225</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Coupon Code (SEW50) :</span>
                    <span style={{ fontWeight: 700 }}>- ₹225</span>
                  </div>
                </div>

                <div style={{ height: '1px', background: '#e5e7eb', margin: '1.25rem 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Final Invoice</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>₹5,000</span>
                </div>
              </div>

              {/* Right: Payment Details */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Payment Details</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Payment Method</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>UPI</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Transaction ID</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>TXN-DEL-20260203-0001</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Billing Address</span>
                    <div style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6, fontWeight: 500 }}>
                      123, MG Road<br />
                      Connaught Place<br />
                      New Delhi - 110001<br />
                      DELHI, INDIA
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {isDiagnosisFlow && ['DiagnosisAvailable', 'Completed', 'PickUp'].includes(orderStatus) && (
              <>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 2rem' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827' }}>After Diagnosis Billing Details</span>
                  <button
                    className="od-hov"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '6px', background: '#111827', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Invoice
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Billing Summary</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.8125rem', color: '#4b5563', fontWeight: 500 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Service Base Price :</span>
                        <span style={{ fontWeight: 600, color: '#111827' }}>₹4,500</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>GST (5%) :</span>
                        <span style={{ fontWeight: 600, color: '#111827' }}>₹225</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                        <span>Coupon Code (SEW50) :</span>
                        <span style={{ fontWeight: 700 }}>- ₹225</span>
                      </div>
                    </div>
                    <div style={{ height: '1px', background: '#e5e7eb', margin: '1.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Final Invoice</span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>₹5,000</span>
                    </div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Payment Details</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Payment Method</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>UPI</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Transaction ID</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>TXN-DEL-20260203-0001</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Billing Address</span>
                        <div style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6, fontWeight: 500 }}>
                          123, MG Road<br />
                          Connaught Place<br />
                          New Delhi - 110001<br />
                          DELHI, INDIA
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
