'use client';

import { useState } from 'react';
import { useOverview } from './_hooks/useOverview';
import OrderInsights from './_components/OrderInsights';
import InventoryInsights from './_components/InventoryInsights';
import RevenueInsights from './_components/RevenueInsights';
import PerformanceInsights from './_components/PerformanceInsights';
import styles from './Overview.module.css';

const TABS = [
  { key: 'order', label: 'Order Insights' },
  { key: 'inventory', label: 'Inventory Insights' },
  { key: 'revenue', label: 'Revenue Insights' },
  { key: 'performance', label: 'Performance Insights' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function SparesOverviewPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('order');
  
  const { 
    loading, error, refetch, globalKpis,
    funnel, orderOutcome, orderTrend, cancelReasons,
    invDonut, stockCategory, stockAlerts, deadStock,
    revenueTrend, revenueRisk, transactions,
    perfInsights 
  } = useOverview();

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p style={{ color: '#6b7280' }}>Loading overview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingWrapper}>
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
        <button onClick={refetch} className={styles.select}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      


      {/* ── Global KPIs ────────────────────────────────────────── */}
      <div className={styles.metricsGrid}>
        {globalKpis.map((kpi) => (
          <div key={kpi.label} className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span className={styles.metricIcon} style={{ color: kpi.iconColor, background: `${kpi.iconColor}15` }}>{kpi.icon}</span>
              {kpi.label}
            </div>
            <div className={styles.metricValueRow}>
              <div className={styles.metricValue}>{kpi.value}</div>
              <button className={styles.metricRefresh} onClick={refetch} title="Refresh">
                <img src="/refresh_logo.svg" alt="Refresh" style={{ width: '16px', height: '16px', display: 'block' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────── */}
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

      {/* ── Tab Content ────────────────────────────────────────── */}
      <div style={{ marginTop: '0.5rem' }}>
        {activeTab === 'order' && (
          <OrderInsights 
            funnel={funnel} 
            orderOutcome={orderOutcome} 
            orderTrend={orderTrend} 
            cancelReasons={cancelReasons} 
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryInsights 
            invDonut={invDonut} 
            stockCategory={stockCategory} 
            stockAlerts={stockAlerts} 
            deadStock={deadStock} 
          />
        )}
        {activeTab === 'revenue' && (
          <RevenueInsights 
            revenueTrend={revenueTrend} 
            revenueRisk={revenueRisk} 
            transactions={transactions} 
          />
        )}
        {activeTab === 'performance' && (
          <PerformanceInsights 
            perfInsights={perfInsights} 
          />
        )}
      </div>

    </div>
  );
}
