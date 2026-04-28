'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

/* ── Types ────────────────────────────────────── */
interface ConnectedClient {
  id: string;
  initials: string;
  avatarBg: string;
  online: boolean;
  name: string;
  clientId: string;
  safetyDone: boolean;
  source: 'invite' | 'pool';
  sourceFreq: string;
  lastVisitDate: string;
  lastVisitService: string;
  chairRate: number | null;
  chairRateStatus: 'set' | 'pending' | 'none';
}

/* ── Demo data ────────────────────────────────── */
const CLIENTS: ConnectedClient[] = [
  {
    id: 'SARA8834', initials: 'SW', avatarBg: '#c87f1a', online: true,
    name: 'Sarah W.', clientId: 'SARA\u00b78834',
    safetyDone: true, source: 'invite', sourceFreq: 'Weekly',
    lastVisitDate: 'Thu Jul 10', lastVisitService: 'Adult Haircut',
    chairRate: 45, chairRateStatus: 'set',
  },
  {
    id: 'TODD4401', initials: 'TW', avatarBg: '#2a2a5c', online: false,
    name: 'Todd Williams', clientId: 'TODD\u00b74401',
    safetyDone: false, source: 'pool', sourceFreq: 'Monthly',
    lastVisitDate: 'Sat Jul 19', lastVisitService: 'Fade+Beard',
    chairRate: null, chairRateStatus: 'none',
  },
  {
    id: 'MARC5521', initials: 'MJ', avatarBg: '#2d3561', online: false,
    name: 'Marcus J.', clientId: 'MARC\u00b75521',
    safetyDone: true, source: 'invite', sourceFreq: 'Bi-weekly',
    lastVisitDate: 'Mon Jul 14', lastVisitService: 'Fade+Line-up',
    chairRate: 55, chairRateStatus: 'set',
  },
  {
    id: 'LISA3310', initials: 'LM', avatarBg: '#3d2b6e', online: false,
    name: 'Lisa M.', clientId: 'LISA\u00b73310',
    safetyDone: false, source: 'invite', sourceFreq: 'Bi-weekly',
    lastVisitDate: 'Fri Jul 18', lastVisitService: 'Children Haircut',
    chairRate: 25, chairRateStatus: 'pending',
  },
  {
    id: 'DAVI7723', initials: 'DC', avatarBg: '#0d3b2e', online: false,
    name: 'David Chen', clientId: 'DAVI\u00b77723',
    safetyDone: true, source: 'invite', sourceFreq: 'Weekly',
    lastVisitDate: 'Mon Jul 7', lastVisitService: 'Full Service',
    chairRate: 75, chairRateStatus: 'set',
  },
  {
    id: 'RAYJ9901', initials: 'RJ', avatarBg: '#4a1942', online: false,
    name: 'Ray J.', clientId: 'RAYJ\u00b79901',
    safetyDone: true, source: 'pool', sourceFreq: 'Monthly',
    lastVisitDate: 'Thu Jun 26', lastVisitService: 'Adult Haircut',
    chairRate: 45, chairRateStatus: 'set',
  },
  {
    id: 'KEVI4412', initials: 'KT', avatarBg: '#1a3a4a', online: false,
    name: 'Kevin T.', clientId: 'KEVI\u00b74412',
    safetyDone: true, source: 'invite', sourceFreq: 'Weekly',
    lastVisitDate: 'Tue Jun 24', lastVisitService: 'Fade+Line-up',
    chairRate: 55, chairRateStatus: 'set',
  },
];

/* ── Sidebar nav config ──────────────────────── */
const NAV_MAIN = [
  { icon: '\u229E', label: 'Dashboard', href: '/dashboard' },
  { icon: '\uD83D\uDCC5', label: 'Calendar', href: '/calendar' },
  { icon: '\uD83D\uDC65', label: 'Clients', href: '/clients', active: true, badge: '14', badgeColor: 'amber' as const },
];
const NAV_BUSINESS = [
  { icon: '\uD83D\uDCB0', label: 'Payment Log', href: '/payments' },
  { icon: '\uD83D\uDD17', label: 'Share Code', href: '/share' },
];
const NAV_ACCOUNT = [
  { icon: '\uD83D\uDC64', label: 'Profile', href: '/edit-profile'},
  { icon: '\uD83D\uDCCB', label: 'Work History', href: '/history', badge: '312', badgeColor: 'amber' as const },
  { icon: '\u2699\uFE0F', label: 'Settings', href: '/settings' },
  { icon: '\uD83D\uDCDE', label: 'Support', href: '/support' },
];

/* ── Inline style helpers ────────────────────── */
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
export default function ClientsPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [activeTab, setActiveTab] = useState<'pending' | 'connected'>('connected');
  const [sort, setSort] = useState<'recent' | 'az' | 'rate'>('recent');

  const pendingCount = 2;
  const connectedCount = CLIENTS.length;

  const renderNavItem = (item: { icon: string; label: string; href: string; active?: boolean; badge?: string; badgeColor?: 'red' | 'amber' }) => (
    <a key={item.label} href={item.href} style={sidebarNavItem(!!item.active)} onClick={e => { e.preventDefault(); if (!item.active) router.push(item.href); }}>
      <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
      {item.label}
      {item.badge && <span style={sidebarBadge(item.badgeColor || 'red')}>{item.badge}</span>}
    </a>
  );

  const sortedClients = [...CLIENTS].sort((a, b) => {
    if (sort === 'az') return a.name.localeCompare(b.name);
    if (sort === 'rate') return (b.chairRate ?? 0) - (a.chairRate ?? 0);
    return 0; // recent = original order
  });

  return (
    <div className="app-shell" style={{ position: 'relative' }}>

      {/* ── TOPBAR ──────────────────────────────────── */}
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

      {/* ── SHELL: sidebar + main ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 680 }}>

        {/* ── SIDEBAR ─────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(180deg, #0a0a2e 0%, #12124a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 14px', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 14px 6px', marginTop: 4 }}>Main</div>
          {NAV_MAIN.map(renderNavItem)}

          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 14px 6px', marginTop: 20 }}>Business</div>
          {NAV_BUSINESS.map(renderNavItem)}

          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 14px 6px', marginTop: 20 }}>Account</div>
          {NAV_ACCOUNT.map(renderNavItem)}

          <div style={{ marginTop: 'auto', paddingTop: 20, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            &copy; {config.copyrightYear} {config.companyName}
          </div>
        </div>

        {/* ── MAIN CONTENT ────────────────────────────── */}
        <div style={{ padding: '24px 28px', background: 'var(--white)', overflowY: 'auto' }}>

          {/* ── Tab toggle (pill style, fit-content) ──── */}
          <div style={{
            display: 'inline-flex', gap: 4, marginBottom: 20,
            background: 'var(--surface)', borderRadius: 12, padding: 3,
          }}>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif",
                background: activeTab === 'pending' ? '#fff' : 'transparent',
                color: activeTab === 'pending' ? 'var(--text-1)' : 'var(--text-2)',
                boxShadow: activeTab === 'pending' ? 'var(--shadow-sm)' : 'none',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Pending
              <span style={{
                background: '#A32D2D', color: '#fff', borderRadius: 9999,
                padding: '2px 8px', fontSize: 10, fontWeight: 700,
              }}>{pendingCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              style={{
                padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif",
                background: activeTab === 'connected' ? '#fff' : 'transparent',
                color: activeTab === 'connected' ? 'var(--text-1)' : 'var(--text-2)',
                boxShadow: activeTab === 'connected' ? 'var(--shadow-sm)' : 'none',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Connected
              <span style={{
                background: 'var(--navy)', color: '#F5A623', borderRadius: 9999,
                padding: '2px 8px', fontSize: 10, fontWeight: 700,
              }}>{connectedCount}</span>
            </button>
          </div>

          {/* ── Connected tab content ─────────────────── */}
          {activeTab === 'connected' && (
            <>
              {/* Sort row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>
                  {connectedCount} connected clients
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {([
                    { key: 'recent' as const, label: 'Recent' },
                    { key: 'az' as const, label: 'A\u2192Z' },
                    { key: 'rate' as const, label: 'Chair Rate' },
                  ]).map(s => (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', border: '1px solid var(--border-mid)',
                        fontFamily: "'DM Sans', sans-serif",
                        background: sort === s.key ? 'var(--navy)' : '#fff',
                        color: sort === s.key ? '#fff' : 'var(--text-2)',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client list card */}
              <div style={{
                background: '#fff', borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1.5px solid var(--border-mid)',
              }}>
                {sortedClients.map((client, idx) => (
                  <div
                    key={client.id}
                    onClick={() => router.push(`/clients/${client.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 20px', cursor: 'pointer',
                      borderBottom: idx < sortedClients.length - 1 ? '1px solid var(--border-mid)' : 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: '2.6rem', height: '2.6rem', borderRadius: '50%',
                        background: client.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                        letterSpacing: '0.04em',
                      }}>
                        {client.initials}
                      </div>
                      {client.online && (
                        <div style={{
                          position: 'absolute', bottom: 1, right: 1,
                          width: 10, height: 10, borderRadius: '50%',
                          background: '#22c55e', border: '2px solid #fff',
                        }} />
                      )}
                    </div>

                    {/* Main info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-1)' }}>
                          {client.name}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 300 }}>
                          {client.clientId}
                        </span>
                      </div>

                      {/* Badges row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        {client.safetyDone ? (
                          <span style={{
                            background: 'rgba(34,197,94,0.12)', color: '#15803d',
                            borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600,
                          }}>
                            &#10003; Safety Protocol
                          </span>
                        ) : (
                          <span style={{
                            background: 'rgba(245,166,35,0.15)', color: '#b47a12',
                            borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600,
                          }}>
                            &#9203; Safety Pending
                          </span>
                        )}
                        <span style={{
                          background: client.source === 'invite' ? 'rgba(10,10,46,0.08)' : 'rgba(10,10,46,0.08)',
                          color: 'var(--navy)', borderRadius: 6,
                          padding: '2px 8px', fontSize: 10, fontWeight: 600,
                        }}>
                          {client.source === 'invite' ? '\uD83D\uDD17' : '\uD83D\uDD0D'} {client.source === 'invite' ? 'Invite' : 'Pool'} {client.sourceFreq}
                        </span>
                      </div>

                      {/* Last visit meta */}
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        Last visit: {client.lastVisitDate} &middot; {client.lastVisitService}
                      </div>
                    </div>

                    {/* Right section: chair rate + safety status */}
                    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 90 }}>
                      <div style={{
                        fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 700,
                        color: client.chairRateStatus === 'set' ? '#3C3489'
                          : client.chairRateStatus === 'pending' ? '#b47a12'
                          : 'var(--text-3)',
                        marginBottom: 3,
                      }}>
                        {client.chairRateStatus === 'set' && client.chairRate !== null
                          ? `$${client.chairRate} set`
                          : client.chairRateStatus === 'pending' && client.chairRate !== null
                          ? `$${client.chairRate} pending`
                          : 'No rate set'}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                        {client.safetyDone ? (
                          <span style={{ color: '#15803d' }}>&#10003; Safety done</span>
                        ) : (
                          <span style={{ color: '#b47a12' }}>&#9203; Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Chevron */}
                    <div style={{ fontSize: 18, color: 'var(--text-3)', marginLeft: 4, flexShrink: 0 }}>&rsaquo;</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Pending tab placeholder ───────────────── */}
          {activeTab === 'pending' && (
            <div style={{
              background: '#fff', borderRadius: 20, padding: '40px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1.5px solid var(--border-mid)', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--text-1)', marginBottom: 6 }}>
                {pendingCount} Pending Requests
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                Review incoming client connection requests here.
              </div>
            </div>
          )}

        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
