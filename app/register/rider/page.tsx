'use client';

import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';
import RiderRegistrationForm from '@/components/RiderRegistrationForm';

export default function RiderManualRegistration() {
  const { prefix, highlight } = splitServiceName();

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        </Link>
      </div>
      <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          <div className="t-display mb-4">Create your rider account</div>
          <div className="t-small mb-20" style={{ color: 'var(--text-2)' }}>
            Enter the {config.providerLabel} Code your driver shared with you.
          </div>
          <RiderRegistrationForm mode="manual" />
        </div>
      </div>
      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
