'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

export default function ClientProfilePage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [cancellation, setCancellation] = useState<string>('flexible');
  const [waitTime, setWaitTime] = useState<string>('on');
  const [noShow, setNoShow] = useState<string>('waive');

  const [styleNotes, setStyleNotes] = useState({
    usuallyGet: 'Fade + Line-up · tight on sides · skin fade',
    hairType: 'Type 4A coils · medium density · low porosity',
    sensitivities: 'Sensitive at the nape — go slow. Doesn\'t like water too cold. No razor on the top.',
    referenceNotes: 'Keeps it consistent every week. Likes the line crisp and sharp. Always shows a photo of the same style.',
  });

  const [privateNotes, setPrivateNotes] = useState(
    'Always shows up exactly 10 mins late — account for it. Tips $10 cash every time. Likes to talk — don\'t rush him. Wife\'s name is Dana. Has kids.'
  );

  /* ── Shared inline style tokens ─────────────────────────── */
  const navy = '#0B1D3A';
  const amber = '#F5A623';
  const amberPaleBg = 'rgba(245,166,35,0.07)';
  const white08 = 'rgba(255,255,255,0.08)';
  const white40 = 'rgba(255,255,255,0.4)';
  const fontSyne = "'Syne', sans-serif";
  const fontMono = "'DM Mono', monospace";
  const radius = 14;
  const cardBase: React.CSSProperties = {
    background: '#fff',
    borderRadius: radius,
    padding: '20px',
    marginBottom: 16,
  };

  /* ── Toggle pill helper ─────────────────────────────────── */
  const togglePill = (
    value: string,
    current: string,
    setter: (v: string) => void,
    label: string,
  ): React.CSSProperties & { onClick: () => void; children: string } => {
    const active = value === current;
    return {
      onClick: () => setter(value),
      children: label,
      ...({} as any),
    };
  };

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 14px',
    borderRadius: 20,
    border: 'none',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    background: active ? navy : 'rgba(11,29,58,0.06)',
    color: active ? amber : 'rgba(11,29,58,0.4)',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: "'DM Sans', sans-serif" }}>
      {/* ══════ TOPBAR ══════ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 54, zIndex: 100,
        background: navy, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', color: '#fff',
      }}>
        <div style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px' }}>
          {prefix}<span style={{ color: amber }}>{highlight}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* 4-part code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, fontSize: 11, fontFamily: fontMono }}>
            <span style={{ background: white08, padding: '4px 10px', borderRadius: '6px 0 0 6px', color: white40 }}>South Houston</span>
            <span style={{ background: white08, padding: '4px 8px', borderLeft: '1px solid rgba(255,255,255,0.06)', color: white40 }}>TX</span>
            <span style={{ background: white08, padding: '4px 8px', borderLeft: '1px solid rgba(255,255,255,0.06)', color: '#fff', fontWeight: 700 }}>MRC</span>
            <span style={{ background: amber, padding: '4px 10px', borderRadius: '0 6px 6px 0', color: navy, fontWeight: 700 }}>3341</span>
          </div>
          {/* Bell */}
          <div style={{ position: 'relative', cursor: 'pointer', fontSize: 18 }}>
            🔔
            <span style={{
              position: 'absolute', top: -4, right: -6, background: '#E53E3E', color: '#fff',
              fontSize: 9, fontWeight: 700, borderRadius: 10, padding: '1px 5px', lineHeight: '14px',
            }}>3</span>
          </div>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: amber, color: navy,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontSyne, fontWeight: 800, fontSize: 12,
          }}>MR</div>
        </div>
      </div>

      {/* ══════ BODY (sidebar + main) ══════ */}
      <div style={{ display: 'flex', paddingTop: 54 }}>
        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 220, minHeight: 'calc(100vh - 54px)', position: 'fixed', top: 54, left: 0,
          background: `linear-gradient(180deg, ${navy} 0%, #122B52 100%)`,
          display: 'flex', flexDirection: 'column', padding: '24px 0', overflowY: 'auto',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
            {[
              { icon: '⊞', label: 'Dashboard', href: '/dashboard' },
              { icon: '📅', label: 'Calendar', href: '/calendar' },
              { icon: '👥', label: 'Clients', href: '/clients', badge: 14 },
              { icon: '💰', label: 'Payment log', href: '/payments' },
              { icon: '🔗', label: 'Share code', href: '/share' },
              { icon: '👤', label: 'Profile', href: '/edit-profile' },
              { icon: '⚙', label: 'Settings', href: '/settings' },
            ].map((item) => {
              const active = item.label === 'Clients';
              return (
                <div
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: active ? 700 : 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                    background: active ? 'rgba(245,166,35,0.10)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: amber, color: navy, fontSize: 10, fontWeight: 800,
                      borderRadius: 10, padding: '2px 8px', lineHeight: '16px',
                    }}>{item.badge}</span>
                  )}
                </div>
              );
            })}
          </nav>
          <div style={{ marginTop: 'auto', padding: '0 16px' }}>
            <div style={{
              background: 'rgba(245,166,35,0.08)', borderRadius: 10, padding: '12px 14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                ${config.subscriptionAmount}/week &middot; Active
              </div>
              <div style={{
                background: amber, color: navy, fontSize: 10, fontWeight: 700,
                borderRadius: 20, padding: '3px 12px', display: 'inline-block',
              }}>Renews Fri</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main style={{ marginLeft: 220, flex: 1, padding: '28px 32px', minHeight: 'calc(100vh - 54px)' }}>
          {/* Back link */}
          <div
            onClick={() => router.push('/clients')}
            style={{
              fontSize: 13, color: 'rgba(11,29,58,0.45)', cursor: 'pointer', marginBottom: 20,
              fontWeight: 500, display: 'inline-block',
            }}
          >
            ← Back to clients
          </div>

          {/* ── 3-COLUMN GRID ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr 280px',
            gap: 20,
            alignItems: 'start',
          }}>

            {/* ═══════ LEFT COLUMN ═══════ */}
            <div>
              {/* Profile Banner */}
              <div style={{
                background: `linear-gradient(135deg, ${navy} 0%, #1A3A6A 100%)`,
                borderRadius: radius, padding: '28px 20px 22px', textAlign: 'center', marginBottom: 16,
              }}>
                {/* Avatar */}
                <div style={{
                  width: '4rem', height: '4rem', borderRadius: '50%', background: amber, color: navy,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
                  fontFamily: fontSyne, fontWeight: 800, fontSize: 20,
                  border: '3px solid rgba(255,255,255,0.15)',
                }}>SW</div>
                {/* Name */}
                <div style={{
                  fontFamily: fontSyne, fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 4,
                }}>Sarah W.</div>
                {/* ID */}
                <div style={{
                  fontFamily: fontMono, fontSize: 12, color: white40, marginBottom: 14,
                }}>SARA·8834</div>
                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(72,187,120,0.15)', color: '#48BB78',
                  }}>✓ Safety Protocol</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                  }}>🔗 Invite</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(245,166,35,0.15)', color: amber,
                  }}>Weekly</span>
                </div>
                {/* Stats grid 2x2 */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                }}>
                  {[
                    { value: '47', label: 'Total Visits' },
                    { value: '$2,115', label: 'Total Earned' },
                    { value: "Jan '25", label: 'Client Since' },
                    { value: 'Thu', label: 'Usually Comes' },
                  ].map((s) => (
                    <div key={s.label} style={{
                      background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 8px',
                    }}>
                      <div style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 16, color: amber }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chair Rate Card */}
              <div style={{
                background: amberPaleBg, borderRadius: radius, padding: '18px 20px', marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1,
                  color: 'rgba(11,29,58,0.4)', marginBottom: 8,
                }}>CHAIR RATE</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: fontSyne, fontSize: '1.6rem', fontWeight: 800, color: navy }}>$45</span>
                  <span style={{ fontSize: 11, color: '#48BB78', fontWeight: 600 }}>✓ Both confirmed</span>
                </div>
                <button
                  style={{
                    width: '100%', padding: '10px 0', borderRadius: 30, border: 'none',
                    background: navy, color: amber, fontWeight: 700, fontSize: 12,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}
                  onClick={() => alert('Update chair rate')}
                >
                  Update Chair Rate
                </button>
              </div>

              {/* Identity Card */}
              <div style={{ ...cardBase }}>
                {[
                  { label: 'Full name', value: 'Sarah Williams' },
                  { label: 'Preferred', value: 'Sarah' },
                  { label: 'Contact', value: 'Text only' },
                  { label: 'Next appt', value: 'Thu Jul 17 · 11am', color: amber },
                  { label: 'Safety', value: '✓ Complete', color: '#48BB78' },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < 4 ? '1px solid rgba(11,29,58,0.05)' : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: 'rgba(11,29,58,0.4)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{
                      fontSize: 12.5, fontWeight: 600,
                      color: row.color || navy,
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════ CENTER COLUMN ═══════ */}
            <div>
              {/* Style Notes Card */}
              <div style={{ ...cardBase }}>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 15, color: navy }}>Style Notes</span>
                  <span style={{ fontSize: 11, color: 'rgba(11,29,58,0.3)', marginLeft: 8 }}>· private · never shown to client</span>
                </div>

                {/* What they usually get */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(11,29,58,0.45)', display: 'block', marginBottom: 5 }}>
                    What they usually get
                  </label>
                  <input
                    type="text"
                    value={styleNotes.usuallyGet}
                    onChange={(e) => setStyleNotes({ ...styleNotes, usuallyGet: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1px solid rgba(11,29,58,0.08)', fontSize: 13, color: navy,
                      fontFamily: "'DM Sans', sans-serif", background: '#FAFAFA',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Hair type */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(11,29,58,0.45)', display: 'block', marginBottom: 5 }}>
                    Hair type & texture
                  </label>
                  <input
                    type="text"
                    value={styleNotes.hairType}
                    onChange={(e) => setStyleNotes({ ...styleNotes, hairType: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1px solid rgba(11,29,58,0.08)', fontSize: 13, color: navy,
                      fontFamily: "'DM Sans', sans-serif", background: '#FAFAFA',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Sensitivities */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(11,29,58,0.45)', display: 'block', marginBottom: 5 }}>
                    Sensitivities & what to avoid
                  </label>
                  <textarea
                    value={styleNotes.sensitivities}
                    onChange={(e) => setStyleNotes({ ...styleNotes, sensitivities: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1px solid rgba(11,29,58,0.08)', fontSize: 13, color: navy,
                      fontFamily: "'DM Sans', sans-serif", background: '#FAFAFA',
                      outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Reference style notes */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(11,29,58,0.45)', display: 'block', marginBottom: 5 }}>
                    Reference style notes
                  </label>
                  <textarea
                    value={styleNotes.referenceNotes}
                    onChange={(e) => setStyleNotes({ ...styleNotes, referenceNotes: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1px solid rgba(11,29,58,0.08)', fontSize: 13, color: navy,
                      fontFamily: "'DM Sans', sans-serif", background: '#FAFAFA',
                      outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  onClick={() => console.log('Style notes saved:', styleNotes)}
                  style={{
                    padding: '10px 28px', borderRadius: 30, border: 'none',
                    background: navy, color: amber, fontWeight: 700, fontSize: 12,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}
                >Save Style Notes</button>
              </div>

              {/* Private Barber Notes */}
              <div style={{
                background: `linear-gradient(135deg, ${navy} 0%, #1A3A6A 100%)`,
                borderRadius: radius, padding: '22px 22px 20px', marginBottom: 16,
              }}>
                <div style={{
                  fontFamily: fontSyne, fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4,
                }}>🔒 Private Notes</div>
                <div style={{ fontSize: 11, color: white40, marginBottom: 14 }}>
                  Only you can see this. Never shown to the client — ever.
                </div>
                <textarea
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  rows={5}
                  placeholder="Add private notes about this client..."
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)', fontSize: 13,
                    color: '#fff', fontFamily: "'DM Sans', sans-serif",
                    background: 'rgba(255,255,255,0.06)',
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    marginBottom: 14,
                  }}
                />
                <button
                  onClick={() => console.log('Private notes saved:', privateNotes)}
                  style={{
                    padding: '10px 28px', borderRadius: 30, border: 'none',
                    background: 'rgba(245,166,35,0.15)', color: amber, fontWeight: 700, fontSize: 12,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}
                >Save Private Notes</button>
              </div>

              {/* Registration Note */}
              <div style={{
                background: amberPaleBg, borderRadius: radius, padding: '18px 20px', marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'rgba(11,29,58,0.4)', marginBottom: 10,
                }}>Note from Registration · SARA·8834</div>
                <div style={{
                  fontSize: 13, color: navy, fontStyle: 'italic', lineHeight: 1.6,
                }}>
                  &ldquo;Hey Marcus, I&rsquo;ve been looking for a regular barber in South Houston. My coworker showed me your code. I usually get a fade and line-up every Thursday. Looking forward to locking in with you.&rdquo;
                </div>
              </div>
            </div>

            {/* ═══════ RIGHT COLUMN ═══════ */}
            <div>
              {/* Visit Stats (2 cards side by side) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{
                  background: '#fff', borderRadius: radius, padding: '16px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 22, color: navy }}>47</div>
                  <div style={{ fontSize: 10, color: 'rgba(11,29,58,0.4)', marginTop: 2 }}>Total Visits</div>
                </div>
                <div style={{
                  background: '#fff', borderRadius: radius, padding: '16px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 22, color: navy }}>$2,115</div>
                  <div style={{ fontSize: 10, color: 'rgba(11,29,58,0.4)', marginTop: 2 }}>Total Earned</div>
                </div>
              </div>

              {/* Recent Visits */}
              <div style={{ ...cardBase }}>
                <div style={{
                  fontFamily: fontSyne, fontWeight: 800, fontSize: 14, color: navy, marginBottom: 14,
                }}>Recent Visits</div>
                {[
                  { month: 'Jul', day: '10', service: 'Adult Haircut', status: 'Completed', payment: 'Zelle', amount: '$45', noshow: false },
                  { month: 'Jul', day: '3', service: 'Fade+Line-up', status: 'Completed', payment: 'Cash', amount: '$55', noshow: false },
                  { month: 'Jun', day: '26', service: 'Fade+Line-up', status: 'Completed', payment: 'Cash', amount: '$55', noshow: false },
                  { month: 'Jun', day: '19', service: 'Adult Haircut', status: 'No-show', payment: 'Waived', amount: '$0', noshow: true },
                  { month: 'Jun', day: '12', service: 'Full Service', status: 'Completed', payment: 'Zelle', amount: '$75', noshow: false },
                ].map((v, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                    borderBottom: i < 4 ? '1px solid rgba(11,29,58,0.04)' : 'none',
                    opacity: v.noshow ? 0.45 : 1,
                  }}>
                    {/* Date block */}
                    <div style={{
                      background: v.noshow ? 'rgba(11,29,58,0.04)' : 'rgba(11,29,58,0.04)',
                      borderRadius: 8, padding: '6px 10px', textAlign: 'center', minWidth: 40,
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(11,29,58,0.35)', textTransform: 'uppercase' as const }}>{v.month}</div>
                      <div style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 16, color: navy }}>{v.day}</div>
                    </div>
                    {/* Service + status */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: navy }}>{v.service}</div>
                      <div style={{ fontSize: 10, color: 'rgba(11,29,58,0.4)' }}>{v.status} · {v.payment}</div>
                    </div>
                    {/* Amount */}
                    <div style={{ fontFamily: fontSyne, fontWeight: 800, fontSize: 14, color: navy }}>{v.amount}</div>
                  </div>
                ))}
              </div>

              {/* Per-Client Policies */}
              <div style={{ ...cardBase }}>
                <div style={{
                  fontFamily: fontSyne, fontWeight: 800, fontSize: 14, color: navy, marginBottom: 14,
                }}>Per-Client Policies</div>

                {/* Cancellation */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <span style={{ fontSize: 12, color: 'rgba(11,29,58,0.55)', fontWeight: 500 }}>Cancellation</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setCancellation('flexible')} style={pillStyle(cancellation === 'flexible')}>Flexible</button>
                    <button onClick={() => setCancellation('standard')} style={pillStyle(cancellation === 'standard')}>Standard</button>
                  </div>
                </div>

                {/* Wait time */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <span style={{ fontSize: 12, color: 'rgba(11,29,58,0.55)', fontWeight: 500 }}>Wait time</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setWaitTime('on')} style={pillStyle(waitTime === 'on')}>On</button>
                    <button onClick={() => setWaitTime('off')} style={pillStyle(waitTime === 'off')}>Off</button>
                  </div>
                </div>

                {/* No-show */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, color: 'rgba(11,29,58,0.55)', fontWeight: 500 }}>No-show</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setNoShow('waive')} style={pillStyle(noShow === 'waive')}>Waive once</button>
                    <button onClick={() => setNoShow('charge')} style={pillStyle(noShow === 'charge')}>Charge</button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ ...cardBase }}>
                <div style={{
                  fontFamily: fontSyne, fontWeight: 800, fontSize: 14, color: navy, marginBottom: 14,
                }}>Quick Actions</div>
                {[
                  { icon: '💬', label: 'Contact Sarah', danger: false },
                  { icon: '📅', label: 'Book appointment', danger: false },
                  { icon: '💰', label: 'View full payment history', danger: false },
                ].map((a) => (
                  <div key={a.label} style={{
                    padding: '10px 0', fontSize: 13, color: navy, fontWeight: 500, cursor: 'pointer',
                    borderBottom: '1px solid rgba(11,29,58,0.04)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span>{a.icon}</span> {a.label}
                  </div>
                ))}
                <div style={{
                  padding: '10px 0', fontSize: 13, color: '#E53E3E', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderRadius: 8, marginTop: 4,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(229,62,62,0.3)';
                    (e.currentTarget as HTMLDivElement).style.padding = '9px 8px';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = 'none';
                    (e.currentTarget as HTMLDivElement).style.padding = '10px 0';
                  }}
                >
                  <span>✕</span> Remove Sarah from my clients
                </div>
              </div>
            </div>

          </div>{/* end 3-column grid */}
        </main>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
