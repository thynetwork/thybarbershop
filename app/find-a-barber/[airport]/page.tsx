'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type Sort = 'recommended' | 'rating' | 'az';

interface PoolBarber {
  id: string;
  firstName: string;
  lastInitial: string;
  initials: string;
  city: string;
  state: string;
  codeMaskInit: string;
  codeMaskDigits: string;
  license: string;
  bannerGradient: string;
  avatarBg: string;
  avatarFg: string;
  rating: number;
  visits: number;
  zips: string[];
  services: { label: string; price: string }[];
  days: boolean[];
  hours: string;
  afterHours?: boolean;
}

const ZIP_LABEL: Record<string, { city: string; state: string }> = {
  '77587': { city: 'South Houston', state: 'TX' },
  '77502': { city: 'Pasadena', state: 'TX' },
  '77584': { city: 'Pearland', state: 'TX' },
  '77003': { city: 'Third Ward', state: 'TX' },
  '77004': { city: 'Midtown', state: 'TX' },
  '77007': { city: 'Heights', state: 'TX' },
  '77036': { city: 'Sharpstown', state: 'TX' },
  '77033': { city: 'Sunnyside', state: 'TX' },
  '90001': { city: 'Los Angeles', state: 'CA' },
  '90002': { city: 'Watts', state: 'CA' },
};

const POOL: PoolBarber[] = [
  {
    id: 'john-m', firstName: 'John', lastInitial: 'M', initials: 'JM',
    city: 'South Houston', state: 'TX', codeMaskInit: 'J**', codeMaskDigits: '****',
    license: 'TX-BBR-0042871',
    bannerGradient: 'linear-gradient(135deg,#0d2818,#1a4a2e)',
    avatarBg: '#F5A623', avatarFg: '#0a0a2e',
    rating: 4.97, visits: 312,
    zips: ['77587', '77502', '77584'],
    services: [{ label: 'Adult Haircut', price: '$45' }, { label: 'Kid Cut', price: '$25' }],
    days: [false, true, true, true, true, false, true],
    hours: '8:00 am — 6:00 pm', afterHours: true,
  },
  {
    id: 'david-w', firstName: 'David', lastInitial: 'W', initials: 'DW',
    city: 'South Houston', state: 'TX', codeMaskInit: 'D**', codeMaskDigits: '****',
    license: 'TX-BBR-0039142',
    bannerGradient: 'linear-gradient(135deg,#1a0a2e,#2d1b69)',
    avatarBg: '#6b3fc8', avatarFg: '#fff',
    rating: 4.94, visits: 187,
    zips: ['77587', '77584'],
    services: [{ label: 'Adult Haircut', price: '$40' }, { label: 'Kid Cut', price: '$22' }],
    days: [false, true, true, true, true, true, false],
    hours: '9:00 am — 7:00 pm',
  },
  {
    id: 'kevin-a', firstName: 'Kevin', lastInitial: 'A', initials: 'KA',
    city: 'South Houston', state: 'TX', codeMaskInit: 'K**', codeMaskDigits: '****',
    license: 'TX-BBR-0051883',
    bannerGradient: 'linear-gradient(135deg,#1a1a1a,#3a3a3a)',
    avatarBg: '#555', avatarFg: '#fff',
    rating: 4.91, visits: 243,
    zips: ['77587', '77502', '77003'],
    services: [{ label: 'Adult Haircut', price: '$35' }, { label: 'Kid Cut', price: '$20' }],
    days: [true, false, true, true, true, true, true],
    hours: '7:00 am — 5:00 pm',
  },
  {
    id: 'ray-t', firstName: 'Ray', lastInitial: 'T', initials: 'RT',
    city: 'South Houston', state: 'TX', codeMaskInit: 'R**', codeMaskDigits: '****',
    license: 'TX-BBR-0061204',
    bannerGradient: 'linear-gradient(135deg,#0a1a2e,#1a3a5e)',
    avatarBg: '#1565c0', avatarFg: '#fff',
    rating: 4.82, visits: 98,
    zips: ['77587', '77584'],
    services: [{ label: 'Adult Haircut', price: '$40' }, { label: 'Kid Cut', price: '$22' }],
    days: [false, true, false, true, false, true, true],
    hours: '10:00 am — 6:00 pm',
  },
  {
    id: 'marcus-l', firstName: 'Marcus', lastInitial: 'L', initials: 'ML',
    city: 'South Houston', state: 'TX', codeMaskInit: 'M**', codeMaskDigits: '****',
    license: 'TX-BBR-0028871',
    bannerGradient: 'linear-gradient(135deg,#2e1a0a,#6b3a1f)',
    avatarBg: '#a0522d', avatarFg: '#fff',
    rating: 4.98, visits: 421,
    zips: ['77587', '77502', '77504', '77003', '77004', '77033'],
    services: [{ label: 'Adult Haircut', price: '$50' }, { label: 'Kid Cut', price: '$28' }],
    days: [true, true, true, true, true, false, true],
    hours: '8:00 am — 8:00 pm',
  },
  {
    id: 'tony-j', firstName: 'Tony', lastInitial: 'J', initials: 'TJ',
    city: 'South Houston', state: 'TX', codeMaskInit: 'T**', codeMaskDigits: '****',
    license: 'TX-BBR-0044519',
    bannerGradient: 'linear-gradient(135deg,#0d3020,#1a5a3a)',
    avatarBg: '#2e7d32', avatarFg: '#fff',
    rating: 4.95, visits: 156,
    zips: ['77587', '77502'],
    services: [{ label: 'Adult Haircut', price: '$38' }, { label: 'Kid Cut', price: '$20' }],
    days: [true, false, true, true, true, false, true],
    hours: '9:00 am — 5:00 pm',
  },
];

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const client = { initials: 'RG', name: 'Rayford Gibson', clientId: 'RAYF·8834' };
const TOTAL = 17;

export default function BarberPoolPage() {
  const params = useParams();
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const rawZip = (params?.airport as string | undefined) || '77587';
  const zip = /^\d{5}$/.test(rawZip) ? rawZip : '77587';
  const area = ZIP_LABEL[zip] ?? { city: 'Your area', state: '' };

  const [sort, setSort] = useState<Sort>('recommended');

  const sorted = useMemo(() => {
    const arr = [...POOL];
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sort === 'az') arr.sort((a, b) => a.firstName.localeCompare(b.firstName));
    return arr;
  }, [sort]);

  return (
    <>
      <style>{`
        .fp-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .fp-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .fp-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .fp-logo span{color:#F5A623;}
        .fp-tb-right{display:flex;align-items:center;gap:.75rem;}
        .fp-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .fp-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .fp-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .fp-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .fp-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .fp-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .fp-nav:hover{background:rgba(255,255,255,.05);}
        .fp-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .fp-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .fp-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .fp-nav.on .fp-nav-label,.fp-nav:hover .fp-nav-label{color:#fff;}
        .fp-nav.on .fp-nav-label{font-weight:600;}
        .fp-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .fp-main{overflow-y:auto;padding:1.25rem 1.5rem;background:#F7F7F8;}

        .fp-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.5rem;}
        .fp-back{display:flex;align-items:center;gap:.4rem;font-size:.75rem;font-weight:600;color:#5A5A6A;cursor:pointer;background:none;border:none;font-family:inherit;}
        .fp-back:hover{color:#111118;}
        .fp-results-count{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#111118;}
        .fp-results-zip{font-size:.72rem;color:#9A9AAA;margin-left:.4rem;}
        .fp-sort-btns{display:flex;gap:.35rem;}
        .fp-sort-btn{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.28rem .75rem;font-size:.65rem;font-weight:700;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .fp-sort-btn.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .fp-sort-btn:hover:not(.on){border-color:rgba(245,166,35,.25);}

        .fp-pool-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
        @media (max-width:60rem){.fp-pool-grid{grid-template-columns:repeat(2,1fr);}}
        @media (max-width:40rem){.fp-pool-grid{grid-template-columns:1fr;}}

        .fp-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.07);transition:box-shadow .2s,transform .2s;}
        .fp-card:hover{box-shadow:0 .5rem 2rem rgba(0,0,0,.12);transform:translateY(-.1rem);}

        .fp-banner{position:relative;height:5rem;display:flex;align-items:center;justify-content:center;}
        .fp-license{position:absolute;top:.5rem;left:.5rem;background:rgba(0,0,0,.35);color:rgba(255,255,255,.8);border-radius:.25rem;padding:.18rem .5rem;font-family:'DM Mono',monospace;font-size:.55rem;backdrop-filter:blur(.25rem);}
        .fp-verified{position:absolute;top:.5rem;right:.5rem;background:rgba(59,109,17,.85);color:#7ec85a;border:1px solid rgba(126,200,90,.4);border-radius:9999px;padding:.15rem .5rem;font-size:.58rem;font-weight:700;}
        .fp-avatar{width:3rem;height:3rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.85rem;border:.2rem solid rgba(255,255,255,.2);box-shadow:0 .2rem .6rem rgba(0,0,0,.25);}

        .fp-body{padding:.85rem;}
        .fp-name{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#111118;margin-bottom:.2rem;}
        .fp-code{display:inline-flex;border-radius:.25rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.55rem;margin-bottom:.35rem;}
        .fp-cc-city{background:#F5A623;color:#0a0a2e;padding:.15rem .4rem;}
        .fp-cc-state{background:#0a0a2e;color:#fff;padding:.15rem .3rem;border-left:1px solid rgba(255,255,255,.3);border-right:1px solid rgba(255,255,255,.3);}
        .fp-cc-init{background:#0a0a2e;color:#F5A623;padding:.15rem .3rem;border-right:1px solid rgba(255,255,255,.3);}
        .fp-cc-digits{background:#12124a;color:rgba(255,255,255,.8);padding:.15rem .4rem;}
        .fp-rating{font-size:.68rem;color:#5A5A6A;margin-bottom:.5rem;}
        .fp-rating .stars{color:#F5A623;font-weight:700;}

        .fp-zips{display:grid;grid-template-columns:repeat(3,1fr);gap:.25rem;margin-bottom:.6rem;}
        .fp-zip-badge{background:#0a0a2e;color:#F5A623;border-radius:.2rem;padding:.2rem .3rem;font-family:'Syne',sans-serif;font-size:.58rem;font-weight:800;text-align:center;letter-spacing:.03em;}

        .fp-section-label{font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.3rem;}
        .fp-services{display:grid;grid-template-columns:1fr 1fr;gap:.3rem;margin-bottom:.6rem;}
        .fp-service{background:#F7F7F8;border-radius:.75rem;padding:.35rem .5rem;}
        .fp-svc-label{font-size:.55rem;color:#9A9AAA;text-transform:uppercase;letter-spacing:.05em;}
        .fp-svc-val{font-family:'Syne',sans-serif;font-size:.78rem;font-weight:800;color:#0a0a2e;}

        .fp-days{display:flex;gap:.2rem;margin-bottom:.2rem;}
        .fp-day{width:1.4rem;height:1.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.52rem;font-weight:700;}
        .fp-day.on{background:#0a0a2e;color:#F5A623;}
        .fp-day.off{background:#F7F7F8;color:#9A9AAA;}
        .fp-hours{font-size:.62rem;color:#5A5A6A;margin-bottom:.75rem;}

        .fp-footer-btns{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;}
        .fp-view-btn{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.5rem;font-size:.68rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;text-align:center;font-family:inherit;}
        .fp-view-btn:hover{border-color:#F5A623;color:#D4830A;}
        .fp-request-btn{background:#0a0a2e;border:none;border-radius:1rem;padding:.5rem;font-family:'Syne',sans-serif;font-size:.68rem;font-weight:800;color:#F5A623;cursor:pointer;text-align:center;}
        .fp-request-btn:hover{background:#14145c;}
      `}</style>

      <div className="fp-shell">
        <nav className="fp-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="fp-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="fp-tb-right">
            <div className="fp-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="fp-bell-badge"></div>
            </div>
            <div className="fp-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="fp-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>

          <div className="fp-side-section">Booking</div>
          <Link href="/home" className="fp-nav">
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="fp-nav-label">Home</span>
          </Link>
          <Link href="/find-a-barber" className="fp-nav on">
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <span className="fp-nav-label">Find a {config.providerLabel}</span>
          </Link>
          <button type="button" className="fp-nav" onClick={() => router.push('/notifications')}>
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="fp-nav-label">Notifications</span>
          </button>

          <div className="fp-side-section">Account</div>
          <Link href="/profile" className="fp-nav">
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="fp-nav-label">My Profile</span>
          </Link>
          <Link href="/history" className="fp-nav">
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="fp-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="fp-nav">
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="fp-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="fp-nav">
            <span className="fp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="fp-nav-label">Support</span>
          </Link>

          <div className="fp-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="fp-main">
          <div className="fp-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button type="button" className="fp-back" onClick={() => router.push('/find-a-barber')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
              <div>
                <span className="fp-results-count">{TOTAL} {config.providerLabel.toLowerCase()}s</span>
                <span className="fp-results-zip">in {zip} &middot; {area.city}{area.state ? ', ' + area.state : ''}</span>
              </div>
            </div>
            <div className="fp-sort-btns">
              {([
                { key: 'recommended', label: 'Recommended' },
                { key: 'rating', label: 'Rating' },
                { key: 'az', label: 'A→Z' },
              ] as { key: Sort; label: string }[]).map(s => (
                <button
                  key={s.key}
                  type="button"
                  className={'fp-sort-btn' + (sort === s.key ? ' on' : '')}
                  onClick={() => setSort(s.key)}
                >{s.label}</button>
              ))}
            </div>
          </div>

          <div className="fp-pool-grid">
            {sorted.map(b => (
              <div key={b.id} className="fp-card">
                <div className="fp-banner" style={{ background: b.bannerGradient }}>
                  <div className="fp-license">{b.license}</div>
                  <div className="fp-verified">&#10003; Verified</div>
                  <div className="fp-avatar" style={{ background: b.avatarBg, color: b.avatarFg }}>{b.initials}</div>
                </div>
                <div className="fp-body">
                  <div className="fp-name">{b.firstName} {b.lastInitial}.</div>
                  <div className="fp-code">
                    <div className="fp-cc-city">{b.city}</div>
                    <div className="fp-cc-state">{b.state}</div>
                    <div className="fp-cc-init">{b.codeMaskInit}</div>
                    <div className="fp-cc-digits">{b.codeMaskDigits}</div>
                  </div>
                  <div className="fp-rating">
                    <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span> {b.rating.toFixed(2)} &middot; {b.visits} visits
                  </div>
                  <div className="fp-zips">
                    {b.zips.map(z => <div key={z} className="fp-zip-badge">{z}</div>)}
                  </div>
                  <div className="fp-section-label">Services</div>
                  <div className="fp-services">
                    {b.services.map(s => (
                      <div key={s.label} className="fp-service">
                        <div className="fp-svc-label">{s.label}</div>
                        <div className="fp-svc-val">{s.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="fp-section-label">Availability</div>
                  <div className="fp-days">
                    {b.days.map((on, i) => (
                      <div key={i} className={'fp-day ' + (on ? 'on' : 'off')}>{DAY_LETTERS[i]}</div>
                    ))}
                  </div>
                  <div className="fp-hours">{b.hours}{b.afterHours ? ' · After hours by request' : ''}</div>
                  <div className="fp-footer-btns">
                    <button type="button" className="fp-view-btn" onClick={() => router.push(`/public-profile?barber=${b.id}`)}>View Profile</button>
                    <button type="button" className="fp-request-btn" onClick={() => router.push(`/public-profile?barber=${b.id}`)}>Request</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>
    </>
  );
}
