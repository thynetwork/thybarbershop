'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

export default function PendingApprovalPage() {
  const { prefix, highlight } = splitServiceName();

  // TODO: Replace with real data from API/session
  const driverName = 'James Rivera';
  const driverFirstName = driverName.split(' ')[0];
  const driverAirport = 'IAH';
  const driverInitials = 'JDR';
  const driverDigits = '4207';
  const riderId = 'TODD·4401';
  const requestSent = 'Today · 9:14 am';

  // 2-hour countdown
  const [secondsLeft, setSecondsLeft] = useState(2 * 60 * 60); // 2 hours
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
        <div className="topbar-avatar" style={{
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

          <div className="t-title mb-4">Waiting for {driverFirstName}&hellip;</div>
          <div className="t-small mb-20">
            Your request has been sent. {driverFirstName} has 2 hours to confirm.<br />
            Time remaining to confirm.
          </div>

          {/* Rider ID card */}
          <div className="rider-id-card">
            <div className="ric-label">Your Rider ID</div>
            <div className="ric-id">{riderId}</div>
            <div className="ric-note">
              Please write this down. Your driver uses this to identify you on every booking request. This ID is yours &mdash; it stays with you across all drivers and airports.
            </div>
          </div>

          {/* Booking summary */}
          <div className="card mb-16" style={{ textAlign: 'left' }}>
            <div className="row">
              <span className="row-label">Driver</span>
              <span className="row-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {driverName}
                <div className="driver-code">
                  <div className="dc-airport">{driverAirport}</div>
                  <div className="dc-initials">{driverInitials}</div>
                  <div className="dc-digits">{driverDigits}</div>
                </div>
              </span>
            </div>
            <div className="row">
              <span className="row-label">Airport</span>
              <span className="row-value">{driverAirport} &mdash; Houston</span>
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
              <span className="ss-text-amber">Waiting for {driverFirstName} to approve</span>
            </div>
            <div className="ss">
              <div className="ss-dot ss-gray" />
              <span className="ss-text-gray">Connected &mdash; ready to book</span>
            </div>
          </div>

          {/* Cancel button — disabled during active window */}
          {!windowExpired ? (
            <>
              <div className="t-small mb-16" style={{ color: 'var(--text-3)' }}>
                Cancel button becomes available after the 2-hour window closes.
              </div>
              <button
                className="btn btn-ghost"
                style={{ opacity: 0.4, cursor: 'not-allowed' }}
                disabled
              >
                Cancel request
              </button>
            </>
          ) : (
            <>
              <div className="t-small mb-16" style={{ color: 'var(--text-3)' }}>
                The window has expired. You can cancel or give more time.
              </div>
              <Link href="/expired">
                <button type="button" className="btn btn-primary btn-full btn-lg mb-8">
                  View options &rarr;
                </button>
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-full"
                onClick={() => {
                  // TODO: Call cancel API
                }}
              >
                Cancel request
              </button>
            </>
          )}
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
