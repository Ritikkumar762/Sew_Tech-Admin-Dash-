'use client';
import { useState } from 'react';
import { useDashboard } from './_hooks/useDashboard';
import OrderInsights from './_components/OrderInsights';
import RevenueInsights from './_components/RevenueInsights';
import PerformanceInsights from './_components/PerformanceInsights';
import styles from './dashboard.module.css';

const TABS = [
  { key: 'request', label: 'Request Insights' },
  { key: 'revenue', label: 'Revenue Insights' },
  { key: 'performance', label: 'Performance Insights' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('request');
  const { metrics, funnel, pie, trend, breakup, cancellations, revenue, performance, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p className="text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
        <button onClick={refetch} className="btn btn-dark">Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* ── Metrics Row ──────────────────────────────────────── */}
      <div className={styles.metricsGrid}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span style={{ color: m.iconColor }}>{m.icon}</span>
              {m.label}
            </div>
            <div className={styles.metricValueRow}>
              <div className={styles.metricValue}>{m.value}</div>
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
        {activeTab === 'request' && (
          <OrderInsights funnel={funnel} pie={pie} trend={trend} breakup={breakup} cancellations={cancellations} />
        )}
        {activeTab === 'revenue' && <RevenueInsights revenue={revenue} />}
        {activeTab === 'performance' && <PerformanceInsights performance={performance} />}
      </div>
    </div>
  );
}
