'use client';
import { useState } from 'react';
import { useDashboard } from './_hooks/useDashboard';
import ModuleHealthKPIs from './_components/ModuleHealthKPIs';
import PerformanceInsights from './_components/PerformanceInsights';
import UserInsights from './_components/UserInsights';
import styles from './dashboard.module.css';

const TABS = [
  { key: 'module_health', label: 'Module Health KPIs' },
  { key: 'performance', label: 'Performance Insights' },
  { key: 'user', label: 'User Insights' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('module_health');
  
  const { 
    topMetrics, sparesKpis, mechanicKpis, 
    perfDonuts, trendModule, trendUserType, trendCity,
    userDonuts, newRepeat,
    loading, error, refetch 
  } = useDashboard();

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p style={{ color: '#6b7280' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
        <button onClick={refetch} className={styles.retryBtn}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      
      {/* ── Top Metrics Row ──────────────────────────────────────── */}
      <div className={styles.metricsGrid}>
        {topMetrics.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span className={styles.metricIcon} style={{ color: m.iconColor, background: `${m.iconColor}15` }}>{m.icon}</span>
              {m.label}
            </div>
            <div className={styles.metricValueRow}>
              <div className={styles.metricValue}>
                {m.value}
                {m.unit && <span className={styles.metricUnit}>{m.unit}</span>}
              </div>
              <button className={styles.metricRefresh} onClick={refetch} title="Refresh">↻</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────── */}
      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}
      <div className={styles.tabContent}>
        {activeTab === 'module_health' && (
          <ModuleHealthKPIs sparesKpis={sparesKpis} mechanicKpis={mechanicKpis} />
        )}
        {activeTab === 'performance' && (
          <PerformanceInsights 
            perfDonuts={perfDonuts} 
            trendModule={trendModule} 
            trendUserType={trendUserType} 
            trendCity={trendCity} 
          />
        )}
        {activeTab === 'user' && (
          <UserInsights 
            userDonuts={userDonuts} 
            newRepeat={newRepeat} 
          />
        )}
      </div>
      
    </div>
  );
}
