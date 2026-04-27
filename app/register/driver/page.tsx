'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

/* ── Major IATA airport lookup ─────────────────────────────── */
const AIRPORT_NAMES: Record<string, string> = {
  ATL: 'Hartsfield-Jackson Atlanta', LAX: 'Los Angeles Intl', ORD: "O'Hare Chicago",
  DFW: 'Dallas/Fort Worth', DEN: 'Denver Intl', JFK: 'John F. Kennedy NYC',
  SFO: 'San Francisco Intl', SEA: 'Seattle-Tacoma', LAS: 'Harry Reid Las Vegas',
  MCO: 'Orlando Intl', EWR: 'Newark Liberty', MIA: 'Miami Intl',
  CLT: 'Charlotte Douglas', PHX: 'Phoenix Sky Harbor', IAH: 'George Bush Houston',
  HOU: 'William P. Hobby Houston', BOS: 'Boston Logan', MSP: 'Minneapolis-St Paul',
  DTW: 'Detroit Metro', FLL: 'Fort Lauderdale-Hollywood', BWI: 'Baltimore-Washington',
  SLC: 'Salt Lake City Intl', DCA: 'Ronald Reagan Washington', SAN: 'San Diego Intl',
  IAD: 'Washington Dulles', TPA: 'Tampa Intl', AUS: 'Austin-Bergstrom',
  STL: 'St. Louis Lambert', BNA: 'Nashville Intl', HNL: 'Honolulu Intl',
  OAK: 'Oakland Intl', MSY: 'Louis Armstrong New Orleans', PBI: 'Palm Beach Intl',
  RDU: 'Raleigh-Durham', SAT: 'San Antonio Intl', SNA: 'John Wayne Orange County',
  IND: 'Indianapolis Intl', MCI: 'Kansas City Intl', CLE: 'Cleveland Hopkins',
  SMF: 'Sacramento Intl', PIT: 'Pittsburgh Intl', MKE: 'Milwaukee Mitchell',
  PDX: 'Portland Intl', CMH: 'Columbus John Glenn', JAX: 'Jacksonville Intl',
  RSW: 'Fort Myers Southwest Florida', DAL: 'Dallas Love Field', MDW: 'Chicago Midway',
  ABQ: 'Albuquerque Intl', BUF: 'Buffalo Niagara', LGA: 'LaGuardia NYC',
};

export default function DriverRegistrationStep1() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [airportCodes, setAirportCodes] = useState<string[]>(['', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateAirport(index: number, value: string) {
    const v = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setAirportCodes((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  }

  const filledAirports = airportCodes.filter((c) => c.length === 3);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (filledAirports.length < 1) {
      setError('Please enter at least one airport code you serve.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`,
          phone: phone || undefined,
          city: city || undefined,
          state: state.toUpperCase() || undefined,
          airportCodes: filledAirports,
          role: 'driver',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      // Store driver code for next step
      if (data.driverCode) {
        sessionStorage.setItem('driverCode', data.driverCode);
      }

      // Navigate to credentials step
      router.push('/register/driver/step2');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      {/* ── Left branding panel ─────────────────────────── */}
      <div className="login-left">
        <div>
          <div className="login-logo">
            {prefix}<span>{highlight}</span>
          </div>
          <div className="login-tagline">{config.tagline}</div>

          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">Your clients, your rates, your schedule</div>
          </div>
          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">No commission cut — 100% of ride earnings are yours</div>
          </div>
          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">${config.subscriptionAmount}/week subscription — no contracts</div>
          </div>
          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">Get your own {config.providerLabel} Code to share with clients</div>
          </div>
          <div className="login-feature">
            <div className="lf-dot" />
            <div className="lf-text">Write down your {config.providerLabel} Code when assigned — free to recover with identity verification but save yourself the trouble</div>
          </div>
        </div>

        <div className="login-footer-text">
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────── */}
      <div className="login-right">
        <form onSubmit={handleSubmit}>
          {/* Progress bar — step 1 of 6 */}
          <div className="progress-bar mb-20">
            <div className="progress-step active" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
          </div>

          <div className="login-title">Create Your {config.providerLabel} Account</div>
          <div className="login-sub">Step 1 of 6 — Personal information</div>

          {error && <div className="form-error">{error}</div>}

          {/* Profile photo upload */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <label style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div className="upload-circle" style={{
                width: 100,
                height: 100,
                overflow: 'hidden',
                position: 'relative',
              }}>
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Profile preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>+</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Add photo</div>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProfilePhoto(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setProfilePhotoPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setProfilePhotoPreview('');
                  }
                }}
              />
            </label>
            <div className="t-small">
              {profilePhoto ? profilePhoto.name : 'Your photo appears on rider booking confirmations'}
            </div>
          </div>

          {/* Name row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input
                className="form-input"
                type="text"
                placeholder="James"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Rivera"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="james@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              type="tel"
              placeholder="(713) 555-0121"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* City + State row */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">City</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Houston"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">State</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. TX"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase().replace(/[^A-Z]/gi, '').slice(0, 2))}
                maxLength={2}
                style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Airports you serve */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13, letterSpacing: '.04em', marginBottom: 10, display: 'block' }}>
              AIRPORTS YOU SERVE
            </label>
            <div className="t-small" style={{ marginBottom: 10 }}>
              Enter IATA codes for airports you serve. Minimum 1 required.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {airportCodes.map((code, i) => (
                <div key={i} style={{ flex: '1 1 60px', minWidth: 60, maxWidth: 80 }}>
                  <input
                    className="form-input"
                    type="text"
                    maxLength={3}
                    placeholder={i === 0 ? 'IAH' : i === 1 ? 'HOU' : '---'}
                    value={code}
                    onChange={(e) => updateAirport(i, e.target.value)}
                    style={{
                      textAlign: 'center',
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 14,
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}
                  />
                  {code.length === 3 && AIRPORT_NAMES[code] && (
                    <div style={{ fontSize: 9, color: 'var(--text-2)', textAlign: 'center', marginTop: 2, lineHeight: 1.2 }}>
                      {AIRPORT_NAMES[code]}
                    </div>
                  )}
                  {code.length === 3 && !AIRPORT_NAMES[code] && (
                    <div style={{ fontSize: 9, color: 'var(--amber)', textAlign: 'center', marginTop: 2 }}>
                      Custom code
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              type="submit"
              className="btn btn-amber btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating account...' : 'Continue — Credentials \u2192'}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/')}
              style={{ width: '100%' }}
            >
              &larr; Back
            </button>
          </div>

          <div className="driver-link">
            <Link href="/">Already have an account? Sign in</Link>
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
