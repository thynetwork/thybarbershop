'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'Sarah Chen', initials: 'SC' };

export default function RouteDetailsPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [pickup, setPickup] = useState('456 Westheimer Rd, Houston TX');
  const [dropoff, setDropoff] = useState('800 Congress Ave, Austin TX');
  const [milesRaw, setMilesRaw] = useState('');
  const miles = parseInt(milesRaw, 10) || 0;
  const isLongHaul = miles > 51;

  // Terminal fields — auto-detect airport in addresses
  const [pickupTerminal, setPickupTerminal] = useState('');
  const [dropoffTerminal, setDropoffTerminal] = useState('');
  const [flightType, setFlightType] = useState<'domestic' | 'international'>('domestic');
  const [flightNumber, setFlightNumber] = useState('');

  const AIRPORT_CODES = ['IAH', 'HOU', 'MCO', 'LAX', 'ATL', 'ORD', 'DFW', 'JFK', 'MIA', 'SFO', 'SEA', 'DEN', 'BOS', 'LAS'];
  const AIRPORT_NAMES = ['airport', 'intercontinental', 'international', 'terminal', 'hobby'];
  const isAirportTrip = [...AIRPORT_CODES, ...AIRPORT_NAMES].some(
    (term) => pickup.toLowerCase().includes(term.toLowerCase()) || dropoff.toLowerCase().includes(term.toLowerCase())
  );

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

      <div className="layout-center">
        <div style={{ width: '100%', maxWidth: 560, padding: 40 }}>
          {/* ── Progress bar (step 3 active) ─────────────────── */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step active" />
          </div>

          <div className="t-title mb-4">Route Details</div>
          <div className="t-small mb-24">
            Thu Jul 17 &middot; 9:00 am &middot; James Rivera
          </div>

          {/* ── Route inputs ──────────────────────────────────── */}
          <div className="route-inputs mb-16">
            <div className="route-line">
              <div className="route-dot rd-pickup" />
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">Pickup address</label>
                <input
                  className="form-input"
                  placeholder="123 Main St, Houston TX"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
            </div>
            <div className="route-connector" style={{ marginLeft: 5 }} />
            <div className="route-line">
              <div className="route-dot rd-dropoff" />
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">Drop-off address</label>
                <input
                  className="form-input"
                  placeholder="IAH Terminal C, Houston TX"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── Airport details (auto-detect) ─────────────────── */}
          {isAirportTrip && (
            <div className="card-surface mb-16">
              <div className="t-label" style={{ marginBottom: 10 }}>Airport details</div>
              <div className="form-row" style={{ marginBottom: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pickup terminal</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Terminal C &middot; United"
                    value={pickupTerminal}
                    onChange={(e) => setPickupTerminal(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Drop-off terminal</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Terminal C &middot; United"
                    value={dropoffTerminal}
                    onChange={(e) => setDropoffTerminal(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginBottom: 0 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Flight type</label>
                  <div className="seg-control">
                    <button className={`seg-opt ${flightType === 'domestic' ? 'on' : ''}`} onClick={() => setFlightType('domestic')}>Domestic</button>
                    <button className={`seg-opt ${flightType === 'international' ? 'on' : ''}`} onClick={() => setFlightType('international')}>International</button>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Flight number <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <input
                    className="form-input"
                    placeholder="e.g. UA 447"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Miles input ────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Estimated miles</label>
              <input
                className="form-input"
                value={milesRaw}
                onChange={(e) => setMilesRaw(e.target.value.replace(/\D/g, ''))}
                style={{ textAlign: 'center', fontWeight: 700 }}
                placeholder="Enter miles"
              />
            </div>
            {isLongHaul && (
              <span
                className="badge badge-amber"
                style={{ marginTop: 16, fontSize: 12, padding: '5px 14px' }}
              >
                &#9888; 51+ miles
              </span>
            )}
          </div>

          {/* ── Long haul prompt ───────────────────────────────── */}
          {isLongHaul && (
            <div className="card-amber-tint mb-20">
              <div style={{ fontSize: 13, color: 'var(--amber-dim)', fontWeight: 500, marginBottom: 4 }}>
                This looks like a long haul trip ({miles} mi)
              </div>
              <div style={{ fontSize: 12, color: 'var(--amber-dim)' }}>
                Select the long haul option below to apply correct pricing including the empty return charge.
              </div>
            </div>
          )}

          {/* ── Action buttons ─────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => router.push('/book/pending')}
            >
              Confirm Booking
            </button>
            <button
              className="btn btn-lg"
              style={{
                background: isLongHaul ? 'var(--amber-pale)' : 'var(--surface)',
                border: isLongHaul
                  ? '1.5px solid var(--amber-border)'
                  : '1.5px solid var(--border-mid)',
                color: isLongHaul ? 'var(--amber-dim)' : 'var(--text-2)',
                fontSize: 14,
                fontWeight: 600,
              }}
              onClick={() => router.push('/book/longhaul')}
            >
              This is a 51+ Mile Trip &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
