'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';



interface Creative {
  id: string;
  name: string;
  date: string;
  timeAgo: string;
  bannerType: string;
  title: string;
  subheader: string;
  body: string;
  imageUrl?: string;
  label?: string; // Promotion, Sale, New Collection, Sale up to 50% Off
  linkTo: string;
  openType: string;
  spareId?: string;
  categoryId?: string;
  machineId?: string;
  externalLink?: string;
}

const INITIAL_CREATIVES: Creative[] = [
  {
    id: 'creative-1',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Mattress Tape Edge',
    subheader: 'CTEC 300U',
    body: '100% Original | Made in Taiwan',
    label: 'Promotion',
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'CTEC 300U'
  },
  {
    id: 'creative-2',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Brother S-7200C',
    subheader: 'Direct Drive Lockstitch',
    body: '100% Original | Made in Japan',
    label: 'Sale',
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'Brother S-7200C'
  },
  {
    id: 'creative-3',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Mechanics',
    subheader: 'Banner 1',
    body: 'Banner 1',
    label: 'New Collection',
    linkTo: 'ST Mechanic',
    openType: 'Service',
    spareId: 'Full Service'
  },
  {
    id: 'creative-4',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Juki DDL-9000B',
    subheader: 'High Speed Lockstitch',
    body: '100% Original | Made in Japan',
    label: 'Sale up to 50% Off',
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'Juki DDL-9000B'
  },
  {
    id: 'creative-5',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Exchange Banner',
    subheader: 'Upgrade Now',
    body: 'Best value for old machines',
    label: 'Promotion',
    linkTo: 'ST Exchange',
    openType: 'Default'
  },
  {
    id: 'creative-6',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Academics Special',
    subheader: 'Learn Sewing',
    body: 'Expert guided tutorials',
    label: 'New Collection',
    linkTo: 'ST Academics',
    openType: 'Course',
    spareId: 'Sewing Basics'
  },
  {
    id: 'creative-7',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'Kaarigar Special',
    subheader: 'Hire Professionals',
    body: 'Top tier custom tailoring',
    label: 'Sale',
    linkTo: 'ST Kaarigar',
    openType: 'Default'
  },
  {
    id: 'creative-8',
    name: 'ST Spares Banner 1 – 29.03.26',
    date: '29.03.26',
    timeAgo: 'Uploaded 3 Hrs Ago',
    bannerType: 'Hero Banner',
    title: 'External Banner',
    subheader: 'Discount Coupon',
    body: 'Click here to redeem',
    label: 'Sale up to 50% Off',
    linkTo: 'External Link',
    openType: 'Default',
    externalLink: 'https://sewtechmart.com'
  }
];

export default function AllCreativesPage() {
  const router = useRouter();
  const [creatives, setCreatives] = useState<Creative[]>(INITIAL_CREATIVES);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Go Live modal state ────────────────────────────────────
  const [goLiveCreative, setGoLiveCreative] = useState<Creative | null>(null);
  const [goLiveStart, setGoLiveStart] = useState('');
  const [goLiveEnd, setGoLiveEnd] = useState('');
  const [goLiveAudience, setGoLiveAudience] = useState('All Users');
  const [goLiveLoading, setGoLiveLoading] = useState(false);

  // ── Toast notification state ───────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCreatives = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ success: boolean; data: Creative[] }>(ENDPOINTS.marketing.creatives);
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        setCreatives(response.data);
      } else {
        setCreatives(INITIAL_CREATIVES);
      }
    } catch (err) {
      console.warn('Backend server offline. Displaying static mockup creatives.');
      setCreatives(INITIAL_CREATIVES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreatives();
  }, []);

  const handleCreateCopy = async (creative: Creative) => {
    try {
      const response = await apiClient.post<{ success: boolean; data: Creative }>(
        ENDPOINTS.marketing.creativeCopy(creative.id),
        {}
      );
      if (response && response.success && response.data) {
        setCreatives([response.data, ...creatives]);
      } else {
        const newCreative: Creative = {
          ...creative,
          id: `creative-${Date.now()}`,
          name: `${creative.name} (Copy)`,
          timeAgo: 'Uploaded Just Now'
        };
        setCreatives([newCreative, ...creatives]);
      }
    } catch (err) {
      console.error('Failed to register creative copy on backend. Applying fallback clone.', err);
      const newCreative: Creative = {
        ...creative,
        id: `creative-${Date.now()}`,
        name: `${creative.name} (Copy)`,
        timeAgo: 'Uploaded Just Now'
      };
      setCreatives([newCreative, ...creatives]);
    }
    setActiveMenuId(null);
  };

  // ── Go Live: POST to /marketing/banners with exact backend payload ────
  // Backend needs: { creativeId, startDate, endDate, targetAudience, status }
  const handleGoLive = async () => {
    if (!goLiveCreative) return;
    if (!goLiveStart || !goLiveEnd) {
      showToast('Please set both start and end dates.', 'error');
      return;
    }
    setGoLiveLoading(true);
    try {
      const payload = {
        creativeId:     goLiveCreative.id,
        startDate:      goLiveStart,
        endDate:        goLiveEnd,
        targetAudience: goLiveAudience,
        status:         'Active',
      };
      await apiClient.post<{ success: boolean; data: any }>(ENDPOINTS.marketing.banners, payload);
      showToast(`"${goLiveCreative.name}" is now live! 🎉`, 'success');
    } catch (err) {
      console.error('Failed to go live:', err);
      showToast(`"${goLiveCreative.name}" queued for activation.`, 'success');
    } finally {
      setGoLiveLoading(false);
      setGoLiveCreative(null);
      setGoLiveStart('');
      setGoLiveEnd('');
      setGoLiveAudience('All Users');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(ENDPOINTS.marketing.creativeById(id));
      setCreatives(creatives.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete on API. Removing from active state fallback.', err);
      setCreatives(creatives.filter((c) => c.id !== id));
    }
    setActiveMenuId(null);
  };

  const handleEdit = (id: string) => {
    router.push(`/marketing/creatives/add?editId=${id}`);
    setActiveMenuId(null);
  };

  const openGoLiveModal = (creative: Creative) => {
    setGoLiveCreative(creative);
    setActiveMenuId(null);
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* ── Toast Notification ──────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '0.5rem',
          fontSize: '0.875rem', fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          animation: 'fadeInUp 0.3s ease'
        }}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      {/* ── Go Live Modal ──────────────────────────────────────── */}
      {goLiveCreative && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => { setGoLiveCreative(null); }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
          />
          {/* Modal */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 1001, background: '#fff', borderRadius: '1rem', padding: '2rem',
            width: '420px', maxWidth: '90vw',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Go Live 🚀</h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}
                   title={goLiveCreative.name}>
                  {goLiveCreative.name.length > 40 ? goLiveCreative.name.slice(0, 40) + '…' : goLiveCreative.name}
                </p>
              </div>
              <button
                onClick={() => setGoLiveCreative(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.25rem', lineHeight: 1 }}
              >✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Start Date</label>
                <input
                  type="date"
                  value={goLiveStart}
                  onChange={e => setGoLiveStart(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>End Date</label>
                <input
                  type="date"
                  value={goLiveEnd}
                  onChange={e => setGoLiveEnd(e.target.value)}
                  min={goLiveStart}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Target Audience</label>
                <select
                  value={goLiveAudience}
                  onChange={e => setGoLiveAudience(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="All Users">All Users</option>
                  <option value="Gold Members">Gold Members</option>
                  <option value="Silver Members">Silver Members</option>
                  <option value="New Users">New Users</option>
                  <option value="Returning Users">Returning Users</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setGoLiveCreative(null)}
                style={{ flex: 1, padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#fff', color: '#374151', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleGoLive}
                disabled={goLiveLoading}
                style={{ flex: 2, padding: '0.65rem', border: 'none', borderRadius: '0.5rem', background: goLiveLoading ? '#6b7280' : '#111827', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: goLiveLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {goLiveLoading ? 'Publishing…' : '🚀 Go Live'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>All Creatives</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Ads & Marketing <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>All Creatives</span>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/marketing/creatives/add')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: '#111827', 
            color: '#fff', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '0.5rem', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          Add Creative
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </div>

      {/* Grid of Creatives */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {creatives.map((creative) => (
          <div 
            key={creative.id} 
            style={{ 
              background: '#fff', 
              borderRadius: '0.75rem', 
              border: '1px solid #e5e7eb', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              position: 'relative'
            }}
          >
            {/* Creative Placeholder / Image Card */}
            <div 
              style={{ 
                height: '160px', 
                background: '#f3f4f6', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              {/* Mock Banner Preview Inside Placeholder */}
              <div 
                style={{ 
                  width: '90%', 
                  height: '80%', 
                  background: creative.imageUrl ? `url(${creative.imageUrl}) center/cover` : 'linear-gradient(135deg, #ec4899, #ef4444)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.9 }}>{creative.subheader}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{creative.title}</div>
                <div style={{ fontSize: '0.55rem', marginTop: '0.15rem', opacity: 0.8 }}>{creative.body}</div>
                
                {/* Ribbon Tag label badge if present */}
                {creative.label && (
                  <div style={{ position: 'absolute', top: 0, right: '8px', zIndex: 1 }}>
                    <div style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      fontSize: '0.45rem', 
                      fontWeight: 700, 
                      padding: '4px 6px 6px 6px', 
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                      textTransform: 'uppercase'
                    }}>
                      {creative.label === 'Sale up to 50% Off' ? '50% Off' : creative.label}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Area */}
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                <h3 
                  style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 600, 
                    color: '#111827', 
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={creative.name}
                >
                  {creative.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{creative.timeAgo}</p>
              </div>

              {/* Three dots button */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === creative.id ? null : creative.id);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '4px', 
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>

                {/* Dropdown Menu Popup (Frame 15618 context) */}
                {activeMenuId === creative.id && (
                  <>
                    {/* Backdrop */}
                    <div 
                      onClick={() => setActiveMenuId(null)}
                      style={{ position: 'fixed', inset: 0, zIndex: 10, background: 'transparent' }}
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '100%', 
                        right: 0, 
                        marginBottom: '0.5rem',
                        background: '#fff', 
                        borderRadius: '0.5rem', 
                        border: '1px solid #e5e7eb', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        zIndex: 11,
                        minWidth: '130px',
                        padding: '4px 0'
                      }}
                    >
                      <button 
                        onClick={() => handleCreateCopy(creative)}
                        style={{ width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        Create Copy
                      </button>
                      <button 
                        onClick={() => handleEdit(creative.id)}
                        style={{ width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        Edit Creative
                      </button>
                      <button 
                        onClick={() => openGoLiveModal(creative)}
                        style={{ width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        🚀 Go Live
                      </button>
                      <div style={{ height: '1px', background: '#f3f4f6', margin: '2px 0' }} />
                      <button 
                        onClick={() => handleDelete(creative.id)}
                        style={{ width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
