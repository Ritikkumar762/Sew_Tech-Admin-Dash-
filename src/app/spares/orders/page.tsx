'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

// Comprehensive mock data covering all order statuses and tabs
const INITIAL_ORDERS = [
  // Return tab items
  { id: 'sth-rh-2045', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Items not arriving on time', orderValue: 1850, status: 'Requested', avatarLetter: 'a', paymentMethod: 'UPI', type: 'return' },
  { id: 'sth-rh-2046', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Need to change address', orderValue: 1850, status: 'Pickup Scheduled', avatarLetter: 'a', paymentMethod: 'UPI', type: 'return' },
  { id: 'sth-rh-2047', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Ordered by mistake', orderValue: 1850, status: 'Pickup Failed', avatarLetter: 'a', paymentMethod: 'UPI', type: 'return' },

  // Replacement tab items
  { id: 'sth-rh-2051', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Items not arriving on time', orderValue: 1850, status: 'Pickup Completed', avatarLetter: 'a', paymentMethod: 'UPI', type: 'replacement' },
  { id: 'sth-rh-2052', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Need to change address', orderValue: 1850, status: 'Pickup Scheduled', avatarLetter: 'a', paymentMethod: 'UPI', type: 'replacement' },
  { id: 'sth-rh-2053', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Ordered by mistake', orderValue: 1850, status: 'Pickup Failed', avatarLetter: 'a', paymentMethod: 'UPI', type: 'replacement' },

  // Cancelled tab items
  { id: 'sth-rh-2064', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Items not arriving on time', orderValue: 1850, status: 'Refund completed', avatarLetter: 'a', paymentMethod: 'UPI', type: 'cancelled', cancelledBy: 'User' },
  { id: 'sth-rh-2065', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Need to change address', orderValue: 1850, status: 'Refund requested', avatarLetter: 'a', paymentMethod: 'UPI', type: 'cancelled', cancelledBy: 'Vendor' },
  { id: 'sth-rh-2066', customerName: 'Aditya Bhargav', email: 'aditya.bhargav@gmail.com', phone: '+919876543210', date: "21 Jan' 26", reason: 'Ordered by mistake', orderValue: 1850, status: 'Refund rejected', avatarLetter: 'a', paymentMethod: 'UPI', type: 'cancelled', cancelledBy: 'Admin' },

  // Ordered Tab matches (status is: 'Order Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered')
  { id: 'sth-rh-2059', customerName: 'Gaurav Mehta', email: 'gaurav.mehta@gmail.com', phone: '+919922334455', date: "22 Jan' 26", reason: 'None', orderValue: 6700, status: 'Shipped', avatarLetter: 'g', paymentMethod: 'UPI', type: 'order' },
  { id: 'sth-rh-2060', customerName: 'Siddharth Rao', email: 'sid.rao@gmail.com', phone: '+919933445566', date: "22 Jan' 26", reason: 'None', orderValue: 3450, status: 'Processing', avatarLetter: 's', paymentMethod: 'Card', type: 'order' },
  { id: 'sth-rh-2061', customerName: 'Ishaan Verma', email: 'ishaan.v@gmail.com', phone: '+919944556677', date: "23 Jan' 26", reason: 'None', orderValue: 8900, status: 'Order Received', avatarLetter: 'i', paymentMethod: 'UPI', type: 'order' },
  { id: 'sth-rh-2062', customerName: 'Rohan Deshmukh', email: 'rohan.d@gmail.com', phone: '+919955667788', date: "24 Jan' 26", reason: 'None', orderValue: 4500, status: 'Out for Delivery', avatarLetter: 'r', paymentMethod: 'COD', type: 'order' },
  { id: 'sth-rh-2063', customerName: 'Deepa Krishnan', email: 'deepa.k@gmail.com', phone: '+919966778899', date: "24 Jan' 26", reason: 'None', orderValue: 5800, status: 'Delivered', avatarLetter: 'd', paymentMethod: 'UPI', type: 'order' }
];

export default function SparesOrdersPage() {
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalOrders: INITIAL_ORDERS.length,
    cancelled: 2,
    returned: 3,
    replacement: 5
  });

  const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODU1NTEwODQsImlhdCI6MTc4Mjk1OTA4NH0.riR2bGkpAAWovihDD5xMr3LNA7RkVyIcF-kzenP7T-k';

  // Live GET /api/spares/orders Fetch from Database
  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) || HARDCODED_TOKEN;
      const res = await fetch('/api/v1/admin/spares/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        console.warn(`Failed to fetch spares orders (Status: ${res.status})`);
        setError(`Status: ${res.status}`);
        return;
      }
      const json = await res.json();
      
      const dataArray = json.data || json.items;
      if (dataArray && Array.isArray(dataArray)) {
        const mapped = dataArray.map((item: any) => {
          let status = item.status || 'Order Received';
          // Clean status: Support camelCase, snake_case, or UPPERCASE from backend by converting to Title Case
          status = status.split(/[_-]/)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          const statusLower = status.toLowerCase();
          const isCancelled = statusLower.includes('cancelled') || statusLower.includes('reject');
          const isReturn = statusLower.includes('return') || statusLower.includes('refund');
          const isReplacement = statusLower.includes('replacement') || statusLower.includes('pickup') || statusLower === 'requested';
          
          let type = item.type || item.orderType || item.requestType || item.order_type || item.request_type || '';
          type = type.toLowerCase();
          
          if (type !== 'return' && type !== 'replacement' && type !== 'cancelled') {
            if (isCancelled) {
              type = 'cancelled';
            } else if (isReturn) {
              type = 'return';
            } else if (isReplacement) {
              type = 'replacement';
            } else {
              type = 'order';
            }
          }

          return {
            id: item.id || (item.order_id ? `o${item.order_id}` : 'undefined'),
            customerName: item.customerName || (item.address_snapshot?.full_name) || 'Unknown User',
            email: item.email || (item.address_snapshot?.email) || 'unknown@example.com',
            phone: item.phone || (item.address_snapshot?.phone) || '+91 0000000000',
            date: (item.createdAt || item.created_at) ? new Date(item.createdAt || item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }) : "21 Jan' 26",
            reason: item.reason || 'None',
            orderValue: item.amount || item.final_amount || 0.0,
            status,
            avatarLetter: (item.customerName || item.address_snapshot?.full_name || 'U').charAt(0).toLowerCase(),
            paymentMethod: item.paymentMethod || item.payment_method || 'UPI',
            type
          };
        });
        setOrders(mapped);

        // Also compute dynamic stats based on retrieved database counts!
        const total = mapped.length;
        const cancelled = mapped.filter((o: any) => o.type === 'cancelled').length;
        const returned = mapped.filter((o: any) => o.type === 'return').length;
        const replacement = mapped.filter((o: any) => o.type === 'replacement').length;
        setStats({
          totalOrders: total,
          cancelled,
          returned,
          replacement
        });
      } else {
        console.warn(json?.message || 'Invalid data shape returned.');
        setError('Invalid data shape returned.');
      }
    } catch (err: any) {
      console.error('Error fetching spares orders:', err);
      setError(err.message || 'Error fetching spares orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Ordered' | 'Return' | 'Replacement' | 'Cancelled'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic Pill Filter states per tab
  const [activePills, setActivePills] = useState<Record<string, string[]>>({
    All: [],
    Ordered: [],
    Return: [],
    Replacement: [],
    Cancelled: [],
  });

  const ALL_PILLS = useMemo(() => {
    const base: Record<string, { label: string; hasPlus?: boolean }[]> = {
      All: [
        { label: 'Flagged' },
        { label: 'Delayed' },
        { label: 'Support Required', hasPlus: true }
      ],
      Ordered: [
        { label: 'Payment Failed', hasPlus: true },
        { label: 'Order Received' },
        { label: 'Processing' },
        { label: 'Shipped' },
        { label: 'Out for Delivery', hasPlus: true },
        { label: 'Delivered' },
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
        { label: 'Cancellation Requested', hasPlus: true },
        { label: 'Cancellation Accepted' }
      ]
    };

    const result: Record<string, { label: string; count?: number; hasPlus?: boolean }[]> = {};
    for (const [tab, pills] of Object.entries(base)) {
      if (tab === 'All') {
        result[tab] = [
          { label: 'Flagged', count: 767 },
          { label: 'Delayed' },
          { label: 'Support Required', count: 34, hasPlus: true }
        ];
        continue;
      }
      result[tab] = pills.map(pill => ({
        ...pill,
        count: orders.filter(o => {
          const tabMatch =
            tab === 'Ordered' ? o.type === 'order' :
            tab === 'Return' ? o.type === 'return' :
            tab === 'Replacement' ? o.type === 'replacement' :
            tab === 'Cancelled' ? o.type === 'cancelled' : false;
          if (!tabMatch) return false;
          const p = pill.label.toLowerCase();
          const s = o.status.toLowerCase();
          return s === p || s.includes(p) || p.includes(s) ||
                 (p === 'return requested' && s === 'requested') ||
                 (p === 'cancellation accepted' && s.includes('completed'));
        }).length
      }));
    }
    return result;
  }, [orders]);

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
      // Just as a placeholder for frontend filtering
      setOrders(prev => prev.slice(0, 3));
    } else {
      // We should just re-fetch orders or clear frontend filters
      fetchOrders();
    }
  };

  // Filter orders based on Tab and Search Query
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === 'All') return true;
    if (activeTab === 'Ordered') {
      if (order.type !== 'order') return false;
    }
    if (activeTab === 'Return') {
      if (order.type !== 'return') return false;
    } else if (activeTab === 'Replacement') {
      if (order.type !== 'replacement') return false;
    } else if (activeTab === 'Cancelled') {
      if (order.type !== 'cancelled') return false;
    }

    // Active Status Pills filter (Only for tabs other than 'All')
    const pills = activePills[activeTab] || [];
    if (pills.length > 0) {
      // Filter list to only match the selected pill(s)!
      const matchesPill = pills.some(pill => {
        const p = pill.toLowerCase();
        const s = order.status.toLowerCase();
        return s === p || s.includes(p) || p.includes(s) || (p === 'return requested' && s === 'requested') || (p === 'cancellation accepted' && s.includes('completed'));
      });
      if (!matchesPill) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getTabCount = (tabId: 'All' | 'Ordered' | 'Return' | 'Replacement' | 'Cancelled') => {
    return orders.filter(order => {
      if (tabId === 'All') return true;
      if (tabId === 'Ordered') return order.type === 'order';
      if (tabId === 'Return') return order.type === 'return';
      if (tabId === 'Replacement') return order.type === 'replacement';
      if (tabId === 'Cancelled') return order.type === 'cancelled';
      return true;
    }).length;
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
            padding: 0.375rem 0.875rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .status-completed { color: #16a34a; background-color: #f0fdf4; }
          .status-warning { color: #d97706; background-color: #fffbeb; }
          .status-danger { color: #ef4444; background-color: #fee2e2; }
          .status-blue { color: #2563eb; background-color: #eff6ff; }
          
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
            { id: 'All', count: getTabCount('All') },
            { id: 'Ordered', count: getTabCount('Ordered') },
            { id: 'Return', count: getTabCount('Return') },
            { id: 'Replacement', count: getTabCount('Replacement') },
            { id: 'Cancelled', count: getTabCount('Cancelled') },
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
                {activeTab === 'Cancelled' && (
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Cancelled by ↑↓</th>
                )}
                <th style={{ padding: '1rem', fontWeight: 600 }}>Order Value ↑↓</th>
                {(activeTab === 'Return' || activeTab === 'Replacement' || activeTab === 'Cancelled') && (
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Reason ↑↓</th>
                )}
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status ↑↓</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                      <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <div style={{ marginTop: '1rem', fontWeight: 500 }}>Loading orders...</div>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Failed to Load Orders</div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</div>
                    </td>
                  </tr>
                ) : displayedOrders.length > 0 ? (
                  displayedOrders.map((order, idx) => (
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
                    {activeTab === 'Cancelled' && (
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#a855f7',
                          backgroundColor: '#faf5ff',
                          border: '1px solid #f3e8ff'
                        }}>
                          {order.cancelledBy || 'User'}
                        </span>
                      </td>
                    )}
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>₹{order.orderValue.toLocaleString('en-IN')}</td>
                    {(activeTab === 'Return' || activeTab === 'Replacement' || activeTab === 'Cancelled') && (
                      <td style={{ padding: '1rem' }}>
                        <span className="reason-pill">
                          {order.reason}
                        </span>
                      </td>
                    )}
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-badge ${
                        order.status.toLowerCase().includes('completed') || order.status.toLowerCase().includes('delivered')
                          ? 'status-completed'
                          : order.status.toLowerCase().includes('failed') || order.status.toLowerCase().includes('rejected')
                          ? 'status-danger'
                          : order.status.toLowerCase().includes('scheduled') || order.status.toLowerCase().includes('requested') || order.status.toLowerCase().includes('initiated')
                          ? 'status-warning'
                          : 'status-blue'
                      }`}>
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
                  <td colSpan={activeTab === 'Cancelled' ? 8 : activeTab === 'Return' || activeTab === 'Replacement' ? 7 : 6} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontWeight: 500 }}>
                    No orders found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 1.5rem', flexWrap: 'wrap', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Rows per page:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{filteredOrders.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}–{Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length}</span>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ border: 'none', background: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', fontWeight: 700, color: currentPage === 1 ? '#9ca3af' : '#111827' }}
            >
              &lt;
            </button>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{ border: 'none', background: 'none', cursor: currentPage >= totalPages ? 'default' : 'pointer', fontWeight: 700, color: currentPage >= totalPages ? '#9ca3af' : '#111827' }}
            >
              &gt;
            </button>
          </div>
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
