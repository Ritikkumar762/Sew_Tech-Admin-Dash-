'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';
import { SupportArchitectureDocs } from '@/components/support/SupportArchitectureDocs';

interface Dispute {
  id: string;
  raisedByName: string;
  raisedByAvatar?: string;
  raisedByType: string; // 'Customer' | 'Mechanic'
  customerPhone?: string;
  date: string;
  disputeId: string;
  relatedEntity: string; // Order ID or Booking ID
  issueType: string; // 'Payout Issue' | 'Return Request' | etc
  status: 'Active' | 'Resolved' | 'Closed';
  disputeType?: string;
}

const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp-1',
    raisedByName: 'Nishant Kumar',
    raisedByType: 'Customer',
    customerPhone: '+91 9876543210',
    date: "21 Jan' 26",
    disputeId: 'STM834849',
    relatedEntity: 'Order ID',
    issueType: 'Payout Issue',
    status: 'Active'
  },
  {
    id: 'disp-2',
    raisedByName: 'Nishant Kumar',
    raisedByType: 'Customer',
    customerPhone: '+91 9876543210',
    date: "21 Jan' 26",
    disputeId: 'STM834849',
    relatedEntity: 'Order ID',
    issueType: 'Payout Issue',
    status: 'Active'
  },
  {
    id: 'disp-3',
    raisedByName: 'Nishant Kumar',
    raisedByType: 'Customer',
    customerPhone: '+91 9876543210',
    date: "21 Jan' 26",
    disputeId: 'STM834849',
    relatedEntity: 'Order ID',
    issueType: 'Payout Issue',
    status: 'Active'
  },
  {
    id: 'disp-4',
    raisedByName: 'Nishant Kumar',
    raisedByType: 'Customer',
    customerPhone: '+91 9876543210',
    date: "21 Jan' 26",
    disputeId: 'STM834849',
    relatedEntity: 'Order ID',
    issueType: 'Payout Issue',
    status: 'Active'
  }
];

export default function SupportPage() {
  const router = useRouter();
  const [activeModuleTab, setActiveModuleTab] = useState<'Sewtech Spare' | 'Sewtech Mechanic' | 'System Architecture & APIs'>('Sewtech Spare');
  const [activeStatusTab, setActiveStatusTab] = useState<'Ongoing' | 'Resolved'>('Ongoing');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [filterStatus, setFilterStatus] = useState({ newDisputes: true, resolved: false });
  const [filterSeverity, setFilterSeverity] = useState({ low: false, medium: false, high: false, critical: false });
  const [filterSla, setFilterSla] = useState({ withinSla: false, nearBreach: false, breached: false });
  const [filterCreatedRange, setFilterCreatedRange] = useState(''); // last-7, last-14, last-30, manually

  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [selectedDisputeIds, setSelectedDisputeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyticsMetrics, setAnalyticsMetrics] = useState<any>(null);

  // Fetch real disputes & analytics metrics from backend API
  const fetchDisputesAndAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const targetType = activeModuleTab === 'Sewtech Spare' ? 'spares' : (activeModuleTab === 'Sewtech Mechanic' ? 'mechanics' : '');
      if (targetType) params.append('dispute_type', targetType);

      const url = `${ENDPOINTS.support.disputes}?${params.toString()}`;
      const res = await apiClient.get<{ success: boolean; data: any }>(url);
      if (res && res.success && res.data) {
        const rawItems = Array.isArray(res.data) ? res.data : (res.data.items || []);
        if (rawItems.length > 0) {
          const mappedItems: Dispute[] = rawItems.map((item: any) => ({
            id: String(item.id || item.dispute_number),
            raisedByName: item.raisedByName || (item.customer_id ? `User #${item.customer_id}` : 'Nishant Kumar'),
            raisedByType: item.raisedByType || (item.dispute_type === 'mechanics' ? 'Mechanic' : 'Customer'),
            customerPhone: item.customerPhone || '+91 9876543210',
            date: item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : "21 Jan' 26"),
            disputeId: item.dispute_number || item.disputeId || `DISP-${item.id}`,
            relatedEntity: item.relatedEntity || (item.order_id ? `Order #${item.order_id}` : (item.booking_id ? `Booking #${item.booking_id}` : 'Order ID')),
            issueType: item.reason || item.issueType || 'Payout Issue',
            status: (item.status === 'Resolved' || item.status === 'Closed' || item.status === 'Rejected' || item.status === 'Refund Completed') ? 'Resolved' : 'Active',
            disputeType: item.dispute_type || (activeModuleTab === 'Sewtech Mechanic' ? 'mechanics' : 'spares')
          }));
          setDisputes(mappedItems);
        } else {
          setDisputes([]);
        }
      }
    } catch (err) {
      console.warn('Backend server offline or empty. Carrying out static disputes timeline history fallback.', err);
      setDisputes(INITIAL_DISPUTES);
    } finally {
      setLoading(false);
    }

    try {
      const analyticsRes = await apiClient.get<{ success: boolean; data: any }>(ENDPOINTS.support.analyticsDashboard);
      if (analyticsRes && analyticsRes.success && analyticsRes.data) {
        setAnalyticsMetrics(analyticsRes.data);
      }
    } catch (err) {
      // Analytics fallback
    }
  }, [searchQuery, activeModuleTab]);

  useEffect(() => {
    fetchDisputesAndAnalytics();
  }, [fetchDisputesAndAnalytics]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDisputeIds(disputes.map(d => d.id));
    } else {
      setSelectedDisputeIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDisputeIds([...selectedDisputeIds, id]);
    } else {
      setSelectedDisputeIds(selectedDisputeIds.filter(x => x !== id));
    }
  };

  const handleApplyFilters = () => {
    setShowFilterPopover(false);
    fetchDisputesAndAnalytics();
  };

  const handleClearFilters = () => {
    setFilterStatus({ newDisputes: false, resolved: false });
    setFilterSeverity({ low: false, medium: false, high: false, critical: false });
    setFilterSla({ withinSla: false, nearBreach: false, breached: false });
    setFilterCreatedRange('');
    setSearchQuery('');
    fetchDisputesAndAnalytics();
  };

  const handleBulkAction = async (action: string) => {
    if (selectedDisputeIds.length === 0) {
      alert('Please select disputes first!');
      return;
    }
    if (!confirm(`Are you sure you want to execute "${action}" on ${selectedDisputeIds.length} dispute(s)?`)) return;
    
    setLoading(true);
    let count = 0;
    for (const id of selectedDisputeIds) {
      try {
        await apiClient.post(ENDPOINTS.support.disputeAction(id), { action: 'Close' });
        count++;
      } catch (err) {
        console.error(`Failed bulk action on dispute ${id}`, err);
      }
    }
    alert(`Successfully processed bulk action on ${count} dispute(s).`);
    setSelectedDisputeIds([]);
    fetchDisputesAndAnalytics();
  };

  const handleExport = async () => {
    try {
      const headers = ['Dispute ID', 'Raised By', 'Role / Type', 'Date', 'Related Entity', 'Issue Type', 'Status'];
      const rows = disputes.map(d => [
        `"${d.disputeId}"`,
        `"${d.raisedByName}"`,
        `"${d.raisedByType}"`,
        `"${d.date}"`,
        `"${d.relatedEntity}"`,
        `"${d.issueType}"`,
        `"${d.status}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `disputes_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to export disputes data.');
    }
  };

  const moduleDisputes = disputes.filter(disp => {
    const matchesSearch = 
      disp.raisedByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disp.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disp.issueType.toLowerCase().includes(searchQuery.toLowerCase());

    const targetType = activeModuleTab === 'Sewtech Spare' ? 'spares' : 'mechanics';
    const matchesCategory = !disp.disputeType || disp.disputeType.toLowerCase() === targetType;
    return matchesSearch && matchesCategory;
  });

  const isTerminalState = (s: string) => ['Resolved', 'Closed', 'Rejected', 'Refund Completed'].includes(s);

  const ongoingCount = moduleDisputes.filter(disp => !isTerminalState(disp.status)).length;
  const resolvedCount = moduleDisputes.filter(disp => isTerminalState(disp.status)).length;

  const filteredDisputes = moduleDisputes.filter(disp => 
    activeStatusTab === 'Ongoing' ? !isTerminalState(disp.status) : isTerminalState(disp.status)
  );

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .animate-btn:active { transform: translateY(1px); }
        .animate-tr { transition: all 0.2s ease; }
        .animate-tr:hover { background-color: #f9fafb !important; }
        
        .kpi-title { color: #6b7280; fontSize: '0.8rem'; fontWeight: 600; marginBottom: '4px' }
        .kpi-value { fontSize: '1.75rem'; fontWeight: 700; color: '#111827' }
        
        .tab-btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e5e7eb;
          borderRadius: 0.5rem;
          outline: none;
          fontSize: 0.875rem;
          fontWeight: 500;
          color: #111827;
          background: #fff;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }
        .popover-card {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          borderRadius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          z-index: 50;
          width: 320px;
          padding: 1.5rem;
        }
      `}</style>

      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>Support & Disputes</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Payments & Resolutions
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          className="animate-btn"
        >
          Export
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>

      {/* KPI Stats Grid Row */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
        <div style={{ paddingRight: '1rem', borderRight: '1px solid #e5e7eb' }}>
          <div style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 700 }}>
            {analyticsMetrics ? (analyticsMetrics.total_open_tickets ?? 0) : 100}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', fontWeight: 500 }}>Open Tickets</div>
        </div>
        <div style={{ paddingRight: '1rem', borderRight: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <div style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 700 }}>
            {analyticsMetrics ? (analyticsMetrics.tickets_today ?? 0) : 20}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', fontWeight: 500 }}>New Tickets Today</div>
        </div>
        <div style={{ paddingRight: '1rem', borderRight: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {analyticsMetrics ? (analyticsMetrics.high_severity_issues ?? 0) : 15}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', fontWeight: 500 }}>High Severity Issues</div>
        </div>
        <div style={{ paddingRight: '1rem', borderRight: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {analyticsMetrics ? (analyticsMetrics.pending_refunds ?? 0) : 15}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', fontWeight: 500 }}>Pending Refunds</div>
        </div>
        <div style={{ paddingLeft: '1rem' }}>
          <div style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 700 }}>
            {analyticsMetrics?.total_refunded_amount !== undefined ? `₹${analyticsMetrics.total_refunded_amount}` : (analyticsMetrics?.avg_resolution_days ? `${analyticsMetrics.avg_resolution_days} Days` : '3 Days')}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', fontWeight: 500 }}>{analyticsMetrics?.total_refunded_amount ? 'Total Refunded' : 'Avg Resolution Time'}</div>
        </div>
      </div>

      {/* Module Wise Tabs (Sewtech Spare | Sewtech Mechanic | System Architecture & APIs) */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '0.5rem 1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          {(['Sewtech Spare', 'Sewtech Mechanic', 'System Architecture & APIs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveModuleTab(tab)}
              className="tab-btn"
              style={{
                color: activeModuleTab === tab ? '#3b82f6' : '#6b7280',
                borderBottom: activeModuleTab === tab ? '2.5px solid #3b82f6' : '2.5px solid transparent',
                marginBottom: '-1px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeModuleTab === 'System Architecture & APIs' ? (
        <SupportArchitectureDocs />
      ) : (
        <>

      {/* Filter Controls Row */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative' }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Search by Mechanic ID/ Dispute ID/ Entity ID" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Date Filter */}
        <div 
          onClick={() => setShowFilterPopover(!showFilterPopover)}
          style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.65rem 1rem', background: '#fff', cursor: 'pointer', gap: '0.5rem', userSelect: 'none' }}
          className="animate-btn"
        >
          <span style={{ color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>Created on</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          <div style={{ borderLeft: '1px solid #e5e7eb', height: '100%', margin: '0 0.5rem' }}></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>

        {/* Action filter controls */}
        <button 
          onClick={handleApplyFilters}
          style={{ background: '#111827', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.65rem 1.2rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
          className="animate-btn"
        >
          Apply Filters
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
        </button>

        {/* Bulk Actions dropdown trigger */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => handleBulkAction('Resolve Selected')}
            style={{ border: '1px solid #111827', background: 'transparent', color: '#111827', borderRadius: '0.5rem', padding: '0.65rem 1.2rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            className="animate-btn"
          >
            Bulk Actions
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        {/* ─── FILTERS POPOVER (Mockup Image 3) ─── */}
        {showFilterPopover && (
          <>
            <div onClick={() => setShowFilterPopover(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div className="popover-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>Filters</span>
                <button 
                  onClick={handleClearFilters}
                  style={{ background: '#fff0f0', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Clear Filters <span>×</span>
                </button>
              </div>

              {/* Status Section */}
              <div style={{ marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  Status <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterStatus.newDisputes} onChange={(e) => setFilterStatus({ ...filterStatus, newDisputes: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    New Disputes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterStatus.resolved} onChange={(e) => setFilterStatus({ ...filterStatus, resolved: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Resolved
                  </label>
                </div>
              </div>

              {/* Severity Section */}
              <div style={{ marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  Severity <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingLeft: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSeverity.low} onChange={(e) => setFilterSeverity({ ...filterSeverity, low: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Low
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSeverity.high} onChange={(e) => setFilterSeverity({ ...filterSeverity, high: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    High
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSeverity.medium} onChange={(e) => setFilterSeverity({ ...filterSeverity, medium: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Medium
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSeverity.critical} onChange={(e) => setFilterSeverity({ ...filterSeverity, critical: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Critical
                  </label>
                </div>
              </div>

              {/* SLA Status Section */}
              <div style={{ marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  SLA Status <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingLeft: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSla.withinSla} onChange={(e) => setFilterSla({ ...filterSla, withinSla: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Within SLA
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSla.nearBreach} onChange={(e) => setFilterSla({ ...filterSla, nearBreach: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Near Breach
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterSla.breached} onChange={(e) => setFilterSla({ ...filterSla, breached: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
                    Breached
                  </label>
                </div>
              </div>

              {/* Created On Date Selection */}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  Created On <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingLeft: '4px', marginBottom: '0.75rem' }}>
                  {[
                    { label: 'Last 7 Days', val: 'last-7' },
                    { label: 'Last 14 Days', val: 'last-14' },
                    { label: 'Last 30 Days', val: 'last-30' },
                    { label: 'Last 6 Months', val: 'last-6-months' }
                  ].map((x) => (
                    <label key={x.val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                      <input type="radio" checked={filterCreatedRange === x.val} onChange={() => setFilterCreatedRange(x.val)} style={{ accentColor: '#3b82f6' }} />
                      {x.label}
                    </label>
                  ))}
                </div>
                
                {/* Manual Range */}
                <div style={{ paddingLeft: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Select Manually</span>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', background: '#f9fafb', padding: '4px 8px', fontSize: '0.7rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📅 DD/MM/YYYY</span>
                    <span>-</span>
                    <span>📅 DD/MM/YYYY</span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Main Table Grid Row (Ongoing & Resolved Tabs) */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
          {[
            { label: 'Ongoing', count: ongoingCount },
            { label: 'Resolved', count: resolvedCount },
          ].map((tab) => (
            <div 
              key={tab.label}
              onClick={() => setActiveStatusTab(tab.label as any)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                cursor: 'pointer', 
                paddingBottom: '1rem',
                marginBottom: '-1px',
                borderBottom: activeStatusTab === tab.label ? '2px solid #111827' : '2px solid transparent',
                color: activeStatusTab === tab.label ? '#111827' : '#6b7280',
                fontWeight: activeStatusTab === tab.label ? 600 : 500,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
              <span style={{ 
                background: activeStatusTab === tab.label ? '#ef4444' : '#f3f4f6', 
                color: activeStatusTab === tab.label ? '#fff' : '#6b7280', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {tab.count}
              </span>
            </div>
          ))}
        </div>

        {/* Inner Table Viewport */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedDisputeIds.length === disputes.length && disputes.length > 0}
                    style={{ accentColor: '#111827', width: '16px', height: '16px', borderRadius: '4px' }} 
                  />
                </th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem' }}>Raised By <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem' }}>Role / Type <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Date <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Dispute ID <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Related Entity <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem' }}>Issue Type <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Status <span style={{ color: '#d1d5db', marginLeft: '4px' }}>↓↑</span></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading disputes...</td></tr>}
              {!loading && filteredDisputes.map((disp) => (
                <tr key={disp.id} className="animate-tr" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedDisputeIds.includes(disp.id)}
                      onChange={(e) => handleSelectOne(disp.id, e.target.checked)}
                      style={{ accentColor: '#111827', width: '16px', height: '16px', borderRadius: '4px' }} 
                    />
                  </td>
                  
                  {/* User Profile Col */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4b5563', fontSize: '0.9rem', overflow: 'hidden' }}>
                        {disp.raisedByName.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#111827', display: 'block' }}>{disp.raisedByName}</strong>
                        
                        {/* Copy ID button */}
                        <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', border: '1px dashed #bfdbfe', background: '#eff6ff', color: '#3b82f6', fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '12px', marginTop: '2px', cursor: 'pointer' }}>
                          Customer ID
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Raised By type */}
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#8b5cf6' }}>
                    {disp.raisedByType}
                  </td>

                  {/* Date */}
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4b5563', textAlign: 'center', fontWeight: 600 }}>
                    {disp.date}
                  </td>

                  {/* Dispute ID with dashed wrap */}
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ border: '1px dashed #3b82f6', color: '#3b82f6', background: '#eff6ff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {disp.disputeId}
                    </span>
                  </td>

                  {/* Related Entity with dashed wrap */}
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ border: '1px dashed #3b82f6', color: '#3b82f6', background: '#eff6ff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {disp.relatedEntity}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </span>
                  </td>

                  {/* Issue Type */}
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                    {disp.issueType}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ background: disp.status === 'Active' ? '#fef2f2' : '#f0fdf4', color: disp.status === 'Active' ? '#ef4444' : '#10b981', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: disp.status === 'Active' ? '1px solid #fca5a5' : '1px solid #86efac' }}>
                      {disp.status}
                    </span>
                  </td>

                  {/* Action row link */}
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => router.push(`/support/${disp.id}`)}
                      style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#111827', padding: '6px 14px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                      className="animate-btn"
                    >
                      View
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table pagination rows */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Rows per page:</span>
            <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>1–10 of 165</span>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.5rem' }}>
            <span>Rows per page:</span>
            <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>1–10 of 165</span>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
          </div>
        </div>

      </div>
        </>
      )}
    </div>
  );
}
