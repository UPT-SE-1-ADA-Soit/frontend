import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 800, color: '#09A5A0' }}>404</h1>
      <p style={{ color: '#6B7280', fontSize: 14 }}>
        We couldn&apos;t find that page.
      </p>
      <Link
        to="/"
        style={{
          marginTop: 8,
          padding: '10px 22px',
          background: '#09A5A0',
          color: '#fff',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Go home
      </Link>
    </div>
  );
}
