import React from 'react';
import styles from './SpareDetails.module.css';

interface StockDetailsCardProps {
  stockInventory: number;
  stockAlertQuantity: number;
}

export function StockDetailsCard({ stockInventory, stockAlertQuantity }: StockDetailsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Stock Details</h2>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Stock Inventory:</div>
          <div className={styles.infoValue}>{stockInventory}</div>
        </div>
        
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Add Stock Alert Quantity:</div>
          <div className={styles.infoValue}>{stockAlertQuantity}</div>
        </div>
      </div>
    </div>
  );
}
