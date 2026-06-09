import Link from 'next/link';
export default function SupportNotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎧</div>
      <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Ticket Not Found</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>This support ticket does not exist or has been closed.</p>
      <Link href="/support" className="btn btn-dark">Back to Support</Link>
    </div>
  );
}
