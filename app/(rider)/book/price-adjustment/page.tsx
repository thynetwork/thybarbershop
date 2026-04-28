'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'Dana Torres', initials: 'DT' };
const demoDriver = {
  name: 'Marcus',
  fullName: 'Marcus Rivera',
  code: 'MRC\u00B73341',
  initials: 'MR',
};

const REASONS = [
  { icon: '\uD83D\uDD50', label: 'Early morning / after hours', key: 'hours' },
  { icon: '\uD83D\uDEA6', label: 'Traffic / road conditions', key: 'traffic' },
  { icon: '\u26FD', label: 'Fuel cost', key: 'fuel' },
  { icon: '\uD83C\uDF27', label: 'Weather conditions', key: 'weather' },
  { icon: '\uD83D\uDDFA', label: 'Route complexity', key: 'route' },
  { icon: '\u2795', label: 'Additional stop requested', key: 'stop' },
];

const tripSummary = {
  route: 'Houston \u2192 Austin',
  date: 'Sat Jul 19',
  time: '6:00 am',
  distance: '165 miles',
  estHours: '2.5 hrs',
  yourEstimate: 187.5,
  driverPrice: 210.0,
};

export default function PriceAdjustmentPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const [selectedReasons] = useState<string[]>(['hours']);

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

      <div className="layout-2col">
        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content">
          <div className="t-title mb-4">{demoDriver.name} Updated the Fare</div>
          <div className="t-small mb-16">
            Review and respond before your booking is confirmed.
          </div>

          {/* Driver context card */}
          <div className="card mb-16" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar av-amber av-md av-check">{demoDriver.initials}</div>
            <div>
              <div className="t-body" style={{ fontWeight: 500 }}>
                {demoDriver.fullName} &middot; {demoDriver.code}
              </div>
              <div className="t-small">
                {tripSummary.route} &middot; {tripSummary.date} &middot; {tripSummary.time}
              </div>
            </div>
          </div>

          {/* Side-by-side amount comparison */}
          <div className="amt-compare mb-16">
            <div className="amt-box amt-orig">
              <div className="amt-label">Your estimate</div>
              <div className="amt-value">${tripSummary.yourEstimate.toFixed(2)}</div>
            </div>
            <div className="amt-arrow">&rarr;</div>
            <div className="amt-box amt-new">
              <div className="amt-label p">{demoDriver.name}&apos;s price</div>
              <div className="amt-value p">${tripSummary.driverPrice.toFixed(2)}</div>
            </div>
          </div>

          {/* Reason grid */}
          <div className="t-label mb-8">Reason from {demoDriver.name}</div>
          <div className="reason-grid mb-12">
            {REASONS.map((r) => (
              <div
                key={r.key}
                className={`reason-btn ${selectedReasons.includes(r.key) ? 'sel' : ''}`}
              >
                <div className="reason-icon">{r.icon}</div>
                <div className="reason-label">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Driver note */}
          <div className="card-surface mb-16" style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>Note from {demoDriver.name}:</strong>{' '}
            &ldquo;Early morning rate applies before 7am.&rdquo;
          </div>

          {/* Response buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => router.push('/book/payment')}
            >
              Accept ${tripSummary.driverPrice.toFixed(2)} &rarr;
            </button>
            <button
              className="btn btn-lg"
              style={{
                background: 'var(--amber-pale)',
                border: '1.5px solid var(--amber-border)',
                color: 'var(--amber-dim)',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Hold 20 min &mdash; I need to think
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/home')}
            >
              Decline &mdash; Cancel trip
            </button>
          </div>
        </div>

        {/* ── Right panel: trip summary ─────────────────────── */}
        <div className="right-panel">
          <div className="t-label mb-12">Trip summary</div>
          <div className="card-surface mb-12">
            <div className="row">
              <span className="row-label">Route</span>
              <span className="row-value">{tripSummary.route}</span>
            </div>
            <div className="row">
              <span className="row-label">Date</span>
              <span className="row-value">{tripSummary.date}</span>
            </div>
            <div className="row">
              <span className="row-label">Time</span>
              <span className="row-value">{tripSummary.time}</span>
            </div>
            <div className="row">
              <span className="row-label">Distance</span>
              <span className="row-value">{tripSummary.distance}</span>
            </div>
            <div className="row">
              <span className="row-label">Est. hours</span>
              <span className="row-value">{tripSummary.estHours}</span>
            </div>
          </div>

          <div className="t-label mb-8">What changed</div>
          <div className="fare-block">
            <div className="fare-row">
              <span className="fare-label">Hourly (2.5 &times; $35)</span>
              <span className="fare-value">$87.50</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Distance flat fee</span>
              <span className="fare-value">$50.00</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Empty return</span>
              <span className="fare-value">$50.00</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">After-hours adj.</span>
              <span className="fare-value" style={{ color: 'var(--amber-dim)' }}>+$22.50</span>
            </div>
            <div className="fare-row">
              <span className="fare-label" style={{ fontWeight: 600 }}>{demoDriver.name}&apos;s total</span>
              <span className="fare-total">$210.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
