'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

/* ── Demo data ─────────────────────────────────────────────── */
const demoDriver = {
  name: 'James Rivera',
  code: 'JDR\u00B74207',
  initials: 'JR',
  city: 'Houston, TX',
  airportPermitted: true,
  safetyComplete: true,
  rateHourly: 35,
  flatLocal: 25,
  flatLocalLabel: '\u226410 miles',
  insuranceProvider: 'Allstate',
  insuranceCoverage: 'Rideshare coverage',
  vehicleMakeModel: '2022 Toyota Camry XSE',
  vehicleColor: 'Silver',
  vehicleSeats: 3,
  seatbeltsConfirmed: true,
  availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  availabilityHours: '7:00 am \u2013 10:00 pm',
};

const demoUser = { name: 'Sarah Chen', initials: 'SC' };

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CALENDAR_DAYS = [
  { n: 1, state: 'off' },
  { n: 2, state: 'open' }, { n: 3, state: 'open' }, { n: 4, state: 'open' },
  { n: 5, state: 'open' }, { n: 6, state: 'open' }, { n: 7, state: 'blocked' },
  { n: 8, state: 'blocked' }, { n: 9, state: 'open' }, { n: 10, state: 'open' },
  { n: 11, state: 'open' }, { n: 12, state: 'open' }, { n: 13, state: 'open' },
  { n: 14, state: 'blocked' }, { n: 15, state: 'blocked' }, { n: 16, state: 'open' },
  { n: 17, state: 'open' }, { n: 18, state: 'open' }, { n: 19, state: 'open' },
  { n: 20, state: 'open' }, { n: 21, state: 'blocked' }, { n: 22, state: 'blocked' },
  { n: 23, state: 'open' }, { n: 24, state: 'open' }, { n: 25, state: 'open' },
  { n: 26, state: 'open' }, { n: 27, state: 'open' }, { n: 28, state: 'blocked' },
];

const TIME_SLOTS = [
  { label: '7:00 am', state: 'taken' },
  { label: '8:00 am', state: 'open' },
  { label: '9:00 am', state: 'open' },
  { label: '10:00 am', state: 'open' },
  { label: '11:00 am', state: 'open' },
  { label: '12:00 pm', state: 'taken' },
  { label: '1:00 pm', state: 'open' },
  { label: '2:00 pm', state: 'open' },
];

export default function DriverCardPage() {
  const router = useRouter();
  const params = useParams();
  const { prefix, highlight } = splitServiceName();

  const [selectedDate, setSelectedDate] = useState(17);
  const [selectedTime, setSelectedTime] = useState('9:00 am');
  const [calendarMode, setCalendarMode] = useState<'calendar' | 'manual'>('calendar');

  function handleDateClick(day: { n: number; state: string }) {
    if (day.state === 'open' || day.state === 'sel') {
      setSelectedDate(day.n);
    }
  }

  function handleTimeClick(slot: { label: string; state: string }) {
    if (slot.state !== 'taken') {
      setSelectedTime(slot.label);
    }
  }

  return (
    <div className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div className="app-topbar">
        <button
          onClick={() => router.push('/home')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 22,
            cursor: 'pointer',
            padding: '4px 8px',
            marginRight: 4,
            lineHeight: 1,
          }}
          aria-label="Back to home"
        >
          &larr;
        </button>
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-name">{demoUser.name}</div>
          <div className="topbar-avatar">{demoUser.initials}</div>
        </div>
      </div>

      <div className="layout-2col">
        {/* ── Sidebar: Driver info ─────────────────────────── */}
        <div className="sidebar">
          {/* Progress bar (step 2 active) */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step active" />
            <div className="progress-step" />
          </div>

          {/* Driver identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="avatar av-amber av-lg av-check">{demoDriver.initials}</div>
            <div>
              <div className="t-subtitle">{demoDriver.name}</div>
              <div className="t-small" style={{ marginTop: 2 }}>
                {demoDriver.code} &middot; {demoDriver.city}
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                {demoDriver.airportPermitted && (
                  <span className="badge badge-blue">&#9992; Airport</span>
                )}
                {demoDriver.safetyComplete && (
                  <span className="badge badge-green">&#10003; Safety</span>
                )}
              </div>
            </div>
          </div>

          {/* Insurance strip */}
          <div className="ins-strip">
            <div className="ins-dot" />
            <div className="ins-text">
              Insured by {demoDriver.insuranceProvider} &middot; {demoDriver.insuranceCoverage}
            </div>
          </div>

          {/* Rate cards */}
          <div className="grid-2 mb-12">
            <div className="card-surface">
              <div className="t-label mb-4">Hourly</div>
              <div className="t-subtitle">${demoDriver.rateHourly}/hr</div>
            </div>
            <div className="card-surface">
              <div className="t-label mb-4">Flat local</div>
              <div className="t-subtitle">${demoDriver.flatLocal}</div>
              <div className="t-small">{demoDriver.flatLocalLabel}</div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="card-surface mb-12">
            <div className="flex-between mb-4">
              <span className="t-label">Vehicle</span>
              {demoDriver.seatbeltsConfirmed && (
                <span className="badge badge-green">&#10003; Seatbelts</span>
              )}
            </div>
            <div className="t-body" style={{ fontSize: 13, fontWeight: 500 }}>
              {demoDriver.vehicleMakeModel}
            </div>
            <div className="t-small mt-8" style={{ display: 'flex', gap: 8 }}>
              <span>{demoDriver.vehicleColor}</span>
              <span>&middot;</span>
              <span>{demoDriver.vehicleSeats} passengers max</span>
            </div>
          </div>

          {/* Availability */}
          <div className="card-surface">
            <div className="t-label mb-8">Availability</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {demoDriver.availabilityDays.map((d) => (
                <span key={d} className="badge badge-navy">{d}</span>
              ))}
            </div>
            <div className="t-small mt-8">{demoDriver.availabilityHours}</div>
          </div>
        </div>

        {/* ── Main: Calendar + time ────────────────────────── */}
        <div className="main-content">
          <div className="t-title mb-4">Select Date &amp; Time</div>
          <div className="t-small mb-16">
            {demoDriver.name} &middot; New Destination
          </div>

          {/* Tab toggle */}
          <div className="seg-control mb-16" style={{ maxWidth: 280 }}>
            <button
              className={`seg-opt ${calendarMode === 'calendar' ? 'on' : ''}`}
              onClick={() => setCalendarMode('calendar')}
            >
              Calendar
            </button>
            <button
              className={`seg-opt ${calendarMode === 'manual' ? 'on' : ''}`}
              onClick={() => setCalendarMode('manual')}
            >
              Enter manually
            </button>
          </div>

          {calendarMode === 'calendar' ? (
            <>
              {/* Month header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div className="t-subtitle">July 2026</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-sm">&lsaquo;</button>
                  <button className="btn btn-ghost btn-sm">&rsaquo;</button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="cal-grid mb-16">
                {DAY_LABELS.map((l) => (
                  <div key={l} className="cal-day-label">{l}</div>
                ))}
                {CALENDAR_DAYS.map((day) => {
                  let cls = `cal-day ${day.state}`;
                  if (day.n === selectedDate && day.state !== 'blocked' && day.state !== 'off') {
                    cls = 'cal-day sel';
                  }
                  return (
                    <div
                      key={day.n}
                      className={cls}
                      onClick={() => handleDateClick(day)}
                    >
                      {day.n}
                    </div>
                  );
                })}
              </div>

              {/* Time slots */}
              <div className="t-label mb-8">
                Available times &mdash; Thu Jul {selectedDate}
              </div>
              <div className="time-slots mb-20">
                {TIME_SLOTS.map((slot) => {
                  let cls = 'time-slot';
                  if (slot.state === 'taken') {
                    cls += ' ts-taken';
                  } else if (slot.label === selectedTime) {
                    cls += ' ts-sel';
                  } else {
                    cls += ' ts-open';
                  }
                  return (
                    <div
                      key={slot.label}
                      className={cls}
                      onClick={() => handleTimeClick(slot)}
                    >
                      {slot.label}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mb-20">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" type="time" />
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            onClick={() => router.push('/book/route')}
          >
            Next &mdash; Enter Route Details &rarr;
          </button>

          {/* Payment history */}
          <div style={{ textAlign: 'right', marginTop: 14 }}>
            <a
              href="/payments"
              style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}
            >
              View payment history &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
