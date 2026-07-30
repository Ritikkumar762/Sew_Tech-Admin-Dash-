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

const exportToCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => headers.map(header => {
      const value = row[header];
      const text = value === null || value === undefined ? '' : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    }).join(','))
  ];
  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function SupportPage() {
  const router = useRouter();
  const showUnderProgressOnly = false;
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
      const rows = disputes.map(d => ({
        'Dispute ID': d.disputeId,
        'Raised By': d.raisedByName,
        'Role / Type': d.raisedByType,
        'Date': d.date,
        'Related Entity': d.relatedEntity,
        'Issue Type': d.issueType,
        'Status': d.status
      }));
      exportToCSV(`disputes_export_${Date.now()}`, rows);
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

  return null;

  /*
  if (showUnderProgressOnly) {
    return (
      <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <style>{`
          .animate-btn { transition: all 0.2s ease; }
          .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
          .animate-btn:active { transform: translateY(1px); }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>Support & Disputes</h1>
              <span style={{
                background: '#fef3c7',
                color: '#d97706',
                border: '1px solid #fde68a',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#d97706', display: 'inline-block' }}></span>
                Under Progress
              </span>
            </div>
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

        <div style={{
          background: 'linear-gradient(135deg, #fffbe0 0%, #fef9c3 100%)',
          border: '1px solid #fde047',
          borderRadius: '0.75rem',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#fef08a',
            color: '#a16207',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Support & Dispute Page — Under Progress
            </div>
            <div style={{ fontSize: '0.825rem', color: '#a16207', marginTop: '2px' }}>
              This page is currently under development. All features and data shown below are preview mode.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
    ...
    </div>
  );
  */
}


