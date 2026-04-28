'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';
import { ACCOUNT_PLAN, HOUSEHOLD_MEMBERS } from '@/lib/account';

/* ── Demo data ─────────────────────────────────────────────── */
const client = { name: 'Sarah Chen', initials: 'SC', clientId: 'SARA\u00B78834' };

const barbers = [
  {
    id: 'b1', name: 'Marcus Rivera', shortName: 'Marcus', initials: 'MR',
    location: 'The Studio \u00B7 South Houston, TX', indicator: 'Marcus Rivera \u00B7 South Houston, TX',
    city: 'South Houston', state: 'TX', codeInitials: 'MRC', codeDigits: '3341',
    rate: 45, service: 'Fade + Line-up', date: 'Jul 17, 2026', time: '11:00 am',
    rating: 4.97, license: 'TX-BBR-0042871', avatarBg: 'var(--navy)',
  },
  {
    id: 'b2', name: 'DeShawn Jackson', shortName: 'DeShawn', initials: 'DJ',
    location: 'Mobile Barber \u00B7 Watts, CA', indicator: 'DeShawn Jackson \u00B7 Watts, CA',
    city: 'Watts', state: 'CA', codeInitials: 'DSJ', codeDigits: '8812',
    rate: 50, service: 'Adult Haircut', date: 'Jun 28, 2026', time: '2:00 pm',
    rating: 4.94, license: 'CA-BAR-7714', avatarBg: '#1a1a6e', mobile: true,
  },
];

const appointments = [
  { month: 'Jul', day: '10', service: 'Fade + Line-up', barber: 'Marcus Rivera \u00B7 The Studio', amount: 45, status: 'done' },
  { month: 'Jun', day: '26', service: 'Adult Haircut', barber: 'DeShawn Jackson \u00B7 Mobile', amount: 50, status: 'done' },
  { month: 'Jun', day: '12', service: 'Fade + Beard Trim', barber: 'Marcus Rivera \u00B7 The Studio', amount: 60, status: 'done' },
  { month: 'May', day: '29', service: 'Adult Haircut', barber: 'Marcus Rivera \u00B7 The Studio', amount: 45, status: 'done' },
  { month: 'May', day: '15', service: 'Adult Haircut', barber: 'Marcus Rivera \u00B7 The Studio', amount: 45, status: 'cancelled' },
];

const SERVICES = ['Fade + Line-up', 'Adult Haircut', 'Beard Trim', 'Full Service'];

export default function ClientHomePage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [activeBarber, setActiveBarber] = useState(0);
  const [serviceIdx, setServiceIdx] = useState(0);
  const [activeMemberId, setActiveMemberId] = useState<string>(HOUSEHOLD_MEMBERS[0].id);
  const trackRef = useRef<HTMLDivElement>(null);

  const b = barbers[activeBarber];

  function selectBarber(idx: number) {
    setActiveBarber(idx);
    if (trackRef.current) {
      const w = trackRef.current.parentElement?.offsetWidth || 0;
      trackRef.current.style.transform = `translateX(-${idx * (w + 12)}px)`;
    }
  }

  function cycleService() {
    setServiceIdx((prev) => (prev + 1) % SERVICES.length);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', paddingBottom: '4rem' }}>
      {/* ── Topbar ──────────────────────────────────────────── */}
      <nav style={{
        background: 'var(--navy)', height: '3.25rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 1.25rem', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
          {prefix}<span style={{ color: 'var(--amber)' }}>{highlight}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{client.name}</div>
          <div style={{ position: 'relative', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem' }}>
            &#128276;
            <div style={{ position: 'absolute', top: '0.1rem', right: '0.1rem', width: '0.75rem', height: '0.75rem', background: '#e53e3e', borderRadius: '50%', border: '2px solid var(--navy)', fontSize: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>2</div>
          </div>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.72rem', color: 'var(--navy)', cursor: 'pointer' }}>{client.initials}</div>
        </div>
      </nav>

      {/* ── Page ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.25rem 1.25rem 4rem' }}>

        {/* ── Household Member Selector (household plan only) ── */}
        {ACCOUNT_PLAN === 'household' && (
          <div style={{
            background: '#fff', border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: 'var(--r-xl, 1.25rem)',
            padding: '1rem 1.1rem', marginBottom: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          }}>
            <div style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#9A9AAA', marginBottom: '0.6rem',
            }}>Who&rsquo;s booking today?</div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {HOUSEHOLD_MEMBERS.map(m => {
                const active = activeMemberId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMemberId(m.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                      flex: '0 0 auto', minWidth: '4.5rem', padding: '0.65rem 0.5rem',
                      borderRadius: '1rem',
                      border: active ? '1.5px solid #F5A623' : '1.5px solid rgba(0,0,0,0.09)',
                      background: active ? 'rgba(245,166,35,0.08)' : '#fff',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: '2.4rem', height: '2.4rem', borderRadius: '50%',
                      background: m.bg, color: m.fg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.72rem',
                      border: '0.15rem solid rgba(0,0,0,0.06)',
                    }}>{m.initials}</div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif", fontSize: '0.65rem', fontWeight: 800,
                      color: active ? '#0a0a2e' : '#5A5A6A', textAlign: 'center', lineHeight: 1.1,
                    }}>{m.shortName}</div>
                    {m.primary && (
                      <div style={{
                        fontSize: '0.55rem', fontWeight: 700, color: active ? '#D4830A' : '#9A9AAA',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>Primary</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Greeting Card ──────────────────────────────────── */}
        <div style={{
          background: 'var(--navy)', backgroundImage: 'radial-gradient(ellipse at top right, #1a1a6e, var(--navy))',
          borderRadius: 'var(--r-xl)', padding: '1.4rem 1.5rem', marginBottom: '1.25rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Welcome back,</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{client.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>
                <div style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', background: '#48bb78', flexShrink: 0 }} />
                <span>{b.indicator}</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>&larr; swipe to switch barbers</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.2rem' }}>CLIENT ID</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>{client.clientId}</div>
            </div>
          </div>

          {/* Chair rate */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--r-md)', padding: '0.7rem 1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Chair rate &middot; agreed with {b.shortName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber)' }}>${b.rate}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>&#128274;</div>
            </div>
          </div>

          {/* Service */}
          <div onClick={cycleService} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', padding: '0.65rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.15rem' }}>Service</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{SERVICES[serviceIdx]}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>&rsaquo;</div>
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--amber)', borderRadius: 'var(--r-md)', padding: '0.65rem 0.9rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Date</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{b.date}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-md)', padding: '0.65rem 0.9rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Time</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{b.time}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.6rem' }}>
            <button style={{ background: 'var(--amber)', border: 'none', borderRadius: 'var(--r-lg)', padding: '0.85rem', fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', fontWeight: 800, color: 'var(--navy)', cursor: 'pointer', letterSpacing: '0.03em' }}>Confirm Booking</button>
            <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--r-lg)', padding: '0.85rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', textAlign: 'center' }}>New Visit</button>
          </div>
        </div>

        {/* ── Your Barbers ───────────────────────────────────── */}
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Your Barbers
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--amber-dim)', cursor: 'pointer', letterSpacing: 0, textTransform: 'none' }}>Add barber</span>
        </div>

        {/* Swipeable barber cards */}
        <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div ref={trackRef} style={{ display: 'flex', gap: '0.75rem', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {barbers.map((barber, i) => (
              <div key={barber.id} onClick={() => selectBarber(i)} style={{
                background: '#fff', border: `1.5px solid ${activeBarber === i ? 'var(--amber)' : 'var(--border)'}`,
                borderRadius: 'var(--r-xl)', padding: '1rem 1.1rem', minWidth: '100%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer',
              }}>
                <div style={{ width: '2.8rem', height: '2.8rem', borderRadius: '50%', background: barber.avatarBg || 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: 'var(--amber)', flexShrink: 0, position: 'relative' }}>
                  {barber.initials}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '0.85rem', height: '0.85rem', borderRadius: '50%', background: '#48bb78', border: '2px solid #fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.15rem' }}>{barber.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{barber.location}</div>
                  {/* 4-part barber code */}
                  <div style={{ display: 'inline-flex', borderRadius: '0.3rem', overflow: 'hidden', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.65rem', marginBottom: '0.35rem' }}>
                    <div style={{ background: 'var(--amber)', color: 'var(--navy)', padding: '0.15rem 0.5rem', flex: 2.5 }}>{barber.city}</div>
                    <div style={{ background: 'var(--navy)', color: '#fff', padding: '0.15rem 0.4rem', flex: 1, borderLeft: '1.5px solid rgba(255,255,255,0.3)', borderRight: '1.5px solid rgba(255,255,255,0.3)' }}>{barber.state}</div>
                    <div style={{ background: 'var(--navy)', color: 'var(--amber)', padding: '0.15rem 0.4rem', flex: 1, borderRight: '1.5px solid rgba(255,255,255,0.3)' }}>{barber.codeInitials}</div>
                    <div style={{ background: 'var(--navy-mid)', color: 'rgba(255,255,255,0.85)', padding: '0.15rem 0.5rem', flex: 1 }}>{barber.codeDigits}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.6rem', padding: '0.15rem 0.55rem' }}>&#9733; {barber.rating}</span>
                    {barber.mobile && <span className="badge badge-amber" style={{ fontSize: '0.6rem', padding: '0.15rem 0.55rem' }}>Mobile</span>}
                    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--r-full)', padding: '0.15rem 0.55rem', fontSize: '0.6rem', fontWeight: 700, background: 'rgba(10,10,46,0.07)', color: 'var(--navy)', border: '1px solid rgba(10,10,46,0.12)' }}>&#10003; License #{barber.license}</span>
                  </div>
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-3)', flexShrink: 0 }}>&rsaquo;</div>
              </div>
            ))}
          </div>
        </div>

        {/* Swiper dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {barbers.map((_, i) => (
            <div key={i} onClick={() => selectBarber(i)} style={{
              height: '0.45rem', borderRadius: 'var(--r-full)', cursor: 'pointer',
              background: activeBarber === i ? 'var(--amber)' : 'rgba(0,0,0,0.15)',
              width: activeBarber === i ? '1.2rem' : '0.45rem',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>

        {/* ── Recent Appointments ─────────────────────────────── */}
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Recent Appointments
          <span onClick={() => router.push('/history')} style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--amber-dim)', cursor: 'pointer', letterSpacing: 0, textTransform: 'none' }}>View all</span>
        </div>

        {appointments.map((a, i) => (
          <div key={i} style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)',
            padding: '0.85rem 1rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center',
            gap: '0.85rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', cursor: 'pointer',
          }}>
            <div style={{ textAlign: 'center', minWidth: '2.8rem', flexShrink: 0 }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amber-dim)' }}>{a.month}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{a.day}</div>
            </div>
            <div style={{ width: 1, height: '2.2rem', background: 'var(--border)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '0.15rem' }}>{a.service}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-2)' }}>{a.barber}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.2rem' }}>${a.amount}</div>
              <span style={{
                display: 'inline-flex', borderRadius: 'var(--r-full)', padding: '0.1rem 0.5rem', fontSize: '0.58rem', fontWeight: 700,
                background: a.status === 'done' ? 'var(--green-pale)' : 'rgba(180,40,40,0.08)',
                color: a.status === 'done' ? 'var(--green)' : '#b42828',
              }}>{a.status === 'done' ? 'Done' : 'Cancelled'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Nav ──────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
        borderTop: '1px solid var(--border)', display: 'flex', height: '3.5rem', zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}>
        {[
          { icon: '\uD83D\uDC88', label: 'Home', active: true },
          { icon: '\uD83D\uDCC5', label: 'Book', active: false },
          { icon: '\uD83D\uDD14', label: 'Alerts', active: false },
          { icon: '\uD83D\uDC64', label: 'Profile', active: false },
          { icon: '\u2699\uFE0F', label: 'Settings', active: false },
        ].map((item, i) => (
          <button key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0.2rem', cursor: 'pointer', border: 'none', background: 'none',
          }}>
            <div style={{ fontSize: '1.15rem' }}>{item.icon}</div>
            <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: item.active ? 'var(--amber-dim)' : 'var(--text-3)' }}>{item.label}</div>
          </button>
        ))}
      </nav>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
