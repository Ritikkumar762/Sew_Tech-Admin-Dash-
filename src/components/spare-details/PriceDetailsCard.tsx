import React from 'react';
import styles from './SpareDetails.module.css';

interface PriceDetailsCardProps {
  listingPrice: number;
  salePrice: number;
  isReturnable: boolean;
}

export function PriceDetailsCard({ listingPrice, salePrice, isReturnable }: PriceDetailsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Price Details</h2>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Listing Price:</div>
          <div className={styles.infoValue}>₹{listingPrice.toLocaleString()}</div>
        </div>
        
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Sale Price:</div>
          <div className={styles.infoValue}>₹{salePrice.toLocaleString()}</div>
        </div>
      </div>
      
      {isReturnable && (
        <div className={styles.badgeReturnable}>Returnable Product</div>
      )}
    </div>
  );
}
