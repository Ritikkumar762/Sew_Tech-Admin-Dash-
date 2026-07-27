import React, { useState } from 'react';
import styles from './ProductsInventory.module.css';

interface AddSpareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkUpload: () => void;
  onEnterManually: () => void;
}

export function AddSpareModal({ isOpen, onClose, onBulkUpload, onEnterManually }: AddSpareModalProps) {
  const [selectedOption, setSelectedOption] = useState<'bulk' | 'manual' | null>(null);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedOption === 'bulk') {
      onBulkUpload();
    } else {
      onEnterManually();
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100
      }}
    >
      <div 
        className={styles.modalCard} 
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', overflow: 'visible', margin: 'auto' }}
      >
        <button className={styles.modalCloseBtnCorner} onClick={onClose} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <h3>Add Spare Options</h3>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.addOptionsGrid}>
            <button 
              type="button"
              className={`${styles.addOptionCard} ${selectedOption === 'bulk' ? styles.primaryOption : styles.secondaryOption}`} 
              onClick={() => setSelectedOption('bulk')}
            >
              <div className={styles.optionIcon}>
                <img 
                  src="/add spare-2.svg" 
                  alt="Bulk Upload" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    filter: selectedOption === 'bulk' ? 'brightness(0) invert(1)' : 'none' 
                  }} 
                />
              </div>
              <span>Bulk Upload</span>
            </button>
            
            <button 
              type="button"
              className={`${styles.addOptionCard} ${selectedOption === 'manual' ? styles.primaryOption : styles.secondaryOption}`} 
              onClick={() => setSelectedOption('manual')}
            >
              <div className={styles.optionIcon}>
                <img 
                  src="/add spare-1.svg" 
                  alt="Enter Manually" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    filter: selectedOption === 'manual' ? 'brightness(0) invert(1)' : 'none' 
                  }} 
                />
              </div>
              <span>Enter Manually</span>
            </button>
          </div>
        </div>
        
        <div className={styles.modalFooter} style={{ borderTop: 'none', paddingTop: 0, paddingBottom: '1.5rem' }}>
          <button 
            type="button"
            className={styles.modalBtnDark} 
            onClick={handleContinue}
            style={{ width: '100%', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
