'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

/* ── Demo data (will be replaced by API fetch) ─────────────── */
const demoRider = {
  id: 'r1',
  name: 'Sarah Chen',
  initials: 'SC',
  savedRoute: 'Airport to Home',
  setAmount: 120, // null for new riders with no set amount
  date: 'Jul 17, 2026',
  time: '9:00 am',
  isNewRider: false, // toggle for testing
};

const demoDriver = {
  id: 'd1',
  name: 'James Rivera',
  code: 'JDR\u00B74207',
  airportCode: 'IAH',
  codeInitials: 'JDR',
  codeDigits: '4207',
  initials: 'JR',
  rating: 4.97,
  airportPermitted: true,
  insuranceProvider: 'Allstate',
  insuranceType: 'Rideshare',
};

export default function RiderHomePage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  // TODO: Fetch real rider/driver data from session
  const hasSetAmount = demoRider.setAmount && !demoRider.isNewRider;
  const driverFirstName = demoDriver.name.split(' ')[0];

  const [date, setDate] = useState('2026-07-17');
  const [time, setTime] = useState('09:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const displayDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select date';
  const displayTime = time
    ? new Date(`2026-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : 'Select time';

  return (
    <div className="app-shell">
      {/* ── App topbar ─────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">
          {prefix}<span>{highlight}</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-name">{demoRider.name}</div>
          <div className="topbar-avatar">{demoRider.initials}</div>
        </div>
      </div>

      {/* ── Main content (centered single column) ──────────── */}
      <div className="layout-2col">
        <div
          className="main-content"
          style={{ gridColumn: '1/-1', maxWidth: 680, margin: '0 auto', width: '100%' }}
        >

          {/* ══════════════════════════════════════════════════
              NEW RIDER — no set amount, no saved route
              ══════════════════════════════════════════════════ */}
          {!hasSetAmount ? (
            <>
              <div className="gc-new mb-20">
                <div className="gc-hi">Welcome to {config.serviceName},</div>
                <div className="gc-name" style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800 }}>
                  {demoRider.name}
                </div>
                <div className="gc-connected">
                  <div className="gc-ins-dot" />
                  <div className="gc-ins-text">
                    Connected with {demoDriver.name} &middot; {demoDriver.airportCode}&middot;{demoDriver.codeInitials}&middot;{demoDriver.codeDigits}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 16, lineHeight: 1.5 }}>
                  You&apos;re all set. Book your first ride with {driverFirstName} whenever you&apos;re ready.
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/driver/${encodeURIComponent(demoDriver.airportCode + demoDriver.codeInitials + demoDriver.codeDigits)}`)}
                  style={{
                    width: '100%', background: 'var(--amber)', color: 'var(--navy)',
                    border: 'none', borderRadius: 'var(--r-md)', padding: 13,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  Book a Ride &rarr;
                </button>
              </div>

              {/* Your driver card */}
              <div className="t-label mb-8">Your {config.providerLabel.toLowerCase()}</div>
              <div
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/driver/${encodeURIComponent(demoDriver.airportCode + demoDriver.codeInitials + demoDriver.codeDigits)}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar av-amber av-md av-check">{demoDriver.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
                      {demoDriver.name}
                      <span style={{ marginLeft: 8 }}>
                        <span className="driver-code" style={{ display: 'inline-flex' }}>
                          <span className="dc-airport">{demoDriver.airportCode}</span>
                          <span className="dc-initials">{demoDriver.codeInitials}</span>
                          <span className="dc-digits">{demoDriver.codeDigits}</span>
                        </span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <span className="badge badge-green">&#9733; {demoDriver.rating}</span>
                      <span className="badge badge-blue">&#9992; {demoDriver.airportCode}</span>
                      <span className="badge badge-green">&#10003; Insured &middot; {demoDriver.insuranceProvider}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text-3)' }}>&rsaquo;</div>
                </div>
              </div>

              {/* No set amount note */}
              <div className="card-amber" style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--amber-dim)', fontWeight: 500, marginBottom: 4 }}>
                  No set amount yet
                </div>
                <div style={{ fontSize: 12, color: 'var(--amber-dim)', lineHeight: 1.5 }}>
                  A set amount is a custom rate agreed between you and {driverFirstName}. Once you&apos;ve discussed your regular route and rate, {driverFirstName} will set it from his dashboard and it will appear here automatically.
                </div>
              </div>
            </>
          ) : (
            /* ══════════════════════════════════════════════════
               RETURNING RIDER — has set amount and saved route
               ══════════════════════════════════════════════════ */
            <>
              <div className="greeting-card">
                <div className="gc-hi">Welcome back,</div>
                <div className="gc-name">{demoRider.name}</div>

                <div className="gc-route">
                  <div className="gc-dot" />
                  <div className="gc-route-text">{demoRider.savedRoute}</div>
                </div>

                <div className="gc-insured">
                  <div className="gc-ins-dot" />
                  Ride insured by {demoDriver.insuranceProvider} &middot; {demoDriver.name}
                </div>

                {/* Set amount — locked display */}
                <div className="sa-row" style={{ opacity: 0.95 }}>
                  <div className="sa-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Set amount &middot; agreed with {driverFirstName}
                  </div>
                  <div className="sa-value" style={{ color: 'var(--amber)' }}>${demoRider.setAmount}</div>
                </div>

                {/* Date & time pickers */}
                <div className="dt-row">
                  <div
                    className="dt-box"
                    onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="dt-label">Date</div>
                    <div className="dt-value">{displayDate}</div>
                  </div>
                  <div
                    className="dt-box"
                    onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="dt-label">Time</div>
                    <div className="dt-value">{displayTime}</div>
                  </div>
                </div>

                {showDatePicker && (
                  <div style={{ background: 'rgba(10,10,46,0.6)', borderRadius: 10, padding: 12, marginTop: -4, marginBottom: 8 }}>
                    <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setShowDatePicker(false); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--amber)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 700, outline: 'none', colorScheme: 'dark' }}
                      autoFocus />
                  </div>
                )}
                {showTimePicker && (
                  <div style={{ background: 'rgba(10,10,46,0.6)', borderRadius: 10, padding: 12, marginTop: -4, marginBottom: 8 }}>
                    <input type="time" value={time} onChange={(e) => { setTime(e.target.value); setShowTimePicker(false); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--amber)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 700, outline: 'none', colorScheme: 'dark' }}
                      autoFocus />
                  </div>
                )}

                <div className="gc-btns">
                  <button className="gc-confirm" onClick={() => router.push('/book/payment')}>
                    Confirm Booking
                  </button>
                  <button className="gc-new" onClick={() => router.push(`/driver/${encodeURIComponent(demoDriver.airportCode + demoDriver.codeInitials + demoDriver.codeDigits)}`)}>
                    New Destination
                  </button>
                </div>
              </div>

              {/* Your driver */}
              <div className="t-label mb-8">Your {config.providerLabel.toLowerCase()}</div>
              <div className="mini-driver-card" onClick={() => router.push(`/driver/${encodeURIComponent(demoDriver.airportCode + demoDriver.codeInitials + demoDriver.codeDigits)}`)}>
                <div className="avatar av-amber av-md av-check">{demoDriver.initials}</div>
                <div className="mdc-info">
                  <div className="mdc-name">
                    {demoDriver.name} &middot; <span style={{ color: 'var(--amber-dim)' }}>{demoDriver.code}</span>
                  </div>
                  <div className="mdc-sub flex-gap-8" style={{ flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    <span className="badge badge-green">&#9733; {demoDriver.rating}</span>
                    {demoDriver.airportPermitted && <span className="badge badge-blue">&#9992; Airport</span>}
                    <span className="badge badge-green">&#10003; Insured &middot; {demoDriver.insuranceProvider}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Tap to view rates &amp; vehicle</span>
                  </div>
                </div>
                <div style={{ fontSize: 18, color: 'var(--text-3)' }}>&rsaquo;</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName}{' '}
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/conditions">Conditions</a>
      </div>
    </div>
  );
}
