'use client';

import { useState } from 'react';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

/* ── Demo data ─────────────────────────────── */
const DEMO_PAYMENTS = [
  { id: 'p1', initials: 'SC', name: 'Sarah Chen', sub: 'Thu Jul 17 \u00b7 Airport to Home', amount: '$120', status: 'Paid', badgeClass: 'badge-green', color: 'av-green' },
  { id: 'p2', initials: 'LM', name: 'Lisa Morales', sub: 'Fri Jul 18 \u00b7 Home to office', amount: '$45', status: 'Paid', badgeClass: 'badge-green', color: 'av-green' },
  { id: 'p3', initials: 'DT', name: 'Dana Torres', sub: 'Sat Jul 19 \u00b7 Houston \u2192 Austin', amount: '$210', status: 'Pending', badgeClass: 'badge-amber', color: 'av-amber' },
  { id: 'p4', initials: 'MJ', name: 'Marcus Johnson', sub: 'Mon Jul 14 \u00b7 Airport pickup', amount: '$95', status: 'Paid', badgeClass: 'badge-green', color: 'av-green' },
  { id: 'p5', initials: 'SC', name: 'Sarah Chen', sub: 'Thu Jul 10 \u00b7 Airport to Home \u00b7 No-show waived', amount: '$0', status: 'Waived', badgeClass: 'badge-purple', color: 'av-green' },
];

const TOP_CLIENTS = [
  { name: 'Sarah Chen', amount: '$720' },
  { name: 'Marcus Johnson', amount: '$380' },
  { name: 'Dana Torres', amount: '$295' },
  { name: 'Lisa Morales', amount: '$270' },
];

const NAV_ITEMS = [
  { icon: '\u229e', label: 'Dashboard', href: '/dashboard' },
  { icon: '\ud83d\udcc5', label: 'Calendar', href: '/dashboard' },
  { icon: '\ud83d\udc65', label: 'Clients', href: '/dashboard' },
  { icon: '\ud83d\udcb0', label: 'Payment log', href: '/payments', active: true },
  { icon: '\ud83d\udd17', label: 'Share code', href: '/share' },
  { icon: '\ud83d\udc64', label: 'Profile', href: '/dashboard' },
  { icon: '\u2699', label: 'Settings', href: '/settings' },
];

export default function PaymentLog() {
  const { prefix, highlight } = splitServiceName();
  const [filter, setFilter] = useState<'all' | 'by-client' | 'month'>('all');

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

      <div className="layout-3col">
        {/* Sidebar */}
        <div className="sidebar">
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
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="main-content">
          {/* Filter tabs */}
          <div className="seg-control mb-16" style={{ maxWidth: 340 }}>
            <button className={`seg-opt${filter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>All clients</button>
            <button className={`seg-opt${filter === 'by-client' ? ' on' : ''}`} onClick={() => setFilter('by-client')}>By client</button>
            <button className={`seg-opt${filter === 'month' ? ' on' : ''}`} onClick={() => setFilter('month')}>This month</button>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
            <div className="stat-card">
              <div className="stat-label">July total</div>
              <div className="stat-value green">$1,840</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Rides</div>
              <div className="stat-value">22</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value amber">1</div>
            </div>
          </div>

          {/* Payment list */}
          <div className="card">
            {DEMO_PAYMENTS.map((p) => (
              <div className="list-item" key={p.id}>
                <div className={`avatar ${p.color} av-sm`}>{p.initials}</div>
                <div className="li-info">
                  <div className="li-name">{p.name}</div>
                  <div className="li-sub">{p.sub}</div>
                </div>
                <div className="li-right">
                  <div className="li-val">{p.amount}</div>
                  <div className="li-tag"><span className={`badge ${p.badgeClass}`}>{p.status}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-ghost">Export log as CSV</button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">Top clients this month</div>
          <div className="card-surface mb-12">
            {TOP_CLIENTS.map((c) => (
              <div className="row" key={c.name}>
                <span className="row-label">{c.name}</span>
                <span className="row-value">{c.amount}</span>
              </div>
            ))}
          </div>

          <div className="t-label mb-8">Mark as paid</div>
          <div className="card-amber-tint">
            <div style={{ fontSize: 13, color: 'var(--amber-dim)', fontWeight: 500, marginBottom: 6 }}>
              Dana Torres &middot; $210
            </div>
            <div className="t-small" style={{ color: 'var(--amber-dim)', marginBottom: 10 }}>
              Houston &rarr; Austin &middot; Sat Jul 19
            </div>
            <button className="btn btn-primary btn-sm btn-full">Mark as paid</button>
          </div>
        </div>
      </div>
    </div>
  );
}
