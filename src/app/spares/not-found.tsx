import Link from 'next/link';
export default function SpareNotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔩</div>
      <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Spare Not Found</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>This spare part does not exist or has been removed.</p>
      <Link href="/spares/all" className="btn btn-dark">View All Spares</Link>
    </div>
  );
}
