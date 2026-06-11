import React from 'react';
import styles from './ProductsInventory.module.css';

export function FilterSidebar() {
  return (
    <div className={styles.filterSidebar}>
      <div className={styles.filterHeader}>
        <h2>Filters</h2>
        <button className={styles.clearFiltersBtn}>Clear Filters ⊗</button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Category <span className={styles.chevron}>▼</span>
        </div>
        <select className={styles.filterSelect}>
          <option>Select Category</option>
        </select>
        <div className={styles.pills}>
          <span className={styles.pill}>Hookset ⊗</span>
          <span className={styles.pill}>Needles ⊗</span>
          <span className={styles.pill}>Knives ⊗</span>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Stock Status <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.checkboxList}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" defaultChecked /> In-Stock
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" /> Out-of-Stock
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" /> Low Stock ({'<'}5)
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" /> Dead Stock (Idle {'>'} 6 Months)
          </label>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Compatibility <span className={styles.chevron}>▼</span>
        </div>
        <select className={styles.filterSelect} style={{ marginBottom: '0.5rem' }}>
          <option>Compatible Brand</option>
        </select>
        <select className={styles.filterSelect}>
          <option>Compatible Machine Type</option>
        </select>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Price Range <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.priceInputs}>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>₹</span>
            <input type="text" defaultValue="1,500" className={styles.priceInput} />
          </div>
          <span className={styles.priceSeparator}>-</span>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>₹</span>
            <input type="text" defaultValue="1,500" className={styles.priceInput} />
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Visibility <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.visibilityGrid}>
          <label className={styles.checkboxLabel}><input type="checkbox" /> Live</label>
          <label className={styles.checkboxLabel}><input type="checkbox" /> Archive</label>
          <label className={styles.checkboxLabel}><input type="checkbox" /> Draft</label>
          <label className={styles.checkboxLabel}><input type="checkbox" /> Under Review</label>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionTitle}>
          Created On <span className={styles.chevron}>▼</span>
        </div>
        <div className={styles.dateGrid}>
          <label className={styles.radioLabel}><input type="radio" name="created" /> Last 7 Days</label>
          <label className={styles.radioLabel}><input type="radio" name="created" /> Last 14 Days</label>
          <label className={styles.radioLabel}><input type="radio" name="created" /> Last 30 Days</label>
          <label className={styles.radioLabel}><input type="radio" name="created" /> Last 6 Months</label>
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
          <label className={styles.radioLabel}><input type="radio" name="modified" /> Last 7 Days</label>
          <label className={styles.radioLabel}><input type="radio" name="modified" /> Last 14 Days</label>
          <label className={styles.radioLabel}><input type="radio" name="modified" /> Last 30 Days</label>
          <label className={styles.radioLabel}><input type="radio" name="modified" /> Last 6 Months</label>
        </div>
        <div className={styles.selectManually}>Select Manually</div>
        <div className={styles.datePickerInput}>
          📅 DD/MM/YYYY - DD/MM/YYYY
        </div>
      </div>
    </div>
  );
}
