'use client';

import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';
import { ENDPOINTS } from '../../../lib/endpoints';
import { apiClient } from '../../../lib/api';

interface Variant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  thumbnailColor: string;
  thumbnailLetter: string;
  price: number;
  stock: number;
  variants: Variant[];
}


export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [backupProducts, setBackupProducts] = useState<Product[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const PAGE_SIZE = 10;
  const [toastConfig, setToastConfig] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3500);
  };

  const getToken = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('adminToken') ?? localStorage.getItem('auth_token') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODU1NTEwODQsImlhdCI6MTc4Mjk1OTA4NH0.riR2bGkpAAWovihDD5xMr3LNA7RkVyIcF-kzenP7T-k';
  };

  const fetchProducts = async (page = currentPage, query = debouncedSearch) => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      let url = `${ENDPOINTS.spares.inventory}?skip=${skip}&limit=${PAGE_SIZE}`;
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }
      
      const res = await apiClient.get<any>(url);
      const data = res.data || res;
      
      const rawItems = data.items || data.data || (Array.isArray(data) ? data : (Array.isArray(res) ? res : []));
      const colors = ['#fbe5d6', '#fef3c7', '#e0f2fe', '#dcfce7', '#fce7f3'];
      const mappedProducts = rawItems.map((item: any, index: number) => {
        const variants = (item.variants || []).map((v: any) => {
          let varName = '';
          if (v.name) {
            varName = v.name;
          } else if (v.attributes && typeof v.attributes === 'object' && Object.keys(v.attributes).length > 0) {
            varName = Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(', ');
          } else {
            varName = v.sku || 'Standard Variant';
          }

          return {
            id: String(v.variant_id || v.id),
            name: varName,
            sku: v.sku || item.sku || '',
            stock: Number(v.stock_quantity || 0),
            price: Number(v.effective_price ?? v.price_override ?? item.price ?? 0)
          };
        });

        const parentStock = variants.length > 0
          ? variants.reduce((sum: number, v: any) => sum + v.stock, 0)
          : Number(item.stock_quantity || 0);

        return {
          id: String(item.product_id || item.id),
          name: item.name || 'Spare Item',
          sku: item.sku || '',
          stock: parentStock,
          thumbnailColor: colors[index % colors.length],
          thumbnailLetter: item.name ? item.name.charAt(0).toUpperCase() : 'S',
          price: Number(item.price || 0),
          variants: variants
        };
      });
      setProducts(mappedProducts);
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / PAGE_SIZE)));
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchProducts(1, debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts(currentPage, debouncedSearch);
  }, [currentPage]);

  // Toggle Edit Mode
  const handleStartEdit = () => {
    setBackupProducts(JSON.parse(JSON.stringify(products))); // deep copy
    setIsEditMode(true);
    // Expand all rows by default in Edit Mode for easier bulk updates
    setExpandedRows(new Set(products.map(p => p.id)));
  };

  const handleDiscardChanges = () => {
    setProducts(backupProducts);
    setIsEditMode(false);
    setExpandedRows(new Set());
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updatePromises: Promise<any>[] = [];
      products.forEach((prod) => {
        const backupProd = backupProducts.find((b) => b.id === prod.id);
        if (!backupProd) return;

        if (prod.variants && prod.variants.length > 0) {
          let variantChanged = false;
          prod.variants.forEach((variant) => {
            const backupVar = backupProd.variants.find((b) => b.id === variant.id);
            if (!backupVar || backupVar.stock !== variant.stock || backupVar.price !== variant.price) {
              variantChanged = true;
              const updateUrl = ENDPOINTS.spares.updateVariant(prod.id, variant.id);
              updatePromises.push(
                apiClient.patch(updateUrl, {
                  stock_quantity: variant.stock,
                  price_override: variant.price
                })
              );
            }
          });
          if (variantChanged || backupProd.stock !== prod.stock || backupProd.price !== prod.price) {
            const updateUrl = `${ENDPOINTS.spares.inventory}/${prod.id}`;
            updatePromises.push(
              apiClient.patch(updateUrl, {
                stock_quantity: prod.stock,
                price: prod.price
              })
            );
          }
        } else {
          // Sync parent stock/price if no variants
          if (backupProd.stock !== prod.stock || backupProd.price !== prod.price) {
            const updateUrl = `${ENDPOINTS.spares.inventory}/${prod.id}`;
            updatePromises.push(
              apiClient.patch(updateUrl, {
                stock_quantity: prod.stock,
                price: prod.price
              })
            );
          }
        }
      });

      await Promise.all(updatePromises);
      setIsEditMode(false);
      setExpandedRows(new Set());
      await fetchProducts(currentPage);
      showToast('Changes saved successfully to Database!', 'success');
    } catch (error: any) {
      console.error('Failed to save changes:', error);
      showToast(`Failed to save changes: ${error.message || 'Error'}`, 'error');
      setIsLoading(false);
    }
  };

  // Toggle Row Expansion
  const toggleRow = (productId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && products.length > 0) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const toggleSelectProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Update variant stock quantity
  const handleUpdateVariantStock = (productId: string, variantId: string, newValue: number) => {
    if (newValue < 0 || isNaN(newValue)) return;
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id !== productId) return product;
        const updatedVariants = product.variants.map(v => {
          if (v.id !== variantId) return v;
          return { ...v, stock: newValue };
        });
        const newParentStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return {
          ...product,
          stock: newParentStock,
          variants: updatedVariants,
        };
      })
    );
  };

  // Update variant price
  const handleUpdateVariantPrice = (productId: string, variantId: string, newValue: number) => {
    if (newValue < 0 || isNaN(newValue)) return;
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id !== productId) return product;
        
        const updatedVariants = product.variants.map(v => {
          if (v.id !== variantId) return v;
          return { ...v, price: newValue };
        });

        const parentPrice = updatedVariants[0]?.price || product.price;

        return {
          ...product,
          price: parentPrice,
          variants: updatedVariants,
        };
      })
    );
  };

  // Update parent product stock quantity (when no variants exist)
  const handleUpdateProductStock = (productId: string, newValue: number) => {
    if (newValue < 0 || isNaN(newValue)) return;
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id !== productId) return product;
        return { ...product, stock: newValue };
      })
    );
  };

  // Update parent product price (when no variants exist)
  const handleUpdateProductPrice = (productId: string, newValue: number) => {
    if (newValue < 0 || isNaN(newValue)) return;
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id !== productId) return product;
        return { ...product, price: newValue };
      })
    );
  };

  // Helper calculations for parents
  const getProductStock = (product: Product) => {
    if (product.variants.length === 0) return product.stock;
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  const getProductTotalAmount = (product: Product) => {
    if (product.variants.length === 0) return product.stock * product.price;
    return product.variants.reduce((sum, v) => sum + (v.stock * v.price), 0);
  };

  // Stats calculations
  const totalStockValue = products.reduce((sum, p) => sum + getProductTotalAmount(p), 0);

  const outOfStockCount = products.reduce((sum, p) => {
    if (p.variants.length === 0) {
      return sum + (p.stock === 0 ? 1 : 0);
    }
    return sum + p.variants.filter(v => v.stock === 0).length;
  }, 0);

  const lowStockCount = products.reduce((sum, p) => {
    if (p.variants.length === 0) {
      return sum + (p.stock > 0 && p.stock < 15 ? 1 : 0);
    }
    return sum + p.variants.filter(v => v.stock > 0 && v.stock < 15).length;
  }, 0);
  const deadStockValue = 15000; // Mock stat matching Image 1

  const renderProductThumbnail = (letter: string, thumbnailColor: string) => {
    if (letter === 'R') {
      return (
        <div className={styles.thumbnailWrapper} style={{ backgroundColor: thumbnailColor }}>
          <img src="/rotary_hook.png" alt="" className={styles.thumbnail} />
        </div>
      );
    }

    let svgIcon = null;
    if (letter === 'N') {
      svgIcon = (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c55a11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v13H5M12 3v13h6" />
          <path d="M5 16c0 1.5 1 2.5 3 2.5h8c2 0 3-1 3-2.5" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="12" y1="3" x2="12" y2="16" />
        </svg>
      );
    } else if (letter === 'G') {
      svgIcon = (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2a10 10 0 0 0-10 10" />
          <path d="M12 22a10 10 0 0 0 10-10" />
          <path d="M2 12h6" />
          <path d="M16 12h6" />
        </svg>
      );
    } else if (letter === 'L') {
      svgIcon = (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18L18 6" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 6h-6v6" />
        </svg>
      );
    }

    return (
      <div className={styles.thumbnailWrapper} style={{ backgroundColor: thumbnailColor }}>
        {svgIcon ? (
          svgIcon
        ) : (
          <span style={{ color: '#c55a11', fontWeight: 'bold', fontSize: '1.1rem' }}>{letter}</span>
        )}
      </div>
    );
  };

  // Filtering is now handled by the backend
  const filteredProducts = products;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* Breadcrumb & Header */}
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.breadcrumb}>
              Sewtech Spare • <span>Products Inventory</span>
            </div>
            <h1 className={styles.pageTitle}>Products Inventory</h1>
          </div>
          <div className={styles.headerActions}>
            {!isEditMode ? (
              <button 
                onClick={handleStartEdit} 
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img 
                  src="/Update%20Inventory_button.svg" 
                  alt="Update Inventory" 
                  style={{ height: '40px', display: 'block' }} 
                />
              </button>
            ) : (
              <>
                <button className={styles.btnDiscard} onClick={handleDiscardChanges}>
                  Discard Changes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
                <button className={styles.btnSave} onClick={handleSaveChanges}>
                  Save Changes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>
          {/* Card 1: Stock Value */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitleWrapper}>
                <img src="/total order.svg" alt="Stock Value" width={24} height={24} />
                <span className={styles.statTitle}>Stock Value</span>
                <span 
                  className={styles.infoIcon}
                  onMouseEnter={() => setHoveredStat('stockValue')}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </span>
              </div>
            </div>
            <div className={styles.statValue}>₹{totalStockValue.toLocaleString('en-IN')}</div>
            
            {hoveredStat === 'stockValue' && (
              <div className={styles.tooltipPopover}>
                <div className={styles.tooltipTitle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  Stock Value Info
                </div>
                <p className={styles.tooltipText}>This represents the total valuation of your current active inventory. It calculates the sum of (stock quantity × unit price) for all spare parts.</p>
              </div>
            )}
          </div>

          {/* Card 2: Out of Stock */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitleWrapper}>
                <img src="/out of stock_red.svg" alt="Out of Stock" width={24} height={24} />
                <span className={styles.statTitle}>Out of Stock</span>
                <span 
                  className={styles.infoIcon}
                  onMouseEnter={() => setHoveredStat('outOfStock')}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </span>
              </div>
              <button className={styles.refreshBtn} title="Restock list">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
              </button>
            </div>
            <div className={styles.statValueWrapper}>
              <div className={styles.statValue}>{outOfStockCount}</div>
            </div>

            {hoveredStat === 'outOfStock' && (
              <div className={styles.tooltipPopover}>
                <div className={styles.tooltipTitle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  Out of Stock Info
                </div>
                <p className={styles.tooltipText}>Number of unique variant SKUs currently carrying a stock level of zero. Reorder actions should be triggered immediately for these items.</p>
              </div>
            )}
          </div>

          {/* Card 3: Low Stock Items */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitleWrapper}>
                <img src="/alert-02.svg" alt="Low Stock Items" width={24} height={24} />
                <span className={styles.statTitle}>Low Stock Items</span>
                <span 
                  className={styles.infoIcon}
                  onMouseEnter={() => setHoveredStat('lowStock')}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </span>
              </div>
              <button className={styles.refreshBtn} title="Review stock alerts">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
              </button>
            </div>
            <div className={styles.statValueWrapper}>
              <div className={styles.statValue}>{lowStockCount}</div>
            </div>

            {hoveredStat === 'lowStock' && (
              <div className={styles.tooltipPopover}>
                <div className={styles.tooltipTitle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  Low Stock Info
                </div>
                <p className={styles.tooltipText}>Number of active variant SKUs whose current stock level has fallen below the alert threshold (less than 15 units).</p>
              </div>
            )}
          </div>

          {/* Card 4: Dead Stock */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitleWrapper}>
                <img src="/dead_stock.svg" alt="Dead Stock" width={24} height={24} />
                <span className={styles.statTitle}>Dead Stock</span>
                <span 
                  className={styles.infoIcon}
                  onMouseEnter={() => setHoveredStat('deadStock')}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </span>
              </div>
            </div>
            <div className={styles.statValue}>₹{deadStockValue.toLocaleString('en-IN')}</div>

            {hoveredStat === 'deadStock' && (
              <div className={styles.tooltipPopover}>
                <div className={styles.tooltipTitle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  Dead Stock Info
                </div>
                <p className={styles.tooltipText}>Estimated value locked in slow-moving or completely idle inventory items that have had no sales records for over 6 months.</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls and Search */}
        <div className={styles.tableControls}>
          <div className={styles.controlGroupLeft}>
            <div className={styles.searchInputWrapper}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search by Spare Name/Code" 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select className={styles.selectBox} defaultValue="Created on">
              <option>Created on</option>
            </select>

            <button className={styles.iconBtn} title="Filter Calendar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </button>

            <select 
              className={styles.selectBox} 
              value=""
              onChange={async (e) => {
                const val = e.target.value;
                if (!val) return;
                
                if (val === 'bulk-edit') {
                  window.location.href = '/spares/bulk-edit';
                } else if (val === 'mark-out-of-stock') {
                  if (selectedProducts.size === 0) {
                    showToast('Please select products to mark out of stock.', 'error');
                    return;
                  }
                  setIsLoading(true);
                  try {
                    const updatePromises: Promise<any>[] = [];
                    products.filter(p => selectedProducts.has(p.id)).forEach(prod => {
                      if (prod.variants && prod.variants.length > 0) {
                        prod.variants.forEach(variant => {
                          const updateUrl = ENDPOINTS.spares.updateVariant(prod.id, variant.id);
                          updatePromises.push(fetch(updateUrl, {
                            method: 'PATCH',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${getToken()}`,
                              'Accept': 'application/json'
                            },
                            body: JSON.stringify({ stock_quantity: 0 })
                          }));
                        });
                      } else {
                        const updateUrl = `${ENDPOINTS.spares.inventory}/${prod.id}`;
                        updatePromises.push(fetch(updateUrl, {
                          method: 'PATCH',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`,
                            'Accept': 'application/json'
                          },
                          body: JSON.stringify({ stock_quantity: 0 })
                        }));
                      }
                    });
                    await Promise.all(updatePromises);
                    await fetchProducts(currentPage);
                    setSelectedProducts(new Set());
                    showToast('Selected products marked out of stock!', 'success');
                  } catch (err) {
                    console.error('Failed to mark out of stock', err);
                    showToast('Failed to mark out of stock. Please try again.', 'error');
                  } finally {
                    setIsLoading(false);
                  }
                } else if (val === 'export') {
                  if (selectedProducts.size === 0) {
                    showToast('Please select products to export.', 'error');
                    return;
                  }
                  const selectedData = products.filter(p => selectedProducts.has(p.id));
                  const csv = ['ID,Name,SKU,Stock,Price'];
                  selectedData.forEach(p => csv.push(`${p.id},"${p.name}","${p.sku}",${getProductStock(p)},${p.price}`));
                  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'inventory_export.csv';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }
              }}
            >
              <option value="" disabled>Bulk Actions</option>
              <option value="export">Export Details</option>
              <option value="mark-out-of-stock">Mark Out of Stock</option>
              <option value="bulk-edit">Bulk Edit Spares</option>
            </select>
          </div>

          <div className={styles.controlGroupRight}>
            <button className={styles.btnApplyFilters}>
              Apply Filters
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </button>
          </div>
        </div>

        {/* Inventory Collapsible Table */}
        <div className={styles.tableContainer}>
          {/* Table Headers */}
          <div className={styles.tableHeaderRow}>
            <div className={styles.tableHeaderCell}>
              <input 
                type="checkbox" 
                className={styles.checkbox} 
                checked={products.length > 0 && selectedProducts.size === products.length}
                onChange={handleSelectAll}
              />
            </div>
            <div className={styles.tableHeaderCell}>Spare Name <span style={{fontSize: '0.65rem', color: '#9ca3af'}}>↑↓</span></div>
            <div className={styles.tableHeaderCell}>Stock <span style={{fontSize: '0.65rem', color: '#9ca3af'}}>↑↓</span></div>
            <div className={styles.tableHeaderCell}>Price (Per Item) <span style={{fontSize: '0.65rem', color: '#9ca3af'}}>↑↓</span></div>
            <div className={styles.tableHeaderCell}>Total Amount <span style={{fontSize: '0.65rem', color: '#9ca3af'}}>↑↓</span></div>
          </div>

          {/* Table Rows */}
          {filteredProducts.map((product) => {
            const isExpanded = expandedRows.has(product.id);
            const parentStock = getProductStock(product);
            const parentAmount = getProductTotalAmount(product);

            return (
              <div 
                key={product.id} 
                className={`${styles.productBlock} ${isExpanded ? styles.productBlockExpanded : ''}`}
              >
                {/* Main Product Header Row */}
                <div 
                  className={styles.productMainRow}
                  onClick={() => toggleRow(product.id)}
                >
                  <div>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={selectedProducts.has(product.id)}
                      onChange={() => {}} 
                      onClick={(e) => toggleSelectProduct(product.id, e)} 
                    />
                  </div>
                  
                  <div className={styles.productCell}>
                    {renderProductThumbnail(product.thumbnailLetter, product.thumbnailColor)}
                    <div>
                      <div className={styles.productName}>{product.name}</div>
                      <div className={styles.productSku}>{product.sku}</div>
                    </div>
                  </div>

                  <div>
                    <div className={`${styles.dataBox} ${isExpanded ? styles.dataBoxExpanded : ''}`}>
                      {isEditMode && product.variants.length === 0 ? (
                        <div className={styles.stockEditor} onClick={e => e.stopPropagation()}>
                          <button 
                            type="button"
                            className={styles.editorBtn}
                            onClick={() => handleUpdateProductStock(product.id, parentStock - 1)}
                          >
                            −
                          </button>
                          <input 
                            type="text"
                            className={styles.editorInput}
                            value={parentStock}
                            onChange={(e) => handleUpdateProductStock(product.id, parseInt(e.target.value) || 0)}
                          />
                          <button 
                            type="button"
                            className={styles.editorBtn}
                            onClick={() => handleUpdateProductStock(product.id, parentStock + 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        parentStock
                      )}
                    </div>
                  </div>

                  <div>
                    <div className={`${styles.dataBox} ${isExpanded ? styles.dataBoxExpanded : ''}`}>
                      {isEditMode && product.variants.length === 0 ? (
                        <div className={styles.priceEditorWrapper} onClick={e => e.stopPropagation()}>
                          <span className={styles.currencySymbol}>₹</span>
                          <input 
                            type="text"
                            className={styles.priceInput}
                            value={product.price === 0 ? '' : product.price}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              handleUpdateProductPrice(product.id, parseInt(val) || 0);
                            }}
                          />
                        </div>
                      ) : (
                        `₹${product.price.toLocaleString('en-IN')}`
                      )}
                    </div>
                  </div>

                  <div>
                    <div className={`${styles.dataBox} ${isExpanded ? styles.dataBoxExpanded : ''}`}>
                      ₹{parentAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Sub Variants Rows (Expanded Mode) */}
                {isExpanded && (
                  <div className={styles.variantsContainer}>
                    {product.variants.length > 0 ? (
                      product.variants.map((variant) => (
                        <div key={variant.id} className={styles.variantRow}>
                          <div></div> {/* spacer column for checkbox align */}
                          
                          <div className={styles.variantCell}>
                            <span className={styles.variantName}>{variant.name}</span>
                            <span className={styles.variantSubtext}>{variant.sku}</span>
                          </div>

                          <div>
                            {isEditMode ? (
                              <div className={styles.stockEditor}>
                                <button 
                                  type="button"
                                  className={styles.editorBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateVariantStock(product.id, variant.id, variant.stock - 1);
                                  }}
                                >
                                  −
                                </button>
                                <input 
                                  type="text"
                                  className={styles.editorInput}
                                  value={variant.stock}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleUpdateVariantStock(product.id, variant.id, parseInt(e.target.value) || 0);
                                  }}
                                />
                                <button 
                                  type="button"
                                  className={styles.editorBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateVariantStock(product.id, variant.id, variant.stock + 1);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <div className={styles.whiteBox}>{variant.stock}</div>
                            )}
                          </div>

                          <div>
                            {isEditMode ? (
                              <div className={styles.priceEditorWrapper}>
                                <span className={styles.currencySymbol}>₹</span>
                                <input 
                                  type="text"
                                  className={styles.priceInput}
                                  value={variant.price === 0 ? '' : variant.price}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    handleUpdateVariantPrice(product.id, variant.id, parseInt(val) || 0);
                                  }}
                                />
                              </div>
                            ) : (
                              <div className={styles.whiteBox}>
                                ₹{variant.price.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className={styles.whiteBox}>
                              ₹{(variant.stock * variant.price).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Standard Item Row for Single-SKU products */
                      <div className={styles.variantRow}>
                        <div></div>
                        <div className={styles.variantCell}>
                          <span className={styles.variantName}>Standard Item (Primary Variant)</span>
                          <span className={styles.variantSubtext}>{product.sku || 'N/A'}</span>
                        </div>
                        <div>
                          {isEditMode ? (
                            <div className={styles.stockEditor} onClick={e => e.stopPropagation()}>
                              <button 
                                type="button"
                                className={styles.editorBtn}
                                onClick={() => handleUpdateProductStock(product.id, parentStock - 1)}
                              >
                                −
                              </button>
                              <input 
                                type="text"
                                className={styles.editorInput}
                                value={parentStock}
                                onChange={(e) => handleUpdateProductStock(product.id, parseInt(e.target.value) || 0)}
                              />
                              <button 
                                type="button"
                                className={styles.editorBtn}
                                onClick={() => handleUpdateProductStock(product.id, parentStock + 1)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <div className={styles.whiteBox}>{parentStock}</div>
                          )}
                        </div>
                        <div>
                          {isEditMode ? (
                            <div className={styles.priceEditorWrapper} onClick={e => e.stopPropagation()}>
                              <span className={styles.currencySymbol}>₹</span>
                              <input 
                                type="text"
                                className={styles.priceInput}
                                value={product.price === 0 ? '' : product.price}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  handleUpdateProductPrice(product.id, parseInt(val) || 0);
                                }}
                              />
                            </div>
                          ) : (
                            <div className={styles.whiteBox}>
                              ₹{product.price.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className={styles.whiteBox}>
                            ₹{parentAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Pagination Controls */}
        <div className={styles.paginationContainer}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastConfig.show && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: toastConfig.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 1100,
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastConfig.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          {toastConfig.message}
        </div>
      )}
    </div>
  );
}
