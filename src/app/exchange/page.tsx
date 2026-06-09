import PageHeader from '@/components/ui/PageHeader';

export default function ExchangePage() {
  return (
    <div>
      <PageHeader title="Sewtech Exchange" subtitle="Platform for part exchange between mechanics and vendors" actions={<button className="btn btn-dark">+ Post Exchange</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[{ label: 'Active Listings', value: '24', color: '#10b981' }, { label: 'Pending Exchanges', value: '8', color: '#f59e0b' }, { label: 'Completed', value: '152', color: '#3b82f6' }].map(item => (
          <div key={item.label} className="card">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: item.color }}>{item.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Exchange Board Coming Soon</h3>
        <p>Connect your API at <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/api/exchange/listings</code> to populate the board.</p>
      </div>
    </div>
  );
}
