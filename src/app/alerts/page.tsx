'use client';
import { useState, useMemo } from 'react';
import { useAlerts } from './_hooks/useAlerts';
import { useRouter } from 'next/navigation';
import { AlertCircle, TriangleAlert, ChevronRight } from 'lucide-react';
import styles from './alerts.module.css';

export default function AlertsPage() {
  const { alerts, loading, error, markRead } = useAlerts();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'All' | 'ST Spares' | 'ST Mechanics'>('All');

  // Backend easily integratable filtering
  const filteredAlerts = useMemo(() => {
    if (activeTab === 'All') return alerts;
    return alerts.filter(a => a.module === activeTab);
  }, [alerts, activeTab]);

  // Priority bucketing
  const highPriority = filteredAlerts.filter(a => a.type === 'error');
  const mediumPriority = filteredAlerts.filter(a => a.type === 'warning');
  const lowPriority = filteredAlerts.filter(a => a.type === 'info' || a.type === 'success');

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days ago` : 'Today';
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Alerts</h1>
          <div className={styles.breadcrumbs}>
            Alerts • <span>All Alerts</span>
          </div>
        </div>
        
        <div className={styles.tabsContainer}>
          {(['All', 'ST Spares', 'ST Mechanics'] as const).map(tab => (
            <button 
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading && <p>Loading alerts...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!loading && !error && (
        <div className={styles.board}>
          {/* High Priority */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>High Priority</div>
            {highPriority.map(alert => (
              <div key={alert.id} className={`${styles.alertCard} ${styles.highPriority}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrapper}>
                    <AlertCircle size={14} className={styles.highIcon} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{alert.title}</div>
                    <div className={styles.cardTime}>{formatTime(alert.createdAt)}</div>
                  </div>
                </div>
                <button className={`${styles.actionBtn} ${styles.highBtn}`} onClick={() => {
                  markRead(alert.id);
                  router.push(`/alerts/${alert.id}`);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Medium Priority */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>Medium Priority</div>
            {mediumPriority.map(alert => (
              <div key={alert.id} className={`${styles.alertCard} ${styles.mediumPriority}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrapper}>
                    <TriangleAlert size={14} className={styles.mediumIcon} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{alert.title}</div>
                    <div className={styles.cardTime}>{formatTime(alert.createdAt)}</div>
                  </div>
                </div>
                <button className={`${styles.actionBtn} ${styles.mediumBtn}`} onClick={() => {
                  markRead(alert.id);
                  router.push(`/alerts/${alert.id}`);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Low Priority */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>Low Priority</div>
            {lowPriority.map(alert => (
              <div key={alert.id} className={`${styles.alertCard} ${styles.lowPriority}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrapper}>
                    <TriangleAlert size={14} className={styles.lowIcon} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{alert.title}</div>
                    <div className={styles.cardTime}>{formatTime(alert.createdAt)}</div>
                  </div>
                </div>
                <button className={`${styles.actionBtn} ${styles.lowBtn}`} onClick={() => {
                  markRead(alert.id);
                  router.push(`/alerts/${alert.id}`);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
