import React from 'react';
import styles from './ProductsInventory.module.css';
import { FilterState } from './Types';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
  onClose?: () => void;
  categoriesList?: string[];
  brandsList?: string[];
}

export function FilterSidebar({ filters, setFilters, onClear, onClose, categoriesList = [], brandsList = [] }: FilterSidebarProps) {
  const [categorySearch, setCategorySearch] = React.useState('');
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const categoryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryOptions = React.useMemo(() => {
    const defaults = [
      'Accessories', 'Belts & Gears', 'Bobbins & Cases', 'Car Spares', 'Clutch Motors', 
      'Domestic Sewing', 'Dyes & Inks', 'Electronics', 'Fabrics', 'Hemming Feet', 
      'Home Appliances', 'Hookset', 'Industrial Sewing', 'Knives', 'Leather Needles', 
      'Lights & Attachments', 'Lubrication Oils', 'Machines', 'Maintenance Kits', 'Needles', 'Rotary Hook'
    ];
    const merged = Array.from(new Set([...defaults, ...categoriesList])).filter(Boolean);
    return merged.sort();
  }, [categoriesList]);

  const filteredCategories = React.useMemo(() => {
    if (!categorySearch.trim()) return categoryOptions;
    return categoryOptions.filter(cat =>
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categoryOptions, categorySearch]);

  const selectCategory = (cat: string) => {
    if (cat && !filters.categories.includes(cat)) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, cat]
      }));
    }
    setCategorySearch('');
    setIsCategoryOpen(false);
  };

  const brandOptions = React.useMemo(() => {
    const defaults = ['Samsung', 'Apple', 'Bosch', 'Juki', 'Singer', 'Brother'];
    const merged = Array.from(new Set([...defaults, ...brandsList])).filter(Boolean);
    return merged.sort();
  }, [brandsList]);

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
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className={styles.clearFiltersBtn} onClick={onClear}>Clear Filters ⊗</button>
          {onClose && (
            <button className={styles.closeSidebarBtn} onClick={onClose} aria-label="Close Filters">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Category <span className={styles.chevron}>▼</span>
        </div>
        <div ref={categoryRef} style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className={styles.filterSelect}
              placeholder="Search / Select Category"
              value={categorySearch}
              onFocus={() => setIsCategoryOpen(true)}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setIsCategoryOpen(true);
              }}
              style={{ paddingRight: '2rem', cursor: 'text' }}
            />
            <span
              onClick={() => setIsCategoryOpen(prev => !prev)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                color: '#6b7280',
                userSelect: 'none'
              }}
            >
              ▼
            </span>
          </div>

          {isCategoryOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                maxHeight: '220px',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                zIndex: 100
              }}
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => {
                  const isSelected = filters.categories.includes(cat);
                  return (
                    <div
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        color: isSelected ? '#2563eb' : '#111827',
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                      }}
                    >
                      <span>{cat}</span>
                      {isSelected && <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>✓</span>}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                  No categories found
                </div>
              )}
            </div>
          )}
        </div>

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
          {brandOptions.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
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
