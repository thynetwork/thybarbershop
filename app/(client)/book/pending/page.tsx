'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'Sarah Chen', initials: 'SC' };
const demoBarberName = 'Marcus';
const demoBarberCode = 'MRC\u00B73341';

export default function PendingPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  /* Countdown timer — demo starts at 1:47 */
  const [seconds, setSeconds] = useState(107);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerDisplay = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-name">{demoUser.name}</div>
          <div className="topbar-avatar">{demoUser.initials}</div>
        </div>
      </div>

      <div className="layout-center" style={{ flexDirection: 'column', gap: 0, padding: 40 }}>
        <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          {/* ── Animated timer ring ──────────────────────────── */}
          <div className="timer-wrap mb-8">
            <div className="timer-ring" />
            <div className="timer-value">{timerDisplay}</div>
          </div>

          <div className="t-title mb-4">Waiting for {demoBarberName}&hellip;</div>
          <div className="t-body t-muted mb-24">
            Your booking request has been sent. {demoBarberName} has 2 hours to confirm.
          </div>

          {/* ── Booking summary card ─────────────────────────── */}
          <div className="card mb-20" style={{ textAlign: 'left' }}>
            <div className="row">
              <span className="row-label">Route</span>
              <span className="row-value">Airport to Home</span>
            </div>
            <div className="row">
              <span className="row-label">Date &amp; time</span>
              <span className="row-value">Thu Jul 17 &middot; 9:00 am</span>
            </div>
            <div className="row">
              <span className="row-label">Amount</span>
              <span className="row-value t-mono" style={{ color: 'var(--purple)' }}>
                $120 set amount
              </span>
            </div>
            <div className="row">
              <span className="row-label">{config.providerLabel}</span>
              <span className="row-value">{demoBarberCode}</span>
            </div>
          </div>

          {/* ── Status steps ─────────────────────────────────── */}
          <div
            className="status-steps mb-20"
            style={{
              textAlign: 'left',
              background: 'var(--surface)',
              borderRadius: 'var(--r-lg)',
              padding: '16px 20px',
            }}
          >
            <div className="status-step">
              <div className="ss-dot ss-done" />
              <span className="ss-text-done">Booking request sent</span>
            </div>
            <div className="status-step">
              <div className="ss-dot ss-active" />
              <span className="ss-text-active">Waiting for {config.providerLabel.toLowerCase()} confirmation</span>
            </div>
            <div className="status-step">
              <div className="ss-dot ss-wait" />
              <span className="ss-text-wait">Booking confirmed</span>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            onClick={() => router.push('/home')}
          >
            Cancel request
          </button>
        </div>
      </div>
    </div>
  );
}
