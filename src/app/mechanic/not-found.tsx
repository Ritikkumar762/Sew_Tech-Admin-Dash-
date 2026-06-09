import Link from 'next/link';
export default function MechanicNotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔧</div>
      <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Mechanic Not Found</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>This mechanic profile does not exist.</p>
      <Link href="/mechanic" className="btn btn-dark">Back to Mechanics</Link>
    </div>
  );
}
