'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

/* ── Demo booking data ─────────────────────── */
const DEMO_BOOKING = {
  client: { initials: 'DT', name: 'Dana Torres', rides: 8, safety: true },
  pickup: '456 Westheimer, Houston',
  dropoff: '800 Congress, Austin',
  miles: 165,
  date: 'Sat Jul 19',
  time: '6:00 am',
  hoursEstimated: 2.5,
  hourlyRate: 35,
  distanceFee: 50,
  emptyReturn: 50,
};

export default function FareScratchpad() {
  const { prefix, highlight } = splitServiceName();
  const params = useParams();

  const bk = DEMO_BOOKING;
  const hourlyCalc = bk.hoursEstimated * bk.hourlyRate;
  const total = hourlyCalc + bk.distanceFee + bk.emptyReturn;

  return (
    <div className="app-shell">
      {/* App topbar */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
            borderRadius: 'var(--r-full)', padding: '4px 12px',
            fontSize: 11, color: 'var(--amber)', fontWeight: 600,
          }}>MRC&middot;3341</div>
          <div className="topbar-avatar">MR</div>
        </div>
      </div>

      <div className="layout-2col">
        {/* Sidebar — client info */}
        <div className="sidebar">
          <div className="t-label mb-12">{bk.client.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div className="avatar av-amber av-md">{bk.client.initials}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{bk.client.name}</div>
              <div className="t-small">{bk.client.rides} rides &middot; Safety Protocol complete</div>
            </div>
          </div>

          {/* Booking details card */}
          <div className="card-surface mb-12">
            <div className="row">
              <span className="row-label">Pickup</span>
              <span className="row-value" style={{ fontSize: 12 }}>{bk.pickup}</span>
            </div>
            <div className="row">
              <span className="row-label">Drop-off</span>
              <span className="row-value" style={{ fontSize: 12 }}>{bk.dropoff}</span>
            </div>
            <div className="row">
              <span className="row-label">Miles</span>
              <span className="row-value">
                {bk.miles} mi <span className="badge badge-amber" style={{ marginLeft: 4 }}>51+</span>
              </span>
            </div>
            <div className="row">
              <span className="row-label">Date &amp; time</span>
              <span className="row-value">{bk.date} &middot; {bk.time}</span>
            </div>
          </div>

          {/* Time note */}
          <div className="card-amber-tint">
            <div style={{ fontSize: 12, color: 'var(--amber-dim)', lineHeight: 1.6 }}>
              {bk.time} — early morning rate may apply. Use the Adjust button to modify the calculated total.
            </div>
          </div>
        </div>

        {/* Main — scratchpad */}
        <div className="main-content">
          <div className="t-title mb-4">Fare scratchpad</div>
          <div className="t-small mb-16">Calculate and set your price for {bk.client.name}&apos;s trip</div>

          <div className="scratchpad">
            <div className="sp-row">
              <div className="sp-label">Hours estimated</div>
              <input className="sp-input" value={`${bk.hoursEstimated} hrs`} readOnly />
            </div>
            <div className="sp-row">
              <div className="sp-label">Hourly rate (${bk.hourlyRate})</div>
              <input className="sp-input" value={`$${hourlyCalc.toFixed(2)}`} readOnly />
            </div>
            <div className="sp-row">
              <div className="sp-label">Distance fee (51+ mi)</div>
              <input className="sp-input" value={`$${bk.distanceFee.toFixed(2)}`} readOnly />
            </div>
            <div className="sp-row">
              <div className="sp-label">Empty return charge</div>
              <input className="sp-input" value={`$${bk.emptyReturn.toFixed(2)}`} readOnly />
            </div>

            <div className="sp-total">
              <div>
                <div className="t-label mb-4">Calculated total</div>
                <div className="t-small">Based on your set rates</div>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>
                ${total.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              Send ${total.toFixed(2)} to {bk.client.name.split(' ')[0]}
            </button>
            <Link
              href={`/booking/${params.id}/adjust`}
              className="btn btn-amber btn-lg"
              style={{ flex: '0 0 auto', textDecoration: 'none' }}
            >
              Adjust &rarr;
            </Link>
          </div>

          <button className="btn btn-ghost btn-full">Deny request</button>
        </div>
      </div>
    </div>
  );
}
