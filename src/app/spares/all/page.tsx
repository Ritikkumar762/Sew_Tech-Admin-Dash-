'use client';
import React, { useState, useMemo } from 'react';
import styles from '@/components/products-inventory/ProductsInventory.module.css';
import { StatCards } from '@/components/products-inventory/StatCards';
import { TableControls } from '@/components/products-inventory/TableControls';
import { DataTable } from '@/components/products-inventory/DataTable';
import { FilterSidebar } from '@/components/products-inventory/FilterSidebar';
import { SpareProduct, FilterState } from '@/components/products-inventory/Types';
import { AddSpareModal } from '@/components/products-inventory/AddSpareModal';
import { BulkUploadFlow } from '@/components/products-inventory/BulkUploadFlow';
import { useRouter } from 'next/navigation';
import { apiClient, exportToCSV } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  categories: [],
  stockStatus: [],
  compatibilityBrand: '',
  compatibilityMachineType: '',
  priceMin: '',
  priceMax: '',
  visibility: [],
  createdOn: '',
  modifiedOn: '',
};

export default function ProductsInventoryPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [data, setData] = useState<SpareProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([]);

  const fetchSpares = async () => {
    setIsLoading(true);
      try {
        let url = `${ENDPOINTS.spares.inventory}?skip=0&limit=100`;
        
        if (filters.searchQuery) {
          url += `&q=${encodeURIComponent(filters.searchQuery)}`;
        }
        
        if (filters.stockStatus.length > 0) {
          const hasInStock = filters.stockStatus.includes('In-Stock');
          const hasOutStock = filters.stockStatus.includes('Out-of-Stock');
          if (hasInStock && !hasOutStock) {
            url += `&in_stock=true`;
          } else if (hasOutStock && !hasInStock) {
            url += `&in_stock=false`;
          }
        }
        
        if (filters.visibility.length === 1) {
          const vis = filters.visibility[0];
          if (vis === 'Live') url += `&status=PUBLISHED`;
          else if (vis === 'Draft') url += `&status=DRAFT`;
          else if (vis === 'Under Review') url += `&status=PENDING_REVIEW`;
          else if (vis === 'Archive') url += `&status=ARCHIVED`;
        }

        const res = await apiClient.get<any>(url);
        
        let items = [];
        if (res?.data?.items && Array.isArray(res.data.items)) {
          items = res.data.items;
        } else if (res?.items && Array.isArray(res.items)) {
          items = res.items;
        } else if (res?.data && Array.isArray(res.data)) {
          items = res.data;
        } else if (Array.isArray(res)) {
          items = res;
        } else {
          console.error("Failed to parse items array from response:", res);
        }

        if (items.length > 0) {
          const extractedCategories = items.map((item: any) => 
            typeof item.category === 'object' ? item.category?.name : item.category
          ).filter(Boolean);

          const extractedBrands = items.map((item: any) => 
            typeof item.brand === 'object' ? item.brand?.name : item.brand
          ).filter(Boolean);

          setCategoriesList(prev => Array.from(new Set([...prev, ...extractedCategories])));
          setBrandsList(prev => Array.from(new Set([...prev, ...extractedBrands])));

          setData(items.map((item: any) => {
          const variants = item.variants || [];
          const tags = item.tags || [];
          const stock = variants.length > 0
            ? variants.reduce((sum: number, v: any) => sum + Number(v.stock_quantity || 0), 0)
            : Number(item.stock_quantity || 0);

          let compCount = 0;
          if (Array.isArray(item.compatibility)) {
            compCount = item.compatibility.length;
          } else if (typeof item.compatibility === 'string' && item.compatibility.trim()) {
            compCount = item.compatibility.split(',').filter(Boolean).length;
          } else if (item.specifications?.['Tags']) {
            compCount = item.specifications['Tags'].split(',').filter(Boolean).length;
          } else if (tags.length > 0) {
            compCount = tags.length;
          } else if (variants.length > 0) {
            compCount = variants.length;
          } else {
            compCount = 1;
          }

          let visibilityStatus = 'Draft';
          if (item.status === 'PUBLISHED') visibilityStatus = 'Live';
          else if (item.status === 'DRAFT') visibilityStatus = 'Draft';
          else if (item.status === 'PENDING_REVIEW') visibilityStatus = 'Under Review';
          else if (item.status === 'ARCHIVED') visibilityStatus = 'Archive';
          else if (item.status === 'SUSPENDED') visibilityStatus = 'Suspended';
          else if (item.status) visibilityStatus = item.status;

          const variantPrices = variants
            .map((v: any) => Number(v.effective_price ?? v.price_override))
            .filter((p: number) => !isNaN(p) && p > 0);

          const itemActivePrice = (item.discount_price && Number(item.discount_price) > 0)
            ? Number(item.discount_price)
            : Number(item.price || 0);

          const effectiveMinPrice = item.price_from !== undefined && item.price_from !== null
            ? Number(item.price_from)
            : (variantPrices.length > 0 ? Math.min(...variantPrices) : itemActivePrice);

          const isDiscounted = item.discount_price && Number(item.discount_price) > 0 && Number(item.discount_price) < Number(item.price);
          const displayPriceMax = isDiscounted ? Number(item.discount_price) : 0;
          const displayPriceMin = isDiscounted ? Number(item.price) : effectiveMinPrice;

          return {
            id: String(item.product_id || item.id),
            sku: item.sku || '',
            name: item.name || '',
            category: (typeof item.category === 'object' ? item.category?.name : item.category) || 'General',
            brand: (typeof item.brand === 'object' ? item.brand?.name : item.brand) || '',
            compatibleMachines: compCount,
            priceMin: displayPriceMin,
            priceMax: displayPriceMax,
            stock: stock,
            stockStatus: stock > 0 ? 'In-Stock' : 'Out of Stock',
            visibility: visibilityStatus,
          };
        }));
      } else {
        setData([]);
      }
    } catch (err) {
      console.warn('Spares API request error or timeout, resetting data:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await apiClient.get<any>(ENDPOINTS.admin.dashboard.smartView);
      const kpis = res.module_health_kpis?.st_spares || {};
      setDashboardStats(kpis);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  React.useEffect(() => {
    fetchSpares();
  }, [filters.searchQuery, filters.stockStatus, filters.visibility]);

  React.useEffect(() => {
    fetchDashboardStats();

    // Fetch dynamic categories and brands from backend
    const loadAllCategoriesAndBrands = async () => {
      const extractedCatNames = new Set<string>();
      const extractedBrandNames = new Set<string>();

      const addCategoryName = (c: any) => {
        if (!c) return;
        if (typeof c === 'string' && c.trim()) extractedCatNames.add(c.trim());
        if (typeof c === 'object') {
          if (c.name && typeof c.name === 'string') extractedCatNames.add(c.name.trim());
          if (c.category_name && typeof c.category_name === 'string') extractedCatNames.add(c.category_name.trim());
          if (Array.isArray(c.children)) c.children.forEach(addCategoryName);
          if (Array.isArray(c.subcategories)) c.subcategories.forEach(addCategoryName);
        }
      };

      const addBrandName = (b: any) => {
        if (!b) return;
        if (typeof b === 'string' && b.trim()) extractedBrandNames.add(b.trim());
        if (typeof b === 'object') {
          if (b.name && typeof b.name === 'string') extractedBrandNames.add(b.name.trim());
          if (b.brand_name && typeof b.brand_name === 'string') extractedBrandNames.add(b.brand_name.trim());
        }
      };

      try {
        const resMart = await apiClient.get<any>(`${ENDPOINTS.mart.categories}?root_only=false`).catch(() => null);
        const martCats = resMart?.data || resMart?.items || (Array.isArray(resMart) ? resMart : []);
        if (Array.isArray(martCats)) martCats.forEach(addCategoryName);
      } catch (e) { console.warn('Mart categories fetch error:', e); }

      try {
        const resMdm = await apiClient.get<any>(ENDPOINTS.mdm.categories).catch(() => null);
        const mdmCats = resMdm?.data || resMdm?.items || (Array.isArray(resMdm) ? resMdm : []);
        if (Array.isArray(mdmCats)) mdmCats.forEach(addCategoryName);
      } catch (e) { console.warn('Mdm categories fetch error:', e); }

      try {
        const resBrands = await apiClient.get<any>(ENDPOINTS.mart.brands).catch(() => null);
        const brandItems = resBrands?.data || resBrands?.items || (Array.isArray(resBrands) ? resBrands : []);
        if (Array.isArray(brandItems)) brandItems.forEach(addBrandName);
      } catch (e) { console.warn('Brands API fetch error:', e); }

      if (extractedCatNames.size > 0) {
        setCategoriesList(prev => Array.from(new Set([...prev, ...Array.from(extractedCatNames)])));
      }
      if (extractedBrandNames.size > 0) {
        setBrandsList(prev => Array.from(new Set([...prev, ...Array.from(extractedBrandNames)])));
      }
    };

    loadAllCategoriesAndBrands();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === data.length && data.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(d => d.id)));
    }
  };

  const handleMarkOutOfStock = async () => {
    if (selectedIds.size === 0) {
      alert('Please select at least one item');
      return;
    }
    try {
      await Promise.all(Array.from(selectedIds).map(id => 
        apiClient.patch(`${ENDPOINTS.spares.inventory}/${id}`, { stock_quantity: 0 })
      ));
      alert('Items marked as out of stock successfully');
      setSelectedIds(new Set());
      fetchSpares();
    } catch (err) {
      console.error('Failed to mark out of stock', err);
      alert('Failed to mark items out of stock');
    }
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Category Filter
      if (filters.categories.length > 0) {
        const matchCat = filters.categories.some(c => 
          c.toLowerCase() === item.category.toLowerCase() ||
          item.category.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(item.category.toLowerCase())
        );
        if (!matchCat) return false;
      }

      // Visibility Filter
      if (filters.visibility.length > 0 && !filters.visibility.includes(item.visibility)) {
        return false;
      }

      // Stock Status Filter
      if (filters.stockStatus.length > 0) {
        const matchStock = filters.stockStatus.some(st => {
          if (st === 'In-Stock') return item.stock > 0;
          if (st === 'Out-of-Stock' || st === 'Out of Stock') return item.stock === 0;
          if (st === 'Low Stock' || st === 'Low Stock (<5)') return item.stock > 0 && item.stock < 5;
          if (st === 'Dead Stock' || st === 'Dead Stock (Idle > 6 Months)') return item.stockStatus === 'Dead Stock' || item.stock === 0;
          return true;
        });
        if (!matchStock) return false;
      }

      // Compatible Brand Filter
      if (filters.compatibilityBrand && filters.compatibilityBrand.trim() !== '') {
        const b = filters.compatibilityBrand.toLowerCase();
        const matchBrand = (item.brand && item.brand.toLowerCase().includes(b)) ||
                           (item.name && item.name.toLowerCase().includes(b));
        if (!matchBrand) return false;
      }

      // Price Range Filter
      if (filters.priceMin && !isNaN(Number(filters.priceMin))) {
        if (item.priceMin < Number(filters.priceMin)) return false;
      }
      if (filters.priceMax && !isNaN(Number(filters.priceMax))) {
        if (item.priceMin > Number(filters.priceMax)) return false;
      }

      return true;
    });
  }, [data, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // Simulated stats
  const stats = [
    { 
      title: 'Total Orders (Today)', 
      value: dashboardStats?.total_orders_today ?? '0', 
      icon: <img src="/total order.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
    },
    { 
      title: 'Revenue (Today)', 
      value: dashboardStats?.revenue_today ? `₹${dashboardStats.revenue_today.toLocaleString()}` : '₹0', 
      icon: <img src="/money-bag-02.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
    },
    { 
      title: 'Stock Alert', 
      value: data.filter(d => d.stock <= 5).length.toString(), 
      icon: <img src="/alert-02.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />, 
      alert: true 
    },
    { 
      title: 'Open Issues', 
      value: dashboardStats?.open_issues ?? '0', 
      icon: <img src="/laptop-issue.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
    },
  ];

  const handleExportExcel = async () => {
    try {
      const res = await apiClient.get<any>(`${ENDPOINTS.spares.inventory}?skip=0&limit=1000`);
      let items: any[] = [];
      if (res?.data?.items && Array.isArray(res.data.items)) {
        items = res.data.items;
      } else if (res?.items && Array.isArray(res.items)) {
        items = res.items;
      } else if (res?.data && Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res)) {
        items = res;
      } else {
        items = data;
      }

      if (!items || items.length === 0) {
        alert("No product data available to export.");
        return;
      }

      const exportRows = items.map((item: any) => {
        const variants = item.variants || [];
        const stock = variants.length > 0
          ? variants.reduce((sum: number, v: any) => sum + Number(v.stock_quantity || 0), 0)
          : Number(item.stock_quantity || 0);

        const listPrice = Number(item.price || 0);
        const sellingPrice = (item.discount_price && Number(item.discount_price) > 0)
          ? Number(item.discount_price)
          : listPrice;

        return {
          "Product ID": item.product_id || item.id || '',
          "SKU": item.sku || '',
          "Spare Name": item.name || '',
          "Category": (typeof item.category === 'object' ? item.category?.name : item.category) || 'General',
          "Brand": (typeof item.brand === 'object' ? item.brand?.name : item.brand) || '',
          "Selling Price (₹)": sellingPrice,
          "List Price (₹)": listPrice,
          "Stock Quantity": stock,
          "Stock Status": stock > 0 ? 'In-Stock' : 'Out of Stock',
          "Visibility Status": item.status || 'DRAFT',
          "Description": item.description || ''
        };
      });

      const fileName = `spares_inventory_export_${new Date().toISOString().slice(0, 10)}`;
      exportToCSV(fileName, exportRows);
    } catch (err) {
      console.error("Export failed, falling back to local data:", err);
      if (data.length > 0) {
        const fallbackRows = data.map(item => ({
          "Product ID": item.id,
          "SKU": item.sku,
          "Spare Name": item.name,
          "Category": item.category,
          "Brand": item.brand || '',
          "Price (₹)": item.priceMin,
          "Stock": item.stock,
          "Stock Status": item.stockStatus,
          "Visibility": item.visibility
        }));
        exportToCSV(`spares_inventory_export_${new Date().toISOString().slice(0, 10)}`, fallbackRows);
      } else {
        alert("Failed to export products data.");
      }
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <div>
              <div className={styles.breadcrumb}>Sewtech Spare • Products Inventory</div>
              <h1 className={styles.pageTitle}>Products Inventory</h1>
            </div>
            <div className={styles.headerActions} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={() => setIsOptionsModalOpen(true)}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 5.33331V10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33337 8H10.6667" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Spare
              </button>
              <button 
                onClick={handleExportExcel}
                title="Export all products data to Excel"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src="/Export button _logo.svg" alt="Export" style={{ width: '112px', height: '40px', display: 'block' }} />
              </button>
            </div>
          </div>

          <StatCards stats={stats} />

          <div className={styles.tableCard}>
            <TableControls 
              onSearchChange={handleSearchChange} 
              onToggleFilters={() => setIsFilterOpen(prev => !prev)}
              isFilterOpen={isFilterOpen}
              onMarkOutOfStock={handleMarkOutOfStock}
            />
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading inventory...</div>
            ) : (
              <DataTable 
                data={paginatedData} 
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(size) => { setRowsPerPage(size); setCurrentPage(1); }}
              />
            )}
          </div>
        </div>
        
        {isFilterOpen && (
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters} 
            onClose={() => setIsFilterOpen(false)}
            categoriesList={categoriesList}
            brandsList={brandsList}
          />
        )}
      </div>

      <AddSpareModal 
        isOpen={isOptionsModalOpen} 
        onClose={() => setIsOptionsModalOpen(false)} 
        onBulkUpload={() => {
          setIsOptionsModalOpen(false);
          setIsBulkUploadOpen(true);
        }}
        onEnterManually={() => {
          setIsOptionsModalOpen(false);
          router.push('/spares/add');
        }}
      />

      <BulkUploadFlow 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
      />
    </>
  );
}
