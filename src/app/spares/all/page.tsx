'use client';
import React, { useState } from 'react';
import styles from '@/components/products-inventory/ProductsInventory.module.css';
import { StatCards } from '@/components/products-inventory/StatCards';
import { TableControls } from '@/components/products-inventory/TableControls';
import { DataTable } from '@/components/products-inventory/DataTable';
import { FilterSidebar } from '@/components/products-inventory/FilterSidebar';
import { SpareProduct } from '@/components/products-inventory/Types';

const MOCK_DATA: SpareProduct[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `sp-${i}`,
  sku: 'HC3000',
  name: 'High-Speed Rotary Hook Assembly',
  category: i === 0 ? 'Needles' : 'Rotary Hook',
  compatibleMachines: 3,
  priceMin: 1850,
  priceMax: 2400,
  stock: 45,
  stockStatus: i < 2 ? 'Out of Stock' : 'In-Stock',
  visibility: i === 0 ? 'Draft' : 'Live',
}));

export default function ProductsInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated stats
  const stats = [
    { title: 'Total Orders (Today)', value: '12', icon: '📦' },
    { title: 'Revenue (Today)', value: '₹15,000', icon: '₹' },
    { title: 'Stock Alert', value: '5', icon: '⚠️', alert: true },
    { title: 'Open Issues', value: '10', icon: '📋' },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.breadcrumb}>Sewtech Spare • Products Inventory</div>
            <h1 className={styles.pageTitle}>Products Inventory</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnDark}>Add Spare</button>
            <button className={styles.btnDark}>
              Export 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
          </div>
        </div>

        <StatCards stats={stats} />

        <div className={styles.tableCard}>
          <TableControls onSearchChange={setSearchQuery} />
          <DataTable data={MOCK_DATA} />
        </div>
      </div>
      
      <FilterSidebar />
    </div>
  );
}
