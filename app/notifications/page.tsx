'use client';

import { useState } from 'react';
import { splitServiceName, config } from '@/lib/config';

/* ── Demo data ──────────────────────────────────────────────── */
type NotifCategory = 'booking' | 'client' | 'admin';

interface Notification {
  id: string;
  category: NotifCategory;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'this_week';
}

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', category: 'booking', icon: '\uD83D\uDCC5', iconBg: 'var(--blue-pale)', iconColor: 'var(--blue)', title: 'New booking request', subtitle: 'Sarah W. wants to book Fade + Lineup on Jul 17', timeAgo: '12 min ago', read: false, group: 'today' },
  { id: 'n2', category: 'client', icon: '\uD83D\uDC64', iconBg: 'var(--amber-pale)', iconColor: 'var(--amber-dim)', title: 'New client request', subtitle: 'Todd W. found you via Find a Barber', timeAgo: '45 min ago', read: false, group: 'today' },
  { id: 'n3', category: 'booking', icon: '\u2705', iconBg: 'var(--green-pale)', iconColor: 'var(--green)', title: 'Payment received', subtitle: 'Marcus J. paid $95 via Cash App for Jul 12 trip', timeAgo: '2 hr ago', read: false, group: 'today' },
  { id: 'n4', category: 'admin', icon: '\uD83D\uDD14', iconBg: 'var(--purple-pale)', iconColor: 'var(--purple)', title: 'Subscription renewed', subtitle: 'Your $9.99/week subscription has been renewed', timeAgo: '5 hr ago', read: true, group: 'today' },
  { id: 'n5', category: 'booking', icon: '\uD83D\uDCC5', iconBg: 'var(--blue-pale)', iconColor: 'var(--blue)', title: 'Booking confirmed', subtitle: 'Lisa M. confirmed Beard Trim on Jul 18', timeAgo: '1 day ago', read: true, group: 'yesterday' },
  { id: 'n6', category: 'client', icon: '\uD83D\uDC65', iconBg: 'var(--amber-pale)', iconColor: 'var(--amber-dim)', title: 'Client completed safety protocol', subtitle: 'Sarah W. has completed the safety protocol', timeAgo: '1 day ago', read: true, group: 'yesterday' },
  { id: 'n7', category: 'booking', icon: '\u274C', iconBg: 'var(--red-pale)', iconColor: 'var(--red)', title: 'Booking cancelled', subtitle: 'Marcus J. cancelled his Jun 9 booking', timeAgo: '1 day ago', read: true, group: 'yesterday' },
  { id: 'n8', category: 'admin', icon: '\uD83D\uDCE2', iconBg: 'var(--surface)', iconColor: 'var(--text-2)', title: 'New feature: Payment log', subtitle: 'Track all your payments in one place. Check it out!', timeAgo: '3 days ago', read: true, group: 'this_week' },
  { id: 'n9', category: 'client', icon: '\u2B50', iconBg: 'var(--amber-pale)', iconColor: 'var(--amber-dim)', title: 'New review from Lisa M.', subtitle: '"Great driver, always on time. Highly recommend!"', timeAgo: '4 days ago', read: true, group: 'this_week' },
  { id: 'n10', category: 'booking', icon: '\uD83D\uDCC5', iconBg: 'var(--blue-pale)', iconColor: 'var(--blue)', title: 'Booking completed', subtitle: 'Appointment with Todd W. Cut + Shave completed successfully', timeAgo: '5 days ago', read: true, group: 'this_week' },
];

const GROUP_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  this_week: 'This week',
};

export default function NotificationsPage() {
  const { prefix, highlight } = splitServiceName();
  const [filter, setFilter] = useState('all');
  const filters = ['All', 'Bookings', 'Clients', 'Admin'];
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'bookings') return n.category === 'booking';
    if (filter === 'clients') return n.category === 'client';
    if (filter === 'admin') return n.category === 'admin';
    return true;
  });

  const groups = ['today', 'yesterday', 'this_week'].filter(g =>
    filtered.some(n => n.group === g)
  );

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unreadByCategory = {
    bookings: notifs.filter(n => !n.read && n.category === 'booking').length,
    clients: notifs.filter(n => !n.read && n.category === 'client').length,
    admin: notifs.filter(n => !n.read && n.category === 'admin').length,
  };

  return (
    <div className="app-shell">
      {/* Topbar */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          {/* Bell icon with badge */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>&#128276;</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -6,
                background: 'var(--red)', color: 'white',
                borderRadius: 'var(--r-full)', padding: '1px 6px',
                fontSize: 10, fontWeight: 700, lineHeight: '14px',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div className="driver-code">
            <div className="dc-airport">South Houston</div>
            <div className="dc-initials">MRC</div>
            <div className="dc-digits">3341</div>
          </div>
          <div className="topbar-avatar">MR</div>
        </div>
      </div>

      <div className="layout-2col" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Main content */}
        <div className="main-content">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="t-title">Notifications</h2>
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
          </div>

          {/* Seg control */}
          <div className="seg-control mb-20">
            {filters.map(f => (
              <button
                key={f}
                className={`seg-opt${filter === f.toLowerCase() || (filter === 'all' && f === 'All') ? ' on' : ''}`}
                onClick={() => setFilter(f.toLowerCase())}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grouped notifications */}
          {groups.map(g => (
            <div key={g} style={{ marginBottom: 24 }}>
              <div className="t-label mb-12">{GROUP_LABELS[g]}</div>
              {filtered
                .filter(n => n.group === g)
                .map(n => (
                  <div
                    key={n.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '14px 16px', marginBottom: 2,
                      borderRadius: 'var(--r-md)',
                      background: n.read ? 'var(--surface)' : 'var(--white)',
                      borderLeft: n.read ? '3px solid transparent' : '3px solid var(--navy)',
                      border: n.read ? '1px solid var(--border)' : '1px solid var(--border)',
                      borderLeftWidth: 3,
                      borderLeftColor: n.read ? 'transparent' : 'var(--navy)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Icon circle */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: n.iconBg, color: n.iconColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {n.icon}
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: n.read ? 500 : 600,
                        color: 'var(--text-1)', marginBottom: 2,
                      }}>
                        {n.title}
                        {!n.read && (
                          <span style={{
                            display: 'inline-block', width: 6, height: 6,
                            borderRadius: '50%', background: 'var(--navy)',
                            marginLeft: 6, verticalAlign: 'middle',
                          }} />
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>
                        {n.subtitle}
                      </div>
                    </div>
                    {/* Time ago */}
                    <div style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {n.timeAgo}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {/* Unread summary */}
          <div className="card mb-16">
            <div className="t-label mb-12">Unread summary</div>
            <div className="pref-row">
              <span className="pref-label">Bookings</span>
              <span className="pref-value">
                {unreadByCategory.bookings > 0 ? (
                  <span className="badge badge-blue">{unreadByCategory.bookings} new</span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>0</span>
                )}
              </span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Clients</span>
              <span className="pref-value">
                {unreadByCategory.clients > 0 ? (
                  <span className="badge badge-amber">{unreadByCategory.clients} new</span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>0</span>
                )}
              </span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Admin</span>
              <span className="pref-value">
                {unreadByCategory.admin > 0 ? (
                  <span className="badge badge-purple">{unreadByCategory.admin} new</span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>0</span>
                )}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="t-label mb-12">Quick actions</div>
            <div className="gap-8">
              <button className="btn btn-primary btn-full btn-sm">View pending requests</button>
              <button className="btn btn-ghost btn-full btn-sm">Go to calendar</button>
              <button className="btn btn-ghost btn-full btn-sm">Payment log</button>
              <button className="btn btn-ghost btn-full btn-sm" onClick={markAllRead}>
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
