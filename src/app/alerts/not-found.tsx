import Link from 'next/link';

export default function AlertNotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Alert Not Found</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
        This alert may have been deleted or the ID is incorrect.
      </p>
      <Link href="/alerts" className="btn btn-dark">Back to Alerts</Link>
    </div>
  );
}
