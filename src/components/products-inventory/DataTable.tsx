import React from 'react';
import Link from 'next/link';
import styles from './ProductsInventory.module.css';
import { SpareProduct } from './Types';

interface DataTableProps {
  data: SpareProduct[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;
}

export function DataTable({ data, selectedIds, onSelect, onSelectAll, currentPage = 1, totalPages = 1, rowsPerPage = 10, totalItems = 0, onPageChange, onRowsPerPageChange }: DataTableProps) {
  const currentTotal = totalItems || data.length;
  const startCount = currentTotal > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endCount = Math.min(currentPage * rowsPerPage, currentTotal);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                className={styles.checkbox} 
                checked={data.length > 0 && selectedIds.size === data.length}
                onChange={onSelectAll}
              />
            </th>
            <th>Spare Name <span className={styles.sortIcon}>↓↑</span></th>
            <th>Category <span className={styles.sortIcon}>↓↑</span></th>
            <th>Compatible Machines <span className={styles.sortIcon}>↓↑</span></th>
            <th>Price (List / Sale) <span className={styles.sortIcon}>↓↑</span></th>
            <th>Stock Status <span className={styles.sortIcon}>↓↑</span></th>
            <th>Visibility <span className={styles.sortIcon}>↓↑</span></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id}>
              <td>
                <input 
                  type="checkbox" 
                  className={styles.checkbox} 
                  checked={selectedIds.has(item.id)}
                  onChange={() => onSelect(item.id)}
                />
              </td>
              <td>
                <div className={styles.productCell}>
                  <div className={styles.productIconWrapper} style={{ overflow: 'hidden' }}>
                    {item.category === 'Rotary Hook' ? (
                      <img src="/rotary_hook.png" alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    ) : (
                      <img src="/sewing_machine _needle.svg" alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    )}
                  </div>
                  <div>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productSku}>{item.sku}</div>
                  </div>
                </div>
              </td>
              <td>{item.category}</td>
              <td>
                <span className={styles.badgeMachine}>{item.compatibleMachines}</span>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem' }}>
                  {item.priceMax > 0 ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.75rem' }}>
                        ₹{item.priceMin.toLocaleString()}
                      </span>
                      <span style={{ fontWeight: 500, color: '#10b981' }}>
                        ₹{item.priceMax.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontWeight: 500 }}>
                      ₹{item.priceMin.toLocaleString()}
                    </span>
                  )}
                </div>
              </td>
              <td>
                {item.stockStatus === 'Out of Stock' ? (
                  <img src="/out of stock.svg" alt="Out of Stock" style={{ height: '22px', width: 'auto', display: 'block' }} />
                ) : (
                  <span className={`${styles.statusBadge} ${styles.statusIn}`}>
                    {item.stock}
                  </span>
                )}
              </td>
              <td>
                {item.visibility === 'Live' ? (
                  <img src="/live.svg" alt="Live" style={{ height: '22px', width: 'auto', display: 'block' }} />
                ) : item.visibility === 'Draft' ? (
                  <img src="/Draft.svg" alt="Draft" style={{ height: '22px', width: 'auto', display: 'block' }} />
                ) : (
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 600,
                    backgroundColor: item.visibility === 'Under Review' ? '#fef3c7' : '#f3f4f6',
                    color: item.visibility === 'Under Review' ? '#d97706' : '#4b5563',
                    display: 'inline-block'
                  }}>
                    {item.visibility}
                  </span>
                )}
              </td>
              <td>
                <Link href={`/spares/${item.id}`} style={{ display: 'inline-block' }}>
                  <img src="/View_button.svg" alt="View" style={{ height: '28px', width: 'auto', display: 'block' }} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination controls matching Order Management */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 1.5rem 1rem 1.5rem', flexWrap: 'wrap', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Rows per page:</span>
          <select 
            value={rowsPerPage} 
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{startCount}–{endCount} of {currentTotal}</span>
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
            style={{ border: 'none', background: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', fontWeight: 700, color: currentPage === 1 ? '#9ca3af' : '#111827' }}
          >
            &lt;
          </button>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
            style={{ border: 'none', background: 'none', cursor: currentPage >= totalPages ? 'default' : 'pointer', fontWeight: 700, color: currentPage >= totalPages ? '#9ca3af' : '#111827' }}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
