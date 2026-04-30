'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

type FilterKey = 'all' | 'month' | 'last' | 'year';
type Status = 'Done' | 'No-show · Waived' | 'Cancelled';

interface Cut {
  id: string;
  monthGroup: string;
  month: string;
  day: number;
  client: string;
  clientId: string;
  service: string;
  amount: string;
  amountDimmed?: boolean;
  status: Status;
  bg: string;
  fg: string;
  initials: string;
}

const CUTS: Cut[] = [
  { id: 'c1',  monthGroup: 'July 2026', month: 'Jul', day: 16, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Adult Haircut', amount: '$45', status: 'Done', bg: '#F5A623', fg: '#0a0a2e', initials: 'RG' },
  { id: 'c2',  monthGroup: 'July 2026', month: 'Jul', day: 16, client: 'Todd Williams', clientId: 'TODD·4401', service: 'Fade + Line-up', amount: '$55', status: 'Done', bg: '#1a1a6e', fg: '#F5A623', initials: 'TW' },
  { id: 'c3',  monthGroup: 'July 2026', month: 'Jul', day: 14, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Adult Haircut', amount: '$45', status: 'Done', bg: '#F5A623', fg: '#0a0a2e', initials: 'RG' },
  { id: 'c4',  monthGroup: 'July 2026', month: 'Jul', day: 13, client: 'Todd Williams', clientId: 'TODD·4401', service: 'Adult Haircut', amount: '$45', status: 'Done', bg: '#1a1a6e', fg: '#F5A623', initials: 'TW' },
  { id: 'c5',  monthGroup: 'July 2026', month: 'Jul', day: 11, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Fade + Line-up', amount: '$55', status: 'Done', bg: '#F5A623', fg: '#0a0a2e', initials: 'RG' },
  { id: 'c6',  monthGroup: 'July 2026', month: 'Jul', day: 9,  client: 'Todd Williams', clientId: 'TODD·4401', service: 'Full Service', amount: '$75', status: 'Done', bg: '#1a1a6e', fg: '#F5A623', initials: 'TW' },
  { id: 'c7',  monthGroup: 'July 2026', month: 'Jul', day: 7,  client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Adult Haircut', amount: '$0', amountDimmed: true, status: 'No-show · Waived', bg: '#F5A623', fg: '#0a0a2e', initials: 'RG' },
  { id: 'c8',  monthGroup: 'June 2026', month: 'Jun', day: 28, client: 'Todd Williams', clientId: 'TODD·4401', service: 'Fade + Line-up', amount: '$55', status: 'Done', bg: '#1a1a6e', fg: '#F5A623', initials: 'TW' },
  { id: 'c9',  monthGroup: 'June 2026', month: 'Jun', day: 26, client: 'Rayford Gibson', clientId: 'RAYF·8834', service: 'Fade + Line-up', amount: '$55', status: 'Done', bg: '#F5A623', fg: '#0a0a2e', initials: 'RG' },
  { id: 'c10', monthGroup: 'June 2026', month: 'Jun', day: 20, client: 'Marcus J.', clientId: 'MARC·5521', service: 'Adult Haircut', amount: '$0', amountDimmed: true, status: 'Cancelled', bg: '#2d3561', fg: '#a8d8ea', initials: 'MJ' },
];

const STATS = { totalCuts: 312, totalEarned: '$14,820', overall: '4.97', memberSince: "Jan '25" };

const RATING_BUCKETS = [
  { star: '5', count: 293, pct: 94, color: '#F5A623' },
  { star: '4', count: 12,  pct: 4,  color: 'rgba(255,255,255,0.4)' },
  { star: '3', count: 5,   pct: 1.5, color: 'rgba(255,255,255,0.25)' },
  { star: '2', count: 2,   pct: 0.5, color: 'rgba(255,255,255,0.15)' },
  { star: '1', count: 0,   pct: 0,   color: 'rgba(180,40,40,0.5)' },
  { star: '0', count: 0,   pct: 0,   color: 'rgba(180,40,40,0.5)' },
];

const barber = { initials: 'JM', name: 'John Merrick', codeId: 'JMR·7749', city: 'South Houston', state: 'TX', codeInitials: 'JMR', codeDigits: '7749' };

function statusClass(s: Status): string {
  if (s === 'Done') return 'hs-done';
  if (s === 'Cancelled') return 'hs-cancelled';
  return 'hs-noshow';
}

export default function BarberWorkHistoryPage() {
  const { prefix, highlight } = splitServiceName();

  const [filter, setFilter] = useState<FilterKey>('all');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Cut[]>();
    CUTS.forEach(c => {
      const arr = map.get(c.monthGroup) ?? [];
      arr.push(c);
      map.set(c.monthGroup, arr);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <>
      <style>{`
        .wh-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .wh-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .wh-tb-left{display:flex;align-items:center;gap:.85rem;}
        .wh-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .wh-logo span{color:#F5A623;}
        .wh-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .wh-code .city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .wh-code .state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .wh-code .init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .wh-code .digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .wh-tb-right{display:flex;align-items:center;gap:.75rem;}
        .wh-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .wh-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .wh-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .wh-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .wh-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .wh-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .wh-nav:hover{background:rgba(255,255,255,.05);}
        .wh-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .wh-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .wh-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .wh-nav.on .wh-nav-label,.wh-nav:hover .wh-nav-label{color:#fff;}
        .wh-nav.on .wh-nav-label{font-weight:600;}
        .wh-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#F5A623;color:#0a0a2e;}
        .wh-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .wh-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}

        .wh-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.25rem;}
        .wh-stat{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1rem;box-shadow:0 4px 16px rgba(0,0,0,.07);text-align:center;}
        .wh-stat.amber{background:rgba(245,166,35,.08);border-color:rgba(245,166,35,.25);}
        .wh-stat.navy{background:#0a0a2e;border-color:#0a0a2e;}
        .wh-stat-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#0a0a2e;}
        .wh-stat.amber .wh-stat-val{color:#D4830A;}
        .wh-stat.navy .wh-stat-val{color:#F5A623;}
        .wh-stat-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-top:.2rem;}
        .wh-stat.navy .wh-stat-label{color:rgba(255,255,255,.4);}

        .wh-rating-card{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.25rem;margin-bottom:1.25rem;box-shadow:0 .5rem 2rem rgba(0,0,0,.12);}
        .wh-rc-label{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.75rem;}
        .wh-rc-stars{display:flex;align-items:baseline;gap:.5rem;margin-bottom:.75rem;}
        .wh-rc-score{font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:#F5A623;}
        .wh-rc-max{font-size:.85rem;color:rgba(255,255,255,.3);}
        .wh-rc-count{font-size:.72rem;color:rgba(255,255,255,.4);}
        .wh-rc-bars{display:flex;flex-direction:column;gap:.3rem;}
        .wh-rc-bar-row{display:flex;align-items:center;gap:.6rem;}
        .wh-rc-bar-label{font-size:.62rem;color:rgba(255,255,255,.5);min-width:.5rem;text-align:right;}
        .wh-rc-bar-track{flex:1;height:.35rem;background:rgba(255,255,255,.1);border-radius:9999px;overflow:hidden;}
        .wh-rc-bar-fill{height:100%;border-radius:9999px;}
        .wh-rc-bar-count{font-size:.6rem;color:rgba(255,255,255,.35);min-width:1.5rem;}

        .wh-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;}
        .wh-filter-tabs{display:flex;gap:.4rem;flex-wrap:wrap;}
        .wh-filter-tab{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.3rem .85rem;font-size:.72rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .wh-filter-tab.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .wh-filter-tab:hover:not(.on){border-color:rgba(245,166,35,.25);}
        .wh-export-btn{background:#0a0a2e;border:none;border-radius:1rem;padding:.45rem 1rem;font-family:'Syne',sans-serif;font-size:.72rem;font-weight:700;color:#F5A623;cursor:pointer;}

        .wh-list{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);overflow:hidden;}
        .wh-date-divider{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9A9AAA;padding:.65rem 1.1rem;background:#F7F7F8;border-bottom:1px solid rgba(0,0,0,.09);}
        .wh-row{display:flex;align-items:center;gap:1rem;padding:.85rem 1.1rem;border-bottom:1px solid rgba(0,0,0,.09);cursor:pointer;}
        .wh-row:last-child{border-bottom:none;}
        .wh-row:hover{background:#F7F7F8;}
        .wh-hr-date{text-align:center;min-width:2.8rem;flex-shrink:0;}
        .wh-hr-month{font-size:.58rem;font-weight:700;text-transform:uppercase;color:#D4830A;}
        .wh-hr-day{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#0a0a2e;line-height:1;}
        .wh-hr-divider{width:1px;height:2.2rem;background:rgba(0,0,0,.09);flex-shrink:0;}
        .wh-hr-avatar{width:2.2rem;height:2.2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;flex-shrink:0;}
        .wh-hr-info{flex:1;min-width:0;}
        .wh-hr-client{font-size:.85rem;font-weight:600;color:#111118;}
        .wh-hr-service{font-size:.7rem;color:#5A5A6A;margin-top:.1rem;}
        .wh-hr-right{text-align:right;flex-shrink:0;}
        .wh-hr-amount{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#0a0a2e;}
        .wh-hr-amount.dim{color:#9A9AAA;}
        .wh-hr-status{display:inline-flex;border-radius:9999px;padding:.1rem .5rem;font-size:.58rem;font-weight:700;margin-top:.2rem;}
        .hs-done{background:#EAF3DE;color:#3B6D11;}
        .hs-noshow{background:rgba(180,40,40,.07);color:#b42828;}
        .hs-cancelled{background:rgba(0,0,0,.05);color:#9A9AAA;}

        .wh-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="wh-shell">
        <nav className="wh-topbar">
          <div className="wh-tb-left">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="wh-logo">{prefix}<span>{highlight}</span></div>
            </Link>
            <div className="wh-code">
              <div className="city">{barber.city}</div>
              <div className="state">{barber.state}</div>
              <div className="init">{barber.codeInitials}</div>
              <div className="digits">{barber.codeDigits}</div>
            </div>
          </div>
          <div className="wh-tb-right">
            <div className="wh-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="wh-bell-badge"></div>
            </div>
            <div className="wh-tb-avatar">{barber.initials}</div>
          </div>
        </nav>

        <aside className="wh-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{barber.initials}</div>
            <div className="si-name">{barber.name}</div>
            <div className="si-id">{barber.codeId}</div>
          </div>

          <div className="wh-side-section">Main</div>
          <Link href="/dashboard" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="wh-nav-label">Dashboard</span>
          </Link>
          <Link href="/calendar" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="wh-nav-label">Calendar</span>
          </Link>
          <Link href="/clients" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span className="wh-nav-label">Clients</span>
            <span className="wh-nav-badge">14</span>
          </Link>

          <div className="wh-side-section">Business</div>
          <Link href="/payment-log" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span className="wh-nav-label">Payment Log</span>
          </Link>
          <Link href="/share" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <span className="wh-nav-label">Share Code</span>
          </Link>

          <div className="wh-side-section">Account</div>
          <Link href="/public-profile" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="wh-nav-label">Profile</span>
          </Link>
          <Link href="/work-history" className="wh-nav on">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="wh-nav-label">Work History</span>
            <span className="wh-nav-badge">{STATS.totalCuts}</span>
          </Link>
          <Link href="/settings" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="wh-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="wh-nav">
            <span className="wh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="wh-nav-label">Support</span>
          </Link>

          <div className="wh-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="wh-main">
          <div className="wh-stats">
            <div className="wh-stat navy">
              <div className="wh-stat-val">{STATS.totalCuts}</div>
              <div className="wh-stat-label">Total Cuts</div>
            </div>
            <div className="wh-stat amber">
              <div className="wh-stat-val">{STATS.totalEarned}</div>
              <div className="wh-stat-label">Total Earned</div>
            </div>
            <div className="wh-stat">
              <div className="wh-stat-val">{STATS.overall}</div>
              <div className="wh-stat-label">Overall Rating</div>
            </div>
            <div className="wh-stat">
              <div className="wh-stat-val">{STATS.memberSince}</div>
              <div className="wh-stat-label">Member Since</div>
            </div>
          </div>

          <div className="wh-rating-card">
            <div className="wh-rc-label">Rating Breakdown &middot; {STATS.totalCuts} check-ins</div>
            <div className="wh-rc-stars">
              <div className="wh-rc-score">{STATS.overall}</div>
              <div className="wh-rc-max">/ 5</div>
              <div className="wh-rc-count">★★★★★ &middot; {STATS.totalCuts} anonymous ratings</div>
            </div>
            <div className="wh-rc-bars">
              {RATING_BUCKETS.map(b => (
                <div key={b.star} className="wh-rc-bar-row">
                  <div className="wh-rc-bar-label">{b.star}</div>
                  <div className="wh-rc-bar-track">
                    <div className="wh-rc-bar-fill" style={{ width: `${b.pct}%`, background: b.color }}></div>
                  </div>
                  <div className="wh-rc-bar-count">{b.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="wh-top-row">
            <div className="wh-filter-tabs">
              {([
                { key: 'all', label: 'All' },
                { key: 'month', label: 'This Month' },
                { key: 'last', label: 'Last Month' },
                { key: 'year', label: 'This Year' },
              ] as { key: FilterKey; label: string }[]).map(f => (
                <button
                  key={f.key}
                  type="button"
                  className={'wh-filter-tab' + (filter === f.key ? ' on' : '')}
                  onClick={() => setFilter(f.key)}
                >{f.label}</button>
              ))}
            </div>
            <button type="button" className="wh-export-btn" onClick={() => showToast('Exporting work history as CSV')}>Export CSV</button>
          </div>

          <div className="wh-list">
            {grouped.map(([month, rows]) => (
              <div key={month}>
                <div className="wh-date-divider">{month}</div>
                {rows.map(c => (
                  <div key={c.id} className="wh-row">
                    <div className="wh-hr-date">
                      <div className="wh-hr-month">{c.month}</div>
                      <div className="wh-hr-day">{c.day}</div>
                    </div>
                    <div className="wh-hr-divider"></div>
                    <div className="wh-hr-avatar" style={{ background: c.bg, color: c.fg }}>{c.initials}</div>
                    <div className="wh-hr-info">
                      <div className="wh-hr-client">{c.client}</div>
                      <div className="wh-hr-service">{c.service} &middot; {c.clientId}</div>
                    </div>
                    <div className="wh-hr-right">
                      <div className={'wh-hr-amount' + (c.amountDimmed ? ' dim' : '')}>{c.amount}</div>
                      <span className={'wh-hr-status ' + statusClass(c.status)}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="wh-toast">{toast}</div>}
    </>
  );
}
