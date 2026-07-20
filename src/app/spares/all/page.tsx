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
import { apiClient } from '@/lib/api';
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

  const fetchSpares = async () => {
    setIsLoading(true);
      try {
        const res = await apiClient.get<any>(`${ENDPOINTS.spares.inventory}?skip=0&limit=100`);
        
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
          setData(items.map((item: any) => {
          const variants = item.variants || [];
          const stock = variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) + (item.stock_quantity || 0);
          return {
            id: String(item.product_id || item.id),
            sku: item.sku || '',
            name: item.name || '',
            category: (typeof item.category === 'object' ? item.category?.name : item.category) || 'General',
            compatibleMachines: 3,
            priceMin: Number(item.price) || 0,
            priceMax: Number(item.discount_price) || 0,
            stock: stock,
            stockStatus: stock > 0 ? 'In-Stock' : 'Out of Stock',
            visibility: 'Live',
          };
        }));
      }
    } catch (err) {
      console.error('Failed to fetch spares', err);
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
    fetchDashboardStats();
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

  // Real-time client-side filter implementation for easy backend transition
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) return false;
      }

      // 2. Categories
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      // 3. Stock Status
      if (filters.stockStatus.length > 0) {
        const matchesStatus = filters.stockStatus.some(status => {
          if (status === 'Out-of-Stock') return item.stockStatus === 'Out of Stock';
          if (status === 'In-Stock') return item.stockStatus === 'In-Stock';
          return false; // Low Stock / Dead stock placeholder logic
        });
        if (!matchesStatus) return false;
      }

      // 4. Visibility
      if (filters.visibility.length > 0 && !filters.visibility.includes(item.visibility)) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

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
              <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
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
                data={filteredData} 
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
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
