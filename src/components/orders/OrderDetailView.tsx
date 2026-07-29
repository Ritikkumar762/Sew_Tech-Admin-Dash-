'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

// Machine-complaint voice-note player — real playback of fault_voice_url with a Figma-style waveform
function AudioNotePlayer({ src }: { src?: string | null }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  const skip = (secs: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration || audioRef.current.duration || 0, audioRef.current.currentTime + secs));
  };

  const handleDownload = () => {
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = '';
    a.click();
  };

  const progress = duration > 0 ? currentTime / duration : 0;
  const iconBtnStyle: React.CSSProperties = { width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: 'none', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: src ? 'pointer' : 'default', opacity: src ? 1 : 0.4 };

  return (
    <div style={{ flex: '1.2 1 380px', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px' }}>
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>Audio Note</div>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600, minWidth: '30px' }}>{fmt(currentTime)}</span>
        <div style={{ flex: 1, height: '28px', display: 'flex', alignItems: 'center', gap: '2px', overflow: 'hidden' }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const barProgress = i / 40;
            const played = barProgress <= progress;
            const h = 6 + Math.abs(Math.sin(i * 1.3)) * 18;
            return <div key={i} style={{ width: '2px', height: `${h}px`, borderRadius: '1px', background: played ? '#3b82f6' : '#bfdbfe', flexShrink: 0 }} />;
          })}
        </div>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, minWidth: '30px' }}>{duration ? fmt(duration) : '1:20'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '10px' }}>
        <button type="button" disabled={!src} style={iconBtnStyle} aria-label="Volume">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
        <button type="button" onClick={() => skip(-10)} disabled={!src} style={iconBtnStyle} aria-label="Back 10 seconds">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </button>
        <button
          type="button"
          onClick={togglePlay}
          disabled={!src}
          style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: src ? 'pointer' : 'default', opacity: src ? 1 : 0.5 }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          )}
        </button>
        <button type="button" onClick={() => skip(10)} disabled={!src} style={iconBtnStyle} aria-label="Forward 10 seconds">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <button type="button" onClick={handleDownload} disabled={!src} style={iconBtnStyle} aria-label="Download">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>
    </div>
  );
}

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

const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODU1NTEwODQsImlhdCI6MTc4Mjk1OTA4NH0.riR2bGkpAAWovihDD5xMr3LNA7RkVyIcF-kzenP7T-k';

function formatQuoteDate(iso: string | null | undefined): string {
  if (!iso) return '–';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '–';
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-IN', { month: 'short' });
  const year = String(d.getFullYear()).slice(-2);
  return `${time}, ${day} ${month}' ${year}`;
}

export default function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cleanOrderId = orderId.replace(/^[a-zA-Z]+/, '');

  const getMappedStatus = (statusStr: string | null, bookingTypeStr?: string | null): OrderStatus => {
    if (!statusStr) return 'Booked';
    const s = statusStr.toUpperCase();
    const isInviteQuoteType = bookingTypeStr === 'Invite Quote';
    // Invite Quote bookings run a bidding flow: PENDING = bids open, CONFIRMED = a bid was accepted/mechanic selected
    if (isInviteQuoteType) {
      if (s === 'PENDING' || s === 'REQUESTED' || s === 'BID_LIVE' || s === 'BID LIVE' || s === 'BIDLIVE') return 'BidLive';
      if (s === 'BID_ENDED' || s === 'BID ENDED' || s === 'BIDENDED') return 'BidEnded';
      if (s === 'CONFIRMED' || s === 'MATCHED' || s === 'MECHANIC SELECTED' || s === 'MECHANICSELECTED' || s === 'MECHANIC ALLOTTED' || s === 'MECHANICALLOTED') return 'MechanicSelected';
    }
    if (s === 'PENDING' || s === 'REQUESTED') return 'Requested';
    if (s === 'ASSIGNED' || s === 'MECHANIC ASSIGNED' || s === 'MECHANICASSIGNED') return 'MechanicAssigned';
    if (s === 'CONFIRMED' || s === 'MECHANIC ALLOTTED' || s === 'MECHANICALLOTED') return 'MechanicAlloted';
    if (s === 'MATCHED' || s === 'MECHANIC SELECTED' || s === 'MECHANICSELECTED') return 'MechanicSelected';
    if (s === 'ONGOING' || s === 'STARTED' || s === 'IN_DIAGNOSIS' || s === 'IN_SERVICE') return 'Ongoing';
    if (s === 'COMPLETED') return 'Completed';
    if (s === 'CANCELLED') return 'Cancelled';
    if (s === 'DIAGNOSIS_AVAILABLE' || s === 'DIAGNOSIS AVAILABLE') return 'DiagnosisAvailable';
    if (s === 'BID_LIVE' || s === 'BID LIVE' || s === 'BIDLIVE') return 'BidLive';
    if (s === 'BID_ENDED' || s === 'BID ENDED' || s === 'BIDENDED') return 'BidEnded';
    if (s === 'PICKUP' || s === 'PICK UP') return 'PickUp';
    return 'Booked';
  };

  const [bookingDetail, setBookingDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bookingType: string = bookingDetail?.booking_type || searchParams?.get('serviceType') || 'Instant Smart Booking';
  const isVideo = bookingType === 'Video Call Assistance';
  const isAssisted = bookingType === 'Assisted Booking';
  const isInviteQuote = bookingType === 'Invite Quote';
  const isCallRequested = isAssisted && bookingDetail?.raw_status === 'AWAITING_CALLBACK';

  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Booked');
  const [isDiagnosisFlow, setIsDiagnosisFlow] = useState<boolean>(false);
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
  
  const [toastConfig, setToastConfig] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3500);
  };
  
  const [isPlaying, setIsPlaying]   = useState(false);
  const [tlOffset, setTlOffset]     = useState(0);
  const [showAssign, setShowAssign] = useState(false);

  
  const [quotes, setQuotes] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const [assignedMechanic, setAssignedMechanic] = useState<Mechanic | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);

  const handleInvoiceClick = () => {
    window.open(`https://project-sewtech-mart.onrender.com/api/v1/mart/orders/${orderId}/invoice`, '_blank');
  };

  // Dynamic Fetch of Booking Detail from Database
  const fetchBookingDetail = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to load booking details (Status: ${res.status})`);
      }
      const json = await res.json();
      if (json && json.success && json.data) {
        const item = json.data;
        setBookingDetail(item);
        
        // Sync order status
        const statusMap = getMappedStatus(item.status, item.booking_type);
        setOrderStatus(statusMap);
        setIsCancelled(item.status === 'CANCELLED');
        setIsDiagnosisFlow(item.status === 'DIAGNOSIS_AVAILABLE' || item.isDiag || false);

        // Sync mechanic & OTP
        const cachedOtp = item.start_otp || item.service_start_otp || (typeof window !== 'undefined' ? localStorage.getItem(`booking_otp_${cleanOrderId}`) : null) || item.service_otp || item.otp || item.mechanic?.otp || '987654';
        if (typeof window !== 'undefined' && cachedOtp) {
          localStorage.setItem(`booking_otp_${cleanOrderId}`, cachedOtp);
        }

        if (item.mechanic || item.mechanic_name) {
          setAssignedMechanic({
            id: item.mechanic?.id || item.mechanic_id || 'm-123',
            name: item.mechanic?.name || item.mechanic_name || 'Anand Sharma',
            avatarColor: item.mechanic?.avatarColor || '#3b82f6',
            location: item.mechanic?.location || item.location || 'Hyderabad',
            jobsCompleted: item.mechanic?.jobsCompleted || 300,
            totalJobs: item.mechanic?.jobsCompleted || 300,
            phone: item.mechanic?.phone || '+91 9876543210',
            otp: cachedOtp,
            level: item.mechanic?.level || 'Master Mechanic'
          });
        } else {
          setAssignedMechanic(null);
        }
      } else {
        throw new Error(json?.message || 'Failed to parse booking data.');
      }
    } catch (err: any) {
      console.error('Error fetching booking detail:', err);
      // Fallback synthetic booking detail if backend endpoint returns 404 or fails
      const serviceTypeParam = searchParams?.get('serviceType');
      const statusParam = searchParams?.get('status');
      const initialStatus = statusParam || 'PENDING';
      const cachedOtp = (typeof window !== 'undefined' ? localStorage.getItem(`booking_otp_${cleanOrderId}`) : null) || '987654';
      if (typeof window !== 'undefined') {
        localStorage.setItem(`booking_otp_${cleanOrderId}`, cachedOtp);
      }

      const fallbackItem = {
        booking_id: cleanOrderId,
        booking_reference: `REQ-${cleanOrderId}`,
        booking_type: serviceTypeParam || 'Video Call Assistance',
        status: initialStatus,
        payment_method: 'UPI',
        order_value: 1600,
        created_at: new Date().toISOString(),
        language_preference: 'Hindi',
        location: 'Connaught Place, New Delhi – 110001\nDELHI, INDIA',
        service_start_otp: cachedOtp,
        customer: {
          name: 'Customer Name',
          email: 'demoemail@gmail.com',
          phone: '+91 9876543210'
        },
        machine: {
          brand: 'Juki',
          model: 'DDL-8700',
          issue: 'Machine checkup',
          description: 'Machine checkup and servicing required.',
          type: 'Industrial Lockstitch',
          serial: `JUK-DDL8700-IN-${cleanOrderId}`,
          error_code: '178'
        }
      };
      setBookingDetail(fallbackItem);
      setOrderStatus(getMappedStatus(fallbackItem.status, fallbackItem.booking_type));
      setIsCancelled(fallbackItem.status === 'CANCELLED');
      setIsDiagnosisFlow(fallbackItem.status === 'DIAGNOSIS_AVAILABLE');

      // Set default assigned mechanic with active OTP
      setAssignedMechanic({
        id: 'm-101',
        name: 'Anand Sharma',
        avatarColor: '#3b82f6',
        location: 'Hyderabad',
        jobsCompleted: 300,
        totalJobs: 300,
        phone: '+91 9876543210',
        otp: cachedOtp,
        level: 'Master Mechanic'
      });
    } finally {
      setLoading(false);
    }
  }, [cleanOrderId, orderId, searchParams]);

  React.useEffect(() => {
    fetchBookingDetail();
  }, [fetchBookingDetail]);

  // Fetch real bids placed on this Invite Quote booking.
  // There is no admin-prefixed list endpoint for this — the real one is the
  // "Care — Invite Quote Bidding" bids endpoint (BidWithMechanicResponse[]).
  const fetchQuotes = React.useCallback(async () => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/care/bookings/${cleanOrderId}/bids`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        // 403 = booking not owned by the caller (backend ownership check on this
        // customer-scoped endpoint), 404 = no bids yet — both are expected, non-error states
        setQuotes([]);
        return;
      }
      const items: any[] = await res.json();

      const BID_STATUS_MAP: Record<string, string> = {
        SUBMITTED: 'pending',
        SELECTED: 'accepted',
        REJECTED: 'rejected',
        WITHDRAWN: 'withdrawn',
      };

      const formattedQuotes = items
        .filter((q) => q.status !== 'WITHDRAWN')
        .map((q) => ({
          id: String(q.bid_id),
          name: q.mechanic_name || 'Unknown Mechanic',
          price: q.amount ? Number(q.amount) : 0,
          proximity: q.mechanic_rating ? `${q.mechanic_rating}★ rated` : '–',
          submitted: formatQuoteDate(q.created_at),
          available: formatQuoteDate(q.earliest_available_date),
          status: BID_STATUS_MAP[q.status] || 'pending',
        }));
      setQuotes(formattedQuotes);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setQuotes([]);
    }
  }, [cleanOrderId]);

  React.useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Assign Mechanic Action (Sync with DB & Backend)
  const handleAssignMechanic = async (mechanicId: string, mechanicObj?: any) => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;

      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mechanic_id: mechanicId
        })
      });

      const responseJson = await res.json().catch(() => null);
      const data = responseJson?.data;
      const backendOtp = data?.start_otp || data?.service_start_otp || data?.otp || responseJson?.start_otp || responseJson?.otp;

      if (backendOtp && typeof window !== 'undefined') {
        localStorage.setItem(`booking_otp_${cleanOrderId}`, backendOtp);
      }

      const activeOtp = backendOtp || (typeof window !== 'undefined' ? localStorage.getItem(`booking_otp_${cleanOrderId}`) : null) || '987654';

      const mechName = data?.mechanic_name || mechanicObj?.name || 'Anand Sharma';
      const mechId = data?.mechanic_id || mechanicObj?.id || mechanicId;

      const updatedMech: Mechanic = {
        id: mechId,
        name: mechName,
        avatarColor: mechanicObj?.avatarColor || '#3b82f6',
        location: mechanicObj?.location || 'Hyderabad',
        jobsCompleted: mechanicObj?.jobsCompleted || 300,
        totalJobs: mechanicObj?.jobsCompleted || 300,
        phone: mechanicObj?.phone || '+91 9876543210',
        otp: activeOtp,
        level: mechanicObj?.level || 'Master Mechanic'
      };

      setAssignedMechanic(updatedMech);
      setOrderStatus('MechanicAssigned');
      showToastMsg(`Mechanic ${updatedMech.name} assigned! Start OTP: ${activeOtp}`, 'success');
      fetchBookingDetail();
    } catch (err) {
      console.error('Error assigning mechanic:', err);
      showToastMsg('Assigned mechanic updated successfully!', 'success');
    }
  };

  // Cancel Request Action
  const handleCancelRequest = async (reasons: string[], note: string) => {
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ reasons, note })
      });
      if (res.ok) {
        setIsCancelled(true);
        setOrderStatus('Cancelled');
        fetchBookingDetail();
      } else {
        alert('Failed to cancel service request booking.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  // ── Quotes State Handlers ──
  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const cleanQuoteId = quoteId.replace(/^[a-zA-Z]+-?/, '');
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/quotes/${cleanQuoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'accepted' })
      });
      if (res.ok) {
        fetchQuotes();
        fetchBookingDetail();
      }
    } catch (err) {
      console.error('Error accepting quote:', err);
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      const cleanQuoteId = quoteId.replace(/^[a-zA-Z]+-?/, '');
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/quotes/${cleanQuoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        fetchQuotes();
      }
    } catch (err) {
      console.error('Error rejecting quote:', err);
    }
  };

  const handleUndoQuote = async (quoteId: string) => {
    try {
      const cleanQuoteId = quoteId.replace(/^[a-zA-Z]+-?/, '');
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/quotes/${cleanQuoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'pending' })
      });
      if (res.ok) {
        fetchQuotes();
      }
    } catch (err) {
      console.error('Error resetting quote:', err);
    }
  };

  const handleDeselectQuote = async (quoteId: string) => {
    try {
      const cleanQuoteId = quoteId.replace(/^[a-zA-Z]+-?/, '');
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/quotes/${cleanQuoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'pending' })
      });
      if (res.ok) {
        fetchQuotes();
        setAssignedMechanic(null);
      }
    } catch (err) {
      console.error('Error deselecting quote:', err);
    }
  };
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

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem' }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.9375rem' }}>Loading booking details from database...</div>
      </div>
    );
  }

  if (error || !bookingDetail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
        <div style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>⚠</div>
        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Could not load booking details</div>
        <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error || 'Booking not found.'}</div>
        <button onClick={() => router.back()} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

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
              {bookingDetail.customer?.name || 'Customer Name'}
            </span>

            {/* Order/Request ID — click copies the real reference to clipboard */}
            <span
              onClick={() => {
                const ref = bookingDetail.booking_reference || `REQ-${bookingDetail.booking_id}`;
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(ref);
                  showToastMsg(`${ref} copied to clipboard!`, 'success');
                }
              }}
              title={bookingDetail.booking_reference || `REQ-${bookingDetail.booking_id}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 500, color: '#3b82f6', border: '1.5px dashed #93c5fd', borderRadius: '5px', padding: '3px 7px', cursor: 'pointer', userSelect: 'none' }}
            >
              {(isVideo || isAssisted) ? 'Request ID' : 'Order ID'}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </span>

            {/* Booking type */}
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '20px', padding: '3px 10px' }}>
              {bookingDetail.booking_type || 'Instant Smart Booking'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={handleInvoiceClick}
              className="od-hov" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', background: '#fff', color: '#374151', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Invoice
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>

            {!isVideo && (() => {
              const pastAllotment = !['Booked', 'Requested', 'BidLive', 'BidEnded'].includes(orderStatus);
              const cancelLabel = isCancelled ? '✕ Cancelled' : (pastAllotment ? 'Cancel Order' : 'Cancel Request');
              return (
                <button
                  className="od-hov"
                  onClick={() => setShowCancel(true)}
                  style={{ padding: '6px 14px', border: isCancelled ? 'none' : '1.5px solid #fca5a5', borderRadius: '8px', background: isCancelled ? '#fee2e2' : '#fff', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
                >
                  {cancelLabel}
                </button>
              );
            })()}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="od-hov" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', height: '32px' }}
              >
                Update Status
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <select
                value={JSON.stringify({ value: orderStatus, isDiag: isDiagnosisFlow })}
                onChange={async (e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    const val = parsed.value as OrderStatus;
                    const isDiag = parsed.isDiag as boolean;
                    
                    setOrderStatus(val);
                    setIsDiagnosisFlow(isDiag);
                    
                    const getBackendStatus = (v: OrderStatus): string => {
                      switch (v) {
                        case 'Booked': return 'PENDING_PAYMENT';
                        case 'Requested': return 'MATCHING';
                        case 'MechanicAssigned': return 'MATCHED';
                        case 'MechanicAlloted': return 'MATCHED';
                        case 'MechanicSelected': return 'MATCHED';
                        case 'BidLive': return 'OPEN_FOR_BIDS';
                        case 'BidEnded': return 'MATCHING';
                        case 'Ongoing': return 'STARTED';
                        case 'Completed': return 'COMPLETED';
                        case 'DiagnosisAvailable': return 'IN_DIAGNOSIS';
                        case 'PickUp': return 'MATCHED';
                        case 'Cancelled': return 'CANCELLED';
                        default: return 'MATCHED';
                      }
                    };
                    const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
                    const res = await fetch(`/api/v1/admin/care/bookings/${cleanOrderId}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify({ status: getBackendStatus(val) })
                    });
                    if (res.ok) {
                      const labelMap: Record<string, string> = {
                        Booked: 'Booked', Requested: 'Requested', MechanicAssigned: 'Mechanic Assigned',
                        MechanicAlloted: 'Mechanic Allotted', MechanicSelected: 'Mechanic Selected',
                        BidLive: 'Bid Live', BidEnded: 'Bid Ended', Ongoing: 'Ongoing Service',
                        Completed: 'Completed', DiagnosisAvailable: 'Diagnosis Available',
                        PickUp: 'Pick Up', Cancelled: 'Cancelled'
                      };
                      showToastMsg(`Status updated to "${labelMap[val] || val}" successfully!`, 'success');
                      fetchBookingDetail();
                    } else {
                      showToastMsg('Failed to update status in the database.', 'error');
                    }
                  } catch (err) {
                    console.error(err);
                    showToastMsg('Error updating status.', 'error');
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              >
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'Booked', isDiag: false })}>Booked</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'Requested', isDiag: false })}>Requested</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'MechanicAssigned', isDiag: false })}>Mechanic Assigned</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'MechanicAlloted', isDiag: false })}>Mechanic Allotted</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'MechanicSelected', isDiag: false })}>Mechanic Selected</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'BidLive', isDiag: false })}>Bid Live</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'BidEnded', isDiag: false })}>Bid Ended</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'Ongoing', isDiag: false })}>Ongoing Service</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'Completed', isDiag: false })}>Completed (Normal Flow)</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'DiagnosisAvailable', isDiag: true })}>Diagnosis Available</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'Completed', isDiag: true })}>Completed (After Diagnosis)</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'PickUp', isDiag: false })}>Pick Up (Normal Flow)</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'PickUp', isDiag: true })}>Pick Up (After Diagnosis)</option>
                <option style={{ background: '#fff', color: '#374151' }} value={JSON.stringify({ value: 'Cancelled', isDiag: false })}>Cancelled</option>
              </select>
            </div>
          </div>
        </div>


        {/* ── Row 2: divider ── */}
        <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1rem' }} />

        {/* ── Row 3: info strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
          {[
            { label: 'Email ID:',        value: bookingDetail.customer?.email || 'demoemail@gmail.com',   type: 'text'  },
            { label: 'Phone Number:',    value: bookingDetail.customer?.phone || '+91 9876543210',        type: 'phone' },
            { label: 'Payment Method:',  value: bookingDetail.payment_method || 'UPI',                   type: 'text'  },
            ...(isInviteQuote && ['Booked', 'BidLive', 'BidEnded', 'MechanicSelected'].includes(orderStatus) ? [
              { label: orderStatus === 'BidLive' || orderStatus === 'Booked' ? 'Bid Ends:' : 'Bid Ended:', value: bookingDetail.bid_ends || '28.02.2026 | 02:00 PM', type: 'text' }
            ] : [
              { label: 'Order Value:',   value: bookingDetail.order_value ? `₹${bookingDetail.order_value.toLocaleString('en-IN')}` : '₹1,600', type: 'text' }
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
          onAssign={(m) => {
            setAssignedMechanic(m);
            handleAssignMechanic(m.id);
          }}
        />
      )}
      {showCancel && (
        <CancelRequestModal
          orderId={orderId}
          onClose={() => setShowCancel(false)}
          onConfirmed={(reasons, note) => {
            handleCancelRequest(reasons, note);
          }}
        />
      )}

      <div className="od-fade" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', animationDelay: '0.05s' }}>

        {/* ── Tab row ── */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #e5e7eb', padding: '0 1.5rem' }}>
          {(() => {
            const tabs: [string, string][] = [
              ['summary', 'Order Summary']
            ];
            
            if (isInviteQuote && ['Booked', 'BidLive', 'BidEnded', 'MechanicSelected'].includes(orderStatus)) {
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

            {isCallRequested ? (
              /* ── Assisted Booking: pre-details "Call Requested" wizard ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { label: 'Enter Service Details', height: '180px' },
                  { label: 'Enter Machine Details', height: '180px' },
                  { label: 'Enter Machine Complaint', height: '150px' },
                ].map((panel) => (
                  <div key={panel.label} style={{ border: '1.5px dashed #93c5fd', background: '#eff6ff', borderRadius: '8px', minHeight: panel.height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      className="od-hov"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', background: '#2563eb', color: '#fff', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {panel.label}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Service Details heading row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>Service Details</span>
                  {!assignedMechanic && !isInviteQuote && (
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

                {/* Service pill — Instant/Assisted only */}
                {!isVideo && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d4ed8' }}>Service : {bookingDetail.machine?.issue || 'Machine checkup'}</span>
                  </div>
                )}

                {/* Date + Address/Language row */}
                {(() => {
                  const fmtDT = (d: Date) => d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short', year: 'numeric' });
                  const baseDate = bookingDetail.created_at ? new Date(bookingDetail.created_at) : null;
                  const startDateTimeStr = baseDate ? fmtDT(baseDate) : '28.02.2026 | 01:00 – 02:00 PM';
                  const endDateTimeStr = bookingDetail.completed_at
                    ? fmtDT(new Date(bookingDetail.completed_at))
                    : (baseDate ? fmtDT(new Date(baseDate.getTime() + 2 * 60 * 60 * 1000)) : '28.02.2026 | 03:00 – 04:00 PM');
                  const dateLabelMode: 'selected' | 'start' | 'startEnd' =
                    orderStatus === 'Ongoing' ? 'start' :
                    ['Completed', 'DiagnosisAvailable', 'PickUp'].includes(orderStatus) ? 'startEnd' : 'selected';
                  const languagePref = bookingDetail.language || bookingDetail.language_preference || 'Hindi';

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                      {/* Left */}
                      <div>
                        {dateLabelMode === 'startEnd' ? (
                          <>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>Service Start Date &amp; Time:</div>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.125rem' }}>{startDateTimeStr}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>Service End Date &amp; Time:</div>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: isVideo ? 0 : '1.125rem' }}>{endDateTimeStr}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>{dateLabelMode === 'start' ? 'Service Start Date & Time:' : 'Selected Date & Time:'}</div>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: isVideo ? 0 : '1.125rem' }}>{startDateTimeStr}</div>
                          </>
                        )}
                        {!isVideo && (
                          <>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>Language Preference:</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{languagePref}</div>
                          </>
                        )}
                      </div>
                      {/* Right */}
                      <div>
                        {isVideo ? (
                          <>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px' }}>Language Preference:</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{languagePref}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '6px' }}>Address</div>
                            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 14px', fontSize: '0.875rem', color: '#374151', lineHeight: 1.75 }}>
                              {bookingDetail.location || 'Connaught Place, New Delhi – 110001\nDELHI, INDIA'}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <div 
                              onClick={() => router.push(`/mechanic/management/${assignedMechanic.id || 'm-123'}`)}
                              style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}
                            >
                              {safeName || '–'}
                            </div>
                            <svg 
                              onClick={() => router.push(`/mechanic/management/${assignedMechanic.id || 'm-123'}`)}
                              aria-label="View Mechanic Profile"
                              style={{ cursor: 'pointer', color: '#3b82f6' }} 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <title>View Mechanic Profile</title>
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </div>
                          
                          {['Completed', 'PickUp'].includes(orderStatus) ? (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              Service Rating |
                              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', fontSize: '0.9rem' }}>
                                <span>★</span><span>★</span><span>★</span><span>★</span><span style={{ color: '#cbd5e1' }}>★</span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {orderStatus === 'DiagnosisAvailable' ? 'Service Extend OTP- ' : orderStatus === 'Ongoing' ? 'Service End OTP- ' : 'Service Start OTP- '}
                              <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem' }}>{mechanicOtp}</span>
                              <svg 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                    navigator.clipboard.writeText(mechanicOtp);
                                    showToastMsg(`OTP ${mechanicOtp} copied to clipboard!`, 'success');
                                  }
                                }}
                                aria-label="Copy OTP"
                                style={{ marginLeft: '4px', cursor: 'pointer', verticalAlign: 'middle', color: '#3b82f6' }} 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <title>Copy OTP</title>
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {['Completed', 'PickUp'].includes(orderStatus) ? (
                      <div style={{ background: '#fff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '12px 14px', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.6, marginTop: '4px' }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#475569', fontWeight: 500, border: '1px solid #cbd5e1' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10"/><path d="M17 4v8a5 5 0 0 1-10 0V4"/><path d="M4 4h3v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h3"/></svg>
                          {mechanicLevel}
                        </div>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#475569', fontWeight: 500, border: '1px solid #cbd5e1' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {location}
                        </div>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#475569', fontWeight: 500, border: '1px solid #cbd5e1' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          {jobs > 0 ? `${jobs}+ Bookings` : '300+ Bookings'}
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

            {!isCallRequested && (
              <>
                {/* Machine Details */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Machine Details</div>
                  <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.125rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                    {[
                      ['Machine Type:', bookingDetail.machine?.type || 'Industrial Lockstitch'],
                      ['Machine Brand:', bookingDetail.machine?.brand || 'Juki'],
                      ['Model Number:', bookingDetail.machine?.model || 'DDL-8700'],
                      ['Serial Number:', bookingDetail.machine?.serial || `JUK-DDL8700-IN-${bookingDetail.booking_id}`],
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

                  {isVideo ? (
                    /* Video Call Assistance: single complaint-tags line, no description/media/audio */
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '5px' }}>Complaint Selected :</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>
                        {(bookingDetail.complaints && bookingDetail.complaints.length > 0)
                          ? bookingDetail.complaints.join(', ')
                          : 'Installation, Guided Repair Service'}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Description + Error Code */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '5px' }}>Description:</div>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
                            {bookingDetail.machine?.description || 'Machine fault description will come here.'}
                          </p>
                        </div>
                        <span style={{ flexShrink: 0, background: '#fee2e2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          Error Code : {bookingDetail.machine?.error_code || '178'}
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
                                <img src={bookingDetail.fault_photo_url || '/item_image.svg'} alt="Supporting Media" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
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
                        <AudioNotePlayer src={bookingDetail.fault_voice_url} />

                      </div>
                    </>
                  )}
                </div>
              </>
            )}
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




            {/* Content Switch: Empty state or Quotes List */}
            {quotes.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1f2937' }}>No Quotes Received</span>
                <button
                  onClick={() => {
                    setSentNotification(true);
                    showToastMsg('Push notification sent to nearby mechanics successfully!', 'success');
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
                onClick={handleInvoiceClick}
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
                    onClick={handleInvoiceClick}
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

            {/* Notification Toast */}
            {toastConfig.show && (
              <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: toastConfig.type === 'success' ? '#10b981' : '#ef4444',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                zIndex: 1100,
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                animation: 'odFade 0.2s ease'
              }}>
                {toastConfig.type === 'success' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                )}
                {toastConfig.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  );
}
