import React from 'react';
import styles from './SpareDetails.module.css';

interface AuditEntry {
  id: string;
  userInitials: string;
  action: string;
  author: string;
  date: string;
  isExpanded?: boolean;
  changes?: {
    compatibility?: {
      added?: string[];
      removed?: string[];
    };
    status?: {
      from: string;
      to: string;
    };
    dimensions?: {
      from: string;
      to: string;
    };
  };
  hasRollback?: boolean;
}

const AUDIT_DATA: AuditEntry[] = [
  {
    id: '1',
    userInitials: 'S',
    action: 'Details Updated',
    author: 'Sparsh',
    date: '15th Jan 2025, 10:20 AM',
    changes: {
      compatibility: {
        added: ['HSRH-001, Juki'],
        removed: ['HSRH-003, Juki']
      }
    },
    hasRollback: true
  },
  {
    id: '2',
    userInitials: 'P',
    action: 'Details Updated',
    author: 'Puneet',
    date: '15th Jan 2025, 10:20 AM',
    changes: {
      status: { from: 'Draft', to: 'Live' },
      compatibility: {
        added: ['HSRH-001, Juki'],
        removed: ['HSRH-003, Juki']
      },
      dimensions: {
        from: '48 mm x 42 mm x 28 mm',
        to: '48 mm x 42 mm x 28 mm'
      }
    }
  },
  {
    id: '3',
    userInitials: 'P',
    action: 'Spare Created',
    author: 'Puneet',
    date: '15th Jan 2025, 10:20 AM'
  }
];

export function AuditLog() {
  return (
    <div className={styles.auditContainer}>
      <h2 className={styles.cardTitle} style={{ marginBottom: '1.5rem' }}>Detailed Journey</h2>
      
      <div className={styles.timeline}>
        {AUDIT_DATA.map((entry, idx) => (
          <div key={entry.id} className={styles.timelineItem}>
            <div className={styles.timelineLeft}>
              <div className={`${styles.avatarCircle} ${entry.userInitials === 'S' ? styles.avatarS : styles.avatarP}`}>
                {entry.userInitials}
              </div>
              {idx < AUDIT_DATA.length - 1 && <div className={styles.timelineLine} />}
            </div>
            
            <div className={styles.timelineContentCard}>
              <div className={styles.timelineHeader}>
                <span className={styles.timelineAction}>{entry.action}</span>
                <span className={styles.timelineMeta}>
                  {entry.author}, {entry.date} <span className={styles.expandChevron}>▲</span>
                </span>
              </div>
              
              {entry.changes && (
                <div className={styles.timelineChanges}>
                  {entry.changes.status && (
                    <div className={styles.changeRow}>
                      <span className={styles.changeLabel}>Status</span>
                      <span className={styles.statusChange}>
                        <span className={styles.textRed}>{entry.changes.status.from}</span>
                        {' → '}
                        <span className={styles.textGreen}>{entry.changes.status.to}</span>
                      </span>
                    </div>
                  )}
                  
                  {entry.changes.compatibility && (
                    <div className={styles.changeRow} style={{ alignItems: 'flex-start' }}>
                      <span className={styles.changeLabel}>Compatibility</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {entry.changes.compatibility.added?.map((comp, cIdx) => (
                          <div key={cIdx} className={styles.diffAdded}>
                            <span className={styles.diffDotGreen}>●</span> {comp}
                          </div>
                        ))}
                        {entry.changes.compatibility.removed?.map((comp, cIdx) => (
                          <div key={cIdx} className={styles.diffRemoved}>
                            <span className={styles.diffDotRed}>●</span> {comp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.changes.dimensions && (
                    <div className={styles.changeRow}>
                      <span className={styles.changeLabel}>Dimensions (L × W × H)</span>
                      <span>
                        <span className={styles.textRed}>{entry.changes.dimensions.from}</span>
                        {' → '}
                        <span className={styles.textGreen}>{entry.changes.dimensions.to}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {entry.hasRollback && (
                <button className={styles.rollbackBtn}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <polyline points="3 3 3 8 8 8"></polyline>
                  </svg>
                  Roll Back Changes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.timelineFooter}>
        Created - 15th Jan 2025
      </div>
    </div>
  );
}
