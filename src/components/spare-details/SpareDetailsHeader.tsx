import React from 'react';
import styles from './SpareDetails.module.css';

interface SpareDetailsHeaderProps {
  name: string;
  sku: string;
}

export function SpareDetailsHeader({ name, sku }: SpareDetailsHeaderProps) {
  return (
    <div className={styles.headerSection}>
      <div>
        <div className={styles.breadcrumb}>
          Sewtech Spare <span style={{ margin: '0 0.25rem' }}>•</span> Products Inventory <span style={{ margin: '0 0.25rem' }}>•</span> {name}
        </div>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{name}</h1>
          <span className={styles.skuBadge}>
            {sku}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', opacity: 0.8 }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </span>
        </div>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.btnOutline}>
          Clone Spare 
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
        <button className={styles.btnDark}>
          Edit Spare Details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      </div>
    </div>
  );
}
