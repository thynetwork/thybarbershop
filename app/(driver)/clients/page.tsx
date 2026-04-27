'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { splitServiceName } from '@/lib/config';
import DriverSidebar from '@/components/DriverSidebar';

/* ── Demo data ─────────────────────────────────────────────── */

interface PendingRequest {
  id: string;
  initials: string;
  avatarClass: string;
  name: string;
  riderId: string;
  preferredName: string;
  source: 'invite' | 'find_a_driver' | 'manual';
  sourceLabel: string;
  sourceIcon: string;
  note?: string;
  preSetAmount?: number;
  preferences: { label: string; value: string }[];
}

interface ConnectedClient {
  id: string;
  initials: string;
  avatarClass: string;
  hasCheck: boolean;
  name: string;
  riderId: string;
  airport: string;
  lastBooking: string;
  safetyComplete: boolean;
  setAmount?: number;
  setAmountStatus: 'confirmed' | 'pending' | 'none';
  travelPattern: string;
}

const DEMO_PENDING: PendingRequest[] = [
  {
    id: 'p1', initials: 'SW', avatarClass: 'av-amber', name: 'Sarah W.', riderId: 'SARA\u00B78834',
    preferredName: 'Sarah', source: 'invite', sourceLabel: 'Invited by you \u00B7 IAH\u00B7JDR\u00B74207', sourceIcon: '\uD83D\uDD17',
    note: 'Hey James, $50 is perfect see you Thursday at 3pm', preSetAmount: 50,
    preferences: [
      { label: 'Contact', value: 'Text only' }, { label: 'Music', value: 'No music' },
      { label: 'Ride', value: 'Quiet' }, { label: 'Travel', value: 'Weekly \u00B7 Thu' },
      { label: 'Service animal', value: 'No' },
    ],
  },
  {
    id: 'p2', initials: 'TW', avatarClass: 'av-navy', name: 'Todd W.', riderId: 'TODD\u00B74401',
    preferredName: 'Todd', source: 'find_a_driver', sourceLabel: 'Found you at MCO \u00B7 Find a Driver', sourceIcon: '\uD83D\uDD0D',
    preferences: [
      { label: 'Contact', value: 'Either' }, { label: 'Music', value: 'No preference' },
      { label: 'Ride', value: 'No preference' }, { label: 'Travel', value: 'Weekly' },
      { label: 'Service animal', value: 'No' },
    ],
  },
  {
    id: 'p3', initials: 'MJ', avatarClass: 'av-amber', name: 'Marcus J.', riderId: 'MARC\u00B75521',
    preferredName: 'Marc', source: 'manual', sourceLabel: 'Entered your code manually', sourceIcon: '\u2328',
    note: 'Hi James, we met at IAH last Tuesday. You gave me your code.',
    preferences: [
      { label: 'Contact', value: 'Call' }, { label: 'Music', value: 'Low volume' },
      { label: 'Ride', value: 'Happy to chat' }, { label: 'Travel', value: 'Monthly' },
      { label: 'Service animal', value: 'No' },
    ],
  },
];

const DEMO_CONNECTED: ConnectedClient[] = [
  { id: 'c1', initials: 'SW', avatarClass: 'av-amber', hasCheck: true, name: 'Sarah W.', riderId: 'SARA\u00B78834', airport: 'IAH', lastBooking: 'Thu Jul 17', safetyComplete: true, setAmount: 50, setAmountStatus: 'confirmed', travelPattern: 'Weekly \u00B7 Thu' },
  { id: 'c2', initials: 'TW', avatarClass: 'av-amber', hasCheck: true, name: 'Todd W.', riderId: 'TODD\u00B74401', airport: 'MCO', lastBooking: 'Sat Jul 19', safetyComplete: true, setAmountStatus: 'none', travelPattern: 'Monthly' },
  { id: 'c3', initials: 'MJ', avatarClass: 'av-navy', hasCheck: true, name: 'Marcus J.', riderId: 'MARC\u00B75521', airport: 'IAH', lastBooking: 'Mon Jul 14', safetyComplete: true, setAmount: 95, setAmountStatus: 'confirmed', travelPattern: 'Weekly \u00B7 Mon' },
  { id: 'c4', initials: 'LM', avatarClass: 'av-amber', hasCheck: false, name: 'Lisa M.', riderId: 'LISA\u00B73310', airport: 'HOU', lastBooking: 'Fri Jul 18', safetyComplete: false, setAmount: 45, setAmountStatus: 'pending', travelPattern: 'Bi-weekly' },
];

export default function ClientsPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();
  const [tab, setTab] = useState<'pending' | 'connected'>('pending');
  const [sort, setSort] = useState<'recent' | 'az' | 'amount'>('recent');
  const [approving, setApproving] = useState<string | null>(null);
  const [showDenyConfirm, setShowDenyConfirm] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setApproving(id);
    await fetch('/api/connections/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId: id }),
    });
    setApproving(null);
    // TODO: refresh data
  }

  async function handleDeny(id: string) {
    await fetch('/api/connections/deny', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId: id }),
    });
    setShowDenyConfirm(null);
    // TODO: refresh data
  }

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

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 580 }}>
        <DriverSidebar activeItem="Clients" pendingCount={DEMO_PENDING.length} />

        <div className="main-content">
          {/* Tab toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="seg-control" style={{ maxWidth: 280 }}>
              <button className={`seg-opt ${tab === 'pending' ? 'on' : ''}`} onClick={() => setTab('pending')}>
                Pending
                {DEMO_PENDING.length > 0 && (
                  <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, marginLeft: 4 }}>{DEMO_PENDING.length}</span>
                )}
              </button>
              <button className={`seg-opt ${tab === 'connected' ? 'on' : ''}`} onClick={() => setTab('connected')}>
                Connected
                <span style={{ background: 'var(--navy)', color: 'var(--amber)', borderRadius: 10, padding: '1px 7px', fontSize: 10, marginLeft: 4 }}>{DEMO_CONNECTED.length}</span>
              </button>
            </div>

            {tab === 'connected' && (
              <div className="seg-control" style={{ maxWidth: 200 }}>
                <button className={`seg-opt ${sort === 'recent' ? 'on' : ''}`} onClick={() => setSort('recent')}>Recent</button>
                <button className={`seg-opt ${sort === 'az' ? 'on' : ''}`} onClick={() => setSort('az')}>A-Z</button>
                <button className={`seg-opt ${sort === 'amount' ? 'on' : ''}`} onClick={() => setSort('amount')}>Set amt</button>
              </div>
            )}
          </div>

          {/* ── PENDING TAB ─────────────────────────────────── */}
          {tab === 'pending' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {DEMO_PENDING.map((req) => (
                <div key={req.id} className="card">
                  {/* Source tag */}
                  <div className="source-tag" style={{ marginBottom: 8 }}>
                    <span>{req.sourceIcon}</span> {req.sourceLabel}
                  </div>

                  {/* Rider identity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div className={`avatar ${req.avatarClass} av-md`}>{req.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{req.name}</div>
                      <div className="rider-id">{req.riderId}</div>
                      <div className="t-small">Preferred: {req.preferredName}</div>
                    </div>
                  </div>

                  {/* Note (invite + manual only) */}
                  {req.note && req.source !== 'find_a_driver' ? (
                    <div className="note-card" style={{ marginBottom: 10 }}>
                      <div className="note-label">Note from {req.preferredName}</div>
                      <div className="note-text">&ldquo;{req.note}&rdquo;</div>
                    </div>
                  ) : (
                    <div className="card-surface" style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', padding: 12, marginBottom: 10 }}>
                      {req.source === 'find_a_driver'
                        ? `No note \u2014 ${req.preferredName} found you through the driver pool`
                        : 'No note provided'}
                    </div>
                  )}

                  {/* Pre-set amount (invite only) */}
                  {req.preSetAmount && req.source === 'invite' ? (
                    <div className="card-amber" style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amber-dim)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>You suggested</div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>${req.preSetAmount.toFixed(2)}</div>
                      <div className="t-small" style={{ marginTop: 2 }}>Activates after both confirm</div>
                    </div>
                  ) : (
                    <div className="card-surface" style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', padding: 12, marginBottom: 10 }}>
                      No suggested amount &mdash; discuss after connecting
                    </div>
                  )}

                  {/* Preferences */}
                  <div className="card-surface" style={{ marginBottom: 10 }}>
                    <div className="t-label" style={{ marginBottom: 6 }}>Rider preferences</div>
                    {req.preferences.map((p) => (
                      <div className="pref-row" key={p.label}>
                        <span className="pref-label">{p.label}</span>
                        <span className="pref-value">{p.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 10 }}>
                    &#128737; Safety Protocol: Pending &middot; completes before first booking
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-green btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleApprove(req.id)}
                      disabled={approving === req.id}
                    >
                      {approving === req.id ? 'Approving...' : '\u2713 Approve'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => setShowDenyConfirm(req.id)}
                    >
                      \u2717 Deny
                    </button>
                  </div>

                  {/* Deny confirmation */}
                  {showDenyConfirm === req.id && (
                    <div className="card-red" style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Are you sure you want to deny this request?</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setShowDenyConfirm(null)}>Cancel</button>
                        <button className="btn btn-red btn-sm" style={{ flex: 1 }} onClick={() => handleDeny(req.id)}>Yes, deny</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── CONNECTED TAB ──────────────────────────────── */}
          {tab === 'connected' && (
            <div className="card">
              {DEMO_CONNECTED.map((client) => (
                <div
                  key={client.id}
                  className="li"
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/clients/${client.riderId.replace('\u00B7', '')}`)}
                >
                  <div className={`avatar ${client.avatarClass} av-sm${client.hasCheck ? ' av-check' : ''}`}>{client.initials}</div>
                  <div className="li-info">
                    <div className="li-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {client.name} <span className="rider-id">{client.riderId}</span>
                    </div>
                    <div className="li-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="badge badge-blue">&#9992; {client.airport}</span>
                      <span>Last booking: {client.lastBooking}</span>
                      {client.safetyComplete ? (
                        <span className="badge badge-green">&#10003; Safety</span>
                      ) : (
                        <span className="badge badge-amber">Safety pending</span>
                      )}
                    </div>
                  </div>
                  <div className="li-right">
                    <div style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
                      color: client.setAmountStatus === 'confirmed' ? '#3C3489' : client.setAmountStatus === 'pending' ? 'var(--amber-dim)' : 'var(--text-2)',
                    }}>
                      {client.setAmount ? `$${client.setAmount} ${client.setAmountStatus === 'confirmed' ? 'set' : 'pending'}` : 'No set amt'}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{client.travelPattern}</div>
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text-3)', marginLeft: 8 }}>&rsaquo;</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
