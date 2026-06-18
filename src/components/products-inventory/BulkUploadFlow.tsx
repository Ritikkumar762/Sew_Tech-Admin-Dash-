import React, { useState } from 'react';
import styles from './ProductsInventory.module.css';

interface BulkUploadFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type UploadState = 'upload' | 'success' | 'error' | 'preview';

export function BulkUploadFlow({ isOpen, onClose }: BulkUploadFlowProps) {
  const [uploadState, setUploadState] = useState<UploadState>('upload');

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    // Simulate upload success
    setUploadState('success');
  };

  const handlePreview = () => {
    setUploadState('preview');
  };

  const resetAndClose = () => {
    setUploadState('upload');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className={`${styles.modalCard} ${uploadState === 'preview' ? styles.modalCardLarge : ''}`} style={{ position: 'relative', overflow: 'visible', margin: 'auto' }}>
        <div className={styles.modalHeader}>
          <h3>{uploadState === 'preview' ? 'Preview Bulk Upload' : 'Bulk Upload'}</h3>
          <button className={styles.modalCloseBtn} onClick={resetAndClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {uploadState === 'upload' && (
            <div className={styles.uploadContainer}>
              <div className={styles.downloadSample}>
                <button className={styles.btnOutline}>samplelist.csv ↓</button>
              </div>
              <p className={styles.uploadLabel}>Upload Spare List</p>
              <div className={styles.uploadBox} onClick={handleSimulateUpload}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>Add .csv File here</span>
              </div>
            </div>
          )}

          {uploadState === 'success' && (
            <div className={styles.uploadContainer}>
              <div className={styles.downloadSample}>
                <button className={styles.btnOutline}>samplelist.csv ↓</button>
              </div>
              <p className={styles.uploadLabel}>Upload Spare List</p>
              <div className={styles.uploadBoxSuccess}>
                <div className={styles.successIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className={styles.successText}>sparelist.csv Uploaded</span>
              </div>
            </div>
          )}

          {uploadState === 'preview' && (
            <div className={styles.previewContainer}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>Spare Name ↑↓</th>
                    <th>Category ↑↓</th>
                    <th>Compatible Machines ↑↓</th>
                    <th>Vendor ↑↓</th>
                    <th>Price Range ↑↓</th>
                    <th>Stock Status ↑↓</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item}>
                      <td>
                        <div className={styles.productCell}>
                           <div className={styles.productIconWrapper} style={{ overflow: 'hidden' }}>
                              <span className={styles.productIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                 </svg>
                              </span>
                           </div>
                           <div>
                              <div className={styles.productName}>High-Speed Rotary Hook Assembly</div>
                              <div className={styles.productSku}>HC3000</div>
                           </div>
                        </div>
                      </td>
                      <td>Rotary Hook</td>
                      <td><span className={styles.badgeMachine}>3</span></td>
                      <td><span className={styles.badgeMachine}>2</span></td>
                      <td className={styles.priceRange}>₹1,850 - ₹2,400</td>
                      <td><span className={styles.badgeMachine}>45</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {uploadState !== 'preview' ? (
            <>
              <button className={styles.modalBtnLight} onClick={resetAndClose}>Cancel</button>
              <button 
                className={`${styles.modalBtnDark} ${uploadState === 'upload' ? styles.btnDisabled : ''}`} 
                onClick={uploadState === 'success' ? handlePreview : undefined}
                disabled={uploadState === 'upload'}
              >
                Submit
              </button>
            </>
          ) : (
            <>
              <button className={styles.modalBtnLight} onClick={() => setUploadState('upload')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                Re-Upload File
              </button>
              <button className={styles.modalBtnDark} onClick={resetAndClose}>Submit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
