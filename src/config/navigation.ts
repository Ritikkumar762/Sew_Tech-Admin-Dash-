export type Route = {
  name: string;
  path: string;
  icon?: string;
  subItems?: Route[];
  activeBg?: string;
  activeColor?: string;
  activeHoverBg?: string;
};

export const NAVIGATION_ROUTES: Route[] = [
  { name: 'Dashboard', path: '/dashboard', icon: '/home-03.png' },
  { name: 'Alerts', path: '/alerts', icon: '/alert-02.svg' },
  { 
    name: 'Sewtech Spares', 
    path: '/spares', 
    icon: '/sewtech spares.svg',
    activeBg: '#fee2e2',
    activeColor: '#dc2626',
    activeHoverBg: '#fecaca',
    subItems: [
      { name: 'Overview', path: '/spares/overview' },
      { name: 'All Spares', path: '/spares/all' },
      { name: 'Inventory Management', path: '/spares/inventory' },
      { name: 'Orders Management', path: '/spares/orders' },
      { name: 'Order Requests', path: '/spares/requests' },
      { name: 'Requests & Alerts', path: '/spares/alerts' }
    ]
  },
  { 
    name: 'Sewtech Mechanic', 
    path: '/mechanic', 
    icon: '/sewtech mechanic_logo.svg',
    activeBg: '#d1fae5',
    activeColor: '#059669',
    activeHoverBg: '#a7f3d0',
    subItems: [
      { name: 'Overview', path: '/mechanic/overview' },
      { name: 'Orders/Service Requests', path: '/mechanic/orders' },
      { name: 'Mechanic Management', path: '/mechanic/management' },
      { name: 'Mechanic Verification', path: '/mechanic/verification' },
      { name: 'AMC Management', path: '/mechanic/amc' },
      { name: 'Payments', path: '/mechanic/payments' }
    ]
  },
  { 
    name: 'Sewtech Exchange', 
    path: '/exchange', 
    icon: '/Exchnage_sidebar_logo.svg',
    activeBg: '#fff3e0',
    activeColor: '#d97706',
    activeHoverBg: '#ffe0b2',
  },
  { 
    name: 'Sewtech Kaarigar', 
    path: '/kaarigar', 
    icon: '/kaarigar_logo.png',
    activeBg: '#e8f0fe',
    activeColor: '#1a73e8',
    activeHoverBg: '#d2e3fc',
  },
  { 
    name: 'Sewtech Academy', 
    path: '/academy', 
    icon: '/academy_logo.png',
    activeBg: '#f3e8ff',
    activeColor: '#9333ea',
    activeHoverBg: '#e9d5ff'
  },
  { name: 'Master Data Management', path: '/mdm', icon: 'Network' },
  { 
    name: 'Finance', 
    path: '/finance', 
    icon: '/money-bag-02.svg',
    subItems: [
      { name: 'Overview', path: '/finance' },
      { name: 'Gold Membership', path: '/finance/gold-membership' },
      { name: 'Discount Codes', path: '/finance/discount-codes' },
      { name: 'Referrals', path: '/finance/referrals' }
    ]
  },
  { 
    name: 'Ads & Marketing', 
    path: '/marketing', 
    icon: 'Megaphone',
    subItems: [
      { name: 'Live Banners', path: '/marketing' },
      { name: 'All Creatives', path: '/marketing/creatives' }
    ]
  },
  { name: 'Support & Disputes', path: '/support', icon: 'Headset' },
  { 
    name: 'User Management', 
    path: '/users', 
    icon: 'Users',
    subItems: [
      { name: 'All Users', path: '/users' },
      { name: 'Add New User', path: '/users/add' }
    ]
  },
  { 
    name: 'System & Settings', 
    path: '/settings', 
    icon: 'Settings',
    subItems: [
      { name: 'Platform Configuration', path: '/settings/platform-configuration' },
      { name: 'Role Management', path: '/settings/role-management' },
      { name: 'Audit & Security', path: '/settings/audit-security' },
      { name: 'Module Wise Settings', path: '/settings/module-settings' },
    ]
  },
];

export const BOTTOM_ROUTES: Route[] = [
  { name: 'Logout', path: '/logout', icon: 'LogOut' },
];
