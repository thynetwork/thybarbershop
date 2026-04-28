'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ── Stripe Subscription Form ── */
function SubscriptionForm({ onSuccess }: { onSuccess: (paymentIntentId: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoadingIntent(true);
    setErrorMsg('');
    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subscription' }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setErrorMsg(data.error || 'Unable to initialize payment.');
        }
      })
      .catch(() => setErrorMsg('Unable to connect to payment server.'))
      .finally(() => setLoadingIntent(false));
  }, []);

  const handleSubscribe = async () => {
    if (!stripe || !elements || !clientSecret || processing) return;
    setProcessing(true);
    setErrorMsg('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMsg('Card element not found.');
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setErrorMsg(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setErrorMsg('Payment was not completed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div className="t-label mb-12">Pay with</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--surface)', border: '1.5px solid var(--amber)',
          borderRadius: 'var(--r-md)', padding: '12px 14px',
          marginBottom: 14,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: '#635BFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: 'var(--white)',
            fontFamily: "'Syne', sans-serif", flexShrink: 0,
          }}>St</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>Credit / Debit card</div>
            <div className="t-small">Via Stripe &middot; Secure payment</div>
          </div>
          <span className="badge badge-green">Selected</span>
        </div>

        {loadingIntent ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-2)', fontSize: 13 }}>
            Loading payment form...
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: 14,
          }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '15px',
                    color: 'var(--text-1, #1a1a2e)',
                    '::placeholder': { color: 'var(--text-3, #999)' },
                    fontFamily: "'Inter', sans-serif",
                  },
                  invalid: { color: '#e53e3e' },
                },
              }}
            />
          </div>
        )}
      </div>

      {errorMsg && (
        <div style={{
          color: '#e53e3e',
          fontSize: 12,
          marginBottom: 12,
          padding: '8px 12px',
          background: 'rgba(229,62,62,0.08)',
          borderRadius: 8,
        }}>
          {errorMsg}
        </div>
      )}

      <button
        className="btn btn-amber btn-lg"
        style={{ width: '100%', fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        onClick={handleSubscribe}
        disabled={processing || loadingIntent || !stripe}
      >
        {processing ? 'Processing...' : `Subscribe \u2014 $${config.subscriptionAmount}/week`}
      </button>
    </>
  );
}

/* ── Main Step 6 Page ── */
export default function DriverStep6() {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');

  const driverCode = typeof window !== 'undefined' ? sessionStorage.getItem('driverCode') || '' : '';
  const codeParts = driverCode ? [driverCode.slice(0, 3), driverCode.slice(3, 6), driverCode.slice(6)] : ['SHT', 'MRC', '3341'];

  async function handlePaymentSuccess(paymentIntentId: string) {
    setActivating(true);
    setError('');
    try {
      const res = await fetch('/api/auth/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, driverCode }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
      } else {
        setError(data.error || 'Payment succeeded but activation failed. Please contact support.');
      }
    } catch {
      setError('Payment succeeded but activation failed. Please contact support.');
    }
    setActivating(false);
  }

  const INCLUDED = [
    'Profile visible in airport driver pools',
    'Unlimited client connections',
    'Booking management dashboard',
    'SMS + email + push notifications',
    'Payment method display (Zelle, Venmo, CashApp, Stripe, Cash)',
    'Calendar and availability management',
    'Client policy controls',
    'Share your driver code',
  ];

  return (
    <div className="app-shell">
      <div className="layout-2col">
        {/* Main content */}
        <div className="main-content">
          {/* Progress bar */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step active" />
          </div>

          <div className="t-title mb-4">Subscribe &amp; Go Live</div>
          <div className="t-small mb-20">Step 6 of 6 &mdash; Your profile goes live after payment</div>

          {error && <div className="form-error">{error}</div>}

          {/* Success state */}
          {subscribed ? (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(56,161,105,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 32, color: '#38a169',
              }}>
                &#10003;
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800,
                color: 'var(--text-1)', marginBottom: 8,
              }}>
                You&apos;re live!
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                Your {config.serviceName} profile is now active. Share your driver code with clients and start receiving bookings.
              </div>

              {/* Driver code large display */}
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  display: 'inline-flex',
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}>
                  <div style={{
                    background: '#F5A623',
                    padding: '16px 20px',
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#0a0a2e',
                  }}>{codeParts[0]}</div>
                  <div style={{
                    background: '#0a0a2e',
                    padding: '16px 18px',
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#F5A623',
                  }}>{codeParts[1]}</div>
                  <div style={{
                    background: '#12124a',
                    padding: '16px 20px',
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,.85)',
                  }}>{codeParts[2]}</div>
                </div>
                <div className="t-small">This is your permanent {config.providerLabel} Code</div>
              </div>

              <button
                type="button"
                className="btn btn-amber btn-lg"
                onClick={() => router.push('/dashboard')}
                style={{ width: '100%', fontSize: 16 }}
              >
                Go to Dashboard &rarr;
              </button>
            </div>
          ) : (
            <>
              {/* Subscription card */}
              <div style={{
                background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 100%)',
                borderRadius: 'var(--r-xl)',
                padding: '24px',
                marginBottom: 20,
                color: '#fff',
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#F5A623',
                  marginBottom: 4,
                }}>
                  ${config.subscriptionAmount} / week
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'rgba(255,255,255,.9)',
                }}>
                  {config.serviceName} Weekly Subscription
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>
                  Auto-renews every week. Cancel anytime. No contracts.
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 8 }}>
                  Your first charge is today. Next charge in 7 days.
                </div>
              </div>

              {/* What's included */}
              <div className="t-label mb-12">What&apos;s included</div>
              <div style={{ marginBottom: 20 }}>
                {INCLUDED.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: i < INCLUDED.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(56,161,105,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: '#38a169', fontWeight: 700, flexShrink: 0,
                    }}>&#10003;</div>
                    <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{item}</div>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              {/* Stripe payment form */}
              {activating ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-2)', fontSize: 13 }}>
                  Activating your profile...
                </div>
              ) : (
                <Elements stripe={stripePromise}>
                  <SubscriptionForm onSuccess={handlePaymentSuccess} />
                </Elements>
              )}

              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-lg"
                  onClick={() => router.push('/register/driver/step5')}
                  style={{ width: '100%' }}
                >
                  &larr; Back
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {/* Driver code */}
          <div className="t-label mb-8">Your {config.providerLabel} Code</div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              display: 'inline-flex',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 6,
            }}>
              <div style={{
                background: '#F5A623',
                padding: '12px 16px',
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#0a0a2e',
              }}>{codeParts[0]}</div>
              <div style={{
                background: '#0a0a2e',
                padding: '12px 14px',
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#F5A623',
              }}>{codeParts[1]}</div>
              <div style={{
                background: '#12124a',
                padding: '12px 16px',
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: 'rgba(255,255,255,.85)',
              }}>{codeParts[2]}</div>
            </div>
          </div>

          {/* Setup checklist */}
          <div className="t-label mb-8">Setup checklist</div>
          <div className="card-surface mb-12">
            <div className="row"><span className="row-label">Personal info</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Credentials</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Safety Protocol</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Rates</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Payment</span><span className="badge badge-green">&#10003; Done</span></div>
            <div className="row"><span className="row-label">Subscription</span><span className={`badge ${subscribed ? 'badge-green' : 'badge-amber'}`}>{subscribed ? '\u2713 Active' : 'In progress'}</span></div>
          </div>

          {/* What happens next */}
          <div className="t-label mb-8">What happens next</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Your profile is now live</div>
              <div className="t-small">{config.domain}/{codeParts[0]}&middot;{codeParts[1]}&middot;{codeParts[2]} is instantly active</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Share your code</div>
              <div className="t-small">Text {codeParts[0]}&middot;{codeParts[1]}&middot;{codeParts[2]} to your existing clients</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Clients find you in the pool</div>
              <div className="t-small">Your profile appears in airport driver pools for your airports</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>4-channel notifications</div>
              <div className="t-small">First booking request triggers SMS, email, push, and in-app notification</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
