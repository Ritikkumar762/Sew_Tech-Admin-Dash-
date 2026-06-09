'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ROUTES, BOTTOM_ROUTES } from '@/config/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ '/spares': true });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const sidebarContent = (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoText}>
          SEWTECH <br /> mart
        </div>
        {/* Close button visible on mobile */}
        <button className={styles.closeBtn} onClick={() => setIsMobileOpen(false)}>✕</button>
      </div>

      <nav className={styles.nav}>
        {NAVIGATION_ROUTES.map((route) => {
          const isActive =
            pathname === route.path ||
            (route.subItems && pathname.startsWith(route.path)) ||
            (pathname === '/dashboard' && route.path === '/dashboard');
          const isOpen = openMenus[route.path];

          return (
            <div key={route.path} className={styles.navItem}>
              {route.subItems ? (
                <div
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => toggleMenu(route.path)}
                >
                  <div className={styles.navLinkContent}>
                    <span className={styles.navIcon}>{route.icon}</span>
                    <span>{route.name}</span>
                  </div>
                  <span className={styles.chevron}>{isOpen ? '▾' : '›'}</span>
                </div>
              ) : (
                <Link
                  href={route.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <div className={styles.navLinkContent}>
                    <span className={styles.navIcon}>{route.icon}</span>
                    <span>{route.name}</span>
                  </div>
                  <span className={styles.chevron}>›</span>
                </Link>
              )}

              {route.subItems && isOpen && (
                <div className={styles.subMenu}>
                  {route.subItems.map((subItem) => {
                    const isSubActive =
                      pathname === subItem.path ||
                      (pathname === '/dashboard' && subItem.path === '/spares/overview');
                    return (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={`${styles.subNavLink} ${isSubActive ? styles.subNavLinkActive : ''}`}
                      >
                        <span className={styles.subDot}>•</span>
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className={styles.bottomArea}>
        {BOTTOM_ROUTES.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={styles.navLink}
            style={route.name === 'Logout' ? { color: 'var(--danger)' } : {}}
          >
            <div className={styles.navLinkContent}>
              <span className={styles.navIcon}>{route.icon}</span>
              <span>{route.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className={styles.hamburger}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Desktop Sidebar */}
      <div className={styles.desktopSidebar}>{sidebarContent}</div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />
          <div className={styles.mobileSidebar}>{sidebarContent}</div>
        </>
      )}
    </>
  );
}
