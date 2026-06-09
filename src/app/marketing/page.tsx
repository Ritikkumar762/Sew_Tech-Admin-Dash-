'use client';
import { useMarketing } from './_hooks/useMarketing';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { Campaign } from '@/types';

const columns: Column<Campaign>[] = [
  { key: 'name', label: 'Campaign', render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: 'type', label: 'Type', render: (r) => <Badge label={r.type} /> },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
  { key: 'reach', label: 'Reach', render: (r) => r.reach.toLocaleString('en-IN') },
  { key: 'conversions', label: 'Conversions', render: (r) => <span style={{ fontWeight: 700, color: '#10b981' }}>{r.conversions.toLocaleString()}</span> },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
];

export default function MarketingPage() {
  const { campaigns, loading, error } = useMarketing();
  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div>
      <PageHeader title="Ads & Marketing" subtitle="Manage campaigns and track performance" actions={<button className="btn btn-dark">+ New Campaign</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>Total Campaigns</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{campaigns.length}</div></div>
        <div className="card"><div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Active</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{campaigns.filter(c => c.status === 'Active').length}</div></div>
        <div className="card"><div style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600 }}>Total Reach</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalReach.toLocaleString()}</div></div>
        <div className="card"><div style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 600 }}>Conversions</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalConversions.toLocaleString()}</div></div>
      </div>
      <div className="card">
        {loading && <p className="text-muted">Loading campaigns...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={campaigns} />}
      </div>
    </div>
  );
}
