import React from 'react';
import Link from 'next/link';
import styles from './ProductsInventory.module.css';
import { SpareProduct } from './Types';

interface DataTableProps {
  data: SpareProduct[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
}

export function DataTable({ data, selectedIds, onSelect, onSelectAll }: DataTableProps) {
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
      
      <div className={styles.pagination}>
        <div className={styles.pageInfo}>
          Rows per page: 
          <select className={styles.pageSelect}>
            <option>10</option>
          </select>
          <span className={styles.pageRange}>1-10 of 165</span>
          <div className={styles.pageNav}>
            <button className={styles.pageBtn}>&lt;</button>
            <button className={styles.pageBtn}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
