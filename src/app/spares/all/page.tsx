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

const MOCK_DATA: SpareProduct[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `sp-${i}`,
  sku: i % 2 === 0 ? 'HC3000' : 'STH-RH-2045',
  name: i % 2 === 0 ? 'Industrial Sewing Needle' : 'High-Speed Rotary Hook Assembly',
  category: i % 2 === 0 ? 'Needles' : 'Rotary Hook',
  compatibleMachines: 3,
  priceMin: 1850,
  priceMax: 2400,
  stock: i < 2 ? 0 : 45,
  stockStatus: i < 2 ? 'Out of Stock' : 'In-Stock',
  visibility: i === 0 ? 'Draft' : 'Live',
}));

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

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  // Real-time client-side filter implementation for easy backend transition
  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
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
  }, [filters]);

  // Simulated stats
  const stats = [
    { title: 'Total Orders (Today)', value: '12', icon: '📦' },
    { title: 'Revenue (Today)', value: '₹15,000', icon: '₹' },
    { title: 'Stock Alert', value: '5', icon: '⚠️', alert: true },
    { title: 'Open Issues', value: '10', icon: '📋' },
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
            <div className={styles.headerActions}>
              <button className={styles.btnDark} onClick={() => setIsOptionsModalOpen(true)}>Add Spare</button>
              <button className={styles.btnDark}>
                Export 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
            </div>
          </div>

          <StatCards stats={stats} />

          <div className={styles.tableCard}>
            <TableControls onSearchChange={handleSearchChange} />
            <DataTable data={filteredData} />
          </div>
        </div>
        
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          onClear={handleClearFilters} 
        />
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
