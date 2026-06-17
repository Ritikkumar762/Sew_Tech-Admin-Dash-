export type Route = {
  name: string;
  path: string;
  icon?: string;
  subItems?: Route[];
};

export const NAVIGATION_ROUTES: Route[] = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Alerts', path: '/alerts', icon: '⚠️' },
  { 
    name: 'Sewtech Spares', 
    path: '/spares', 
    icon: '⚙️',
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
    icon: '🔧',
    subItems: [
      { name: 'Overview', path: '/mechanic/overview' },
      { name: 'Orders/Service Requests', path: '/mechanic/orders' },
      { name: 'Mechanic Management', path: '/mechanic/management' },
      { name: 'Mechanic Verification', path: '/mechanic/verification' },
      { name: 'AMC Management', path: '/mechanic/amc' },
      { name: 'Payments', path: '/mechanic/payments' }
    ]
  },
  { name: 'Sewtech Exchange', path: '/exchange', icon: '🔄' },
  { name: 'Sewtech Kaarigar', path: '/kaarigar', icon: '👤' },
  { name: 'Sewtech Academy', path: '/academy', icon: '🎓' },
  { name: 'Master Data Management', path: '/mdm', icon: '📊' },
  { 
    name: 'Finance', 
    path: '/finance', 
    icon: '💰',
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
    icon: '📢',
    subItems: [
      { name: 'Live Banners', path: '/marketing' },
      { name: 'All Creatives', path: '/marketing/creatives' }
    ]
  },
  { name: 'Support & Disputes', path: '/support', icon: '🎧' },
  { 
    name: 'User Management', 
    path: '/users', 
    icon: '👥',
    subItems: [
      { name: 'All Users', path: '/users' },
      { name: 'Add New User', path: '/users/add' }
    ]
  },
  { 
    name: 'System & Settings', 
    path: '/settings', 
    icon: '⚙️',
    subItems: [
      { name: 'Platform Configuration', path: '/settings/platform-configuration' },
      { name: 'Role Management', path: '/settings/role-management' },
      { name: 'Audit & Security', path: '/settings/audit-security' },
      { name: 'Module Wise Settings', path: '/settings/module-settings' },
    ]
  },
];

export const BOTTOM_ROUTES: Route[] = [
  { name: 'Logout', path: '/logout', icon: '🚪' },
];
