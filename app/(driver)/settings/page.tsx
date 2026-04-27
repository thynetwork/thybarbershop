'use client';

import { useState } from 'react';
import { config, splitServiceName } from '@/lib/config';
import DriverSidebar from '@/components/DriverSidebar';

/* ── Toggle helper ────────────────────────────── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? 'var(--navy)' : 'var(--surface-2)',
        border: on ? 'none' : '1px solid var(--border-mid)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute', width: 18, height: 18, borderRadius: '50%',
          top: 3, background: on ? 'var(--amber)' : '#fff',
          right: on ? 3 : 'auto', left: on ? 'auto' : 3,
          boxShadow: on ? 'none' : '0 1px 3px rgba(0,0,0,0.07)',
        }}
      />
    </div>
  );
}

function ToggleRow({ label, sub, on, onToggle }: { label: string; sub?: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

export default function DriverSettings() {
  const { prefix, highlight } = splitServiceName();

  /* Notification toggles */
  const [pushOn, setPushOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [reminderTiming, setReminderTiming] = useState('30m');

  /* Booking defaults */
  const [paymentTiming, setPaymentTiming] = useState('On pickup');
  const [cancellation, setCancellation] = useState('Standard');

  /* Account (demo) */
  const email = 'jrivera@email.com';
  const phone = '(713) 555-0121';

  return (
    <div className="app-shell">
      {/* ── App topbar ─────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
            borderRadius: 'var(--r-full)', padding: '4px 12px',
            fontSize: 11, color: 'var(--amber)', fontWeight: 600,
          }}>JDR&middot;4207</div>
          <div className="topbar-avatar">JR</div>
        </div>
      </div>

      {/* ── 2-column: sidebar + main ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 624 }}>
        <DriverSidebar activeItem="Settings" />

        <div className="main-content" style={{ maxWidth: 640 }}>
          <div className="t-title mb-20" style={{ marginBottom: 24 }}>Settings</div>

          {/* ═══ NOTIFICATIONS ═══════════════════════════════ */}
          <div className="t-label mb-8">NOTIFICATIONS</div>
          <div className="card" style={{ marginBottom: 20 }}>
            <ToggleRow label="Push notifications" on={pushOn} onToggle={() => setPushOn(!pushOn)} />
            <ToggleRow label="SMS alerts" sub="Strongly recommended" on={smsOn} onToggle={() => setSmsOn(!smsOn)} />
            <ToggleRow label="Email notifications" on={emailOn} onToggle={() => setEmailOn(!emailOn)} />

            {/* Reminder timing */}
            <div style={{ padding: '14px 0 4px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8 }}>Reminder timing</div>
              <div className="seg-control" style={{ maxWidth: 320 }}>
                {['15m', '30m', '1hr', 'None'].map((opt) => (
                  <button
                    key={opt}
                    className={`seg-opt${reminderTiming === opt ? ' on' : ''}`}
                    onClick={() => setReminderTiming(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ BOOKING DEFAULTS ════════════════════════════ */}
          <div className="t-label mb-8">BOOKING DEFAULTS</div>
          <div className="card" style={{ marginBottom: 20 }}>
            {/* Payment timing */}
            <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8 }}>Payment timing</div>
              <div className="seg-control" style={{ maxWidth: 380 }}>
                {['At booking', 'On pickup', 'End of ride'].map((opt) => (
                  <button
                    key={opt}
                    className={`seg-opt${paymentTiming === opt ? ' on' : ''}`}
                    onClick={() => setPaymentTiming(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Default cancellation */}
            <div style={{ padding: '14px 0 4px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8 }}>Default cancellation policy</div>
              <div className="radio-group">
                {['Flexible', 'Standard', 'Strict'].map((opt) => (
                  <div
                    key={opt}
                    className={`radio-opt${cancellation === opt ? ' on' : ''}`}
                    onClick={() => setCancellation(opt)}
                  >
                    <div className="radio-dot">
                      {cancellation === opt && <div className="radio-dot-inner" />}
                    </div>
                    <span style={{ fontSize: 13 }}>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ ACCOUNT ═════════════════════════════════════ */}
          <div className="t-label mb-8">ACCOUNT</div>
          <div className="card" style={{ marginBottom: 20 }}>
            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 2 }}>Email</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{email}</div>
              </div>
              <button className="btn btn-ghost btn-sm">Change</button>
            </div>
            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 2 }}>Phone</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{phone}</div>
              </div>
              <button className="btn btn-ghost btn-sm">Change</button>
            </div>
            {/* Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 2 }}>Password</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</div>
              </div>
              <button className="btn btn-ghost btn-sm">Change password</button>
            </div>
          </div>

          {/* ═══ SUBSCRIPTION ════════════════════════════════ */}
          <div className="t-label mb-8">SUBSCRIPTION</div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', fontFamily: "'Syne', sans-serif" }}>
                  ${config.subscriptionAmount}/week
                </div>
              </div>
              <span className="badge badge-purple">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Next billing date</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>May 2, 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Member since</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>Jan 15, 2026</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-sm" style={{ background: 'none', border: '1px solid var(--red)', color: 'var(--red)', padding: '7px 14px', fontSize: 12, borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>
                Cancel subscription
              </button>
            </div>
          </div>

          {/* ═══ DANGER ZONE ═════════════════════════════════ */}
          <div className="t-label mb-8" style={{ color: 'var(--red)' }}>DANGER ZONE</div>
          <div style={{
            background: 'var(--red-pale)', border: '1px solid rgba(163,45,45,0.2)',
            borderRadius: 'var(--r-lg)', padding: '18px 20px',
          }}>
            <div style={{ fontSize: 13, color: 'var(--red)', marginBottom: 12, lineHeight: 1.5 }}>
              These actions are permanent and cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-sm" style={{ background: 'none', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer' }}>
                Deactivate account
              </button>
              <button className="btn btn-sm" style={{ background: 'none', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer' }}>
                Delete account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
