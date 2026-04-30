'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

interface Invite {
  id: string;
  name: string;
  date: string;
  status: 'Pending' | 'Connected';
}

const INVITES: Invite[] = [
  { id: 'i1', name: 'Marcus J.', date: 'Tapped link · Jul 15 · pending registration', status: 'Pending' },
  { id: 'i2', name: 'Kevin T.', date: 'Connected via code · Jul 12', status: 'Connected' },
  { id: 'i3', name: 'Lisa M.', date: 'Connected via code · Jul 10', status: 'Connected' },
  { id: 'i4', name: 'David C.', date: 'Tapped link · Jul 9 · pending registration', status: 'Pending' },
  { id: 'i5', name: 'Rayford Gibson', date: 'Connected via code · Jul 3', status: 'Connected' },
];

const STATS = { connected: 14, pending: 3, taps: 47 };

const barber = {
  initials: 'JM',
  name: 'John Merrick',
  codeId: 'JMR·7749',
  shop: 'The Studio · South Houston, TX',
  city: 'South Houston',
  state: 'TX',
  codeInitials: 'JMR',
  codeDigits: '7749',
};

export default function ShareCodePage() {
  const { prefix, highlight } = splitServiceName();

  const [toast, setToast] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string>(`https://thybarber.shop/invite/${barber.codeInitials}${barber.codeDigits}`);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Strip the protocol for the on-card display ("thybarber.shop/invite/…").
  const inviteDisplay = inviteUrl.replace(/^https?:\/\//, '');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/barber/share');
        if (!res.ok) return;
        const data = (await res.json()) as { inviteUrl?: string; qrCodeUrl?: string };
        if (cancelled) return;
        if (data.inviteUrl) setInviteUrl(data.inviteUrl);
        if (data.qrCodeUrl) setQrCodeUrl(data.qrCodeUrl);
      } catch {
        // Keep local fallback values.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl)
      .then(() => showToast('Link copied — ' + inviteDisplay))
      .catch(() => showToast(inviteDisplay));
  }

  function shareVia(platform: string) {
    showToast('Sharing via ' + platform + ' in production');
  }

  async function downloadQr() {
    if (!qrCodeUrl) {
      showToast('QR is being generated — try again in a moment');
      return;
    }
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `QR_${barber.codeInitials}${barber.codeDigits}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      showToast('QR code downloaded');
    } catch {
      showToast('Could not download QR — opening in new tab');
      window.open(qrCodeUrl, '_blank');
    }
  }

  return (
    <>
      <style>{`
        .sh-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .sh-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .sh-tb-left{display:flex;align-items:center;gap:.85rem;}
        .sh-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .sh-logo span{color:#F5A623;}
        .sh-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .sh-code .city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .sh-code .state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .sh-code .init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .sh-code .digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .sh-tb-right{display:flex;align-items:center;gap:.75rem;}
        .sh-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .sh-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .sh-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .sh-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .sh-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .sh-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .sh-nav:hover{background:rgba(255,255,255,.05);}
        .sh-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .sh-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .sh-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .sh-nav.on .sh-nav-label,.sh-nav:hover .sh-nav-label{color:#fff;}
        .sh-nav.on .sh-nav-label{font-weight:600;}
        .sh-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#F5A623;color:#0a0a2e;}
        .sh-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .sh-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}
        .sh-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start;}

        .sh-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;margin-bottom:1.25rem;}
        .sh-stat{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1rem;box-shadow:0 4px 16px rgba(0,0,0,.07);text-align:center;}
        .sh-stat.amber{background:rgba(245,166,35,.08);border-color:rgba(245,166,35,.25);}
        .sh-stat-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#0a0a2e;}
        .sh-stat.amber .sh-stat-val{color:#D4830A;}
        .sh-stat-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-top:.2rem;}

        .sh-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .sh-card:last-child{margin-bottom:0;}
        .sh-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .sh-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .sh-hero{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:2rem;text-align:center;box-shadow:0 .5rem 2rem rgba(0,0,0,.12);margin-bottom:1.25rem;}
        .sh-ch-label{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.75rem;}
        .sh-ch-code{display:inline-flex;border-radius:.4rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;margin-bottom:1rem;}
        .sh-ch-code .city{background:#F5A623;color:#0a0a2e;padding:.4rem .85rem;}
        .sh-ch-code .state{background:rgba(255,255,255,.12);color:#fff;padding:.4rem .65rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .sh-ch-code .init{background:rgba(255,255,255,.08);color:#F5A623;padding:.4rem .65rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .sh-ch-code .digits{background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);padding:.4rem .85rem;}
        .sh-ch-name{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;margin-bottom:.25rem;}
        .sh-ch-shop{font-size:.75rem;color:rgba(255,255,255,.45);margin-bottom:1.25rem;}

        .sh-link-wrap{display:flex;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:1rem;overflow:hidden;margin-bottom:1rem;}
        .sh-link-text{flex:1;padding:.65rem .85rem;font-family:'DM Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;}
        .sh-link-copy{background:#F5A623;border:none;padding:.65rem 1rem;font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;color:#0a0a2e;cursor:pointer;white-space:nowrap;}
        .sh-link-copy:hover{opacity:.88;}

        .sh-share-btns{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;}
        .sh-share-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;border:1.5px solid rgba(255,255,255,.12);border-radius:1rem;padding:.6rem;font-size:.72rem;font-weight:600;color:rgba(255,255,255,.7);cursor:pointer;background:rgba(255,255,255,.06);font-family:inherit;}
        .sh-share-btn:hover{background:rgba(255,255,255,.12);color:#fff;}

        .sh-qr-wrap{display:flex;flex-direction:column;align-items:center;padding:1.25rem;background:#fff;border-radius:1.25rem;margin-top:1rem;}
        .sh-qr-grid{display:grid;grid-template-columns:repeat(9,1.4rem);grid-template-rows:repeat(9,1.4rem);gap:.1rem;margin-bottom:.75rem;}
        .sh-qr-cell{border-radius:.1rem;}
        .sh-qr-label{font-size:.65rem;color:#9A9AAA;text-align:center;}
        .sh-btn-dl-qr{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.5rem 1.25rem;font-size:.75rem;font-weight:600;color:#5A5A6A;cursor:pointer;background:#fff;margin-top:.6rem;font-family:inherit;}
        .sh-btn-dl-qr:hover{border-color:#F5A623;color:#D4830A;}

        .sh-how-step{display:flex;gap:.85rem;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.09);align-items:flex-start;}
        .sh-how-step:last-child{border-bottom:none;}
        .sh-hs-num{width:1.75rem;height:1.75rem;border-radius:50%;background:#0a0a2e;color:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;flex-shrink:0;margin-top:.1rem;}
        .sh-hs-info{flex:1;}
        .sh-hs-title{font-size:.82rem;font-weight:700;color:#111118;margin-bottom:.15rem;}
        .sh-hs-desc{font-size:.7rem;color:#5A5A6A;line-height:1.5;}

        .sh-invite-row{display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .sh-invite-row:last-child{border-bottom:none;}
        .sh-ir-info{flex:1;}
        .sh-ir-name{font-size:.82rem;font-weight:600;color:#111118;}
        .sh-ir-date{font-size:.62rem;color:#9A9AAA;margin-top:.1rem;}
        .sh-ir-status{display:inline-flex;border-radius:9999px;padding:.12rem .55rem;font-size:.6rem;font-weight:700;}
        .irs-pending{background:rgba(245,166,35,.08);color:#D4830A;}
        .irs-connected{background:#EAF3DE;color:#3B6D11;}

        .sh-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}

        @media(max-width:60rem){.sh-two-col{grid-template-columns:1fr;}}
      `}</style>

      <div className="sh-shell">
        <nav className="sh-topbar">
          <div className="sh-tb-left">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="sh-logo">{prefix}<span>{highlight}</span></div>
            </Link>
            <div className="sh-code">
              <div className="city">{barber.city}</div>
              <div className="state">{barber.state}</div>
              <div className="init">{barber.codeInitials}</div>
              <div className="digits">{barber.codeDigits}</div>
            </div>
          </div>
          <div className="sh-tb-right">
            <div className="sh-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="sh-bell-badge"></div>
            </div>
            <div className="sh-tb-avatar">{barber.initials}</div>
          </div>
        </nav>

        <aside className="sh-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{barber.initials}</div>
            <div className="si-name">{barber.name}</div>
            <div className="si-id">{barber.codeId}</div>
          </div>

          <div className="sh-side-section">Main</div>
          <Link href="/dashboard" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="sh-nav-label">Dashboard</span>
          </Link>
          <Link href="/calendar" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="sh-nav-label">Calendar</span>
          </Link>
          <Link href="/clients" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span className="sh-nav-label">Clients</span>
            <span className="sh-nav-badge">14</span>
          </Link>

          <div className="sh-side-section">Business</div>
          <Link href="/payment-log" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span className="sh-nav-label">Payment Log</span>
          </Link>
          <Link href="/share" className="sh-nav on">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <span className="sh-nav-label">Share Code</span>
          </Link>

          <div className="sh-side-section">Account</div>
          <Link href="/public-profile" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="sh-nav-label">Profile</span>
          </Link>
          <Link href="/work-history" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="sh-nav-label">Work History</span>
            <span className="sh-nav-badge">312</span>
          </Link>
          <Link href="/settings" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="sh-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="sh-nav">
            <span className="sh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="sh-nav-label">Support</span>
          </Link>

          <div className="sh-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="sh-main">
          <div className="sh-stats">
            <div className="sh-stat amber">
              <div className="sh-stat-val">{STATS.connected}</div>
              <div className="sh-stat-label">Connected via Code</div>
            </div>
            <div className="sh-stat">
              <div className="sh-stat-val">{STATS.pending}</div>
              <div className="sh-stat-label">Pending Invites</div>
            </div>
            <div className="sh-stat">
              <div className="sh-stat-val">{STATS.taps}</div>
              <div className="sh-stat-label">Link Taps</div>
            </div>
          </div>

          <div className="sh-two-col">
            {/* LEFT */}
            <div>
              <div className="sh-hero">
                <div className="sh-ch-label">Your Barber Code</div>
                <div className="sh-ch-code">
                  <div className="city">{barber.city}</div>
                  <div className="state">{barber.state}</div>
                  <div className="init">{barber.codeInitials}</div>
                  <div className="digits">{barber.codeDigits}</div>
                </div>
                <div className="sh-ch-name">{barber.name}</div>
                <div className="sh-ch-shop">{barber.shop}</div>

                <div className="sh-link-wrap">
                  <div className="sh-link-text">{inviteDisplay}</div>
                  <button type="button" className="sh-link-copy" onClick={copyLink}>Copy Link</button>
                </div>

                <div className="sh-share-btns">
                  <button type="button" className="sh-share-btn" onClick={() => shareVia('Text')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Text
                  </button>
                  <button type="button" className="sh-share-btn" onClick={() => shareVia('WhatsApp')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    WhatsApp
                  </button>
                  <button type="button" className="sh-share-btn" onClick={() => shareVia('Instagram')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                    Instagram
                  </button>
                  <button type="button" className="sh-share-btn" onClick={() => shareVia('Facebook')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    Facebook
                  </button>
                </div>

                <div className="sh-qr-wrap">
                  {qrCodeUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={qrCodeUrl}
                      alt={`Invite QR · ${barber.codeInitials}${barber.codeDigits}`}
                      width={300}
                      height={300}
                      style={{ width: '12.6rem', height: '12.6rem', display: 'block', marginBottom: '.75rem', borderRadius: '.5rem' }}
                    />
                  ) : (
                    <div style={{ width: '12.6rem', height: '12.6rem', marginBottom: '.75rem', borderRadius: '.5rem', background: '#F7F7F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A9AAA', fontSize: '.7rem' }}>Generating QR…</div>
                  )}
                  <div className="sh-qr-label">Scan to connect with {barber.name.split(' ')[0]} &middot; {inviteDisplay}</div>
                  <button type="button" className="sh-btn-dl-qr" onClick={downloadQr} disabled={!qrCodeUrl}>Download QR Code</button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="sh-card">
                <div className="sh-card-title">How It Works</div>
                <div className="sh-how-step">
                  <div className="sh-hs-num">1</div>
                  <div className="sh-hs-info">
                    <div className="sh-hs-title">Share your code or link</div>
                    <div className="sh-hs-desc">Send your invite link by text, WhatsApp, or post your QR code anywhere &mdash; chair, mirror, social media.</div>
                  </div>
                </div>
                <div className="sh-how-step">
                  <div className="sh-hs-num">2</div>
                  <div className="sh-hs-info">
                    <div className="sh-hs-title">Client taps and registers</div>
                    <div className="sh-hs-desc">They create a free {config.serviceName} account. No pool fee. Your code pre-fills their connection to you.</div>
                  </div>
                </div>
                <div className="sh-how-step">
                  <div className="sh-hs-num">3</div>
                  <div className="sh-hs-info">
                    <div className="sh-hs-title">You approve the connection</div>
                    <div className="sh-hs-desc">A connection request comes to your dashboard. Review their profile and approve. They&rsquo;re now in your client list.</div>
                  </div>
                </div>
                <div className="sh-how-step">
                  <div className="sh-hs-num">4</div>
                  <div className="sh-hs-info">
                    <div className="sh-hs-title">Set your Chair Rate together</div>
                    <div className="sh-hs-desc">Once connected, you both agree on a Chair Rate. They can book directly from then on &mdash; no pool, no middleman.</div>
                  </div>
                </div>
              </div>

              <div className="sh-card">
                <div className="sh-card-title">Recent Invites</div>
                {INVITES.map(inv => (
                  <div key={inv.id} className="sh-invite-row">
                    <div className="sh-ir-info">
                      <div className="sh-ir-name">{inv.name}</div>
                      <div className="sh-ir-date">{inv.date}</div>
                    </div>
                    <span className={'sh-ir-status ' + (inv.status === 'Pending' ? 'irs-pending' : 'irs-connected')}>{inv.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="sh-toast">{toast}</div>}
    </>
  );
}
