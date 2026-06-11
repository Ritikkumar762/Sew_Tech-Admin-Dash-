import React from 'react';
import styles from './SpareDetails.module.css';

interface TechnicalDetailsCardProps {
  dimensions: string;
  itemWeight: string;
  netQuantity: string;
  material: string;
}

export function TechnicalDetailsCard({
  dimensions,
  itemWeight,
  netQuantity,
  material
}: TechnicalDetailsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Technical Details</h2>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Dimensions (L x W x H):</div>
          <div className={styles.infoValue}>{dimensions}</div>
        </div>
        
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Item Weight:</div>
          <div className={styles.infoValue}>{itemWeight}</div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Net Quantity:</div>
          <div className={styles.infoValue}>{netQuantity}</div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Material:</div>
          <div className={styles.infoValue}>{material}</div>
        </div>
      </div>
    </div>
  );
}
