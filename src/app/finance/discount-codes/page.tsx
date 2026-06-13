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
  X,
  Calendar,
  Plus,
  ArrowLeft,
  ChevronUp,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import styles from '../finance.module.css';
import dc from './discount.module.css';

interface CouponItem {
  id: string;
  couponId: string;
  discountValue: number;
  discountType: 'Flat' | 'Percentage';
  discountLabel: string;
  maxCap: number;
  applicableMechanic: boolean;
  applicableSpares: boolean;
  validFrom: string;
  validTo: string;
  usageCount: number;
  usageLimit: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_COUPONS: CouponItem[] = [
  { id: 'c1', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: true, applicableSpares: true, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
  { id: 'c2', couponId: 'SEW650', discountValue: 100, discountType: 'Flat', discountLabel: 'Flat ₹100', maxCap: 100, applicableMechanic: false, applicableSpares: true, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
  { id: 'c3', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: true, applicableSpares: false, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
  { id: 'c4', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: true, applicableSpares: true, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
  { id: 'c5', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: true, applicableSpares: true, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Inactive' },
  { id: 'c6', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: false, applicableSpares: true, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
  { id: 'c7', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: true, applicableSpares: false, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
  { id: 'c8', couponId: 'SEW650', discountValue: 50, discountType: 'Flat', discountLabel: 'Flat 50%', maxCap: 1500, applicableMechanic: true, applicableSpares: true, validFrom: "21 Jan '26", validTo: "21 Feb '26", usageCount: 10, usageLimit: 500, status: 'Active' },
];

interface EditForm {
  couponCode: string;
  discountType: string;
  discountValue: string;
  startDateTime: string;
  endDateTime: string;
  usageLimitEnabled: boolean;
  usageLimitCondition: string;
  usageLimitValue: string;
  applicationEnabled: boolean;
  applicationCriteria: string;
}

interface Filters {
  discountType: { fixed: boolean; percentage: boolean };
  validity: string;
  customStart: string;
  customEnd: string;
}

export default function DiscountCodesPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddedOn, setSelectedAddedOn] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [isDiscountTypeOpen, setIsDiscountTypeOpen] = useState(true);
  const [isValidityOpen, setIsValidityOpen] = useState(true);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  const [editForm, setEditForm] = useState<EditForm>({
    couponCode: '',
    discountType: '',
    discountValue: '',
    startDateTime: '28.02.2026, 01:00-02:00 PM',
    endDateTime: '28.02.2026, 01:00-02:00 PM',
    usageLimitEnabled: true,
    usageLimitCondition: 'More than',
    usageLimitValue: '₹ 1,500',
    applicationEnabled: true,
    applicationCriteria: 'Cart Value > ₹1,500',
  });

  const [filters, setFilters] = useState<Filters>({
    discountType: { fixed: false, percentage: false },
    validity: '',
    customStart: '',
    customEnd: '',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setIsBulkMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openEditView = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setEditForm({
      couponCode: coupon.couponId,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      startDateTime: '28.02.2026, 01:00-02:00 PM',
      endDateTime: '28.02.2026, 01:00-02:00 PM',
      usageLimitEnabled: true,
      usageLimitCondition: 'More than',
      usageLimitValue: '₹ 1,500',
      applicationEnabled: true,
      applicationCriteria: 'Cart Value > ₹1,500',
    });
  };

  const closeEditView = () => setEditingCoupon(null);

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (ids: string[]) => {
    setSelectedRowIds(prev => {
      const allSelected = ids.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.couponId.toLowerCase().includes(q) || c.discountLabel.toLowerCase().includes(q);
      }
      return true;
    });
  }, [coupons, searchQuery]);

  const activeCount = coupons.filter(c => c.status === 'Active').length;

  return (
    <div className={dc.pageWrapper}>
      {/* Header */}
      <PageHeader
        title="Discount Codes"
        subtitle="Finance • Discount Codes"
        actions={
          <button className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Export</span>
            <Download size={15} />
          </button>
        }
      />

      {/* Stat Cards */}
      <div className={dc.statsRow}>
        <div className={dc.statCard}>
          <div className={dc.statDot} style={{ background: '#10b981' }} />
          <div className={dc.statInfo}>
            <div className={dc.statLabel}>Active Discount Codes</div>
            <div className={dc.statValue}>{activeCount}</div>
          </div>
        </div>
        <div className={dc.statCard}>
          <div className={dc.statDot} style={{ background: '#f97316' }} />
          <div className={dc.statInfo}>
            <div className={dc.statLabel}>Discount Usage Today</div>
            <div className={dc.statValue}>₹15,000</div>
          </div>
        </div>
        <div className={dc.statCard}>
          <div className={dc.statDot} style={{ background: '#10b981' }} />
          <div className={dc.statInfo}>
            <div className={dc.statLabel}>High-Usage Codes</div>
            <div className={dc.statValue}>SEW650</div>
          </div>
        </div>
        <div className={dc.statCard}>
          <div className={dc.statDot} style={{ background: '#ef4444' }} />
          <div className={dc.statInfo}>
            <div className={dc.statLabel}>Failed / Invalid Attempts</div>
            <div className={dc.statValue}>100</div>
          </div>
        </div>
      </div>

      {/* — Table View (when no coupon is selected) — */}
      {!editingCoupon && (
        <>
          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search by Code/ Discount Value"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select className={styles.dropdownSelect} value={selectedAddedOn} onChange={(e) => setSelectedAddedOn(e.target.value)}>
              <option value="">Added on</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom</option>
            </select>

            <div className={styles.datePickerRange}>
              <Calendar size={14} />
              <span style={{ fontSize: '0.85rem' }}>DD/MM/YYYY - DD/MM/YYYY</span>
            </div>

            <button className={styles.btnFilter} onClick={() => setIsFilterOpen(true)}>
              <Filter size={15} />
              <span>Apply Filters</span>
            </button>

            <div style={{ position: 'relative' }} ref={bulkMenuRef}>
              <button className={styles.btnBulkActions} onClick={() => setIsBulkMenuOpen(!isBulkMenuOpen)}>
                <span>Bulk Actions</span>
                <ChevronDown size={15} />
              </button>
              {isBulkMenuOpen && (
                <div className={styles.bulkDropdownMenu}>
                  <button className={styles.bulkDropdownItem}>Activate Selected</button>
                  <button className={styles.bulkDropdownItem}>Deactivate Selected</button>
                  <button className={styles.bulkDropdownItem} style={{ color: '#ef4444' }}>Delete Selected</button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={filteredCoupons.length > 0 && filteredCoupons.every(c => selectedRowIds.has(c.id))}
                      onChange={() => toggleSelectAll(filteredCoupons.map(c => c.id))}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>Customer ID ⇅</th>
                  <th>Discount Value ⇅</th>
                  <th>Max Cap ⇅</th>
                  <th>Applicable Modules ⇅</th>
                  <th>Validity Period ⇅</th>
                  <th>Usage Count ⇅</th>
                  <th>Usage Limit ⇅</th>
                  <th>Action ⇅</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No discount codes found.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => (
                    <tr key={c.id} className={selectedRowIds.has(c.id) ? dc.selectedRow : ''}>
                      <td>
                        <input type="checkbox" checked={selectedRowIds.has(c.id)} onChange={() => toggleSelectRow(c.id)} style={{ cursor: 'pointer' }} />
                      </td>
                      <td>
                        <span className={styles.dashedBadge}>{c.couponId}</span>
                      </td>
                      <td>
                        <span className={dc.discountPill}>{c.discountLabel}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                          ₹{c.maxCap.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c.applicableSpares ? '#ef4444' : '#fee2e2', color: '#ffffff', cursor: 'default' }}
                            title={c.applicableSpares ? 'Spares: Active' : 'Spares: Inactive'}
                          >
                            <Package size={13} />
                          </span>
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c.applicableMechanic ? '#10b981' : '#d1fae5', color: '#ffffff', cursor: 'default' }}
                            title={c.applicableMechanic ? 'Mechanic: Active' : 'Mechanic: Inactive'}
                          >
                            <Wrench size={13} />
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{c.validFrom} - {c.validTo}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{c.usageCount}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#374151' }}>{c.usageLimit} Users</span>
                      </td>
                      <td>
                        <button className={styles.btnRowAction} onClick={() => openEditView(c)}>
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
        </>
      )}

      {/* — Detail / Edit View (when coupon is selected) — */}
      {editingCoupon && (
        <div className={dc.detailWrapper}>
          {/* Left: Coupon Preview */}
          <div className={dc.couponPreviewPanel}>
            <div className={dc.previewTitle}>Coupon Preview</div>
            <div className={dc.couponCard}>
              <div className={dc.couponCardTitle}>Coupon Code</div>
              <div className={dc.couponAmount}>
                ₹{editingCoupon.maxCap.toLocaleString('en-IN')}
              </div>
              <div className={dc.couponTypeTag}>Fixed Discount</div>
              <div className={dc.couponDivider} />
              <div className={dc.couponValidLabel}>Valid From</div>
              <div className={dc.couponValidDates}>
                {editingCoupon.validFrom} - {editingCoupon.validTo}
              </div>
            </div>
          </div>

          {/* Right: Edit Details */}
          <div className={dc.editDetailsPanel}>
            <div className={dc.editTitle}>Edit Details</div>

            {/* Coupon Code */}
            <div className={dc.formGroup}>
              <label className={dc.formLabel}>Coupon Code <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className={dc.formInput}
                value={editForm.couponCode}
                onChange={(e) => setEditForm({ ...editForm, couponCode: e.target.value })}
              />
            </div>

            {/* Discount Type */}
            <div className={dc.formGroup}>
              <label className={dc.formLabel}>Discount Type <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                className={dc.formSelect}
                value={editForm.discountType}
                onChange={(e) => setEditForm({ ...editForm, discountType: e.target.value })}
              >
                <option value="">Select Discount Type</option>
                <option value="Flat">Flat Amount</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>

            {/* Discount Value */}
            <div className={dc.formGroup}>
              <label className={dc.formLabel}>Discount Value <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                placeholder="Enter Discount Value"
                className={dc.formInput}
                value={editForm.discountValue}
                onChange={(e) => setEditForm({ ...editForm, discountValue: e.target.value })}
              />
            </div>

            {/* Start & End Date */}
            <div className={dc.formRow}>
              <div className={dc.formGroup} style={{ marginBottom: 0 }}>
                <label className={dc.formLabel}>Start Date & Time <span style={{ color: '#ef4444' }}>*</span></label>
                <div className={dc.dateInputWrapper}>
                  <input
                    type="text"
                    className={dc.formInput}
                    value={editForm.startDateTime}
                    onChange={(e) => setEditForm({ ...editForm, startDateTime: e.target.value })}
                  />
                  <Calendar size={15} className={dc.dateInputIcon} />
                </div>
              </div>
              <div className={dc.formGroup} style={{ marginBottom: 0 }}>
                <label className={dc.formLabel}>End Date & Time <span style={{ color: '#ef4444' }}>*</span></label>
                <div className={dc.dateInputWrapper}>
                  <input
                    type="text"
                    className={dc.formInput}
                    value={editForm.endDateTime}
                    onChange={(e) => setEditForm({ ...editForm, endDateTime: e.target.value })}
                  />
                  <Calendar size={15} className={dc.dateInputIcon} />
                </div>
              </div>
            </div>

            {/* Usage Limit Toggle */}
            <div className={dc.toggleRow} style={{ marginTop: '1rem' }}>
              <button
                className={`${dc.toggleSwitch} ${editForm.usageLimitEnabled ? dc.toggleOn : ''}`}
                onClick={() => setEditForm({ ...editForm, usageLimitEnabled: !editForm.usageLimitEnabled })}
              >
                <span className={dc.toggleThumb} />
              </button>
              <span className={dc.toggleLabel}>Set Usage Limit</span>
            </div>

            {editForm.usageLimitEnabled && (
              <div className={dc.formGroup}>
                <label className={dc.formLabel}>Enter Usage Limit <span style={{ color: '#ef4444' }}>*</span></label>
                <div className={dc.inlineLimitRow}>
                  <select
                    className={dc.formSelect}
                    value={editForm.usageLimitCondition}
                    onChange={(e) => setEditForm({ ...editForm, usageLimitCondition: e.target.value })}
                    style={{ width: '130px' }}
                  >
                    <option value="More than">More than</option>
                    <option value="Less than">Less than</option>
                    <option value="Equal to">Equal to</option>
                  </select>
                  <input
                    type="text"
                    className={dc.formInput}
                    value={editForm.usageLimitValue}
                    onChange={(e) => setEditForm({ ...editForm, usageLimitValue: e.target.value })}
                    placeholder="₹ 1,500"
                  />
                </div>
              </div>
            )}

            {/* Application Criteria Toggle */}
            <div className={dc.toggleRow}>
              <button
                className={`${dc.toggleSwitch} ${editForm.applicationEnabled ? dc.toggleOn : ''}`}
                onClick={() => setEditForm({ ...editForm, applicationEnabled: !editForm.applicationEnabled })}
              >
                <span className={dc.toggleThumb} />
              </button>
              <span className={dc.toggleLabel}>Set Application Criteria</span>
            </div>

            {editForm.applicationEnabled && (
              <div className={dc.formGroup}>
                <label className={dc.formLabel}>Select Application Criteria <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  className={dc.formSelect}
                  value={editForm.applicationCriteria}
                  onChange={(e) => setEditForm({ ...editForm, applicationCriteria: e.target.value })}
                >
                  <option value="Cart Value > ₹1,500">Cart Value &gt; ₹1,500</option>
                  <option value="Cart Value > ₹500">Cart Value &gt; ₹500</option>
                  <option value="First Order">First Order</option>
                  <option value="Gold Member">Gold Member</option>
                </select>
              </div>
            )}

            <button className={dc.addCriteriaBtn}>
              <Plus size={14} />
              <span>Add Criteria</span>
            </button>

            {/* Footer Actions */}
            <div className={dc.detailFooter}>
              <button className={dc.cancelBtn} onClick={closeEditView}>Cancel</button>
              <button className={dc.saveBtn}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* — Filters Sidebar — */}
      {isFilterOpen && (
        <>
          <div className={dc.filterBackdrop} onClick={() => setIsFilterOpen(false)} />
          <div className={dc.filterSidebar}>
            <div className={dc.filterHeader}>
              <span className={dc.filterHeaderTitle}>Filters</span>
              <button className={dc.filterCloseBtn} onClick={() => setIsFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className={dc.filterBody}>
              {/* Discount Type */}
              <div className={dc.filterSection}>
                <div className={dc.filterSectionHeader} onClick={() => setIsDiscountTypeOpen(!isDiscountTypeOpen)}>
                  <span className={dc.filterSectionTitle}>Discount Type</span>
                  {isDiscountTypeOpen ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
                </div>
                {isDiscountTypeOpen && (
                  <div className={dc.filterOptions}>
                    <label className={dc.filterOption}>
                      <input
                        type="checkbox"
                        checked={filters.discountType.fixed}
                        onChange={(e) => setFilters({ ...filters, discountType: { ...filters.discountType, fixed: e.target.checked } })}
                      />
                      Fixed
                    </label>
                    <label className={dc.filterOption}>
                      <input
                        type="checkbox"
                        checked={filters.discountType.percentage}
                        onChange={(e) => setFilters({ ...filters, discountType: { ...filters.discountType, percentage: e.target.checked } })}
                      />
                      Percentage
                    </label>
                  </div>
                )}
              </div>

              {/* Validity */}
              <div className={dc.filterSection}>
                <div className={dc.filterSectionHeader} onClick={() => setIsValidityOpen(!isValidityOpen)}>
                  <span className={dc.filterSectionTitle}>Validity</span>
                  {isValidityOpen ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
                </div>
                {isValidityOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div className={dc.filterOptions}>
                      {[
                        { key: '7days', label: 'Last 7 Days' },
                        { key: '14days', label: 'Last 14 Days' },
                        { key: '30days', label: 'Last 30 Days' },
                        { key: '6months', label: 'Last 6 Months' },
                      ].map(opt => (
                        <label key={opt.key} className={dc.filterOption}>
                          <input
                            type="radio"
                            name="validity"
                            checked={filters.validity === opt.key}
                            onChange={() => setFilters({ ...filters, validity: opt.key })}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>

                    {/* Select Manually */}
                    <div style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500, marginTop: '0.25rem' }}>Select Manually</div>
                    <div className={dc.dateRangeRow}>
                      <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className={dc.dateRangeInput}
                        value={filters.customStart}
                        onChange={(e) => setFilters({ ...filters, customStart: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className={dc.dateRangeInput}
                        value={filters.customEnd}
                        onChange={(e) => setFilters({ ...filters, customEnd: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={dc.filterFooter}>
              <button
                className={dc.filterClearBtn}
                onClick={() => setFilters({ discountType: { fixed: false, percentage: false }, validity: '', customStart: '', customEnd: '' })}
              >
                Clear All
              </button>
              <button className={dc.filterApplyBtn} onClick={() => setIsFilterOpen(false)}>
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
