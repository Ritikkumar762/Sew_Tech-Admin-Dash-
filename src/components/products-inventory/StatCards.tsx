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
              <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '14px', height: '14px', display: 'block' }} />
            </button>
          </div>
          <div className={styles.statValue}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
