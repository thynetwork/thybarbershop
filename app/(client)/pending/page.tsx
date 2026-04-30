'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

export default function PendingApprovalPage() {
  const { prefix, highlight } = splitServiceName();

  // TODO: Replace with real data from API/session
  const barberName = 'Marcus Rivera';
  const barberFirstName = barberName.split(' ')[0];
  const barberCity = 'South Houst...';
  const barberInitials = 'MRC';
  const barberDigits = '3341';
  const clientId = 'TODD\u00B74401';
  const location = 'The Studio \u00B7 Houston, TX';
  const requestSent = 'Today \u00B7 9:14 am';

  // 2-hour countdown
  const [secondsLeft, setSecondsLeft] = useState(2 * 60 * 60);
  const [windowExpired, setWindowExpired] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setWindowExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setWindowExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const timeDisplay = `${hours}:${String(minutes).padStart(2, '0')}`;

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

          {/* Timer */}
          <div className="timer-wrap mb-8">
            <div className="timer-ring" />
            <div className="timer-value">{timeDisplay}</div>
          </div>

          <div className="t-title mb-4">Waiting for {barberFirstName}&hellip;</div>
          <div className="t-small mb-20">
            Your request has been sent. {barberFirstName} has 2 hours to confirm.<br />
            Time remaining to confirm.
          </div>

          {/* Client ID card */}
          <div className="client-id-card">
            <div className="ric-label">Your Client ID</div>
            <div className="ric-id">{clientId}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 12 }}>
              Write this down right now.
            </div>
            <div className="ric-note">
              This ID is yours permanently &mdash; it never changes, it never expires, and it
              travels with you across every {config.providerLabel.toLowerCase()} and every platform.
              Your {config.providerLabel.toLowerCase()} uses it to identify you on every booking.
              Lose your phone. Change your email. Your Client ID remains.
            </div>
          </div>

          {/* Booking summary */}
          <div className="card mb-16" style={{ textAlign: 'left' }}>
            <div className="row">
              <span className="row-label">{config.providerLabel}</span>
              <span className="row-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {barberName}
                <div className="barber-code">
                  <div className="dc-airport" style={{ fontSize: 10, padding: '3px 6px' }}>{barberCity}</div>
                  <div className="dc-initials" style={{ fontSize: 10, padding: '3px 6px' }}>{barberInitials}</div>
                  <div className="dc-digits" style={{ fontSize: 10, padding: '3px 6px' }}>{barberDigits}</div>
                </div>
              </span>
            </div>
            <div className="row">
              <span className="row-label">Location</span>
              <span className="row-value">{location}</span>
            </div>
            <div className="row">
              <span className="row-label">Request sent</span>
              <span className="row-value">{requestSent}</span>
            </div>
          </div>

          {/* Status steps */}
          <div className="status-steps mb-20" style={{ textAlign: 'left' }}>
            <div className="ss">
              <div className="ss-dot ss-green" />
              <span className="ss-text-green">Request sent</span>
            </div>
            <div className="ss">
              <div className="ss-dot ss-amber" />
              <span className="ss-text-amber">Waiting for {barberFirstName} to approve</span>
            </div>
            <div className="ss">
              <div className="ss-dot ss-gray" />
              <span className="ss-text-gray">Connected &mdash; ready to book</span>
            </div>
          </div>

          {/* Cancel button */}
          {!windowExpired ? (
            <>
              <div className="t-small mb-16" style={{ color: 'var(--text-3)' }}>
                Cancel button becomes available after the 2-hour window closes.
              </div>
              <button className="btn btn-ghost" style={{ opacity: 0.4, cursor: 'not-allowed' }} disabled>
                Cancel request
              </button>
            </>
          ) : (
            <>
              <div className="t-small mb-16" style={{ color: 'var(--text-3)' }}>
                The window has expired. You can cancel or give more time.
              </div>
              <Link href="/expired">
                <button type="button" className="btn btn-primary btn-full btn-lg mb-8">View options &rarr;</button>
              </Link>
              <button type="button" className="btn btn-ghost btn-full">Cancel request</button>
            </>
          )}
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
