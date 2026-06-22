'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ROUTES, BOTTOM_ROUTES } from '@/config/navigation';
import { 
  Home,
  AlertTriangle,
  ShoppingCart,
  Wrench,
  ArrowLeftRight,
  User, 
  PlayCircle, 
  Network, 
  Coins,
  Megaphone, 
  Headset, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import styles from './Sidebar.module.css';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={18} strokeWidth={2.5} />,
  AlertTriangle: <AlertTriangle size={18} strokeWidth={2.5} />,
  ShoppingCart: <ShoppingCart size={18} strokeWidth={2.5} />,
  Wrench: <Wrench size={18} strokeWidth={2.5} />,
  ArrowLeftRight: <ArrowLeftRight size={18} strokeWidth={2.5} />,
  User: <User size={18} strokeWidth={2.5} />,
  PlayCircle: <PlayCircle size={18} strokeWidth={2.5} />,
  Network: <Network size={18} strokeWidth={2.5} />,
  Coins: <Coins size={18} strokeWidth={2.5} />,
  Megaphone: <Megaphone size={18} strokeWidth={2.5} />,
  Headset: <Headset size={18} strokeWidth={2.5} />,
  Users: <Users size={18} strokeWidth={2.5} />,
  Settings: <Settings size={18} strokeWidth={2.5} />,
  LogOut: <LogOut size={18} strokeWidth={2.5} />
};

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ '/spares': true });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Auto-expand active sub-menus
  useEffect(() => {
    NAVIGATION_ROUTES.forEach((route) => {
      if (route.subItems && (pathname === route.path || pathname.startsWith(route.path + '/'))) {
        setOpenMenus((prev) => ({ ...prev, [route.path]: true }));
      }
    });
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
        <img src="/main_logo.png" alt="Sewtech Mart" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
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
          const isLinkActive = isActive || !!(route.subItems && isOpen);

          return (
            <div 
              key={route.path} 
              className={styles.navItem}
              style={{
                ['--active-bg' as any]: route.activeBg,
                ['--active-color' as any]: route.activeColor,
                ['--active-hover-bg' as any]: route.activeHoverBg,
              }}
            >
              {route.subItems ? (
                <div
                  className={`${styles.navLink} ${isLinkActive ? styles.navLinkActive : ''}`}
                  onClick={() => toggleMenu(route.path)}
                >
                  <div className={styles.navLinkContent}>
                    <span className={`${styles.navIcon} ${route.icon?.includes('.png') ? styles.navIconImage : ''}`}>
                      {route.icon?.includes('.png') ? (
                        <img src={route.icon} alt={route.name} style={{ width: '24px', height: '24px', objectFit: 'contain', display: 'block' }} />
                      ) : route.icon && iconMap[route.icon] ? (
                        iconMap[route.icon]
                      ) : (
                        route.icon
                      )}
                    </span>
                    <span>{route.name}</span>
                  </div>
                  <span className={styles.chevron}>
                    {isOpen ? <ChevronDown size={16} strokeWidth={2.2} /> : <ChevronRight size={16} strokeWidth={2.2} />}
                  </span>
                </div>
              ) : (
                <Link
                  href={route.path}
                  className={`${styles.navLink} ${isLinkActive ? styles.navLinkActive : ''}`}
                >
                  <div className={styles.navLinkContent}>
                    <span className={`${styles.navIcon} ${route.icon?.includes('.png') ? styles.navIconImage : ''}`}>
                      {route.icon?.includes('.png') ? (
                        <img src={route.icon} alt={route.name} style={{ width: '24px', height: '24px', objectFit: 'contain', display: 'block' }} />
                      ) : route.icon && iconMap[route.icon] ? (
                        iconMap[route.icon]
                      ) : (
                        route.icon
                      )}
                    </span>
                    <span>{route.name}</span>
                  </div>
                  <span className={styles.chevron}>
                    <ChevronRight size={16} strokeWidth={2.2} />
                  </span>
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
                        <span className={styles.subDot}></span>
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
              <span className={`${styles.navIcon} ${route.icon?.includes('.png') ? styles.navIconImage : ''}`} style={route.name === 'Logout' ? { color: '#ef4444' } : {}}>
                {route.icon?.includes('.png') ? (
                  <img src={route.icon} alt={route.name} style={{ width: '24px', height: '24px', objectFit: 'contain', display: 'block' }} />
                ) : route.icon && iconMap[route.icon] ? (
                  iconMap[route.icon]
                ) : (
                  route.icon
                )}
              </span>
              <span style={route.name === 'Logout' ? { color: '#ef4444' } : {}}>{route.name}</span>
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
