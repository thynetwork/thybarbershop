'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { splitServiceName } from '@/lib/config';
import DriverSidebar from '@/components/DriverSidebar';

/* ── Demo data ─────────────────────────────────────────────── */
const demoClient = {
  initials: 'SW',
  name: 'Sarah W.',
  riderId: 'SARA\u00B78834',
  preferredName: 'Sarah',
  source: 'invite' as const,
  sourceLabel: 'Invited by you',
  safetyComplete: true,
  airport: 'IAH',
  setAmount: 50,
  setAmountConfirmed: true,
  note: 'Hey James, $50 is perfect see you Thursday at 3pm',
  preferences: [
    { label: 'Contact', value: 'Text only' },
    { label: 'Music', value: 'No music' },
    { label: 'Ride', value: 'Quiet \u2014 may be working' },
    { label: 'Temperature', value: 'AC preferred' },
    { label: 'Travel', value: 'Weekly \u00B7 Thursdays' },
    { label: 'Default terminal', value: 'Terminal C \u00B7 Domestic' },
    { label: 'Service animal', value: 'No' },
    { label: 'Accommodations', value: 'Two carry-ons. Terminal C entrance at IAH.' },
  ],
  bookingHistory: [
    { date: 'Thu Jul 17', route: 'Airport to Home', detail: 'IAH Terminal C \u00B7 $50', status: 'Completed' },
    { date: 'Thu Jul 10', route: 'Airport to Home', detail: 'IAH Terminal C \u00B7 $50', status: 'Completed' },
    { date: 'Thu Jul 3', route: 'Airport to Home', detail: 'IAH Terminal C \u00B7 $50 \u00B7 No-show waived', status: 'Waived' },
  ],
  policies: {
    cancellation: 'flexible' as const,
    waitTime: 'off' as const,
    noShow: 'waive' as const,
    planeDelay: 'no_charge' as const,
  },
};

export default function ClientProfilePage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [cancellation, setCancellation] = useState<string>(demoClient.policies.cancellation);
  const [waitTime, setWaitTime] = useState<string>(demoClient.policies.waitTime);
  const [noShow, setNoShow] = useState<string>(demoClient.policies.noShow);
  const [planeDelay, setPlaneDelay] = useState<string>(demoClient.policies.planeDelay);

  const c = demoClient;

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="driver-code">
            <div className="dc-airport">IAH</div>
            <div className="dc-initials">JDR</div>
            <div className="dc-digits">4207</div>
          </div>
          <div className="topbar-avatar">JR</div>
        </div>
      </div>

      <div className="layout-3col-clients">
        <DriverSidebar activeItem="Clients" />

        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => router.push('/clients')}>
            &larr; Back to clients
          </button>

          {/* Profile banner */}
          <div className="profile-banner" style={{ margin: '-28px -32px 0', borderRadius: 0 }}>
            <div className="pb-av pb-av-amber">{c.initials}</div>
          </div>
          <div style={{ paddingTop: 44, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--text-1)', marginBottom: 3 }}>{c.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="rider-id" style={{ fontSize: 15 }}>{c.riderId}</div>
              <span className="t-small">Preferred: {c.preferredName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div className="source-tag"><span>&#128279;</span> {c.sourceLabel}</div>
              <span className="badge badge-green">&#10003; Safety Protocol</span>
              <span className="badge badge-blue">&#9992; {c.airport}</span>
            </div>
          </div>

          {/* Note from registration */}
          {c.note && (
            <div className="note-card" style={{ marginBottom: 16 }}>
              <div className="note-label">Note from registration</div>
              <div className="note-text">&ldquo;{c.note}&rdquo;</div>
            </div>
          )}

          {/* Set amount */}
          <div className="t-label" style={{ marginBottom: 8 }}>Set amount</div>
          <div className="card-amber" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--navy)' }}>${c.setAmount?.toFixed(2)}</div>
                <div className="t-small" style={{ color: 'var(--amber-dim)' }}>&#10003; Both confirmed &middot; Active</div>
              </div>
              <button className="btn btn-ghost btn-sm">Update</button>
            </div>
          </div>

          {/* Preferences */}
          <div className="t-label" style={{ marginBottom: 8 }}>{c.preferredName}&apos;s preferences</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            {c.preferences.map((p) => (
              <div className="pref-row" key={p.label}>
                <span className="pref-label">{p.label}</span>
                <span className="pref-value" style={p.label === 'Accommodations' ? { maxWidth: 180, textAlign: 'right' } : undefined}>{p.value}</span>
              </div>
            ))}
          </div>

          {/* Booking history */}
          <div className="t-label" style={{ marginBottom: 8 }}>Booking history</div>
          <div className="card" style={{ marginBottom: 16 }}>
            {c.bookingHistory.map((b, i) => (
              <div className="li" key={i}>
                <div className="li-info">
                  <div className="li-name">{b.date} &middot; {b.route}</div>
                  <div className="li-sub">{b.detail}</div>
                </div>
                <span className={`badge ${b.status === 'Completed' ? 'badge-green' : 'badge-purple'}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className="t-label" style={{ marginBottom: 8 }}>Danger zone</div>
          {!showRemoveConfirm ? (
            <button className="btn btn-red btn-full" onClick={() => setShowRemoveConfirm(true)}>
              Remove {c.preferredName} from my client list
            </button>
          ) : (
            <div className="card-red">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                Remove {c.name} from your client list?
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.5 }}>
                {c.preferredName} will be notified that you are no longer available to them. Their Rider ID is saved &mdash; they can find another driver. This cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setShowRemoveConfirm(false)}>Cancel</button>
                <button className="btn btn-red btn-sm" style={{ flex: 1 }}>Remove client</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ───────────────────────────────────── */}
        <div className="right-panel">
          <div className="t-label" style={{ marginBottom: 8 }}>Per-client policies</div>
          <div className="card-surface" style={{ marginBottom: 12 }}>
            <div className="pref-row">
              <span className="pref-label">Cancellation</span>
              <div className="seg-control" style={{ maxWidth: 130 }}>
                <button className={`seg-opt ${cancellation === 'flexible' ? 'on' : ''}`} onClick={() => setCancellation('flexible')} style={{ fontSize: 10 }}>Flexible</button>
                <button className={`seg-opt ${cancellation === 'standard' ? 'on' : ''}`} onClick={() => setCancellation('standard')} style={{ fontSize: 10 }}>Standard</button>
              </div>
            </div>
            <div className="pref-row">
              <span className="pref-label">Wait time</span>
              <div className="seg-control" style={{ maxWidth: 100 }}>
                <button className={`seg-opt ${waitTime === 'off' ? 'on' : ''}`} onClick={() => setWaitTime('off')} style={{ fontSize: 10 }}>Off</button>
                <button className={`seg-opt ${waitTime === 'on' ? 'on' : ''}`} onClick={() => setWaitTime('on')} style={{ fontSize: 10 }}>On</button>
              </div>
            </div>
            <div className="pref-row">
              <span className="pref-label">No-show</span>
              <div className="seg-control" style={{ maxWidth: 130 }}>
                <button className={`seg-opt ${noShow === 'waive' ? 'on' : ''}`} onClick={() => setNoShow('waive')} style={{ fontSize: 10 }}>Waive once</button>
                <button className={`seg-opt ${noShow === 'charge' ? 'on' : ''}`} onClick={() => setNoShow('charge')} style={{ fontSize: 10 }}>Charge</button>
              </div>
            </div>
            <div className="pref-row">
              <span className="pref-label">Plane delay</span>
              <div className="seg-control" style={{ maxWidth: 130 }}>
                <button className={`seg-opt ${planeDelay === 'no_charge' ? 'on' : ''}`} onClick={() => setPlaneDelay('no_charge')} style={{ fontSize: 10 }}>No charge</button>
                <button className={`seg-opt ${planeDelay === 'charge' ? 'on' : ''}`} onClick={() => setPlaneDelay('charge')} style={{ fontSize: 10 }}>Charge</button>
              </div>
            </div>
          </div>

          <div className="t-label" style={{ marginBottom: 8 }}>Quick actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="btn btn-ghost btn-full btn-sm" style={{ justifyContent: 'flex-start' }}>&#128176; &nbsp; View payment history</button>
            <button className="btn btn-ghost btn-full btn-sm" style={{ justifyContent: 'flex-start' }}>&#128197; &nbsp; View upcoming bookings</button>
            <button className="btn btn-ghost btn-full btn-sm" style={{ justifyContent: 'flex-start' }}>&#128172; &nbsp; Contact {c.preferredName}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
