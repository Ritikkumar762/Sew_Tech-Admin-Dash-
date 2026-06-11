import React from 'react';
import styles from './SpareDetails.module.css';

interface SpareTopStatsProps {
  category: string;
  stock: number;
  orders: number;
  vendors: number;
  price: number;
}

export function SpareTopStats({ category, stock, orders, vendors, price }: SpareTopStatsProps) {
  const linkIconSvg = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );

  return (
    <div className={styles.statsRow}>
      <div className={styles.statItem}>
        <div className={styles.statValueWrapper}>
          <span>{category}</span>
          <span className={styles.linkIcon}>{linkIconSvg}</span>
        </div>
        <div className={styles.statLabel}>Category</div>
      </div>
      
      <div className={styles.statItem}>
        <div className={styles.statValueWrapper}>
          <span>{stock}</span>
          <span className={styles.linkIcon}>{linkIconSvg}</span>
        </div>
        <div className={styles.statLabel}>Stock</div>
      </div>

      <div className={styles.statItem}>
        <div className={styles.statValueWrapper}>
          <span>{orders}</span>
          <span className={styles.linkIcon}>{linkIconSvg}</span>
        </div>
        <div className={styles.statLabel}>Orders (Last 30 Days)</div>
      </div>

      <div className={styles.statItem}>
        <div className={styles.statValueWrapper}>
          <span>{vendors}</span>
          <span className={styles.linkIcon}>{linkIconSvg}</span>
        </div>
        <div className={styles.statLabel}>Active Vendors</div>
      </div>

      <div className={styles.statItem}>
        <div className={styles.statValueWrapper}>
          <span>₹{price.toLocaleString()}</span>
          <span className={styles.linkIcon}>{linkIconSvg}</span>
        </div>
        <div className={styles.statLabel}>Current Selling Price</div>
      </div>
    </div>
  );
}
