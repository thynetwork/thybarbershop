'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName, getLoginFeatures } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const features = getLoginFeatures();

  const [role, setRole] = useState<'client' | 'barber'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeCity, setCodeCity] = useState('');
  const [codeState, setCodeState] = useState('');
  const [codeInitials, setCodeInitials] = useState('');
  const [codeDigits, setCodeDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: Record<string, string> = {
        email,
        password,
        role: role === 'client' ? 'rider' : 'driver',
      };
      if (role === 'client') {
        if (!codeCity || !codeState || !codeInitials || !codeDigits) {
          setError(`Enter your ${config.providerLabel} Code to continue.`);
          setLoading(false);
          return;
        }
        body.codeAirport = codeCity.toUpperCase();
        body.codeState = codeState.toUpperCase();
        body.codeInitials = codeInitials.toUpperCase();
        body.codeDigits = codeDigits;
        body.driverCode = `${codeCity.toUpperCase()}${codeState.toUpperCase()}${codeInitials.toUpperCase()}${codeDigits}`;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data.redirect) {
        router.push(data.redirect);
      } else {
        router.push(role === 'barber' ? '/dashboard' : '/home');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh', minHeight: 600 }}>

      {/* ── LEFT PANEL — BRAND ──────────────────────────────── */}
      <div style={{
        background: 'var(--navy)',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(26,26,110,0.6) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(245,166,35,0.06) 0%, transparent 50%)',
        padding: '48px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Barberpole stripe accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 3, height: '100%',
          background: 'repeating-linear-gradient(180deg, var(--amber) 0px, var(--amber) 18px, transparent 18px, transparent 36px, #fff 36px, #fff 54px, transparent 54px, transparent 72px)',
          opacity: 0.12,
        }} />

        <div>
          {/* Logo */}
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
            {prefix}<span style={{ color: 'var(--amber)' }}>{highlight}</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>
            {config.tagline}
          </div>

          {/* City pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
            {config.locationPills.map((pill) => (
              <div key={pill} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--r-full)', padding: '4px 12px',
                fontSize: 10, fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.06em',
              }}>{pill}</div>
            ))}
            <div style={{
              background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.5)',
              borderRadius: 'var(--r-full)', padding: '4px 12px',
              fontSize: 10, fontWeight: 700, color: 'var(--amber)',
            }}>+ every city</div>
          </div>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {features.map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', marginTop: 5, flexShrink: 0, opacity: 0.7 }} />
                <span dangerouslySetInnerHTML={{ __html: text.replace(/^([^.!]+[.!])/, '<strong style="color:rgba(255,255,255,0.85);font-weight:500;">$1</strong>') }} />
              </div>
            ))}
          </div>

          {/* Find a Barber card */}
          <div
            onClick={() => router.push('/find-a-driver')}
            style={{
              background: 'rgba(245,166,35,0.08)', border: '2px solid rgba(245,166,35,0.55)',
              borderRadius: 'var(--r-lg)', padding: '1.2rem', cursor: 'pointer',
              boxShadow: '0 0 0 1px rgba(245,166,35,0.15), 0 4px 20px rgba(245,166,35,0.08)',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 800, color: 'var(--amber)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              Need a Regular {config.providerLabel}?
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.9rem', lineHeight: 1.5 }}>
              Search the pool anytime.
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%',
              background: 'var(--amber)', border: 'none', borderRadius: 'var(--r-lg)',
              padding: '0.85rem 1rem', fontFamily: "'Syne', sans-serif", fontSize: '0.9rem',
              fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.04em', cursor: 'pointer',
            }}>
              Find a {config.providerLabel} &rarr;
            </button>
          </div>
        </div>

        {/* Bottom legal */}
        <div style={{
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.8,
          textAlign: 'center', width: '100%', paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          {config.serviceName} is a private platform by {config.companyName}<br />
          Professionals own their client relationships here.<br />
          &copy; {config.copyrightYear} {config.companyName} All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL — FORM ──────────────────────────────── */}
      <div style={{
        background: 'var(--surface)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '48px 44px', position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Header */}
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>
              Welcome back
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>
              {role === 'client' ? `Sign in to book your ${config.providerLabel.toLowerCase()}` : 'Sign in to manage your clients'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 22, lineHeight: 1.6 }}>
              Private booking between you and your {config.providerLabel.toLowerCase()}.<br />
              No app store. No algorithm. No strangers.
            </div>

            {/* Toggle */}
            <div style={{
              background: '#EBEBED', borderRadius: 'var(--r-lg)', padding: 4,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 22,
            }}>
              <button
                type="button"
                onClick={() => setRole('client')}
                style={{
                  border: 'none', borderRadius: 'var(--r-md)', padding: '9px 0',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: role === 'client' ? '#fff' : 'transparent',
                  color: role === 'client' ? 'var(--text-1)' : 'var(--text-3)',
                  boxShadow: role === 'client' ? '0 2px 8px rgba(0,0,0,0.10)' : 'none',
                }}
              >{config.clientLabel}</button>
              <button
                type="button"
                onClick={() => setRole('barber')}
                style={{
                  border: 'none', borderRadius: 'var(--r-md)', padding: '9px 0',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: role === 'barber' ? 'var(--navy)' : 'transparent',
                  color: role === 'barber' ? 'var(--amber)' : 'var(--text-3)',
                  boxShadow: role === 'barber' ? '0 2px 8px rgba(0,0,0,0.10)' : 'none',
                }}
              >{config.providerLabel}</button>
            </div>

            {error && <div className="form-error">{error}</div>}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {/* Barber Code — client only, 4-part: City · State · Initials · Digits */}
            {role === 'client' && (
              <div className="form-group">
                <label className="form-label">{config.providerLabel} Code</label>
                <div style={{
                  display: 'flex', borderRadius: 'var(--r-md)', overflow: 'hidden',
                  border: '2px solid rgba(0,0,0,0.15)',
                }}>
                  {/* City/Town — wider, full name */}
                  <input
                    type="text" maxLength={15} placeholder="Huntsville" value={codeCity}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 15);
                      setCodeCity(v);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Tab') {
                        if (codeCity.length >= 2) document.getElementById('seg-state')?.focus();
                        if (e.key === ' ') e.preventDefault();
                      }
                    }}
                    style={{
                      border: 'none', outline: 'none', fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: '0.8rem', padding: '0.7rem 0.4rem',
                      textAlign: 'center', textTransform: 'uppercase', flex: 3,
                      background: '#F5A623', color: '#0a0a2e', borderRight: '3px solid #fff',
                      minWidth: 0,
                    }}
                  />
                  {/* State — 2 char */}
                  <input
                    id="seg-state" type="text" maxLength={2} placeholder="TX" value={codeState}
                    onChange={(e) => {
                      const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
                      setCodeState(v);
                      if (v.length === 2) document.getElementById('seg-init')?.focus();
                    }}
                    style={{
                      border: 'none', outline: 'none', fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: '0.85rem', padding: '0.7rem 0.3rem',
                      textAlign: 'center', textTransform: 'uppercase', flex: 0.8,
                      background: '#0a0a2e', color: '#F5A623', borderRight: '3px solid #fff',
                      minWidth: 0,
                    }}
                  />
                  {/* Initials — 2-3 char */}
                  <input
                    id="seg-init" type="text" maxLength={3} placeholder="MJW" value={codeInitials}
                    onChange={(e) => {
                      const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
                      setCodeInitials(v);
                      if (v.length >= 2) document.getElementById('seg-digits')?.focus();
                    }}
                    style={{
                      border: 'none', outline: 'none', fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: '0.85rem', padding: '0.7rem 0.3rem',
                      textAlign: 'center', textTransform: 'uppercase', flex: 0.8,
                      background: '#0a0a2e', color: 'rgba(255,255,255,0.85)', borderRight: '3px solid #fff',
                      minWidth: 0,
                    }}
                  />
                  {/* Digits — 4-5 */}
                  <input
                    id="seg-digits" type="text" maxLength={5} placeholder="8096" value={codeDigits}
                    inputMode="numeric"
                    onChange={(e) => setCodeDigits(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    style={{
                      border: 'none', outline: 'none', fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: '0.85rem', padding: '0.7rem 0.3rem',
                      textAlign: 'center', flex: 1,
                      background: '#12124a', color: '#fff',
                      minWidth: 0,
                    }}
                  />
                </div>
                {/* Labels */}
                <div style={{ display: 'flex', marginTop: 4 }}>
                  <div style={{ flex: 3, textAlign: 'center', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--amber-dim)' }}>City / Town</div>
                  <div style={{ flex: 0.8, textAlign: 'center', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>State</div>
                  <div style={{ flex: 0.8, textAlign: 'center', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Initials</div>
                  <div style={{ flex: 1, textAlign: 'center', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Digits</div>
                </div>
                {/* Example */}
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-3)', lineHeight: 1.6 }}>
                  Example: <strong style={{ color: 'var(--text-2)' }}>Huntsville &middot; TX &middot; MJW &middot; 8096</strong>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 6 }}>
              <Link href="#" style={{ fontSize: 11, color: 'var(--amber-dim)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>

            {/* Barber note — barber mode only */}
            {role === 'barber' && (
              <div style={{
                background: 'rgba(10,10,46,0.05)', border: '1px solid rgba(10,10,46,0.1)',
                borderRadius: 'var(--r-md)', padding: '10px 14px',
                fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14, fontStyle: 'italic',
              }}>
                <strong style={{ color: 'var(--navy)', fontStyle: 'normal' }}>Barbers:</strong> These aren&apos;t customers. They&apos;re your clients. Your list. Your rates. Your relationship &mdash; protected.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', border: 'none', borderRadius: 'var(--r-lg)', padding: 14,
                fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800,
                cursor: 'pointer', letterSpacing: '0.04em', marginBottom: 16,
                background: role === 'barber' ? 'var(--amber)' : 'var(--navy)',
                color: role === 'barber' ? 'var(--navy)' : 'var(--amber)',
              }}
            >
              {loading ? 'Signing in...' : role === 'client' ? `Book My ${config.providerLabel}` : 'Enter My Dashboard'}
            </button>

            {/* Bottom links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>
                Don&apos;t have a code? Request one from your {config.providerLabel.toLowerCase()}.
              </div>
              <Link href="/register/rider" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}>
                First time here? Create your {config.clientLabel.toLowerCase()} account &rarr;
              </Link>
              {role === 'client' && (
                <Link href="/register/driver" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}>
                  Are you a {config.providerLabel.toLowerCase()}? Create your account &rarr;
                </Link>
              )}
            </div>

            {/* Legal footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              <Link href="/privacy" style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-3)', textDecoration: 'none', padding: '0.2rem 0', borderRight: '1px solid rgba(0,0,0,0.12)' }}>Privacy</Link>
              <Link href="/terms" style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-3)', textDecoration: 'none', padding: '0.2rem 0', borderRight: '1px solid rgba(0,0,0,0.12)' }}>Terms</Link>
              <Link href="/conditions" style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-3)', textDecoration: 'none', padding: '0.2rem 0' }}>Conditions</Link>
              <div style={{ width: '100%', textAlign: 'center', fontSize: '0.62rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>
                &copy; {config.copyrightYear} {config.companyName} All rights reserved.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
