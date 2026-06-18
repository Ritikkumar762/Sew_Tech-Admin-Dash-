'use client';
import React, { useState } from 'react';
import styles from './BulkEdit.module.css';
import { useRouter } from 'next/navigation';

interface SpreadsheetRow {
  rowNum: number;
  d: string; // SKU
  e: string; // Spare Name
  f: string; // Category
  g: string; // Compatible Brand
  h: string; // Model
  i: string; // Stock Inventory
  j: string; // Alert Qty
  k: string; // Listing Price
  l: string; // Sale Price
  m: string; // Returnable (Yes/No)
  n: string; // Visibility (Live/Draft)
  o: string; // Material
}

const INITIAL_ROWS: SpreadsheetRow[] = [
  { rowNum: 1, d: 'HC3000', e: 'Industrial Sewing Needle', f: 'Needles', g: 'Juki', h: 'Juki Single', i: '100', j: '12', k: '1850', l: '1850', m: 'Yes', n: 'Live', o: 'Steel' },
  { rowNum: 2, d: 'STH-RH-2045', e: 'High-Speed Rotary Hook Assembly', f: 'Rotary Hook', g: 'Juki', h: 'Juki Single', i: '10', j: '12', k: '15000', l: '15000', m: 'Yes', n: 'Live', o: 'Alloy' },
  { rowNum: 3, d: 'NBTG-90', e: 'Needle Bar Thread Guide', f: 'Guides', g: 'Brother', h: 'Brother Lock', i: '45', j: '10', k: '450', l: '450', m: 'No', n: 'Draft', o: 'Steel' },
  { rowNum: 4, d: 'TTLA-20', e: 'Thread Take-up Lever Assembly', f: 'Levers', g: 'Singer', h: 'Singer Pro', i: '25', j: '5', k: '1200', l: '1200', m: 'Yes', n: 'Live', o: 'Alloy' },
  ...Array.from({ length: 24 }).map((_, idx) => ({
    rowNum: idx + 5,
    d: '',
    e: '',
    f: '',
    g: '',
    h: '',
    i: '',
    j: '',
    k: '',
    l: '',
    m: '',
    n: '',
    o: '',
  }))
];

export default function BulkEditSparesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<SpreadsheetRow[]>(INITIAL_ROWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = () => {
    setShowSuccessModal(true);
  };

  const handleCellChange = (rowNum: number, field: keyof SpreadsheetRow, value: string) => {
    setRows(prev => prev.map(r => r.rowNum === rowNum ? { ...r, [field]: value } : r));
  };

  const handleClearAll = () => {
    setRows(INITIAL_ROWS.map(r => ({
      rowNum: r.rowNum,
      d: '', e: '', f: '', g: '', h: '', i: '', j: '', k: '', l: '', m: '', n: '', o: ''
    })));
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <div>
              <div className={styles.breadcrumb}>
                Sewtech Spare • <span>Order Management</span>
              </div>
              <h1 className={styles.pageTitle}>Bulk Edit Spares</h1>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutlineRed} onClick={() => router.back()}>Discard Changes</button>
              <button className={styles.btnDark} onClick={handleSave}>
                Save & Update List
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '0.5rem' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
            </div>
          </div>

          <div className={styles.sheetCard}>
            <div className={styles.sheetToolbar}>
              <div className={styles.searchWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search Spare" 
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={styles.toolbarButtons}>
                <button className={styles.btnToolbar} onClick={handleClearAll}>
                  Clear All Spares
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.25rem' }}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                </button>
                <button className={styles.btnToolbar}>
                  Expand Sheet
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.25rem' }}><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
                </button>
              </div>
            </div>

            {/* Spreadsheet Grid container */}
            <div className={styles.spreadsheetWrapper}>
              <table className={styles.spreadsheetTable}>
                <thead>
                  <tr>
                    <th className={styles.rowNumberHeader}></th>
                    <th className={styles.colHeader}>D</th>
                    <th className={styles.colHeader}>E</th>
                    <th className={styles.colHeader}>F</th>
                    <th className={styles.colHeader}>G</th>
                    <th className={styles.colHeader}>H</th>
                    <th className={styles.colHeader}>I</th>
                    <th className={styles.colHeader}>J</th>
                    <th className={styles.colHeader}>K</th>
                    <th className={styles.colHeader}>L</th>
                    <th className={styles.colHeader}>M</th>
                    <th className={styles.colHeader}>N</th>
                    <th className={styles.colHeader}>O</th>
                  </tr>
                  {/* Field Label Headers */}
                  <tr className={styles.labelHeaderRow}>
                    <td className={styles.rowNumberCell}></td>
                    <td className={styles.labelHeaderCell}>SKU Code</td>
                    <td className={styles.labelHeaderCell}>Spare Name</td>
                    <td className={styles.labelHeaderCell}>Category</td>
                    <td className={styles.labelHeaderCell}>Brand Compatibility</td>
                    <td className={styles.labelHeaderCell}>Model Compatibility</td>
                    <td className={styles.labelHeaderCell}>Stock Inventory</td>
                    <td className={styles.labelHeaderCell}>Alert Quantity</td>
                    <td className={styles.labelHeaderCell}>Listing Price</td>
                    <td className={styles.labelHeaderCell}>Sale Price</td>
                    <td className={styles.labelHeaderCell}>Returnable</td>
                    <td className={styles.labelHeaderCell}>Visibility</td>
                    <td className={styles.labelHeaderCell}>Material</td>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.rowNum}>
                      <td className={styles.rowNumberCell}>{row.rowNum}</td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.d} 
                          onChange={(e) => handleCellChange(row.rowNum, 'd', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.e} 
                          onChange={(e) => handleCellChange(row.rowNum, 'e', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.f} 
                          onChange={(e) => handleCellChange(row.rowNum, 'f', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.g} 
                          onChange={(e) => handleCellChange(row.rowNum, 'g', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.h} 
                          onChange={(e) => handleCellChange(row.rowNum, 'h', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.i} 
                          onChange={(e) => handleCellChange(row.rowNum, 'i', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.j} 
                          onChange={(e) => handleCellChange(row.rowNum, 'j', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.k} 
                          onChange={(e) => handleCellChange(row.rowNum, 'k', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.l} 
                          onChange={(e) => handleCellChange(row.rowNum, 'l', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.m} 
                          onChange={(e) => handleCellChange(row.rowNum, 'm', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.n} 
                          onChange={(e) => handleCellChange(row.rowNum, 'n', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.o} 
                          onChange={(e) => handleCellChange(row.rowNum, 'o', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Tabs & Pagination (Exactly like Screenshot 5) */}
            <div className={styles.sheetFooter}>
              <div className={styles.bottomTabs}>
                <span className={styles.tabAdd}>+</span>
                <span className={styles.tabMenu}>=</span>
                <span className={styles.tabItemActive}>Sheet1</span>
              </div>
              
              <div className={styles.pagination}>
                <span className={styles.rowsPerPage}>Rows per page:</span>
                <select className={styles.rowsSelect} defaultValue="10">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className={styles.pageRange}>1-10 of 165</span>
                <div className={styles.pageButtons}>
                  <button type="button" className={styles.btnPage}>&lt;</button>
                  <button type="button" className={styles.btnPage}>&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
          <div className={styles.confirmationCard} style={{ margin: 'auto' }}>
            <button className={styles.modalCloseBtn} onClick={() => setShowSuccessModal(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className={styles.successCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h3 className={styles.confirmationTitle}>List Saved & Updated!</h3>
            <p className={styles.confirmationText}>
              All changes in the sheet have been applied successfully to your spares inventory.
            </p>
            
            <button className={styles.btnViewAll} onClick={() => router.push('/spares/all')}>
              View All Spares
            </button>
          </div>
        </div>
      )}
    </>
  );
}
