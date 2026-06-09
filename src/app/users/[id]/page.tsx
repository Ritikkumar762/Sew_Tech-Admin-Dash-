'use client';
import { useUsers } from '../_hooks/useUsers';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { users, loading, updateStatus } = useUsers();
  if (loading) return <div className="card">Loading...</div>;
  const user = users.find((u) => u.id === id);
  if (!user) return notFound();

  return (
    <div>
      <PageHeader title={user.name} subtitle={user.email} actions={<Link href="/users" className="btn btn-outline">← Back to Users</Link>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', fontSize: '1.5rem' }}>{user.name[0]}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <Badge label={user.status} />
            </div>
          </div>
          {[['Email', user.email], ['Role', user.role], ['Joined', user.joinedAt], ['Status', user.status]].map(([k, v]) => (
            <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{k === 'Status' || k === 'Role' ? <Badge label={String(v)} /> : String(v)}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Manage User</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => updateStatus(user.id, 'Active')} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>✅ Set Active</button>
            <button onClick={() => updateStatus(user.id, 'Inactive')} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>⏸️ Set Inactive</button>
            <button onClick={() => updateStatus(user.id, 'Suspended')} className="btn btn-outline" style={{ justifyContent: 'flex-start', color: '#ef4444' }}>🚫 Suspend User</button>
          </div>
        </div>
      </div>
    </div>
  );
}
