import PageHeader from '@/components/ui/PageHeader';

export default function KaarigarPage() {
  return (
    <div>
      <PageHeader title="Sewtech Kaarigar" subtitle="Manage skilled artisans and their work orders" actions={<button className="btn btn-dark">+ Add Kaarigar</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[{ label: 'Total Kaarigar', value: '38' }, { label: 'Active Jobs', value: '12' }, { label: 'Completed This Month', value: '87' }].map(item => (
          <div key={item.label} className="card">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>{item.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Kaarigar Directory</h3>
        <p>Connect your API at <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/api/kaarigar</code> to show the full directory.</p>
      </div>
    </div>
  );
}
