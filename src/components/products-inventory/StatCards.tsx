import React from 'react';
import styles from './ProductsInventory.module.css';

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  alert?: boolean;
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`${styles.statIcon} ${stat.alert ? styles.statIconAlert : ''}`}>
                {stat.icon}
              </span>
              <span className={styles.statTitle}>{stat.title}</span>
            </div>
            <button className={styles.refreshBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </button>
          </div>
          <div className={styles.statValue}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
