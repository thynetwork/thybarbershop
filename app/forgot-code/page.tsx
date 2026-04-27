'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

export default function ForgotCodePage() {
  const { prefix, highlight } = splitServiceName();

  const [email, setEmail] = useState('');
  const [dlLast4, setDlLast4] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!email || !dlLast4 || dlLast4.length < 4) {
      setStatus('error');
      setMessage('Please enter your email and the last 4 digits of your driver\'s license.');
      return;
    }

    try {
      const res = await fetch('/api/auth/recover-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, dlLast4 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Information does not match our records. Contact support.');
        return;
      }

      setStatus('success');
      setMessage('Your driver code has been sent to your phone and email on file.');
    } catch {
      setStatus('error');
      setMessage('Information does not match our records. Contact support.');
    }
  }

  return (
    <div className="login-wrap">
      {/* Left branding panel */}
      <div className="login-left">
        <div>
          <div className="login-logo">
            {prefix}<span>{highlight}</span>
          </div>
          <div className="login-tagline">{config.tagline}</div>

          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">Your driver code is your identity on {config.serviceName}</div>
          </div>
          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">We verify your identity before sending it back to you</div>
          </div>
          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">Code is sent via SMS and email to your accounts on file</div>
          </div>
        </div>

        <div className="login-footer-text">
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <form onSubmit={handleSubmit}>
          <div className="login-title">Recover Your {config.providerLabel} Code</div>
          <div className="login-sub">
            Enter the email and DL last 4 digits you registered with
          </div>

          {status === 'error' && <div className="form-error">{message}</div>}
          {status === 'success' && (
            <div className="card-amber-tint mb-16" style={{ fontSize: 13, color: 'var(--amber-dim)', lineHeight: 1.5 }}>
              {message}
            </div>
          )}

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

          {/* DL last 4 */}
          <div className="form-group">
            <label className="form-label">DL last 4 digits</label>
            <input
              className="form-input"
              placeholder="Last 4 digits of your driver's license"
              value={dlLast4}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setDlLast4(v);
              }}
              maxLength={4}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.15em',
                textAlign: 'center',
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-amber btn-full btn-lg mb-12"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Verifying...' : 'Recover My Code'}
          </button>

          <div className="driver-link">
            <Link href="/">&larr; Back to sign in</Link>
          </div>

          {/* Footer */}
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
