'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

/* ── Types ─────────────────────────────────────────────────── */

export type RegistrationMode = 'invite' | 'find_a_driver' | 'manual';

export interface DriverInfo {
  id: string;
  name: string;
  initials: string;
  airportCode: string;
  codeInitials: string;
  codeDigits: string;
  airportPermitted?: boolean;
  insuranceVerified?: boolean;
  vehicleClass?: string;
  vehicleMakeModel?: string;
  rating?: number;
}

export interface PreSetAmount {
  amount: number;
}

interface Props {
  mode: RegistrationMode;
  driver?: DriverInfo;
  preSetAmount?: PreSetAmount;
}

/* ── Component ─────────────────────────────────────────────── */

export default function ClientRegistrationForm({ mode, driver, preSetAmount }: Props) {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [firstName, setFirstName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [noteToDriver, setNoteToDriver] = useState('');
  const [acceptedAmount, setAcceptedAmount] = useState<boolean | null>(null);

  // Manual mode: 3-part code entry
  const [codeAirport, setCodeAirport] = useState('');
  const [codeInitials, setCodeInitials] = useState('');
  const [codeDigits, setCodeDigits] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const driverFirstName = driver?.name.split(' ')[0] || '';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    // Manual mode: validate code fields
    if (mode === 'manual') {
      if (!codeAirport || !codeInitials || !codeDigits) {
        setError(`Enter a valid ${config.providerLabel} Code.`);
        return;
      }
    }

    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        email: email.trim(),
        password,
        name: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone.trim() || undefined,
        role: 'rider',
        preferredName: preferredName.trim() || undefined,
        noteToDriver: noteToDriver.trim() || undefined,
        source: mode,
      };

      // Attach driver code based on mode
      if (mode === 'invite' && driver) {
        body.codeAirport = driver.airportCode;
        body.codeInitials = driver.codeInitials;
        body.codeDigits = driver.codeDigits;
        body.driverCode = `${driver.airportCode}${driver.codeInitials}${driver.codeDigits}`;
        if (preSetAmount && acceptedAmount) {
          body.acceptedSetAmount = preSetAmount.amount;
        }
      } else if (mode === 'find_a_driver' && driver) {
        body.driverId = driver.id;
        body.codeAirport = driver.airportCode;
        body.codeInitials = driver.codeInitials;
        body.codeDigits = driver.codeDigits;
        body.driverCode = `${driver.airportCode}${driver.codeInitials}${driver.codeDigits}`;
      } else if (mode === 'manual') {
        body.codeAirport = codeAirport.toUpperCase();
        body.codeInitials = codeInitials.toUpperCase();
        body.codeDigits = codeDigits;
        body.driverCode = `${codeAirport.toUpperCase()}${codeInitials.toUpperCase()}${codeDigits}`;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      // Route based on mode
      if (mode === 'find_a_driver') {
        // FA4 → FA5 payment
        // Store client info in sessionStorage for FA5
        sessionStorage.setItem('fa_client_id', data.user?.id || '');
        sessionStorage.setItem('fa_client_name', `${firstName} ${lastName}`);
        sessionStorage.setItem('fa_client_display_id', data.clientId || '');
        const airport = driver?.airportCode || '';
        const driverId = driver?.id || '';
        router.push(`/find-a-driver/${airport}/${driverId}/request`);
      } else {
        // Invite + Manual → pending screen
        router.push('/pending');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {/* ── Driver invite card (Mode 1: invite) ──────────── */}
      {mode === 'invite' && driver && (
        <div className="invite-card">
          <div className="ic-label">You&apos;ve been invited by</div>
          <div className="ic-driver">
            <div className="avatar av-amber av-md av-check">{driver.initials}</div>
            <div>
              <div className="ic-name">{driver.name}</div>
              <div className="ic-badges">
                <div className="driver-code">
                  <div className="dc-airport">{driver.airportCode}</div>
                  <div className="dc-initials">{driver.codeInitials}</div>
                  <div className="dc-digits">{driver.codeDigits}</div>
                </div>
                {driver.airportPermitted && (
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>&#9992; {driver.airportCode}</span>
                )}
                {driver.insuranceVerified && (
                  <span className="badge badge-green" style={{ fontSize: 10 }}>&#10003; Insured</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Driver card (Mode 2: find_a_driver) ──────────── */}
      {mode === 'find_a_driver' && driver && (
        <div className="invite-card" style={{ marginBottom: 20 }}>
          <div className="ic-label">Almost there &mdash; create your account to request</div>
          <div className="ic-driver">
            <div className="avatar av-amber av-md">{driver.initials}</div>
            <div>
              <div className="ic-name">{driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0] || ''}.</div>
              <div className="ic-badges">
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  borderRadius: 6, overflow: 'hidden',
                }}>
                  <div style={{
                    background: 'var(--amber)', padding: '3px 7px',
                    fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 800, color: 'var(--navy)',
                  }}>{driver.airportCode}</div>
                  <div style={{
                    background: 'var(--navy)', padding: '3px 6px',
                    fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 800, color: 'rgba(245,166,35,.4)',
                  }}>{driver.codeInitials[0]}**</div>
                  <div style={{
                    background: 'var(--navy-mid)', padding: '3px 7px',
                    fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.25)',
                  }}>****</div>
                </div>
                {driver.vehicleClass && (
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>
                    {driver.vehicleClass.toUpperCase()}
                    {driver.rating ? ` \u00B7 \u2605 ${driver.rating}` : ''}
                    {driver.vehicleMakeModel ? ` \u00B7 ${driver.vehicleMakeModel}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Title ────────────────────────────────────────── */}
      {mode !== 'find_a_driver' && (
        <>
          <div className="t-display mb-4">Create your account</div>
          <div className="t-small mb-20" style={{ color: 'var(--text-2)' }}>
            Takes 2 minutes. No payment required.
          </div>
        </>
      )}

      {error && <div className="form-error">{error}</div>}

      {/* ── Name fields ──────────────────────────────────── */}
      <div className="form-row" style={{ marginBottom: 0 }}>
        <div className="form-group">
          <label className="form-label">First name</label>
          <input
            className="form-input"
            placeholder="Todd"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Preferred name <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            className="form-input"
            placeholder={mode === 'invite' && driverFirstName ? `What ${driverFirstName} calls you` : 'What your driver calls you'}
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Last name</label>
        <input
          className="form-input"
          placeholder="Williams"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="todd@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone</label>
        <input
          className="form-input"
          type="tel"
          placeholder="(713) 555-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>

      {/* ── Driver code — locked (invite mode) ───────────── */}
      {mode === 'invite' && driver && (
        <div className="form-group">
          <label className="form-label">
            {config.providerLabel} code{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              &middot; Invited by {driver.name}
            </span>
          </label>
          <div className="code-locked">
            <div className="cl-airport">{driver.airportCode}</div>
            <div className="cl-sep" />
            <div className="cl-initials">{driver.codeInitials}</div>
            <div className="cl-sep2" />
            <div className="cl-digits">{driver.codeDigits}</div>
          </div>
          <div className="locked-label">&#128274; Pre-filled from your invite link &middot; not editable</div>
        </div>
      )}

      {/* ── Driver code — manual entry (manual mode) ──────── */}
      {mode === 'manual' && (
        <div className="form-group">
          <label className="form-label">{config.providerLabel} Code</label>
          <div style={{
            display: 'flex', gap: 0,
            background: '#F7F7F8', border: '1.5px solid rgba(0,0,0,.09)',
            borderRadius: 10, overflow: 'hidden', width: '100%',
          }}>
            <input
              type="text"
              name="code_airport"
              autoComplete="off"
              maxLength={3}
              placeholder="HTX"
              value={codeAirport}
              onChange={(e) => {
                const v = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
                setCodeAirport(v);
                if (v.length === 3) (e.target.nextElementSibling?.nextElementSibling as HTMLInputElement)?.focus();
              }}
              style={{
                flex: '1 1 30%', minWidth: 0, background: 'var(--surface)', border: 'none',
                padding: '10px 4px', textAlign: 'center', fontFamily: "'Syne', sans-serif",
                fontWeight: 800, fontSize: 14, color: '#0a0a2e', outline: 'none', letterSpacing: '.04em',
              }}
            />
            <div style={{ width: 1, background: 'rgba(0,0,0,.1)', flexShrink: 0 }} />
            <input
              type="text"
              name="code_initials"
              autoComplete="off"
              maxLength={3}
              placeholder="MRC"
              value={codeInitials}
              onChange={(e) => {
                const v = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
                setCodeInitials(v);
                if (v.length >= 2) (e.target.nextElementSibling?.nextElementSibling as HTMLInputElement)?.focus();
              }}
              style={{
                flex: '1 1 28%', minWidth: 0, background: 'var(--surface)', border: 'none',
                padding: '10px 4px', textAlign: 'center', fontFamily: "'Syne', sans-serif",
                fontWeight: 800, fontSize: 14, color: '#0a0a2e', outline: 'none', letterSpacing: '.06em',
              }}
            />
            <div style={{ width: 1, background: 'rgba(255,255,255,.1)', flexShrink: 0 }} />
            <input
              type="text"
              name="code_digits"
              autoComplete="off"
              inputMode="numeric"
              maxLength={4}
              placeholder="3341"
              value={codeDigits}
              onChange={(e) => setCodeDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
              style={{
                flex: '1 1 42%', minWidth: 0, background: 'var(--surface)', border: 'none',
                padding: '10px 4px', textAlign: 'center', fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 14, color: '#0a0a2e', outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* ── Fee notice (find_a_driver mode only) ──────────── */}
      {mode === 'find_a_driver' && (
        <div className="card-info mb-16">
          <div style={{ fontSize: 12, color: 'var(--blue)', lineHeight: 1.6 }}>
            &#8505; &nbsp;Your $9.99 is a one-time access fee that covers all future searches. If this driver does not respond or is unable to accept &mdash; you can keep searching at no additional cost. Your Client ID stays the same &mdash; you never register again.
          </div>
        </div>
      )}

      {/* ── Note to driver (invite + manual only — NOT find_a_driver) ── */}
      {mode !== 'find_a_driver' && (
        <div className="form-group">
          <label className="form-label">
            Note to driver <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea
            className="form-input"
            rows={3}
            maxLength={160}
            placeholder={
              mode === 'invite' && driverFirstName
                ? `Remind your driver who you are or reference your conversation\ne.g. Hey ${driverFirstName}, this is Sarah — airport trip $80. See you Thursday!`
                : 'Remind your barber who you are or reference your conversation\ne.g. Hey Marcus, this is Sarah — regular fade $50'
            }
            value={noteToDriver}
            onChange={(e) => setNoteToDriver(e.target.value.slice(0, 160))}
            style={{ resize: 'none', fontFamily: "'DM Sans', sans-serif" }}
          />
          <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right', marginTop: 3 }}>
            {noteToDriver.length}/160 characters &middot; appears on driver notification
          </div>
        </div>
      )}

      {/* ── Pre-set amount (invite mode, only if driver set one) ── */}
      {mode === 'invite' && preSetAmount && (
        <div style={{
          background: 'rgba(245,166,35,.08)', border: '1.5px solid rgba(245,166,35,.3)',
          borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--amber-dim)',
            letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            {driverFirstName} suggested
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 10 }}>
            This is the rate {driverFirstName} set before sharing this link with you.
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--navy)',
            }}>
              ${preSetAmount.amount.toFixed(2)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <button
                type="button"
                className={`btn btn-sm ${acceptedAmount === true ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setAcceptedAmount(true)}
              >
                Accept ${preSetAmount.amount.toFixed(2)}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${acceptedAmount === false ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setAcceptedAmount(false)}
              >
                Discuss with driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit ───────────────────────────────────────── */}
      <button
        type="submit"
        className="btn btn-primary btn-full btn-lg mb-12"
        disabled={loading}
      >
        {loading
          ? 'Creating account...'
          : mode === 'find_a_driver'
          ? 'Continue \u2014 Review & Pay \u2192'
          : 'Create my account \u2192'
        }
      </button>

      {/* ── Back / secondary links ───────────────────────── */}
      {mode === 'find_a_driver' && (
        <button
          type="button"
          className="btn btn-ghost btn-full"
          onClick={() => router.back()}
        >
          &larr; Back to profile
        </button>
      )}

      {mode !== 'find_a_driver' && (
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-2)' }}>
          Already have an account? <Link href="/" style={{ color: 'var(--navy)', fontWeight: 500 }}>Sign in</Link>
        </div>
      )}
    </form>
  );
}
