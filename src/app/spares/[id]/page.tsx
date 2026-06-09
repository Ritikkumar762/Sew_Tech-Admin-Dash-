'use client';
import { useSpares } from '../_hooks/useSpares';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';

export default function SpareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { spares, loading } = useSpares();
  if (loading) return <div className="card">Loading...</div>;
  const spare = spares.find((s) => s.id === id);
  if (!spare) return notFound();

  return (
    <div>
      <PageHeader title={spare.name} subtitle={`SKU: ${spare.sku}`} actions={<Link href="/spares/all" className="btn btn-outline">← Back</Link>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Spare Details</h3>
          {[['SKU', spare.sku], ['Category', spare.category], ['Price', `₹${spare.price}`], ['Stock', spare.stock], ['Status', spare.status]].map(([k, v]) => (
            <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>{k}</span>
              <span style={{ fontWeight: 600 }}>
                {k === 'Status' ? <Badge label={String(v)} /> : String(v)}
              </span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-dark" style={{ justifyContent: 'flex-start' }}>📦 Update Stock</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>✏️ Edit Details</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>🗑️ Delete Spare</button>
          </div>
        </div>
      </div>
    </div>
  );
}
