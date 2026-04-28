'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

interface PayMethod {
  key: string;
  name: string;
  iconClass: string;
  iconText: string;
  placeholder: string;
  enabled: boolean;
  handle: string;
}

export default function DriverStep5() {
  const router = useRouter();

  const [payMethods, setPayMethods] = useState<PayMethod[]>([
    { key: 'zelle', name: 'Zelle', iconClass: 'pi-z', iconText: 'Z', placeholder: 'mrivera@email.com', enabled: true, handle: '' },
    { key: 'venmo', name: 'Venmo', iconClass: 'pi-v', iconText: 'V', placeholder: '@marcus-rivera-htx', enabled: true, handle: '' },
    { key: 'cashapp', name: 'Cash App', iconClass: 'pi-c', iconText: '$', placeholder: '$MarcusHTX', enabled: true, handle: '' },
    { key: 'stripe', name: 'Stripe', iconClass: 'pi-s', iconText: 'St', placeholder: 'Enter email to generate payment link', enabled: false, handle: '' },
  ]);
  const [cashAccepted, setCashAccepted] = useState(false);

  const [paymentTiming, setPaymentTiming] = useState<'booking' | 'pickup' | 'end'>('pickup');
  const [welcomeOffer, setWelcomeOffer] = useState(false);
  const [welcomeOfferRide, setWelcomeOfferRide] = useState<'first' | 'second'>('first');
  const [error, setError] = useState('');
  const [professionalStandard, setProfessionalStandard] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get driver code from session for right panel display
  const driverCode = typeof window !== 'undefined' ? sessionStorage.getItem('driverCode') || '' : '';
  const codeParts = driverCode ? [driverCode.slice(0, 3), driverCode.slice(3, 6), driverCode.slice(6)] : ['SHT', 'MRC', '3341'];

  function toggleMethod(key: string) {
    setPayMethods((prev) =>
      prev.map((m) => m.key === key ? { ...m, enabled: !m.enabled } : m)
    );
  }

  function updateHandle(key: string, handle: string) {
    setPayMethods((prev) =>
      prev.map((m) => m.key === key ? { ...m, handle } : m)
    );
  }

  async function handleLaunch() {
    setError('');
    const enabledWithHandle = payMethods.filter((m) => m.enabled && m.handle.trim());
    if (enabledWithHandle.length === 0 && !cashAccepted) {
      setError('Enable at least one payment method.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push('/register/driver/step6');
  }

  return (
    <div className="app-shell">
      <div className="layout-2col">
        {/* Main form */}
        <div className="main-content">
          {/* Progress bar */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step active" />
            <div className="progress-step" />
          </div>

          <div className="t-title mb-4">Payment setup</div>
          <div className="t-small mb-20">Step 5 of 6 — How your clients pay you directly</div>

          {error && <div className="form-error">{error}</div>}

          {/* Explanation */}
          <div className="card-surface mb-16" style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Clients pay you directly through your own accounts. {config.serviceName} never holds or transfers money between you and your clients. Enable the methods you accept.
          </div>

          {/* Payment methods */}
          {payMethods.map((m) => (
            <div
              key={m.key}
              className={`pay-method${m.enabled ? ' sel' : ''}`}
              onClick={() => { if (!m.enabled) toggleMethod(m.key); }}
            >
              <div className={`pay-icon ${m.iconClass}`}>{m.iconText}</div>
              <div className="pay-info">
                <div className="pay-name">{m.name}</div>
                {m.enabled ? (
                  <input
                    className="form-input"
                    placeholder={m.placeholder}
                    value={m.handle}
                    onChange={(e) => updateHandle(m.key, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: 6, marginBottom: 0 }}
                  />
                ) : (
                  <div className="pay-handle">Enter {m.name.toLowerCase()} handle to enable</div>
                )}
              </div>
              {m.enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                  <div className="upload-box" style={{ padding: '6px 10px', fontSize: 11 }}>Upload QR</div>
                </div>
              )}
            </div>
          ))}

          {/* Cash payment */}
          <div
            className={`pay-method${cashAccepted ? ' sel' : ''}`}
            onClick={() => setCashAccepted(!cashAccepted)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pay-icon" style={{ background: '#22c55e', color: '#fff', fontWeight: 800, fontSize: 14 }}>$</div>
            <div className="pay-info">
              <div className="pay-name">Cash</div>
              <div className="pay-handle" style={{ fontSize: 11 }}>
                {cashAccepted ? 'Cash payments accepted' : 'Toggle to accept cash payments'}
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 24,
                background: cashAccepted ? 'var(--navy)' : 'var(--surface-2)',
                borderRadius: 12,
                position: 'relative',
                border: cashAccepted ? 'none' : '1px solid var(--border-mid)',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  background: cashAccepted ? 'var(--amber)' : 'var(--white)',
                  borderRadius: '50%',
                  top: 3,
                  right: cashAccepted ? 3 : 'auto',
                  left: cashAccepted ? 'auto' : 3,
                  transition: 'all 0.15s',
                }}
              />
            </div>
          </div>

          <hr className="divider" />

          {/* Payment timing */}
          <div className="form-group">
            <label className="form-label">Payment timing preference</label>
            <div className="seg-control">
              {([
                { key: 'booking' as const, label: 'At booking' },
                { key: 'pickup' as const, label: 'On pickup' },
                { key: 'end' as const, label: 'End of ride' },
              ]).map((t) => (
                <button
                  key={t.key}
                  className={`seg-opt${paymentTiming === t.key ? ' on' : ''}`}
                  onClick={() => setPaymentTiming(t.key)}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* Welcome Offer */}
          <div className="t-label mb-12">Welcome Offer</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)',
              borderRadius: 'var(--r-md)',
              padding: '14px 16px',
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Credit $9.99 to a new client</div>
              <div className="t-small mt-8">Applied on their first or second ride with you</div>
            </div>
            <div
              onClick={() => setWelcomeOffer(!welcomeOffer)}
              style={{
                width: 44,
                height: 24,
                background: welcomeOffer ? 'var(--navy)' : 'var(--surface-2)',
                borderRadius: 12,
                position: 'relative',
                cursor: 'pointer',
                border: welcomeOffer ? 'none' : '1px solid var(--border-mid)',
                transition: 'background 0.15s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  background: welcomeOffer ? 'var(--amber)' : 'var(--white)',
                  borderRadius: '50%',
                  top: 3,
                  right: welcomeOffer ? 3 : 'auto',
                  left: welcomeOffer ? 'auto' : 3,
                  transition: 'all 0.15s',
                }}
              />
            </div>
          </div>
          {welcomeOffer && (
            <div className="seg-control mb-16">
              <button
                className={`seg-opt${welcomeOfferRide === 'first' ? ' on' : ''}`}
                onClick={() => setWelcomeOfferRide('first')}
                type="button"
              >
                First ride
              </button>
              <button
                className={`seg-opt${welcomeOfferRide === 'second' ? ' on' : ''}`}
                onClick={() => setWelcomeOfferRide('second')}
                type="button"
              >
                Second ride
              </button>
            </div>
          )}

          {/* Professional Standard */}
          <hr className="divider" />
          <div className="t-label mb-12">ThyBarberShop Professional Standard</div>
          <div className="card-surface mb-16">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={professionalStandard}
                onChange={(e) => setProfessionalStandard(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--navy)', marginTop: 2, flexShrink: 0 }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
                I represent myself and my clients with professionalism on every ride
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: 28 }}>
              Your clients are business professionals and frequent travelers. They chose you over Uber because they want consistency, reliability, and professionalism.
              <br /><br />
              Every ride is a chance to keep a client for life &mdash; or lose one forever.
              <br /><br />
              As a {config.serviceName} driver you agree to:
              <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
                <li>Present yourself in clean professional attire</li>
                <li>No athletic wear, torn clothing, or sleepwear</li>
                <li>Clean and groomed appearance at every pickup</li>
                <li>Vehicle clean and free of strong odors</li>
                <li>On time, every time</li>
              </ul>
              {config.serviceName} drivers hold themselves to a professional standard because their clients are worth it.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              type="button"
              className="btn btn-amber btn-lg"
              onClick={handleLaunch}
              disabled={loading || !professionalStandard}
              style={{ width: '100%', fontSize: 16, opacity: professionalStandard ? 1 : 0.4 }}
            >
              {loading ? 'Saving...' : 'Continue \u2014 Subscription'} &rarr;
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/register/driver/step4')}
              style={{ width: '100%' }}
            >
              &larr; Back
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">Setup checklist</div>
          <div className="card-surface mb-12">
            <div className="row"><span className="row-label">Personal info</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Credentials</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Safety Protocol</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Rates</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Vehicle</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Payment</span><span className="badge badge-amber">In progress</span></div>
            <div className="row"><span className="row-label">Subscription</span><span className="badge">Next</span></div>
          </div>

          <div className="t-label mb-8">What happens next</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Your profile goes live</div>
              <div className="t-small">{config.domain}/{codeParts[0]}&middot;{codeParts[1]}&middot;{codeParts[2]} is instantly active</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Share your code</div>
              <div className="t-small">Text {codeParts[0]}&middot;{codeParts[1]}&middot;{codeParts[2]} to your existing clients tonight</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Weekly subscription</div>
              <div className="t-small">${config.subscriptionAmount}/week. No contracts, cancel anytime.</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="t-label mb-8">How {config.serviceName} Works for You</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Instant notifications</div>
              <div className="t-small">Get SMS, email, and push alerts every time a client books through your code. Respond on your terms.</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Your response time</div>
              <div className="t-small">Confirm or deny within the window you set. No pressure, no penalties for being busy.</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Client ownership</div>
              <div className="t-small">Every client who books through your code stays yours. We never reassign your clients to other drivers.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
