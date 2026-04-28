'use client';

import { useState } from 'react';
import { config, splitServiceName } from '@/lib/config';

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

export default function RiderSettings() {
  const { prefix, highlight } = splitServiceName();

  /* Notification toggles */
  const [pushOn, setPushOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [tripReminder, setTripReminder] = useState('2hrs');

  /* Demo account data */
  const email = 'sarah.chen@email.com';
  const phone = '(713) 555-0188';

  return (
    <div className="app-shell">
      {/* ── App topbar ─────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-name">Sarah Chen</div>
          <div className="topbar-avatar">SC</div>
        </div>
      </div>

      {/* ── Centered single column ────────────────────────── */}
      <div className="layout-center">
        <div style={{ maxWidth: 580, width: '100%' }}>
          <div className="t-title" style={{ marginBottom: 24 }}>Settings</div>

          {/* ═══ NOTIFICATIONS ═══════════════════════════════ */}
          <div className="t-label mb-8">NOTIFICATIONS</div>
          <div className="card" style={{ marginBottom: 20 }}>
            <ToggleRow label="Push notifications" on={pushOn} onToggle={() => setPushOn(!pushOn)} />
            <ToggleRow label="SMS alerts" sub="Strongly recommended" on={smsOn} onToggle={() => setSmsOn(!smsOn)} />
            <ToggleRow label="Email notifications" on={emailOn} onToggle={() => setEmailOn(!emailOn)} />

            {/* Trip reminders */}
            <div style={{ padding: '14px 0 4px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8 }}>Trip reminders</div>
              <div className="seg-control" style={{ maxWidth: 360 }}>
                {['1hr', '2hrs', 'Day before', 'None'].map((opt) => (
                  <button
                    key={opt}
                    className={`seg-opt${tripReminder === opt ? ' on' : ''}`}
                    onClick={() => setTripReminder(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ PRIVACY ═════════════════════════════════════ */}
          <div className="t-label mb-8">PRIVACY</div>
          <div className="card" style={{ marginBottom: 20 }}>
            {/* Safety Protocol */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>Safety Protocol</div>
                <div style={{ marginTop: 4 }}>
                  <span className="badge badge-green">Complete</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">View / Update</button>
            </div>
            {/* Profile photo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>Profile photo</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>Visible to your driver</div>
              </div>
              <button className="btn btn-ghost btn-sm">Update</button>
            </div>
            {/* Preferred name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>Preferred name</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginTop: 2 }}>Sarah</div>
              </div>
              <button className="btn btn-ghost btn-sm">Update</button>
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
            {/* Rider ID */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 2 }}>Rider ID</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: 'var(--amber-dim)', letterSpacing: '0.03em' }}>
                  SARA&middot;8834
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Not editable</span>
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

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
