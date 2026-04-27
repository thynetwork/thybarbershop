'use client';

import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'Dana Torres', initials: 'DT' };

const fareData = {
  origin: 'Houston',
  destination: 'Austin',
  date: 'Sat Jul 19',
  time: '6:00 am',
  miles: 165,
  estHours: 2.5,
  hourlyRate: 35,
  hourlyTotal: 87.5,
  distanceFlat: 50,
  emptyReturn: 50,
  estimatedTotal: 187.5,
};

export default function LongHaulPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

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

      <div className="layout-center" style={{ padding: 40 }}>
        <div style={{ maxWidth: 580, width: '100%' }}>
          <div className="t-title mb-4">Long Haul Trip</div>
          <div className="t-small mb-16">
            51+ miles &middot; Estimate sent to {config.providerLabel.toLowerCase()} for approval
          </div>

          {/* ── Route banner (amber tint) ────────────────────── */}
          <div className="card-amber-tint mb-14">
            <div className="t-subtitle" style={{ color: 'var(--amber-dim)', marginBottom: 4 }}>
              {fareData.origin} &rarr; {fareData.destination}
            </div>
            <div className="t-small">
              {fareData.date} &middot; {fareData.time} &middot; {fareData.miles} miles &middot; Est. {fareData.estHours} hrs
            </div>
          </div>

          {/* ── Fare breakdown ────────────────────────────────── */}
          <div className="fare-block">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 10 }}>
              Fare estimate{' '}
              <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 400 }}>
                &mdash; {config.providerLabel.toLowerCase()} may adjust
              </span>
            </div>
            <div className="fare-row">
              <span className="fare-label">
                Hourly rate{' '}
                <span className="fare-sub">({fareData.estHours} hrs &times; ${fareData.hourlyRate})</span>
              </span>
              <span className="fare-value">${fareData.hourlyTotal.toFixed(2)}</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Distance flat fee (51+ mi)</span>
              <span className="fare-value">${fareData.distanceFlat.toFixed(2)}</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Empty return charge</span>
              <span className="fare-value">${fareData.emptyReturn.toFixed(2)}</span>
            </div>
            <div className="fare-row">
              <span className="fare-label" style={{ fontWeight: 600, color: 'var(--text-1)' }}>
                Estimated total
              </span>
              <span className="fare-total">${fareData.estimatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* ── Estimate disclaimer ──────────────────────────── */}
          <div className="card-amber-tint mb-12">
            <div style={{ fontSize: 12, color: 'var(--amber-dim)', lineHeight: 1.6 }}>
              This is an estimate only. Time of day, traffic, and route conditions may affect the final amount.{' '}
              {config.providerLabel} will confirm or adjust before the booking is locked.
            </div>
          </div>

          {/* ── Terms note ───────────────────────────────────── */}
          <div className="card-surface mb-14" style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-1)' }}>Before confirming:</strong>{' '}
            This is a one-way trip. The empty return charge of <strong>${fareData.emptyReturn}</strong> is included.
            Cancellation within 24 hours forfeits the full amount. By confirming you agree to these terms.
          </div>

          {/* ── Buttons ──────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={() => router.push('/book/pending')}
            >
              Send Estimate to {config.providerLabel} &rarr;
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => router.back()}>
              Request different route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
