'use client';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

// Map routes → human-readable breadcrumb labels
const BREADCRUMB_MAP: Record<string, { section: string; page: string }> = {
  '/dashboard':          { section: 'Sewtech Spare', page: 'Order Management' },
  '/alerts':             { section: 'Alerts', page: 'All Notifications' },
  '/spares':             { section: 'Sewtech Spares', page: 'Overview' },
  '/spares/overview':    { section: 'Sewtech Spares', page: 'Overview' },
  '/spares/all':         { section: 'Sewtech Spares', page: 'All Spares' },
  '/spares/inventory':   { section: 'Sewtech Spares', page: 'Inventory Management' },
  '/spares/orders':      { section: 'Sewtech Spares', page: 'Orders Management' },
  '/spares/requests':    { section: 'Sewtech Spares', page: 'Order Requests' },
  '/spares/alerts':      { section: 'Sewtech Spares', page: 'Requests & Alerts' },
  '/mechanic':           { section: 'Sewtech Mechanic', page: 'All Mechanics' },
  '/exchange':           { section: 'Sewtech Exchange', page: 'Exchange Board' },
  '/kaarigar':           { section: 'Sewtech Kaarigar', page: 'Kaarigar Directory' },
  '/academy':            { section: 'Sewtech Academy', page: 'Courses' },
  '/mdm':                { section: 'Master Data Management', page: 'Configuration' },
  '/finance':            { section: 'Finance', page: 'Transactions' },
  '/marketing':          { section: 'Ads & Marketing', page: 'Campaigns' },
  '/support':            { section: 'Support & Disputes', page: 'All Tickets' },
  '/users':              { section: 'User Management', page: 'All Users' },
  '/settings':           { section: 'Settings', page: 'System & Settings' },
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/spares/') && pathname.split('/').length === 4) return 'Spare Detail';
  if (pathname.startsWith('/alerts/'))   return 'Alert Detail';
  if (pathname.startsWith('/mechanic/')) return 'Mechanic Profile';
  if (pathname.startsWith('/users/'))    return 'User Profile';
  if (pathname.startsWith('/support/'))  return 'Ticket Detail';
  return 'Smart View Dashboard';
}

export default function Header() {
  const pathname = usePathname();
  const crumb = BREADCRUMB_MAP[pathname] ?? { section: 'Sewtech Spare', page: getPageTitle(pathname) };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>Smart View Dashboard</h1>
        <div className={styles.breadcrumbs}>
          {crumb.section}
          <span style={{ margin: '0 0.4rem', color: '#d1d5db' }}>•</span>
          <span className={styles.breadcrumbActive}>{crumb.page}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.datePicker}>
          <span>📅</span>
          <span>Last 7 Days</span>
          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>▼</span>
        </div>
        <button className={styles.exportBtn}>
          <span>Export</span>
          <span>⬇️</span>
        </button>
      </div>
    </header>
  );
}
