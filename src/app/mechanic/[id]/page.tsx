'use client';
import { useMechanics } from '../_hooks/useMechanics';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';

export default function MechanicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { mechanics, loading } = useMechanics();
  if (loading) return <div className="card">Loading...</div>;
  const mechanic = mechanics.find((m) => m.id === id);
  if (!mechanic) return notFound();
  return (
    <div>
      <PageHeader title={mechanic.name} subtitle={`${mechanic.expertise} · ${mechanic.location}`} actions={<Link href="/mechanic" className="btn btn-outline">← Back</Link>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          {[['Phone', mechanic.phone], ['Location', mechanic.location], ['Expertise', mechanic.expertise], ['Rating', `⭐ ${mechanic.rating}`], ['Total Jobs', mechanic.totalJobs], ['Status', mechanic.status]].map(([k, v]) => (
            <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{k === 'Status' ? <Badge label={String(v)} /> : String(v)}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-dark" style={{ justifyContent: 'flex-start' }}>📋 Assign Job</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>✏️ Edit Profile</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', color: '#ef4444' }}>🚫 Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
