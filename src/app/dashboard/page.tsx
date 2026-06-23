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
      
      {/* ── Header Section ────────────────────────────────────────── */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <div className={styles.dashboardSubtitle}>
            Sewtech Spare <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>•</span> Order Management
          </div>
        </div>
        <div className={styles.headerActions}>
          <select className={styles.selectDropdown}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
          <button className={styles.exportButton}>
            Export
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className={styles.metricsGrid}>
        {topMetrics.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span className={styles.metricIcon} style={{ color: m.iconColor, background: m.iconBg ?? `${m.iconColor}15` }}>{m.icon}</span>
              {m.label}
            </div>
            <div className={styles.metricValueRow}>
              <div className={styles.metricValue}>
                {m.value}
                {m.unit && <span className={styles.metricUnit}>{m.unit}</span>}
                {m.link && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', marginLeft: '0.4rem', alignSelf: 'center' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                )}
              </div>
              <button className={styles.metricRefresh} onClick={refetch} title="Refresh">
                <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '16px', height: '16px', display: 'block' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
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
