'use client';
import { useState, useEffect } from 'react';
import { useMechanics } from '../_hooks/useMechanics';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Mechanic } from '@/types';
import { 
  Users, 
  Star, 
  Flag, 
  ChevronDown, 
  ExternalLink, 
  MoreVertical,
  Search,
  Calendar,
  SlidersHorizontal,
  XCircle
} from 'lucide-react';

export default function MechanicPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { mechanics, loading, error, refetch, updateMechanicStatus, metrics } = useMechanics();
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusModalConfig, setStatusModalConfig] = useState<{
    isOpen: boolean;
    mechanicId: string;
    mechanicName: string;
    targetStatus: string;
    reason: string;
  }>({
    isOpen: false,
    mechanicId: '',
    mechanicName: '',
    targetStatus: 'Active',
    reason: ''
  });
  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch data when filters/search changes
  useEffect(() => {
    refetch({ search, status: statusFilter });
  }, [search, statusFilter, refetch]);

  const displayMechanics = mechanics;

  const columns: Column<any>[] = [
    {
      key: 'select',
      label: '',
      render: () => <input type="checkbox" style={{ accentColor: '#111827', cursor: 'pointer' }} />
    },
    { 
      key: 'name', 
      label: 'Mechanic ID', 
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/avatar-clean.svg" 
            alt="avatar" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              border: '2px solid #f59e0b',
              objectFit: 'contain'
            }} 
          />
          <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>{r.name}</div>
            <span style={{ 
              fontSize: '0.6875rem', 
              color: '#2563eb', 
              border: '1px dashed #bfdbfe', 
              borderRadius: '0.25rem', 
              padding: '0.05rem 0.375rem',
              backgroundColor: '#eff6ff',
              fontWeight: 600,
              display: 'inline-block',
              marginTop: '0.125rem'
            }}>
              #{r.id}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: 'expertise', 
      label: 'Service Type',
      render: () => (
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <img src="/instant smart Booking.svg" alt="Smart Booking" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
          <img src="/video call _assistance.svg" alt="Video Call"   style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
          <img src="/invite quote.svg"           alt="Invite Quote" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        </div>
      )
    },
    { key: 'location', label: 'City Coverage' },
    { key: 'totalJobs', label: 'Jobs Completed' },
    { 
      key: 'availability', 
      label: 'Availability',
      render: (r) => {
        let label = '--';
        if (r.availability) {
          if (Array.isArray(r.availability)) {
            label = r.availability.join(', ');
          } else {
            label = r.availability;
          }
        } else {
          const raw = r.submitted_at ?? r.lastJob ?? r.joiningDate ?? null;
          if (raw) {
            try {
              const d = new Date(raw);
              label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
            } catch { label = raw; }
          }
        }
        return <span style={{ color: '#4b5563', fontWeight: 500 }}>{label}</span>;
      }
    },
    { 
      key: 'rating', 
      label: 'Rating', 
      render: (r) => (
        <span style={{ fontWeight: 600, color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '0.125rem' }}>
          {r.rating ?? '--'}
          <Star size={12} fill="#f59e0b" stroke="none" />
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r) => {
        const s = (r.status ?? '').toUpperCase();
        const cfg =
          s === 'APPROVED' || s === 'AVAILABLE' || s === 'ACTIVE'
            ? { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Active' }
          : s === 'BUSY'
            ? { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: 'Busy' }
          : s === 'PENDING'
            ? { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Pending' }
          : s === 'SUSPENDED'
            ? { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', label: 'Suspended' }
          : s === 'OFFLINE'
            ? { bg: '#f3f4f6', color: '#4b5563', border: '#d1d5db', label: 'Offline' }
          : s === 'REJECTED'
            ? { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', label: 'Rejected' }
          : { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: r.status ?? 'Active' };
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderRadius: '2rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`
          }}>
            {cfg.label}
          </span>
        );
      }
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/mechanic/management/${r.id}`);
            }}
            className="btn-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: '#0f172a',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'white',
            }}
          >
            View
            <ExternalLink size={12} strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(openDropdownId === r.id ? null : r.id);
            }}
            className="btn-action"
            style={{ 
              border: 'none', 
              backgroundColor: '#0f172a',
              color: 'white', 
              padding: '0.375rem 0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MoreVertical size={14} strokeWidth={2.5} />
          </button>

          {/* Dropdown Menu */}
          {openDropdownId === r.id && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '0.25rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                zIndex: 50,
                minWidth: '180px',
                overflow: 'hidden',
                textAlign: 'left'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#059669', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => {
                  setStatusModalConfig({
                    isOpen: true,
                    mechanicId: r.id,
                    mechanicName: r.name,
                    targetStatus: 'Active',
                    reason: 'Account activated by administrator.'
                  });
                  setOpenDropdownId(null);
                }}
              >
                Activate Account
              </div>
              <div 
                style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => {
                  setStatusModalConfig({
                    isOpen: true,
                    mechanicId: r.id,
                    mechanicName: r.name,
                    targetStatus: 'Busy',
                    reason: 'Admin paused services temporarily.'
                  });
                  setOpenDropdownId(null);
                }}
              >
                Pause Services
              </div>
              <div 
                style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#d97706', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => {
                  setStatusModalConfig({
                    isOpen: true,
                    mechanicId: r.id,
                    mechanicName: r.name,
                    targetStatus: 'Pending',
                    reason: 'Under review for compliance.'
                  });
                  setOpenDropdownId(null);
                }}
              >
                Mark Under Review
              </div>
              <div 
                style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#4b5563', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => {
                  setStatusModalConfig({
                    isOpen: true,
                    mechanicId: r.id,
                    mechanicName: r.name,
                    targetStatus: 'Offline',
                    reason: 'Marked offline due to inactivity.'
                  });
                  setOpenDropdownId(null);
                }}
              >
                Mark Offline
              </div>
              <div 
                style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => {
                  setStatusModalConfig({
                    isOpen: true,
                    mechanicId: r.id,
                    mechanicName: r.name,
                    targetStatus: 'Suspended',
                    reason: 'Repeatedly rejected bookings without valid reason.'
                  });
                  setOpenDropdownId(null);
                }}
              >
                Suspend Account
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="mechanic-management-page">
      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: slideUpFade 0.5s ease-out forwards;
          }
          .stagger-1 { animation-delay: 0.1s; opacity: 0; }
          .stagger-2 { animation-delay: 0.2s; opacity: 0; }
          .stagger-3 { animation-delay: 0.3s; opacity: 0; }
          .stagger-4 { animation-delay: 0.4s; opacity: 0; }
          .stagger-5 { animation-delay: 0.5s; opacity: 0; }
          
          .kpi-card-vertical {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .kpi-card-vertical:hover {
            border-color: #cbd5e1;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025);
            transform: translateY(-2px);
          }
          .kpi-icon-wrapper-small {
            width: 28px;
            height: 28px;
            border-radius: 6.79px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
          }
          .kpi-card-vertical:hover .kpi-icon-wrapper-small {
            transform: scale(1.1) rotate(5deg);
          }
          .btn-action {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .btn-action:hover {
            background-color: #1e293b !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          .btn-action:active {
            transform: translateY(0);
          }
          .filter-bar {
            transition: box-shadow 0.3s ease;
          }
          .filter-bar:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          }
        `}
      </style>
      <div className="animate-fade-in stagger-1">
        <PageHeader 
          title="Mechanic Management" 
          subtitle="Sewtech Spare • Mechanic Management" 
          actions={
            <button className="btn-action" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              Export
              <ExternalLink size={14} />
            </button>
          } 
        />
      </div>

      {/* KPI Cards section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
        {/* Card 1 */}
        <div className="kpi-card-vertical animate-fade-in stagger-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="kpi-icon-wrapper-small" style={{ backgroundColor: '#eff6ff' }}>
              <Users size={14} style={{ color: '#2563eb' }} />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Total Mechanics</span>
            <span style={{ color: '#16a34a', fontSize: '0.6875rem', fontWeight: 700, marginLeft: 'auto' }}>▲ 5% (L7D)</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {metrics?.totalMechanics?.toLocaleString('en-IN') ?? '1,500'}
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="kpi-card-vertical animate-fade-in stagger-2" style={{ animationDelay: '0.25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="kpi-icon-wrapper-small" style={{ backgroundColor: '#eff6ff' }}>
              <Users size={14} style={{ color: '#2563eb' }} />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Active Mechanics</span>
            <span style={{ color: '#16a34a', fontSize: '0.6875rem', fontWeight: 700, marginLeft: 'auto' }}>▲ 5% (L7D)</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {metrics?.activeMechanics?.toLocaleString('en-IN') ?? '1,000'}
          </div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card-vertical animate-fade-in stagger-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="kpi-icon-wrapper-small" style={{ backgroundColor: '#eff6ff' }}>
              <Star size={14} style={{ color: '#2563eb' }} fill="#2563eb" stroke="none" />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Average Rating</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {metrics?.averageRating ?? '4.5'}
          </div>
        </div>

        {/* Card 4 */}
        <div className="kpi-card-vertical animate-fade-in stagger-3" style={{ animationDelay: '0.35s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <img src="/red_flag.svg" alt="Flag" style={{ width: '28px', height: '28px', objectFit: 'contain' }} className="kpi-icon-wrapper-small" />
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Flags</span>
            <span style={{ color: '#16a34a', fontSize: '0.6875rem', fontWeight: 700, marginLeft: 'auto' }}>▼ 5% (L7D)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
              {metrics?.flags?.toLocaleString('en-IN') ?? '100'}
            </div>
            <span style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', padding: '0.25rem' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(2px, -2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(0, 0)'}>
              <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar animate-fade-in stagger-4" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        marginBottom: '1rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Left Side: Search & Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex' }}>
              <Search size={16} strokeWidth={1.5} />
            </span>
            <input 
              type="text" 
              placeholder="Search by Mechanic Name" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.25rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                color: '#0f172a',
                outline: 'none',
                fontWeight: 600,
              }}
            />
          </div>
          
          {/* Date Filter Combo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.375rem',
            overflow: 'hidden',
            height: '36px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 0.75rem',
              backgroundColor: '#f8fafc',
              height: '100%',
              fontSize: '0.8125rem',
              color: '#334155',
              fontWeight: 500,
              borderRight: '1px solid #e5e7eb'
            }}>
              Added on
              <ChevronDown size={14} style={{ color: '#64748b' }} strokeWidth={2} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 0.75rem',
              backgroundColor: 'white',
              height: '100%',
              minWidth: '100px',
              cursor: 'pointer'
            }}>
              <Calendar size={15} style={{ color: '#94a3b8' }} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        
        {/* Right Side: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-action" 
            onClick={() => setIsFilterOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 1rem',
              height: '36px',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Apply Filters
            <SlidersHorizontal size={14} strokeWidth={1.5} />
          </button>
          
          <button className="btn-action" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 1rem',
            height: '36px',
            backgroundColor: '#0f172a',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Bulk Actions
            <ChevronDown size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="card animate-fade-in stagger-5" style={{ transition: 'box-shadow 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
        {loading && <p className="text-muted">Loading mechanics...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && (
          <DataTable 
            columns={columns} 
            data={displayMechanics} 
            onRowClick={(r) => router.push(`/mechanic/management/${r.id}`)} 
          />
        )}
      </div>

      {/* Filter Side Drawer Overlay */}
      {isFilterOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => setIsFilterOpen(false)}
          />
          <div 
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              bottom: '1rem',
              width: '380px',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden'
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Filters</h2>
              <button 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.625rem',
                  backgroundColor: '#fef2f2',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setStatusFilter('');
                  setSearch('');
                  setIsFilterOpen(false);
                }}
              >
                Clear Filters
                <XCircle size={12} />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* City Filter */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1f2937' }}>City</span>
                  <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <select style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', appearance: 'none', outline: 'none', color: '#6b7280', fontSize: '0.8125rem', backgroundColor: 'white' }}>
                    <option>Select City</option>
                  </select>
                  <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Delhi NCR', 'Bangalore', 'Gujarat'].map(city => (
                    <div key={city} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', border: '1px solid #bfdbfe', borderRadius: '1rem', fontSize: '0.75rem', color: '#3b82f6', backgroundColor: '#eff6ff' }}>
                      {city}
                      <XCircle size={12} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Rating Filter */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1f2937' }}>Select Rating</span>
                  <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {['> 2', '3-5', '> 4'].map(rating => (
                    <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4b5563', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }} />
                      {rating}
                    </label>
                  ))}
                </div>
              </div>

              {/* Jobs Completed Filter */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1f2937' }}>Jobs Completed</span>
                  <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {['< 10', '10-50', '> 50'].map(jobs => (
                    <label key={jobs} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4b5563', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }} />
                      {jobs}
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1f2937' }}>Status</span>
                  <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Active', 'Busy', 'Pending', 'Suspended', 'Offline'].map(status => (
                    <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#4b5563', cursor: 'pointer', padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', backgroundColor: statusFilter === status ? '#eff6ff' : 'white' }}>
                      <input 
                        type="radio" 
                        name="filter_status" 
                        checked={statusFilter === status}
                        onChange={() => setStatusFilter(statusFilter === status ? '' : status)}
                        style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }} 
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              {/* Last Active Filter */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1f2937' }}>Last Active</span>
                  <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <select style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', appearance: 'none', outline: 'none', color: '#6b7280', fontSize: '0.8125rem', backgroundColor: 'white' }}>
                    <option>Select City</option>
                  </select>
                  <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Delhi NCR', 'Bangalore', 'Gujarat'].map(city => (
                    <div key={city} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', border: '1px solid #bfdbfe', borderRadius: '1rem', fontSize: '0.75rem', color: '#3b82f6', backgroundColor: '#eff6ff' }}>
                      {city}
                      <XCircle size={12} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </>
      )}

      {/* Update Mechanic Status Modal */}
      {statusModalConfig.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
          <style>
            {`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
              .status-modal-content { animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1); position: relative; width: 90%; max-width: 500px; }
            `}
          </style>
          <div className="status-modal-content" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
            <button onClick={() => setStatusModalConfig(prev => ({ ...prev, isOpen: false }))} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Update Mechanic Status</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>Change status for <strong style={{ color: '#111827' }}>{statusModalConfig.mechanicName}</strong> (ID: #{statusModalConfig.mechanicId})</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Status Select */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Target Status</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={statusModalConfig.targetStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      let defaultReason = '';
                      if (newStatus === 'Active') defaultReason = 'Account activated by administrator.';
                      if (newStatus === 'Busy') defaultReason = 'Admin paused services temporarily.';
                      if (newStatus === 'Pending') defaultReason = 'Under review for compliance.';
                      if (newStatus === 'Offline') defaultReason = 'Marked offline due to inactivity.';
                      if (newStatus === 'Suspended') defaultReason = 'Repeatedly rejected bookings without valid reason.';
                      setStatusModalConfig(prev => ({ ...prev, targetStatus: newStatus, reason: defaultReason }));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.625rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      appearance: 'none',
                      outline: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Busy">Busy</option>
                    <option value="Pending">Pending</option>
                    <option value="Offline">Offline</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none', display: 'flex' }}>
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>

              {/* Reason Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Reason for Change <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea 
                  value={statusModalConfig.reason}
                  onChange={(e) => setStatusModalConfig(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for this status change..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setStatusModalConfig(prev => ({ ...prev, isOpen: false }))}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await updateMechanicStatus(statusModalConfig.mechanicId, statusModalConfig.targetStatus, statusModalConfig.reason);
                    setStatusModalConfig(prev => ({ ...prev, isOpen: false }));
                    setToastConfig({
                      show: true,
                      message: `Status updated to ${statusModalConfig.targetStatus} successfully!`,
                      type: 'success'
                    });
                    setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3000);
                    refetch({ search, status: statusFilter });
                  } catch (err: any) {
                    setToastConfig({
                      show: true,
                      message: err.message || 'Failed to update status',
                      type: 'error'
                    });
                    setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3000);
                  }
                }}
                disabled={!statusModalConfig.reason.trim()}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: statusModalConfig.reason.trim() ? 'pointer' : 'not-allowed',
                  opacity: statusModalConfig.reason.trim() ? 1 : 0.6
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastConfig.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
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
          animation: 'fadeIn 0.2s ease-out'
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
  );
}
