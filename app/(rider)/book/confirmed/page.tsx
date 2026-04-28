'use client';

import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

/* ── demo data ─────────────────────────────────────────────── */
const barber = {
  name: 'Marcus Rivera',
  initials: 'MR',
  code: ['South Houston', 'TX', 'MRC', '3341'],
  license: 'TX-BBR-0042871',
  phone: '(713) 555-0182',
  address: '4521 Main St',
  studio: 'The Studio',
  city: 'South Houston',
  state: 'TX',
  zip: '77587',
};
const client = { name: 'Sarah Chen', initials: 'SC', id: 'SARA·8834' };

/* ── palette ───────────────────────────────────────────────── */
const navy = '#0B1D3A';
const navyLight = '#132C54';
const amber = '#F5A623';
const amberPale = '#FFF8ED';
const green = '#22C55E';
const greenPale = '#ECFDF5';
const greenBorder = '#86EFAC';
const white50 = 'rgba(255,255,255,.5)';
const border = '#E5E7EB';

/* ── shared inline helpers ─────────────────────────────────── */
const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  border: `1px solid ${border}`,
  padding: '1.25rem 1.35rem',
  marginBottom: 16,
};

const sectionTitle = (label: string): React.ReactNode => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
      fontFamily: 'Syne, sans-serif',
      fontWeight: 700,
      fontSize: '0.72rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: navy,
    }}
  >
    {label}
    <div style={{ flex: 1, height: 1, background: border }} />
  </div>
);

const summaryRow = (
  label: string,
  value: React.ReactNode,
  last = false,
): React.ReactNode => (
  <div
    key={label}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: last ? 'none' : `1px solid ${border}`,
      fontSize: '0.88rem',
    }}
  >
    <span style={{ color: '#6B7280' }}>{label}</span>
    <span style={{ fontWeight: 600, color: navy }}>{value}</span>
  </div>
);

/* ── keyframes (injected once) ─────────────────────────────── */
const fadeUpCSS = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

/* ── page ──────────────────────────────────────────────────── */
export default function BookingConfirmedPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  return (
    <>
      <style>{fadeUpCSS}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#F3F4F6',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: navy,
        }}
      >
        {/* ── TOPBAR ──────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.75rem',
            background: '#fff',
            borderBottom: `1px solid ${border}`,
          }}
        >
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: navy,
            }}
          >
            {prefix}
            <span style={{ color: amber }}>{highlight}</span>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: navyLight,
              color: amber,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
            }}
          >
            {client.initials}
          </div>
        </div>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${navy} 0%, ${navyLight} 100%)`,
            padding: '2.5rem 1.5rem 3.5rem',
            textAlign: 'center',
            animation: 'fadeUp .55s ease-out both',
          }}
        >
          {/* badge pill */}
          <div
            style={{
              display: 'inline-block',
              background: green,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.78rem',
              padding: '5px 16px',
              borderRadius: 999,
              marginBottom: 14,
              letterSpacing: '0.02em',
            }}
          >
            ✓ Appointment Confirmed
          </div>

          {/* title */}
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 8px',
            }}
          >
            Your chair is booked.
          </h1>

          {/* sub */}
          <p style={{ fontSize: '0.88rem', color: white50, margin: '0 0 32px' }}>
            Thu, Jul 17 · 11:00 am · The Studio, South Houston
          </p>

          {/* ── Photo pair ────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              position: 'relative',
            }}
          >
            {/* barber side */}
            <div style={{ textAlign: 'center', width: 170 }}>
              <div
                style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '50%',
                  background: amber,
                  color: navy,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: '2rem',
                  margin: '0 auto 10px',
                  border: '4px solid rgba(255,255,255,.15)',
                }}
              >
                {barber.initials}
              </div>
              <div style={{ fontSize: '0.72rem', color: white50, marginBottom: 3 }}>
                Who is cutting your hair
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 6 }}>
                {barber.name}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(34,197,94,.18)',
                  color: green,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  padding: '3px 10px',
                  borderRadius: 999,
                }}
              >
                ✓ Safety Protocol
              </span>
            </div>

            {/* scissors connector */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 4px 14px rgba(0,0,0,.25)',
                zIndex: 2,
                position: 'relative',
                flexShrink: 0,
                margin: '0 -12px',
              }}
            >
              ✂️
            </div>

            {/* client side */}
            <div style={{ textAlign: 'center', width: 170 }}>
              <div
                style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '50%',
                  background: navyLight,
                  color: amber,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: '2rem',
                  margin: '0 auto 10px',
                  border: '4px solid rgba(255,255,255,.15)',
                }}
              >
                {client.initials}
              </div>
              <div style={{ fontSize: '0.72rem', color: white50, marginBottom: 3 }}>
                Who you are
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 6 }}>
                {client.name}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(34,197,94,.18)',
                  color: green,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  padding: '3px 10px',
                  borderRadius: 999,
                }}
              >
                ✓ Safety Protocol
              </span>
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID ────────────────────────────────── */}
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '28px 20px 0',
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 20,
            animation: 'fadeUp .6s ease-out .1s both',
          }}
        >
          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div>
            {/* Card 1 — Appointment Summary */}
            <div style={cardStyle}>
              {sectionTitle('Appointment Summary')}
              {summaryRow('Service', 'Adult Haircut')}
              {summaryRow('Date', 'Thursday, July 17 · 2026')}
              {summaryRow('Time', '11:00 am')}
              {summaryRow(
                'Chair Rate',
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: amber }}>
                  $45
                </span>,
              )}
              {summaryRow(
                'Pay timing',
                <span style={{ color: green, fontWeight: 700 }}>Pay after completion</span>,
              )}
              {summaryRow(
                'Location',
                `${barber.studio} · ${barber.city}, ${barber.state}`,
                true,
              )}
            </div>

            {/* Card 2 — Barber Info */}
            <div style={cardStyle}>
              {sectionTitle(`${config.providerLabel} Info`)}
              {summaryRow(config.providerLabel, barber.name)}
              {summaryRow(
                'Code',
                <div style={{ display: 'flex', gap: 0 }}>
                  {barber.code.map((seg, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        background: i === 0 ? navy : i === 1 ? navyLight : i === 2 ? amber : green,
                        color: i === 2 ? navy : '#fff',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius:
                          i === 0
                            ? '6px 0 0 6px'
                            : i === 3
                              ? '0 6px 6px 0'
                              : 0,
                      }}
                    >
                      {seg}
                    </span>
                  ))}
                </div>,
              )}
              {summaryRow(
                'License',
                <span style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                  {barber.license}
                </span>,
              )}
              {summaryRow(
                'Address',
                <span style={{ textAlign: 'right', lineHeight: 1.45 }}>
                  {barber.studio} · {barber.address}
                  <br />
                  {barber.city}, {barber.state} {barber.zip}
                </span>,
                true,
              )}

              {/* phone reveal card */}
              <div
                style={{
                  marginTop: 14,
                  background: greenPale,
                  border: `1px solid ${greenBorder}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: 4 }}>
                  {barber.name.split(' ')[0]}&apos;s phone — revealed on confirmation
                </div>
                <div
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: green,
                    marginBottom: 10,
                  }}
                >
                  {barber.phone}
                </div>
                <button
                  style={{
                    display: 'inline-block',
                    background: green,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 22px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Call
                </button>
              </div>
            </div>

            {/* Card 3 — Cancellation Policy */}
            <div
              style={{
                ...cardStyle,
                background: amberPale,
                border: `1px solid #FDE68A`,
              }}
            >
              {sectionTitle('Cancellation Policy')}
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  fontSize: '0.84rem',
                  lineHeight: 1.7,
                  color: '#92400E',
                }}
              >
                <li>Free cancellation 24 hrs or more before appointment</li>
                <li>50% fee if cancelled within 24 hrs</li>
                <li>No-show — full amount charged</li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────── */}
          <div>
            {/* Card 1 — Notification Confirmation */}
            <div
              style={{
                background: navy,
                borderRadius: 14,
                padding: '1.25rem 1.35rem',
                marginBottom: 16,
                color: '#fff',
              }}
            >
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  marginBottom: 6,
                }}
              >
                🔔 Confirmation sent to both parties
              </div>
              <div style={{ fontSize: '0.78rem', color: white50, marginBottom: 16, lineHeight: 1.5 }}>
                {client.name} and {barber.name} have each been notified across all channels.
              </div>

              {['Push notification', 'SMS', 'Email', 'In-app'].map((ch) => (
                <div
                  key={ch}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,.08)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: green,
                        display: 'inline-block',
                      }}
                    />
                    {ch}
                  </div>
                  <span style={{ color: green, fontWeight: 600, fontSize: '0.75rem' }}>✓ Sent</span>
                </div>
              ))}
            </div>

            {/* Card 2 — Support Options */}
            <div style={cardStyle}>
              {sectionTitle('Support Options')}

              {[
                {
                  icon: '📞',
                  iconBg: green,
                  label: `Call ${barber.name.split(' ')[0]}`,
                  sub: 'Direct phone line',
                },
                {
                  icon: '💬',
                  iconBg: amber,
                  label: `Message ${barber.name.split(' ')[0]}`,
                  sub: 'In-app messaging',
                },
                {
                  icon: '🛡',
                  iconBg: navy,
                  label: `Contact ${config.serviceName}`,
                  sub: 'Platform support team',
                },
              ].map((opt) => (
                <div
                  key={opt.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: `1px solid ${border}`,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: opt.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{opt.sub}</div>
                  </div>
                  <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>›</span>
                </div>
              ))}

              <button
                style={{
                  width: '100%',
                  marginTop: 16,
                  padding: '10px 0',
                  background: navy,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}
              >
                ⚠ SUPPORT
              </button>

              <button
                onClick={() => router.push('/home')}
                style={{
                  width: '100%',
                  marginTop: 8,
                  padding: '10px 0',
                  background: 'transparent',
                  color: navy,
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                }}
              >
                Book another appointment →
              </button>
            </div>

            {/* Card 3 — Client ID */}
            <div
              style={{
                background: `linear-gradient(135deg, ${navy} 0%, ${navyLight} 100%)`,
                borderRadius: 14,
                padding: '1.25rem 1.35rem',
                marginBottom: 16,
                color: '#fff',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: white50, marginBottom: 4 }}>
                Your Client ID
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: amber,
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                {client.id}
              </div>
              <div style={{ fontSize: '0.75rem', color: white50, lineHeight: 1.55 }}>
                This is your permanent Client ID across the {config.serviceName} network. Use it to
                check in, rebook, and verify your identity at any partnered barbershop.
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 900,
            margin: '12px auto 0',
            background: navy,
            borderRadius: '0 0 14px 14px',
            padding: '14px 0',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: white50,
          }}
        >
          © {config.copyrightYear} {config.companyName}
        </div>

        {/* bottom spacer */}
        <div style={{ height: 40 }} />

        <footer className="site-footer">
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>
    </>
  );
}
