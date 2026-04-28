'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const DEMO_DRIVERS: Record<string, { firstName: string; lastInitial: string; initials: string; vehicleClass: string; vehicle: string; rating: number }> = {
  'ray-r': { firstName: 'Ray', lastInitial: 'R', initials: 'RR', vehicleClass: 'COMFORT', vehicle: '2021 Toyota Camry SE', rating: 4.94 },
  'david-m': { firstName: 'David', lastInitial: 'M', initials: 'DM', vehicleClass: 'XL', vehicle: '2022 Toyota Highlander XLE', rating: 4.98 },
  'marcus-s': { firstName: 'Marcus', lastInitial: 'S', initials: 'MS', vehicleClass: 'BLACK', vehicle: '2023 Cadillac CT5 Premium', rating: 5.0 },
  'tony-v': { firstName: 'Tony', lastInitial: 'V', initials: 'TV', vehicleClass: 'XLL', vehicle: '2023 Chevrolet Suburban LT', rating: 4.91 },
  'sarah-k': { firstName: 'Sarah', lastInitial: 'K', initials: 'SK', vehicleClass: 'COMFORT', vehicle: '2022 Honda Accord EX', rating: 4.87 },
  'james-w': { firstName: 'James', lastInitial: 'W', initials: 'JW', vehicleClass: 'XL', vehicle: '2023 Ford Explorer XLT', rating: 4.96 },
};

const AIRPORT_NAMES: Record<string, string> = {
  IAH: 'Houston', MCO: 'Orlando', ATL: 'Atlanta', LAX: 'Los Angeles',
  DFW: 'Dallas', ORD: 'Chicago', JFK: 'New York', MIA: 'Miami',
};

const AIRPORT_FULL_NAMES: Record<string, string> = {
  MCO: 'Orlando International Airport', IAH: 'George Bush Intercontinental Airport',
  ATL: 'Hartsfield-Jackson International Airport', LAX: 'Los Angeles International Airport',
  DFW: 'Dallas/Fort Worth International Airport', ORD: "O'Hare International Airport",
  JFK: 'John F. Kennedy International Airport', MIA: 'Miami International Airport',
};

/* ── Stripe Payment Form ── */
function StripePaymentForm({
  driverName,
  airport,
  driverId,
  onSuccess,
}: {
  driverName: string;
  airport: string;
  driverId: string;
  onSuccess: () => void;
}) {
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
      body: JSON.stringify({ type: 'matching_fee' }),
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

  const handlePay = async () => {
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
      // Now create the driver request
      try {
        const res = await fetch(`/api/find-a-driver/${airport}/${driverId}/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        const data = await res.json();
        if (data.success) {
          onSuccess();
        } else {
          setErrorMsg(data.error || 'Payment succeeded but request failed. Please contact support.');
        }
      } catch {
        setErrorMsg('Payment succeeded but request failed. Please contact support.');
      }
    } else {
      setErrorMsg('Payment was not completed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <>
      <div className="card mb-16">
        <div className="t-label mb-12">Pay with</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--surface)', border: '1.5px solid var(--amber)',
          borderRadius: 'var(--r-md)', padding: '12px 14px',
          marginBottom: '14px',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: '#635BFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 800, color: 'var(--white)',
            fontFamily: "'Syne', sans-serif", flexShrink: 0,
          }}>St</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-1)' }}>Credit / Debit card</div>
            <div className="t-small">Via Stripe &middot; Secure payment</div>
          </div>
          <span className="badge badge-green">Selected</span>
        </div>

        {loadingIntent ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-2)', fontSize: '13px' }}>
            Loading payment form...
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '14px',
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
          fontSize: '12px',
          marginBottom: '12px',
          padding: '8px 12px',
          background: 'rgba(229,62,62,0.08)',
          borderRadius: '8px',
        }}>
          {errorMsg}
        </div>
      )}

      <button
        className="btn btn-amber btn-full btn-lg mb-8"
        style={{ fontSize: '15px', fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        onClick={handlePay}
        disabled={processing || loadingIntent || !stripe}
      >
        {processing ? 'Processing...' : `Pay $9.99 \u00B7 Request ${driverName} \u2192`}
      </button>
    </>
  );
}

/* ── Main Request Page ── */
export default function RequestPage() {
  const params = useParams();
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const airport = (params.airport as string).toUpperCase();
  const driverId = params.driverId as string;
  const airportCity = AIRPORT_NAMES[airport] || airport;

  const driver = DEMO_DRIVERS[driverId];
  const [requestSent, setRequestSent] = useState(false);

  if (!driver) {
    return (
      <>
        <div className="app-topbar">
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          <div className="topbar-right"><div className="topbar-avatar">SC</div></div>
        </div>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <div className="t-display mb-8">{config.providerLabel} not found</div>
          <button className="btn btn-ghost" onClick={() => router.push(`/find-a-driver/${airport}`)}>
            &larr; Back to pool
          </button>
        </div>
      </>
    );
  }

  if (requestSent) {
    return (
      <>
        <div className="app-topbar">
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          <div className="topbar-right">
            <div className="topbar-airport">
              <span style={{ fontSize: '12px' }}>&#9992;</span>
              <div className="ta-iata">{airport}</div>
              <div className="ta-name">{airportCity}</div>
            </div>
            <div className="topbar-avatar">SC</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '620px', background: 'var(--surface)', padding: '32px' }}>
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', paddingTop: '60px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(56,161,105,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '28px', color: '#38a169',
            }}>
              &#10003;
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px' }}>
              Request Sent!
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '24px' }}>
              Your $9.99 matching fee has been processed and your request has been sent to {driver.firstName}. They have 24 hours to respond. You will be notified when they accept or decline.
            </div>
            <button
              className="btn btn-amber btn-full mb-8"
              onClick={() => router.push(`/find-a-driver/${airport}`)}
            >
              Back to {airportCity} Drivers
            </button>
          </div>
        </div>
        <div className="site-footer">
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Conditions</a>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Top bar */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-airport">
            <span style={{ fontSize: '12px' }}>&#9992;</span>
            <div className="ta-iata">{airport}</div>
            <div className="ta-name">{airportCity}</div>
          </div>
          <div className="topbar-avatar">SC</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '620px', background: 'var(--surface)', padding: '32px' }}>
        <div style={{ maxWidth: '580px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Driver summary card */}
            <div style={{
              background: 'var(--navy)',
              backgroundImage: 'radial-gradient(ellipse at top right, var(--navy-light) 0%, var(--navy) 70%)',
              borderRadius: 'var(--r-xl)',
              padding: '20px 22px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div className="avatar av-amber av-md">{driver.initials}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 800, color: 'var(--white)', marginBottom: '3px' }}>
                    {driver.firstName} {driver.lastInitial}.
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)' }}>
                    {driver.vehicleClass} &middot; {driver.vehicle} &middot; &#9733; {driver.rating.toFixed(2)}
                  </div>
                </div>
                <div className="masked-code" style={{ marginLeft: 'auto' }}>
                  <div className="mc-airport">{airport}</div>
                  <div className="mc-initials">{driver.lastInitial[0]}**</div>
                  <div className="mc-digits">****</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="airport-badge-sm"><div className="abs-iata">{airport}</div></div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)' }}>
                  {AIRPORT_FULL_NAMES[airport] || `${airportCity} International Airport`}
                </span>
              </div>
            </div>

            {/* Matching fee card */}
            <div className="fee-card mb-16">
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>
                One-time matching fee
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '14px', lineHeight: 1.5 }}>
                Charged once to connect with {driver.firstName}. All future bookings are free to make through {config.serviceName}.
              </div>
              <div className="fee-amount mb-10">
                <div className="fee-label">Connection fee</div>
                <div className="fee-value">$9.99</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-2)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-1)' }}>Non-refundable</strong> if {driver.firstName} declines.{' '}
                <strong style={{ color: 'var(--text-1)' }}>{driver.firstName} may credit this fee</strong> as a discount on your first ride &mdash; at {driver.firstName.toLowerCase() === driver.firstName ? 'their' : 'his'} discretion.
              </div>
            </div>

            {/* What happens next */}
            <div className="what-happens">
              <div className="wh-title">What happens next</div>
              <div className="wh-step"><div className="wh-num">1</div>Your $9.99 is processed and request sent to {driver.firstName}</div>
              <div className="wh-step"><div className="wh-num">2</div>{driver.firstName} reviews your request &mdash; 24 hours to respond</div>
              <div className="wh-step"><div className="wh-num">3</div>Approved &mdash; full code and contact info unlock instantly</div>
              <div className="wh-step"><div className="wh-num">4</div>Book rides with {driver.firstName} directly through {config.serviceName}</div>
              <div className="wh-step"><div className="wh-num">5</div>{driver.firstName} may credit your $9.99 on your first ride</div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                driverName={driver.firstName}
                airport={airport}
                driverId={driverId}
                onSuccess={() => setRequestSent(true)}
              />
            </Elements>

            <button
              className="btn btn-ghost btn-full mb-16"
              onClick={() => router.push(`/find-a-driver/${airport}/${driverId}`)}
            >
              &larr; Back to profile
            </button>

            <div className="text-center" style={{ fontSize: '11px', color: 'var(--text-3)' }}>
              Secure payment via Stripe<br />
              &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Conditions</a>
      </div>
    </>
  );
}
