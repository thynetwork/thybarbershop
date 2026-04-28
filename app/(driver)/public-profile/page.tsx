'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

interface Service {
  name: string;
  price: string;
}

const SERVICES: Service[] = [
  { name: 'Adult Cuts', price: '$45' },
  { name: 'Kid Cuts', price: '$25' },
  { name: 'Clean Style Cuts', price: '$45' },
  { name: 'Fades', price: '$55' },
  { name: 'Tapers', price: '$50' },
];

const DAYS: { label: string; on: boolean }[] = [
  { label: 'Su', on: false },
  { label: 'Mo', on: true },
  { label: 'Tu', on: true },
  { label: 'We', on: true },
  { label: 'Th', on: true },
  { label: 'Fr', on: false },
  { label: 'Sa', on: true },
];

export default function PublicProfilePage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  function goThyHair() {
    alert('Opening ThyHair portfolio page for Marcus Rivera in production.');
  }

  return (
    <>
      <style>{`
        .pp-topbar{background:#0a0a2e;height:3.25rem;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;position:sticky;top:0;z-index:100;}
        .pp-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .pp-logo span{color:#F5A623;}
        .pp-back{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;gap:.4rem;background:none;border:none;font-family:inherit;}
        .pp-back:hover{color:#fff;}
        .pp-tb-right{display:flex;align-items:center;gap:.75rem;}
        .pp-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .pp-hero{background:linear-gradient(135deg,#0d2818 0%,#1a4a2e 50%,#0d3020 100%);padding:2rem 2rem 3.5rem;position:relative;overflow:hidden;}
        .pp-hero-pattern{position:absolute;inset:0;opacity:.04;}
        .pp-hero-content{position:relative;z-index:2;display:flex;align-items:flex-end;gap:1.5rem;max-width:960px;margin:0 auto;}
        .pp-hero-avatar{width:6rem;height:6rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;border:4px solid rgba(255,255,255,.15);box-shadow:0 8px 32px rgba(0,0,0,.3);flex-shrink:0;}
        .pp-hero-info{flex:1;}
        .pp-hero-name{font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;margin-bottom:.25rem;}
        .pp-hero-shop{font-size:.85rem;color:rgba(255,255,255,.5);margin-bottom:.6rem;}
        .pp-hero-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.68rem;margin-bottom:.75rem;}
        .pp-hc-city{background:#F5A623;color:#0a0a2e;padding:.22rem .6rem;flex:2.5;}
        .pp-hc-state{background:rgba(255,255,255,.12);color:#fff;padding:.22rem .45rem;flex:1;border-left:1px solid rgba(255,255,255,.2);border-right:1px solid rgba(255,255,255,.2);}
        .pp-hc-init{background:rgba(255,255,255,.08);color:#F5A623;padding:.22rem .45rem;flex:1;border-right:1px solid rgba(255,255,255,.2);}
        .pp-hc-digits{background:rgba(255,255,255,.06);color:rgba(255,255,255,.7);padding:.22rem .6rem;flex:1;}
        .pp-hero-badges{display:flex;flex-wrap:wrap;gap:.4rem;}
        .pp-badge{display:inline-flex;align-items:center;border-radius:9999px;padding:.18rem .65rem;font-size:.62rem;font-weight:700;}
        .pp-badge-green{background:rgba(59,109,17,.25);color:#7ec85a;border:1px solid rgba(126,200,90,.3);}
        .pp-badge-amber{background:rgba(245,166,35,.15);color:#F5A623;border:1px solid rgba(245,166,35,.25);}
        .pp-badge-white{background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);}
        .pp-hero-stats{text-align:right;flex-shrink:0;}
        .pp-hero-rating{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#F5A623;line-height:1;}
        .pp-hero-rating-label{font-size:.6rem;color:rgba(255,255,255,.35);margin-top:.2rem;}
        .pp-hero-visits{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:rgba(255,255,255,.6);margin-top:.5rem;}
        .pp-hero-visits-label{font-size:.6rem;color:rgba(255,255,255,.3);}

        .pp-main-wrap{max-width:960px;margin:0 auto;padding:1.5rem 1.5rem 3rem;transform:translateY(-.5rem);}
        .pp-grid{display:grid;grid-template-columns:280px 1fr;gap:1.25rem;align-items:start;}

        .pp-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .pp-card:last-child{margin-bottom:0;}
        .pp-card-title{font-family:'Syne',sans-serif;font-size:.68rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .pp-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .pp-info-row{display:flex;justify-content:space-between;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .pp-info-row:last-child{border-bottom:none;}
        .pp-ir-key{font-size:.68rem;color:#9A9AAA;font-weight:600;padding-top:.1rem;}
        .pp-ir-val{font-size:.78rem;font-weight:600;color:#111118;text-align:right;line-height:1.5;}

        .pp-city-badges{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:flex-end;}
        .pp-city-badge{background:#0a0a2e;color:#F5A623;border-radius:.25rem;padding:.2rem .55rem;font-family:'Syne',sans-serif;font-size:.62rem;font-weight:800;}

        .pp-avail-days{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.35rem;}
        .pp-avail-day{width:1.8rem;height:1.8rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;}
        .pp-avail-day.on{background:#0a0a2e;color:#F5A623;}
        .pp-avail-day.off{background:#F7F7F8;color:#9A9AAA;}

        .pp-shop-vibe{font-size:.88rem;color:#5A5A6A;line-height:1.8;font-style:italic;margin-bottom:0;}
        .pp-service-row{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .pp-service-row:last-child{border-bottom:none;}
        .pp-sr-name{font-size:.85rem;font-weight:600;color:#111118;}
        .pp-sr-price{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#0a0a2e;}
        .pp-services-note{font-size:.65rem;color:#9A9AAA;margin-top:.6rem;line-height:1.5;}

        .pp-interests{font-size:.82rem;color:#5A5A6A;line-height:1.8;}
        .pp-self-reported{font-size:.6rem;color:#9A9AAA;font-style:italic;margin-top:.4rem;padding:.4rem .6rem;background:#F7F7F8;border-radius:.75rem;}

        .pp-portfolio{display:grid;grid-template-columns:repeat(6,1fr);gap:.4rem;margin-bottom:.85rem;}
        .pp-thumb{aspect-ratio:1;border-radius:.75rem;background:#F7F7F8;border:1.5px solid rgba(0,0,0,.09);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;}
        .pp-thumb:hover{border-color:#F5A623;transform:scale(1.03);}
        .pp-btn-thyhair{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.7rem;font-family:'Syne',sans-serif;font-size:.8rem;font-weight:800;color:#F5A623;cursor:pointer;text-align:center;}
        .pp-btn-thyhair:hover{background:#14145c;}

        .pp-shop-icon{width:3rem;height:3rem;border-radius:.75rem;background:#0a0a2e;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid rgba(0,0,0,.09);}
        .pp-shop-name{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#111118;}
        .pp-shop-loc{font-size:.65rem;color:#9A9AAA;}

        .pp-pay-icon{width:2rem;height:2rem;border-radius:.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .pp-pay-name{font-size:.78rem;font-weight:700;color:#111118;}
        .pp-pay-handle{font-family:'DM Mono',monospace;font-size:.65rem;color:#5A5A6A;}

        @media(max-width:700px){.pp-grid{grid-template-columns:1fr;}}
      `}</style>

      <nav className="pp-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" className="pp-back" onClick={() => router.back()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div className="pp-logo">{prefix}<span>{highlight}</span></div>
          </Link>
        </div>
        <div className="pp-tb-right">
          <div className="pp-tb-avatar">SC</div>
        </div>
      </nav>

      <div className="pp-hero">
        <svg className="pp-hero-pattern" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p)"/>
        </svg>
        <div className="pp-hero-content">
          <div className="pp-hero-avatar">MR</div>
          <div className="pp-hero-info">
            <div className="pp-hero-name">Marcus Rivera</div>
            <div className="pp-hero-shop">The Studio &middot; South Houston, TX</div>
            <div className="pp-hero-code">
              <div className="pp-hc-city">South Houston</div>
              <div className="pp-hc-state">TX</div>
              <div className="pp-hc-init">MRC</div>
              <div className="pp-hc-digits">3341</div>
            </div>
            <div className="pp-hero-badges">
              <span className="pp-badge pp-badge-green">Professional Standard</span>
              <span className="pp-badge pp-badge-green">Safety Protocol</span>
              <span className="pp-badge pp-badge-green">License Verified</span>
              <span className="pp-badge pp-badge-amber">12 yrs licensed</span>
              <span className="pp-badge pp-badge-white">Shop &middot; Mobile</span>
            </div>
          </div>
          <div className="pp-hero-stats">
            <div className="pp-hero-rating">4.97</div>
            <div className="pp-hero-rating-label">Rating</div>
            <div className="pp-hero-visits">312</div>
            <div className="pp-hero-visits-label">Visits</div>
          </div>
        </div>
      </div>

      <div className="pp-main-wrap">
        <div className="pp-grid">

          {/* LEFT COLUMN */}
          <div>
            <div className="pp-card">
              <div className="pp-card-title">Location</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(0,0,0,.09)' }}>
                <div className="pp-shop-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
                </div>
                <div>
                  <div className="pp-shop-name">The Studio</div>
                  <div className="pp-shop-loc">South Houston, TX</div>
                </div>
              </div>
              <div className="pp-info-row">
                <div className="pp-ir-key">Address</div>
                <div className="pp-ir-val">4521 Main St<br/>South Houston, TX 77587</div>
              </div>
              <div className="pp-info-row">
                <div className="pp-ir-key">Also serves</div>
                <div className="pp-ir-val">
                  <div className="pp-city-badges">
                    <span className="pp-city-badge">South Houston</span>
                    <span className="pp-city-badge">Pasadena</span>
                    <span className="pp-city-badge">Pearland</span>
                  </div>
                </div>
              </div>
              <div className="pp-info-row">
                <div className="pp-ir-key">Type</div>
                <div className="pp-ir-val">Shop &amp; Mobile</div>
              </div>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">Availability</div>
              <div className="pp-avail-days">
                {DAYS.map(d => (
                  <div key={d.label} className={'pp-avail-day ' + (d.on ? 'on' : 'off')}>{d.label}</div>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5A5A6A', fontWeight: 500 }}>8:00 am &mdash; 6:00 pm</div>
              <div style={{ fontSize: '0.68rem', color: '#D4830A', fontWeight: 600, marginTop: '0.3rem' }}>After hours by request</div>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">All Services &amp; Rates</div>
              {SERVICES.map(s => (
                <div key={s.name} className="pp-service-row">
                  <div><div className="pp-sr-name">{s.name}</div></div>
                  <div className="pp-sr-price">{s.price}</div>
                </div>
              ))}
              <div className="pp-services-note">Chair Rate is a custom agreed rate between barber and connected client. Listed rates are starting points for new clients.</div>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">Accepts Payment</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="pp-pay-icon" style={{ background: '#6d1ed4' }}>
                    <svg width="16" height="16" viewBox="0 0 40 40"><text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Arial Black" fontWeight="900" fontSize="20">Z</text></svg>
                  </div>
                  <div>
                    <div className="pp-pay-name">Zelle</div>
                    <div className="pp-pay-handle">(713) 555-0182</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="pp-pay-icon" style={{ background: '#008cff' }}>
                    <svg width="16" height="16" viewBox="0 0 40 40"><text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="700" fontSize="9">venmo</text></svg>
                  </div>
                  <div>
                    <div className="pp-pay-name">Venmo</div>
                    <div className="pp-pay-handle">@marcus-rivera-htx</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="pp-pay-icon" style={{ background: '#2e7d32' }}>
                    <svg width="16" height="16" viewBox="0 0 40 40"><text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="serif" fontWeight="700" fontSize="24">$</text></svg>
                  </div>
                  <div>
                    <div className="pp-pay-name">Cash</div>
                    <div style={{ fontSize: '0.65rem', color: '#9A9AAA' }}>Pay in person</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div className="pp-card">
              <div className="pp-card-title">Shop Vibe</div>
              <div className="pp-shop-vibe">South Houston&apos;s spot for clean fades and sharp line-ups. Twelve years behind the chair &mdash; professional, consistent, and on time. The chair is where you reset. Come correct, leave sharp.</div>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">Shop Video</div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '1rem', overflow: 'hidden', background: '#0a0a2e' }}>
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ fontSize: '0.65rem', color: '#9A9AAA', marginTop: '0.6rem' }}>The Studio &middot; South Houston, TX &middot; Marcus Rivera</div>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">Haircut Portfolio Photos</div>
              <div className="pp-portfolio">
                <div className="pp-thumb" style={{ background: '#e8f5e9' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="pp-thumb" style={{ background: '#e3f2fd' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="pp-thumb" style={{ background: '#fce4ec' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="pp-thumb" style={{ background: '#f3e5f5' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6a1b9a" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="pp-thumb" style={{ background: '#fff8e1' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f57f17" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="pp-thumb" style={{ background: '#e8eaf6' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#283593" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              </div>
              <button type="button" className="pp-btn-thyhair" onClick={goThyHair}>View Full Portfolio on ThyHair</button>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">Interests &amp; Background</div>
              <div className="pp-interests">Sports, Houston Texans, music, community. South Houston native &mdash; been cutting since I was 16. Family man. I talk about whatever my client wants or keep it quiet &mdash; their chair, their vibe.</div>
              <div className="pp-self-reported">Self-reported by the barber &mdash; not verified by {config.serviceName}.</div>
            </div>
          </div>

        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </>
  );
}
