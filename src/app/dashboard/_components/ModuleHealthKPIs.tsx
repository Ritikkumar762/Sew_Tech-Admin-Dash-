'use client';
import { KpiMetric } from '../_hooks/useDashboard';
import styles from './ModuleHealthKPIs.module.css';

type Props = {
  sparesKpis: KpiMetric[];
  mechanicKpis: KpiMetric[];
};

export default function ModuleHealthKPIs({ sparesKpis, mechanicKpis }: Props) {
  return (
    <div className={styles.container}>
      
      {/* ── ST Spares KPIs ────────────────────────────────────────── */}
      <div className={`${styles.section} ${styles.sparesSection}`}>
        <h2 className={styles.sectionTitle} style={{ color: '#ef4444' }}>ST Spares KPIs</h2>
        <div className={styles.kpiGrid}>
          {sparesKpis.map(kpi => (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                {/* Grouped so space-between doesn't push the label to the far edge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={styles.kpiIconWrapper} style={{ background: kpi.iconBg, color: kpi.iconColor }}>{kpi.icon}</span>
                  <span className={styles.kpiLabel}>{kpi.label}</span>
                </div>
              </div>
              <div className={styles.kpiValueRow}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={styles.kpiValue}>{kpi.value}</span>
                  {kpi.link && (
                    <img src="/refresh_logo.svg" alt="Link" style={{ width: '14px', height: '14px', marginLeft: '0.4rem', cursor: 'pointer' }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ST Mechanic KPIs ──────────────────────────────────────── */}
      <div className={`${styles.section} ${styles.mechanicSection}`}>
        <h2 className={styles.sectionTitle} style={{ color: '#10b981' }}>ST Mechanic KPIs</h2>
        <div className={styles.kpiGrid}>
          {mechanicKpis.map(kpi => (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={styles.kpiIconWrapper} style={{ background: kpi.iconBg, color: kpi.iconColor }}>{kpi.icon}</span>
                  <span className={styles.kpiLabel}>{kpi.label}</span>
                </div>
                {kpi.trendLabel && (
                  <span className={styles.trendLabel} style={{ color: '#374151', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    {kpi.trendLabel.includes('▲') ? (
                      <img src="/green_up _logo.svg" alt="Up" style={{ width: '10px', height: '8px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ color: '#13B87E', fontSize: '0.8rem', lineHeight: 1, display: 'inline-block', transform: 'translateY(1px)' }}>▼</span>
                    )}
                    <span>
                      {kpi.trendLabel.replace('▲', '').replace('▼', '')}
                    </span>
                  </span>
                )}
              </div>
              <div className={styles.kpiValueRow}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div className={styles.kpiValue}>{kpi.value}</div>
                  {kpi.subValue && <div className={styles.kpiSubValue}>{kpi.subValue}</div>}
                  {kpi.link && (
                    <img src="/refresh_logo.svg" alt="Link" style={{ width: '14px', height: '14px', marginLeft: '0.25rem', cursor: 'pointer', marginBottom: '0.15rem' }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
