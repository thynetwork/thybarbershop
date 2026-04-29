'use client';

import config, { splitServiceName } from '@/lib/config';

export default function OfflinePage() {
  const { prefix, highlight } = splitServiceName();
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a2e', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        {prefix}<span style={{ color: '#F5A623' }}>{highlight}</span>
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        You are offline
      </div>
      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '24rem', lineHeight: 1.6 }}>
        Reconnect to continue. Your calendar, client list, and upcoming appointment are still available from cache.
      </div>
      <button
        type="button"
        onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }}
        style={{
          background: '#F5A623', border: 'none', borderRadius: '1rem', padding: '0.85rem 1.5rem',
          fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 800, color: '#0a0a2e',
          cursor: 'pointer',
        }}
      >Try again</button>
      <div style={{ marginTop: '3rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}
      </div>
    </div>
  );
}
