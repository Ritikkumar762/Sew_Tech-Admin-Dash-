'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ROUTES, BOTTOM_ROUTES } from '@/config/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  // Keep Sewtech Spares open by default as in the image
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '/spares': true
  });

  const toggleMenu = (path: string) => {
    setOpenMenus(prev => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoText}>
          SEWTECH <br /> mart
        </div>
      </div>

      <nav className={styles.nav}>
        {NAVIGATION_ROUTES.map((route) => {
          // Hardcoding active state to /spares for the purpose of the mockup replication
          const isActive = pathname.startsWith(route.path) || (pathname === '/' && route.path === '/spares');
          const isOpen = openMenus[route.path];

          return (
            <div key={route.path} className={styles.navItem}>
              {route.subItems ? (
                <div 
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => toggleMenu(route.path)}
                >
                  <div className={styles.navLinkContent}>
                    <span>{route.icon}</span>
                    <span>{route.name}</span>
                  </div>
                  <span>{isOpen ? 'v' : '>'}</span>
                </div>
              ) : (
                <Link 
                  href={route.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <div className={styles.navLinkContent}>
                    <span>{route.icon}</span>
                    <span>{route.name}</span>
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {route.subItems && isOpen && (
                <div className={styles.subMenu}>
                  {route.subItems.map(subItem => {
                    const isSubActive = pathname === subItem.path || (pathname === '/' && subItem.path === '/spares/overview');
                    return (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={`${styles.subNavLink} ${isSubActive ? styles.subNavLinkActive : ''}`}
                      >
                        {!isSubActive && <span style={{fontSize: '0.5rem', opacity: 0.5}}>•</span>}
                        {subItem.name}
                      </Link>
                    )
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
              <span>{route.icon}</span>
              <span>{route.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
