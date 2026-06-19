'use client';
import React, { useState } from 'react';
import styles from './AddSpare.module.css';

import { useRouter } from 'next/navigation';

export default function AddSparePage() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [banners, setBanners] = useState([
    { id: 1, url: '/sale 1.png', selected: true },
    { id: 2, url: '/sale 2.png', selected: false },
    { id: 3, url: '/sale 3.png', selected: false },
    { id: 4, url: '/sale 4.png', selected: false },
    { id: 5, url: '/sale 5.png', selected: false },
    { id: 6, url: '/sale 6.png', selected: false },
    { id: 7, url: '/sale 7.png', selected: false },
    { id: 8, url: '/sale 2.png', selected: false },
    { id: 9, url: '/sale 9.png', selected: false },
    { id: 10, url: '/sale 10.png', selected: false },
    { id: 11, url: '/sale 11.png', selected: false },
    { id: 12, url: '/sale 12.png', selected: false },
  ]);

  return (
    <>
      <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.breadcrumb}>
              Sewtech Spare • Products Inventory • <span>Add New Spare</span>
            </div>
            <h1 className={styles.pageTitle}>Add New Spare</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnOutlineRed} onClick={() => router.back()}>Discard Copy</button>
            <button className={styles.btnDark} onClick={() => setShowConfirmation(true)}>Add Spare</button>
          </div>
        </div>

        {/* General Details */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>General Details</h2>
            <select className={styles.statusSelect} defaultValue="Live">
              <option value="Live">Live</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spare name<span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} defaultValue="High-Speed Rotary Hook Assembly" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Description<span className={styles.required}>*</span></label>
              <div className={styles.richTextEditor}>
                <div className={styles.editorToolbar}>
                  <button>14 ▼</button>
                  <button><b>B</b></button>
                  <button><i>I</i></button>
                  <button><u>U</u></button>
                  <button>S</button>
                  <button>🔗</button>
                  <button>≣</button>
                </div>
                <div className={styles.editorContent}>Add Body to your post</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af' }}>50/200</div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category<span className={styles.required}>*</span></label>
              <div className={styles.tagsContainer}>
                <span className={styles.tagPill}>Rotary Hook <span className={styles.tagClose}>×</span></span>
                <span className={styles.tagPill}>Rotary Hook <span className={styles.tagClose}>×</span></span>
              </div>
            </div>

            <div className={styles.formGroup} style={{ visibility: 'hidden' }}></div> {/* Spacer for grid layout */}

            <div className={styles.formGroup}>
              <label className={styles.label}>Spare name<span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} defaultValue="High-Speed Rotary Hook Assembly" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Material<span className={styles.required}>*</span></label>
              <div className={styles.tagsContainer}>
                <span className={styles.tagPill}>High-Carbon Steel <span className={styles.tagClose}>×</span></span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Manufacturer<span className={styles.required}>*</span></label>
              <select className={styles.select}>
                <option>Demo Manufacturer</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Warranty<span className={styles.required}>*</span></label>
              <select className={styles.select}>
                <option>1 Yr</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tags</label>
              <div className={styles.tagsContainer}>
                <span className={styles.tagPill}>Rotary Hook <span className={styles.tagClose}>×</span></span>
                <span className={styles.tagPill}>Rotary Hook <span className={styles.tagClose}>×</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Technical Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Net Quantity<span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} defaultValue="12" />
            </div>

            <div className={styles.dimensionGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Length<span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} defaultValue="00" />
              </div>
              <span className={styles.dimensionSeparator}>x</span>
              <div className={styles.formGroup}>
                <label className={styles.label}>Width<span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} defaultValue="00" />
              </div>
              <span className={styles.dimensionSeparator}>x</span>
              <div className={styles.formGroup}>
                <label className={styles.label}>Height<span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} defaultValue="00" />
              </div>
              <select className={styles.select} style={{ marginTop: '1.5rem' }}>
                <option>Units</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Manufacturer<span className={styles.required}>*</span></label>
              <select className={styles.select}>
                <option>Demo Manufacturer</option>
              </select>
            </div>

            <div className={styles.dimensionGrid} style={{ gridTemplateColumns: '1fr auto' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Weight<span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} defaultValue="12" />
              </div>
              <select className={styles.select} style={{ marginTop: '1.5rem', width: '100px' }}>
                <option>Units</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Material<span className={styles.required}>*</span></label>
              <div className={styles.tagsContainer}>
                <span className={styles.tagPill}>High-Carbon Steel <span className={styles.tagClose}>×</span></span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Spare Compatibility<span className={styles.required}>*</span></label>
              <div className={styles.tagsContainer}>
                <span className={styles.tagPill}>High-Carbon Steel <span className={styles.tagClose}>×</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Price Details</h2>
          
          <label className={styles.checkboxLabel} style={{ marginBottom: '1.5rem' }}>
            <input type="checkbox" /> Returnable Product
          </label>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Listing Price<span className={styles.required}>*</span></label>
              <div className={styles.priceInputGroup}>
                <span className={styles.currencyAddon}>₹</span>
                <input type="text" className={styles.priceInput} defaultValue="1,500" />
                <select className={styles.taxSelect}>
                  <option>With Tax</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Sale Price<span className={styles.required}>*</span></label>
              <div className={styles.priceInputGroup}>
                <span className={styles.currencyAddon}>₹</span>
                <input type="text" className={styles.priceInput} defaultValue="1,500" />
                <select className={styles.taxSelect}>
                  <option>With Tax</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Details */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Stock Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Stock Inventory<span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} defaultValue="100" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Add Stock Alert Quantity<span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} defaultValue="12" />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Product Images</h2>
          
          <label className={styles.checkboxLabel}>
            <input type="checkbox" /> Enable Multiple Variants
          </label>

          <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
            <label className={styles.label}>Upload Spare Images<span className={styles.required}>*</span></label>
            <div 
              className={styles.uploadBox}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files) {
                  setUploadedImages(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) {
                    setUploadedImages(prev => [...prev, ...Array.from(e.target.files!)]);
                  }
                }}
              />
              <button 
                type="button" 
                className={styles.uploadBtn} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Upload Photo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </button>
            </div>
            {uploadedImages.length > 0 && (
              <div className={styles.uploadedImagesGrid}>
                {uploadedImages.map((file, i) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={i} className={styles.uploadedImageCard}>
                      <img src={previewUrl} alt={file.name} className={styles.uploadedImage} />
                      <button 
                        type="button" 
                        className={styles.deleteImageBtn} 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setUploadedImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Product Banner */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Product Banner</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Banner<span className={styles.required}>*</span></label>
            <div className={styles.bannersContainer}>
              <div className={styles.bannersGrid}>
                {banners.map((banner) => (
                  <div 
                    key={banner.id} 
                    className={`${styles.bannerCard} ${banner.selected ? styles.bannerCardSelected : ''}`} 
                    onClick={() => {
                      setBanners(banners.map(b => ({ ...b, selected: b.id === banner.id })));
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={banner.selected} 
                      readOnly 
                      className={styles.bannerCheckbox} 
                    />
                    <img src={banner.url} alt={`Banner ${banner.id}`} className={styles.bannerImage} />
                  </div>
                ))}
              </div>
              <div className={styles.bannerBadgeWrapper}>
                <span className={styles.bannerBadge}>1020 Fill × 300 Hug</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
          <div className={styles.confirmationCard} style={{ margin: 'auto' }}>
            <button className={styles.modalCloseBtn} onClick={() => setShowConfirmation(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className={styles.successCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h3 className={styles.confirmationTitle}>Spare Added Successfully!</h3>
            <p className={styles.confirmationText}>
              Spare has been added successfully and is now<br/>available in your inventory.
            </p>
            
            <button className={styles.btnViewAll} onClick={() => router.push('/spares/all')}>
              View all Spares
            </button>
          </div>
        </div>
      )}
    </>
  );
}
