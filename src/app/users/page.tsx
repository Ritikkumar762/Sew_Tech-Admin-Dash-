'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from './_hooks/useUsers';
import Image from 'next/image';
import { User } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import styles from './page.module.css';
import { 
  Search, 
  Copy, 
  Plus, 
  ExternalLink, 
  MoreVertical,
  Calendar,
  ChevronDown,
  Check,
  Filter,
  SlidersHorizontal,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [addedOnFilter, setAddedOnFilter] = useState('All Time');
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { users, totalCount, newUsersCount, activeUsersCount, loading, error, updateStatus } = useUsers({
    page: currentPage,
    pageSize: rowsPerPage,
    search: activeSearch
  });

  // ── Role Color Map ──────────────────────────────────────────
  const getRoleStyle = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('customer')) {
      return { bg: '#e0e7ff', text: '#3b82f6' }; // Light blue
    } else if (r.includes('mechanic admin')) {
      return { bg: '#fae8ff', text: '#d946ef' }; // Orchid/Magenta
    } else if (r.includes('mechanic')) {
      return { bg: '#d1fae5', text: '#10b981' }; // Light green
    } else if (r.includes('kaarigar admin')) {
      return { bg: '#ede9fe', text: '#8b5cf6' }; // Light violet
    } else if (r.includes('kaarigar')) {
      return { bg: '#e0f2fe', text: '#0284c7' }; // Teal/Mint
    } else if (r.includes('audit')) {
      return { bg: '#fef3c7', text: '#d97706' }; // Amber/Yellow
    } else if (r.includes('super-admin') || r.includes('super admin')) {
      return { bg: '#ffe4e6', text: '#ef4444' }; // Light red/salmon
    } else if (r.includes('spares admin') || r.includes('spare admin')) {
      return { bg: '#f3e8ff', text: '#a855f7' }; // Lavender
    } else if (r.includes('academic admin')) {
      return { bg: '#fdf2f8', text: '#ec4899' }; // Soft pink
    } else if (r.includes('exchange admin')) {
      return { bg: '#f5f3ff', text: '#7c3aed' }; // Soft purple
    }
    return { bg: '#f1f5f9', text: '#64748b' };
  };

  // ── Handlers ────────────────────────────────────────────────
  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredAndSortedUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleApplyFilters = () => {
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleStatusChange = (id: string, status: User['status']) => {
    updateStatus(id, status);
    setActiveMenuId(null);
  };

  // ── Filter and Sort Logic ────────────────────────────────────
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Format lifetime value for sorting (remove currency symbol)
        if (sortField === 'lifetimeValue') {
          const numA = parseFloat((valA as string).replace(/[^\d]/g, '')) || 0;
          const numB = parseFloat((valB as string).replace(/[^\d]/g, '')) || 0;
          valA = numA as any;
          valB = numB as any;
        }

        if (valA === undefined) return 1;
        if (valB === undefined) return -1;

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, sortField, sortDirection]);

  // ── Pagination calculations ──────────────────────────────────
  const totalRows = totalCount;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedUsers = filteredAndSortedUsers; // API already paginates
  const startIndex = (currentPage - 1) * rowsPerPage;

  return (
    <div className={styles.container}>
      <PageHeader 
        title="User Management" 
        subtitle="User Management" 
        actions={
          <button 
            className="btn btn-dark" 
            onClick={() => router.push('/users/add')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
          >
            Add New User <PlusCircle size={16} />
          </button>
        } 
      />

      {/* ── Stats Strip ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src="/avatar-clean.svg" alt="User Icon" width={28} height={28} />
            </div>
            <span>Total Registered Users</span>
          </div>
          <div className={styles.statValue}>{loading ? '—' : totalCount.toLocaleString('en-IN')}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src="/avatar-clean.svg" alt="User Icon" width={28} height={28} />
            </div>
            <span>New Users (L 7D)</span>
            <span className={styles.statTrend} style={{ background: 'transparent', padding: 0 }}>
              <Image src="/green_up _logo.svg" alt="Trend Up" width={10} height={10} style={{ marginRight: '4px' }} /> 5% (L7D)
            </span>
          </div>
          <div className={styles.statValue}>{loading ? '—' : (newUsersCount ?? 0).toLocaleString('en-IN')}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIconBlueStar}>
              <Star size={14} fill="currentColor" />
            </div>
            <span>Active Users (30D)</span>
          </div>
          <div className={styles.statValue}>{loading ? '—' : (activeUsersCount ?? 0).toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={16} />
            <input 
              type="text" 
              placeholder="Search by User Name" 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>

          <div className={styles.dateFilterWrapper}>
            <select 
              className={styles.dateSelect}
              value={addedOnFilter}
              onChange={(e) => setAddedOnFilter(e.target.value)}
            >
              <option value="All Time">Added on</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
            </select>
            <button className={styles.calendarBtn} aria-label="Choose date">
              <Calendar size={16} />
            </button>
          </div>

          <button className={styles.applyFiltersBtn} onClick={handleApplyFilters}>
            Apply Filters <SlidersHorizontal size={14} />
          </button>
        </div>

        <div className={styles.bulkActionsDropdown}>
          <button className={styles.bulkBtn}>
            Bulk Actions <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className={styles.tableCard}>
        {loading && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Users...</div>}
        {error && <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>}

        {!loading && !error && (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      onChange={handleSelectAll}
                      checked={paginatedUsers.length > 0 && selectedIds.length === paginatedUsers.length}
                    />
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('name')}>
                      Name <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('role')}>
                      Role <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('phone')}>
                      Phone Number <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('location')}>
                      Location <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('lastLogin')}>
                      Last Login <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('lifetimeValue')}>
                      Lifetime Value <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.thContent} onClick={() => handleSort('status')}>
                      Status <span className={styles.sortArrow}>⇅</span>
                    </div>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No users match your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => {
                    const isSelected = selectedIds.includes(user.id);
                    const roleStyle = getRoleStyle(user.role);
                    // Match copying ID label to role
                    let idLabel = `Customer ID ${user.id}`;
                    if (user.role.toLowerCase().includes('mechanic')) idLabel = `Mechanic ID ${user.id}`;
                    else if (user.role.toLowerCase().includes('kaarigar')) idLabel = `Kaarigar ID ${user.id}`;
                    else if (user.role.toLowerCase().includes('admin')) idLabel = `Admin ID ${user.id}`;
                    else if (user.role.toLowerCase().includes('audit')) idLabel = `Audit ID ${user.id}`;
                    else if (user.role.toLowerCase().includes('seller')) idLabel = `Seller ID ${user.id}`;

                    return (
                      <tr 
                        key={user.id} 
                        style={{ 
                          ...(isSelected ? { backgroundColor: '#f0f7ff' } : {}),
                          position: 'relative',
                          zIndex: activeMenuId === user.id ? 10 : 1
                        }}
                      >
                        <td>
                          <input 
                            type="checkbox" 
                            className={styles.checkbox}
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(user.id, e)}
                          />
                        </td>
                        <td>
                          <div className={styles.nameCell}>
                            <div className={styles.avatar}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={styles.nameInfo}>
                              <span 
                                className={styles.nameLink}
                                onClick={() => router.push(`/users/${user.id}`)}
                              >
                                {user.name}
                              </span>
                              <div 
                                className={`${styles.copyIdBadge} ${copiedId === user.id ? styles.copySuccess : ''}`}
                                onClick={(e) => handleCopy(user.id, e)}
                                title="Click to copy ID"
                              >
                                {copiedId === user.id ? (
                                  <>Copied! <Check size={10} /></>
                                ) : (
                                  <>{idLabel} <Copy size={10} /></>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span 
                            className={styles.roleBadge}
                            style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{user.phone}</td>
                        <td>{user.location}</td>
                        <td>{user.lastLogin}</td>
                        <td>{user.lifetimeValue}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${
                            user.status === 'Active' ? styles.statusActive :
                            user.status === 'Inactive' ? styles.statusInactive :
                            styles.statusSuspended
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionCell}>
                            <button 
                              className={styles.viewBtn}
                              onClick={() => router.push(`/users/${user.id}`)}
                            >
                              View <ExternalLink size={12} />
                            </button>
                            
                            <div className={styles.moreMenuWrapper} style={{ zIndex: activeMenuId === user.id ? 10 : 1 }}>
                              <button 
                                className={styles.moreBtn}
                                onClick={(e) => toggleMenu(user.id, e)}
                                aria-label="Toggle user actions menu"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              {activeMenuId === user.id && (
                                <div className={styles.dropdownMenu}>
                                  <button 
                                    className={styles.dropdownItem} 
                                    onClick={() => handleStatusChange(user.id, 'Active')}
                                  >
                                    Set Active
                                  </button>
                                  <button 
                                    className={styles.dropdownItem} 
                                    onClick={() => handleStatusChange(user.id, 'Inactive')}
                                  >
                                    Set Inactive
                                  </button>
                                  <button 
                                    className={styles.dropdownItem} 
                                    onClick={() => handleStatusChange(user.id, 'Suspended')}
                                    style={{ color: '#ef4444' }}
                                  >
                                    Suspend
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && (
          <div className={styles.pagination}>
            <div className={styles.paginationSection}>
              <span>Rows per page:</span>
              <select 
                className={styles.pageSelect}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 600 }}
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <div>
              {startIndex + 1}–{Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
            </div>

            <div className={styles.pageArrows}>
              <button 
                className={styles.arrowBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className={styles.arrowBtn}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
