import Link from 'next/link';
export default function UserNotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
      <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>User Not Found</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>This user profile does not exist or has been removed.</p>
      <Link href="/users" className="btn btn-dark">Back to Users</Link>
    </div>
  );
}
