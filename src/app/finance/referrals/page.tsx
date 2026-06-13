'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Wrench,
  Package,
  Download,
  Calendar,
  CheckCircle,
  Edit2,
  Save,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import styles from '../finance.module.css';
import r from './referral.module.css';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface ReferralLedgerItem {
  id: string;
  referralId: string;
  referrerName: string;
  referrerId: string;
  refereeName: string;
  refereeId: string;
  moduleTrigger: 'mechanic' | 'spares';
  creditIssued: number;
  createdOn: string;
}

export interface ReferralConfig {
  referrerReward: string;
  refereeReward: string;
  eligibleModules: string;
  firstTransactionCondition: string;
  expiryDuration: string;
  expiryUnit: string;
}

// ─────────────────────────────────────────────────────────
// Mock data (replace with API calls for backend integration)
// ─────────────────────────────────────────────────────────

const INITIAL_LEDGER: ReferralLedgerItem[] = [
  { id: 'r1', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'mechanic', creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r2', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'spares',   creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r3', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'mechanic', creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r4', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'mechanic', creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r5', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'spares',   creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r6', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'mechanic', creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r7', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'spares',   creditIssued: 100, createdOn: "21 Jan '26" },
  { id: 'r8', referralId: 'SEW650', referrerName: 'Rajendra Kumar', referrerId: 'CUST-88129', refereeName: 'Rajendra Kumar', refereeId: 'CUST-88129', moduleTrigger: 'mechanic', creditIssued: 100, createdOn: "21 Jan '26" },
];

const INITIAL_CONFIG: ReferralConfig = {
  referrerReward: '',
  refereeReward: '',
  eligibleModules: '',
  firstTransactionCondition: '',
  expiryDuration: '30',
  expiryUnit: 'Days',
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export default function ReferralsPage() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'config'>('ledger');

  // ── Ledger state ──────────────────────────────────────
  const [ledger, setLedger] = useState<ReferralLedgerItem[]>(INITIAL_LEDGER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddedOn, setSelectedAddedOn] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  // ── Config state ──────────────────────────────────────
  const [config, setConfig] = useState<ReferralConfig>(INITIAL_CONFIG);
  const [isEditing, setIsEditing] = useState(false);
  const [draftConfig, setDraftConfig] = useState<ReferralConfig>(INITIAL_CONFIG);

  // ── Close bulk menu on outside click ─────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node)) {
        setIsBulkMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Selection helpers ─────────────────────────────────
  const toggleSelectRow = (id: string) =>
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = (ids: string[]) =>
    setSelectedRowIds(prev => {
      const allSelected = ids.every(id => prev.has(id));
      const next = new Set(prev);
      allSelected ? ids.forEach(id => next.delete(id)) : ids.forEach(id => next.add(id));
      return next;
    });

  // ── Filtered ledger ───────────────────────────────────
  const filteredLedger = useMemo(() => {
    if (!searchQuery.trim()) return ledger;
    const q = searchQuery.toLowerCase();
    return ledger.filter(
      item =>
        item.referralId.toLowerCase().includes(q) ||
        item.referrerName.toLowerCase().includes(q) ||
        item.refereeName.toLowerCase().includes(q)
    );
  }, [ledger, searchQuery]);

  // ── Config handlers ───────────────────────────────────
  const handleEditConfig = () => {
    setDraftConfig({ ...config });
    setIsEditing(true);
  };

  const handleSaveConfig = () => {
    // TODO: Call PATCH /api/referral-config with draftConfig
    setConfig({ ...draftConfig });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftConfig({ ...config });
    setIsEditing(false);
  };

  return (
    <div className={r.pageWrapper}>
      {/* ── Page Header ── */}
      <PageHeader
        title="Referrals"
        subtitle="Finance • Referrals"
        actions={
          <button className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Export</span>
            <Download size={15} />
          </button>
        }
      />

      {/* ── Stat Cards ── */}
      <div className={r.statsRow}>
        <div className={r.statCard}>
          <div className={r.statValue}>150</div>
          <div className={r.statLabel}>Referrals Generated</div>
        </div>
        <div className={r.statCard}>
          <div className={r.statValue}>100</div>
          <div className={r.statLabel}>Successful Referrals</div>
        </div>
        <div className={r.statCard}>
          <div className={r.statValue}>90</div>
          <div className={r.statLabel}>Wallet Credits Issued</div>
        </div>
        <div className={r.statCard}>
          <div className={r.statValue}>70</div>
          <div className={r.statLabel}>Wallet Credits Redeemed</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={r.tabBar}>
        <button
          className={`${r.tab} ${activeTab === 'ledger' ? r.tabActive : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          Referral Ledger
        </button>
        <button
          className={`${r.tab} ${activeTab === 'config' ? r.tabActive : ''}`}
          onClick={() => setActiveTab('config')}
        >
          Referral Configuration
        </button>
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {/*  TAB 1 — Referral Ledger                          */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === 'ledger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search by Code/ Discount Value"
                className={styles.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className={styles.dropdownSelect}
              value={selectedAddedOn}
              onChange={e => setSelectedAddedOn(e.target.value)}
            >
              <option value="">Added on</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Select Manually</option>
            </select>

            <div className={styles.datePickerRange}>
              <Calendar size={14} />
              <span style={{ fontSize: '0.85rem' }}>DD/MM/YYYY - DD/MM/YYYY</span>
            </div>

            <button className={styles.btnFilter}>
              <Filter size={15} />
              <span>Apply Filters</span>
            </button>

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
                  <button className={styles.bulkDropdownItem}>Mark as Completed</button>
                  <button className={styles.bulkDropdownItem}>Issue Credits</button>
                  <button className={styles.bulkDropdownItem} style={{ color: '#ef4444' }}>
                    Revoke Referral
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Ledger Table */}
          <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={
                        filteredLedger.length > 0 &&
                        filteredLedger.every(item => selectedRowIds.has(item.id))
                      }
                      onChange={() => toggleSelectAll(filteredLedger.map(item => item.id))}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>Referral ID ⇅</th>
                  <th>Referrer ID ⇅</th>
                  <th>Referee ID ⇅</th>
                  <th>Module Trigger ⇅</th>
                  <th>Credit Issued ⇅</th>
                  <th>Created on ⇅</th>
                  <th>Action ⇅</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No referrals found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map(item => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRowIds.has(item.id)}
                          onChange={() => toggleSelectRow(item.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      {/* Referral ID */}
                      <td>
                        <span className={styles.dashedBadge}>{item.referralId}</span>
                      </td>

                      {/* Referrer */}
                      <td>
                        <div className={r.personCell}>
                          <div className={r.avatar}>
                            {item.referrerName.charAt(0)}
                          </div>
                          <div className={r.personInfo}>
                            <span className={r.personName}>{item.referrerName}</span>
                            <span className={styles.dashedBadge}>{item.referrerId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Referee */}
                      <td>
                        <div className={r.personCell}>
                          <div className={r.avatar}>
                            {item.refereeName.charAt(0)}
                          </div>
                          <div className={r.personInfo}>
                            <span className={r.personName}>{item.refereeName}</span>
                            <span className={styles.dashedBadge}>{item.refereeId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Module Trigger */}
                      <td>
                        <span
                          className={`${r.moduleTrigger} ${
                            item.moduleTrigger === 'spares' ? '' : r.moduleTriggerGreen
                          }`}
                          title={
                            item.moduleTrigger === 'mechanic'
                              ? 'Sewtech Mechanic'
                              : 'Sewtech Spares'
                          }
                        >
                          {item.moduleTrigger === 'mechanic' ? (
                            <Wrench size={14} />
                          ) : (
                            <Package size={14} />
                          )}
                        </span>
                      </td>

                      {/* Credit Issued */}
                      <td>
                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>
                          {item.creditIssued}
                        </span>
                      </td>

                      {/* Created On */}
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                          {item.createdOn}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          className={styles.btnRowAction}
                          onClick={() =>
                            alert(
                              `Referral: ${item.referralId}\nReferrer: ${item.referrerName} (${item.referrerId})\nReferee: ${item.refereeName} (${item.refereeId})\nModule: ${item.moduleTrigger}\nCredit: ₹${item.creditIssued}`
                            )
                          }
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

      {/* ══════════════════════════════════════════════════ */}
      {/*  TAB 2 — Referral Configuration                   */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === 'config' && (
        <div className={r.configSection}>
          {/* Section Header */}
          <div className={r.configHeader}>
            <h2 className={r.configTitle}>Edit Details</h2>
            {!isEditing ? (
              <button className={r.editBtn} onClick={handleEditConfig}>
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className={r.editBtn}
                  onClick={handleCancelEdit}
                  style={{ color: '#ef4444', borderColor: '#fecaca' }}
                >
                  Cancel
                </button>
                <button className={r.saveBtn} onClick={handleSaveConfig}>
                  <CheckCircle size={14} />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          {/* Config Form — 2-column grid */}
          <div className={r.formGrid}>
            {/* Referrer Reward */}
            <div className={r.formGroup}>
              <label className={r.formLabel}>
                Referrer reward (wallet credit ₹) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className={r.formInput}
                disabled={!isEditing}
                value={isEditing ? draftConfig.referrerReward : config.referrerReward}
                onChange={e => setDraftConfig({ ...draftConfig, referrerReward: e.target.value })}
              />
            </div>

            {/* Referee Reward */}
            <div className={r.formGroup}>
              <label className={r.formLabel}>
                Referee reward (wallet credit ₹) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className={r.formInput}
                disabled={!isEditing}
                value={isEditing ? draftConfig.refereeReward : config.refereeReward}
                onChange={e => setDraftConfig({ ...draftConfig, refereeReward: e.target.value })}
              />
            </div>

            {/* Eligible Modules */}
            <div className={r.formGroup}>
              <label className={r.formLabel}>
                Eligible modules <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                className={r.formSelect}
                disabled={!isEditing}
                value={isEditing ? draftConfig.eligibleModules : config.eligibleModules}
                onChange={e => setDraftConfig({ ...draftConfig, eligibleModules: e.target.value })}
              >
                <option value="">Select Eligible modules</option>
                <option value="mechanic">Sewtech Mechanic</option>
                <option value="spares">Sewtech Spares</option>
                <option value="both">Both (Mechanic + Spares)</option>
              </select>
            </div>

            {/* First-transaction Condition */}
            <div className={r.formGroup}>
              <label className={r.formLabel}>
                First-transaction condition <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Discount Value"
                className={r.formInput}
                disabled={!isEditing}
                value={isEditing ? draftConfig.firstTransactionCondition : config.firstTransactionCondition}
                onChange={e =>
                  setDraftConfig({ ...draftConfig, firstTransactionCondition: e.target.value })
                }
              />
            </div>

            {/* Expiry Duration — full width */}
            <div className={`${r.formGroup}`}>
              <label className={r.formLabel}>
                Expiry duration <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className={r.expiryRow}>
                <input
                  type="number"
                  min="1"
                  className={r.expiryInput}
                  disabled={!isEditing}
                  value={isEditing ? draftConfig.expiryDuration : config.expiryDuration}
                  onChange={e =>
                    setDraftConfig({ ...draftConfig, expiryDuration: e.target.value })
                  }
                />
                <select
                  className={r.expiryUnitSelect}
                  disabled={!isEditing}
                  value={isEditing ? draftConfig.expiryUnit : config.expiryUnit}
                  onChange={e => setDraftConfig({ ...draftConfig, expiryUnit: e.target.value })}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
