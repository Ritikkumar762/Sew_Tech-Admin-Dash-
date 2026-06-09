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
  { name: 'Sewtech Mechanic', path: '/mechanic', icon: '🔧' },
  { name: 'Sewtech Exchange', path: '/exchange', icon: '🔄' },
  { name: 'Sewtech Kaarigar', path: '/kaarigar', icon: '👤' },
  { name: 'Sewtech Academy', path: '/academy', icon: '🎓' },
  { name: 'Master Data Management', path: '/mdm', icon: '📊' },
  { name: 'Finance', path: '/finance', icon: '💰' },
  { name: 'Ads & Marketing', path: '/marketing', icon: '📢' },
  { name: 'Support & Disputes', path: '/support', icon: '🎧' },
  { name: 'User Management', path: '/users', icon: '👥' },
];

export const BOTTOM_ROUTES: Route[] = [
  { name: 'Logout', path: '/logout', icon: '🚪' },
  { name: 'System & Settings', path: '/settings', icon: '⚙️' },
];
