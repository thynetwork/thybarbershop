'use client';

import { useState } from 'react';
import { splitServiceName, config } from '@/lib/config';
import DriverSidebar from '@/components/DriverSidebar';

/* ── Demo data ──────────────────────────────────────────────── */
type PayStatus = 'paid' | 'waived' | 'pending';
type PayMethod = 'Zelle' | 'Venmo' | 'Cash App' | 'Cash';

interface Transaction {
  id: string;
  initials: string;
  avatarClass: string;
  riderId: string;
  name: string;
  date: string;
  route: string;
  amount: string;
  method: PayMethod;
  status: PayStatus;
}

const TRANSACTIONS: Transaction[] = [
  { id: 't1', initials: 'SW', avatarClass: 'av-amber', riderId: 'SARA\u00B78834', name: 'Sarah W.', date: 'Thu Jul 17', route: 'IAH \u2192 Home', amount: '$50', method: 'Zelle', status: 'paid' },
  { id: 't2', initials: 'LM', avatarClass: 'av-amber', riderId: 'LISA\u00B73310', name: 'Lisa M.', date: 'Fri Jul 18', route: 'HOU \u2192 Galleria', amount: '$45', method: 'Venmo', status: 'paid' },
  { id: 't3', initials: 'MJ', avatarClass: 'av-navy', riderId: 'MARC\u00B75521', name: 'Marcus J.', date: 'Sat Jul 12', route: 'IAH \u2192 Downtown', amount: '$95', method: 'Cash App', status: 'paid' },
  { id: 't4', initials: 'TW', avatarClass: 'av-navy', riderId: 'TODD\u00B74401', name: 'Todd W.', date: 'Mon Jul 7', route: 'MCO \u2192 Resort', amount: '$120', method: 'Cash', status: 'paid' },
  { id: 't5', initials: 'SW', avatarClass: 'av-amber', riderId: 'SARA\u00B78834', name: 'Sarah W.', date: 'Thu Jul 10', route: 'IAH \u2192 Home', amount: '$50', method: 'Zelle', status: 'paid' },
  { id: 't6', initials: 'LM', avatarClass: 'av-amber', riderId: 'LISA\u00B73310', name: 'Lisa M.', date: 'Wed Jul 2', route: 'HOU \u2192 Galleria', amount: '$0', method: 'Zelle', status: 'waived' },
];

const TOP_CLIENTS = [
  { initials: 'SW', name: 'Sarah W.', total: '$200', trips: 4 },
  { initials: 'MJ', name: 'Marcus J.', total: '$190', trips: 2 },
  { initials: 'TW', name: 'Todd W.', total: '$120', trips: 1 },
];

const STATUS_BADGE: Record<PayStatus, { cls: string; label: string }> = {
  paid: { cls: 'badge-green', label: 'Paid' },
  waived: { cls: 'badge-purple', label: 'Waived' },
  pending: { cls: 'badge-amber', label: 'Pending' },
};

export default function PaymentLogPage() {
  const { prefix, highlight } = splitServiceName();
  const [tab, setTab] = useState('all');
  const [payMethod, setPayMethod] = useState<string>('zelle');
  const tabs = ['All', 'By client', 'This month', 'Custom'];

  return (
    <div className="app-shell">
      {/* Topbar */}
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

      <div className="layout-3col">
        {/* Sidebar */}
        <DriverSidebar activeItem="Payment log" pendingCount={3} />

        {/* Main content */}
        <div className="main-content">
          <h2 className="t-title mb-20">Payment Log</h2>

          {/* Stat cards */}
          <div className="grid-3 mb-20">
            <div className="card-green-tint" style={{ textAlign: 'center' }}>
              <div className="t-label mb-4">This week</div>
              <div className="stat-value green">$420</div>
            </div>
            <div className="card-surface" style={{ textAlign: 'center' }}>
              <div className="t-label mb-4">This month</div>
              <div className="stat-value">$1,840</div>
            </div>
            <div className="card-surface" style={{ textAlign: 'center' }}>
              <div className="t-label mb-4">All time</div>
              <div className="stat-value">$24,610</div>
            </div>
          </div>

          {/* Pending payment */}
          <div className="card-amber mb-20">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber-dim)', marginBottom: 2 }}>
                  Pending payment
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                  Todd W. &middot; MCO \u2192 Resort &middot; Jul 25
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--amber-dim)' }}>$120</span>
                <button className="btn btn-primary btn-sm">Mark paid</button>
              </div>
            </div>
          </div>

          {/* Seg control tabs */}
          <div className="seg-control mb-16">
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

          {/* Transaction list */}
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="li">
              <div className={`avatar av-sm ${tx.avatarClass}`}>{tx.initials}</div>
              <div className="li-info">
                <div className="li-name">
                  <span className="rider-id">{tx.riderId}</span> {tx.name}
                </div>
                <div className="li-sub">{tx.date} &middot; {tx.route} &middot; {tx.method}</div>
              </div>
              <div className="li-right">
                <div className="li-val">{tx.amount}</div>
                <div className="li-tag">
                  <span className={`badge ${STATUS_BADGE[tx.status].cls}`}>
                    {STATUS_BADGE[tx.status].label}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Export */}
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-ghost btn-sm">Export CSV</button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {/* Top clients this month */}
          <div className="card mb-16">
            <div className="t-label mb-12">Top clients this month</div>
            {TOP_CLIENTS.map(c => (
              <div key={c.name} className="li">
                <div className="avatar av-sm av-amber">{c.initials}</div>
                <div className="li-info">
                  <div className="li-name">{c.name}</div>
                  <div className="li-sub">{c.trips} trips</div>
                </div>
                <div className="li-right">
                  <div className="li-val">{c.total}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mark as paid form */}
          <div className="card">
            <div className="t-label mb-12">Mark as paid</div>
            <div className="form-group">
              <label className="form-label">Client</label>
              <select className="form-input">
                <option>Todd W. &middot; $120</option>
                <option>Sarah W. &middot; $50</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment method</label>
              <div className="radio-group">
                {[
                  { key: 'zelle', label: 'Zelle' },
                  { key: 'venmo', label: 'Venmo' },
                  { key: 'cashapp', label: 'Cash App' },
                  { key: 'cash', label: 'Cash' },
                ].map(pm => (
                  <div
                    key={pm.key}
                    className={`radio-opt${payMethod === pm.key ? ' on' : ''}`}
                    onClick={() => setPayMethod(pm.key)}
                  >
                    <div className="radio-dot">
                      {payMethod === pm.key && <div className="radio-dot-inner" />}
                    </div>
                    <span style={{ fontSize: 13 }}>{pm.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}>Confirm payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
