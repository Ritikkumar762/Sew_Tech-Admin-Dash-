import React from 'react';
import styles from './SpareDetails.module.css';

interface CompatibilityItem {
  id: string;
  brand: string;
  machineModel: string;
  image?: string;
}

interface CompatibilityCardProps {
  compatibilities: CompatibilityItem[];
}

export function CompatibilityCard({ compatibilities }: CompatibilityCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Spare Compatibility</h2>
      </div>

      <div className={styles.compatibilityGrid}>
        {compatibilities.map((compat) => (
          <div key={compat.id} className={styles.compatibilityCard}>
            <div className={styles.compatImage}>
              {/* Detailed Sewing Machine outline SVG */}
              <svg width="26" height="26" viewBox="0 0 64 64" fill="none" stroke="#64748b" strokeWidth="3">
                <path d="M8 50h48M12 40h40M12 40v10M52 40v10" strokeLinecap="round"/>
                <path d="M16 40V22c0-3 2-5 5-5h22c3 0 5 2 5 5v18" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="48" cy="22" r="4"/>
                <path d="M22 26v10" strokeLinecap="round"/>
                <path d="M36 17V10m-4 0h8" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.compatDetails}>
              <div className={styles.compatBrand}>
                {compat.brand} 
                <span className={styles.linkIcon}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </span>
              </div>
              <div className={styles.compatModel}>{compat.machineModel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
