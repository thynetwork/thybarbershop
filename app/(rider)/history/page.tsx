'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type ApptStatus = 'Upcoming' | 'Done' | 'Cancelled' | 'No-show · Waived';

interface Appt {
  id: string;
  month: string;
  day: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  location: string;
  amount: string;
  amountDimmed?: boolean;
  status: ApptStatus;
  payment: string;
}

const APPTS: Appt[] = [
  { id: 'a1', month: 'Jul', day: '17', date: 'Jul 17, 2026', time: '11:00 am', service: 'Adult Haircut', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$45', status: 'Upcoming', payment: 'Zelle' },
  { id: 'a2', month: 'Jul', day: '10', date: 'Jul 10, 2026', time: '11:00 am', service: 'Adult Haircut', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$45', status: 'Done', payment: 'Zelle' },
  { id: 'a3', month: 'Jul', day: '3', date: 'Jul 3, 2026', time: '11:00 am', service: 'Fade + Line-up', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$55', status: 'Done', payment: 'Cash' },
  { id: 'a4', month: 'Jun', day: '26', date: 'Jun 26, 2026', time: '11:00 am', service: 'Fade + Line-up', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$55', status: 'Done', payment: 'Cash' },
  { id: 'a5', month: 'Jun', day: '19', date: 'Jun 19, 2026', time: '11:00 am', service: 'Adult Haircut', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$0', amountDimmed: true, status: 'No-show · Waived', payment: 'Waived' },
  { id: 'a6', month: 'Jun', day: '12', date: 'Jun 12, 2026', time: '11:00 am', service: 'Full Service', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$75', status: 'Done', payment: 'Zelle' },
  { id: 'a7', month: 'Jun', day: '5', date: 'Jun 5, 2026', time: '11:00 am', service: 'Adult Haircut', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$45', status: 'Done', payment: 'Cash' },
  { id: 'a8', month: 'May', day: '29', date: 'May 29, 2026', time: '11:00 am', service: 'Fade + Line-up', barber: 'John Merrick · The Studio', location: 'The Studio · South Houston', amount: '$0', amountDimmed: true, status: 'Cancelled', payment: '—' },
];

const client = { name: 'Rayford Gibson', clientId: 'RAYF·8834', initials: 'RG', barber: 'John Merrick' };
const STATS = { total: 47, spent: '$2,115', first: "Jan '25", last: 'Jul 10' };

type FilterKey = 'all' | 'month' | 'last' | 'custom';

export default function AppointmentHistoryPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState('a1');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [toast, setToast] = useState('');

  const selected = APPTS.find(a => a.id === selectedId) ?? APPTS[0];

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function statusClass(s: ApptStatus) {
    if (s === 'Done') return 'status-done';
    if (s === 'Cancelled') return 'status-cancelled';
    if (s === 'No-show · Waived') return 'status-noshow';
    return 'status-upcoming';
  }

  function setFilterAndToast(f: FilterKey) {
    setFilter(f);
    if (f === 'custom') showToast('Opens date range picker');
    else if (f !== 'all') showToast('Filtering by: ' + f);
  }

  function bookAgain() {
    router.push('/driver/MRC');
  }

  return (
    <>
      <style>{`
        .ah-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .ah-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .ah-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .ah-logo span{color:#F5A623;}
        .ah-tb-right{display:flex;align-items:center;gap:.75rem;}
        .ah-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .ah-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .ah-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .ah-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .ah-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .ah-side-section:first-child{margin-top:0;}
        .ah-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .ah-nav:hover{background:rgba(255,255,255,.05);}
        .ah-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .ah-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .ah-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .ah-nav.on .ah-nav-label,.ah-nav:hover .ah-nav-label{color:#fff;}
        .ah-nav.on .ah-nav-label{font-weight:600;}
        .ah-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .ah-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}

        .ah-page-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#111118;margin-bottom:.2rem;}
        .ah-page-sub{font-size:.78rem;color:#5A5A6A;margin-bottom:1.25rem;}

        .ah-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.25rem;}
        .ah-stat{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1rem;box-shadow:0 4px 16px rgba(0,0,0,.07);text-align:center;}
        .ah-stat.amber{background:rgba(245,166,35,.08);border-color:rgba(245,166,35,.25);}
        .ah-stat-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#0a0a2e;margin-bottom:.15rem;}
        .ah-stat.amber .ah-stat-val{color:#D4830A;}
        .ah-stat-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;}

        .ah-filter-tabs{display:flex;gap:.4rem;margin-bottom:1rem;flex-wrap:wrap;}
        .ah-filter-tab{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.3rem .85rem;font-size:.72rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .ah-filter-tab:hover{border-color:rgba(245,166,35,.25);}
        .ah-filter-tab.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .ah-list{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);overflow:hidden;margin-bottom:1.25rem;}
        .ah-row{display:flex;align-items:center;gap:1rem;padding:.85rem 1.1rem;border-bottom:1px solid rgba(0,0,0,.09);cursor:pointer;}
        .ah-row:last-child{border-bottom:none;}
        .ah-row:hover{background:#F7F7F8;}
        .ah-row.selected{background:rgba(245,166,35,.08);}
        .ah-date{text-align:center;min-width:2.8rem;flex-shrink:0;}
        .ah-month{font-size:.58rem;font-weight:700;text-transform:uppercase;color:#D4830A;}
        .ah-day{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#0a0a2e;line-height:1;}
        .ah-divider{width:1px;height:2.2rem;background:rgba(0,0,0,.09);flex-shrink:0;}
        .ah-info{flex:1;min-width:0;}
        .ah-service{font-size:.85rem;font-weight:600;color:#111118;margin-bottom:.15rem;}
        .ah-barber{font-size:.7rem;color:#5A5A6A;}
        .ah-right{text-align:right;flex-shrink:0;}
        .ah-amount{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#0a0a2e;margin-bottom:.2rem;}
        .ah-amount.dim{color:#9A9AAA;}
        .ah-status{display:inline-flex;border-radius:9999px;padding:.1rem .5rem;font-size:.58rem;font-weight:700;}
        .status-done{background:#EAF3DE;color:#3B6D11;}
        .status-cancelled{background:rgba(180,40,40,.07);color:#b42828;}
        .status-noshow{background:rgba(180,40,40,.07);color:#b42828;}
        .status-upcoming{background:rgba(245,166,35,.08);color:#D4830A;}

        .ah-detail{background:#0a0a2e;background-image:radial-gradient(ellipse at top right,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.25rem;box-shadow:0 8px 32px rgba(0,0,0,.12);margin-bottom:1.25rem;}
        .ah-d-label{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .ah-d-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08);}
        .ah-d-row{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.07);}
        .ah-d-row:last-of-type{border-bottom:none;}
        .ah-d-key{font-size:.7rem;color:rgba(255,255,255,.35);}
        .ah-d-val{font-size:.82rem;font-weight:600;color:#fff;text-align:right;}
        .ah-d-val.amber{color:#F5A623;font-family:'Syne',sans-serif;font-weight:800;}
        .ah-book-again{width:100%;background:#F5A623;border:none;border-radius:1rem;padding:.85rem;font-family:'Syne',sans-serif;font-size:.88rem;font-weight:800;color:#0a0a2e;cursor:pointer;margin-top:.85rem;}
        .ah-book-again:hover{opacity:.88;}

        .ah-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="ah-shell">
        <nav className="ah-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="ah-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="ah-tb-right">
            <div className="ah-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="ah-bell-badge"></div>
            </div>
            <div className="ah-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="ah-sidebar">
          <div className="ah-side-section">Booking</div>
          <Link href="/home" className="ah-nav">
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="ah-nav-label">Home</span>
          </Link>
          <button type="button" className="ah-nav" onClick={() => showToast('Goes to booking flow')}>
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="ah-nav-label">Book</span>
          </button>
          <button type="button" className="ah-nav" onClick={() => showToast('Opens notifications')}>
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="ah-nav-label">Notifications</span>
          </button>

          <div className="ah-side-section">Account</div>
          <Link href="/profile" className="ah-nav">
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="ah-nav-label">My Profile</span>
          </Link>
          <Link href="/history" className="ah-nav on">
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="ah-nav-label">Appointment History</span>
          </Link>
          <Link href="/rider-settings" className="ah-nav">
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="ah-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="ah-nav">
            <span className="ah-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="ah-nav-label">Support</span>
          </Link>

          <div className="ah-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="ah-main">
          <div className="ah-page-title">Appointment History</div>
          <div className="ah-page-sub">{client.name} &middot; {client.clientId} &middot; with {client.barber}</div>

          <div className="ah-stats">
            <div className="ah-stat amber">
              <div className="ah-stat-val">{STATS.total}</div>
              <div className="ah-stat-label">Total Visits</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-val">{STATS.spent}</div>
              <div className="ah-stat-label">Total Spent</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-val">{STATS.first}</div>
              <div className="ah-stat-label">First Visit</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-val">{STATS.last}</div>
              <div className="ah-stat-label">Last Visit</div>
            </div>
          </div>

          <div className="ah-filter-tabs">
            {([
              { key: 'all', label: 'All' },
              { key: 'month', label: 'This Month' },
              { key: 'last', label: 'Last Month' },
              { key: 'custom', label: 'Custom' },
            ] as { key: FilterKey; label: string }[]).map(f => (
              <button
                key={f.key}
                type="button"
                className={'ah-filter-tab' + (filter === f.key ? ' on' : '')}
                onClick={() => setFilterAndToast(f.key)}
              >{f.label}</button>
            ))}
          </div>

          <div className="ah-list">
            {APPTS.map(a => (
              <div
                key={a.id}
                className={'ah-row' + (selectedId === a.id ? ' selected' : '')}
                onClick={() => setSelectedId(a.id)}
              >
                <div className="ah-date">
                  <div className="ah-month">{a.month}</div>
                  <div className="ah-day">{a.day}</div>
                </div>
                <div className="ah-divider"></div>
                <div className="ah-info">
                  <div className="ah-service">{a.service}</div>
                  <div className="ah-barber">{a.barber}</div>
                </div>
                <div className="ah-right">
                  <div className={'ah-amount' + (a.amountDimmed ? ' dim' : '')}>{a.amount}</div>
                  <span className={'ah-status ' + statusClass(a.status)}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ah-detail">
            <div className="ah-d-label">Selected Appointment</div>
            <div className="ah-d-row"><div className="ah-d-key">Date</div><div className="ah-d-val">{selected.date}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Time</div><div className="ah-d-val">{selected.time}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Service</div><div className="ah-d-val">{selected.service}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Amount</div><div className="ah-d-val amber">{selected.amount}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Status</div><div className="ah-d-val">{selected.status}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Payment</div><div className="ah-d-val">{selected.payment}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Barber</div><div className="ah-d-val">{client.barber}</div></div>
            <div className="ah-d-row"><div className="ah-d-key">Location</div><div className="ah-d-val">{selected.location}</div></div>
            <button type="button" className="ah-book-again" onClick={bookAgain}>Book This Appointment Again &rarr;</button>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="ah-toast">{toast}</div>}
    </>
  );
}
