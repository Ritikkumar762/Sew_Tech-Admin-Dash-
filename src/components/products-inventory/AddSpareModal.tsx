import React from 'react';
import styles from './ProductsInventory.module.css';

interface AddSpareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkUpload: () => void;
  onEnterManually: () => void;
}

export function AddSpareModal({ isOpen, onClose, onBulkUpload, onEnterManually }: AddSpareModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3>Add Spare Options</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.addOptionsGrid}>
            <button className={`${styles.addOptionCard} ${styles.secondaryOption}`} onClick={onBulkUpload}>
              <div className={styles.optionIcon}>
                <img src="/add spare _2.png" alt="Bulk Upload" style={{ width: '32px', height: '32px' }} />
              </div>
              <span>Bulk Upload</span>
            </button>
            
            <button className={`${styles.addOptionCard} ${styles.primaryOption}`} onClick={onEnterManually}>
              <div className={styles.optionIcon}>
                <img src="/add spare _1.png" alt="Enter Manually" style={{ width: '32px', height: '32px' }} />
              </div>
              <span>Enter Manually</span>
            </button>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.modalBtnDark} onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  );
}
