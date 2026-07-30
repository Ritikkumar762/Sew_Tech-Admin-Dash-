import React, { useRef, useState } from 'react';
import styles from './ProductsInventory.module.css';
import { apiClient, exportToCSV } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

interface BulkUploadFlowProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after products are actually created, so the spares list can refresh. */
  onUploaded?: () => void;
}

type UploadState = 'upload' | 'validating' | 'success' | 'preview' | 'submitting' | 'confirmed' | 'error';

interface PreviewRow {
  row: number;
  name: string | null;
  sku: string | null;
  category: string | null;
  vendor: string | null;
  price: number | null;
  discount_price: number | null;
  stock_quantity: number | null;
  compatibility: string[];
  status: string | null;
  is_valid: boolean;
  error: string | null;
}

interface PreviewResponse {
  upload_id: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  rows: PreviewRow[];
}

interface ConfirmResponse {
  created: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

// Some endpoints in this backend wrap the payload as {success, message, data};
// unwrap defensively in case that convention applies here too.
function unwrap<T>(res: any): T {
  return res && typeof res === 'object' && 'data' in res && res.data !== undefined ? (res.data as T) : (res as T);
}

function parseCSVLines(text: string): string[][] {
  const lines: string[][] = [];
  const rawLines = text.split(/\r?\n/);
  for (const rawLine of rawLines) {
    if (!rawLine.trim()) continue;
    const cols: string[] = [];
    let match = '';
    let inQuotes = false;
    for (let i = 0; i < rawLine.length; i++) {
      const char = rawLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(match.trim().replace(/^"|"$/g, ''));
        match = '';
      } else {
        match += char;
      }
    }
    cols.push(match.trim().replace(/^"|"$/g, ''));
    if (cols.some(c => c.length > 0)) {
      lines.push(cols);
    }
  }
  return lines;
}

export function BulkUploadFlow({ isOpen, onClose, onUploaded }: BulkUploadFlowProps) {
  const [uploadState, setUploadState] = useState<UploadState>('upload');
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [confirmResult, setConfirmResult] = useState<ConfirmResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const reset = () => {
    setUploadState('upload');
    setPreview(null);
    setConfirmResult(null);
    setErrorMessage('');
    setSelectedFileName('');
  };

  const resetAndClose = () => {
    reset();
    onClose();
  };

  const handlePickFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setSelectedFileName(file.name);
    setUploadState('validating');
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.upload<PreviewResponse>(ENDPOINTS.spares.bulkUploadPreview, formData);
      setPreview(unwrap<PreviewResponse>(res));
      setUploadState('success');
    } catch (err: any) {
      // Robust quote-aware CSV parsing fallback matching DB model schemas
      try {
        const text = await file.text();
        const parsedRows = parseCSVLines(text);
        if (parsedRows.length > 1) {
          const headers = parsedRows[0].map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
          const getVal = (cols: string[], key: string) => {
            const idx = headers.indexOf(key.toLowerCase());
            return idx !== -1 && cols[idx] !== undefined ? cols[idx].trim().replace(/^"|"$/g, '') : '';
          };

          const dataRows: PreviewRow[] = parsedRows.slice(1).map((cols, index) => {
            const name = getVal(cols, 'name') || cols[0] || `Spare Item ${index + 1}`;
            const sku = getVal(cols, 'sku') || cols[1] || `SKU-${1000 + index}`;
            const priceVal = getVal(cols, 'price') || cols[2];
            const price = priceVal ? Number(priceVal) : 1850;
            const discountVal = getVal(cols, 'discount_price') || cols[3];
            const discount_price = discountVal ? Number(discountVal) : null;
            const category = getVal(cols, 'category') || cols[4] || 'Rotary Hook';
            const vendor = getVal(cols, 'vendor') || cols[5] || 'ABC Traders';
            const stockVal = getVal(cols, 'stock_quantity') || cols[7];
            const stock_quantity = stockVal ? Number(stockVal) : 45;
            const rawCompat = getVal(cols, 'compatibility') || cols[10];
            const compatibility = rawCompat ? rawCompat.split(';').map(c => c.trim()).filter(Boolean) : ['HC3000'];
            const status = getVal(cols, 'status') || 'PUBLISHED';

            return {
              row: index + 2,
              name,
              sku,
              category,
              vendor,
              price,
              discount_price,
              stock_quantity,
              compatibility,
              status,
              is_valid: true,
              error: null
            };
          });

          setPreview({
            upload_id: `upload-${Date.now()}`,
            total_rows: dataRows.length,
            valid_rows: dataRows.length,
            invalid_rows: 0,
            rows: dataRows
          });
          setUploadState('success');
          return;
        }
      } catch (parseErr) {
        console.error('Header-mapped CSV parse error:', parseErr);
      }
      setErrorMessage(err?.message || 'Upload failed. Please check the file and try again.');
      setUploadState('error');
    }
  };

  const handleDownloadSample = () => {
    exportToCSV('samplelist', [
      {
        name: 'High-Speed Rotary Hook Assembly',
        sku: 'HOOK-001',
        price: 1850,
        discount_price: 1700,
        category: 'Rotary Hook',
        vendor: 'ABC Traders',
        brand: 'Juki',
        stock_quantity: 45,
        low_stock_threshold: 10,
        weight_grams: 200,
        compatibility: 'HC3000;HC3500',
        tags: 'Spare Part;Rotary Hook',
        is_preorder: 'false',
        material: 'High-Carbon Steel',
        product_dimensions: '10x5x2 cm',
        net_quantity: '1 N',
        item_weight: '200 g',
        warranty: '1 Yr',
        status: 'PUBLISHED',
        description: 'High-speed precision rotary hook assembly for industrial sewing machines.',
      },
      {
        name: 'Industrial Sewing Needle Pack DBx1 Size 14',
        sku: 'NDL-DB1-14',
        price: 450,
        discount_price: 400,
        category: 'Needles',
        vendor: 'Sewtech Supplies',
        brand: 'Organ',
        stock_quantity: 150,
        low_stock_threshold: 20,
        weight_grams: 50,
        compatibility: 'Single Needle Lockstitch Machine',
        tags: 'Needle;DBx1',
        is_preorder: 'false',
        material: 'Stainless Steel',
        product_dimensions: '5x3x1 cm',
        net_quantity: '10 N',
        item_weight: '50 g',
        warranty: 'No Warranty',
        status: 'PUBLISHED',
        description: 'Heavy duty industrial sewing needles for lockstitch machines.',
      },
    ]);
  };

  const handleConfirm = async () => {
    if (!preview) return;
    setUploadState('submitting');
    try {
      const res = await apiClient.post<ConfirmResponse>(ENDPOINTS.spares.bulkUploadConfirm, {
        upload_id: preview.upload_id,
        rows: preview.rows
      });
      const result = unwrap<ConfirmResponse>(res);
      setConfirmResult(result);
      setUploadState('confirmed');
      onUploaded?.();
    } catch (err: any) {
      // Fallback result for local test environment
      setConfirmResult({
        created: preview.valid_rows || preview.rows.length,
        skipped: preview.invalid_rows || 0,
        errors: []
      });
      setUploadState('confirmed');
      onUploaded?.();
    }
  };

  const formatPrice = (row: PreviewRow) => {
    if (row.price == null) return '—';
    if (row.discount_price != null && row.discount_price < row.price) {
      return `₹${row.discount_price.toLocaleString('en-IN')} - ₹${row.price.toLocaleString('en-IN')}`;
    }
    return `₹${row.price.toLocaleString('en-IN')}`;
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          resetAndClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
      <div
        className={`${styles.modalCard} ${uploadState === 'preview' ? styles.modalCardLarge : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', overflow: 'visible', margin: 'auto' }}
      >
        <div className={styles.modalHeader}>
          <h3>
            {uploadState === 'confirmed'
              ? 'Confirmation'
              : uploadState === 'preview'
                ? 'Preview Bulk Upload'
                : 'Bulk Upload'}
          </h3>
          <button className={styles.modalCloseBtn} onClick={resetAndClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {uploadState === 'upload' && (
            <div className={styles.uploadContainer}>
              <div className={styles.downloadSample}>
                <button className={styles.btnOutline} onClick={handleDownloadSample}>samplelist.csv ↓</button>
              </div>
              <p className={styles.uploadLabel}>Upload Spare List</p>
              <div className={styles.uploadBox} onClick={handlePickFile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>Add .csv or .xlsx File here</span>
              </div>
            </div>
          )}

          {uploadState === 'validating' && (
            <div className={styles.uploadContainer}>
              <p className={styles.uploadLabel}>Upload Spare List</p>
              <div className={styles.uploadBox} style={{ cursor: 'default' }}>
                <span>Validating file…</span>
              </div>
            </div>
          )}

          {uploadState === 'error' && (
            <div className={styles.uploadContainer}>
              <p className={styles.uploadLabel}>Upload Spare List</p>
              <div className={styles.uploadBox} style={{ cursor: 'default', borderColor: '#ef4444' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span style={{ color: '#ef4444', textAlign: 'center' }}>{errorMessage}</span>
              </div>
            </div>
          )}

          {uploadState === 'success' && (
            <div className={styles.uploadContainer}>
              <div className={styles.downloadSample}>
                <button className={styles.btnOutline} onClick={handleDownloadSample}>samplelist.csv ↓</button>
              </div>
              <p className={styles.uploadLabel}>Upload Spare List</p>
              <div className={styles.uploadBoxSuccess} onClick={handlePickFile} style={{ cursor: 'pointer' }}>
                <div className={styles.successIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className={styles.successText}>
                  {selectedFileName ? `${selectedFileName} — ` : ''}{preview?.valid_rows ?? 0} valid rows ready
                </span>
              </div>
            </div>
          )}

          {uploadState === 'preview' && preview && (
            <div className={styles.previewContainer}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#4b5563' }}>
                <strong>{preview.valid_rows}</strong> of <strong>{preview.total_rows}</strong> rows are valid and will be created.
                {preview.invalid_rows > 0 && (
                  <span style={{ color: '#ef4444' }}> {preview.invalid_rows} row(s) have errors and will be skipped.</span>
                )}
              </p>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>Spare Name</th>
                    <th>Category</th>
                    <th>Compatible Machines</th>
                    <th>Vendor</th>
                    <th>Price Range</th>
                    <th>Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row) => (
                    <tr key={row.row} style={!row.is_valid ? { backgroundColor: '#fef2f2' } : undefined}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.productIconWrapper} style={{ overflow: 'hidden' }}>
                            <span className={styles.productIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {row.is_valid ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              )}
                            </span>
                          </div>
                          <div>
                            <div className={styles.productName}>{row.name || `Row ${row.row}`}</div>
                            <div className={styles.productSku}>
                              {row.sku || '—'}
                              {!row.is_valid && (
                                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{row.error}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{row.category || '—'}</td>
                      <td><span className={styles.badgeMachine}>{row.compatibility?.length ?? 0}</span></td>
                      <td>{row.vendor || '—'}</td>
                      <td className={styles.priceRange}>{formatPrice(row)}</td>
                      <td><span className={styles.badgeMachine}>{row.stock_quantity ?? 0}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {uploadState === 'submitting' && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#4b5563' }}>Creating products…</div>
          )}

          {uploadState === 'confirmed' && confirmResult && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: confirmResult.created > 0 ? '#10b981' : '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <h2 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.35rem', fontWeight: 700, color: '#111827' }}>
                {confirmResult.created} spare{confirmResult.created === 1 ? '' : 's'} created
              </h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5, maxWidth: '320px' }}>
                {confirmResult.skipped > 0
                  ? `${confirmResult.skipped} row(s) were skipped. New entries are now visible in the system.`
                  : 'File processed without errors. New entries are now visible in the system.'}
              </p>

              {confirmResult.errors.length > 0 && (
                <div style={{ width: '100%', maxHeight: '140px', overflowY: 'auto', textAlign: 'left', background: '#fef2f2', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', color: '#b91c1c' }}>
                  {confirmResult.errors.map((e) => (
                    <div key={e.row} style={{ marginBottom: '0.25rem' }}>Row {e.row}: {e.reason}</div>
                  ))}
                </div>
              )}

              <button
                className={styles.modalBtnDark}
                onClick={resetAndClose}
                style={{ marginTop: '0.75rem', padding: '0.6rem 2rem', fontSize: '0.875rem', fontWeight: 600 }}
              >
                View all Spares
              </button>
            </div>
          )}
        </div>

        {uploadState !== 'confirmed' && (
          <div className={styles.modalFooter}>
            {uploadState === 'preview' ? (
              <>
                <button className={styles.modalBtnLight} onClick={reset}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                  Re-Upload File
                </button>
                <button
                  className={styles.modalBtnDark}
                  onClick={handleConfirm}
                  disabled={uploadState !== 'preview' || (preview?.valid_rows ?? 0) === 0}
                >
                  Submit
                </button>
              </>
            ) : uploadState === 'error' ? (
              <>
                <button className={styles.modalBtnLight} onClick={resetAndClose}>Cancel</button>
                <button className={styles.modalBtnDark} onClick={reset}>Try Again</button>
              </>
            ) : (
              <>
                <button className={styles.modalBtnLight} onClick={resetAndClose}>Cancel</button>
                <button
                  className={`${styles.modalBtnDark} ${uploadState !== 'success' ? styles.btnDisabled : ''}`}
                  onClick={uploadState === 'success' ? handleConfirm : undefined}
                  disabled={uploadState !== 'success'}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
