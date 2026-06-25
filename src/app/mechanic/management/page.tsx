'use client';
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
  Check,
  Volume2
} from 'lucide-react';

export default function MechanicPage() {
  const { mechanics, loading, error } = useMechanics();
  const router = useRouter();

  // Override list data to match the screenshot precisely
  const displayMechanics = mechanics.map((m) => ({
    ...m,
    name: 'Nishant Kumar',
    rating: 4.5,
    totalJobs: 30,
    status: 'Available',
    location: 'Delhi'
  }));

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
              Mehcanic ID
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
          <img src="/video call _assistance.svg" alt="Video Call" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
          <img src="/invite quote.svg" alt="Invite Quote" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        </div>
      )
    },
    { key: 'location', label: 'City Coverage' },
    { key: 'totalJobs', label: 'Jobs Completed' },
    { 
      key: 'availability', 
      label: 'Availability',
      render: () => <span style={{ color: '#4b5563', fontWeight: 500 }}>21 Jan &apos;26</span>
    },
    { 
      key: 'rating', 
      label: 'Rating', 
      render: (r) => (
        <span style={{ fontWeight: 600, color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '0.125rem' }}>
          {r.rating}
          <Star size={12} fill="#f59e0b" stroke="none" />
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: () => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.75rem',
          borderRadius: '2rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: '#ecfdf5',
          color: '#059669',
          border: '1px solid #a7f3d0'
        }}>
          Active
        </span>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => router.push(`/mechanic/management/${r.id}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.375rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#374151',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            View
            <ExternalLink size={12} />
          </button>
          <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' }}>
            <MoreVertical size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .kpi-card-vertical {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            transition: all 0.2s ease;
          }
          .kpi-card-vertical:hover {
            border-color: #d1d5db;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .kpi-icon-wrapper-small {
            width: 28px;
            height: 28px;
            border-radius: 6.79px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
      <PageHeader 
        title="Mechanic Management" 
        subtitle="Sewtech Spare • Mechanic Management" 
        actions={
          <button style={{
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

      {/* KPI Cards section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
        {/* Card 1 */}
        <div className="kpi-card-vertical">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="kpi-icon-wrapper-small" style={{ backgroundColor: '#eff6ff' }}>
              <Users size={14} style={{ color: '#2563eb' }} />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Total Mechanics</span>
            <span style={{ color: '#16a34a', fontSize: '0.6875rem', fontWeight: 700, marginLeft: 'auto' }}>▲ 5% (L7D)</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>1,500</div>
        </div>
        
        {/* Card 2 */}
        <div className="kpi-card-vertical">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="kpi-icon-wrapper-small" style={{ backgroundColor: '#eff6ff' }}>
              <Users size={14} style={{ color: '#2563eb' }} />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Active Mechanics</span>
            <span style={{ color: '#16a34a', fontSize: '0.6875rem', fontWeight: 700, marginLeft: 'auto' }}>▲ 5% (L7D)</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>1,000</div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card-vertical">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="kpi-icon-wrapper-small" style={{ backgroundColor: '#eff6ff' }}>
              <Star size={14} style={{ color: '#2563eb' }} fill="#2563eb" stroke="none" />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Average Rating</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>140</div>
        </div>

        {/* Card 4 */}
        <div className="kpi-card-vertical">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <img src="/red_flag.svg" alt="Flag" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Flags</span>
            <span style={{ color: '#16a34a', fontSize: '0.6875rem', fontWeight: 700, marginLeft: 'auto' }}>▼ 5% (L7D)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>100</div>
            <span style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input 
              type="text" 
              placeholder="Search by Mechanic Name" 
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.25rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
          </div>
          
          <div style={{ position: 'relative' }}>
            <select style={{
              appearance: 'none',
              padding: '0.5rem 2.25rem 0.5rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              outline: 'none',
              cursor: 'pointer',
              color: '#374151'
            }}>
              <option>Added on</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
          </div>
          
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              style={{
                width: '80px',
                padding: '0.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                textAlign: 'center'
              }}
            />
            <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem' }}>📅</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0f172a',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Apply Filters
            <span style={{ fontSize: '11px' }}>⚙️</span>
          </button>
          
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0f172a',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Bulk Actions
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="card">
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
    </div>
  );
}
