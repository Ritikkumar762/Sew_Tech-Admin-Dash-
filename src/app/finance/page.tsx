'use client';

import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ExternalLink, 
  Wrench, 
  Package, 
  ArrowUpRight,
  Download
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useFinanceTransactions } from './_hooks/useFinanceTransactions';
import FiltersSidebar from './_components/FiltersSidebar';
import styles from './finance.module.css';

// Mock Data for Charts
const REVENUE_TREND_DATA = [
  { date: '1 Feb', revenue: 6000 },
  { date: '2 Feb', revenue: 5000 },
  { date: '3 Feb', revenue: 9000 },
  { date: '4 Feb', revenue: 9000 },
  { date: '5 Feb', revenue: 8000 },
  { date: '6 Feb', revenue: 7000 },
  { date: '7 Feb', revenue: 8000 },
];

const PROFIT_BREAKUP_DATA = [
  { name: 'ST Mechanics', value: 60000, label: '₹60,000' },
  { name: 'ST Spares', value: 40000, label: '₹40,000' },
];
const PROFIT_COLORS = ['#10b981', '#ef4444'];

// Design fixes the money axis at 0–10,000 in 1,000 steps; the ceiling grows if real data
// exceeds it so a spike is never silently clipped.
const MONEY_TICKS = Array.from({ length: 11 }, (_, i) => i * 1000);
const MONEY_DOMAIN = [0, (dataMax: number) => Math.max(10000, dataMax)] as const;
const AMOUNT_AXIS_LABEL = {
  value: 'Amount (In Rupees)',
  angle: -90,
  position: 'insideLeft' as const,
  offset: 12,
  style: { textAnchor: 'middle' as const, fontSize: 10, fill: '#64748b' },
};

const RADIAN = Math.PI / 180;

// Note: `paddingAngle` on a Pie suppresses its labels entirely in this recharts version,
// so the donuts get their segment gaps from a stroke in the panel colour instead.
// Ring labels as white pills, positioned geometrically off each slice's mid-angle.
const makeDonutLabel = (format: (value: number) => string) =>
  ({ cx, cy, midAngle, outerRadius, value }: any) => {
    const radius = outerRadius + 14;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (!Number(value)) return null;

    const text = format(Number(value));
    const pillW = text.length * 5.6 + 12;
    const pillH = 18;

    return (
      <g>
        <rect x={x - pillW / 2} y={y - pillH / 2 + 1} width={pillW} height={pillH} rx={5} fill="rgba(0,0,0,0.08)" />
        <rect x={x - pillW / 2} y={y - pillH / 2} width={pillW} height={pillH} rx={5} fill="#ffffff" stroke="#e5e7eb" strokeWidth={0.5} />
        <text x={x} y={y} fill="#1f2937" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '10px', fontWeight: 700 }}>
          {text}
        </text>
      </g>
    );
  };

const PERCENT_LABEL = makeDonutLabel((v) => `${v}%`);
const RUPEE_LABEL = makeDonutLabel((v) => `₹${v.toLocaleString('en-IN')}`);

// Light panel that sits behind the donut, legend and caption in the design.
const DONUT_PANEL: CSSProperties = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '0.75rem',
  width: '100%',
  boxSizing: 'border-box',
};

const NET_REVENUE_DATA = [
  { name: 'Instant Smart Booking', cashIn: 9000, refunds: 3000, payouts: 6000, netProfit: 4500 },
  { name: 'Assisted Booking', cashIn: 7500, refunds: 2000, payouts: 4000, netProfit: 3500 },
  { name: 'Invite Quotes', cashIn: 8000, refunds: 1500, payouts: 5000, netProfit: 4000 },
  { name: 'Video Assistance', cashIn: 6000, refunds: 1000, payouts: 3500, netProfit: 3000 },
  { name: 'Direct Booking', cashIn: 7000, refunds: 1800, payouts: 4500, netProfit: 3500 },
];

const TRANSACTION_INSIGHTS_DATA = [
  { name: 'Completed', value: 60 },
  { name: 'Failed', value: 20 },
  { name: 'Pending', value: 20 },
];
const INSIGHTS_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function FinanceOverviewPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  const {
    transactions,
    searchQuery,
    setSearchQuery,
    selectedCreatedOn,
    setSelectedCreatedOn,
    filters,
    setFilters,
    clearFilters,
    selectedRowIds,
    toggleSelectRow,
    toggleSelectAll,
    executeBulkAction
  } = useFinanceTransactions();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setIsBulkMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute stat totals dynamically if desired, or keep as static mockup representations
  const totalRevenueVal = 100000;
  const paymentsSuccessVal = 150;
  const paymentsPendingVal = 15;
  const creditsIssuedVal = 15000;
  const refundsInitiatedVal = "3 Days";

  // Recharts Custom Tooltip for Net Revenue
  const CustomNetRevenueTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltipBox}>
          <div className={styles.tooltipTitle}>1 Feb 2026</div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Total Revenue:</span>
            <span className={styles.tooltipValue}>₹1,00,000</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Payout:</span>
            <span className={styles.tooltipValue}>₹20,000</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Refunds:</span>
            <span className={styles.tooltipValue}>₹20,000</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Invite Quotes:</span>
            <span className={styles.tooltipValue}>₹20,000</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Video Assistance:</span>
            <span className={styles.tooltipValue}>₹20,000</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Direct Booking:</span>
            <span className={styles.tooltipValue}>₹20,000</span>
          </div>
          <a className={styles.tooltipLink} onClick={(e) => { e.preventDefault(); alert('Redirecting to bookings details...'); }}>View Requests</a>
        </div>
      );
    }
    return null;
  };

  const handleBulkAction = (action: string) => {
    executeBulkAction(action);
    setIsBulkMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <PageHeader 
        title="Finance Overview" 
        subtitle="Finance • Overview" 
        actions={
          <button className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Export</span>
            <Download size={15} />
          </button>
        } 
      />

      {/* Summary Cards Panel */}
      <div className={styles.statsRow}>
        {/* Total Revenue */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Revenue (L 7D)</div>
          <div className={styles.statValue}>
            ₹{totalRevenueVal.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Payments Successful */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Payments Successful</div>
          <div className={styles.statValue}>{paymentsSuccessVal}</div>
        </div>

        {/* Payments Pending */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>Payments Pending</span>
            <span className={styles.statLinkIcon} title="View Pending Payments"><ArrowUpRight size={14} /></span>
          </div>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>
            {paymentsPendingVal}
          </div>
        </div>

        {/* Credits Issued */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>Credits Issued</span>
            <span className={styles.statLinkIcon} title="View Credits"><ArrowUpRight size={14} /></span>
          </div>
          <div className={styles.statValue}>
            {creditsIssuedVal.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Refunds Initiated */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Refunds Initiated</div>
          <div className={styles.statValue}>{refundsInitiatedVal}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabBar}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'transactions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          All Transactions
        </button>
      </div>

      {/* Tabs Content */}
      {activeTab === 'overview' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Charts Row 1 */}
          <div className={styles.chartsGrid}>
            {/* Revenue Trend Area Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Revenue Trend</h3>
                <span style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></span>
                  Revenue
                </span>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
                  <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis
                      label={AMOUNT_AXIS_LABEL}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      domain={MONEY_DOMAIN}
                      ticks={MONEY_TICKS}
                      interval={0}
                      tickFormatter={(v) => Number(v).toLocaleString('en-IN')}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} 
                      formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 4, stroke: '#f97316', strokeWidth: 2, fill: '#ffffff' }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profit Breakup Pie/Donut Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Profit Breakup</h3>
              </div>
              <div style={DONUT_PANEL}>
              <div className={styles.chartContainer} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PROFIT_BREAKUP_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      stroke="#f8fafc"
                      strokeWidth={3}
                      label={RUPEE_LABEL}
                      labelLine={false}
                    >
                      {PROFIT_BREAKUP_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFIT_COLORS[index % PROFIT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => `₹${Number(val || 0).toLocaleString('en-IN')}`} 
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    {/* Amounts live on the ring pills in the design, not in the legend */}
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, right: 10 }}
                      formatter={(value) => <span style={{ color: '#475569', fontWeight: 500 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Donut Center Text */}
                <div style={{
                  position: 'absolute',
                  left: '37.5%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>₹1,00,000</div>
                </div>
              </div>
              <div className={styles.chartCaption}>
                ST Mechanics Profit - 75%
              </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className={styles.chartsGrid}>
            {/* Net Revenue Bar Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Net Revenue</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
                  <BarChart data={NET_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 9, fill: '#64748b' }} />
                    <YAxis
                      label={AMOUNT_AXIS_LABEL}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      domain={MONEY_DOMAIN}
                      ticks={MONEY_TICKS}
                      interval={0}
                      tickFormatter={(v) => Number(v).toLocaleString('en-IN')}
                    />
                    <Tooltip content={<CustomNetRevenueTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      iconSize={6}
                      wrapperStyle={{ fontSize: 10, paddingBottom: 10 }}
                    />
                    <Bar dataKey="cashIn" name="Total Cash-in" fill="#2563eb" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="refunds" name="Refunds" fill="#ef4444" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="payouts" name="Payouts" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction Insights Pie Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Transaction Insights</h3>
              </div>
              <div style={DONUT_PANEL}>
              <div className={styles.chartContainer} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TRANSACTION_INSIGHTS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      stroke="#f8fafc"
                      strokeWidth={3}
                      label={PERCENT_LABEL}
                      labelLine={false}
                    >
                      {TRANSACTION_INSIGHTS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={INSIGHTS_COLORS[index % INSIGHTS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => `${val || 0}%`} 
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right" 
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, right: 10 }}
                      formatter={(value, entry: any) => {
                        const item = TRANSACTION_INSIGHTS_DATA.find(d => d.name === value);
                        return <span style={{ color: '#475569', fontWeight: 500 }}>{value}</span>;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Donut Center Text */}
                <div style={{
                  position: 'absolute',
                  left: '37.5%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>400</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Orders</div>
                </div>
              </div>
              <div className={styles.chartCaption}>
                Payment Success Rate - 75%
              </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* All Transactions Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          {/* Filters Control Bar */}
          <div className={styles.filterBar}>
            {/* Search Input */}
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input 
                type="text" 
                placeholder="Search by Counterparty Name/Transaction ID" 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Created On Dropdown */}
            <select 
              className={styles.dropdownSelect}
              value={selectedCreatedOn}
              onChange={(e) => setSelectedCreatedOn(e.target.value)}
            >
              <option value="">Created on</option>
              <option value="7days">Last 7 Days</option>
              <option value="14days">Last 14 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="custom">Select Manually</option>
            </select>

            {/* Calendar Indicator Icon Box */}
            <div className={styles.datePickerRange}>
              <Calendar size={15} />
              <span style={{ fontSize: '0.85rem' }}>
                {filters.createdOn === 'custom' && (filters.customDateStart || filters.customDateEnd)
                  ? `${filters.customDateStart || 'Start'} - ${filters.customDateEnd || 'End'}`
                  : 'DD/MM/YYYY - DD/MM/YYYY'}
              </span>
            </div>

            {/* Apply Filters Trigger */}
            <button 
              className={styles.btnFilter}
              onClick={() => setIsFilterSidebarOpen(true)}
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
                  <button className={styles.bulkDropdownItem} onClick={() => handleBulkAction('download')}>Download Invoice</button>
                  <button className={styles.bulkDropdownItem} onClick={() => handleBulkAction('retry')}>Retry Failed Payments</button>
                  <button className={styles.bulkDropdownItem} onClick={() => handleBulkAction('force-success')}>Force Mark as Successful</button>
                  <button className={styles.bulkDropdownItem} onClick={() => handleBulkAction('force-failed')}>Force Mark as Failed</button>
                  <button className={styles.bulkDropdownItem} onClick={() => handleBulkAction('reverse')}>Reverse Transactions</button>
                  <button className={styles.bulkDropdownItem} onClick={() => handleBulkAction('refund')}>Bulk Refund</button>
                </div>
              )}
            </div>
          </div>

          {/* Transactions Table */}
          <div className={styles.tableContainer}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={transactions.length > 0 && transactions.every(t => selectedRowIds.has(t.id))}
                      onChange={() => toggleSelectAll(transactions.map(t => t.id))}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>Counterparty ⇅</th>
                  <th>Module ⇅</th>
                  <th>Transaction ID ⇅</th>
                  <th>Related Entity ID ⇅</th>
                  <th>Amount ⇅</th>
                  <th>Date ⇅</th>
                  <th>Payment Status ⇅</th>
                  <th>Action ⇅</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No transactions found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <input 
                          type="checkbox"
                          checked={selectedRowIds.has(t.id)}
                          onChange={() => toggleSelectRow(t.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <div className={styles.counterpartyCell}>
                          <div className={styles.avatar}>
                            {t.counterpartyName.charAt(0)}
                          </div>
                          <div className={styles.infoCol}>
                            <span className={styles.nameText}>{t.counterpartyName}</span>
                            <span className={styles.dashedBadge}>{t.counterpartyId}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {t.module === 'mechanic' ? (
                          <span className={`${styles.moduleBadge} ${styles.moduleMechanic}`}>
                            <Wrench size={12} />
                            <span>mechanic</span>
                          </span>
                        ) : (
                          <span className={`${styles.moduleBadge} ${styles.moduleSpares}`}>
                            <Package size={12} />
                            <span>spares</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={styles.dashedBadge}>{t.transactionId}</span>
                      </td>
                      <td>
                        <span className={styles.dashedBadge}>{t.relatedEntity}</span>
                      </td>
                      <td>
                        <span className={`${styles.amountPill} ${t.module === 'mechanic' ? styles.amountCredit : styles.amountDebit}`}>
                          <span className={`${styles.amountDot} ${t.module === 'mechanic' ? styles.amountDotCredit : styles.amountDotDebit}`}></span>
                          ₹ {t.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>{t.date}</span>
                      </td>
                      <td>
                        <span className={`${styles.statusText} ${
                          t.status === 'Completed' ? styles.statusCompleted : 
                          t.status === 'Failed' ? styles.statusFailed : 
                          styles.statusPending
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={styles.btnRowAction}
                          onClick={() => alert(`Details for Transaction: ${t.transactionId}\nCounterparty: ${t.counterpartyName}\nAmount: ₹${t.amount}`)}
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
      )}

      {/* Slideout filters sidebar drawer */}
      <FiltersSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
      />
    </div>
  );
}
