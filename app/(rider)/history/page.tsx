'use client';

import { useState } from 'react';
import { splitServiceName, config } from '@/lib/config';
import Link from 'next/link';

/* ── Demo data ──────────────────────────────────────────────── */
type BookingStatus = 'completed' | 'confirmed' | 'cancelled' | 'pending';

interface Booking {
  id: string;
  date: string;
  dateShort: string;
  route: string;
  terminal: string;
  flight: string;
  amount: string;
  status: BookingStatus;
}

const DRIVER = {
  name: 'Marcus Rivera',
  initials: 'MR',
  code: { airport: 'South Houston', initials: 'MRC', digits: '3341' },
};

const SUMMARY = {
  totalTrips: 47,
  totalSpent: '$2,350',
  firstTrip: 'Jan 9, 2026',
};

const BOOKINGS: Booking[] = [
  { id: 'b1', date: 'Thursday, July 17, 2026', dateShort: 'Jul 17', route: 'Fade + Lineup', terminal: 'South Houston', flight: '', amount: '$50', status: 'confirmed' },
  { id: 'b2', date: 'Friday, July 18, 2026', dateShort: 'Jul 18', route: 'Beard Trim', terminal: 'South Houston', flight: '', amount: '$50', status: 'confirmed' },
  { id: 'b3', date: 'Saturday, July 12, 2026', dateShort: 'Jul 12', route: 'Full Service', terminal: 'South Houston', flight: '', amount: '$95', status: 'completed' },
  { id: 'b4', date: 'Thursday, July 10, 2026', dateShort: 'Jul 10', route: 'Fade + Lineup', terminal: 'South Houston', flight: '', amount: '$50', status: 'completed' },
  { id: 'b5', date: 'Monday, July 7, 2026', dateShort: 'Jul 7', route: 'Fade + Lineup', terminal: 'South Houston', flight: '', amount: '$50', status: 'completed' },
  { id: 'b6', date: 'Friday, June 27, 2026', dateShort: 'Jun 27', route: 'Fade + Lineup', terminal: 'South Houston', flight: '', amount: '$50', status: 'completed' },
  { id: 'b7', date: 'Wednesday, June 18, 2026', dateShort: 'Jun 18', route: 'Cut + Style', terminal: 'South Houston', flight: '', amount: '$65', status: 'completed' },
  { id: 'b8', date: 'Monday, June 9, 2026', dateShort: 'Jun 9', route: 'Fade + Lineup', terminal: 'South Houston', flight: '', amount: '$0', status: 'cancelled' },
];

const STATUS_BADGE: Record<BookingStatus, { cls: string; label: string }> = {
  completed: { cls: 'badge-green', label: 'Completed' },
  confirmed: { cls: 'badge-blue', label: 'Confirmed' },
  cancelled: { cls: 'badge-red', label: 'Cancelled' },
  pending: { cls: 'badge-amber', label: 'Pending' },
};

const LAST_TRIP = BOOKINGS.find(b => b.status === 'completed')!;

export default function RiderHistoryPage() {
  const { prefix, highlight } = splitServiceName();
  const [tab, setTab] = useState('all');
  const tabs = ['All', 'This month', 'Last month', 'Custom'];

  return (
    <div className="app-shell">
      {/* Topbar */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="rider-id">SARA&middot;8834</div>
          <div className="topbar-avatar">SC</div>
        </div>
      </div>

      <div className="layout-3col">
        {/* Left sidebar: driver info */}
        <div className="sidebar">
          {/* Driver avatar + name + code */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div className="avatar av-lg av-amber" style={{ margin: '0 auto 12px' }}>{DRIVER.initials}</div>
            <div className="t-subtitle mb-4">{DRIVER.name}</div>
            <div className="driver-code" style={{ justifyContent: 'center' }}>
              <div className="dc-airport">{DRIVER.code.airport}</div>
              <div className="dc-initials">{DRIVER.code.initials}</div>
              <div className="dc-digits">{DRIVER.code.digits}</div>
            </div>
          </div>

          <hr className="divider" />

          {/* Summary stats */}
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div className="t-label mb-12">Summary</div>
            <div className="pref-row">
              <span className="pref-label">Total trips</span>
              <span className="pref-value">{SUMMARY.totalTrips}</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Total spent</span>
              <span className="pref-value">{SUMMARY.totalSpent}</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">First trip</span>
              <span className="pref-value">{SUMMARY.firstTrip}</span>
            </div>
          </div>

          <Link href="/home" className="btn btn-ghost btn-full btn-sm" style={{ textDecoration: 'none' }}>
            Back to home
          </Link>
        </div>

        {/* Main content */}
        <div className="main-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Link href="/home" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>&#8592; Back</Link>
            <h2 className="t-title">Booking History</h2>
          </div>

          {/* Seg tabs */}
          <div className="seg-control mb-20">
            {tabs.map(t => (
              <button
                key={t}
                className={`seg-opt${tab === t.toLowerCase().replace(/ /g, '_') || (tab === 'all' && t === 'All') ? ' on' : ''}`}
                onClick={() => setTab(t.toLowerCase().replace(/ /g, '_'))}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Booking list */}
          {BOOKINGS.map(b => (
            <div key={b.id} className="li" style={{ gap: 16 }}>
              {/* Date column */}
              <div style={{
                flex: '0 0 60px', textAlign: 'center',
                background: 'var(--surface)', borderRadius: 'var(--r-sm)', padding: '8px 6px',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>{b.dateShort.split(' ')[0]}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>
                  {b.dateShort.split(' ')[1]}
                </div>
              </div>
              {/* Route + details */}
              <div className="li-info">
                <div className="li-name">{b.route}</div>
                <div className="li-sub">{b.terminal} &middot; {b.flight}</div>
              </div>
              {/* Amount + status */}
              <div className="li-right">
                <div className="li-val">{b.amount}</div>
                <div className="li-tag">
                  <span className={`badge ${STATUS_BADGE[b.status].cls}`}>
                    {STATUS_BADGE[b.status].label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {/* Last trip detail */}
          <div className="card mb-16">
            <div className="t-label mb-8">Last trip</div>
            <div className="t-subtitle mb-4">{LAST_TRIP.route}</div>
            <div className="t-small mb-8">{LAST_TRIP.date}</div>
            <div className="pref-row">
              <span className="pref-label">Terminal</span>
              <span className="pref-value">{LAST_TRIP.terminal}</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Flight</span>
              <span className="pref-value">{LAST_TRIP.flight}</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Amount</span>
              <span className="pref-value" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{LAST_TRIP.amount}</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Status</span>
              <span className={`badge ${STATUS_BADGE[LAST_TRIP.status].cls}`}>
                {STATUS_BADGE[LAST_TRIP.status].label}
              </span>
            </div>
          </div>

          {/* Book again */}
          <button className="btn btn-primary btn-full">Book this route again</button>

          <div style={{ marginTop: 16 }}>
            <div className="card-surface">
              <div className="t-label mb-8">Quick stats</div>
              <div className="pref-row">
                <span className="pref-label">Most common route</span>
                <span className="pref-value">Fade + Lineup</span>
              </div>
              <div className="pref-row">
                <span className="pref-label">Avg. trip cost</span>
                <span className="pref-value">$50</span>
              </div>
              <div className="pref-row">
                <span className="pref-label">Trips this month</span>
                <span className="pref-value">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
