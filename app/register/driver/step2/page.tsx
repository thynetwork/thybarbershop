'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

export default function DriverStep2() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [dlState, setDlState] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [legalName, setLegalName] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [coverageType, setCoverageType] = useState<'Rideshare' | 'Commercial' | 'Personal'>('Rideshare');
  const [error, setError] = useState('');

  const dlLast4 = dlNumber.slice(-4);

  function handleContinue() {
    setError('');
    if (!dlState || dlState.length < 2) {
      setError('Please enter your 2-letter state code.');
      return;
    }
    if (!dlNumber || dlNumber.length < 4) {
      setError('Please enter your full driver\'s license number.');
      return;
    }
    if (!legalName) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!insuranceProvider || !policyNumber) {
      setError('Please enter your insurance information.');
      return;
    }
    sessionStorage.setItem('driverStep2', JSON.stringify({
      dlState, dlNumber, dlLast4: dlNumber.slice(-4), legalName, insuranceProvider, policyNumber, coverageType,
    }));
    router.push('/register/driver/step2b');
  }

  return (
    <div className="app-shell">
      <div className="layout-2col">
        {/* Main form */}
        <div className="main-content">
          {/* Progress bar */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step active" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
          </div>

          <div className="t-title mb-4">Credentials &amp; Safety Protocol</div>
          <div className="t-small mb-16">Step 2 of 6 — Stored encrypted, never shown publicly</div>

          {error && <div className="form-error">{error}</div>}

          {/* Security notice */}
          <div className="card-surface mb-16" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
            <div style={{ fontSize: 16, flexShrink: 0 }}>&#128274;</div>
            Your DL digits, insurance policy, and emergency contact are encrypted and stored securely. Visible to {config.serviceName} admin only — never to {config.clientLabel.toLowerCase()}s.
          </div>

          {/* US Driver's License */}
          <div className="t-label mb-12">US DRIVER&apos;S LICENSE</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.5 }}>
            Enter your 2-letter state code and full license number
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: '0 0 90px' }}>
              <label className="form-label">State</label>
              <input
                className="form-input"
                placeholder="e.g. TX"
                value={dlState}
                onChange={(e) => setDlState(e.target.value.toUpperCase().replace(/[^A-Z]/gi, '').slice(0, 2))}
                maxLength={2}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">License number</label>
              <input
                className="form-input"
                placeholder="e.g. 12345678"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              />
            </div>
          </div>

          {/* Full legal name */}
          <div className="form-group">
            <label className="form-label">Full legal name (must match DL)</label>
            <input
              className="form-input"
              placeholder="James Antonio Rivera"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
            />
          </div>

          <hr className="divider" />

          {/* Insurance */}
          <div className="t-label mb-12">Insurance</div>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">Insurance provider</label>
              <input
                className="form-input"
                placeholder="Allstate"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Policy number</label>
              <input
                className="form-input"
                placeholder="AL-TX-4471920"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Coverage type */}
          <div className="form-group">
            <label className="form-label">Coverage type</label>
            <div className="seg-control">
              {(['Rideshare', 'Commercial', 'Personal'] as const).map((t) => (
                <button
                  key={t}
                  className={`seg-opt${coverageType === t ? ' on' : ''}`}
                  onClick={() => setCoverageType(t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleContinue}
              style={{ width: '100%' }}
            >
              Continue — Emergency Contact &rarr;
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/register/driver')}
              style={{ width: '100%' }}
            >
              &larr; Back
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">Why we need this</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Driver&apos;s License</div>
              <div className="t-small">Verifies your identity as a licensed US driver. State and license number are encrypted and locked after admin verification.</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Insurance</div>
              <div className="t-small">Your coverage type and provider are displayed as a trust badge on your public profile. {config.clientLabel}s need to see this before booking.</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="t-label mb-8">Your profile badges</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="badge badge-green">&#10003; DL &middot; ****{dlLast4 || '----'}</span>
            <span className="badge badge-green">&#10003; Insurance &middot; {insuranceProvider || 'Provider'}</span>
            <span className="badge badge-green">&#10003; Safety Protocol</span>
          </div>
          <div className="t-small mt-8">These badges appear on your profile once your credentials are verified.</div>
        </div>
      </div>
    </div>
  );
}
