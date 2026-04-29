'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

interface PayMethod {
  key: string;
  name: string;
  handle: string;
  bg: string;
  letter: string;
  letterFont: string;
  letterSize: number;
  copyable?: boolean;
}

const PAY_METHODS: PayMethod[] = [
  { key: 'zelle', name: 'Zelle', handle: '(713) 555-0182', bg: '#6d1ed4', letter: 'Z', letterFont: 'Arial Black,sans-serif', letterSize: 22, copyable: true },
  { key: 'venmo', name: 'Venmo', handle: '@marcus-rivera-htx', bg: '#008cff', letter: 'venmo', letterFont: 'Arial,sans-serif', letterSize: 10, copyable: true },
  { key: 'cash', name: 'Cash', handle: 'Pay in person — day of appointment', bg: '#2e7d32', letter: '$', letterFont: 'serif', letterSize: 26, copyable: false },
];

const demoUser = { name: 'Sarah Chen', initials: 'SC' };
const barber = {
  firstName: 'Marcus',
  fullName: 'Marcus Rivera',
  city: 'South Houston',
  state: 'TX',
  initials: 'MRC',
  digits: '3341',
  shopName: 'The Studio',
  shopAddress: '4521 Main St · South Houston',
};

function HowToPayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prefix, highlight } = splitServiceName();

  const service = searchParams.get('service') || 'Adult Haircut';
  const dateRaw = searchParams.get('date') || '2026-07-17';
  const time = searchParams.get('time') || '11:00 am';
  const location = searchParams.get('location') || barber.shopAddress;
  const locationType = searchParams.get('locationType') || 'shop';
  const priceRaw = searchParams.get('price');
  const price = priceRaw ? Number(priceRaw) : 45;

  const dateDisplay = (() => {
    try {
      const d = new Date(dateRaw + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + d.getFullYear();
    } catch {
      return dateRaw;
    }
  })();

  const [toast, setToast] = useState('');

  function copyHandle(handle: string) {
    navigator.clipboard.writeText(handle).then(() => {
      setToast('Copied: ' + handle);
      setTimeout(() => setToast(''), 2500);
    }).catch(() => {
      setToast(handle);
      setTimeout(() => setToast(''), 2500);
    });
  }

  function confirmBooking() {
    const params = new URLSearchParams({
      service, date: dateRaw, time, location, locationType, price: String(price),
    });
    router.push(`/book/confirmed?${params.toString()}`);
  }

  const locationDisplay = locationType === 'shop'
    ? <>{barber.shopName}<br/>{barber.shopAddress}</>
    : <>Mobile visit<br/>{location}</>;

  return (
    <>
      <style>{`
        .h2p-topbar{background:#0a0a2e;height:3.25rem;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;position:sticky;top:0;z-index:100;}
        .h2p-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .h2p-logo span{color:#F5A623;}
        .h2p-back{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;gap:.4rem;background:none;border:none;font-family:inherit;}
        .h2p-back:hover{color:#fff;}
        .h2p-tb-right{display:flex;align-items:center;gap:.75rem;}
        .h2p-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .h2p-progress{background:#0a0a2e;padding:.6rem 1.5rem;display:flex;align-items:center;gap:.5rem;}
        .h2p-step{display:flex;align-items:center;gap:.4rem;font-size:.68rem;font-weight:600;}
        .h2p-dot{width:1.4rem;height:1.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:800;flex-shrink:0;}
        .h2p-dot.done{background:#3B6D11;color:#fff;}
        .h2p-dot.on{background:#F5A623;color:#0a0a2e;}
        .h2p-dot.off{background:rgba(255,255,255,.1);color:rgba(255,255,255,.3);}
        .h2p-label.done{color:rgba(255,255,255,.5);}
        .h2p-label.on{color:#fff;}
        .h2p-label.off{color:rgba(255,255,255,.25);}
        .h2p-line{flex:1;height:1px;background:rgba(255,255,255,.1);}

        .h2p-main{max-width:820px;margin:0 auto;padding:1.5rem;}
        .h2p-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .h2p-subtitle{font-size:.78rem;color:#5A5A6A;margin-bottom:1.5rem;}
        .h2p-subtitle strong{color:#111118;}

        .h2p-cols{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start;}
        .h2p-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .h2p-card:last-child{margin-bottom:0;}
        .h2p-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .h2p-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .h2p-row{display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .h2p-row:last-child{border-bottom:none;}
        .h2p-key{font-size:.72rem;color:#9A9AAA;font-weight:600;}
        .h2p-val{font-size:.85rem;font-weight:600;color:#111118;text-align:right;}
        .h2p-val.green{color:#3B6D11;}

        .h2p-code{display:inline-flex;border-radius:.25rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.6rem;}
        .h2p-code .city{background:#F5A623;color:#0a0a2e;padding:.15rem .45rem;}
        .h2p-code .state{background:#0a0a2e;color:#fff;padding:.15rem .35rem;border-left:1.5px solid rgba(255,255,255,.3);border-right:1.5px solid rgba(255,255,255,.3);}
        .h2p-code .init{background:#0a0a2e;color:#F5A623;padding:.15rem .35rem;border-right:1.5px solid rgba(255,255,255,.3);}
        .h2p-code .digits{background:#12124a;color:rgba(255,255,255,.85);padding:.15rem .45rem;}

        .h2p-rate-row{display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .h2p-rate-row:last-child{border-bottom:none;}
        .h2p-rr-label{font-size:.82rem;color:#5A5A6A;}
        .h2p-rr-val{font-size:.85rem;font-weight:700;color:#111118;}
        .h2p-total{display:flex;justify-content:space-between;align-items:center;padding:.85rem 1rem;background:#0a0a2e;border-radius:1rem;margin-top:.75rem;}
        .h2p-total-label{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#fff;}
        .h2p-total-val{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#F5A623;}
        .h2p-rate-note{font-size:.65rem;color:#9A9AAA;margin-top:.75rem;line-height:1.6;}

        .h2p-cancel{background:rgba(245,166,35,.08);border:1.5px solid rgba(245,166,35,.25);border-radius:1rem;padding:.9rem 1rem;margin-bottom:1.25rem;}
        .h2p-cc-title{font-size:.7rem;font-weight:700;color:#D4830A;margin-bottom:.35rem;}
        .h2p-cc-text{font-size:.7rem;color:#5A5A6A;line-height:1.7;}
        .h2p-cc-text strong{color:#111118;}

        .h2p-pay{display:flex;align-items:center;gap:.85rem;padding:.85rem .5rem;border-bottom:1px solid rgba(0,0,0,.09);cursor:pointer;border-radius:.75rem;}
        .h2p-pay:last-of-type{border-bottom:none;}
        .h2p-pay:hover{background:#F7F7F8;}
        .h2p-pay-icon{width:2.5rem;height:2.5rem;border-radius:.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-weight:900;}
        .h2p-pay-info{flex:1;}
        .h2p-pay-name{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#111118;}
        .h2p-pay-handle{font-family:'DM Mono',monospace;font-size:.72rem;color:#5A5A6A;margin-top:.15rem;}
        .h2p-pay-copy{font-size:.68rem;color:#D4830A;font-weight:600;cursor:pointer;white-space:nowrap;background:none;border:none;font-family:inherit;}

        .h2p-confirm{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:1rem;font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#F5A623;cursor:pointer;margin-top:.5rem;}
        .h2p-confirm:hover{background:#14145c;}

        .h2p-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap;}

        @media(max-width:640px){.h2p-cols{grid-template-columns:1fr;}}
      `}</style>

      <nav className="h2p-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" className="h2p-back" onClick={() => router.back()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="h2p-logo">{prefix}<span>{highlight}</span></div>
          </Link>
        </div>
        <div className="h2p-tb-right">
          <div className="h2p-avatar">{demoUser.initials}</div>
        </div>
      </nav>

      <div className="h2p-progress">
        <div className="h2p-step">
          <div className="h2p-dot done">&#10003;</div>
          <div className="h2p-label done">Date &amp; Time</div>
        </div>
        <div className="h2p-line" />
        <div className="h2p-step">
          <div className="h2p-dot done">&#10003;</div>
          <div className="h2p-label done">Location</div>
        </div>
        <div className="h2p-line" />
        <div className="h2p-step">
          <div className="h2p-dot on">3</div>
          <div className="h2p-label on">How to Pay</div>
        </div>
        <div className="h2p-line" />
        <div className="h2p-step">
          <div className="h2p-dot off">4</div>
          <div className="h2p-label off">Confirmed</div>
        </div>
      </div>

      <div className="h2p-main">
        <div className="h2p-title">How to Pay {barber.firstName}</div>
        <div className="h2p-subtitle">Review your booking and complete your <strong>appointment</strong>.</div>

        <div className="h2p-cols">
          {/* LEFT */}
          <div>
            <div className="h2p-card">
              <div className="h2p-card-title">Booking Summary</div>
              <div className="h2p-row">
                <div className="h2p-key">Barber</div>
                <div className="h2p-val">{barber.fullName}</div>
              </div>
              <div className="h2p-row">
                <div className="h2p-key">Code</div>
                <div className="h2p-val">
                  <div className="h2p-code">
                    <div className="city">{barber.city}</div>
                    <div className="state">{barber.state}</div>
                    <div className="init">{barber.initials}</div>
                    <div className="digits">{barber.digits}</div>
                  </div>
                </div>
              </div>
              <div className="h2p-row">
                <div className="h2p-key">Service</div>
                <div className="h2p-val">{service}</div>
              </div>
              <div className="h2p-row">
                <div className="h2p-key">Date</div>
                <div className="h2p-val">{dateDisplay}</div>
              </div>
              <div className="h2p-row">
                <div className="h2p-key">Time</div>
                <div className="h2p-val">{time}</div>
              </div>
              <div className="h2p-row">
                <div className="h2p-key">Location</div>
                <div className="h2p-val">{locationDisplay}</div>
              </div>
              <div className="h2p-row">
                <div className="h2p-key">Pay timing</div>
                <div className="h2p-val green">Pay after completion</div>
              </div>
            </div>

            <div className="h2p-card">
              <div className="h2p-card-title">Rate Breakdown</div>
              <div className="h2p-rate-row">
                <div className="h2p-rr-label">{service}</div>
                <div className="h2p-rr-val">${price.toFixed(2)}</div>
              </div>
              <div className="h2p-rate-row">
                <div className="h2p-rr-label">{config.serviceName} fee</div>
                <div className="h2p-rr-val" style={{ color: '#3B6D11' }}>$0.00</div>
              </div>
              <div className="h2p-rate-row">
                <div className="h2p-rr-label">Commission</div>
                <div className="h2p-rr-val" style={{ color: '#3B6D11' }}>$0.00</div>
              </div>
              <div className="h2p-total">
                <div className="h2p-total-label">Total &mdash; pay {barber.firstName} directly</div>
                <div className="h2p-total-val">${price.toFixed(2)}</div>
              </div>
              <div className="h2p-rate-note">{config.serviceName} never processes or holds your payment. You pay {barber.firstName} directly using any of his accepted methods. No commission. No cut. Ever.</div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="h2p-cancel">
              <div className="h2p-cc-title">Cancellation Policy &middot; {barber.fullName}</div>
              <div className="h2p-cc-text">
                <strong>Reschedule same week</strong> &mdash; no charge &middot; life happens.<br/>
                Cancellation within 24hrs &mdash; <strong>50% of Chair Rate.</strong><br/>
                No-show &mdash; <strong>first one waived</strong> &middot; full charge after.<br/>
                Loyalty: <strong>25+ visits</strong> &mdash; always forgiven.<br/>
                All payments go directly to {barber.firstName}.
              </div>
            </div>

            <div className="h2p-card">
              <div className="h2p-card-title">{barber.firstName} Accepts</div>
              {PAY_METHODS.map(m => (
                <div key={m.key} className="h2p-pay">
                  <div className="h2p-pay-icon" style={{ background: m.bg, fontFamily: m.letterFont, fontSize: m.letterSize }}>
                    {m.letter}
                  </div>
                  <div className="h2p-pay-info">
                    <div className="h2p-pay-name">{m.name}</div>
                    <div className="h2p-pay-handle">{m.handle}</div>
                  </div>
                  {m.copyable && (
                    <button type="button" className="h2p-pay-copy" onClick={() => copyHandle(m.handle)}>Copy</button>
                  )}
                </div>
              ))}
              <button type="button" className="h2p-confirm" onClick={confirmBooking}>Confirm Booking &rarr;</button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="h2p-toast">{toast}</div>}

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </>
  );
}

export default function HowToPayPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      <HowToPayContent />
    </Suspense>
  );
}
