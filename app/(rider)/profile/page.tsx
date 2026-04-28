'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

interface Barber {
  id: string;
  initials: string;
  name: string;
  city: string;
  state: string;
  codeInitials: string;
  digits: string;
  rate: string;
  lastVisit: string;
  bg: string;
  fg: string;
}

const BARBERS: Barber[] = [
  { id: 'mr', initials: 'MR', name: 'Marcus Rivera', city: 'South Houston', state: 'TX', codeInitials: 'MRC', digits: '3341', rate: '$45', lastVisit: 'Jul 10', bg: '#F5A623', fg: '#0a0a2e' },
  { id: 'dj', initials: 'DJ', name: 'DeShawn Jackson', city: 'Watts', state: 'CA', codeInitials: 'DSJ', digits: '8812', rate: '$50', lastVisit: 'Jun 28', bg: '#1a1a6e', fg: '#F5A623' },
];

const BANNER_GRADIENTS: { key: string; title: string; gradient: string }[] = [
  { key: 'navy', title: 'Navy', gradient: 'linear-gradient(135deg,#1a1a6e,#0a0a2e)' },
  { key: 'green', title: 'Forest', gradient: 'linear-gradient(135deg,#0d2818,#1a4a2e)' },
  { key: 'purple', title: 'Deep Purple', gradient: 'linear-gradient(135deg,#1a0a2e,#2d1b69)' },
  { key: 'black', title: 'Charcoal', gradient: 'linear-gradient(135deg,#1a1a1a,#3a3a3a)' },
  { key: 'brown', title: 'Walnut', gradient: 'linear-gradient(135deg,#2e1a0a,#6b3a1f)' },
  { key: 'blue', title: 'Midnight Blue', gradient: 'linear-gradient(135deg,#0a1a2e,#1a3a5e)' },
];

const client = {
  initials: 'RG',
  name: 'Rayford Gibson',
  preferredName: 'Ray',
  clientId: 'RAYF·8834',
  defaultAddress: '1234 Westheimer Rd, Houston, TX 77006',
};

export default function ClientProfilePage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [bannerKey, setBannerKey] = useState('navy');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [contactPref, setContactPref] = useState<'Call' | 'Text only' | 'Either' | 'Do not contact'>('Text only');
  const [visitFreq, setVisitFreq] = useState<'Weekly' | 'Bi-weekly' | 'Monthly' | 'As needed'>('Weekly');
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Midday' | 'Afternoon' | 'Evening'>('Midday');
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set(['Th']));
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function toggleDay(d: string) {
    setActiveDays(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      return next;
    });
  }

  const currentGradient = BANNER_GRADIENTS.find(g => g.key === bannerKey)?.gradient ?? BANNER_GRADIENTS[0].gradient;

  return (
    <>
      <style>{`
        .rp-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .rp-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .rp-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .rp-logo span{color:#F5A623;}
        .rp-tb-right{display:flex;align-items:center;gap:.75rem;}
        .rp-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .rp-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .rp-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .rp-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .rp-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .rp-side-section:first-child{margin-top:0;}
        .rp-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .rp-nav:hover{background:rgba(255,255,255,.05);}
        .rp-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .rp-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .rp-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .rp-nav.on .rp-nav-label,.rp-nav:hover .rp-nav-label{color:#fff;}
        .rp-nav.on .rp-nav-label{font-weight:600;}
        .rp-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .rp-main{overflow-y:auto;padding:1.5rem 1.5rem 2rem;background:#F7F7F8;}

        .rp-banner{border-radius:1.25rem;margin-bottom:1.25rem;box-shadow:0 8px 32px rgba(0,0,0,.12);overflow:hidden;position:relative;}
        .rp-bg{min-height:11rem;position:relative;}
        .rp-change-banner{position:absolute;top:.75rem;right:.75rem;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.2);border-radius:9999px;padding:.3rem .85rem;font-size:.65rem;font-weight:600;color:rgba(255,255,255,.8);cursor:pointer;backdrop-filter:blur(4px);display:flex;align-items:center;gap:.4rem;}
        .rp-change-banner:hover{background:rgba(0,0,0,.6);color:#fff;}
        .rp-pb-content{position:absolute;bottom:0;left:0;right:0;padding:1.25rem 1.5rem;background:linear-gradient(to top,rgba(10,10,46,.92) 0%,rgba(10,10,46,.4) 70%,transparent 100%);display:flex;align-items:flex-end;gap:1.25rem;}
        .rp-pb-avatar{width:6rem;height:6rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;border:.25rem solid rgba(255,255,255,.2);flex-shrink:0;cursor:pointer;position:relative;box-shadow:0 .25rem 1rem rgba(0,0,0,.3);}
        .rp-pb-avatar-edit{position:absolute;bottom:.1rem;right:.1rem;width:1.6rem;height:1.6rem;border-radius:50%;background:#F5A623;border:.15rem solid #0a0a2e;display:flex;align-items:center;justify-content:center;}
        .rp-pb-info{flex:1;padding-bottom:.25rem;}
        .rp-pb-name{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:.25rem;line-height:1;}
        .rp-pb-id{font-family:'DM Mono',monospace;font-size:.88rem;color:rgba(255,255,255,.45);margin-bottom:.6rem;}
        .rp-pb-badges{display:flex;flex-wrap:wrap;gap:.4rem;}
        .rp-badge{display:inline-flex;align-items:center;border-radius:9999px;padding:.18rem .65rem;font-size:.62rem;font-weight:700;}
        .rp-badge-green{background:rgba(59,109,17,.3);color:#7ec85a;border:1px solid rgba(126,200,90,.4);}
        .rp-badge-amber{background:rgba(245,166,35,.2);color:#F5A623;border:1px solid rgba(245,166,35,.4);}
        .rp-pb-save-btn{background:#F5A623;border:none;border-radius:9999px;padding:.45rem 1rem;font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;color:#0a0a2e;cursor:pointer;white-space:nowrap;flex-shrink:0;margin-bottom:.25rem;}
        .rp-pb-save-btn:hover{opacity:.88;}

        .rp-banner-picker{position:absolute;top:2.8rem;right:.75rem;background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.85rem;box-shadow:0 8px 32px rgba(0,0,0,.12);z-index:20;min-width:14rem;}
        .rp-bp-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9A9AAA;margin-bottom:.5rem;}
        .rp-bp-swatches{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.6rem;}
        .rp-bp-swatch{width:1.75rem;height:1.75rem;border-radius:.35rem;cursor:pointer;border:.15rem solid transparent;}
        .rp-bp-swatch:hover{transform:scale(1.1);}
        .rp-bp-swatch.on{border-color:#0a0a2e;}
        .rp-bp-upload{width:100%;border:1.5px dashed rgba(0,0,0,.09);border-radius:.75rem;padding:.5rem;text-align:center;font-size:.72rem;font-weight:600;color:#5A5A6A;cursor:pointer;background:none;font-family:inherit;}
        .rp-bp-upload:hover{border-color:#F5A623;color:#D4830A;}

        .rp-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start;}

        .rp-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .rp-card:last-child{margin-bottom:0;}
        .rp-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .rp-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .rp-label{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.35rem;margin-top:.75rem;display:block;}
        .rp-label:first-child{margin-top:0;}
        .rp-label .sub{font-weight:400;text-transform:none;letter-spacing:0;font-size:.6rem;}
        .rp-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.82rem;color:#111118;outline:none;background:#fff;}
        .rp-input:focus{border-color:#F5A623;}
        .rp-input:disabled{background:#F7F7F8;color:#9A9AAA;cursor:not-allowed;}
        .rp-textarea{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.82rem;color:#111118;resize:none;outline:none;line-height:1.5;}
        .rp-textarea:focus{border-color:#F5A623;}

        .rp-toggle-group{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.4rem;}
        .rp-tog-opt{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.25rem .75rem;font-size:.7rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .rp-tog-opt:hover{border-color:rgba(245,166,35,.25);}
        .rp-tog-opt.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .rp-day-pills{display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.4rem;}
        .rp-day-pill{width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.62rem;font-weight:700;cursor:pointer;border:1.5px solid rgba(0,0,0,.09);background:#fff;color:#5A5A6A;font-family:inherit;}
        .rp-day-pill.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .rp-day-pill:hover:not(.on){border-color:rgba(245,166,35,.25);}

        .rp-barber-row{display:flex;align-items:center;gap:.85rem;padding:.75rem .5rem;border-bottom:1px solid rgba(0,0,0,.09);cursor:pointer;border-radius:.75rem;}
        .rp-barber-row:last-of-type{border-bottom:none;}
        .rp-barber-row:hover{background:#F7F7F8;}
        .rp-br-avatar{width:2.4rem;height:2.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.75rem;flex-shrink:0;}
        .rp-br-info{flex:1;min-width:0;}
        .rp-br-name{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#111118;}
        .rp-br-code{font-family:'DM Mono',monospace;font-size:.62rem;color:#9A9AAA;margin-top:.1rem;}
        .rp-br-right{text-align:right;flex-shrink:0;}
        .rp-br-rate{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#D4830A;}
        .rp-br-last{font-size:.62rem;color:#9A9AAA;margin-top:.1rem;}
        .rp-br-chevron{font-size:1rem;color:#9A9AAA;margin-left:.4rem;}
        .rp-add-barber{width:100%;border:1.5px dashed rgba(0,0,0,.09);border-radius:1rem;padding:.7rem;font-size:.78rem;font-weight:600;color:#5A5A6A;cursor:pointer;background:none;margin-top:.5rem;text-align:center;font-family:inherit;}
        .rp-add-barber:hover{border-color:#F5A623;color:#D4830A;}

        .rp-safety{background:#EAF3DE;border:1.5px solid #97C459;border-radius:1.25rem;padding:1rem 1.1rem;display:flex;align-items:center;gap:.85rem;margin-bottom:1.25rem;}
        .rp-safety-icon{width:2.5rem;height:2.5rem;border-radius:50%;background:#3B6D11;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .rp-safety-title{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#3B6D11;margin-bottom:.15rem;}
        .rp-safety-text{font-size:.68rem;color:#5A5A6A;line-height:1.5;}
        .rp-safety-btn{margin-left:auto;background:#3B6D11;border:none;border-radius:9999px;padding:.35rem .85rem;font-size:.68rem;font-weight:700;color:#fff;cursor:pointer;flex-shrink:0;font-family:inherit;}

        .rp-clientid{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.1rem 1.25rem;}
        .rp-clientid-label{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.4rem;}
        .rp-clientid-id{font-family:'DM Mono',monospace;font-size:1.4rem;font-weight:500;color:#F5A623;letter-spacing:.06em;margin-bottom:.35rem;}
        .rp-clientid-note{font-size:.65rem;color:rgba(255,255,255,.35);line-height:1.6;}

        .rp-btn-save{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.85rem;font-family:'Syne',sans-serif;font-size:.88rem;font-weight:800;color:#F5A623;cursor:pointer;margin-top:1.25rem;}
        .rp-btn-save:hover{background:#14145c;}

        .rp-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}

        @media(max-width:40rem){.rp-two-col{grid-template-columns:1fr;}}
      `}</style>

      <div className="rp-shell">
        <nav className="rp-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
            <Link href="/home" style={{ textDecoration: 'none' }}>
              <div className="rp-logo">{prefix}<span>{highlight}</span></div>
            </Link>
          </div>
          <div className="rp-tb-right">
            <div className="rp-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="rp-bell-badge"></div>
            </div>
            <div className="rp-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="rp-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>
          <div className="rp-side-section">Booking</div>
          <Link href="/home" className="rp-nav">
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="rp-nav-label">Home</span>
          </Link>
          <button type="button" className="rp-nav" onClick={() => showToast('Goes to booking flow')}>
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="rp-nav-label">Book</span>
          </button>
          <button type="button" className="rp-nav" onClick={() => showToast('Opens notifications')}>
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="rp-nav-label">Notifications</span>
          </button>

          <div className="rp-side-section">Account</div>
          <Link href="/profile" className="rp-nav on">
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="rp-nav-label">My Profile</span>
          </Link>
          <Link href="/history" className="rp-nav">
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="rp-nav-label">Appointment History</span>
          </Link>
          <Link href="/rider-settings" className="rp-nav">
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="rp-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="rp-nav">
            <span className="rp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="rp-nav-label">Support</span>
          </Link>

          <div className="rp-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="rp-main">
          {/* Profile banner */}
          <div className="rp-banner">
            <div className="rp-bg" style={{ background: currentGradient }}>
              <div className="rp-change-banner" onClick={(e) => { e.stopPropagation(); setPickerOpen(p => !p); }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Change Banner
              </div>
              {pickerOpen && (
                <div className="rp-banner-picker" onClick={(e) => e.stopPropagation()}>
                  <div className="rp-bp-label">Choose a color</div>
                  <div className="rp-bp-swatches">
                    {BANNER_GRADIENTS.map(g => (
                      <div
                        key={g.key}
                        className={'rp-bp-swatch' + (bannerKey === g.key ? ' on' : '')}
                        style={{ background: g.gradient }}
                        title={g.title}
                        onClick={() => { setBannerKey(g.key); setPickerOpen(false); }}
                      />
                    ))}
                  </div>
                  <button type="button" className="rp-bp-upload" onClick={() => { showToast('Opens file picker for banner photo'); setPickerOpen(false); }}>Upload your own photo</button>
                </div>
              )}
            </div>
            <div className="rp-pb-content">
              <div className="rp-pb-avatar" onClick={() => showToast('Opens camera or file picker')}>
                {client.initials}
                <div className="rp-pb-avatar-edit">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0a2e" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
              </div>
              <div className="rp-pb-info">
                <div className="rp-pb-name">{client.name}</div>
                <div className="rp-pb-id">{client.clientId}</div>
                <div className="rp-pb-badges">
                  <span className="rp-badge rp-badge-green">Safety Protocol Complete</span>
                  <span className="rp-badge rp-badge-amber">{BARBERS.length} Barbers Connected</span>
                </div>
              </div>
              <button type="button" className="rp-pb-save-btn" onClick={() => showToast('Profile saved successfully')}>Save Changes</button>
            </div>
          </div>

          <div className="rp-two-col">
            {/* LEFT */}
            <div>
              <div className="rp-card">
                <div className="rp-card-title">Identity</div>
                <label className="rp-label">Preferred Name <span className="sub">&middot; what your barber calls you</span></label>
                <input className="rp-input" defaultValue={client.preferredName}/>
                <label className="rp-label">Full Name <span className="sub">&middot; read only &middot; from Safety Protocol</span></label>
                <input className="rp-input" defaultValue={client.name} disabled/>
                <label className="rp-label">Contact Preference</label>
                <div className="rp-toggle-group">
                  {(['Call', 'Text only', 'Either', 'Do not contact'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={'rp-tog-opt' + (contactPref === opt ? ' on' : '')}
                      onClick={() => setContactPref(opt)}
                    >{opt}</button>
                  ))}
                </div>
              </div>

              <div className="rp-card">
                <div className="rp-card-title">Style Preferences</div>
                <label className="rp-label">What I usually get</label>
                <input className="rp-input" defaultValue="Fade + Line-up &middot; tight on sides"/>
                <label className="rp-label">Hair notes for my barber</label>
                <textarea
                  className="rp-textarea"
                  rows={3}
                  defaultValue={'Sensitive at the nape — go slow. No razor on top. Like the line crisp and sharp every time.'}
                />
              </div>

              <div className="rp-card">
                <div className="rp-card-title">Visit Pattern</div>
                <label className="rp-label">How often I come</label>
                <div className="rp-toggle-group">
                  {(['Weekly', 'Bi-weekly', 'Monthly', 'As needed'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={'rp-tog-opt' + (visitFreq === opt ? ' on' : '')}
                      onClick={() => setVisitFreq(opt)}
                    >{opt}</button>
                  ))}
                </div>
                <label className="rp-label">Preferred day</label>
                <div className="rp-day-pills">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div
                      key={d}
                      className={'rp-day-pill' + (activeDays.has(d) ? ' on' : '')}
                      onClick={() => toggleDay(d)}
                    >{d}</div>
                  ))}
                </div>
                <label className="rp-label">Preferred time</label>
                <div className="rp-toggle-group">
                  {(['Morning', 'Midday', 'Afternoon', 'Evening'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={'rp-tog-opt' + (preferredTime === opt ? ' on' : '')}
                      onClick={() => setPreferredTime(opt)}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="rp-card">
                <div className="rp-card-title">My Barbers</div>
                {BARBERS.map(b => (
                  <div key={b.id} className="rp-barber-row" onClick={() => router.push('/public-profile')}>
                    <div className="rp-br-avatar" style={{ background: b.bg, color: b.fg }}>{b.initials}</div>
                    <div className="rp-br-info">
                      <div className="rp-br-name">{b.name}</div>
                      <div className="rp-br-code">{b.city} &middot; {b.state} &middot; {b.codeInitials} &middot; {b.digits}</div>
                    </div>
                    <div className="rp-br-right">
                      <div className="rp-br-rate">{b.rate}</div>
                      <div className="rp-br-last">Last: {b.lastVisit}</div>
                    </div>
                    <div className="rp-br-chevron">&rsaquo;</div>
                  </div>
                ))}
                <button type="button" className="rp-add-barber" onClick={() => showToast('Goes to FA1 Find a Barber')}>+ Find a Barber</button>
              </div>

              <div className="rp-safety">
                <div className="rp-safety-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                </div>
                <div>
                  <div className="rp-safety-title">Safety Protocol Complete</div>
                  <div className="rp-safety-text">Encrypted &middot; emergency use only &middot; emergency contact and address on file.</div>
                </div>
                <button type="button" className="rp-safety-btn" onClick={() => showToast('Opens Safety Protocol update')}>View / Update</button>
              </div>

              <div className="rp-card">
                <div className="rp-card-title">Default Address</div>
                <div style={{ fontSize: '.68rem', color: '#5A5A6A', marginBottom: '.6rem', lineHeight: 1.5 }}>Used as your default location for mobile barber appointments.</div>
                <input className="rp-input" defaultValue={client.defaultAddress}/>
              </div>

              <div className="rp-clientid">
                <div className="rp-clientid-label">Your Client ID</div>
                <div className="rp-clientid-id">{client.clientId}</div>
                <div className="rp-clientid-note">Permanent &middot; never changes &middot; travels with you across all barbers and all {config.companyName.replace(' Inc.', '')} platforms.</div>
              </div>
            </div>
          </div>

          <button type="button" className="rp-btn-save" onClick={() => showToast('Profile saved successfully')}>Save Profile</button>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="rp-toast">{toast}</div>}
    </>
  );
}
