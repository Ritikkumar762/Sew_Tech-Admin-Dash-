import PageHeader from '@/components/ui/PageHeader';

const categories = [
  { name: 'Spare Parts Master', count: '1,240 SKUs', icon: '🔩', path: '/mdm/spares' },
  { name: 'Mechanic Skills Matrix', count: '24 skill sets', icon: '🔧', path: '/mdm/skills' },
  { name: 'Location / Region Data', count: '42 cities', icon: '📍', path: '/mdm/locations' },
  { name: 'Category Taxonomy', count: '18 categories', icon: '🏷️', path: '/mdm/categories' },
  { name: 'Pricing Configuration', count: '6 price tiers', icon: '💲', path: '/mdm/pricing' },
  { name: 'Platform Settings', count: 'Global config', icon: '⚙️', path: '/settings' },
];

export default function MDMPage() {
  return (
    <div>
      <PageHeader title="Master Data Management" subtitle="Configure and manage the core data that drives the platform" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {categories.map(c => (
          <div key={c.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', background: '#f0f4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{c.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
