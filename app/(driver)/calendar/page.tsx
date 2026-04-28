'use client';

import { useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

type View = 'month' | 'week';
type SlotType = 'booked' | 'open' | 'blocked' | 'break';

interface CellAppt {
  label: string;
  variant?: 'default' | 'green' | 'blocked';
}

interface CalCell {
  date: string;
  num: number;
  otherMonth?: boolean;
  blocked?: boolean;
  today?: boolean;
  appts?: CellAppt[];
}

interface TimeSlot {
  time: string;
  type: SlotType;
  label: string;
  meta?: string;
}

const CELLS: CalCell[] = [
  { date: 'Jun 28', num: 28, otherMonth: true },
  { date: 'Jun 29', num: 29, otherMonth: true },
  { date: 'Jun 30', num: 30, otherMonth: true },
  { date: 'Jul 1', num: 1 },
  { date: 'Jul 2', num: 2, appts: [{ label: 'Ray · 11am' }] },
  { date: 'Jul 3', num: 3, blocked: true, appts: [{ label: 'Blocked', variant: 'blocked' }] },
  { date: 'Jul 4', num: 4, appts: [{ label: 'Holiday', variant: 'blocked' }] },
  { date: 'Jul 5', num: 5 },
  { date: 'Jul 6', num: 6 },
  { date: 'Jul 7', num: 7, appts: [{ label: 'Todd · 9am' }, { label: 'Ray · 11am', variant: 'green' }] },
  { date: 'Jul 8', num: 8, appts: [{ label: 'Ray · 11am' }] },
  { date: 'Jul 9', num: 9, appts: [{ label: 'Todd · 2pm' }] },
  { date: 'Jul 10', num: 10 },
  { date: 'Jul 11', num: 11, appts: [{ label: 'Ray · 10am' }] },
  { date: 'Jul 12', num: 12 },
  { date: 'Jul 13', num: 13, appts: [{ label: 'Todd · 9am' }] },
  { date: 'Jul 14', num: 14, appts: [{ label: 'Ray · 11am' }] },
  { date: 'Jul 15', num: 15, appts: [{ label: 'Todd · 2pm' }] },
  { date: 'Jul 16', num: 16, today: true, appts: [{ label: 'Ray · 11am' }, { label: 'Todd · 2pm' }] },
  { date: 'Jul 17', num: 17 },
  { date: 'Jul 18', num: 18, appts: [{ label: 'Ray · 10am' }] },
  { date: 'Jul 19', num: 19 },
  { date: 'Jul 20', num: 20, appts: [{ label: 'Todd · 9am' }] },
  { date: 'Jul 21', num: 21, appts: [{ label: 'Ray · 11am' }] },
  { date: 'Jul 22', num: 22 },
  { date: 'Jul 23', num: 23, appts: [{ label: 'Todd · 2pm' }] },
  { date: 'Jul 24', num: 24, blocked: true, appts: [{ label: 'Blocked', variant: 'blocked' }] },
  { date: 'Jul 25', num: 25, appts: [{ label: 'Ray · 10am' }] },
  { date: 'Jul 26', num: 26 },
  { date: 'Jul 27', num: 27 },
  { date: 'Jul 28', num: 28, appts: [{ label: 'Ray · 11am' }] },
  { date: 'Jul 29', num: 29 },
  { date: 'Jul 30', num: 30, appts: [{ label: 'Todd · 9am' }] },
  { date: 'Jul 31', num: 31 },
  { date: 'Aug 1', num: 1, otherMonth: true },
];

const TIME_SLOTS: TimeSlot[] = [
  { time: '8am', type: 'open', label: 'Open' },
  { time: '9am', type: 'open', label: 'Open' },
  { time: '10am', type: 'open', label: 'Open' },
  { time: '11am', type: 'booked', label: 'Rayford Gibson · Adult Haircut', meta: 'RAYF·8834 · $45 · Zelle' },
  { time: '12pm', type: 'break', label: 'Lunch break' },
  { time: '1pm', type: 'open', label: 'Open' },
  { time: '2pm', type: 'booked', label: 'Todd Williams · Fade + Line-up', meta: 'TODD·4401 · $55 · Cash' },
  { time: '3pm', type: 'open', label: 'Open' },
  { time: '4pm', type: 'open', label: 'Open' },
  { time: '5pm', type: 'blocked', label: 'Blocked' },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const barber = { initials: 'JM', name: 'John Merrick', codeId: 'JMR·7749', city: 'South Houston', state: 'TX', codeInitials: 'JMR', codeDigits: '7749' };

function dayLabelFor(date: string): string {
  if (date.startsWith('Jul 16')) return 'Thursday · July 16';
  if (date.startsWith('Jul')) return 'July ' + date.replace('Jul ', '');
  if (date.startsWith('Jun')) return 'June ' + date.replace('Jun ', '');
  if (date.startsWith('Aug')) return 'August ' + date.replace('Aug ', '');
  return date;
}

export default function BarberCalendarPage() {
  const { prefix, highlight } = splitServiceName();

  const [view, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState('Jul 16');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  return (
    <>
      <style>{`
        .cal-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .cal-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .cal-tb-left{display:flex;align-items:center;gap:.85rem;}
        .cal-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .cal-logo span{color:#F5A623;}
        .cal-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .cal-code .city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .cal-code .state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .cal-code .init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .cal-code .digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .cal-tb-right{display:flex;align-items:center;gap:.75rem;}
        .cal-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .cal-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .cal-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .cal-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .cal-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .cal-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .cal-nav:hover{background:rgba(255,255,255,.05);}
        .cal-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .cal-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .cal-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .cal-nav.on .cal-nav-label,.cal-nav:hover .cal-nav-label{color:#fff;}
        .cal-nav.on .cal-nav-label{font-weight:600;}
        .cal-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#F5A623;color:#0a0a2e;}
        .cal-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .cal-main{overflow-y:auto;padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:1.25rem;background:#F7F7F8;}

        .cal-top-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;}
        .cal-page-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#111118;}
        .cal-view-toggle{display:flex;background:rgba(0,0,0,.05);border-radius:1rem;padding:.25rem;}
        .cal-vt-btn{border:none;border-radius:.75rem;padding:.4rem .85rem;font-family:'Syne',sans-serif;font-size:.72rem;font-weight:700;cursor:pointer;background:transparent;color:#5A5A6A;}
        .cal-vt-btn.on{background:#fff;color:#0a0a2e;box-shadow:0 .125rem .5rem rgba(0,0,0,.08);}
        .cal-top-actions{display:flex;gap:.5rem;}
        .cal-btn-block{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.45rem 1rem;font-size:.75rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .cal-btn-block:hover{border-color:#F5A623;color:#D4830A;}
        .cal-btn-today{background:#0a0a2e;border:none;border-radius:1rem;padding:.45rem 1rem;font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;color:#F5A623;cursor:pointer;}

        .cal-wrap{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);overflow:hidden;}
        .cal-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid rgba(0,0,0,.09);}
        .cal-month{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#111118;}
        .cal-nav-row{display:flex;gap:.4rem;}
        .cal-nav-btn{width:2rem;height:2rem;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;font-size:.85rem;font-family:inherit;}
        .cal-nav-btn:hover{border-color:#F5A623;}
        .cal-days-header{display:grid;grid-template-columns:repeat(7,1fr);background:#F7F7F8;border-bottom:1px solid rgba(0,0,0,.09);}
        .cal-day-label{text-align:center;padding:.5rem;font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9A9AAA;}
        .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);}
        .cal-cell{min-height:4.5rem;border-right:1px solid rgba(0,0,0,.09);border-bottom:1px solid rgba(0,0,0,.09);padding:.35rem;cursor:pointer;position:relative;background:#fff;}
        .cal-cell:nth-child(7n){border-right:none;}
        .cal-cell:hover{background:rgba(245,166,35,.08);}
        .cal-cell.today{background:rgba(10,10,46,.04);}
        .cal-cell.selected{background:rgba(245,166,35,.08);border-color:rgba(245,166,35,.25);}
        .cal-cell.other-month{opacity:.35;}
        .cal-cell.blocked{background:rgba(180,40,40,.04);}
        .cell-num{font-family:'Syne',sans-serif;font-size:.78rem;font-weight:800;color:#111118;margin-bottom:.2rem;}
        .cal-cell.today .cell-num{background:#0a0a2e;color:#F5A623;width:1.4rem;height:1.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.68rem;}
        .cal-appt{background:#0a0a2e;color:#F5A623;border-radius:.2rem;padding:.1rem .3rem;font-size:.55rem;font-weight:700;margin-bottom:.15rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .cal-appt.green{background:#3B6D11;color:#fff;}
        .cal-appt.blocked-tag{background:rgba(180,40,40,.15);color:#b42828;}

        .day-detail{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);padding:1.25rem;}
        .dd-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .dd-date{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#111118;}
        .dd-actions{display:flex;gap:.4rem;}
        .dd-btn{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.3rem .75rem;font-size:.68rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .dd-btn:hover{border-color:#F5A623;color:#D4830A;}
        .dd-btn.red{border-color:rgba(180,40,40,.2);color:#b42828;}
        .dd-btn.red:hover{background:rgba(180,40,40,.05);}

        .time-slots{display:flex;flex-direction:column;gap:.4rem;}
        .ts-row{display:flex;gap:.75rem;align-items:stretch;}
        .ts-time{font-size:.65rem;font-weight:600;color:#9A9AAA;min-width:2.5rem;padding-top:.35rem;text-align:right;}
        .ts-block{flex:1;border-radius:.75rem;padding:.5rem .75rem;font-size:.72rem;font-weight:600;cursor:pointer;}
        .ts-block.booked{background:#0a0a2e;color:#F5A623;}
        .ts-block.open{background:#EAF3DE;color:#3B6D11;border:1px solid #97C459;}
        .ts-block.blocked{background:rgba(180,40,40,.07);color:#b42828;border:1px solid rgba(180,40,40,.15);}
        .ts-block.break{background:#F7F7F8;color:#9A9AAA;border:1px dashed rgba(0,0,0,.09);}
        .ts-client{font-size:.62rem;color:rgba(255,255,255,.6);margin-top:.1rem;}

        .legend{display:flex;gap:1rem;flex-wrap:wrap;margin-top:.75rem;padding-top:.75rem;border-top:1px solid rgba(0,0,0,.09);}
        .legend-item{display:flex;align-items:center;gap:.35rem;font-size:.62rem;color:#5A5A6A;}
        .legend-dot{width:.6rem;height:.6rem;border-radius:.15rem;flex-shrink:0;}

        .cal-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="cal-shell">
        <nav className="cal-topbar">
          <div className="cal-tb-left">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="cal-logo">{prefix}<span>{highlight}</span></div>
            </Link>
            <div className="cal-code">
              <div className="city">{barber.city}</div>
              <div className="state">{barber.state}</div>
              <div className="init">{barber.codeInitials}</div>
              <div className="digits">{barber.codeDigits}</div>
            </div>
          </div>
          <div className="cal-tb-right">
            <div className="cal-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="cal-bell-badge"></div>
            </div>
            <div className="cal-tb-avatar">{barber.initials}</div>
          </div>
        </nav>

        <aside className="cal-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{barber.initials}</div>
            <div className="si-name">{barber.name}</div>
            <div className="si-id">{barber.codeId}</div>
          </div>

          <div className="cal-side-section">Main</div>
          <Link href="/dashboard" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="cal-nav-label">Dashboard</span>
          </Link>
          <Link href="/calendar" className="cal-nav on">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="cal-nav-label">Calendar</span>
          </Link>
          <Link href="/clients" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span className="cal-nav-label">Clients</span>
            <span className="cal-nav-badge">14</span>
          </Link>

          <div className="cal-side-section">Business</div>
          <Link href="/payment-log" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span className="cal-nav-label">Payment Log</span>
          </Link>
          <Link href="/share" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <span className="cal-nav-label">Share Code</span>
          </Link>

          <div className="cal-side-section">Account</div>
          <Link href="/public-profile" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="cal-nav-label">Profile</span>
          </Link>
          <button type="button" className="cal-nav" onClick={() => showToast('Opens work history')}>
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="cal-nav-label">Work History</span>
            <span className="cal-nav-badge">312</span>
          </button>
          <Link href="/settings" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="cal-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="cal-nav">
            <span className="cal-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="cal-nav-label">Support</span>
          </Link>

          <div className="cal-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="cal-main">
          <div className="cal-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="cal-page-title">Calendar</div>
              <div className="cal-view-toggle">
                {(['month', 'week'] as View[]).map(v => (
                  <button
                    key={v}
                    type="button"
                    className={'cal-vt-btn' + (view === v ? ' on' : '')}
                    onClick={() => { setView(v); showToast(v[0].toUpperCase() + v.slice(1) + ' view'); }}
                  >{v[0].toUpperCase() + v.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="cal-top-actions">
              <button type="button" className="cal-btn-today" onClick={() => showToast('Jumped to today')}>Today</button>
              <button type="button" className="cal-btn-block" onClick={() => showToast('Opens block time picker')}>Block Time</button>
              <button type="button" className="cal-btn-block" onClick={() => showToast('Opens block day picker')}>Block Day</button>
            </div>
          </div>

          <div className="cal-wrap">
            <div className="cal-header">
              <div className="cal-month">July 2026</div>
              <div className="cal-nav-row">
                <button type="button" className="cal-nav-btn" onClick={() => showToast('Previous month')}>&lsaquo;</button>
                <button type="button" className="cal-nav-btn" onClick={() => showToast('Next month')}>&rsaquo;</button>
              </div>
            </div>
            <div className="cal-days-header">
              {DAY_LABELS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
            </div>
            <div className="cal-grid">
              {CELLS.map(c => {
                const cls = ['cal-cell'];
                if (c.otherMonth) cls.push('other-month');
                if (c.today) cls.push('today');
                if (c.blocked) cls.push('blocked');
                if (selectedDate === c.date) cls.push('selected');
                return (
                  <div
                    key={c.date}
                    className={cls.join(' ')}
                    onClick={() => { setSelectedDate(c.date); showToast('Showing schedule for ' + c.date); }}
                  >
                    <div className="cell-num">{c.num}</div>
                    {c.appts?.map((a, i) => (
                      <div
                        key={i}
                        className={'cal-appt' + (a.variant === 'green' ? ' green' : a.variant === 'blocked' ? ' blocked-tag' : '')}
                      >{a.label}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="day-detail">
            <div className="dd-header">
              <div className="dd-date">{dayLabelFor(selectedDate)}</div>
              <div className="dd-actions">
                <button type="button" className="dd-btn" onClick={() => showToast('Block this day')}>Block Day</button>
                <button type="button" className="dd-btn red" onClick={() => showToast('Opens block time range picker')}>Block Hours</button>
              </div>
            </div>

            <div className="time-slots">
              {TIME_SLOTS.map(slot => (
                <div key={slot.time} className="ts-row">
                  <div className="ts-time">{slot.time}</div>
                  <div className={'ts-block ' + slot.type}>
                    {slot.label}
                    {slot.meta && <div className="ts-client">{slot.meta}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="legend">
              <div className="legend-item"><div className="legend-dot" style={{ background: '#0a0a2e' }}></div>Booked</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#3B6D11' }}></div>Open</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#b42828' }}></div>Blocked</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#F7F7F8', border: '1px dashed rgba(0,0,0,0.09)' }}></div>Break</div>
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="cal-toast">{toast}</div>}
    </>
  );
}
