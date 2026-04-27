'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

const REASONS = [
  { icon: '\ud83d\udd50', label: 'Early morning / after hours' },
  { icon: '\ud83d\udea6', label: 'Traffic / road conditions' },
  { icon: '\u26fd', label: 'Fuel cost' },
  { icon: '\ud83c\udf27\ufe0f', label: 'Weather conditions' },
  { icon: '\u2708\ufe0f', label: 'Flight delay / airport wait' },
  { icon: '\u23f3', label: 'Extended wait time' },
  { icon: '\ud83d\udccd', label: 'Route complexity' },
  { icon: '\u2795', label: 'Additional stop requested' },
];

export default function FareAdjustment() {
  const { prefix, highlight } = splitServiceName();
  const params = useParams();
  const router = useRouter();

  const calculatedTotal = 187.50;
  const [adjustedPrice, setAdjustedPrice] = useState('210.00');
  const [selectedReasons, setSelectedReasons] = useState<number[]>([0]);
  const [note, setNote] = useState('');

  function toggleReason(idx: number) {
    setSelectedReasons((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

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
          }}>JDR&middot;4207</div>
          <div className="topbar-avatar">JR</div>
        </div>
      </div>

      <div className="layout-2col">
        {/* Main content */}
        <div className="main-content">
          <div className="t-title mb-4">Adjust fare</div>
          <div className="t-small mb-16">Dana Torres &middot; Houston &rarr; Austin &middot; Sat Jul 19 &middot; 6:00 am</div>

          {/* Amount comparison */}
          <div className="amt-compare mb-20">
            <div className="amt-box amt-orig">
              <div className="amt-label">Calculated</div>
              <div className="amt-value">${calculatedTotal.toFixed(2)}</div>
            </div>
            <div className="amt-arrow">&rarr;</div>
            <div className="amt-box amt-new">
              <div className="amt-label p">Your adjusted price</div>
              <div className="amt-value p">${adjustedPrice}</div>
            </div>
          </div>

          {/* Price input */}
          <div className="form-group mb-4">
            <label className="form-label">Enter your price</label>
            <input
              className="form-input"
              value={`$${adjustedPrice}`}
              onChange={(e) => setAdjustedPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                textAlign: 'center',
              }}
            />
          </div>

          {/* Reason grid */}
          <div className="t-label mb-8">Reason (select all that apply)</div>
          <div className="reason-grid mb-12">
            {REASONS.map((r, idx) => (
              <div
                key={idx}
                className={`reason-btn${selectedReasons.includes(idx) ? ' sel' : ''}`}
                onClick={() => toggleReason(idx)}
              >
                <div className="reason-icon">{r.icon}</div>
                <div className="reason-label">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Optional note */}
          <div className="form-group">
            <label className="form-label">Optional note to Dana</label>
            <input
              className="form-input"
              placeholder="e.g. Early morning rate applies before 7am"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              Send ${adjustedPrice} to Dana
            </button>
            <Link
              href={`/booking/${params.id}`}
              className="btn btn-ghost btn-lg"
              style={{ flex: '0 0 auto', textDecoration: 'none' }}
            >
              Back
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">This price is final</div>
          <div className="card-surface mb-16" style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Once you send this price to Dana, it is your final offer. Dana can accept, hold 20 minutes, or decline. You cannot change it after sending.
          </div>

          <div className="t-label mb-8">Dana&apos;s options</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div className="card-green-tint">
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500 }}>Accept</div>
              <div className="t-small" style={{ color: 'var(--green)' }}>Booking confirmed immediately</div>
            </div>
            <div className="card-amber-tint">
              <div style={{ fontSize: 12, color: 'var(--amber-dim)', fontWeight: 500 }}>Hold 20 min</div>
              <div className="t-small" style={{ color: 'var(--amber-dim)' }}>You wait — do not start trip until accepted</div>
            </div>
            <div className="card-red-tint">
              <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>Decline</div>
              <div className="t-small" style={{ color: 'var(--red)' }}>Trip cancelled, no charge to Dana</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
