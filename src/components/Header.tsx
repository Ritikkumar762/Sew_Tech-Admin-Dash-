import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Smart View Dashboard</h1>
          <div className={styles.breadcrumbs}>
            Sewtech Spare <span style={{margin: '0 0.5rem'}}>•</span> <span className={styles.breadcrumbActive}>Order Management</span>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.datePicker}>
            <span>Last 7 Days</span>
            <span>v</span>
          </div>
          <button className={styles.exportBtn}>
            Export <span>⬇️</span>
          </button>
        </div>
      </div>
    </header>
  );
}
