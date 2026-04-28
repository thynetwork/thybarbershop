'use client';

import { useState } from 'react';
import { splitServiceName, config } from '@/lib/config';
import DriverSidebar from '@/components/DriverSidebar';

/* ── Demo calendar data ──────────────────────────────────────── */
type DayStatus = 'open' | 'confirmed' | 'pending' | 'completed' | 'blocked';

interface CalDay {
  day: number;
  status: DayStatus;
}

const DAYS: CalDay[] = Array.from({ length: 28 }, (_, i) => {
  const d = i + 1;
  const confirmed = [5, 12, 17, 25];
  const pending = [19];
  const completed = [4, 10];
  const blocked = [7, 8, 14, 15, 21, 22, 28];
  let status: DayStatus = 'open';
  if (confirmed.includes(d)) status = 'confirmed';
  else if (pending.includes(d)) status = 'pending';
  else if (completed.includes(d)) status = 'completed';
  else if (blocked.includes(d)) status = 'blocked';
  return { day: d, status };
});

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const UPCOMING = [
  { id: 'u1', riderId: 'SARA\u00B78834', name: 'Sarah W.', initials: 'SW', date: 'Sat Jul 5', time: '9:00 am', route: 'Fade + Lineup', amount: '$50' },
  { id: 'u2', riderId: 'MARC\u00B75521', name: 'Marcus J.', initials: 'MJ', date: 'Sat Jul 12', time: '7:30 am', route: 'Full Service', amount: '$95' },
  { id: 'u3', riderId: 'LISA\u00B73310', name: 'Lisa M.', initials: 'LM', date: 'Thu Jul 17', time: '3:00 pm', route: 'Beard Trim', amount: '$45' },
  { id: 'u4', riderId: 'TODD\u00B74401', name: 'Todd W.', initials: 'TW', date: 'Fri Jul 25', time: '11:00 am', route: 'Cut + Shave', amount: '$120' },
];

const STATUS_STYLES: Record<DayStatus, React.CSSProperties> = {
  open: { background: 'var(--surface)', color: 'var(--text-1)' },
  confirmed: { background: 'var(--navy)', color: 'var(--amber)', fontWeight: 700 },
  pending: { background: 'var(--amber-pale)', color: 'var(--amber-dim)', fontWeight: 600 },
  completed: { background: 'var(--green-pale)', color: 'var(--green)', fontWeight: 600 },
  blocked: { background: 'var(--surface-2)', color: 'var(--text-3)' },
};

const LEGEND: { label: string; color: string; bg: string }[] = [
  { label: 'Confirmed', color: 'var(--amber)', bg: 'var(--navy)' },
  { label: 'Pending', color: 'var(--amber-dim)', bg: 'var(--amber-pale)' },
  { label: 'Completed', color: 'var(--green)', bg: 'var(--green-pale)' },
  { label: 'Cancelled', color: 'var(--red)', bg: 'var(--red-pale)' },
  { label: 'Blocked', color: 'var(--text-3)', bg: 'var(--surface-2)' },
];

export default function CalendarPage() {
  const { prefix, highlight } = splitServiceName();
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedDay, setSelectedDay] = useState<number | null>(5);

  const selectedDayData = DAYS.find(d => d.day === selectedDay);
  const selectedUpcoming = UPCOMING.find(u => selectedDay && u.date.includes(String(selectedDay)));

  return (
    <div className="app-shell">
      {/* Topbar */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="driver-code">
            <div className="dc-airport">South Houston</div>
            <div className="dc-initials">MRC</div>
            <div className="dc-digits">3341</div>
          </div>
          <div className="topbar-avatar">MR</div>
        </div>
      </div>

      <div className="layout-3col">
        {/* Sidebar */}
        <DriverSidebar activeItem="Calendar" pendingCount={3} />

        {/* Main content */}
        <div className="main-content">
          {/* Month header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => {}}>&#8592;</button>
              <h2 className="t-title">July 2026</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => {}}>&#8594;</button>
            </div>
            <div className="seg-control">
              {(['Month', 'Week', 'Day'] as const).map(m => (
                <button key={m} className={`seg-opt${viewMode === m ? ' on' : ''}`} onClick={() => setViewMode(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          <div className="cal-grid" style={{ marginBottom: 24 }}>
            {DAY_LABELS.map(l => (
              <div key={l} className="cal-day-label">{l}</div>
            ))}
            {/* Offset: July 2026 starts on Wednesday (index 2) */}
            {[0, 1].map(i => (
              <div key={`blank-${i}`} style={{ padding: '8px 4px' }} />
            ))}
            {DAYS.map(d => (
              <div
                key={d.day}
                className="cal-day"
                style={{
                  ...STATUS_STYLES[d.status],
                  border: selectedDay === d.day ? '2px solid var(--navy)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedDay(d.day)}
              >
                {d.day}
              </div>
            ))}
          </div>

          {/* Upcoming confirmed */}
          <div style={{ marginBottom: 8 }}>
            <div className="t-label mb-12">Upcoming confirmed</div>
            {UPCOMING.map(u => (
              <div key={u.id} className="li">
                <div className="avatar av-sm av-amber">{u.initials}</div>
                <div className="li-info">
                  <div className="li-name">{u.name} <span className="rider-id">{u.riderId}</span></div>
                  <div className="li-sub">{u.date} &middot; {u.time} &middot; {u.route}</div>
                </div>
                <div className="li-right">
                  <div className="li-val">{u.amount}</div>
                  <div className="li-tag"><span className="badge badge-green">Confirmed</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {/* Selected day detail */}
          {selectedDay && selectedDayData ? (
            <div className="card mb-16">
              <div className="t-label mb-8">Selected day</div>
              <div className="t-title mb-4">July {selectedDay}, 2026</div>
              <div style={{ marginBottom: 12 }}>
                <span
                  className="badge"
                  style={{
                    background: STATUS_STYLES[selectedDayData.status].background,
                    color: STATUS_STYLES[selectedDayData.status].color,
                  }}
                >
                  {selectedDayData.status.charAt(0).toUpperCase() + selectedDayData.status.slice(1)}
                </span>
              </div>
              {selectedUpcoming && (
                <div className="card-surface" style={{ marginBottom: 12 }}>
                  <div className="li-name">{selectedUpcoming.name}</div>
                  <div className="li-sub">{selectedUpcoming.time} &middot; {selectedUpcoming.route}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginTop: 8 }}>
                    {selectedUpcoming.amount}
                  </div>
                </div>
              )}
              {selectedDayData.status === 'open' && (
                <button className="btn btn-primary btn-full btn-sm">Block this day</button>
              )}
              {selectedDayData.status === 'blocked' && (
                <button className="btn btn-ghost btn-full btn-sm">Unblock this day</button>
              )}
            </div>
          ) : (
            <div className="card mb-16">
              <div className="t-label mb-8">Selected day</div>
              <div className="t-small">Click a day to see details</div>
            </div>
          )}

          {/* Block time */}
          <div className="card mb-16">
            <div className="t-label mb-8">Quick actions</div>
            <div className="gap-8">
              <button className="btn btn-primary btn-full btn-sm">Block selected day</button>
              <button className="btn btn-ghost btn-full btn-sm">Block entire week</button>
              <button className="btn btn-ghost btn-full btn-sm">Block weekends (Jul)</button>
            </div>
          </div>

          {/* Legend */}
          <div className="card-surface">
            <div className="t-label mb-12">Legend</div>
            <div className="gap-8">
              {LEGEND.map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: l.bg, border: '1px solid var(--border)',
                  }} />
                  <span style={{ fontSize: 12, color: l.color, fontWeight: 500 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
