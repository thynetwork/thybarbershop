'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';
import ClientRegistrationForm, { type BarberInfo, type PreSetAmount } from '@/components/ClientRegistrationForm';

export default function JoinPage() {
  const params = useParams();
  const { prefix, highlight } = splitServiceName();
  const rawCode = decodeURIComponent((params.code as string) || '');

  const [barber, setBarber] = useState<BarberInfo | null>(null);
  const [preSetAmount, setPreSetAmount] = useState<PreSetAmount | undefined>();
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    async function fetchBarber() {
      try {
        // Parse code: SouthHouston·MRC·3341 or similar
        const cleaned = rawCode.replace(/[·.]/g, '');
        if (cleaned.length < 7) {
          setInvalid(true);
          setLoading(false);
          return;
        }

        const airportCode = cleaned.slice(0, 3).toUpperCase();
        const initials = cleaned.slice(3, cleaned.length - 4).toUpperCase();
        const digits = cleaned.slice(-4);

        const res = await fetch(
          `/api/barbers/lookup?airport=${airportCode}&initials=${initials}&digits=${digits}`
        );

        if (!res.ok) {
          setInvalid(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setBarber({
          id: data.id,
          name: data.name,
          initials: data.initials,
          airportCode: data.airportCode,
          codeInitials: data.codeInitials,
          codeDigits: data.codeDigits,
          airportPermitted: data.airportPermitted,
          insuranceVerified: data.insuranceVerified,
        });

        if (data.preSetAmount) {
          setPreSetAmount({ amount: data.preSetAmount });
        }
      } catch {
        setInvalid(true);
      }
      setLoading(false);
    }

    fetchBarber();
  }, [rawCode]);

  // Invalid / expired link
  if (!loading && invalid) {
    return (
      <div className="app-shell">
        <div className="app-topbar">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          </Link>
        </div>
        <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center' }}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128683;</div>
            <div className="t-display mb-8">Invalid invite link</div>
            <div className="t-small mb-24" style={{ lineHeight: 1.6 }}>
              This invite link is invalid or expired. Ask your barber for a new link, or find a barber at your airport.
            </div>
            <Link href="/find-a-barber">
              <button type="button" className="btn btn-amber btn-full btn-lg mb-8">
                Find a Barber &rarr;
              </button>
            </Link>
            <Link href="/">
              <button type="button" className="btn btn-ghost btn-full">Sign in</button>
            </Link>
          </div>
        </div>
        <footer className="site-footer">
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-topbar">
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        </div>
        <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center', justifyContent: 'center' }}>
          <div className="t-small">Loading invite...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        </Link>
      </div>
      <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          <ClientRegistrationForm
            mode="invite"
            barber={barber!}
            preSetAmount={preSetAmount}
          />
        </div>
      </div>
      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
