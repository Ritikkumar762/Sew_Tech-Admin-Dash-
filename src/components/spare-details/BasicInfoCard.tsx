import React from 'react';
import styles from './SpareDetails.module.css';

interface BasicInfoCardProps {
  description: string;
  mappedIndustry: string;
  manufacturer: string;
  warranty: string;
  tags: string[];
  visibility: 'Live' | 'Draft' | 'Archive' | 'Under Review';
}

export function BasicInfoCard({
  description,
  mappedIndustry,
  manufacturer,
  warranty,
  tags,
  visibility
}: BasicInfoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Basic Info</h2>
        <select className={styles.selectStatus} defaultValue={visibility}>
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
          <option value="Archive">Archive</option>
          <option value="Under Review">Under Review</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div className={styles.infoLabel}>Description:</div>
        <div className={styles.descriptionText}>{description}</div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Mapped Industry:</div>
          <div className={styles.infoValue}>{mappedIndustry}</div>
        </div>
        
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Manufacturer:</div>
          <div className={styles.infoValue}>{manufacturer}</div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Warranty</div>
          <div className={styles.infoValue}>{warranty}</div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Tags</div>
          <div className={styles.tagList}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.tagPill}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
