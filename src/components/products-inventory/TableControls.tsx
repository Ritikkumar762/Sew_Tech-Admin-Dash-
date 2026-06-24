import React, { useState } from 'react';
import styles from './ProductsInventory.module.css';

interface TableControlsProps {
  onSearchChange: (query: string) => void;
  onToggleFilters?: () => void;
  isFilterOpen?: boolean;
}

export function TableControls({ onSearchChange, onToggleFilters, isFilterOpen }: TableControlsProps) {
  const [dateField, setDateField] = useState<'created' | 'modified'>('created');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);

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
        <div style={{ position: 'relative' }}>
          <button 
            type="button"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className={styles.dropdownBtn}
          >
            <span>{dateField === 'created' ? 'Created on' : 'Modified on'}</span>
            <svg 
              width="8" 
              height="5" 
              viewBox="0 0 10 6" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                transform: isDateDropdownOpen ? 'rotate(180deg)' : 'none', 
                transition: 'transform 0.15s ease',
                flexShrink: 0
              }}
            >
              <path d="M1 1L5 5L9 1" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {isDateDropdownOpen && (
            <>
              <div 
                onClick={() => setIsDateDropdownOpen(false)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49 }}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
                zIndex: 50,
                minWidth: '120px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setDateField('created');
                    setIsDateDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: dateField === 'created' ? '#3b82f6' : '#334155',
                    backgroundColor: dateField === 'created' ? '#f0f6ff' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Created on
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateField('modified');
                    setIsDateDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: dateField === 'modified' ? '#3b82f6' : '#334155',
                    backgroundColor: dateField === 'modified' ? '#f0f6ff' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Modified on
                </button>
              </div>
            </>
          )}
        </div>

        <button type="button" className={styles.calendarBtn}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            type="button"
            onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
            className={styles.bulkActionsBtn}
          >
            <span>Bulk Actions</span>
            <svg 
              width="8" 
              height="5" 
              viewBox="0 0 10 6" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                transform: isBulkDropdownOpen ? 'rotate(180deg)' : 'none', 
                transition: 'transform 0.15s ease',
                flexShrink: 0
              }}
            >
              <path d="M1 1L5 5L9 1" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {isBulkDropdownOpen && (
            <>
              <div 
                onClick={() => setIsBulkDropdownOpen(false)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49 }}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
                zIndex: 50,
                minWidth: '180px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkDropdownOpen(false);
                    alert('Disabled bulk items successfully');
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#334155',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Disable
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkDropdownOpen(false);
                    window.location.href = '/spares/bulk-edit';
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#334155',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Bulk Edit Spare Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkDropdownOpen(false);
                    alert('Marked items out of stock successfully');
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#334155',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Mark Out of Stock
                </button>
              </div>
            </>
          )}
        </div>

        <button 
          type="button"
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
