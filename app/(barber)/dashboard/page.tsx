'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const LX_DISMISS_KEY = 'lx-banner-dismissed';

/** Whole-day count between two ISO yyyy-mm-dd strings (or null). */
function daysUntil(isoDate: string | null | undefined): number | null {
  if (!isoDate) return null;
  const target = new Date(isoDate + 'T00:00:00');
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ms = target.getTime() - today.getTime();
  return Math.round(ms / 86_400_000);
}

function formatLicenseDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ── Types ────────────────────────────────────── */
interface Appointment {
  id: string;
  initials: string;
  name: string;
  clientId: string;
  time: string;
  timeBadge: 'next' | 'later';
  service: string;
  price: string;
  note: string;
  source: 'invite' | 'pool';
  sourceFreq: string;
  payment: 'prepaid' | 'after';
  countdown: string;
  autoRemind: string;
  chairRate: string;
}

interface PendingRequest {
  id: string;
  initials: string;
  name: string;
  clientId: string;
  source: 'invite' | 'pool';
  note: string;
  contact: string;
  visits: string;
  safety: string;
  sent: string;
}

/* ── Demo data ────────────────────────────────── */
const CURRENT_CLIENT = {
  initials: 'MJ',
  name: 'Marcus J.',
  clientId: 'MARC\u00b75521',
  service: 'Fade + Line-up',
  time: '9:00 am',
  price: '$55',
};

const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1', initials: 'SC', name: 'Sarah Chen', clientId: 'SARA\u00b78834',
    time: '11:00 am', timeBadge: 'next', service: 'Fade + Line-up', price: '$45',
    note: 'Same fade as last time, keep the sides tight',
    source: 'invite', sourceFreq: 'weekly', payment: 'prepaid',
    countdown: '1h 42m', autoRemind: '30 min', chairRate: '$45/hr',
  },
  {
    id: 'apt-2', initials: 'TW', name: 'Todd Williams', clientId: 'TODD\u00b74401',
    time: '1:00 pm', timeBadge: 'later', service: 'Fade + Beard Trim', price: '$60',
    note: '',
    source: 'pool', sourceFreq: 'monthly', payment: 'after',
    countdown: '3h 42m', autoRemind: '1 hr', chairRate: '$60/hr',
  },
  {
    id: 'apt-3', initials: 'LM', name: 'Lisa M.', clientId: 'LISA\u00b73310',
    time: '3:30 pm', timeBadge: 'later', service: 'Children Haircut', price: '$25',
    note: 'My son is 6, he\'s nervous — please be patient',
    source: 'invite', sourceFreq: 'bi-weekly', payment: 'prepaid',
    countdown: '6h 12m', autoRemind: '45 min', chairRate: '$25/hr',
  },
];

const PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 'pr-1', initials: 'DK', name: 'Derek King', clientId: 'DERE\u00b79910',
    source: 'invite', note: 'Referred by Marcus — wants a taper fade',
    contact: 'Verified phone', visits: '0 visits', safety: 'Protocol pending', sent: '2 hrs ago',
  },
  {
    id: 'pr-2', initials: 'JR', name: 'James Russell', clientId: 'JAME\u00b76622',
    source: 'pool', note: '',
    contact: 'Verified email', visits: '0 visits', safety: 'Protocol complete', sent: '5 hrs ago',
  },
];

const SERVICES = ['Fade + Line-up', 'Fade + Beard Trim', 'Children Haircut', 'Buzz Cut', 'Shape-up', 'Full Cut + Style'];

/* ── Sidebar nav sections ─────────────────────── */
const NAV_MAIN = [
  { icon: '\u229E', label: 'Dashboard', href: '/dashboard', active: true },
  { icon: '\uD83D\uDCC5', label: 'Calendar', href: '/calendar' },
  { icon: '\uD83D\uDC65', label: 'Clients', href: '/clients', badge: '2', badgeColor: 'red' as const },
];
const NAV_BUSINESS = [
  { icon: '\uD83D\uDCB0', label: 'Payment Log', href: '/payments' },
  { icon: '\uD83D\uDD17', label: 'Share Code', href: '/share' },
];
const NAV_ACCOUNT = [
  { icon: '\uD83D\uDC64', label: 'Profile', href: '/public-profile'},
  { icon: '\uD83D\uDCCB', label: 'Work History', href: '/work-history', badge: '312', badgeColor: 'amber' as const },
  { icon: '\u2699\uFE0F', label: 'Settings', href: '/settings' },
  { icon: '\uD83D\uDCDE', label: 'Support', href: '/support' },
];

/* ── Inline style helpers ─────────────────────── */
const sidebarNavItem = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 14px', borderRadius: 10,
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
  textDecoration: 'none',
  color: active ? '#F5A623' : 'rgba(255,255,255,0.6)',
  background: active ? 'rgba(245,166,35,0.12)' : 'transparent',
  borderLeft: active ? '3px solid #F5A623' : '3px solid transparent',
  transition: 'all 0.15s',
});

const sidebarBadge = (color: 'red' | 'amber'): React.CSSProperties => ({
  marginLeft: 'auto',
  background: color === 'red' ? '#A32D2D' : '#F5A623',
  color: color === 'red' ? '#fff' : '#0a0a2e',
  borderRadius: 9999, padding: '1px 7px',
  fontSize: 10, fontWeight: 700,
});

/* ── Component ────────────────────────────────── */
export default function BarberDashboard() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [activeTab, setActiveTab] = useState<'schedule' | 'pending'>('schedule');
  const [startedAppointment, setStartedAppointment] = useState<Record<string, 'idle' | 'progress' | 'complete'>>({});
  const [toastMsg, setToastMsg] = useState('');

  // License-expiry banner state (DD1A).
  const [licenseExpiry, setLicenseExpiry] = useState<string | null>(null);
  const [licenseNumber, setLicenseNumber] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(LX_DISMISS_KEY)) {
      setBannerDismissed(true);
    }
    fetch('/api/barber/dashboard')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data) return;
        setLicenseExpiry(data.licenseExpiry ?? null);
        setLicenseNumber(data.licenseNumber ?? null);
      })
      .catch(() => { /* keep demo state */ });
  }, []);

  const lxDays = daysUntil(licenseExpiry);
  const showLicenseBanner =
    !bannerDismissed && lxDays !== null && lxDays > 0 && lxDays <= 30 && !!licenseExpiry;

  const dismissLicenseBanner = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(LX_DISMISS_KEY, '1');
    setBannerDismissed(true);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleStartAppointment = (id: string) => {
    setStartedAppointment(prev => ({ ...prev, [id]: 'progress' }));
    setTimeout(() => {
      setStartedAppointment(prev => ({ ...prev, [id]: 'complete' }));
    }, 1800);
  };

  const handleMarkComplete = (id: string) => {
    showToast(`Appointment with ${id} marked complete!`);
    setStartedAppointment(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const renderNavItem = (item: { icon: string; label: string; href: string; active?: boolean; badge?: string; badgeColor?: 'red' | 'amber' }) => (
    <a key={item.label} href={item.href} style={sidebarNavItem(!!item.active)} onClick={e => { e.preventDefault(); }}>
      <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
      {item.label}
      {item.badge && <span style={sidebarBadge(item.badgeColor || 'red')}>{item.badge}</span>}
    </a>
  );

  /* ── Appointment card ───────────────────────── */
  const renderAppointmentCard = (apt: Appointment) => {
    const state = startedAppointment[apt.id] || 'idle';
    return (
      <div key={apt.id} style={{
        background: '#fff', border: '1.5px solid var(--border-mid)', borderRadius: 20,
        boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a2e, #1a1a6e)', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div className="avatar av-amber av-sm">{apt.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{apt.name}</div>
            <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'rgba(245,166,35,0.7)', letterSpacing: '0.04em' }}>{apt.clientId}</div>
          </div>
          <span style={{
            background: apt.timeBadge === 'next' ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.1)',
            color: apt.timeBadge === 'next' ? '#F5A623' : 'rgba(255,255,255,0.5)',
            borderRadius: 9999, padding: '4px 10px', fontSize: 11, fontWeight: 600,
          }}>{apt.time}</span>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {/* Note */}
          {apt.note ? (
            <div style={{
              background: 'var(--amber-pale)', border: '1px solid var(--amber-border)',
              borderRadius: 8, padding: '8px 10px', fontStyle: 'italic', fontSize: 12, color: 'var(--amber-dim)', lineHeight: 1.4,
            }}>
              &ldquo;{apt.note}&rdquo;
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>No note from client</div>
          )}

          {/* Service dropdown */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Service</div>
            <select defaultValue={apt.service} style={{
              width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border-mid)',
              borderRadius: 8, padding: '8px 10px', fontSize: 13, color: 'var(--text-1)',
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}>
              {SERVICES.map(s => <option key={s} value={s}>{s} {s === apt.service ? `· ${apt.price}` : ''}</option>)}
            </select>
          </div>

          {/* Payment toggle */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Payment</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <button style={{
                padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--border-mid)',
                background: apt.payment === 'prepaid' ? 'var(--navy)' : 'var(--surface)',
                color: apt.payment === 'prepaid' ? '#F5A623' : 'var(--text-2)',
              }}>Prepaid</button>
              <button style={{
                padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--border-mid)',
                background: apt.payment === 'after' ? 'var(--navy)' : 'var(--surface)',
                color: apt.payment === 'after' ? '#F5A623' : 'var(--text-2)',
              }}>Pay After</button>
            </div>
          </div>

          {/* Countdown */}
          <div style={{
            background: 'var(--surface)', borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--text-1)' }}>{apt.countdown}</span>
            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>until appointment</span>
          </div>

          {/* Auto-remind */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--text-2)' }}>Auto-remind</span>
            <input
              type="text"
              defaultValue={apt.autoRemind}
              style={{
                width: 70, background: 'var(--surface)', border: '1px solid var(--border-mid)',
                borderRadius: 6, padding: '4px 8px', fontSize: 12, textAlign: 'center',
                color: 'var(--text-1)', fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          {/* Source badge + chair rate */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={`badge ${apt.source === 'invite' ? 'badge-green' : 'badge-amber'}`}>
              {apt.source === 'invite' ? '\u2709' : '\uD83C\uDF0A'} {apt.source} {apt.sourceFreq}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{apt.chairRate}</span>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
              <button className="btn btn-ghost btn-sm">Running Late</button>
              <button className="btn btn-ghost btn-sm">Sit Open</button>
              <button className="btn btn-ghost btn-sm">Cancellation</button>
              <button className="btn btn-danger btn-sm">No Show</button>
            </div>
            {state === 'idle' && (
              <button
                className="btn btn-primary btn-full"
                style={{ padding: '11px 22px', borderRadius: 12 }}
                onClick={() => handleStartAppointment(apt.id)}
              >Start Appointment</button>
            )}
            {state === 'progress' && (
              <button className="btn btn-amber btn-full" style={{ borderRadius: 12, opacity: 0.8, cursor: 'wait' }} disabled>
                In Progress...
              </button>
            )}
            {state === 'complete' && (
              <button
                className="btn btn-amber btn-full"
                style={{ borderRadius: 12 }}
                onClick={() => handleMarkComplete(apt.name)}
              >
                &#10003; Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── Pending request card ───────────────────── */
  const renderPendingCard = (req: PendingRequest) => (
    <div key={req.id} style={{
      background: '#fff', border: '1.5px solid var(--border-mid)', borderRadius: 16,
      boxShadow: 'var(--shadow-sm)', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div className="avatar av-navy av-sm">{req.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{req.name}</div>
          <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'var(--amber-dim)', letterSpacing: '0.04em' }}>{req.clientId}</div>
        </div>
        <span className={`badge ${req.source === 'invite' ? 'badge-green' : 'badge-amber'}`}>
          {req.source}
        </span>
      </div>

      {req.note ? (
        <div style={{
          background: 'var(--amber-pale)', border: '1px solid var(--amber-border)',
          borderRadius: 8, padding: '8px 10px', fontStyle: 'italic', fontSize: 12, color: 'var(--amber-dim)',
          marginBottom: 12, lineHeight: 1.4,
        }}>
          &ldquo;{req.note}&rdquo;
        </div>
      ) : (
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic', marginBottom: 12 }}>No note</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {[
          { label: 'Contact', value: req.contact },
          { label: 'Visits', value: req.visits },
          { label: 'Safety', value: req.safety },
          { label: 'Sent', value: req.sent },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--text-2)' }}>{row.label}</span>
            <span style={{ fontWeight: 500, color: 'var(--text-1)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-green" style={{ flex: 1 }}>Approve</button>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Deny</button>
      </div>
    </div>
  );

  /* ── Render ─────────────────────────────────── */
  return (
    <div className="app-shell" style={{ position: 'relative' }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'var(--navy)', color: '#F5A623', padding: '12px 20px',
          borderRadius: 12, fontSize: 14, fontWeight: 600,
          boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.2s ease',
        }}>
          {toastMsg}
        </div>
      )}

      {/* ── TOPBAR ──────────────────────────────── */}
      <div className="app-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            borderRadius: 8, overflow: 'hidden', fontSize: 11, fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
          }}>
            <span style={{ background: 'rgba(245,166,35,0.15)', color: 'rgba(255,255,255,0.6)', padding: '4px 8px' }}>South Houston</span>
            <span style={{ background: 'rgba(245,166,35,0.25)', color: '#F5A623', padding: '4px 6px' }}>TX</span>
            <span style={{ background: 'var(--navy-mid)', color: '#F5A623', padding: '4px 7px', fontWeight: 800 }}>MRC</span>
            <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', padding: '4px 8px', letterSpacing: '0.1em' }}>3341</span>
          </div>
        </div>
        <div className="topbar-right">
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>{'\uD83D\uDD14'}</span>
            <span style={{
              position: 'absolute', top: -6, right: -8,
              background: '#A32D2D', color: '#fff', borderRadius: 9999,
              padding: '1px 5px', fontSize: 9, fontWeight: 700,
            }}>3</span>
          </div>
          <div className="topbar-avatar">MR</div>
        </div>
      </div>

      {/* ── SHELL: sidebar + main ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 680 }}>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(180deg, #0a0a2e 0%, #12124a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 14px', display: 'flex', flexDirection: 'column',
        }}>
          {/* Main */}
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 14px 6px', marginTop: 4 }}>Main</div>
          {NAV_MAIN.map(renderNavItem)}

          {/* Business */}
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 14px 6px', marginTop: 20 }}>Business</div>
          {NAV_BUSINESS.map(renderNavItem)}

          {/* Account */}
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 14px 6px', marginTop: 20 }}>Account</div>
          {NAV_ACCOUNT.map(renderNavItem)}

          {/* Footer */}
          <div style={{ marginTop: 'auto', paddingTop: 20, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            &copy; {config.copyrightYear} {config.companyName}
          </div>
        </div>

        {/* ── MAIN CONTENT ────────────────────────── */}
        <div style={{ padding: '24px 28px', background: 'var(--white)', overflowY: 'auto' }}>

          {/* DD1A · License-expiry banner (≤30 days, dismissible per session) */}
          {showLicenseBanner && lxDays !== null && licenseExpiry && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(245,166,35,0.14))',
              border: '1.5px solid rgba(245,166,35,0.4)',
              borderRadius: 14,
              padding: '14px 18px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(245,166,35,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#111118', marginBottom: 3 }}>
                  Your Verified badge expires in {lxDays} {lxDays === 1 ? 'day' : 'days'}
                </div>
                <div style={{ fontSize: 12, color: '#5A5A6A', lineHeight: 1.6 }}>
                  {licenseNumber && (
                    <span style={{ fontFamily: "'DM Mono',monospace" }}>{licenseNumber} · </span>
                  )}
                  expires {formatLicenseDate(licenseExpiry)} · upload your renewed license to keep your Verified badge on your public profile
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => router.push('/license-renew')}
                  style={{
                    background: '#0a0a2e', border: 'none', borderRadius: 10,
                    padding: '9px 16px', fontFamily: "'Syne', sans-serif",
                    fontSize: 12, fontWeight: 800, color: '#F5A623', cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  Upload Now →
                </button>
                <button
                  type="button"
                  onClick={dismissLicenseBanner}
                  aria-label="Dismiss"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 18, color: '#9A9AAA', padding: '4px 8px',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Tab toggle */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--surface)', borderRadius: 12, padding: 3 }}>
            <button
              onClick={() => setActiveTab('schedule')}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif",
                background: activeTab === 'schedule' ? '#fff' : 'transparent',
                color: activeTab === 'schedule' ? 'var(--text-1)' : 'var(--text-2)',
                boxShadow: activeTab === 'schedule' ? 'var(--shadow-sm)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Today&apos;s Schedule
              <span style={{
                background: 'var(--amber)', color: 'var(--navy)', borderRadius: 9999,
                padding: '2px 8px', fontSize: 10, fontWeight: 700,
              }}>4</span>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif",
                background: activeTab === 'pending' ? '#fff' : 'transparent',
                color: activeTab === 'pending' ? 'var(--text-1)' : 'var(--text-2)',
                boxShadow: activeTab === 'pending' ? 'var(--shadow-sm)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Pending Requests
              <span style={{
                background: '#A32D2D', color: '#fff', borderRadius: 9999,
                padding: '2px 8px', fontSize: 10, fontWeight: 700,
              }}>2</span>
            </button>
          </div>

          {/* ── TODAY'S SCHEDULE TAB ──────────────── */}
          {activeTab === 'schedule' && (
            <>
              {/* Section header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>
                  Thu, Jul 17
                </div>
                <a href="/calendar" style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }} onClick={e => e.preventDefault()}>
                  Calendar &rarr;
                </a>
              </div>

              {/* Now · In progress bar */}
              <div style={{
                background: 'linear-gradient(135deg, #0a0a2e, #12124a)', borderRadius: 14,
                padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  background: 'rgba(245,166,35,0.15)', borderRadius: 9999, padding: '3px 10px',
                  fontSize: 11, fontWeight: 700, color: '#F5A623',
                }}>Now &middot; In progress</div>
                <div className="avatar av-amber" style={{ width: 32, height: 32, fontSize: 12 }}>{CURRENT_CLIENT.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                    {CURRENT_CLIENT.name}
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: 'rgba(245,166,35,0.6)', marginLeft: 8, letterSpacing: '0.04em' }}>{CURRENT_CLIENT.clientId}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    {CURRENT_CLIENT.service} &middot; {CURRENT_CLIENT.time} &middot; {CURRENT_CLIENT.price}
                  </div>
                </div>
                <button
                  className="btn btn-amber btn-sm"
                  onClick={() => showToast(`Appointment with ${CURRENT_CLIENT.name} marked complete!`)}
                >
                  &#10003; Mark Complete
                </button>
              </div>

              {/* 3-column appointment grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {APPOINTMENTS.map(renderAppointmentCard)}
              </div>
            </>
          )}

          {/* ── PENDING REQUESTS TAB ─────────────── */}
          {activeTab === 'pending' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {PENDING_REQUESTS.map(renderPendingCard)}
            </div>
          )}

          {/* ── Profile prompt ───────────────────── */}
          <div className="card-amber-tint" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>{'\u270F\uFE0F'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--amber-dim)', marginBottom: 2 }}>Complete your profile</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>Add your services, chair rate, and availability so clients know what to expect.</div>
            </div>
            <a href="/edit-profile" style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber-dim)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Complete &rarr;
            </a>
          </div>

          {/* ── Stats row ────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="stat-card" style={{ background: 'var(--amber-pale)', border: '1px solid var(--amber-border)' }}>
              <div className="stat-label">This Week</div>
              <div className="stat-value amber">$420</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>8 appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">This Month</div>
              <div className="stat-value">$1,840</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>36 appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Clients</div>
              <div className="stat-value">14</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>2 pending</div>
            </div>
          </div>

        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
