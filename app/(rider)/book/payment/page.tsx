'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'Dana Torres', initials: 'DT' };
const demoDriverName = 'James';

const PAYMENT_METHODS = [
  {
    key: 'zelle',
    icon: 'Z',
    iconClass: 'pi-z',
    name: 'Zelle',
    handle: 'jrivera@email.com',
  },
  {
    key: 'venmo',
    icon: 'V',
    iconClass: 'pi-v',
    name: 'Venmo',
    handle: '@james-rivera-htx',
  },
  {
    key: 'cashapp',
    icon: '$',
    iconClass: 'pi-c',
    name: 'Cash App',
    handle: '$JamesHTX',
  },
  {
    key: 'stripe',
    icon: 'St',
    iconClass: 'pi-s',
    name: 'Stripe',
    handle: 'Payment link',
  },
  {
    key: 'cash',
    icon: '$',
    iconClass: '',
    name: 'Cash',
    handle: 'Cash accepted at pickup',
  },
];

function QRThumb() {
  return (
    <div className="qr-thumb">
      <div className="qr-c" /><div className="qr-e" /><div className="qr-c" /><div className="qr-e" />
      <div className="qr-c" /><div className="qr-e" /><div className="qr-c" /><div className="qr-e" />
      <div className="qr-c" /><div className="qr-e" /><div className="qr-c" /><div className="qr-e" />
      <div className="qr-c" /><div className="qr-e" /><div className="qr-c" /><div className="qr-e" />
    </div>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const [selectedMethod, setSelectedMethod] = useState('zelle');

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
          <div className="t-title mb-4">How to Pay {demoDriverName}</div>
          <div className="t-small mb-16">Complete your booking</div>

          {/* Booking summary */}
          <div className="card mb-14">
            <div className="row">
              <span className="row-label">Route</span>
              <span className="row-value">Houston &rarr; Austin</span>
            </div>
            <div className="row">
              <span className="row-label">Date &amp; time</span>
              <span className="row-value">Sat Jul 19 &middot; 6:00 am</span>
            </div>
            <div className="row">
              <span className="row-label">Final amount</span>
              <span className="row-value t-mono" style={{ color: 'var(--purple)', fontSize: 18 }}>
                $210.00
              </span>
            </div>
            <div className="row">
              <span className="row-label">Pay timing</span>
              <span className="row-value">On pickup</span>
            </div>
          </div>

          {/* Cancellation policy */}
          <div className="card-red-tint mb-14">
            <div style={{ fontSize: 12, color: 'var(--red)', lineHeight: 1.6 }}>
              <strong>Cancellation policy:</strong> Free cancellation up to 24 hrs before pickup.
              Within 24 hrs &mdash; 50% charge applies. No-show &mdash; full amount charged.
            </div>
          </div>

          {/* Payment methods */}
          <div className="t-label mb-10">{demoDriverName} accepts</div>
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.key}
              className={`pay-method ${selectedMethod === method.key ? 'sel' : ''}`}
              onClick={() => setSelectedMethod(method.key)}
            >
              <div
                className={`pay-icon ${method.iconClass}`}
                style={
                  method.key === 'stripe'
                    ? { background: '#635bff', color: '#fff', fontWeight: 800, fontSize: 12 }
                    : method.key === 'cash'
                    ? { background: '#22c55e', color: '#fff', fontWeight: 800, fontSize: 14 }
                    : undefined
                }
              >
                {method.icon}
              </div>
              <div className="pay-info">
                <div className="pay-name">{method.name}</div>
                <div className="pay-handle">{method.handle}</div>
              </div>
              {method.key !== 'cash' && <QRThumb />}
            </div>
          ))}

          <div className="card-surface mb-14" style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>Payment on pickup.</strong>{' '}
            Tap the QR icon next to your preferred app to open and scan.
          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={() => router.push('/book/confirmed')}
          >
            Done &mdash; Confirm Booking
          </button>
        </div>

        {/* ── Right panel ───────────────────────────────────── */}
        <div className="right-panel">
          <div className="t-label mb-12">Booking summary</div>
          <div className="card-surface mb-12">
            <div className="row">
              <span className="row-label">{config.providerLabel}</span>
              <span className="row-value">James Rivera</span>
            </div>
            <div className="row">
              <span className="row-label">Code</span>
              <span className="row-value t-mono" style={{ color: 'var(--amber-dim)' }}>
                JDR&middot;4207
              </span>
            </div>
            <div className="row">
              <span className="row-label">Route</span>
              <span className="row-value">Houston &rarr; Austin</span>
            </div>
            <div className="row">
              <span className="row-label">Miles</span>
              <span className="row-value">165 mi</span>
            </div>
            <div className="row">
              <span className="row-label">Insurance</span>
              <span className="badge badge-green">Allstate</span>
            </div>
          </div>

          <div className="t-label mb-8">Rate breakdown</div>
          <div className="fare-block">
            <div className="fare-row">
              <span className="fare-label">Hourly + distance</span>
              <span className="fare-value">$137.50</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Empty return</span>
              <span className="fare-value">$50.00</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">After-hours</span>
              <span className="fare-value">+$22.50</span>
            </div>
            <div className="fare-row">
              <span className="fare-label" style={{ fontWeight: 600 }}>Total</span>
              <span className="fare-total">$210.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
