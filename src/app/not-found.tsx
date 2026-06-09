import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '60vh',
      textAlign: 'center',
      gap: '1rem'
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>404</h1>
      <h2 className="heading-2">Page Not Found</h2>
      <p className="text-muted" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link href="/" className="btn btn-dark">
        Return to Dashboard
      </Link>
    </div>
  );
}
