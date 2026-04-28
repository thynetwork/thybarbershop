'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

/* ── Demo data ─────────────────────────────────────────────── */
const barber = {
  initials: 'MR',
  name: 'Marcus Rivera',
  location: 'The Studio · South Houston, TX',
  codeParts: ['South Houston', 'TX', 'MRC', '3341'],
  rating: 4.97,
  licensed: true,
  safetyProtocol: true,
};

const services = [
  { label: 'Adult Haircut', price: 45 },
  { label: 'Fade + Line-up', price: 55 },
  { label: 'Beard Trim', price: 25 },
  { label: 'Full Service', price: 75 },
];

const availDays = [
  { label: 'Mo', on: true },
  { label: 'Tu', on: true },
  { label: 'We', on: true },
  { label: 'Th', on: true },
  { label: 'Fr', on: false },
  { label: 'Sa', on: true },
  { label: 'Su', on: false },
];

const demoUser = { name: 'Sarah Chen', initials: 'SC' };

/* Calendar: July 2026 */
const YEAR = 2026;
const MONTH = 6; // 0-indexed July
const TODAY = 17;
const UNAVAILABLE_DATES = [4, 11, 18, 25]; // Saturdays that are off
const AVAILABLE_DOW = [1, 2, 3, 4, 6]; // Mon-Thu + Sat

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const REGULAR_SLOTS = [
  '8:00 am', '9:00 am', '10:00 am', '11:00 am',
  '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm',
  '4:00 pm', '5:00 pm',
];
const AFTER_HOURS_SLOTS = ['6:00 pm', '7:00 pm', '8:00 pm'];
const BOOKED_SLOTS = ['9:00 am', '2:00 pm'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDow(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function DriverCardPage() {
  const router = useRouter();
  const params = useParams();
  const _code = params?.code as string | undefined;
  const { prefix, highlight } = splitServiceName();

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calMode, setCalMode] = useState<'calendar' | 'manual'>('calendar');
  const [selectedService, setSelectedService] = useState<number>(0);

  const daysInMonth = getDaysInMonth(YEAR, MONTH);
  const firstDow = getFirstDow(YEAR, MONTH);

  function isDayAvailable(day: number): boolean {
    if (UNAVAILABLE_DATES.includes(day)) return false;
    const dow = new Date(YEAR, MONTH, day).getDay();
    return AVAILABLE_DOW.includes(dow);
  }

  function isDayPast(day: number): boolean {
    return day < TODAY;
  }

  function handleDateClick(day: number) {
    if (isDayPast(day) || !isDayAvailable(day)) return;
    setSelectedDate(day);
    setSelectedTime(null);
  }

  function handleTimeClick(slot: string) {
    if (BOOKED_SLOTS.includes(slot)) return;
    setSelectedTime(slot);
  }

  const canProceed = selectedDate !== null && selectedTime !== null;

  /* ── Styles ─────────────────────────────────────────────── */
  const navy = '#1B2A4A';
  const amber = '#F5A623';
  const amberLight = '#FFF8EC';
  const grayLight = '#F3F4F6';
  const grayText = '#9CA3AF';
  const borderColor = '#E5E7EB';

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navy, color: '#fff', padding: '0 24px', height: 56,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              fontSize: 22, cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
            }}
            aria-label="Back"
          >&larr;</button>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
            {prefix}<span style={{ color: amber }}>{highlight}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{demoUser.name}</span>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: navy,
          }}>{demoUser.initials}</div>
        </div>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* ── LEFT PANEL (30%) ─────────────────────────────── */}
        <div style={{
          width: '30%', minWidth: 320, background: '#fff',
          borderRight: `1px solid ${borderColor}`, padding: 24, overflowY: 'auto',
        }}>

          {/* Barber identity card */}
          <div style={{
            background: `linear-gradient(135deg, ${navy} 0%, #2D3F66 100%)`,
            borderRadius: 14, padding: 20, color: '#fff', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: amber,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: navy,
              }}>{barber.initials}</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{barber.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{barber.location}</div>
              </div>
            </div>

            {/* 4-part code badge */}
            <div style={{
              display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden',
              fontSize: 11, fontWeight: 600, marginBottom: 14,
            }}>
              {barber.codeParts.map((part, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '5px 6px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                  color: i === 0 ? amber : 'rgba(255,255,255,0.85)',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>{part}</div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                background: 'rgba(245,166,35,0.2)', color: amber,
              }}>&#9733; {barber.rating}</span>
              {barber.licensed && (
                <span className="badge badge-green" style={{ fontSize: 11 }}>&#10003; License</span>
              )}
              {barber.safetyProtocol && (
                <span className="badge badge-green" style={{ fontSize: 11 }}>&#10003; Safety Protocol</span>
              )}
            </div>
          </div>

          {/* Services & Rates */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Services &amp; Rates
            </div>
            {services.map((svc, i) => {
              const isSelected = selectedService === i;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedService(i)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '11px 14px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
                    background: isSelected ? amberLight : '#fff',
                    border: `1.5px solid ${isSelected ? amber : borderColor}`,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: isSelected ? 600 : 500, color: navy }}>{svc.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: isSelected ? amber : navy }}>${svc.price}</span>
                </div>
              );
            })}
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: 12, color: amber, fontWeight: 600, cursor: 'pointer' }}>View all &rarr;</span>
            </div>
          </div>

          {/* Availability */}
          <div style={{
            background: grayLight, borderRadius: 12, padding: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Availability
            </div>

            {/* Day circles */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {availDays.map((d) => (
                <div key={d.label} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  background: d.on ? navy : 'transparent',
                  color: d.on ? '#fff' : grayText,
                  border: d.on ? 'none' : `1.5px dashed ${grayText}`,
                }}>{d.label}</div>
              ))}
            </div>

            <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Hours:</span> 8:00 am &ndash; 6:00 pm
            </div>
            <div style={{ fontSize: 12, color: grayText }}>
              <span style={{ fontWeight: 600 }}>After hours:</span> By request
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (70%) ────────────────────────────── */}
        <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>

          {/* Header */}
          <div style={{ fontSize: 24, fontWeight: 800, color: navy, marginBottom: 4 }}>
            Select Date &amp; Time
          </div>
          <div style={{ fontSize: 14, color: grayText, marginBottom: 24 }}>
            {barber.name} &middot; New Visit
          </div>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', background: grayLight, borderRadius: 10,
            padding: 3, marginBottom: 24, gap: 2,
          }}>
            <button
              onClick={() => setCalMode('calendar')}
              style={{
                padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                background: calMode === 'calendar' ? '#fff' : 'transparent',
                color: calMode === 'calendar' ? navy : grayText,
                boxShadow: calMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >&#128197; Calendar</button>
            <button
              onClick={() => setCalMode('manual')}
              style={{
                padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                background: calMode === 'manual' ? '#fff' : 'transparent',
                color: calMode === 'manual' ? navy : grayText,
                boxShadow: calMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >&#9999;&#65039; Enter manually</button>
          </div>

          {calMode === 'calendar' ? (
            <>
              {/* Calendar card */}
              <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24,
              }}>
                {/* Month nav */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <button style={{
                    width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`,
                    background: '#fff', cursor: 'pointer', fontSize: 16, color: navy,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>&lsaquo;</button>
                  <span style={{ fontSize: 16, fontWeight: 700, color: navy }}>July 2026</span>
                  <button style={{
                    width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`,
                    background: '#fff', cursor: 'pointer', fontSize: 16, color: navy,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>&rsaquo;</button>
                </div>

                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                  {DAY_HEADERS.map((h) => (
                    <div key={h} style={{
                      textAlign: 'center', fontSize: 11, fontWeight: 700,
                      color: grayText, padding: '4px 0', textTransform: 'uppercase',
                    }}>{h}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDow }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const past = isDayPast(day);
                    const avail = isDayAvailable(day);
                    const isToday = day === TODAY;
                    const isSel = day === selectedDate;

                    let bg = 'transparent';
                    let color = navy;
                    let cursor: string = 'default';
                    let textDecoration = 'none';
                    let opacity = 1;
                    let fontWeight = 500;
                    let border = '2px solid transparent';

                    if (isSel && !past) {
                      bg = navy;
                      color = amber;
                      fontWeight = 700;
                      cursor = 'pointer';
                    } else if (past) {
                      color = '#D1D5DB';
                      opacity = 0.6;
                    } else if (!avail) {
                      color = grayText;
                      textDecoration = 'line-through';
                    } else {
                      cursor = 'pointer';
                    }

                    return (
                      <div
                        key={day}
                        onClick={() => handleDateClick(day)}
                        style={{
                          width: '100%', aspectRatio: '1', borderRadius: 10,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight, background: bg, color, cursor,
                          textDecoration, opacity, border, position: 'relative',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!past && avail && !isSel) {
                            (e.currentTarget as HTMLDivElement).style.background = amberLight;
                            (e.currentTarget as HTMLDivElement).style.border = `2px solid ${amber}`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSel) {
                            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                            (e.currentTarget as HTMLDivElement).style.border = '2px solid transparent';
                          }
                        }}
                      >
                        {day}
                        {isToday && (
                          <div style={{
                            width: 5, height: 5, borderRadius: '50%', background: amber,
                            position: 'absolute', bottom: 4,
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time slots (only when date selected) */}
              {selectedDate !== null && (
                <div style={{
                  background: '#fff', borderRadius: 16, padding: 24,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 16 }}>
                    Available Times &mdash; {(() => {
                      const d = new Date(YEAR, MONTH, selectedDate);
                      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      return `${days[d.getDay()]} Jul ${selectedDate}`;
                    })()}
                  </div>

                  {/* Regular time slots - 4 col grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                    {REGULAR_SLOTS.map((slot) => {
                      const booked = BOOKED_SLOTS.includes(slot);
                      const isSel = selectedTime === slot;

                      return (
                        <button
                          key={slot}
                          onClick={() => handleTimeClick(slot)}
                          disabled={booked}
                          style={{
                            padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                            cursor: booked ? 'not-allowed' : 'pointer',
                            border: isSel ? `2px solid ${navy}` : `1.5px solid ${booked ? '#E5E7EB' : borderColor}`,
                            background: isSel ? navy : booked ? '#FAFAFA' : '#fff',
                            color: isSel ? amber : booked ? '#C4C4C4' : navy,
                            textDecoration: booked ? 'line-through' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >{slot}</button>
                      );
                    })}
                  </div>

                  {/* After Hours divider */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
                  }}>
                    <div style={{ flex: 1, height: 1, background: borderColor }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: grayText, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      After Hours
                    </span>
                    <div style={{ flex: 1, height: 1, background: borderColor }} />
                  </div>

                  {/* After hours slots */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {AFTER_HOURS_SLOTS.map((slot) => {
                      const isSel = selectedTime === slot;

                      return (
                        <button
                          key={slot}
                          onClick={() => handleTimeClick(slot)}
                          style={{
                            padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                            cursor: 'pointer',
                            border: isSel ? `2px solid ${navy}` : `1.5px dashed ${amber}`,
                            background: isSel ? navy : amberLight,
                            color: isSel ? amber : navy,
                            transition: 'all 0.15s ease',
                          }}
                        >{slot}</button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{
              background: '#fff', borderRadius: 16, padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: navy, marginBottom: 6 }}>Date</label>
                  <input type="date" style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10,
                    border: `1.5px solid ${borderColor}`, fontSize: 14, color: navy,
                    outline: 'none',
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: navy, marginBottom: 6 }}>Time</label>
                  <input type="time" style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10,
                    border: `1.5px solid ${borderColor}`, fontSize: 14, color: navy,
                    outline: 'none',
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={() => canProceed && router.push('/book/confirm')}
            disabled={!canProceed}
            style={{
              width: '100%', padding: '16px 0', borderRadius: 12, border: 'none',
              fontSize: 16, fontWeight: 700, cursor: canProceed ? 'pointer' : 'not-allowed',
              background: canProceed ? navy : '#D1D5DB',
              color: canProceed ? amber : '#fff',
              transition: 'all 0.2s ease',
              opacity: canProceed ? 1 : 0.7,
            }}
          >
            Next &mdash; Confirm Booking &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
