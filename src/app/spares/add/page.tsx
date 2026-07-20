'use client';
import React, { useState } from 'react';
import styles from './AddSpare.module.css';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export default function AddSparePage() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('Live');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [banners, setBanners] = useState([
    { id: 1, url: '/sale 4.png', selected: true },
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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    stock_quantity: '',
    sku: '',
    weight: '',
    net_quantity: '',
    length: '',
    width: '',
    height: '',
    low_stock_threshold: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSpare = async () => {
    setIsSubmitting(true);
    try {
        // Hardcode category_id and brand_id for now as there's no category dropdown yet
        const payload: any = {
          name: formData.name || 'Untitled Spare',
          description: formData.description || 'No description',
          price: Number(formData.price) || 1, // default to 1 to avoid <=0 errors
          discount_price: formData.sale_price ? Number(formData.sale_price) : undefined,
          stock_quantity: Number(formData.stock_quantity) || 0,
          category_id: 1, // 1 = Fabrics
          brand_id: 5004, // 5004 = Juki (valid brand)
          sku: formData.sku || `SKU-${Date.now()}`,
          specifications: {
            "Product Dimensions": `${formData.length || 0}x${formData.width || 0}x${formData.height || 0}`,
            "Net Quantity": formData.net_quantity || '1 Unit',
            "Item Weight": formData.weight ? `${formData.weight}g` : 'N/A'
          }
        };
        
        if (formData.weight && Number(formData.weight) >= 1) {
          payload.weight_grams = Number(formData.weight);
        }
        
        if (formData.low_stock_threshold && Number(formData.low_stock_threshold) >= 1) {
          payload.low_stock_threshold = Number(formData.low_stock_threshold);
        }
        
        await apiClient.post(ENDPOINTS.seller.products, payload);
        
        setShowConfirmation(true);
    } catch (err: any) {
      console.error('Failed to add spare', err);
      alert(`Failed to add spare. Error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <button className={styles.btnOutlineRed} onClick={() => router.back()} disabled={isSubmitting}>Discard Copy</button>
            <button className={styles.btnDark} onClick={handleAddSpare} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Spare'}
            </button>
          </div>
        </div>

        {/* General Details */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>General Details</h2>
            <div style={{ position: 'relative' }}>
              <button 
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={styles.statusSelect}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span>{status}</span>
                <svg 
                  width="8" 
                  height="5" 
                  viewBox="0 0 10 6" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: isStatusDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <path d="M1 1L5 5L9 1" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {isStatusDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsStatusDropdownOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49 }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    zIndex: 50,
                    minWidth: '150px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '4px'
                  }}>
                    {['Live', 'Draft'].map((option, idx) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setStatus(option);
                          setIsStatusDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#374151',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: idx < 1 ? '1px solid #f1f5f9' : 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spare name<span className={styles.required}>*</span></label>
              <input 
                type="text" 
                className={styles.input} 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
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
                <textarea 
                  className={styles.editorContent} 
                  style={{ width: '100%', minHeight: '100px', border: 'none', outline: 'none', resize: 'vertical' }}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add Body to your post"
                />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af' }}>
                {formData.description.length}/200
              </div>
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
              <label className={styles.label}>SKU<span className={styles.required}>*</span></label>
              <input 
                type="text" 
                className={styles.input} 
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="STH-RH-2045"
              />
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
              <input 
                type="text" 
                className={styles.input} 
                value={formData.net_quantity}
                onChange={e => setFormData({ ...formData, net_quantity: e.target.value })}
                placeholder="12"
              />
            </div>

            <div className={styles.dimensionGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Length<span className={styles.required}>*</span></label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.length}
                  onChange={e => setFormData({ ...formData, length: e.target.value })}
                  placeholder="00"
                />
              </div>
              <span className={styles.dimensionSeparator}>x</span>
              <div className={styles.formGroup}>
                <label className={styles.label}>Width<span className={styles.required}>*</span></label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.width}
                  onChange={e => setFormData({ ...formData, width: e.target.value })}
                  placeholder="00"
                />
              </div>
              <span className={styles.dimensionSeparator}>x</span>
              <div className={styles.formGroup}>
                <label className={styles.label}>Height<span className={styles.required}>*</span></label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.height}
                  onChange={e => setFormData({ ...formData, height: e.target.value })}
                  placeholder="00"
                />
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
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="12"
                />
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
                <input 
                  type="text" 
                  className={styles.priceInput} 
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
                <select className={styles.taxSelect}>
                  <option>With Tax</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Sale Price<span className={styles.required}>*</span></label>
              <div className={styles.priceInputGroup}>
                <span className={styles.currencyAddon}>₹</span>
                <input 
                  type="text" 
                  className={styles.priceInput} 
                  value={formData.sale_price}
                  onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                />
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
              <input 
                type="text" 
                className={styles.input} 
                value={formData.stock_quantity}
                onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Add Stock Alert Quantity<span className={styles.required}>*</span></label>
              <input 
                type="text" 
                className={styles.input} 
                value={formData.low_stock_threshold}
                onChange={e => setFormData({ ...formData, low_stock_threshold: e.target.value })}
              />
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
