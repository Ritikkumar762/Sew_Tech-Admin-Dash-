import React from 'react';
import styles from './ProductsInventory.module.css';
import { FilterState } from './Types';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
}

export function FilterSidebar({ filters, setFilters, onClear }: FilterSidebarProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && value !== 'Select Category' && !filters.categories.includes(value)) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    }
    e.target.value = 'Select Category';
  };

  const removeCategory = (cat: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== cat)
    }));
  };

  const handleStockStatusChange = (status: string) => {
    setFilters(prev => {
      const isChecked = prev.stockStatus.includes(status);
      const newStatus = isChecked
        ? prev.stockStatus.filter(s => s !== status)
        : [...prev.stockStatus, status];
      return { ...prev, stockStatus: newStatus };
    });
  };

  const handleVisibilityChange = (vis: string) => {
    setFilters(prev => {
      const isChecked = prev.visibility.includes(vis);
      const newVis = isChecked
        ? prev.visibility.filter(v => v !== vis)
        : [...prev.visibility, vis];
      return { ...prev, visibility: newVis };
    });
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRadioChange = (field: 'createdOn' | 'modifiedOn', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field] === value ? '' : value // toggle off if clicked again
    }));
  };

  return (
    <div className={styles.filterSidebar}>
      <div className={styles.filterHeader}>
        <h2>Filters</h2>
        <button className={styles.clearFiltersBtn} onClick={onClear}>Clear Filters ⊗</button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Category <span className={styles.chevron}>▼</span>
        </div>
        <select className={styles.filterSelect} onChange={handleCategoryChange} defaultValue="Select Category">
          <option value="Select Category">Select Category</option>
          <option value="Needles">Needles</option>
          <option value="Rotary Hook">Rotary Hook</option>
          <option value="Hookset">Hookset</option>
          <option value="Knives">Knives</option>
        </select>
        <div className={styles.pills}>
          {filters.categories.map(cat => (
            <span key={cat} className={styles.pill} onClick={() => removeCategory(cat)}>
              {cat} ⊗
            </span>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Stock Status <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.checkboxList}>
          {[
            { id: 'In-Stock', label: 'In-Stock' },
            { id: 'Out-of-Stock', label: 'Out-of-Stock' },
            { id: 'Low Stock', label: 'Low Stock (<5)' },
            { id: 'Dead Stock', label: 'Dead Stock (Idle > 6 Months)' }
          ].map(item => (
            <label key={item.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.stockStatus.includes(item.id)}
                onChange={() => handleStockStatusChange(item.id)}
              />{' '}
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Compatibility <span className={styles.chevron}>▼</span>
        </div>
        <select
          className={styles.filterSelect}
          style={{ marginBottom: '0.5rem' }}
          value={filters.compatibilityBrand}
          onChange={(e) => setFilters(prev => ({ ...prev, compatibilityBrand: e.target.value }))}
        >
          <option value="">Compatible Brand</option>
          <option value="Juki">Juki</option>
          <option value="Brother">Brother</option>
          <option value="Singer">Singer</option>
        </select>
        <select
          className={styles.filterSelect}
          value={filters.compatibilityMachineType}
          onChange={(e) => setFilters(prev => ({ ...prev, compatibilityMachineType: e.target.value }))}
        >
          <option value="">Compatible Machine Type</option>
          <option value="Lockstitch">Lockstitch</option>
          <option value="Overlock">Overlock</option>
        </select>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Price Range <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.priceInputs}>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              type="text"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => handlePriceChange('priceMin', e.target.value)}
              className={styles.priceInput}
            />
          </div>
          <span className={styles.priceSeparator}>-</span>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              type="text"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => handlePriceChange('priceMax', e.target.value)}
              className={styles.priceInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Visibility <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.visibilityGrid}>
          {['Live', 'Archive', 'Draft', 'Under Review'].map(vis => (
            <label key={vis} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.visibility.includes(vis)}
                onChange={() => handleVisibilityChange(vis)}
              />{' '}
              {vis}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Created On <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.dateGrid}>
          {['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Last 6 Months'].map(opt => (
            <label key={opt} className={styles.radioLabel}>
              <input
                type="radio"
                name="createdOn"
                checked={filters.createdOn === opt}
                onChange={() => handleRadioChange('createdOn', opt)}
              />{' '}
              {opt}
            </label>
          ))}
        </div>
        <div className={styles.selectManually}>Select Manually</div>
        <div className={styles.datePickerInput}>
          📅 DD/MM/YYYY - DD/MM/YYYY
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Modified On <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.dateGrid}>
          {['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Last 6 Months'].map(opt => (
            <label key={opt} className={styles.radioLabel}>
              <input
                type="radio"
                name="modifiedOn"
                checked={filters.modifiedOn === opt}
                onChange={() => handleRadioChange('modifiedOn', opt)}
              />{' '}
              {opt}
            </label>
          ))}
        </div>
        <div className={styles.selectManually}>Select Manually</div>
        <div className={styles.datePickerInput}>
          📅 DD/MM/YYYY - DD/MM/YYYY
        </div>
      </div>
    </div>
  );
}
