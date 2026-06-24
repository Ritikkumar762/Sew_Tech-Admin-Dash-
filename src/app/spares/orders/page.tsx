'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Calendar, 
  SlidersHorizontal, 
  ChevronDown, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check,
  X,
  Plus
} from 'lucide-react';
import FiltersDrawer from '@/components/orders/FiltersDrawer';

const INITIAL_ORDERS = [
  { id: 'sth-rh-2045', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Items not arriving on time', orderValue: 1850, status: 'Requested', avatarLetter: 'b', paymentMethod: 'UPI' },
  { id: 'sth-rh-2046', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Need to change address', orderValue: 1850, status: 'Pickup Scheduled', avatarLetter: 'b', paymentMethod: 'UPI' },
  { id: 'sth-rh-2047', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Ordered by mistake', orderValue: 1850, status: 'Pickup Failed', avatarLetter: 'b', paymentMethod: 'UPI' },
  { id: 'sth-rh-2048', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Defective product', orderValue: 1850, status: 'Return Requested', avatarLetter: 'b', paymentMethod: 'UPI' },
  { id: 'sth-rh-2049', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Changed mind', orderValue: 1850, status: 'Replacement in Process', avatarLetter: 'b', paymentMethod: 'UPI' },
  { id: 'sth-rh-2050', customerName: 'Aditya Bhargav', email: 'demoemail@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Wrong item sent', orderValue: 1850, status: 'Refund Completed', avatarLetter: 'b', paymentMethod: 'UPI' },
];

export default function SparesOrdersPage() {
  const router = useRouter();
  
  // State variables
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Ordered' | 'Return' | 'Replacement' | 'Cancelled'>('All');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Dynamic Pill Filter states per tab
  const [activePills, setActivePills] = useState<Record<string, string[]>>({
    All: ['Delayed'],
    Ordered: ['Shipped'],
    Return: ['Return Requested'],
    Replacement: ['Replacement Requested'],
    Cancelled: ['Cancelled'],
  });

  const ALL_PILLS: Record<string, { label: string; count?: number; hasPlus?: boolean }[]> = {
    All: [
      { label: 'Flagged', count: 767 },
      { label: 'Delayed' },
      { label: 'Support Required', count: 34, hasPlus: true }
    ],
    Ordered: [
      { label: 'Payment Failed', count: 767, hasPlus: true },
      { label: 'Shipped' },
      { label: 'Out for Delivery', count: 34, hasPlus: true },
      { label: 'Delivery Failed', count: 12, hasPlus: true },
      { label: 'Completed', hasPlus: true }
    ],
    Return: [
      { label: 'Return Requested', hasPlus: true },
      { label: 'Pickup Scheduled', hasPlus: true },
      { label: 'Pickup Completed', hasPlus: true },
      { label: 'Refund Initiated', hasPlus: true },
      { label: 'Refund Completed', hasPlus: true }
    ],
    Replacement: [
      { label: 'Return Requested', hasPlus: true },
      { label: 'Pickup Scheduled', hasPlus: true },
      { label: 'Pickup Completed', hasPlus: true },
      { label: 'Refund Initiated', hasPlus: true },
      { label: 'Refund Completed', hasPlus: true }
    ],
    Cancelled: [
      { label: 'Cancelled' },
      { label: 'Cancelled by User', count: 374, hasPlus: true }
    ]
  };

  const togglePill = (tab: string, label: string) => {
    setActivePills(prev => {
      const current = prev[tab] || [];
      if (current.includes(label)) {
        return { ...prev, [tab]: current.filter(l => l !== label) };
      } else {
        return { ...prev, [tab]: [...current, label] };
      }
    });
  };

  // Refresh animations/states for cards
  const [refreshingCard, setRefreshingCard] = useState<number | null>(null);

  // Stats matching the mockup
  const [stats, setStats] = useState({
    totalOrders: 12,
    cancelled: 10,
    returned: 10,
    replacement: 10
  });

  const handleRefreshCard = (index: number) => {
    setRefreshingCard(index);
    setTimeout(() => {
      setRefreshingCard(null);
      // Simulate numeric update slightly
      if (index === 0) setStats(prev => ({ ...prev, totalOrders: Math.floor(Math.random() * 5) + 10 }));
      if (index === 1) setStats(prev => ({ ...prev, cancelled: Math.floor(Math.random() * 3) + 9 }));
      if (index === 2) setStats(prev => ({ ...prev, returned: Math.floor(Math.random() * 3) + 9 }));
      if (index === 3) setStats(prev => ({ ...prev, replacement: Math.floor(Math.random() * 3) + 9 }));
    }, 600);
  };

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id.toUpperCase());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Filters applied:', filters);
    // In a real application, we would filter data here.
    // For demo purposes, let's simulate a quick filter effect:
    if (filters.categories.length > 0) {
      setOrders(INITIAL_ORDERS.slice(0, 3));
    } else {
      setOrders(INITIAL_ORDERS);
    }
  };

  // Filter orders based on Tab and Search Query
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filter
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Ordered') return matchesSearch && (order.status === 'Order Received' || order.status === 'Processing');
    if (activeTab === 'Return') return matchesSearch && (order.status === 'Return Requested');
    if (activeTab === 'Replacement') return matchesSearch && (order.status === 'Shipped' || order.status === 'Out for Delivery');
    if (activeTab === 'Cancelled') return matchesSearch && (order.status === 'Cancelled');
    
    return matchesSearch;
  });

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
          .refresh-btn {
            position: absolute;
            right: 1.25rem;
            bottom: 1.25rem;
            background: none;
            border: none;
            color: #3b82f6;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, transform 0.2s;
          }
          .refresh-btn:hover {
            background-color: #eff6ff;
          }
          .refreshing {
            animation: spin 0.6s linear;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .tab-button {
            border: none;
            background: none;
            padding: 0.75rem 1rem;
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
          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
          .status-requested { color: #eab308; background-color: #fef9c3; }
          .status-scheduled { color: #f59e0b; background-color: #fef3c7; }
          .status-failed { color: #ef4444; background-color: #fee2e2; }
          .status-completed { color: #10b981; background-color: #d1fae5; }
          .status-default { color: #6b7280; background-color: #f3f4f6; }
          
          .reason-pill {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 500;
            background-color: #f3f4f6;
            color: #6b7280;
          }
          .order-row {
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.15s;
          }
          .order-row:hover {
            background-color: #f8fafc;
          }
          .action-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.5rem 0.875rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background-color: white;
            color: #1f2937;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          .action-btn:hover {
            background-color: #f9fafb;
            border-color: #9ca3af;
          }
        `}
      </style>

      {/* Breadcrumbs & Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '0.25rem' }}>Order Management</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            Sewtech Spare <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>•</span> Order Management
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
        {/* Card 1: Total Orders */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6.59px', 
                backgroundColor: '#ECF3FE', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img src="/total order.svg" alt="Total Orders" style={{ width: '14.93px', height: '14.93px', objectFit: 'contain' }} />
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Total Orders</span>
            </div>
            <span className="trend-pill trend-down">▼ 5% (L7D)</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.totalOrders}</span>
          <button className="refresh-btn" onClick={() => handleRefreshCard(0)}>
            <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '14px', height: '14px', display: 'block' }} className={refreshingCard === 0 ? 'refreshing' : ''} />
          </button>
        </div>

        {/* Card 2: Cancelled */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6.59px', 
                backgroundColor: '#fef2f2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img src="/cancelled-clean.svg" alt="Cancelled" style={{ width: '14.93px', height: '14.93px', objectFit: 'contain' }} />
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Cancelled</span>
            </div>
            <span className="trend-pill trend-up">▲ 5% (L7D)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.cancelled}</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>({stats.cancelled * 10}%)</span>
          </div>
          <button className="refresh-btn" onClick={() => handleRefreshCard(1)}>
            <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '14px', height: '14px', display: 'block' }} className={refreshingCard === 1 ? 'refreshing' : ''} />
          </button>
        </div>

        {/* Card 3: Returned */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6.59px', 
                backgroundColor: '#ECF3FE', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img src="/returned.svg" alt="Returned" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Returned</span>
            </div>
            <span className="trend-pill trend-down">▼ 5% (L7D)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.returned}</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>({stats.returned * 10}%)</span>
          </div>
          <button className="refresh-btn" onClick={() => handleRefreshCard(2)}>
            <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '14px', height: '14px', display: 'block' }} className={refreshingCard === 2 ? 'refreshing' : ''} />
          </button>
        </div>

        {/* Card 4: Replacement */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6.59px', 
                backgroundColor: '#ECF3FE', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img src="/exchange-clean.svg" alt="Replacement" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>Replacement</span>
            </div>
            <span className="trend-pill trend-down">▼ 5% (L7D)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.replacement}</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>({stats.replacement * 10}%)</span>
          </div>
          <button className="refresh-btn" onClick={() => handleRefreshCard(3)}>
            <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '14px', height: '14px', display: 'block' }} className={refreshingCard === 3 ? 'refreshing' : ''} />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '700px' }}>
            {/* Search Input */}
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
            
            {/* Created on Dropdown Selector */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0 0.875rem', backgroundColor: 'white', cursor: 'pointer', flex: 1 }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563', marginRight: '0.5rem', fontWeight: 500 }}>Created on</span>
              <ChevronDown size={14} style={{ color: '#9ca3af', marginLeft: 'auto', marginRight: '0.5rem' }} />
              <Calendar size={14} style={{ color: '#9ca3af' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {/* Apply Filters Button */}
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

            {/* Bulk Actions Button */}
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
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', marginBottom: '1rem' }}>
          {[
            { id: 'All', count: 2345 },
            { id: 'Ordered', count: 1085 },
            { id: 'Return', count: 1983 },
            { id: 'Replacement', count: 1534 },
            { id: 'Cancelled', count: 374 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`tab-button ${activeTab === tab.id ? 'tab-button-active' : ''}`}
            >
              {tab.id}({tab.count})
            </button>
          ))}
        </div>

        {/* Secondary Filter Pills row */}
        <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '1rem', flexWrap: 'wrap' }}>
          {(ALL_PILLS[activeTab] || []).map((pill) => {
            const isActive = (activePills[activeTab] || []).includes(pill.label);
            return (
              <div 
                key={pill.label}
                onClick={() => !isActive && togglePill(activeTab, pill.label)}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.375rem', 
                  padding: '0.375rem 0.875rem', 
                  borderRadius: '2rem', 
                  backgroundColor: isActive ? '#1f2937' : '#f3f4f6', 
                  color: isActive ? 'white' : '#4b5563', 
                  fontSize: '0.75rem', 
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none'
                }}
              >
                {pill.label}
                {pill.count !== undefined && ` (${pill.count})`}
                {isActive ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePill(activeTab, pill.label); }}
                    style={{ border: 'none', background: 'none', color: 'white', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: '0.125rem' }}
                  >
                    <X size={12} />
                  </button>
                ) : (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    border: '1px solid #9ca3af',
                    fontSize: '9px',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginLeft: '0.125rem'
                  }}>+</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Orders Table Container */}
        <div style={{ overflowX: 'auto', margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                <th style={{ padding: '1rem 1.5rem', width: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '0.25rem', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>-</span>
                  </div>
                </th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Order ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Date ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Order Value ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Reason ↑↓</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status ↑↓</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id} className="order-row" style={{ cursor: 'pointer' }} onClick={() => router.push(`/spares/orders/${order.id}`)}>
                    <td style={{ padding: '1.25rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" style={{ accentColor: '#111827', width: '16px', height: '16px', cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Circular Avatar */}
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          backgroundColor: '#FFE7D9', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          <img src="/rotary-hook.png" alt="Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{order.customerName}</div>
                          {/* Order ID Copyable Badge */}
                          <div 
                            onClick={(e) => handleCopyId(e, order.id)}
                            style={{ 
                              fontSize: '0.75rem', 
                              color: '#2563eb', 
                              border: '1px dashed #bfdbfe', 
                              borderRadius: '0.375rem', 
                              padding: '0.125rem 0.5rem', 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              gap: '0.25rem',
                              marginTop: '0.25rem', 
                              cursor: 'pointer',
                              backgroundColor: '#eff6ff',
                              fontWeight: 500,
                              position: 'relative'
                            }}
                          >
                            {order.id.toUpperCase()}
                            {copiedId === order.id ? <Check size={10} style={{ color: '#16a34a' }} /> : <Copy size={10} />}
                            
                            {copiedId === order.id && (
                              <span style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%) translateY(-4px)',
                                backgroundColor: '#1f2937',
                                color: 'white',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap',
                                zIndex: 10
                              }}>
                                Copied!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#374151' }}>{order.date}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>₹{order.orderValue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="reason-pill">
                        {order.reason}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-badge ${order.status === 'Requested' ? 'status-requested' : order.status === 'Pickup Scheduled' ? 'status-scheduled' : order.status === 'Pickup Failed' ? 'status-failed' : order.status.includes('Completed') ? 'status-completed' : 'status-default'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <img 
                        src="/View_button.svg" 
                        alt="View" 
                        style={{ width: '66px', height: '26px', cursor: 'pointer', display: 'block', margin: '0 auto' }} 
                        onClick={() => router.push(`/spares/orders/${order.id}`)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontWeight: 500 }}>
                    No orders found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Filters Drawer */}
      <FiltersDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
