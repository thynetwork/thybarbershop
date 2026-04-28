'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

/* ── Demo schedule data ───────────────────────── */
const DAYS = [
  { label: 'Mon Jul 21', short: 'Mon' },
  { label: 'Tue Jul 22', short: 'Tue' },
  { label: 'Wed Jul 23', short: 'Wed' },
  { label: 'Thu Jul 24', short: 'Thu' },
  { label: 'Fri Jul 25', short: 'Fri' },
];

const TIME_SLOTS = [
  '10:00 - 10:30am', '10:30 - 11:00am',
  '11:00 - 11:30am', '11:30 - 12:00pm',
  '1:00 - 1:30pm', '1:30 - 2:00pm',
  '2:00 - 2:30pm', '2:30 - 3:00pm',
];

function SupportOption({
  icon, title, sub, color, borderColor, onClick,
}: {
  icon: string; title: string; sub: string; color: string; borderColor?: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'var(--white)', border: `1px solid ${borderColor || 'var(--border)'}`,
        borderRadius: 'var(--r-lg)', padding: '14px 16px',
        cursor: 'pointer', transition: 'box-shadow 0.15s', marginBottom: 8,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: color === 'green' ? 'var(--green-pale)' : color === 'blue' ? 'var(--blue-pale)' : color === 'purple' ? 'var(--purple-pale)' : 'var(--red-pale)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 16, color: 'var(--text-3)' }}>&rsaquo;</div>
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [selectedDay, setSelectedDay] = useState('Mon Jul 21');
  const [selectedTime, setSelectedTime] = useState('10:00 - 10:30am');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="app-shell">
      {/* ── App topbar ─────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
            borderRadius: 'var(--r-full)', padding: '4px 12px',
            fontSize: 11, color: 'var(--amber)', fontWeight: 600,
          }}>MRC&middot;3341</div>
          <div className="topbar-avatar">MR</div>
        </div>
      </div>

      {/* ── 2-column: main + right panel ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 624 }}>

        {/* ── Main content ────────────────────────────────── */}
        <div className="main-content" style={{ padding: '28px 40px' }}>
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 20 }}
          >
            &larr; Back
          </button>

          <div className="t-display" style={{ marginBottom: 6 }}>How can we help?</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>
            {config.serviceName} Admin &middot; Houston, TX
          </div>

          {/* ═══ YOUR DRIVER ═════════════════════════════════ */}
          <div className="t-label mb-8">YOUR DRIVER</div>
          <SupportOption icon="&#128222;" title="Call barber" sub="Ring Marcus Rivera directly" color="green" />
          <SupportOption icon="&#128172;" title="Text barber" sub="Send a message to Marcus" color="green" />

          <div style={{ height: 20 }} />

          {/* ═══ THYDRIVER ADMIN ══════════════════════════════ */}
          <div className="t-label mb-8">{config.serviceName.toUpperCase()} ADMIN</div>
          <SupportOption icon="&#128222;" title={`Call ${config.serviceName}`} sub="Mon-Fri 9am-6pm CST" color="blue" />
          <SupportOption icon="&#128197;" title="Schedule a call" sub="Pick a day and time" color="blue" />
          <SupportOption icon="&#9993;" title="Send a message" sub="We respond within 2 business hours" color="purple" />
          <SupportOption
            icon="&#9888;"
            title="Emergency"
            sub="Call 911 first"
            color="red"
            borderColor="rgba(163,45,45,0.3)"
          />

          {/* Business hours card */}
          <div className="card-surface" style={{ marginTop: 24, textAlign: 'center', padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>Business Hours</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Monday - Friday, 9:00am - 6:00pm CST</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Closed on federal holidays</div>
          </div>
        </div>

        {/* ── Right panel: Schedule a call ─────────────────── */}
        <div className="right-panel">
          <div className="t-subtitle" style={{ marginBottom: 16 }}>Schedule a call</div>

          {/* Day selection (radio group) */}
          <div className="t-label mb-8">SELECT A DAY</div>
          <div className="radio-group" style={{ marginBottom: 16 }}>
            {DAYS.map((day) => (
              <div
                key={day.label}
                className={`radio-opt${selectedDay === day.label ? ' on' : ''}`}
                onClick={() => setSelectedDay(day.label)}
              >
                <div className="radio-dot">
                  {selectedDay === day.label && <div className="radio-dot-inner" />}
                </div>
                <span style={{ fontSize: 13 }}>{day.label}</span>
              </div>
            ))}
          </div>

          {/* Time slot grid */}
          <div className="t-label mb-8">SELECT A TIME</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                className={`time-slot ${selectedTime === slot ? 'ts-sel' : 'ts-open'}`}
                onClick={() => setSelectedTime(slot)}
                style={{ textAlign: 'center' }}
              >
                {slot}
              </button>
            ))}
          </div>

          {/* Phone input */}
          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input
              className="form-input"
              placeholder="(713) 555-0121"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Note textarea */}
          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <textarea
              className="form-input"
              placeholder="What do you need help with?"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Schedule button */}
          <button className="btn btn-primary btn-full" style={{ marginTop: 4 }}>
            Schedule call
          </button>
        </div>
      </div>
    </div>
  );
}
