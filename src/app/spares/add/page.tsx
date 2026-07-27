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
  const [isVariantsEnabled, setIsVariantsEnabled] = useState(false);
  const [variantType, setVariantType] = useState('Variant');

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [dbTagsList, setDbTagsList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [selectedBrandId, setSelectedBrandId] = useState<number>(5004);
  const [material, setMaterial] = useState<string>('High-Carbon Steel');
  const [warranty, setWarranty] = useState<string>('1 Yr');
  const [compatibility, setCompatibility] = useState<string>('Single Needle Lockstitch Machine');
  const [tagsList, setTagsList] = useState<string[]>(['Rotary Hook', 'Spare Part']);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');

  React.useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const catRes = await apiClient.get<any>(`${ENDPOINTS.mart.categories}?root_only=false`).catch(() => null);
        if (Array.isArray(catRes)) {
          setCategoriesList(catRes);
          if (catRes.length > 0) setSelectedCategoryId(catRes[0].category_id);
        } else if (catRes?.data && Array.isArray(catRes.data)) {
          setCategoriesList(catRes.data);
          if (catRes.data.length > 0) setSelectedCategoryId(catRes.data[0].category_id);
        }
      } catch { /* Silent fallback */ }

      try {
        const brandRes = await apiClient.get<any>(ENDPOINTS.mart.brands).catch(() => null);
        let rawBrands: any[] = [];
        if (Array.isArray(brandRes)) {
          rawBrands = brandRes;
        } else if (brandRes?.data && Array.isArray(brandRes.data)) {
          rawBrands = brandRes.data;
        }

        const seenNames = new Set<string>();
        const cleanBrands = rawBrands.filter(b => {
          if (!b || !b.name) return false;
          const nameLower = b.name.trim().toLowerCase();
          if (seenNames.has(nameLower)) return false;
          seenNames.add(nameLower);
          return true;
        });

        if (cleanBrands.length > 0) {
          setBrandsList(cleanBrands);
          setSelectedBrandId(cleanBrands[0].brand_id);
        }
      } catch { /* Silent fallback */ }

      try {
        const tagRes = await apiClient.get<any>(ENDPOINTS.mart.tags).catch(() => null);
        if (Array.isArray(tagRes)) {
          setDbTagsList(tagRes);
        } else if (tagRes?.data && Array.isArray(tagRes.data)) {
          setDbTagsList(tagRes.data);
        }
      } catch { /* Silent fallback */ }
    };
    fetchMasterData();
  }, []);

  interface VariantState {
    id: string;
    indexText: string;
    labelText: string;
    value: string;
    price?: string;
    stock?: string;
    images: string[];
    coverIndex: number;
  }

  const [variants, setVariants] = useState<VariantState[]>([
    {
      id: `v-${Date.now()}`,
      indexText: '01',
      labelText: 'Default Spare Type',
      value: '',
      price: '',
      stock: '',
      images: [],
      coverIndex: 0
    }
  ]);
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
        const payload: any = {
          name: formData.name || 'Untitled Spare',
          description: formData.description || 'No description',
          price: Number(formData.price) || 1, // default to 1 to avoid <=0 errors
          discount_price: formData.sale_price ? Number(formData.sale_price) : undefined,
          stock_quantity: Number(formData.stock_quantity) || 0,
          category_id: selectedCategoryId || 1,
          brand_id: selectedBrandId || 5004,
          tag_ids: selectedTagIds.length > 0 ? selectedTagIds : (dbTagsList.length > 0 ? [dbTagsList[0].tag_id] : []),
          compatibility: [compatibility],
          status: status === 'Live' ? 'PUBLISHED' : (status === 'Draft' ? 'DRAFT' : 'PENDING_REVIEW'),
          sku: formData.sku || `STH-RH-${Date.now().toString().slice(-4)}`,
          specifications: {
            "Product Dimensions": `${formData.length || 0}x${formData.width || 0}x${formData.height || 0}`,
            "Net Quantity": formData.net_quantity || '1 Unit',
            "Item Weight": formData.weight ? `${formData.weight}g` : 'N/A',
            "Material": material,
            "Warranty": warranty,
            "Tags": tagsList.join(', ')
          },
          images: uploadedImages.map((file, i) => ({
             image_url: URL.createObjectURL(file), // Mock URL until backend supports image upload
             is_primary: i === 0
          }))
        };
        
        if (formData.weight && Number(formData.weight) >= 1) {
          payload.weight_grams = Number(formData.weight);
        }
        
        if (formData.low_stock_threshold && Number(formData.low_stock_threshold) >= 1) {
          payload.low_stock_threshold = Number(formData.low_stock_threshold);
        }
        
        const response = await apiClient.post(ENDPOINTS.seller.products, payload);
        const newProduct = (response as any).data || response;
        
        // Products are created as DRAFT by default. If 'Live' or 'Under Review' was selected, update it.
        if (status === 'Live' && newProduct?.product_id) {
           await apiClient.put(ENDPOINTS.admin.productStatus(String(newProduct.product_id)), { status: 'PUBLISHED' });
        } else if (status === 'Under Review' && newProduct?.product_id) {
           await apiClient.put(ENDPOINTS.admin.productStatus(String(newProduct.product_id)), { status: 'PENDING_REVIEW' });
        } else if (status === 'Draft' && newProduct?.product_id) {
           await apiClient.put(ENDPOINTS.admin.productStatus(String(newProduct.product_id)), { status: 'DRAFT', reason: 'Saved as draft by admin' });
        }
        
        // Add variants if enabled
        if (isVariantsEnabled && variants.length > 0 && newProduct?.product_id) {
           for (const v of variants) {
              if (!v.value) continue;
              const variantPayload = {
                 name: v.labelText || `${variantType}: ${v.value}`,
                 sku_suffix: `V-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*1000)}`,
                 attributes: { [variantType]: v.value },
                 price_override: (v.price && !isNaN(Number(v.price))) ? Number(v.price) : (formData.price ? Number(formData.price) : 0),
                 stock_quantity: (v.stock && !isNaN(Number(v.stock))) ? Number(v.stock) : (formData.stock_quantity ? Number(formData.stock_quantity) : 0)
              };
              try {
                await apiClient.post(ENDPOINTS.seller.variants(String(newProduct.product_id)), variantPayload);
              } catch (variantErr) {
                console.error("Failed to add variant", v, variantErr);
              }
           }
        }

        setShowConfirmation(true);
    } catch (err: any) {
      console.error('Failed to add spare', err);
      alert(`Failed to add spare. Error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
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

  const triggerFileInput = (variantId: string) => {
    document.getElementById(`input-file-${variantId}`)?.click();
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
              <select 
                className={styles.select}
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
                {categoriesList.length > 0 ? (
                  categoriesList.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))
                ) : (
                  <>
                    <option value={1}>Rotary Hook</option>
                    <option value={2}>Needles</option>
                    <option value={3}>Hookset</option>
                    <option value={4}>Knives</option>
                    <option value={5}>Presser Feet</option>
                    <option value={6}>Bobbins</option>
                  </>
                )}
              </select>
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
                {material ? (
                  <span className={styles.tagPill}>{material} <span className={styles.tagClose} onClick={() => setMaterial('')}>×</span></span>
                ) : null}
                <input 
                  type="text"
                  style={{ border: 'none', outline: 'none', fontSize: '0.85rem', flex: 1, minWidth: '80px' }}
                  placeholder="Enter material (e.g. High-Carbon Steel)..."
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Manufacturer<span className={styles.required}>*</span></label>
              <select 
                className={styles.select}
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(Number(e.target.value))}
              >
                {brandsList.length > 0 ? (
                  brandsList.map(brand => (
                    <option key={brand.brand_id} value={brand.brand_id}>{brand.name}</option>
                  ))
                ) : (
                  <>
                    <option value={5004}>Juki</option>
                    <option value={1}>Brother</option>
                    <option value={2}>Singer</option>
                    <option value={3}>Organ</option>
                  </>
                )}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Warranty<span className={styles.required}>*</span></label>
              <select 
                className={styles.select}
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              >
                <option value="1 Yr">1 Yr</option>
                <option value="6 Months">6 Months</option>
                <option value="2 Yrs">2 Yrs</option>
                <option value="No Warranty">No Warranty</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tags</label>
              <div className={styles.tagsContainer} style={{ flexWrap: 'wrap', gap: '6px' }}>
                {tagsList.map((tag, idx) => (
                  <span key={idx} className={styles.tagPill}>
                    {tag} <span className={styles.tagClose} onClick={() => setTagsList(tagsList.filter((_, i) => i !== idx))}>×</span>
                  </span>
                ))}
                <input 
                  type="text"
                  style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '100px' }}
                  placeholder="+ Add tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTagInput.trim()) {
                      e.preventDefault();
                      setTagsList([...tagsList, newTagInput.trim()]);
                      setNewTagInput('');
                    }
                  }}
                />
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
              <select 
                className={styles.select}
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(Number(e.target.value))}
              >
                {brandsList.length > 0 ? (
                  brandsList.map(b => (
                    <option key={b.brand_id} value={b.brand_id}>{b.name}</option>
                  ))
                ) : (
                  <>
                    <option value={5004}>Apple</option>
                    <option value={5005}>Juki</option>
                    <option value={5006}>Brother</option>
                    <option value={5007}>Singer</option>
                  </>
                )}
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
                <option>Grams (g)</option>
                <option>Kg</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Material<span className={styles.required}>*</span></label>
              <select 
                className={styles.select}
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="High-Carbon Steel">High-Carbon Steel</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Tungsten Carbide">Tungsten Carbide</option>
                <option value="Alloy Steel">Alloy Steel</option>
                <option value="Titanium Coated">Titanium Coated</option>
                <option value="Cast Iron">Cast Iron</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Spare Compatibility<span className={styles.required}>*</span></label>
              <select 
                className={styles.select}
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
              >
                <option value="Single Needle Lockstitch Machine">Single Needle Lockstitch Machine</option>
                <option value="Heavy Duty Industrial Machine">Heavy Duty Industrial Machine</option>
                <option value="Overlock Sewing Machine">Overlock Sewing Machine</option>
                <option value="Embroidery Machine">Embroidery Machine</option>
                <option value="Zig-Zag Stitch Machine">Zig-Zag Stitch Machine</option>
                <option value="Universal Compatibility">Universal Compatibility</option>
              </select>
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

        {/* Product Images (with multiple variants support) */}
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
                    <div className={styles.variantHeader} style={{ alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', flex: 1 }}>
                        <div className={styles.variantFormGroup}>
                          <label className={styles.variantLabel}>{variant.labelText}<span className={styles.required}>*</span></label>
                          <input 
                            type="text" 
                            className={styles.variantInput} 
                            value={variant.value} 
                            placeholder="e.g. 5 mm"
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants(prev => prev.map(v => v.id === variant.id ? { ...v, value: val } : v));
                            }} 
                          />
                        </div>
                        <div className={styles.variantFormGroup}>
                          <label className={styles.variantLabel}>Variant Price (₹)</label>
                          <input 
                            type="number" 
                            className={styles.variantInput} 
                            value={variant.price || ''} 
                            placeholder="Override price"
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants(prev => prev.map(v => v.id === variant.id ? { ...v, price: val } : v));
                            }} 
                          />
                        </div>
                        <div className={styles.variantFormGroup}>
                          <label className={styles.variantLabel}>Variant Stock</label>
                          <input 
                            type="number" 
                            className={styles.variantInput} 
                            value={variant.stock || ''} 
                            placeholder="Stock qty"
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants(prev => prev.map(v => v.id === variant.id ? { ...v, stock: val } : v));
                            }} 
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className={styles.btnOutlineRedSmall}
                        style={{ marginTop: '1.6rem' }}
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
                                <img src={src} alt="variant photo" className={styles.variantImage} />
                                <button 
                                  type="button" 
                                  className={styles.deleteImageBtn}
                                  onClick={() => handleDeleteImage(variant.id, i)}
                                >
                                  ×
                                </button>
                                {isCover ? (
                                  <div 
                                    onClick={() => handleSetCoverPhoto(variant.id, i)}
                                    style={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      height: '36px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <img src="/cover photo.svg" alt="Cover Photo" style={{ width: '100%', height: '100%', display: 'block' }} />
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => handleSetCoverPhoto(variant.id, i)}
                                    style={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      height: '36px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: '#ffffff',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '8px',
                                      boxSizing: 'border-box'
                                    }}
                                  >
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      color: '#64748B',
                                      fontSize: '11px',
                                      fontWeight: 600
                                    }}>
                                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="16" height="16" rx="4" fill="#F1F5F9" />
                                        <path d="M12 6L7 11L4 8" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <span>Cover Photo</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div 
                            onClick={() => triggerFileInput(variant.id)}
                            style={{
                              border: '1.5px dashed #3B82F6',
                              backgroundColor: '#EFF6FF',
                              borderRadius: '8px',
                              height: '120px',
                              width: '120px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxSizing: 'border-box'
                            }}
                          >
                            <img src="/upload photo.svg" alt="Upload Photo" style={{ width: '115px', height: '36px', objectFit: 'contain' }} />
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => triggerFileInput(variant.id)}
                          style={{
                            border: '1.5px dashed #3B82F6',
                            backgroundColor: '#EFF6FF',
                            borderRadius: '8px',
                            height: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        >
                          <img src="/upload photo.svg" alt="Upload Photo" style={{ width: '131px', height: '40px', objectFit: 'contain' }} />
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
          )}
        </div>

        {/* Product Banner */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}>Product Banner</h2>
          <div style={{ borderBottom: '1px dashed #e2e8f0', marginBottom: '1.5rem' }} />
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ marginBottom: '0.75rem', display: 'block' }}>Select Banner<span className={styles.required}>*</span></label>
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
                    <div className={`${styles.bannerCheckCircle} ${banner.selected ? styles.bannerCheckCircleSelected : ''}`}>
                      {banner.selected && (
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <img src={banner.url} alt={`Banner ${banner.id}`} className={styles.bannerImage} />
                  </div>
                ))}
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
