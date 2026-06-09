'use client';
import { useUsers } from './_hooks/useUsers';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { User } from '@/types';

const columns: Column<User>[] = [
  { key: 'name', label: 'Name', render: (r) => <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', fontSize: '0.875rem' }}>{r.name[0]}</div>{r.name}</div> },
  { key: 'email', label: 'Email', render: (r) => <span style={{ color: '#6b7280' }}>{r.email}</span> },
  { key: 'role', label: 'Role', render: (r) => <Badge label={r.role} /> },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
  { key: 'joinedAt', label: 'Joined' },
];

export default function UsersPage() {
  const { users, loading, error } = useUsers();
  const router = useRouter();
  return (
    <div>
      <PageHeader title="User Management" subtitle="View and manage all platform users" actions={<button className="btn btn-dark">+ Invite User</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>Total Users</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{users.length}</div></div>
        <div className="card"><div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Active</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{users.filter(u => u.status === 'Active').length}</div></div>
        <div className="card"><div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>Suspended</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{users.filter(u => u.status === 'Suspended').length}</div></div>
        <div className="card"><div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>Inactive</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{users.filter(u => u.status === 'Inactive').length}</div></div>
      </div>
      <div className="card">
        {loading && <p className="text-muted">Loading users...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={users} onRowClick={(r) => router.push(`/users/${r.id}`)} />}
      </div>
    </div>
  );
}
