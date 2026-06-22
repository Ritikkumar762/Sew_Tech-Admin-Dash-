import React from 'react';
import styles from './ProductsInventory.module.css';

interface TableControlsProps {
  onSearchChange: (query: string) => void;
  onToggleFilters?: () => void;
  isFilterOpen?: boolean;
}

export function TableControls({ onSearchChange, onToggleFilters, isFilterOpen }: TableControlsProps) {
  return (
    <div className={styles.tableControls}>
      <div className={styles.searchInputWrapper}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          placeholder="Search by Spare Name/ Code" 
          className={styles.searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className={styles.controlGroupRight}>
        <button className={styles.dropdownBtn}>
          Created on <span className={styles.chevron}>▼</span>
        </button>
        <button className={styles.calendarBtn}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
        <select 
          className={styles.dropdownSelect} 
          defaultValue="" 
          onChange={(e) => {
            if (e.target.value === 'bulk-edit') {
              window.location.href = '/spares/bulk-edit';
            }
          }}
        >
          <option value="" disabled>Bulk Actions</option>
          <option value="bulk-edit">Bulk Edit Spares</option>
        </select>
        <button 
          className={styles.applyFiltersBtn} 
          onClick={onToggleFilters}
          style={{ backgroundColor: isFilterOpen ? '#4b5563' : '#111827' }}
        >
          {isFilterOpen ? 'Hide Filters' : 'Apply Filters'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>
    </div>
  );
}
