'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

interface PayMethod {
  id: string;
  name: string;
  active: boolean;
  handle: string;
  placeholder: string;
  bg: string;
  letter: string;
  letterFont: string;
  letterSize: number;
  isCash?: boolean;
}

interface Specialty {
  name: string;
  active: boolean;
  rate: string;
}

const INITIAL_SPECIALTIES: Specialty[] = [
  { name: 'Adult Cuts', active: false, rate: '' },
  { name: 'Kid Cuts', active: false, rate: '' },
  { name: 'Beard & Mustache', active: false, rate: '' },
  { name: 'Razor Shaves', active: false, rate: '' },
  { name: 'Classic Cuts', active: false, rate: '' },
  { name: 'Clean Style Cuts', active: false, rate: '' },
  { name: 'Fades', active: false, rate: '' },
  { name: 'Tapers', active: false, rate: '' },
  { name: 'Parts & Designs', active: false, rate: '' },
  { name: 'Toupees', active: false, rate: '' },
  { name: 'Man Weaves', active: false, rate: '' },
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function EditProfilePage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [vibeText, setVibeText] = useState(
    "South Houston's spot for clean fades and sharp line-ups. Twelve years behind the chair — professional, consistent, and on time. The chair is where you reset. Come correct, leave sharp."
  );
  const [specialties, setSpecialties] = useState<Specialty[]>(INITIAL_SPECIALTIES);
  const [locType, setLocType] = useState<'Shop' | 'Mobile' | 'Both'>('Shop');
  const [afterHours, setAfterHours] = useState<'By request' | 'Not available'>('By request');
  const [activeDays, setActiveDays] = useState<Set<string>>(
    new Set(['Mo', 'Tu', 'We', 'Th', 'Sa'])
  );
  const [toast, setToast] = useState('');
  const [payMethods, setPayMethods] = useState<PayMethod[]>([
    { id: 'zelle', name: 'Zelle', active: true, handle: '(713) 555-0182', placeholder: 'Phone number or email', bg: '#6d1ed4', letter: 'Z', letterFont: 'Arial Black,sans-serif', letterSize: 16 },
    { id: 'venmo', name: 'Venmo', active: true, handle: '@marcus-rivera-htx', placeholder: '@your-venmo-handle', bg: '#008cff', letter: 'venmo', letterFont: 'Arial,sans-serif', letterSize: 11 },
    { id: 'cashapp', name: 'Cash App', active: false, handle: '', placeholder: '$YourCashtag', bg: '#00d64f', letter: '$', letterFont: 'Arial Black,sans-serif', letterSize: 16 },
    { id: 'cash', name: 'Cash', active: true, handle: '', placeholder: 'No handle needed — pay in person', bg: '#2e7d32', letter: '$', letterFont: 'serif', letterSize: 22, isCash: true },
    { id: 'stripe', name: 'Stripe', active: false, handle: '', placeholder: 'Your Stripe payment link', bg: '#635bff', letter: 'stripe', letterFont: 'Arial,sans-serif', letterSize: 11 },
  ]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function toggleSpec(name: string) {
    setSpecialties(prev => prev.map(s =>
      s.name === name
        ? { ...s, active: !s.active, rate: s.active ? '' : s.rate }
        : s
    ));
  }

  function updateSpecRate(name: string, rate: string) {
    setSpecialties(prev => prev.map(s => s.name === name ? { ...s, rate } : s));
  }

  function toggleDay(d: string) {
    setActiveDays(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      return next;
    });
  }

  function togglePay(id: string) {
    setPayMethods(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  }

  function updatePayHandle(id: string, val: string) {
    setPayMethods(prev => prev.map(m => m.id === id ? { ...m, handle: val } : m));
  }

  const vibeLen = vibeText.length;

  return (
    <>
      <style>{`
        .ep-shell{display:grid;grid-template-columns:220px 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .ep-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .ep-tb-left{display:flex;align-items:center;gap:.85rem;}
        .ep-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .ep-logo span{color:#F5A623;}
        .ep-tcode{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .ep-tcode .city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .ep-tcode .state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .ep-tcode .init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .ep-tcode .digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .ep-tb-right{display:flex;align-items:center;gap:.75rem;}
        .ep-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .ep-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:2px solid #0a0a2e;}
        .ep-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .ep-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .ep-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .ep-side-section:first-child{margin-top:0;}
        .ep-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:3px solid transparent;text-decoration:none;}
        .ep-nav:hover{background:rgba(255,255,255,.05);}
        .ep-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .ep-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .ep-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .ep-nav.on .ep-nav-label,.ep-nav:hover .ep-nav-label{color:#fff;}
        .ep-nav.on .ep-nav-label{font-weight:600;}
        .ep-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#F5A623;color:#0a0a2e;}
        .ep-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .ep-main{overflow-y:auto;padding:1.5rem 1.5rem 6rem;background:#F7F7F8;}

        .ep-prompt{background:rgba(245,166,35,.08);border:1.5px solid rgba(245,166,35,.25);border-radius:1.25rem;padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;}
        .ep-prompt-icon{width:2.5rem;height:2.5rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;flex-shrink:0;}
        .ep-prompt-title{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#D4830A;margin-bottom:.2rem;}
        .ep-prompt-text{font-size:.72rem;color:#5A5A6A;line-height:1.5;}
        .ep-prompt-pct{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#D4830A;margin-left:auto;text-align:center;flex-shrink:0;}
        .ep-prompt-pct span{display:block;font-size:.6rem;color:#9A9AAA;font-weight:400;}

        .ep-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .ep-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:1rem;display:flex;align-items:center;gap:.4rem;}
        .ep-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .ep-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1rem;}
        .ep-field{margin-bottom:1rem;}
        .ep-field:last-child{margin-bottom:0;}
        .ep-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.35rem;display:flex;justify-content:space-between;align-items:center;}
        .ep-label .sub{font-weight:400;text-transform:none;letter-spacing:0;font-size:.6rem;color:#9A9AAA;}
        .ep-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.65rem .85rem;font-family:'DM Sans',sans-serif;font-size:.85rem;color:#111118;outline:none;background:#fff;}
        .ep-input:focus{border-color:#F5A623;}
        .ep-textarea{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.65rem .85rem;font-family:'DM Sans',sans-serif;font-size:.85rem;color:#111118;resize:none;outline:none;line-height:1.6;}
        .ep-textarea:focus{border-color:#F5A623;}
        .ep-char{font-size:.6rem;color:#9A9AAA;text-align:right;margin-top:.2rem;}
        .ep-char.warn{color:#D4830A;}

        .ep-photo-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;margin-bottom:1rem;}
        .ep-photo-box{border:2px dashed rgba(0,0,0,.09);border-radius:1.25rem;padding:1rem;text-align:center;cursor:pointer;background:#F7F7F8;transition:all .15s;}
        .ep-photo-box:hover{border-color:#F5A623;background:rgba(245,166,35,.08);}
        .ep-photo-box.uploaded{border-style:solid;border-color:#97C459;background:#EAF3DE;}
        .ep-pb-icon{width:2rem;height:2rem;margin:0 auto .4rem;display:flex;align-items:center;justify-content:center;}
        .ep-pb-label{font-size:.72rem;font-weight:700;color:#111118;margin-bottom:.1rem;}
        .ep-pb-sub{font-size:.6rem;color:#9A9AAA;}
        .ep-pb-ok{font-size:.6rem;color:#3B6D11;font-weight:600;margin-top:.25rem;}
        .ep-pb-pending{font-size:.6rem;color:#D4830A;font-weight:600;margin-top:.25rem;}

        .ep-portfolio{display:grid;grid-template-columns:repeat(6,1fr);gap:.4rem;margin-bottom:.75rem;}
        .ep-thumb{aspect-ratio:1;border-radius:.75rem;background:#F7F7F8;border:1.5px solid rgba(0,0,0,.09);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;}
        .ep-thumb:hover{border-color:#F5A623;}
        .ep-thumb.add{border-style:dashed;color:#9A9AAA;font-size:1.4rem;font-weight:300;}
        .ep-thumb.add:hover{color:#D4830A;border-color:rgba(245,166,35,.25);}
        .ep-port-actions{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;}
        .ep-btn-photo{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.6rem;font-size:.75rem;font-weight:600;color:#5A5A6A;cursor:pointer;background:#fff;text-align:center;font-family:'DM Sans',sans-serif;}
        .ep-btn-photo:hover{border-color:#F5A623;color:#D4830A;}
        .ep-btn-thyhair{background:#0a0a2e;border:none;border-radius:1rem;padding:.6rem;font-family:'Syne',sans-serif;font-size:.75rem;font-weight:800;color:#F5A623;cursor:pointer;text-align:center;}

        .ep-spec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;}
        .ep-spec-wrap{display:flex;flex-direction:column;gap:0;}
        .ep-spec{border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.55rem .7rem;font-size:.72rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;display:flex;align-items:center;gap:.4rem;font-family:'DM Sans',sans-serif;}
        .ep-spec:hover{border-color:rgba(245,166,35,.25);}
        .ep-spec.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;border-radius:.75rem .75rem 0 0;}
        .ep-spec-dot{width:.35rem;height:.35rem;border-radius:50%;background:currentColor;flex-shrink:0;}
        .ep-spec-price{display:none;align-items:center;justify-content:space-between;background:#F7F7F8;border:1.5px solid #0a0a2e;border-top:none;border-radius:0 0 .75rem .75rem;padding:.4rem .7rem;}
        .ep-spec-price.on{display:flex;}
        .ep-spec-price-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9A9AAA;}
        .ep-spec-price-wrap{display:flex;align-items:center;gap:.2rem;}
        .ep-spec-dollar{font-family:'Syne',sans-serif;font-size:.8rem;font-weight:800;color:#0a0a2e;}
        .ep-spec-price-input{width:3.5rem;border:1px solid rgba(0,0,0,.09);border-radius:.4rem;padding:.2rem .35rem;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#0a0a2e;text-align:right;outline:none;background:#fff;}
        .ep-spec-price-input:focus{border-color:#F5A623;}
        .ep-spec-price-input:disabled{background:transparent;border-color:transparent;color:#9A9AAA;}

        .ep-loc-toggle{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.4rem;margin-bottom:.75rem;}
        .ep-loc-toggle.two{grid-template-columns:1fr 1fr;}
        .ep-loc-opt{border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem;text-align:center;cursor:pointer;font-size:.72rem;font-weight:700;color:#5A5A6A;background:#fff;font-family:'DM Sans',sans-serif;}
        .ep-loc-opt:hover{border-color:rgba(245,166,35,.25);}
        .ep-loc-opt.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .ep-days{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.75rem;}
        .ep-day{width:2.2rem;height:2.2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;cursor:pointer;border:1.5px solid rgba(0,0,0,.09);background:#fff;color:#5A5A6A;font-family:'DM Sans',sans-serif;}
        .ep-day.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .ep-day:hover:not(.on){border-color:rgba(245,166,35,.25);}
        .ep-time-row{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;}

        .ep-pay{display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:.75rem;padding:.85rem;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;margin-bottom:.5rem;background:#fff;}
        .ep-pay:last-child{margin-bottom:0;}
        .ep-pay.active{border-color:rgba(245,166,35,.25);background:rgba(245,166,35,.08);}
        .ep-pay-icon{width:2.5rem;height:2.5rem;border-radius:.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-weight:900;}
        .ep-pay-info{flex:1;min-width:0;}
        .ep-pay-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#111118;margin-bottom:.3rem;}
        .ep-pay-handle{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.4rem .65rem;font-family:'DM Mono',monospace;font-size:.78rem;color:#111118;outline:none;background:#fff;}
        .ep-pay-handle:focus{border-color:#F5A623;}
        .ep-pay-handle:disabled{background:#F7F7F8;color:#9A9AAA;cursor:not-allowed;}
        .ep-pay-toggle{flex-shrink:0;border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.3rem .85rem;font-size:.68rem;font-weight:700;cursor:pointer;background:#fff;color:#5A5A6A;font-family:'DM Sans',sans-serif;white-space:nowrap;}
        .ep-pay-toggle.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .ep-savebar{position:fixed;bottom:0;right:0;width:calc(100% - 220px);background:#fff;border-top:1.5px solid rgba(0,0,0,.09);padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;z-index:50;box-shadow:0 -4px 20px rgba(0,0,0,.08);}
        .ep-savebar-note{font-size:.72rem;color:#5A5A6A;}
        .ep-savebar-note strong{color:#111118;}
        .ep-savebar-actions{display:flex;gap:.75rem;flex-shrink:0;}
        .ep-btn-view{border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.65rem 1.25rem;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;color:#5A5A6A;cursor:pointer;background:#fff;white-space:nowrap;}
        .ep-btn-view:hover{border-color:#F5A623;color:#D4830A;}
        .ep-btn-save{background:#0a0a2e;border:none;border-radius:1rem;padding:.65rem 1.5rem;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#F5A623;cursor:pointer;white-space:nowrap;}
        .ep-btn-save:hover{background:#14145c;}

        .ep-toast{position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:500;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="ep-shell">
        {/* Topbar */}
        <nav className="ep-topbar">
          <div className="ep-tb-left">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="ep-logo">{prefix}<span>{highlight}</span></div>
            </Link>
            <div className="ep-tcode">
              <div className="city">South Houston</div>
              <div className="state">TX</div>
              <div className="init">MRC</div>
              <div className="digits">3341</div>
            </div>
          </div>
          <div className="ep-tb-right">
            <div className="ep-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="ep-bell-badge"></div>
            </div>
            <div className="ep-avatar">MR</div>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="ep-sidebar">
          <div className="ep-side-section">Main</div>
          <Link href="/dashboard" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="ep-nav-label">Dashboard</span>
          </Link>
          <Link href="/calendar" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="ep-nav-label">Calendar</span>
          </Link>
          <Link href="/clients" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span className="ep-nav-label">Clients</span>
            <span className="ep-nav-badge">14</span>
          </Link>

          <div className="ep-side-section">Business</div>
          <Link href="/payment-log" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span className="ep-nav-label">Payment Log</span>
          </Link>
          <Link href="/share" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <span className="ep-nav-label">Share Code</span>
          </Link>

          <div className="ep-side-section">Account</div>
          <Link href="/edit-profile" className="ep-nav on">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="ep-nav-label">Profile</span>
          </Link>
          <Link href="/history" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="ep-nav-label">Work History</span>
            <span className="ep-nav-badge">312</span>
          </Link>
          <Link href="/settings" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="ep-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="ep-nav">
            <span className="ep-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="ep-nav-label">Support</span>
          </Link>

          <div className="ep-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        {/* Main */}
        <main className="ep-main">
          {/* Progress prompt */}
          <div className="ep-prompt">
            <div className="ep-prompt-icon">68%</div>
            <div>
              <div className="ep-prompt-title">Complete your profile</div>
              <div className="ep-prompt-text">Clients in the pool see your profile before requesting a connection. A complete profile gets more connections.</div>
            </div>
            <div className="ep-prompt-pct">68%<span>complete</span></div>
          </div>

          {/* Identity & Shop */}
          <div className="ep-card">
            <div className="ep-card-title">Identity &amp; Shop</div>

            <div className="ep-row">
              <div className="ep-field" style={{ marginBottom: 0 }}>
                <div className="ep-label">Shop Name</div>
                <input className="ep-input" defaultValue="The Studio"/>
              </div>
              <div className="ep-field" style={{ marginBottom: 0 }}>
                <div className="ep-label">Years Licensed</div>
                <input className="ep-input" type="number" defaultValue={12} min={1} max={50}/>
              </div>
            </div>

            <div className="ep-field" style={{ marginTop: '0.85rem' }}>
              <div className="ep-label">Shop Vibe <span className="sub">{vibeLen} / 300</span></div>
              <textarea
                className="ep-textarea"
                rows={3}
                maxLength={300}
                value={vibeText}
                onChange={(e) => setVibeText(e.target.value)}
              />
              <div className={'ep-char' + (vibeLen > 270 ? ' warn' : '')}>{vibeLen} / 300</div>
            </div>

            <div className="ep-field">
              <div className="ep-label">Shop Video URL <span className="sub">YouTube or Instagram reel &middot; optional</span></div>
              <input className="ep-input" placeholder="https://youtube.com/..."/>
            </div>

            <div className="ep-label" style={{ marginBottom: '0.5rem' }}>Shop Photos</div>
            <div className="ep-photo-row">
              <div className="ep-photo-box uploaded" onClick={() => showToast('Upload profile photo — opens file picker in production')}>
                <div className="ep-pb-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="ep-pb-label">Profile Photo</div>
                <div className="ep-pb-sub">Front facing &middot; no hats</div>
                <div className="ep-pb-ok">Uploaded &middot; Approved</div>
              </div>
              <div className="ep-photo-box" onClick={() => showToast('Upload shop logo — opens file picker in production')}>
                <div className="ep-pb-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9A9AAA" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="ep-pb-label">Shop Logo</div>
                <div className="ep-pb-sub">Optional &middot; PNG preferred</div>
                <div className="ep-pb-pending">Not uploaded</div>
              </div>
              <div className="ep-photo-box" onClick={() => showToast('Upload banner — opens file picker in production')}>
                <div className="ep-pb-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9A9AAA" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                </div>
                <div className="ep-pb-label">Banner Photo</div>
                <div className="ep-pb-sub">Chair &middot; workspace &middot; shop</div>
                <div className="ep-pb-pending">Not uploaded</div>
              </div>
            </div>
          </div>

          {/* The Craft */}
          <div className="ep-card">
            <div className="ep-card-title">The Craft</div>

            <div className="ep-field">
              <div className="ep-label">Specialties &amp; Rates <span className="sub">toggle on &middot; enter your price &middot; shown on your profile and booking screens</span></div>
              <div className="ep-spec-grid">
                {specialties.map(spec => (
                  <div key={spec.name} className="ep-spec-wrap">
                    <div
                      className={'ep-spec' + (spec.active ? ' on' : '')}
                      onClick={() => toggleSpec(spec.name)}
                    >
                      <div className="ep-spec-dot"></div>{spec.name}
                    </div>
                    <div className={'ep-spec-price' + (spec.active ? ' on' : '')}>
                      <span className="ep-spec-price-label">Rate</span>
                      <div className="ep-spec-price-wrap">
                        <span className="ep-spec-dollar">$</span>
                        <input
                          className="ep-spec-price-input"
                          type="number"
                          placeholder="0"
                          value={spec.rate}
                          disabled={!spec.active}
                          onChange={(e) => updateSpecRate(spec.name, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ep-field">
              <div className="ep-label">Interests &amp; Background <span className="sub">what you talk about in the chair</span></div>
              <textarea
                className="ep-textarea"
                rows={3}
                placeholder="Sports, music, community — what makes your chair different from the next one?"
                defaultValue="Sports, Houston Texans, music, community. South Houston native — been cutting since I was 16. Family man. I talk about whatever my client wants or keep it quiet — their chair, their vibe."
              />
            </div>

            <div className="ep-field">
              <div className="ep-label">Haircut Portfolio Photos</div>
              <div className="ep-portfolio">
                <div className="ep-thumb" style={{ background: '#e8f5e9' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5"><path d="M6.343 17.657A8 8 0 1 0 19.07 7.929M6 12l-2 2 2 2"/><path d="M20 12l2-2-2-2"/></svg>
                </div>
                <div className="ep-thumb" style={{ background: '#e3f2fd' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="ep-thumb" style={{ background: '#fce4ec' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="ep-thumb" style={{ background: '#f3e5f5' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a1b9a" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="ep-thumb" style={{ background: '#fff8e1' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f57f17" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="ep-thumb add" onClick={() => showToast('Opens camera or file picker in production')}>+</div>
              </div>
              <div className="ep-port-actions">
                <button type="button" className="ep-btn-photo" onClick={() => showToast('Opens camera or file picker in production')}>Upload Photo</button>
                <button type="button" className="ep-btn-thyhair" onClick={() => showToast('Opening ThyHair portfolio page in production')}>View Full Portfolio on ThyHair</button>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="ep-card">
            <div className="ep-card-title">Business Info</div>
            <div className="ep-field">
              <div className="ep-label">Location Type</div>
              <div className="ep-loc-toggle">
                {(['Shop', 'Mobile', 'Both'] as const).map(opt => (
                  <div
                    key={opt}
                    className={'ep-loc-opt' + (locType === opt ? ' on' : '')}
                    onClick={() => setLocType(opt)}
                  >{opt}</div>
                ))}
              </div>
            </div>
            <div className="ep-row">
              <div className="ep-field" style={{ marginBottom: 0 }}>
                <div className="ep-label">Shop Address</div>
                <input className="ep-input" defaultValue="4521 Main St, South Houston, TX 77587"/>
              </div>
              <div className="ep-field" style={{ marginBottom: 0 }}>
                <div className="ep-label">Service Areas <span className="sub">if mobile</span></div>
                <input className="ep-input" defaultValue="South Houston &middot; Pasadena &middot; Pearland"/>
              </div>
            </div>
            <div className="ep-field" style={{ marginTop: '0.85rem' }}>
              <div className="ep-label">Availability</div>
              <div className="ep-days">
                {DAYS.map(d => (
                  <div
                    key={d}
                    className={'ep-day' + (activeDays.has(d) ? ' on' : '')}
                    onClick={() => toggleDay(d)}
                  >{d}</div>
                ))}
              </div>
              <div className="ep-time-row">
                <div>
                  <div className="ep-label">Start</div>
                  <input className="ep-input" type="time" defaultValue="08:00"/>
                </div>
                <div>
                  <div className="ep-label">End</div>
                  <input className="ep-input" type="time" defaultValue="18:00"/>
                </div>
              </div>
            </div>
            <div className="ep-field">
              <div className="ep-label">After Hours</div>
              <div className="ep-loc-toggle two">
                {(['By request', 'Not available'] as const).map(opt => (
                  <div
                    key={opt}
                    className={'ep-loc-opt' + (afterHours === opt ? ' on' : '')}
                    onClick={() => setAfterHours(opt)}
                  >{opt}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="ep-card">
            <div className="ep-card-title">
              Payment Methods <span style={{ fontSize: '0.6rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A9AAA' }}>&middot; at least one required &middot; clients pay you directly &middot; {config.serviceName} never touches the money</span>
            </div>

            {payMethods.map(m => (
              <div key={m.id} className={'ep-pay' + (m.active ? ' active' : '')}>
                <div className="ep-pay-icon" style={{ background: m.bg, fontFamily: m.letterFont, fontSize: m.letterSize, fontWeight: m.letter === 'venmo' || m.letter === 'stripe' ? 700 : 900 }}>
                  {m.letter}
                </div>
                <div className="ep-pay-info">
                  <div className="ep-pay-name">{m.name}</div>
                  <input
                    className="ep-pay-handle"
                    placeholder={m.placeholder}
                    value={m.handle}
                    onChange={(e) => updatePayHandle(m.id, e.target.value)}
                    disabled={!m.active || m.isCash}
                    style={m.isCash ? { color: '#9A9AAA', fontStyle: 'italic', fontFamily: "'DM Sans', sans-serif" } : undefined}
                  />
                </div>
                <button
                  type="button"
                  className={'ep-pay-toggle' + (m.active ? ' on' : '')}
                  onClick={() => togglePay(m.id)}
                >{m.active ? 'Active' : 'Add'}</button>
              </div>
            ))}
          </div>
        </main>

        {/* Footer (site-wide) */}
        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {/* Floating save bar */}
      <div className="ep-savebar">
        <div className="ep-savebar-note"><strong>Review before saving</strong> &middot; View your public profile to see exactly what clients will see &mdash; then save when ready.</div>
        <div className="ep-savebar-actions">
          <button type="button" className="ep-btn-view" onClick={() => router.push('/public-profile')}>View Public Profile</button>
          <button type="button" className="ep-btn-save" onClick={() => showToast('Profile saved successfully')}>Save Profile</button>
        </div>
      </div>

      {toast && <div className="ep-toast">{toast}</div>}
    </>
  );
}
