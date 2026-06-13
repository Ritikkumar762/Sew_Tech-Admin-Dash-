'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import styles from '../finance.module.css';

interface CouponItem {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'c1',
    code: 'WELCOME100',
    type: 'Fixed Amount',
    value: 100,
    minOrderValue: 500,
    usageLimit: 1000,
    usageCount: 843,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    status: 'Active'
  },
  {
    id: 'c2',
    code: 'MECHSEW20',
    type: 'Percentage',
    value: 20,
    minOrderValue: 1200,
    maxDiscount: 300,
    usageLimit: 500,
    usageCount: 500,
    validFrom: '2026-02-15',
    validTo: '2026-05-31',
    status: 'Inactive'
  },
  {
    id: 'c3',
    code: 'FESTIVESPARES',
    type: 'Percentage',
    value: 15,
    minOrderValue: 2000,
    maxDiscount: 500,
    usageLimit: 2000,
    usageCount: 120,
    validFrom: '2026-06-01',
    validTo: '2026-06-30',
    status: 'Active'
  },
  {
    id: 'c4',
    code: 'FREESHIP',
    type: 'Fixed Amount',
    value: 50,
    minOrderValue: 299,
    usageLimit: 5000,
    usageCount: 3412,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    status: 'Active'
  }
];

export default function DiscountCodesPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) => 
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status: c.status === 'Active' ? 'Inactive' : 'Active'
        };
      })
    );
  };

  const deleteCoupon = (id: string) => {
    if (confirm('Are you sure you want to delete this discount code?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => 
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coupons, searchQuery]);

  return (
    <div className={styles.container}>
      <PageHeader 
        title="Discount Codes" 
        subtitle="Finance • Discount Codes" 
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Export</span>
              <Download size={15} />
            </button>
            <button 
              className="btn btn-dark" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => alert('New coupon creation modal opened...')}
            >
              <Plus size={15} />
              <span>Create Coupon</span>
            </button>
          </div>
        } 
      />

      {/* Summary Stats bar */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Coupons</div>
          <div className={styles.statValue}>
            {coupons.filter((c) => c.status === 'Active').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Redemptions</div>
          <div className={styles.statValue}>
            {coupons.reduce((sum, c) => sum + c.usageCount, 0).toLocaleString()}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Highest Value Discount</div>
          <div className={styles.statValue}>₹500</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Inactive Codes</div>
          <div className={styles.statValue}>
            {coupons.filter((c) => c.status === 'Inactive').length}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchInputWrapper} style={{ maxWidth: '400px' }}>
          <Search className={styles.searchIcon} size={16} />
          <input 
            type="text" 
            placeholder="Search by Coupon Code..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Coupons List Table */}
      <div className={styles.tableContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Type</th>
              <th>Discount Value</th>
              <th>Min. Spend</th>
              <th>Usage (Used / Limit)</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No coupons found matching your search.
                </td>
              </tr>
            ) : (
              filteredCoupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontWeight: 700, letterSpacing: '0.05em', color: '#1e293b' }}>
                      {c.code}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                      {c.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#111827' }}>
                      {c.type === 'Percentage' ? `${c.value}%` : `₹${c.value}`}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#4b5563' }}>₹{c.minOrderValue}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>{c.usageCount} / {c.usageLimit}</span>
                      <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%`, height: '100%', background: '#2563eb' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{c.validFrom}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{c.validTo}</span>
                  </td>
                  <td>
                    <span 
                      onClick={() => toggleCouponStatus(c.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        backgroundColor: c.status === 'Active' ? '#d1fae5' : '#fee2e2',
                        color: c.status === 'Active' ? '#065f46' : '#991b1b',
                      }}
                      title="Click to toggle status"
                    >
                      {c.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className={styles.btnRowAction} 
                        style={{ padding: '0.35rem' }} 
                        onClick={() => alert(`Edit Discount Code: ${c.code}`)}
                        title="Edit Code"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        className={styles.btnRowAction} 
                        style={{ padding: '0.35rem', color: '#ef4444', borderColor: '#fee2e2' }} 
                        onClick={() => deleteCoupon(c.id)}
                        title="Delete Code"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
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
