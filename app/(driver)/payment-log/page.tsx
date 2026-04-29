'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

type Status = 'Paid' | 'Pending' | 'No-show · Waived';
type Method = 'Zelle' | 'Venmo' | 'Cash' | 'Cash App' | 'Stripe' | 'Waived';
type FilterKey = 'all' | 'week' | 'month' | 'unpaid';

interface PaymentRow {
  id: string;
  month: string;
  day: number;
  client: string;
  clientId: string;
  service: string;
  amount: string;
  amountDimmed?: boolean;
  status: Status;
  method: Method;
}

const METHOD_DOT: Record<Method, string | null> = {
  Zelle: '#6d1ed4',
  Venmo: '#008cff',
  Cash: '#2e7d32',
  'Cash App': '#00d64f',
  Stripe: '#635bff',
  Waived: null,
};

const PAYMENTS: PaymentRow[] = [
  { id: 'p1', month: 'Jul', day: 16, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Adult Haircut', amount: '$45', status: 'Pending', method: 'Zelle' },
  { id: 'p2', month: 'Jul', day: 16, client: 'Todd Williams', clientId: 'TODD·4401', service: 'Fade + Line-up', amount: '$55', status: 'Pending', method: 'Cash' },
  { id: 'p3', month: 'Jul', day: 14, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Adult Haircut', amount: '$45', status: 'Paid', method: 'Zelle' },
  { id: 'p4', month: 'Jul', day: 13, client: 'Todd Williams', clientId: 'TODD·4401', service: 'Adult Haircut', amount: '$45', status: 'Paid', method: 'Venmo' },
  { id: 'p5', month: 'Jul', day: 11, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Fade + Line-up', amount: '$55', status: 'Paid', method: 'Zelle' },
  { id: 'p6', month: 'Jul', day: 9,  client: 'Todd Williams', clientId: 'TODD·4401', service: 'Full Service', amount: '$75', status: 'Paid', method: 'Cash' },
  { id: 'p7', month: 'Jul', day: 7,  client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Adult Haircut', amount: '$0', amountDimmed: true, status: 'No-show · Waived', method: 'Waived' },
  { id: 'p8', month: 'Jul', day: 3,  client: 'Todd Williams', clientId: 'TODD·4401', service: 'Fade + Line-up', amount: '$55', status: 'Paid', method: 'Venmo' },
];

const STATS = {
  thisMonth: '$2,340',
  thisWeek: '$1,180',
  appointments: 52,
  thisYear: '$14,820',
};

const barber = { initials: 'JM', name: 'John Merrick', codeId: 'JMR·7749', city: 'South Houston', state: 'TX', codeInitials: 'JMR', codeDigits: '7749' };

function statusClass(s: Status): string {
  if (s === 'Paid') return 'status-paid';
  if (s === 'Pending') return 'status-pending';
  return 'status-waived';
}

export default function BarberPaymentLogPage() {
  const { prefix, highlight } = splitServiceName();

  const [filter, setFilter] = useState<FilterKey>('all');
  const [rows, setRows] = useState<PaymentRow[]>(PAYMENTS);
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function markPaid(id: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: 'Paid' as Status } : r));
    showToast('Payment marked as received');
  }

  function exportCsv() {
    showToast('Exporting CSV — downloads to your device');
  }

  const visible = useMemo(() => {
    if (filter === 'unpaid') return rows.filter(r => r.status === 'Pending');
    return rows;
  }, [filter, rows]);

  return (
    <>
      <style>{`
        .pl-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .pl-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .pl-tb-left{display:flex;align-items:center;gap:.85rem;}
        .pl-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .pl-logo span{color:#F5A623;}
        .pl-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .pl-code .city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .pl-code .state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .pl-code .init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .pl-code .digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .pl-tb-right{display:flex;align-items:center;gap:.75rem;}
        .pl-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .pl-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .pl-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .pl-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .pl-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .pl-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .pl-nav:hover{background:rgba(255,255,255,.05);}
        .pl-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .pl-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .pl-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .pl-nav.on .pl-nav-label,.pl-nav:hover .pl-nav-label{color:#fff;}
        .pl-nav.on .pl-nav-label{font-weight:600;}
        .pl-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#F5A623;color:#0a0a2e;}
        .pl-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .pl-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}

        .pl-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.25rem;}
        .pl-stat{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1rem;box-shadow:0 4px 16px rgba(0,0,0,.07);text-align:center;}
        .pl-stat.amber{background:rgba(245,166,35,.08);border-color:rgba(245,166,35,.25);}
        .pl-stat-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#0a0a2e;}
        .pl-stat.amber .pl-stat-val{color:#D4830A;}
        .pl-stat-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-top:.2rem;}

        .pl-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;}
        .pl-filter-tabs{display:flex;gap:.4rem;}
        .pl-filter-tab{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.3rem .85rem;font-size:.72rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .pl-filter-tab.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .pl-filter-tab:hover:not(.on){border-color:rgba(245,166,35,.25);}
        .pl-export-btn{background:#0a0a2e;border:none;border-radius:1rem;padding:.45rem 1rem;font-family:'Syne',sans-serif;font-size:.72rem;font-weight:700;color:#F5A623;cursor:pointer;}
        .pl-export-btn:hover{background:#14145c;}

        .pl-list{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);overflow:hidden;margin-bottom:1.25rem;}
        .pl-row{display:flex;align-items:center;gap:1rem;padding:.85rem 1.1rem;border-bottom:1px solid rgba(0,0,0,.09);cursor:pointer;}
        .pl-row:last-child{border-bottom:none;}
        .pl-row:hover{background:#F7F7F8;}
        .pl-date{text-align:center;min-width:2.8rem;flex-shrink:0;}
        .pl-month{font-size:.58rem;font-weight:700;text-transform:uppercase;color:#D4830A;}
        .pl-day{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#0a0a2e;line-height:1;}
        .pl-divider{width:1px;height:2.2rem;background:rgba(0,0,0,.09);flex-shrink:0;}
        .pl-info{flex:1;min-width:0;}
        .pl-client{font-size:.85rem;font-weight:600;color:#111118;}
        .pl-service{font-size:.7rem;color:#5A5A6A;margin-top:.1rem;}
        .pl-right{text-align:right;flex-shrink:0;}
        .pl-amount{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#0a0a2e;}
        .pl-amount.dim{color:#9A9AAA;}
        .pl-method{display:inline-flex;align-items:center;gap:.3rem;margin-top:.2rem;}
        .pl-method-dot{width:.5rem;height:.5rem;border-radius:50%;}
        .pl-method-label{font-size:.62rem;font-weight:600;color:#9A9AAA;}
        .pl-status{display:inline-flex;border-radius:9999px;padding:.1rem .5rem;font-size:.58rem;font-weight:700;margin-left:.5rem;}
        .status-paid{background:#EAF3DE;color:#3B6D11;}
        .status-pending{background:rgba(245,166,35,.08);color:#D4830A;}
        .status-waived{background:rgba(0,0,0,.05);color:#9A9AAA;}

        .pl-mark-paid-btn{border:1.5px solid rgba(245,166,35,.25);border-radius:9999px;padding:.2rem .65rem;font-size:.62rem;font-weight:700;color:#D4830A;cursor:pointer;background:rgba(245,166,35,.08);font-family:inherit;white-space:nowrap;margin-left:.5rem;}
        .pl-mark-paid-btn:hover{background:#F5A623;color:#0a0a2e;}

        .pl-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="pl-shell">
        <nav className="pl-topbar">
          <div className="pl-tb-left">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="pl-logo">{prefix}<span>{highlight}</span></div>
            </Link>
            <div className="pl-code">
              <div className="city">{barber.city}</div>
              <div className="state">{barber.state}</div>
              <div className="init">{barber.codeInitials}</div>
              <div className="digits">{barber.codeDigits}</div>
            </div>
          </div>
          <div className="pl-tb-right">
            <div className="pl-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="pl-bell-badge"></div>
            </div>
            <div className="pl-tb-avatar">{barber.initials}</div>
          </div>
        </nav>

        <aside className="pl-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{barber.initials}</div>
            <div className="si-name">{barber.name}</div>
            <div className="si-id">{barber.codeId}</div>
          </div>

          <div className="pl-side-section">Main</div>
          <Link href="/dashboard" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="pl-nav-label">Dashboard</span>
          </Link>
          <Link href="/calendar" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="pl-nav-label">Calendar</span>
          </Link>
          <Link href="/clients" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span className="pl-nav-label">Clients</span>
            <span className="pl-nav-badge">14</span>
          </Link>

          <div className="pl-side-section">Business</div>
          <Link href="/payment-log" className="pl-nav on">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span className="pl-nav-label">Payment Log</span>
          </Link>
          <Link href="/share" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <span className="pl-nav-label">Share Code</span>
          </Link>

          <div className="pl-side-section">Account</div>
          <Link href="/public-profile" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="pl-nav-label">Profile</span>
          </Link>
          <Link href="/work-history" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="pl-nav-label">Work History</span>
            <span className="pl-nav-badge">312</span>
          </Link>
          <Link href="/settings" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="pl-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="pl-nav">
            <span className="pl-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="pl-nav-label">Support</span>
          </Link>

          <div className="pl-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="pl-main">
          <div className="pl-stats">
            <div className="pl-stat amber">
              <div className="pl-stat-val">{STATS.thisMonth}</div>
              <div className="pl-stat-label">This Month</div>
            </div>
            <div className="pl-stat">
              <div className="pl-stat-val">{STATS.thisWeek}</div>
              <div className="pl-stat-label">This Week</div>
            </div>
            <div className="pl-stat">
              <div className="pl-stat-val">{STATS.appointments}</div>
              <div className="pl-stat-label">Appointments</div>
            </div>
            <div className="pl-stat">
              <div className="pl-stat-val">{STATS.thisYear}</div>
              <div className="pl-stat-label">This Year</div>
            </div>
          </div>

          <div className="pl-top-row">
            <div className="pl-filter-tabs">
              {([
                { key: 'all', label: 'All' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'unpaid', label: 'Unpaid' },
              ] as { key: FilterKey; label: string }[]).map(f => (
                <button
                  key={f.key}
                  type="button"
                  className={'pl-filter-tab' + (filter === f.key ? ' on' : '')}
                  onClick={() => setFilter(f.key)}
                >{f.label}</button>
              ))}
            </div>
            <button type="button" className="pl-export-btn" onClick={exportCsv}>Export CSV</button>
          </div>

          <div className="pl-list">
            {visible.map(p => {
              const dot = METHOD_DOT[p.method];
              return (
                <div key={p.id} className="pl-row">
                  <div className="pl-date">
                    <div className="pl-month">{p.month}</div>
                    <div className="pl-day">{p.day}</div>
                  </div>
                  <div className="pl-divider"></div>
                  <div className="pl-info">
                    <div className="pl-client">
                      {p.client}
                      <span className={'pl-status ' + statusClass(p.status)}>{p.status}</span>
                    </div>
                    <div className="pl-service">{p.service} &middot; {p.clientId}</div>
                  </div>
                  <div className="pl-right">
                    <div className={'pl-amount' + (p.amountDimmed ? ' dim' : '')}>{p.amount}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div className="pl-method">
                        {dot && <div className="pl-method-dot" style={{ background: dot }}></div>}
                        <div className="pl-method-label">{p.method}</div>
                      </div>
                      {p.status === 'Pending' && (
                        <button type="button" className="pl-mark-paid-btn" onClick={(e) => { e.stopPropagation(); markPaid(p.id); }}>Mark Paid</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="pl-toast">{toast}</div>}
    </>
  );
}
