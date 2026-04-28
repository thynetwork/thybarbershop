'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

interface Area {
  zip: string;
  name: string;
  count: number;
}

const POPULAR_AREAS: Area[] = [
  { zip: '77587', name: 'South Houston', count: 17 },
  { zip: '77502', name: 'Pasadena', count: 9 },
  { zip: '77584', name: 'Pearland', count: 14 },
  { zip: '77003', name: 'Third Ward', count: 22 },
  { zip: '77004', name: 'Midtown', count: 18 },
  { zip: '77007', name: 'Heights', count: 11 },
  { zip: '77036', name: 'Sharpstown', count: 24 },
  { zip: '77033', name: 'Sunnyside', count: 8 },
];

const NO_MATCH_FALLBACK: Record<string, string> = {
  '77001': 'Houston',
  '77002': 'Houston',
  '77005': 'Houston',
  '77006': 'Houston',
};

const client = { initials: 'RG' };

export default function FindABarberPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [zip, setZip] = useState('');
  const [noMatchNote, setNoMatchNote] = useState('');

  function doSearch(zipValue?: string) {
    const z = (zipValue ?? zip).trim();
    if (!/^\d{5}$/.test(z)) return;
    const fallback = NO_MATCH_FALLBACK[z];
    if (fallback) {
      setNoMatchNote(`No ${config.providerLabel.toLowerCase()}s in ${z} · showing nearby ${fallback} area ${config.providerLabel.toLowerCase()}s instead.`);
      setTimeout(() => router.push(`/find-a-barber/${z}`), 1200);
    } else {
      setNoMatchNote('');
      router.push(`/find-a-barber/${z}`);
    }
  }

  function selectZip(z: string) {
    setZip(z);
    doSearch(z);
  }

  return (
    <>
      <style>{`
        .fa-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .fa-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .fa-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .fa-logo span{color:#F5A623;}
        .fa-tb-right{display:flex;align-items:center;gap:.75rem;}
        .fa-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .fa-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .fa-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .fa-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .fa-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .fa-side-section:first-child{margin-top:0;}
        .fa-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .fa-nav:hover{background:rgba(255,255,255,.05);}
        .fa-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .fa-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .fa-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .fa-nav.on .fa-nav-label,.fa-nav:hover .fa-nav-label{color:#fff;}
        .fa-nav.on .fa-nav-label{font-weight:600;}
        .fa-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .fa-main{overflow-y:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;gap:1.5rem;background:#F7F7F8;}

        .fa-search-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:2rem;box-shadow:0 .5rem 2rem rgba(0,0,0,.12);width:100%;max-width:32rem;text-align:center;}
        .fa-search-icon{width:3.5rem;height:3.5rem;border-radius:50%;background:#0a0a2e;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;}
        .fa-search-title{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#111118;margin-bottom:.35rem;}
        .fa-search-sub{font-size:.82rem;color:#5A5A6A;line-height:1.6;margin-bottom:1.5rem;}
        .fa-zip-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.85rem 1rem;font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#0a0a2e;outline:none;letter-spacing:.15em;text-align:center;margin-bottom:.5rem;}
        .fa-zip-input:focus{border-color:#F5A623;}
        .fa-zip-input::placeholder{font-weight:400;letter-spacing:0;color:#9A9AAA;font-size:.88rem;}
        .fa-btn-search{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.85rem;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#F5A623;cursor:pointer;}
        .fa-btn-search:hover{background:#14145c;}
        .fa-btn-search:disabled{opacity:.5;cursor:not-allowed;}
        .fa-no-match{font-size:.7rem;color:#D4830A;background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.25);border-radius:.75rem;padding:.5rem .75rem;margin-top:.5rem;text-align:left;line-height:1.5;}

        .fa-nearby{width:100%;max-width:32rem;}
        .fa-nearby-label{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.6rem;}
        .fa-zip-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;}
        .fa-zip-chip{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.65rem .4rem;text-align:center;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.07);transition:all .15s;font-family:inherit;}
        .fa-zip-chip:hover{border-color:#F5A623;background:rgba(245,166,35,.08);}
        .fa-zc-code{font-family:'Syne',sans-serif;font-size:.88rem;font-weight:800;color:#0a0a2e;letter-spacing:.05em;}
        .fa-zc-name{font-size:.58rem;color:#5A5A6A;margin-top:.1rem;}
        .fa-zc-count{font-size:.6rem;font-weight:700;color:#D4830A;margin-top:.2rem;}
      `}</style>

      <div className="fa-shell">
        <nav className="fa-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="fa-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="fa-tb-right">
            <div className="fa-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="fa-bell-badge"></div>
            </div>
            <div className="fa-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="fa-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">Rayford Gibson</div>
            <div className="si-id">RAYF&middot;8834</div>
          </div>
          <div className="fa-side-section">Booking</div>
          <Link href="/home" className="fa-nav">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="fa-nav-label">Home</span>
          </Link>
          <Link href="/find-a-barber" className="fa-nav on">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <span className="fa-nav-label">Find a {config.providerLabel}</span>
          </Link>
          <button type="button" className="fa-nav" onClick={() => router.push('/notifications')}>
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="fa-nav-label">Notifications</span>
          </button>

          <div className="fa-side-section">Account</div>
          <Link href="/profile" className="fa-nav">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="fa-nav-label">My Profile</span>
          </Link>
          <Link href="/household" className="fa-nav">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
            <span className="fa-nav-label">Household</span>
          </Link>
          <Link href="/history" className="fa-nav">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="fa-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="fa-nav">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="fa-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="fa-nav">
            <span className="fa-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="fa-nav-label">Support</span>
          </Link>

          <div className="fa-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="fa-main">
          <div className="fa-search-card">
            <div className="fa-search-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
            </div>
            <div className="fa-search-title">Find a {config.providerLabel}</div>
            <div className="fa-search-sub">Enter a zip code to browse verified {config.providerLabel.toLowerCase()}s in that area. Browse their profiles, check their work, and request a connection.</div>
            <input
              className="fa-zip-input"
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="Enter zip code"
              value={zip}
              onChange={(e) => { setZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setNoMatchNote(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
            />
            <button
              type="button"
              className="fa-btn-search"
              onClick={() => doSearch()}
              disabled={!/^\d{5}$/.test(zip)}
            >Search {config.providerLabel}s</button>
            {noMatchNote && <div className="fa-no-match">{noMatchNote}</div>}
          </div>

          <div className="fa-nearby">
            <div className="fa-nearby-label">Popular areas near you</div>
            <div className="fa-zip-grid">
              {POPULAR_AREAS.map(a => (
                <button key={a.zip} type="button" className="fa-zip-chip" onClick={() => selectZip(a.zip)}>
                  <div className="fa-zc-code">{a.zip}</div>
                  <div className="fa-zc-name">{a.name}</div>
                  <div className="fa-zc-count">{a.count} {config.providerLabel.toLowerCase()}s</div>
                </button>
              ))}
            </div>
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
