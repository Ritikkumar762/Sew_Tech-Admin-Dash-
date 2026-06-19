export type Route = {
  name: string;
  path: string;
  icon?: string;
  subItems?: Route[];
};

export const NAVIGATION_ROUTES: Route[] = [
  { name: 'Dashboard', path: '/dashboard', icon: '/home-03.png' },
  { name: 'Alerts', path: '/alerts', icon: 'AlertTriangle' },
  { 
    name: 'Sewtech Spares', 
    path: '/spares', 
    icon: '/sewtech_spare_logo.png',
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
    icon: '/sewtech_mechincs_logo.png',
    subItems: [
      { name: 'Overview', path: '/mechanic/overview' },
      { name: 'Orders/Service Requests', path: '/mechanic/orders' },
      { name: 'Mechanic Management', path: '/mechanic/management' },
      { name: 'Mechanic Verification', path: '/mechanic/verification' },
      { name: 'AMC Management', path: '/mechanic/amc' },
      { name: 'Payments', path: '/mechanic/payments' }
    ]
  },
  { name: 'Sewtech Exchange', path: '/exchange', icon: 'ArrowLeftRight' },
  { name: 'Sewtech Kaarigar', path: '/kaarigar', icon: 'User' },
  { name: 'Sewtech Academy', path: '/academy', icon: 'PlayCircle' },
  { name: 'Master Data Management', path: '/mdm', icon: 'Network' },
  { 
    name: 'Finance', 
    path: '/finance', 
    icon: 'Coins',
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
