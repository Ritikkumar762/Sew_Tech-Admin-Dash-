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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    { 
      title: 'Total Orders (Today)', 
      value: '12', 
      icon: <img src="/total order.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
    },
    { 
      title: 'Revenue (Today)', 
      value: '₹15,000', 
      icon: <img src="/money-bag-02.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
    },
    { 
      title: 'Stock Alert', 
      value: '5', 
      icon: <img src="/alert-02.svg" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />, 
      alert: true 
    },
    { 
      title: 'Open Issues', 
      value: '10', 
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
            />
            <DataTable data={filteredData} />
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
