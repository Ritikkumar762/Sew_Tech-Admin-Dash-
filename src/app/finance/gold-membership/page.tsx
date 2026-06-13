'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ExternalLink, 
  Wrench, 
  Package, 
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import styles from '../finance.module.css';

interface GoldMemberItem {
  id: string;
  customerName: string;
  customerId: string;
  activeSpares: boolean;
  activeMechanic: boolean;
  startDate: string;
  endDate: string;
  totalSavings: number;
  usageCount: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

const INITIAL_MEMBERS: GoldMemberItem[] = [
  {
    id: 'm1',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: true,
    activeMechanic: true,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Active'
  },
  {
    id: 'm2',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: true,
    activeMechanic: false,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Expiring Soon'
  },
  {
    id: 'm3',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: false,
    activeMechanic: true,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Expired'
  },
  {
    id: 'm4',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: true,
    activeMechanic: true,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Active'
  },
  {
    id: 'm5',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: true,
    activeMechanic: false,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Active'
  },
  {
    id: 'm6',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: false,
    activeMechanic: true,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Active'
  },
  {
    id: 'm7',
    customerName: 'Rajendra Kumar',
    customerId: 'CUST-88129',
    activeSpares: true,
    activeMechanic: true,
    startDate: "21 Jan '26",
    endDate: "21 Jan '26",
    totalSavings: 12000,
    usageCount: 10,
    status: 'Active'
  }
];

export default function GoldMembershipPage() {
  const [members, setMembers] = useState<GoldMemberItem[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddedOn, setSelectedAddedOn] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  // Close bulk menu dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setIsBulkMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selection handlers
  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = (filteredIds: string[]) => {
    setSelectedRowIds((prev) => {
      const allSelected = filteredIds.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        filteredIds.forEach(id => next.delete(id));
      } else {
        filteredIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Filter members list based on search query
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.customerName.toLowerCase().includes(query);
        const matchesId = m.customerId.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }
      return true;
    });
  }, [members, searchQuery]);

  // Bulk actions executions
  const executeBulkAction = (action: string) => {
    const ids = Array.from(selectedRowIds);
    if (ids.length === 0) {
      alert('Please select at least one customer row.');
      return;
    }

    setMembers((prev) => {
      return prev.map((m) => {
        if (!ids.includes(m.id)) return m;
        if (action === 'extend') {
          return { ...m, status: 'Active', endDate: "21 Jan '27" };
        }
        if (action === 'cancel') {
          return { ...m, status: 'Expired' };
        }
        return m;
      });
    });
    setSelectedRowIds(new Set());
    setIsBulkMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <PageHeader 
        title="Gold Membership" 
        subtitle="Finance • Gold Membership" 
        actions={
          <button className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Export</span>
            <Download size={15} />
          </button>
        } 
      />

      {/* Membership Stat Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Gold Members</div>
          <div className={styles.statValue}>1,200</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>New Memberships (L30D)</div>
          <div className={styles.statValue}>150</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Membership Revenue</div>
          <div className={styles.statValue}>₹1,00,000</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Membership Expiring Soon</div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>100</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Savings per Member</div>
          <div className={styles.statValue}>₹1,500 <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>/ Month</span></div>
        </div>
      </div>

      {/* Filters & Actions bar */}
      <div className={styles.filterBar}>
        {/* Search */}
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} size={16} />
          <input 
            type="text" 
            placeholder="Search by Customer Name/Transaction ID" 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Added On dropdown */}
        <select 
          className={styles.dropdownSelect}
          value={selectedAddedOn}
          onChange={(e) => setSelectedAddedOn(e.target.value)}
        >
          <option value="">Added on</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="12months">Last 12 Months</option>
        </select>

        {/* Datepicker Mock Icon Box */}
        <div className={styles.datePickerRange}>
          <Calendar size={15} />
          <span style={{ fontSize: '0.85rem' }}>DD/MM/YYYY - DD/MM/YYYY</span>
        </div>

        {/* Apply Filters (can link to sidebar or toggle popup) */}
        <button 
          className={styles.btnFilter}
          onClick={() => alert('Filtering options loaded... Please use the search bar for live customer matching.')}
        >
          <Filter size={15} />
          <span>Apply Filters</span>
        </button>

        {/* Bulk Actions Menu */}
        <div style={{ position: 'relative' }} ref={bulkMenuRef}>
          <button 
            className={styles.btnBulkActions}
            onClick={() => setIsBulkMenuOpen(!isBulkMenuOpen)}
          >
            <span>Bulk Actions</span>
            <ChevronDown size={15} />
          </button>
          {isBulkMenuOpen && (
            <div className={styles.bulkDropdownMenu}>
              <button className={styles.bulkDropdownItem} onClick={() => executeBulkAction('extend')}>Extend Membership</button>
              <button className={styles.bulkDropdownItem} onClick={() => executeBulkAction('cancel')}>Cancel Membership</button>
            </div>
          )}
        </div>
      </div>

      {/* Gold Members Table */}
      <div className={styles.tableContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={filteredMembers.length > 0 && filteredMembers.every(m => selectedRowIds.has(m.id))}
                  onChange={() => toggleSelectAll(filteredMembers.map(m => m.id))}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>Customer ID ⇅</th>
              <th>Active Modules ⇅</th>
              <th>Start Date ⇅</th>
              <th>End Date ⇅</th>
              <th>Total Savings ⇅</th>
              <th>Usage Count ⇅</th>
              <th>Status ⇅</th>
              <th>Action ⇅</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No members found matching your search.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedRowIds.has(m.id)}
                      onChange={() => toggleSelectRow(m.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td>
                    <div className={styles.counterpartyCell}>
                      <div className={styles.avatar}>
                        {m.customerName.split(' ')[0][0]}
                        {m.customerName.split(' ')[1]?.[0]}
                      </div>
                      <div className={styles.infoCol}>
                        <span className={styles.nameText}>{m.customerName}</span>
                        <span className={styles.dashedBadge}>{m.customerId}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* Active Modules Green & Red Badges */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      {m.activeSpares ? (
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                          }}
                          title="Spares Module Active"
                        >
                          <Package size={14} />
                        </span>
                      ) : (
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                          }}
                          title="Spares Module Inactive"
                        >
                          <Package size={14} />
                        </span>
                      )}
                      {m.activeMechanic ? (
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                          }}
                          title="Mechanic Module Active"
                        >
                          <Wrench size={14} />
                        </span>
                      ) : (
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#d1fae5',
                            color: '#10b981',
                          }}
                          title="Mechanic Module Inactive"
                        >
                          <Wrench size={14} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>{m.startDate}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>{m.endDate}</span>
                  </td>
                  <td>
                    <span className={`${styles.amountPill} ${styles.amountCredit}`} style={{ padding: '0.2rem 0.5rem', fontWeight: 700 }}>
                      ₹ {m.totalSavings.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{m.usageCount}</span>
                  </td>
                  <td>
                    {m.status === 'Active' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <CheckCircle size={12} />
                        Active
                      </span>
                    )}
                    {m.status === 'Expiring Soon' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <AlertTriangle size={12} />
                        Expiring Soon
                      </span>
                    )}
                    {m.status === 'Expired' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <XCircle size={12} />
                        Expired
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className={styles.btnRowAction}
                      onClick={() => alert(`Customer Details: ${m.customerName}\nMembership status: ${m.status}\nTotal Savings: ₹${m.totalSavings}`)}
                    >
                      <span>View</span>
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
