'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Calendar, 
  SlidersHorizontal, 
  ChevronDown, 
  ExternalLink, 
  Copy, 
  Check,
  X,
  Play,
  Pause,
  MoreVertical
} from 'lucide-react';
import FiltersDrawer from '@/components/orders/FiltersDrawer';

// Mock Data for Order Requests
const AUDIO_REQUESTS_MOCK = [
  { id: 'sth-rh-2051', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", audioLength: '01:20', viewedStatus: 'Now' },
  { id: 'sth-rh-2052', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", audioLength: '01:20', viewedStatus: 'Payment Pending' },
  { id: 'sth-rh-2053', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", audioLength: '01:20', viewedStatus: 'Order Placed' },
  { id: 'sth-rh-2054', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", audioLength: '01:20', viewedStatus: 'Cancelled' },
  { id: 'sth-rh-2055', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", audioLength: '01:20', viewedStatus: 'Irrelevant' },
  { id: 'sth-rh-2056', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", audioLength: '01:20', viewedStatus: 'Irrelevant' },
];

const HANDWRITTEN_REQUESTS_MOCK = [
  { id: 'sth-rh-2061', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", docCount: 2, status: 'New' },
  { id: 'sth-rh-2062', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", docCount: 1, status: 'Payment Pending' },
  { id: 'sth-rh-2063', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", docCount: 3, status: 'Payment Pending' },
  { id: 'sth-rh-2064', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", docCount: 1, status: 'Order Placed' },
  { id: 'sth-rh-2065', customerName: 'Aditya Bhargav', phone: '+919876543210', date: "10:30 PM, 21 Jan' 26", docCount: 3, status: 'Cancelled' },
];

export default function SparesOrderRequestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Audio Notes' | 'Handwritten Notes'>('Audio Notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Track playing audio row ID
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  
  // Hover/row options menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Statistics
  const [stats] = useState({
    handwrittenCount: 140,
    audioCount: 140,
    contactsCount: 140,
    convertsCount: 10
  });

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const toggleAudioPlayback = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  const handleRowClick = (id: string) => {
    // Map list IDs to dynamic detail routing
    if (activeTab === 'Audio Notes') {
      router.push(`/spares/requests/sth-rh-2051`); // Renders Audio Layout
    } else {
      router.push(`/spares/requests/sth-rh-2052`); // Renders Handwritten Layout
    }
  };

  const handleActionMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuRowId(activeMenuRowId === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.4s ease-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .kpi-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            transition: all 0.2s ease;
          }
          .kpi-card:hover {
            border-color: #d1d5db;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .trend-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.125rem 0.5rem;
            border-radius: 2rem;
          }
          .trend-down {
            background-color: #f0fdf4;
            color: #16a34a;
          }
          .trend-up {
            background-color: #fef2f2;
            color: #dc2626;
          }
          .tab-button {
            border: none;
            background: none;
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            white-space: nowrap;
          }
          .tab-button-active {
            color: #111827;
            font-weight: 600;
            border-bottom-color: #111827;
          }
          .order-row {
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.15s;
            position: relative;
          }
          .order-row:hover {
            background-color: #f8fafc;
          }
          .action-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.875rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
          }
          .badge-now {
            background-color: #f3e8ff;
            color: #9333ea;
            border: 1px solid #e9d5ff;
          }
          .badge-pending {
            background-color: #fffbeb;
            color: #d97706;
            border: 1px solid #fef3c7;
          }
          .badge-placed {
            background-color: #ecfdf5;
            color: #16a34a;
            border: 1px solid #bbf7d0;
          }
          .badge-cancelled {
            background-color: #f3f4f6;
            color: #4b5563;
            border: 1px solid #e5e7eb;
          }
          .badge-irrelevant {
            background-color: #f9fafb;
            color: #9ca3af;
            border: 1px solid #f3f4f6;
          }
          .waveform-bar {
            width: 2px;
            background-color: #94a3b8;
            border-radius: 1px;
            transition: height 0.15s ease, background-color 0.2s;
          }
          .waveform-playing .waveform-bar {
            background-color: #3b82f6;
            animation: bounce 1.2s infinite ease-in-out alternate;
          }
          @keyframes bounce {
            0% { transform: scaleY(0.3); }
            100% { transform: scaleY(1.0); }
          }
          .context-menu {
            position: absolute;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            width: 160px;
            z-index: 100;
            left: 50px;
            margin-top: 5px;
          }
          .menu-item {
            padding: 0.625rem 0.875rem;
            font-size: 0.8125rem;
            color: #374151;
            cursor: pointer;
            text-align: left;
            transition: background-color 0.15s;
          }
          .menu-item:hover {
            background-color: #f3f4f6;
            color: #111827;
          }
        `}
      </style>

      {/* Breadcrumbs & Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '0.25rem' }}>Order Requests</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            Sewtech Spare <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>•</span> Order Requests
          </div>
        </div>
        <div>
          <button 
            style={{ 
              padding: '0.625rem 1.125rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              backgroundColor: '#111827', 
              color: 'white', 
              fontWeight: 600, 
              fontSize: '0.875rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s' 
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} 
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Export
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Handwritten Requests Card */}
        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/handwritten.svg" alt="Handwritten" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563' }}>Handwritten Requests</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.handwrittenCount}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', fontWeight: 500 }}>
            <strong style={{ color: '#111827' }}>20 New</strong> · 110 Relevant
          </span>
        </div>

        {/* Audio Requests Card */}
        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/audio request.svg" alt="Audio" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563' }}>Audio Requests</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.audioCount}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', fontWeight: 500 }}>
            <strong style={{ color: '#111827' }}>20 New</strong> · 110 Relevant
          </span>
        </div>

        {/* Contacts Card */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src="/contacts.svg" alt="Contacts" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563' }}>Contacts</span>
            </div>
            <span className="trend-pill trend-down">▼ 5% (L7D)</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.contactsCount}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', fontWeight: 500 }}>
            <strong style={{ color: '#111827' }}>20 Notes</strong> · 110 Audio
          </span>
        </div>

        {/* Converts Card */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src="/converts.svg" alt="Converts" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563' }}>Converts</span>
            </div>
            <span className="trend-pill trend-up">▲ 5% (L7D)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.convertsCount}</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>({stats.convertsCount}%)</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '700px' }}>
            <div style={{ position: 'relative', flex: 2 }}>
              <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search by Order"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem 0.625rem 2.25rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#374151'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0 0.875rem', backgroundColor: 'white', cursor: 'pointer', flex: 1 }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563', marginRight: '0.5rem', fontWeight: 500 }}>Created on</span>
              <ChevronDown size={14} style={{ color: '#9ca3af', marginLeft: 'auto', marginRight: '0.5rem' }} />
              <Calendar size={14} style={{ color: '#9ca3af' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#1f2937',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Apply Filters
              <SlidersHorizontal size={14} />
            </button>

            <button 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#1f2937',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Bulk Actions
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Primary Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('Audio Notes')}
            className={`tab-button ${activeTab === 'Audio Notes' ? 'tab-button-active' : ''}`}
          >
            Audio Notes
          </button>
          <button
            onClick={() => setActiveTab('Handwritten Notes')}
            className={`tab-button ${activeTab === 'Handwritten Notes' ? 'tab-button-active' : ''}`}
          >
            Handwritten Notes
          </button>
        </div>

        {/* Table Container */}
        <div style={{ overflowX: 'auto', margin: '0 -1.5rem -1.5rem -1.5rem', position: 'relative' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                <th style={{ padding: '1rem 1.5rem', width: '60px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '0.25rem', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>-</span>
                  </div>
                </th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Order ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Phone Number ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Order Placed ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Audio Uploaded ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>{activeTab === 'Audio Notes' ? 'Viewed' : 'Status'} ↑↓</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'Audio Notes' ? (
                AUDIO_REQUESTS_MOCK.map((row) => (
                  <tr key={row.id} className="order-row" onClick={() => handleRowClick(row.id)}>
                    <td style={{ padding: '1.25rem 1.5rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" style={{ accentColor: '#111827', width: '16px', height: '16px', cursor: 'pointer' }} />
                        <button 
                          onClick={(e) => handleActionMenuClick(e, row.id)}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      {activeMenuRowId === row.id && (
                        <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                          <div className="menu-item" onClick={() => { alert('Exporting row...'); setActiveMenuRowId(null); }}>Export</div>
                          <div className="menu-item" onClick={() => { alert('Marked as Irrelevant'); setActiveMenuRowId(null); }}>Irrelevant</div>
                          <div className="menu-item" onClick={() => { alert('Marked as Completed'); setActiveMenuRowId(null); }}>Mark as completed</div>
                          <div className="menu-item" onClick={() => { alert('Marked as Unread'); setActiveMenuRowId(null); }}>Mark as Unread</div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          backgroundColor: '#FFE7D9', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <img src="/rotary-hook.png" alt="Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{row.customerName}</div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#2563eb', 
                            border: '1px dashed #bfdbfe', 
                            borderRadius: '0.375rem', 
                            padding: '0.125rem 0.5rem', 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            gap: '0.25rem',
                            marginTop: '0.25rem', 
                            backgroundColor: '#eff6ff',
                            fontWeight: 600
                          }}>
                            REQUEST ID
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div 
                        onClick={(e) => handleCopy(e, row.phone, row.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: '1px dashed #bfdbfe',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          color: '#2563eb',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          backgroundColor: '#eff6ff',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        {row.phone}
                        {copiedText === row.id ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontWeight: 500 }}>{row.date}</td>
                    
                    {/* Audio visualizer block */}
                    <td style={{ padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '220px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
                        <button 
                          onClick={(e) => toggleAudioPlayback(e, row.id)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            border: 'none',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          {playingAudioId === row.id ? <Pause size={12} fill="white" /> : <Play size={12} fill="white" style={{ marginLeft: '1px' }} />}
                        </button>
                        
                        {/* Audio Waveform Bars */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, height: '20px' }} className={playingAudioId === row.id ? 'waveform-playing' : ''}>
                          {[6, 12, 18, 14, 8, 16, 20, 10, 14, 18, 12, 8, 14, 10, 16, 20, 12, 6, 10, 18].map((h, i) => (
                            <div 
                              key={i} 
                              className="waveform-bar" 
                              style={{ 
                                height: `${playingAudioId === row.id ? '100%' : h + 'px'}`,
                                animationDelay: `${i * 0.05}s`
                              }} 
                            />
                          ))}
                        </div>

                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{row.audioLength}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className={`action-badge ${
                        row.viewedStatus === 'Now' ? 'badge-now' : 
                        row.viewedStatus === 'Payment Pending' ? 'badge-pending' : 
                        row.viewedStatus === 'Order Placed' ? 'badge-placed' :
                        row.viewedStatus === 'Cancelled' ? 'badge-cancelled' : 'badge-irrelevant'
                      }`}>
                        {row.viewedStatus}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <img 
                        src="/View_button.svg" 
                        alt="View" 
                        style={{ width: '66px', height: '26px', cursor: 'pointer', display: 'block', margin: '0 auto' }} 
                        onClick={() => handleRowClick(row.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                HANDWRITTEN_REQUESTS_MOCK.map((row) => (
                  <tr key={row.id} className="order-row" onClick={() => handleRowClick(row.id)}>
                    <td style={{ padding: '1.25rem 1.5rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" style={{ accentColor: '#111827', width: '16px', height: '16px', cursor: 'pointer' }} />
                        <button 
                          onClick={(e) => handleActionMenuClick(e, row.id)}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      {activeMenuRowId === row.id && (
                        <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                          <div className="menu-item" onClick={() => { alert('Exporting row...'); setActiveMenuRowId(null); }}>Export</div>
                          <div className="menu-item" onClick={() => { alert('Marked as Irrelevant'); setActiveMenuRowId(null); }}>Irrelevant</div>
                          <div className="menu-item" onClick={() => { alert('Marked as Completed'); setActiveMenuRowId(null); }}>Mark as completed</div>
                          <div className="menu-item" onClick={() => { alert('Marked as Unread'); setActiveMenuRowId(null); }}>Mark as Unread</div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          backgroundColor: '#FFE7D9', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <img src="/rotary-hook.png" alt="Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{row.customerName}</div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#2563eb', 
                            border: '1px dashed #bfdbfe', 
                            borderRadius: '0.375rem', 
                            padding: '0.125rem 0.5rem', 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            gap: '0.25rem',
                            marginTop: '0.25rem', 
                            backgroundColor: '#eff6ff',
                            fontWeight: 600
                          }}>
                            REQUEST ID
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div 
                        onClick={(e) => handleCopy(e, row.phone, row.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: '1px dashed #bfdbfe',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          color: '#2563eb',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          backgroundColor: '#eff6ff',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        {row.phone}
                        {copiedText === row.id ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontWeight: 500 }}>{row.date}</td>
                    
                    {/* Documents pill column */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1.5rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#2563eb',
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}>
                          {row.docCount}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className={`action-badge ${
                        row.status === 'New' ? 'badge-now' : 
                        row.status === 'Payment Pending' ? 'badge-pending' : 
                        row.status === 'Order Placed' ? 'badge-placed' :
                        row.status === 'Cancelled' ? 'badge-cancelled' : 'badge-irrelevant'
                      }`}>
                        {row.status}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <img 
                        src="/View_button.svg" 
                        alt="View" 
                        style={{ width: '66px', height: '26px', cursor: 'pointer', display: 'block', margin: '0 auto' }} 
                        onClick={() => handleRowClick(row.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      <FiltersDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApply={(f) => console.log(f)}
      />
    </div>
  );
}
