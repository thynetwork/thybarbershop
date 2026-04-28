'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type Category = 'booking' | 'connection' | 'payment' | 'alert';
type UnreadColor = '' | 'amber' | 'green' | 'red';
type FilterKey = 'all' | 'bookings' | 'connections' | 'payments' | 'alerts';

interface Notif {
  id: string;
  category: Category;
  unreadColor: UnreadColor;
  iconClass: string;
  iconStroke: string;
  iconPath: 'check' | 'clock' | 'people' | 'star' | 'dollar' | 'calendar';
  title: string;
  message: string;
  time: string;
  date: string;
  action?: { label: string; href: string; primary?: boolean };
}

const NOTIFS: Notif[] = [
  {
    id: 'n1', category: 'booking', unreadColor: 'green',
    iconClass: 'ni-confirm', iconStroke: '#3B6D11', iconPath: 'check',
    title: 'Appointment confirmed — John Merrick',
    message: 'Your Adult Haircut for today at 11:00 am at The Studio is confirmed. See you soon.',
    time: '9:14 am', date: 'Today — Thursday, July 17',
    action: { label: 'View', href: '/book/confirmed', primary: true },
  },
  {
    id: 'n2', category: 'booking', unreadColor: 'amber',
    iconClass: 'ni-reminder', iconStroke: '#D4830A', iconPath: 'clock',
    title: 'Your cut is in 2 hours',
    message: 'John Merrick · Adult Haircut · 11:00 am · The Studio · 4521 Main St, South Houston.',
    time: '9:00 am', date: 'Today — Thursday, July 17',
  },
  {
    id: 'n3', category: 'connection', unreadColor: 'green',
    iconClass: 'ni-connect', iconStroke: '#3B6D11', iconPath: 'people',
    title: 'John Merrick accepted your connection',
    message: 'You are now connected. You can book directly without going through the pool.',
    time: '2:31 pm', date: 'Wednesday, July 16',
    action: { label: 'View Profile', href: '/public-profile?barber=john-m' },
  },
  {
    id: 'n4', category: 'alert', unreadColor: 'amber',
    iconClass: 'ni-rating', iconStroke: '#D4830A', iconPath: 'star',
    title: 'How was your cut with John?',
    message: 'You visited The Studio on Jul 10. Take 5 seconds to rate your experience.',
    time: '8:00 am', date: 'Wednesday, July 16',
    action: { label: 'Rate Now', href: '/trip-review', primary: true },
  },
  {
    id: 'n5', category: 'payment', unreadColor: '',
    iconClass: 'ni-payment', iconStroke: '#3B6D11', iconPath: 'dollar',
    title: 'Reminder — pay John after your appointment',
    message: 'Adult Haircut tomorrow at 11am · $45 · John accepts Zelle (713) 555-0182 or Cash.',
    time: '6:00 pm', date: 'Tuesday, July 15',
  },
  {
    id: 'n6', category: 'booking', unreadColor: '',
    iconClass: 'ni-booking', iconStroke: '#D4830A', iconPath: 'calendar',
    title: 'Booking request sent — Jul 17 · 11:00 am',
    message: "Waiting for John to confirm. You'll get a notification as soon as he does.",
    time: '11:22 am', date: 'Tuesday, July 15',
  },
  {
    id: 'n7', category: 'alert', unreadColor: '',
    iconClass: 'ni-rating', iconStroke: '#D4830A', iconPath: 'star',
    title: 'Your rating was submitted — 5 stars',
    message: 'Your anonymous review of John Merrick has been recorded. Thank you for keeping the community honest.',
    time: '3:45 pm', date: 'Monday, July 14',
  },
];

const FILTERS: { key: FilterKey; label: string; cats?: Category[] }[] = [
  { key: 'all', label: 'All' },
  { key: 'bookings', label: 'Bookings', cats: ['booking'] },
  { key: 'connections', label: 'Connections', cats: ['connection'] },
  { key: 'payments', label: 'Payments', cats: ['payment'] },
  { key: 'alerts', label: 'Alerts', cats: ['alert'] },
];

const client = { initials: 'RG', name: 'Rayford Gibson', clientId: 'RAYF·8834' };

function IconSvg({ kind, stroke }: { kind: Notif['iconPath']; stroke: string }) {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 2 };
  switch (kind) {
    case 'check':
      return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'clock':
      return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'people':
      return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'star':
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'dollar':
      return <svg {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case 'calendar':
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  }
}

export default function NotificationsPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [rows, setRows] = useState<Notif[]>(NOTIFS);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function markRead(id: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, unreadColor: '' as UnreadColor } : r));
  }

  function markAllRead() {
    setRows(prev => prev.map(r => ({ ...r, unreadColor: '' as UnreadColor })));
    showToast('All notifications marked as read');
  }

  const visible = useMemo(() => {
    const f = FILTERS.find(x => x.key === filter);
    if (!f || !f.cats) return rows;
    return rows.filter(r => f.cats!.includes(r.category));
  }, [filter, rows]);

  const unreadCount = rows.filter(r => r.unreadColor !== '').length;

  const grouped = useMemo(() => {
    const map = new Map<string, Notif[]>();
    visible.forEach(n => {
      const arr = map.get(n.date) ?? [];
      arr.push(n);
      map.set(n.date, arr);
    });
    return Array.from(map.entries());
  }, [visible]);

  return (
    <>
      <style>{`
        .nc-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .nc-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .nc-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .nc-logo span{color:#F5A623;}
        .nc-tb-right{display:flex;align-items:center;gap:.75rem;}
        .nc-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .nc-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .nc-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .nc-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .nc-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .nc-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .nc-nav:hover{background:rgba(255,255,255,.05);}
        .nc-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .nc-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .nc-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .nc-nav.on .nc-nav-label,.nc-nav:hover .nc-nav-label{color:#fff;}
        .nc-nav.on .nc-nav-label{font-weight:600;}
        .nc-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#e53e3e;color:#fff;}
        .nc-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .nc-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}

        .nc-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.5rem;}
        .nc-page-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#111118;}
        .nc-mark-all{border:none;background:none;font-size:.75rem;font-weight:600;color:#D4830A;cursor:pointer;font-family:inherit;}
        .nc-mark-all:hover{color:#F5A623;}

        .nc-filter-tabs{display:flex;gap:.4rem;margin-bottom:1.25rem;flex-wrap:wrap;}
        .nc-filter-tab{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.3rem .85rem;font-size:.72rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;display:flex;align-items:center;gap:.4rem;font-family:inherit;}
        .nc-filter-tab.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .nc-filter-tab:hover:not(.on){border-color:rgba(245,166,35,.25);}
        .nc-ft-count{background:#e53e3e;color:#fff;border-radius:9999px;font-size:.55rem;font-weight:800;padding:.05rem .4rem;}
        .nc-filter-tab.on .nc-ft-count{background:#F5A623;color:#0a0a2e;}

        .nc-list{display:flex;flex-direction:column;gap:0;}

        .nc-row{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1rem 1.1rem;display:flex;align-items:flex-start;gap:.85rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:.5rem;}
        .nc-row:hover{border-color:rgba(245,166,35,.25);}
        .nc-row.unread-amber{border-left:3px solid #F5A623;background:rgba(245,166,35,.08);}
        .nc-row.unread-green{border-left:3px solid #3B6D11;background:#EAF3DE;}
        .nc-row.unread-red{border-left:3px solid #e53e3e;background:rgba(229,62,62,.04);}

        .nc-icon{width:2.4rem;height:2.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .ni-booking{background:rgba(245,166,35,.08);}
        .ni-confirm{background:#EAF3DE;}
        .ni-connect{background:rgba(10,10,46,.07);}
        .ni-payment{background:#EAF3DE;}
        .ni-reminder{background:rgba(245,166,35,.08);}
        .ni-rating{background:rgba(245,166,35,.08);}

        .nc-body{flex:1;min-width:0;}
        .nc-title{font-size:.85rem;font-weight:600;color:#111118;margin-bottom:.15rem;}
        .nc-row.unread-amber .nc-title,.nc-row.unread-green .nc-title,.nc-row.unread-red .nc-title{font-weight:700;}
        .nc-msg{font-size:.72rem;color:#5A5A6A;line-height:1.5;}
        .nc-time{font-size:.62rem;color:#9A9AAA;margin-top:.3rem;}

        .nc-right{flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:.4rem;}
        .nc-dot{width:.55rem;height:.55rem;border-radius:50%;background:#F5A623;}
        .nc-dot.green{background:#3B6D11;}
        .nc-dot.red{background:#e53e3e;}
        .nc-action{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.25rem .7rem;font-size:.65rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;white-space:nowrap;}
        .nc-action:hover{border-color:#F5A623;color:#D4830A;}
        .nc-action.primary{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .nc-date-divider{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9A9AAA;margin:1rem 0 .5rem;padding-left:.25rem;}

        .nc-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="nc-shell">
        <nav className="nc-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="nc-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="nc-tb-right">
            <div className="nc-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="nc-bell-badge"></div>
            </div>
            <div className="nc-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="nc-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>

          <div className="nc-side-section">Booking</div>
          <Link href="/home" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="nc-nav-label">Home</span>
          </Link>
          <Link href="/find-a-barber" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <span className="nc-nav-label">Find a {config.providerLabel}</span>
          </Link>
          <Link href="/notifications" className="nc-nav on">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="nc-nav-label">Notifications</span>
            {unreadCount > 0 && <span className="nc-nav-badge">{unreadCount}</span>}
          </Link>

          <div className="nc-side-section">Account</div>
          <Link href="/profile" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="nc-nav-label">My Profile</span>
          </Link>
          <Link href="/household" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
            <span className="nc-nav-label">Household</span>
          </Link>
          <Link href="/history" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="nc-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="nc-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="nc-nav">
            <span className="nc-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="nc-nav-label">Support</span>
          </Link>

          <div className="nc-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="nc-main">
          <div className="nc-top-row">
            <div className="nc-page-title">Notifications</div>
            <button type="button" className="nc-mark-all" onClick={markAllRead}>Mark all as read</button>
          </div>

          <div className="nc-filter-tabs">
            {FILTERS.map(f => {
              const count = f.key === 'all'
                ? unreadCount
                : rows.filter(r => r.unreadColor !== '' && f.cats?.includes(r.category)).length;
              return (
                <button
                  key={f.key}
                  type="button"
                  className={'nc-filter-tab' + (filter === f.key ? ' on' : '')}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  {count > 0 && <span className="nc-ft-count">{count}</span>}
                </button>
              );
            })}
          </div>

          <div className="nc-list">
            {grouped.map(([date, items]) => (
              <div key={date}>
                <div className="nc-date-divider">{date}</div>
                {items.map(n => {
                  const unreadCls = n.unreadColor ? ' unread-' + n.unreadColor : '';
                  return (
                    <div
                      key={n.id}
                      className={'nc-row' + unreadCls}
                      onClick={() => markRead(n.id)}
                    >
                      <div className={'nc-icon ' + n.iconClass}>
                        <IconSvg kind={n.iconPath} stroke={n.iconStroke} />
                      </div>
                      <div className="nc-body">
                        <div className="nc-title">{n.title}</div>
                        <div className="nc-msg">{n.message}</div>
                        <div className="nc-time">{n.time}</div>
                      </div>
                      <div className="nc-right">
                        {n.unreadColor && (
                          <div className={'nc-dot' + (n.unreadColor === 'green' ? ' green' : n.unreadColor === 'red' ? ' red' : '')}></div>
                        )}
                        {n.action && (
                          <button
                            type="button"
                            className={'nc-action' + (n.action.primary ? ' primary' : '')}
                            onClick={(e) => { e.stopPropagation(); markRead(n.id); router.push(n.action!.href); }}
                          >{n.action.label}</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="nc-toast">{toast}</div>}
    </>
  );
}
