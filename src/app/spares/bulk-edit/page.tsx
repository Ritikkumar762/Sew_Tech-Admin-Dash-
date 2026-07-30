'use client';
import React, { useState, useEffect } from 'react';
import styles from './BulkEdit.module.css';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

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
  p: string; // Warranty
  q: string; // Description
  r: string; // Product Dimensions
  s: string; // Item Weight
  t: string; // Net Quantity
  u: string; // Tags
  v: string; // Pre-order (Yes/No)
}

const BLANK_ROW_FIELDS = { d: '', e: '', f: '', g: '', h: '', i: '', j: '', k: '', l: '', m: '', n: '', o: '', p: '', q: '', r: '', s: '', t: '', u: '', v: '' };

const INITIAL_ROWS: SpreadsheetRow[] = [
  { rowNum: 1, d: 'HC3000', e: 'Industrial Sewing Needle', f: 'Needles', g: 'Juki', h: 'Juki Single', i: '100', j: '12', k: '1850', l: '1850', m: 'Yes', n: 'Live', o: 'Steel', p: '1 Yr', q: 'High precision industrial sewing needle', r: '10cm x 2cm x 2cm', s: '5g', t: '1', u: 'Best Seller', v: 'No' },
  { rowNum: 2, d: 'STH-RH-2045', e: 'High-Speed Rotary Hook Assembly', f: 'Rotary Hook', g: 'Juki', h: 'Juki Single', i: '10', j: '12', k: '15000', l: '15000', m: 'Yes', n: 'Live', o: 'Alloy Steel', p: '1 Yr', q: 'Durable rotary hook assembly', r: '8cm x 8cm x 5cm', s: '250g', t: '1', u: '', v: 'No' },
  { rowNum: 3, d: 'NBTG-90', e: 'Needle Bar Thread Guide', f: 'Guides', g: 'Brother', h: 'Brother Lock', i: '45', j: '10', k: '450', l: '450', m: 'No', n: 'Draft', o: 'Steel', p: '6 Months', q: 'Thread guide for needle bar', r: '', s: '', t: '', u: '', v: 'No' },
  { rowNum: 4, d: 'TTLA-20', e: 'Thread Take-up Lever Assembly', f: 'Levers', g: 'Singer', h: 'Singer Pro', i: '25', j: '5', k: '1200', l: '1200', m: 'Yes', n: 'Live', o: 'Alloy Steel', p: '1 Yr', q: 'Take-up lever assembly', r: '', s: '', t: '', u: '', v: 'No' },
  ...Array.from({ length: 24 }).map((_, idx) => ({
    rowNum: idx + 5,
    ...BLANK_ROW_FIELDS
  }))
];

interface BulkEditResult {
  updated: number;
  skipped: number;
  results: { row: number; identifier: string; status: string; reason: string | null }[];
}

function unwrap<T>(res: any): T {
  return res && typeof res === 'object' && 'data' in res && res.data !== undefined ? (res.data as T) : (res as T);
}

const splitList = (value: string): string[] =>
  value.split(/[,;]/).map((v) => v.trim()).filter(Boolean);

const toStr = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value).trim();
};

const toNumber = (value: any): number | undefined => {
  const str = toStr(value);
  if (!str) return undefined;
  const n = Number(str);
  return Number.isFinite(n) ? n : undefined;
};

export default function BulkEditSparesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<SpreadsheetRow[]>(INITIAL_ROWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveResult, setSaveResult] = useState<BulkEditResult | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await apiClient.get<any>(ENDPOINTS.spares.inventory);
        const data = unwrap<any>(res);
        const items = Array.isArray(data) ? data : (data?.items || data?.products || []);
        if (Array.isArray(items) && items.length > 0) {
          const mappedRows: SpreadsheetRow[] = items.slice(0, 30).map((p: any, idx: number) => ({
            rowNum: idx + 1,
            d: toStr(p.sku),
            e: toStr(p.name),
            f: toStr((typeof p.category === 'object' ? p.category?.name : p.category) || 'Rotary Hook'),
            g: toStr((typeof p.brand === 'object' ? p.brand?.name : p.brand) || 'Juki'),
            h: Array.isArray(p.compatibility) ? p.compatibility.join('; ') : toStr(p.compatibility),
            i: toStr(p.stock_quantity ?? 0),
            j: toStr(p.low_stock_threshold ?? 10),
            k: toStr(p.price ?? 0),
            l: toStr(p.discount_price ?? p.price ?? 0),
            m: toStr(p.specifications?.['Returnable'] ?? p.returnable ?? 'Yes'),
            n: p.status === 'PUBLISHED' ? 'Live' : 'Draft',
            o: toStr(p.specifications?.['Material'] ?? p.material ?? 'High-Carbon Steel'),
            p: toStr(p.specifications?.['Warranty'] ?? p.warranty ?? '1 Yr'),
            q: toStr(p.description),
            r: toStr(p.specifications?.['Product Dimensions']),
            s: toStr(p.specifications?.['Item Weight']),
            t: toStr(p.specifications?.['Net Quantity']),
            u: Array.isArray(p.tags) ? p.tags.map((tg: any) => tg?.name).filter(Boolean).join('; ') : toStr(p.tags),
            v: toStr(p.is_preorder ?? false)
          }));
          // Pad with blank rows up to 30
          while (mappedRows.length < 30) {
            mappedRows.push({
              rowNum: mappedRows.length + 1,
              ...BLANK_ROW_FIELDS
            });
          }
          setRows(mappedRows);
        }
      } catch (err) {
        console.error('Failed to load products for bulk edit:', err);
      }
    }
    loadProducts();
  }, []);

  const handleSave = async () => {
    const editRows = rows.filter((r) => toStr(r.d));
    if (!editRows.length) {
      setSaveError('Enter at least one SKU to save changes.');
      return;
    }

    const payload = {
      rows: editRows.map((r) => {
        const skuStr = toStr(r.d);
        const nameStr = toStr(r.e);
        const catStr = toStr(r.f);
        const brandStr = toStr(r.g);
        const modelStr = toStr(r.h);
        const retStr = toStr(r.m);
        const visStr = toStr(r.n);
        const matStr = toStr(r.o);
        const warStr = toStr(r.p);
        const descStr = toStr(r.q);
        const dimStr = toStr(r.r);
        const weightStr = toStr(r.s);
        const netQtyStr = toStr(r.t);
        const tagsStr = toStr(r.u);
        const preorderStr = toStr(r.v);

        const row: Record<string, any> = { sku: skuStr };
        if (nameStr) row.name = nameStr;
        if (catStr) row.category = catStr;
        if (brandStr) row.brand_compatibility = splitList(brandStr);
        if (modelStr) row.model_compatibility = splitList(modelStr);
        const stock = toNumber(r.i);
        if (stock !== undefined) row.stock_quantity = stock;
        const alertQty = toNumber(r.j);
        if (alertQty !== undefined) row.low_stock_threshold = alertQty;
        const price = toNumber(r.k);
        if (price !== undefined) row.price = price;
        const salePrice = toNumber(r.l);
        if (salePrice !== undefined) row.discount_price = salePrice;
        if (retStr) row.returnable = retStr.toLowerCase() === 'yes' || retStr === 'true';
        if (visStr) row.visibility = visStr;
        if (matStr) row.material = matStr;
        if (warStr) row.warranty = warStr;
        if (descStr) row.description = descStr;
        if (dimStr) row.product_dimensions = dimStr;
        if (weightStr) row.item_weight = weightStr;
        if (netQtyStr) row.net_quantity = netQtyStr;
        if (tagsStr) row.tags = splitList(tagsStr);
        if (preorderStr) row.is_preorder = preorderStr.toLowerCase() === 'yes' || preorderStr === 'true';
        return row;
      }),
    };

    setIsSaving(true);
    setSaveError('');
    try {
      const res = await apiClient.patch<BulkEditResult>(ENDPOINTS.spares.bulkEdit, payload);
      setSaveResult(unwrap<BulkEditResult>(res));
      setShowSuccessModal(true);
    } catch (err: any) {
      setSaveError(err?.message || 'Could not save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellChange = (rowNum: number, field: keyof SpreadsheetRow, value: string) => {
    setRows(prev => prev.map(r => r.rowNum === rowNum ? { ...r, [field]: value } : r));
  };

  const handleClearAll = () => {
    setRows(INITIAL_ROWS.map(r => ({
      rowNum: r.rowNum,
      ...BLANK_ROW_FIELDS
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
              <button className={styles.btnDark} onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save & Update List'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '0.5rem' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
            </div>
          </div>

          {saveError && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1rem' }}>
              {saveError}
            </div>
          )}

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
                    <th className={styles.colHeader}>P</th>
                    <th className={styles.colHeader}>Q</th>
                    <th className={styles.colHeader}>R</th>
                    <th className={styles.colHeader}>S</th>
                    <th className={styles.colHeader}>T</th>
                    <th className={styles.colHeader}>U</th>
                    <th className={styles.colHeader}>V</th>
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
                    <td className={styles.labelHeaderCell}>Warranty</td>
                    <td className={styles.labelHeaderCell}>Description</td>
                    <td className={styles.labelHeaderCell}>Product Dimensions</td>
                    <td className={styles.labelHeaderCell}>Item Weight</td>
                    <td className={styles.labelHeaderCell}>Net Quantity</td>
                    <td className={styles.labelHeaderCell}>Tags</td>
                    <td className={styles.labelHeaderCell}>Pre-order</td>
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
                      <td>
                        <input 
                          type="text" 
                          className={styles.cellInput} 
                          value={row.p} 
                          onChange={(e) => handleCellChange(row.rowNum, 'p', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          value={row.q}
                          onChange={(e) => handleCellChange(row.rowNum, 'q', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          value={row.r}
                          onChange={(e) => handleCellChange(row.rowNum, 'r', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          value={row.s}
                          onChange={(e) => handleCellChange(row.rowNum, 's', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          value={row.t}
                          onChange={(e) => handleCellChange(row.rowNum, 't', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          value={row.u}
                          onChange={(e) => handleCellChange(row.rowNum, 'u', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.cellInput}
                          value={row.v}
                          onChange={(e) => handleCellChange(row.rowNum, 'v', e.target.value)}
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
              {saveResult
                ? `${saveResult.updated} spare${saveResult.updated === 1 ? '' : 's'} updated${saveResult.skipped > 0 ? `, ${saveResult.skipped} skipped.` : '.'}`
                : 'All changes in the sheet have been applied successfully to your spares inventory.'}
            </p>

            {saveResult && saveResult.skipped > 0 && (
              <div style={{ width: '100%', maxHeight: '140px', overflowY: 'auto', textAlign: 'left', background: '#fef2f2', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', color: '#b91c1c', marginBottom: '0.75rem' }}>
                {saveResult.results
                  .filter((r) => r.status === 'skipped')
                  .map((r) => (
                    <div key={r.row} style={{ marginBottom: '0.25rem' }}>{r.identifier}: {r.reason}</div>
                  ))}
              </div>
            )}

            <button className={styles.btnViewAll} onClick={() => router.push('/spares/all')}>
              View All Spares
            </button>
          </div>
        </div>
      )}
    </>
  );
}
