'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName, getLoginFeatures } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const features = getLoginFeatures();

  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeAirport, setCodeAirport] = useState('');
  const [codeInitials, setCodeInitials] = useState('');
  const [codeDigits, setCodeDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: Record<string, string> = { email, password, role };
      if (role === 'rider') {
        if (!codeAirport || !codeInitials || !codeDigits) {
          setError(`Enter your ${config.providerLabel} Code to continue.`);
          setLoading(false);
          return;
        }
        body.codeAirport = codeAirport.toUpperCase();
        body.codeInitials = codeInitials.toUpperCase();
        body.codeDigits = codeDigits;
        body.driverCode = `${codeAirport.toUpperCase()}${codeInitials.toUpperCase()}${codeDigits}`;
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
        router.push(role === 'driver' ? '/dashboard' : '/home');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      {/* ── Left panel: branding ─────────────────────────── */}
      <div className="login-left">
        <div>
          <div className="login-logo">
            {prefix}<span>{highlight}</span>
          </div>
          <div className="login-tagline">{config.tagline}</div>

          {/* Airport codes strip */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {config.airportCodes.map((code) => (
              <div
                key={code}
                style={{
                  background: 'rgba(245,166,35,.12)',
                  border: '1px solid rgba(245,166,35,.25)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#F5A623',
                }}
              >
                {code}
              </div>
            ))}
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.2)', padding: '3px 4px', alignSelf: 'center' }}>
              + every US airport
            </div>
          </div>

          {features.map((text, i) => (
            <div className="login-feature" key={i}>
              <div className="lf-dot" />
              <div className="lf-text">{text}</div>
            </div>
          ))}

          {role === 'driver' && (
            <div className="login-feature" style={{ marginTop: 8 }}>
              <div className="lf-dot" />
              <div className="lf-text" style={{ fontWeight: 600, fontSize: 13 }}>
                These aren&apos;t passengers. They&apos;re your clients. Treat them like it.
              </div>
            </div>
          )}
        </div>

        {/* Need a Regular Driver? CTA card */}
        <div style={{
          marginTop: '28px',
          padding: '18px 20px',
          background: 'rgba(245,166,35,.10)',
          border: '2px solid #F5A623',
          borderRadius: '14px',
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '15px',
            fontWeight: 800,
            color: '#F5A623',
            marginBottom: '4px',
          }}>
            Need a Regular Driver?
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,.5)',
            marginBottom: '12px',
            lineHeight: 1.5,
          }}>
            Daily &middot; Weekly &middot; Bi-Weekly<br />
            Airport runs &middot; Commutes &middot; Appointments<br />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,.3)' }}>
              One-time matching fee &middot; Free if you have a driver code
            </span>
          </div>
          <button
            onClick={() => router.push('/find-a-driver')}
            style={{
              width: '100%',
              background: '#0a0a2e',
              border: 'none',
              borderRadius: '9px',
              padding: '11px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#F5A623',
              cursor: 'pointer',
              fontFamily: 'Syne, sans-serif',
              transition: 'background .15s',
            }}>
            Find a Driver &rarr;
          </button>
        </div>

        <div className="login-footer-text" style={{ marginTop: '16px' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}
        </div>
      </div>

      {/* ── Right panel: login form ──────────────────────── */}
      <div className="login-right">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="login-title">Welcome back</div>
          <div className="login-sub">
            Sign in to {role === 'rider' ? `book your ${config.providerLabel.toLowerCase()}` : 'manage your clients'}
          </div>

          {/* Role toggle */}
          <div className="seg-control mb-20">
            <button
              type="button"
              className={`seg-opt ${role === 'rider' ? 'on' : ''}`}
              onClick={() => setRole('rider')}
            >
              {config.clientLabel}
            </button>
            <button
              type="button"
              className={`seg-opt ${role === 'driver' ? 'on' : ''}`}
              onClick={() => setRole('driver')}
            >
              {config.providerLabel}
            </button>
          </div>

          {error && <div className="form-error">{error}</div>}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Driver Code — rider only, 3-part input */}
          {role === 'rider' && (
            <div className="form-group">
              <label className="form-label">{config.providerLabel} Code</label>
              <div style={{
                display: 'flex',
                gap: 0,
                background: '#F7F7F8',
                border: '1.5px solid rgba(0,0,0,.09)',
                borderRadius: '10px',
                overflow: 'hidden',
                width: '100%',
                minWidth: 0,
              }}>
                {/* Airport code */}
                <input
                  type="text"
                  name="code_airport"
                  autoComplete="off"
                  maxLength={3}
                  placeholder="IAH"
                  value={codeAirport}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
                    setCodeAirport(v);
                    if (v.length === 3) (e.target.nextElementSibling?.nextElementSibling as HTMLInputElement)?.focus();
                  }}
                  style={{
                    flex: '1 1 30%',
                    minWidth: 0,
                    background: 'var(--surface)',
                    border: 'none',
                    padding: '10px 4px',
                    textAlign: 'center',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '14px',
                    color: '#0a0a2e',
                    outline: 'none',
                    letterSpacing: '.04em',
                  }}
                />
                <div style={{ width: '1px', background: 'rgba(0,0,0,.1)', flexShrink: 0 }} />
                {/* Initials */}
                <input
                  type="text"
                  name="code_initials"
                  autoComplete="off"
                  maxLength={3}
                  placeholder="JDR"
                  value={codeInitials}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
                    setCodeInitials(v);
                    if (v.length >= 2) (e.target.nextElementSibling?.nextElementSibling as HTMLInputElement)?.focus();
                  }}
                  style={{
                    flex: '1 1 28%',
                    minWidth: 0,
                    background: 'var(--surface)',
                    border: 'none',
                    padding: '10px 4px',
                    textAlign: 'center',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '14px',
                    color: '#0a0a2e',
                    outline: 'none',
                    letterSpacing: '.06em',
                  }}
                />
                <div style={{ width: '1px', background: 'rgba(255,255,255,.1)', flexShrink: 0 }} />
                {/* Digits */}
                <input
                  type="text"
                  name="code_digits"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4207"
                  value={codeDigits}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCodeDigits(v);
                  }}
                  style={{
                    flex: '1 1 42%',
                    minWidth: 0,
                    background: 'var(--surface)',
                    border: 'none',
                    padding: '10px 4px',
                    textAlign: 'center',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#0a0a2e',
                    outline: 'none',
                    letterSpacing: '.2em',
                  }}
                />
              </div>
              {/* Helper labels */}
              <div style={{ display: 'flex', marginTop: '5px' }}>
                <div style={{ flex: '1 1 30%', textAlign: 'center', fontSize: '9px', color: '#D4830A', fontWeight: 600 }}>Airport</div>
                <div style={{ flex: '0 0 1px' }} />
                <div style={{ flex: '1 1 28%', textAlign: 'center', fontSize: '9px', color: '#6B6B7A', fontWeight: 600 }}>Initials</div>
                <div style={{ flex: '0 0 1px' }} />
                <div style={{ flex: '1 1 42%', textAlign: 'center', fontSize: '9px', color: '#6B6B7A', fontWeight: 600 }}>Digits</div>
              </div>
              {/* Example code badge */}
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '10px', color: '#6B6B7A' }}>Example:</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{ background: '#F5A623', padding: '4px 8px', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 800, color: '#0a0a2e' }}>IAH</div>
                  <div style={{ background: '#0a0a2e', padding: '4px 7px', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 800, color: '#F5A623' }}>JDR</div>
                  <div style={{ background: '#12124a', padding: '4px 8px', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>4207</div>
                </div>
                <div style={{ fontSize: '10px', color: '#6B6B7A' }}>= Houston driver</div>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-full btn-lg mb-12 ${role === 'driver' ? '' : 'btn-amber'}`}
            style={{
              marginTop: '4px',
              ...(role === 'driver' ? { background: '#0a0a2e', color: '#F5A623', border: 'none' } : {}),
            }}
            disabled={loading}
          >
            {loading
              ? 'Signing in...'
              : role === 'rider'
                ? `Find My ${config.providerLabel}`
                : `${config.providerLabel} Login`}
          </button>

          {/* Helper links */}
          {role === 'rider' && (
            <div className="driver-link">
              Don&apos;t have a code? Request one from your {config.providerLabel.toLowerCase()}.
              &nbsp;|&nbsp;
              <Link href="#">Forgot password?</Link>
            </div>
          )}

          {role === 'driver' && (
            <div className="driver-link">
              <Link href="/forgot-code">Forgot your driver code?</Link>
            </div>
          )}

          <div className="driver-link mt-12">
            <Link href="/register/driver">
              Are you a {config.providerLabel.toLowerCase()}? Create your account &rarr;
            </Link>
          </div>

          <div className="driver-link" style={{ marginTop: 6 }}>
            <Link href="/register/rider">
              First time here? Create your rider account &rarr;
            </Link>
          </div>

          {/* Footer links */}
          <div className="page-footer">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/conditions">Conditions</Link>
            <span style={{ margin: '0 8px' }}>
              &copy; {config.copyrightYear} {config.serviceName}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
