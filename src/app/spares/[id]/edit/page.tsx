'use client';
import React, { useState } from 'react';
import styles from './EditSpare.module.css';
import { useRouter, useParams } from 'next/navigation';

export default function EditSparePage() {
  const router = useRouter();
  const params = useParams();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isVariantsEnabled, setIsVariantsEnabled] = useState(true);
  const [variantType, setVariantType] = useState('eg, Colour, Size, Finish Look');

  interface VariantState {
    id: string;
    indexText: string;
    labelText: string;
    value: string;
    images: string[];
    coverIndex: number;
  }

  const [variants, setVariants] = useState<VariantState[]>([
    {
      id: 'v-1',
      indexText: '01',
      labelText: 'Default Spare Type',
      value: '5 mm',
      images: ['/rotary_hook.png', '/rotary_hook.png', '/rotary_hook.png'],
      coverIndex: 0
    },
    {
      id: 'v-2',
      indexText: '02',
      labelText: 'Variant 1',
      value: '10 mm',
      images: [],
      coverIndex: 0
    }
  ]);
  
  const [singleImages, setSingleImages] = useState<string[]>(['/rotary_hook.png']);
  const [singleCoverIndex, setSingleCoverIndex] = useState(0);

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

  const handleSaveChanges = () => {
    setShowConfirmation(true);
  };

  const handleImageUpload = (variantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v;
      return {
        ...v,
        images: [...v.images, ...newImageUrls]
      };
    }));
  };

  const handleDeleteImage = (variantId: string, imageIndex: number) => {
    setVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v;
      const newImages = v.images.filter((_, idx) => idx !== imageIndex);
      let newCoverIndex = v.coverIndex;
      if (v.coverIndex === imageIndex) {
        newCoverIndex = 0;
      } else if (v.coverIndex > imageIndex) {
        newCoverIndex = v.coverIndex - 1;
      }
      return {
        ...v,
        images: newImages,
        coverIndex: newCoverIndex
      };
    }));
  };

  const handleSetCoverPhoto = (variantId: string, imageIndex: number) => {
    setVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v;
      return {
        ...v,
        coverIndex: imageIndex
      };
    }));
  };

  const handleAddVariant = () => {
    setVariants(prev => {
      const newIndex = prev.length + 1;
      const indexStr = newIndex < 10 ? `0${newIndex}` : `${newIndex}`;
      return [
        ...prev,
        {
          id: `v-${Date.now()}`,
          indexText: indexStr,
          labelText: `Variant ${newIndex - 1}`,
          value: '',
          images: [],
          coverIndex: 0
        }
      ];
    });
  };

  const handleDisableVariant = (variantId: string) => {
    setVariants(prev => prev.filter(v => v.id !== variantId).map((v, i) => {
      const idxStr = (i + 1) < 10 ? `0${i + 1}` : `${i + 1}`;
      return {
        ...v,
        indexText: idxStr,
        labelText: i === 0 ? 'Default Spare Type' : `Variant ${i}`
      };
    }));
  };

  const handleSingleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setSingleImages(prev => [...prev, ...newImageUrls]);
  };

  const handleDeleteSingleImage = (imageIndex: number) => {
    setSingleImages(prev => {
      const newImages = prev.filter((_, idx) => idx !== imageIndex);
      if (singleCoverIndex === imageIndex) {
        setSingleCoverIndex(0);
      } else if (singleCoverIndex > imageIndex) {
        setSingleCoverIndex(singleCoverIndex - 1);
      }
      return newImages;
    });
  };

  const triggerFileInput = (variantId: string) => {
    document.getElementById(`input-file-${variantId}`)?.click();
  };

  const triggerSingleFileInput = () => {
    document.getElementById('input-file-single')?.click();
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <div>
              <div className={styles.breadcrumb}>
                Sewtech Spare • Products Inventory • <span>Edit Spare Details</span>
              </div>
              <h1 className={styles.pageTitle}>
                High-Speed Rotary Hook Assembly <span className={styles.skuBadge}>STH-RH-2045</span>
              </h1>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutlineRed} onClick={() => router.back()}>Discard Changes</button>
              <button className={styles.btnDark} onClick={handleSaveChanges}>Save Changes</button>
            </div>
          </div>

          {/* General Details */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>General Details</h2>
              <select className={styles.statusSelect} defaultValue="Live">
                <option value="Live">Live</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Disabled">Disabled</option>
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
                    <button type="button">14 ▼</button>
                    <button type="button"><b>B</b></button>
                    <button type="button"><i>I</i></button>
                    <button type="button"><u>U</u></button>
                    <button type="button">S</button>
                    <button type="button">🔗</button>
                    <button type="button">≣</button>
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

              <div className={styles.formGroup} style={{ visibility: 'hidden' }}></div> {/* Spacer */}

              <div className={styles.formGroup}>
                <label className={styles.label}>Manufacturer<span className={styles.required}>*</span></label>
                <select className={styles.select} defaultValue="Demo Manufacturer">
                  <option value="Demo Manufacturer">Demo Manufacturer</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Warranty<span className={styles.required}>*</span></label>
                <select className={styles.select} defaultValue="1 Yr">
                  <option value="1 Yr">1 Yr</option>
                  <option value="2 Yr">2 Yr</option>
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
                <label className={styles.label}>Weight<span className={styles.required}>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" className={styles.input} defaultValue="12" style={{ flex: 1 }} />
                  <select className={styles.select} style={{ width: '100px' }}>
                    <option>Units</option>
                  </select>
                </div>
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
              <input type="checkbox" defaultChecked /> Returnable Product
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

          {/* Product Images (with multiple variants support exactly like Screenshot 4) */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Product Images</h2>
            
            <label className={styles.checkboxLabel} style={{ marginBottom: '1.5rem' }}>
              <input 
                type="checkbox" 
                checked={isVariantsEnabled} 
                onChange={(e) => setIsVariantsEnabled(e.target.checked)} 
              /> Enable Multiple Variants
            </label>

            {isVariantsEnabled ? (
              <div className={styles.variantsSection}>
                <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                  <label className={styles.label}>Variant Type<span className={styles.required}>*</span></label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={variantType} 
                    onChange={(e) => setVariantType(e.target.value)} 
                  />
                </div>

                {variants.map((variant) => (
                  <div key={variant.id} className={styles.variantContainer}>
                    {/* Left vertical strip (gray) containing index and drag handle */}
                    <div className={styles.variantLeftStrip}>
                      <span className={styles.variantIndex}>{variant.indexText}</span>
                      <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="3" style={{ opacity: 0.8 }}>
                        <circle cx="9" cy="5" r="1.5" fill="#9ca3af" />
                        <circle cx="9" cy="12" r="1.5" fill="#9ca3af" />
                        <circle cx="9" cy="19" r="1.5" fill="#9ca3af" />
                        <circle cx="15" cy="5" r="1.5" fill="#9ca3af" />
                        <circle cx="15" cy="12" r="1.5" fill="#9ca3af" />
                        <circle cx="15" cy="19" r="1.5" fill="#9ca3af" />
                      </svg>
                    </div>

                    {/* Right main form content container */}
                    <div className={styles.variantRightBody}>
                      <div className={styles.variantHeader}>
                        <div className={styles.variantFormGroup}>
                          <label className={styles.variantLabel}>{variant.labelText}<span className={styles.required}>*</span></label>
                          <input 
                            type="text" 
                            className={styles.variantInput} 
                            value={variant.value} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants(prev => prev.map(v => v.id === variant.id ? { ...v, value: val } : v));
                            }} 
                          />
                        </div>
                        <button 
                          type="button" 
                          className={styles.btnOutlineRedSmall}
                          onClick={() => handleDisableVariant(variant.id)}
                        >
                          Disable Variant
                        </button>
                      </div>

                      <div className={styles.uploadedImagesSection}>
                        <label className={styles.label}>Upload Images<span className={styles.required}>*</span></label>
                        
                        <input 
                          type="file" 
                          id={`input-file-${variant.id}`} 
                          multiple 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(variant.id, e)}
                        />

                        {variant.images.length > 0 ? (
                          <div className={styles.variantImagesGrid}>
                            {variant.images.map((src, i) => {
                              const isCover = variant.coverIndex === i;
                              return (
                                <div key={i} className={styles.variantImageCard}>
                                  <img src={src} alt="rotary hook" className={styles.variantImage} />
                                  <button 
                                    type="button" 
                                    className={styles.deleteImageBtn}
                                    onClick={() => handleDeleteImage(variant.id, i)}
                                  >
                                    ×
                                  </button>
                                  <div 
                                    className={`${styles.coverPhotoCheckboxWrapper} ${isCover ? styles.coverPhotoSelected : ''}`}
                                    onClick={() => handleSetCoverPhoto(variant.id, i)}
                                  >
                                    <span className={`${styles.coverCheckboxBadge} ${isCover ? styles.coverCheckboxChecked : ''}`}>
                                      {isCover && '✓'}
                                    </span>
                                    <span className={styles.coverCheckboxLabel}>Cover Photo</span>
                                  </div>
                                </div>
                              );
                            })}
                            <div className={styles.variantUploadBoxSmall} onClick={() => triggerFileInput(variant.id)}>
                              <div className={styles.variantUploadBtn}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" style={{ marginBottom: '0.25rem' }}>
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="17 8 12 3 7 8"></polyline>
                                  <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Upload Photo 
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.variantUploadBoxLarge} onClick={() => triggerFileInput(variant.id)}>
                            <div className={styles.variantUploadBtnLarge}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ marginBottom: '0.5rem' }}>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                              </svg>
                              <span>Upload Photo <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>☁</span></span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  type="button" 
                  className={styles.btnAddVariant}
                  onClick={handleAddVariant}
                >
                  <span style={{ marginRight: '0.35rem', fontSize: '1rem', fontWeight: 'bold' }}>+</span> Add Variant
                </button>
              </div>
            ) : (
              <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                <label className={styles.label}>Upload Spare Images<span className={styles.required}>*</span></label>
                
                <input 
                  type="file" 
                  id="input-file-single" 
                  multiple 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={handleSingleImageUpload}
                />

                <div className={styles.singleImagesContainer}>
                  {singleImages.length > 0 ? (
                    <div className={styles.variantImagesGrid}>
                      {singleImages.map((src, i) => {
                        const isCover = singleCoverIndex === i;
                        return (
                          <div key={i} className={styles.variantImageCard}>
                            <img src={src} alt="spare image" className={styles.variantImage} />
                            <button 
                              type="button" 
                              className={styles.deleteImageBtn}
                              onClick={() => handleDeleteSingleImage(i)}
                            >
                              ×
                            </button>
                            <div 
                              className={`${styles.coverPhotoCheckboxWrapper} ${isCover ? styles.coverPhotoSelected : ''}`}
                              onClick={() => setSingleCoverIndex(i)}
                            >
                              <span className={`${styles.coverCheckboxBadge} ${isCover ? styles.coverCheckboxChecked : ''}`}>
                                {isCover && '✓'}
                              </span>
                              <span className={styles.coverCheckboxLabel}>Cover Photo</span>
                            </div>
                          </div>
                        );
                      })}
                      <div className={styles.variantUploadBoxSmall} onClick={triggerSingleFileInput}>
                        <div className={styles.variantUploadBtn}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" style={{ marginBottom: '0.25rem' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          Upload Photo 
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.variantUploadBoxLarge} onClick={triggerSingleFileInput}>
                      <div className={styles.variantUploadBtnLarge}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ marginBottom: '0.5rem' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>Upload Photo <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>☁</span></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className={styles.successCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h3 className={styles.confirmationTitle}>Changes Saved Successfully!</h3>
            <p className={styles.confirmationText}>
              The spare details have been updated successfully.
            </p>
            
            <button className={styles.btnViewAll} onClick={() => router.push(`/spares/${params.id}`)}>
              View Spare Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}
