import React from 'react';
import Link from 'next/link';
import styles from './ProductsInventory.module.css';
import { SpareProduct } from './Types';

interface DataTableProps {
  data: SpareProduct[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" className={styles.checkbox} />
            </th>
            <th>Spare Name <span className={styles.sortIcon}>↓↑</span></th>
            <th>Category <span className={styles.sortIcon}>↓↑</span></th>
            <th>Compatible Machines <span className={styles.sortIcon}>↓↑</span></th>
            <th>Price Range <span className={styles.sortIcon}>↓↑</span></th>
            <th>Stock Status <span className={styles.sortIcon}>↓↑</span></th>
            <th>Visibility <span className={styles.sortIcon}>↓↑</span></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" className={styles.checkbox} defaultChecked={idx === 2} />
              </td>
              <td>
                <div className={styles.productCell}>
                  <div className={styles.productIconWrapper}>
                    <span className={styles.productIcon}>b</span>
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
                <span className={styles.priceRange}>₹{item.priceMin.toLocaleString()} - ₹{item.priceMax.toLocaleString()}</span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${item.stockStatus === 'Out of Stock' ? styles.statusOut : styles.statusIn}`}>
                  {item.stockStatus === 'In-Stock' ? item.stock : item.stockStatus}
                </span>
              </td>
              <td>
                <span className={`${styles.visibilityBadge} ${item.visibility === 'Live' ? styles.visLive : styles.visDraft}`}>
                  {item.visibility}
                </span>
              </td>
              <td>
                <Link href={`/spares/${item.id}`} className={styles.viewBtn}>
                  View <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
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
