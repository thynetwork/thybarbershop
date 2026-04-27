'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

/* ── Demo data ─────────────────────────────── */
const DEMO_STATS = {
  thisWeek: '$420',
  thisMonth: '$1,840',
  pendingRequests: 2,
  activeClients: 14,
};

const DEMO_BOOKING_REQUESTS = [
  { id: 'bk-1', initials: 'SC', name: 'Sarah Chen', route: 'Airport to Home', date: 'Thu Jul 17', time: '9am', amount: '$120 set amount', color: 'av-amber' },
  { id: 'bk-2', initials: 'DT', name: 'Dana Torres', route: 'Houston \u2192 Austin', date: 'Sat Jul 19', time: '', amount: 'New destination \u00b7 needs pricing', color: 'av-amber' },
];

const DEMO_CLIENT_REQUESTS = [
  { id: 'cr-1', initials: 'TW', name: 'Tom Williams', sub: 'Wants to connect \u00b7 Referred by Sarah Chen', color: 'av-navy' },
];

const DEMO_UPCOMING = [
  { id: 'up-1', initials: 'SC', name: 'Sarah Chen', sub: 'Thu Jul 17 \u00b7 9:00 am \u00b7 Airport to Home', amount: '$120', badge: 'Set amount', badgeClass: 'badge-purple', color: 'av-green' },
  { id: 'up-2', initials: 'LM', name: 'Lisa Morales', sub: 'Fri Jul 18 \u00b7 7:00 am \u00b7 Home to office', amount: '$45', badge: 'Confirmed', badgeClass: 'badge-green', color: 'av-green' },
];

const NAV_ITEMS = [
  { icon: '\u229e', label: 'Dashboard', href: '/dashboard', active: true },
  { icon: '\ud83d\udcc5', label: 'Calendar', href: '/dashboard' },
  { icon: '\ud83d\udc65', label: 'Clients', href: '/clients', badge: '3' },
  { icon: '\ud83d\udcb0', label: 'Payment log', href: '/payments' },
  { icon: '\ud83d\udd17', label: 'Share code', href: '/share' },
  { icon: '\ud83d\udc64', label: 'Profile', href: '/dashboard' },
  { icon: '\u2699', label: 'Settings', href: '/settings' },
];

export default function DriverDashboard() {
  const { prefix, highlight } = splitServiceName();
  const [driverCode] = useState('JDR\u00b74207');
  const [driverName] = useState('James Rivera');

  return (
    <div className="app-shell">
      {/* App topbar */}
      <div className="app-topbar">
        <div>
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
            Good morning, {driverName}
          </div>
        </div>
        <div className="topbar-right">
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
            borderRadius: 'var(--r-full)', padding: '4px 12px',
            fontSize: 11, color: 'var(--amber)', fontWeight: 600,
          }}>{driverCode}</div>
          <div className="topbar-avatar">JR</div>
        </div>
      </div>

      <div className="layout-3col">
        {/* Sidebar */}
        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
          <nav className="side-nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`side-link${item.active ? ' active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <span className="side-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="side-badge">{item.badge}</span>}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <div className="sub-banner">
              <div className="sub-text">${config.subscriptionAmount}/week &middot; Active</div>
              <div className="sub-pill">Renews Fri</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          {/* Stats grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">This week</div>
              <div className="stat-value green">{DEMO_STATS.thisWeek}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">This month</div>
              <div className="stat-value">{DEMO_STATS.thisMonth}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending requests</div>
              <div className="stat-value amber">{DEMO_STATS.pendingRequests}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active clients</div>
              <div className="stat-value">{DEMO_STATS.activeClients}</div>
            </div>
          </div>

          {/* Insurance strip */}
          <div className="ins-strip">
            <div className="ins-dot" />
            <div className="ins-text">Insured by Allstate &middot; Rideshare coverage &middot; Policy active</div>
          </div>

          {/* New booking requests */}
          <div className="t-label mb-8">New booking requests</div>
          <div className="card mb-16">
            {DEMO_BOOKING_REQUESTS.map((req) => (
              <div className="list-item" key={req.id}>
                <div className={`avatar ${req.color} av-sm`}>{req.initials}</div>
                <div className="li-info">
                  <div className="li-name">{req.name}</div>
                  <div className="li-sub">{req.route} &middot; {req.date}{req.time ? ` \u00b7 ${req.time}` : ''} &middot; {req.amount}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href={`/booking/${req.id}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Review</Link>
                  <button className="btn btn-ghost btn-sm">Deny</button>
                </div>
              </div>
            ))}
          </div>

          {/* New client requests */}
          <div className="t-label mb-8">New client requests</div>
          <div className="card mb-16">
            {DEMO_CLIENT_REQUESTS.map((req) => (
              <div className="list-item" key={req.id}>
                <div className={`avatar ${req.color} av-sm`}>{req.initials}</div>
                <div className="li-info">
                  <div className="li-name">{req.name}</div>
                  <div className="li-sub">{req.sub}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-green btn-sm">Approve</button>
                  <button className="btn btn-ghost btn-sm">Deny</button>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming confirmed */}
          <div className="t-label mb-8">Upcoming confirmed</div>
          <div className="card">
            {DEMO_UPCOMING.map((bk) => (
              <div className="list-item" key={bk.id}>
                <div className={`avatar ${bk.color} av-sm`}>{bk.initials}</div>
                <div className="li-info">
                  <div className="li-name">{bk.name}</div>
                  <div className="li-sub">{bk.sub}</div>
                </div>
                <div className="li-right">
                  <div className="li-val">{bk.amount}</div>
                  <div className="li-tag"><span className={`badge ${bk.badgeClass}`}>{bk.badge}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-12">Credentials status</div>
          <div className="card-surface mb-12">
            <div className="row"><span className="row-label">Safety Protocol</span><span className="badge badge-green">Complete</span></div>
            <div className="row"><span className="row-label">TX Driver&apos;s License</span><span className="badge badge-green">Verified</span></div>
            <div className="row"><span className="row-label">Airport permit</span><span className="badge badge-blue">Active</span></div>
            <div className="row"><span className="row-label">Insurance</span><span className="badge badge-green">Allstate</span></div>
          </div>

          <div className="t-label mb-8">Today</div>
          <div className="card-surface">
            <div style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center', padding: '12px 0' }}>
              No rides today — you&apos;re off
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
