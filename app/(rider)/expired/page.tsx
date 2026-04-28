'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

export default function ExpiredWindowPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  // TODO: Replace with real data from API/session
  // source comes from connection record: 'invite' | 'find_a_driver' | 'manual'
  const source: 'invite' | 'find_a_driver' | 'manual' = 'invite';
  const driverName = 'Marcus';
  const riderId = 'TODD·4401';

  const [extraHours, setExtraHours] = useState('');
  const [view, setView] = useState<'options' | 'cancelled' | 'no_response_invite' | 'no_response_fa'>('options');
  const [loading, setLoading] = useState(false);

  async function handleGiveMoreTime() {
    setLoading(true);
    const hours = parseInt(extraHours) || 8; // Default 8 hours
    // TODO: Call API to extend window
    console.log(`Extending ${hours} hours`);
    // After extending, go back to pending
    router.push('/pending');
  }

  async function handleCancel() {
    setLoading(true);
    // TODO: Call cancel API
    if (source === 'find_a_driver') {
      setView('no_response_fa');
    } else {
      setView('no_response_invite');
    }
    setLoading(false);
  }

  // ── No response — invite flow (S6A) ─────────────────────
  if (view === 'no_response_invite') {
    return (
      <div className="app-shell">
        <div className="app-topbar">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: 'var(--navy)',
          }}>TW</div>
        </div>
        <div className="layout-center" style={{ background: 'var(--white)', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>&#128336;</div>
            <div className="t-display mb-8">Driver Didn&rsquo;t Respond in Time</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28, lineHeight: 1.6 }}>
              {driverName} wasn&rsquo;t able to connect at this time.
            </div>

            <div className="rider-id-card mb-20">
              <div className="ric-label">Your Rider ID is saved</div>
              <div className="ric-id">{riderId}</div>
              <div className="ric-note">You never need to register again. This ID stays with you across all drivers and airports.</div>
            </div>

            <div className="card-green mb-24" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: 'var(--green)', lineHeight: 1.6 }}>
                You can search for a driver at no cost. {config.serviceName} has verified drivers ready at your airport.
              </div>
            </div>

            <Link href="/find-a-barber">
              <button type="button" className="btn btn-amber btn-full btn-lg mb-8">Find a Driver &rarr;</button>
            </Link>
            <Link href="/home">
              <button type="button" className="btn btn-ghost btn-full">Back to home</button>
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

  // ── No response — Find a Driver flow (S6B) ──────────────
  if (view === 'no_response_fa') {
    return (
      <div className="app-shell">
        <div className="app-topbar">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: 'var(--navy)',
          }}>TW</div>
        </div>
        <div className="layout-center" style={{ background: 'var(--white)', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>&#128336;</div>
            <div className="t-display mb-8">Driver Didn&rsquo;t Respond in Time</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28, lineHeight: 1.6 }}>
              {driverName} wasn&rsquo;t able to connect at this time.
            </div>

            <div className="rider-id-card mb-20">
              <div className="ric-label">Your Rider ID is saved</div>
              <div className="ric-id">{riderId}</div>
              <div className="ric-note">You never need to register again. This ID stays with you across all drivers and airports.</div>
            </div>

            <div className="card-green mb-24" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: 'var(--green)', lineHeight: 1.6 }}>
                Your $9.99 covers all future searches. Keep searching at no additional cost. {config.serviceName} has verified drivers ready at your airport.
              </div>
            </div>

            <Link href="/find-a-barber">
              <button type="button" className="btn btn-amber btn-full btn-lg mb-8">Find a Driver &rarr;</button>
            </Link>
            <Link href="/home">
              <button type="button" className="btn btn-ghost btn-full">Back to home</button>
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

  // ── Main expired window — give more time (S5) ───────────
  return (
    <div className="app-shell">
      <div className="app-topbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        </Link>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: 'var(--navy)',
        }}>TW</div>
      </div>

      <div className="layout-center" style={{ background: 'var(--white)', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>

          <div style={{ fontSize: 36, marginBottom: 12 }}>&#9201;</div>
          <div className="t-title mb-4">{driverName} hasn&rsquo;t responded yet</div>
          <div className="t-small mb-20">
            The 2-hour window has passed. Would you like to give {driverName} more time?
          </div>

          {/* Give more time card */}
          <div className="card mb-16" style={{ textAlign: 'left' }}>
            <div className="t-label mb-12">Give more time</div>
            <div className="hours-input-wrap">
              <input
                className="hours-input"
                placeholder="8"
                value={extraHours}
                onChange={(e) => setExtraHours(e.target.value.replace(/\D/g, '').slice(0, 2))}
                inputMode="numeric"
              />
              <div className="hours-label">
                hours<br />
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Leave blank for 8 hrs auto</span>
              </div>
            </div>
            <div className="card-surface" style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
              If you leave the hours blank 8 hours will be given automatically &mdash; enough time for late nights and early mornings when both of you may be unavailable.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-full btn-lg mb-8"
            onClick={handleGiveMoreTime}
            disabled={loading}
          >
            {loading ? 'Extending...' : 'Give more time \u2192'}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-full mb-16"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel request
          </button>

          {/* Rider ID reminder */}
          <div className="card-amber" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: 'var(--amber-dim)', lineHeight: 1.6 }}>
              If you cancel your request &mdash; your Rider ID <strong>{riderId}</strong> is saved. You never need to register again. You can find another professional driver at your airport at no cost.
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
