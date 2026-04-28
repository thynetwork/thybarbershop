'use client';

import { useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

type CancelPolicy = 'Flexible — no charge ever' | 'Standard — 50% within 24hrs' | 'Custom';
type NoShowPolicy = 'Charge full' | 'Charge 50%' | 'Waive first · charge after' | 'Always forgive';
type RescheduleWindow = 'Same day' | '24 hrs' | '48 hrs' | 'Same week' | 'None';
type FreeMisses = '0' | '1' | '2' | 'Unlimited';
type LoyaltyOverride = 'Off' | '10+ visits' | '25+ visits' | '50+ visits';
type BufferTime = 'None' | '15 min' | '30 min';
type AdvanceLimit = '1 wk' | '2 wks' | '1 mo' | 'No limit';

const barber = { initials: 'JM', name: 'John Merrick', codeId: 'JMR·7749', city: 'South Houston', state: 'TX', codeInitials: 'JMR', codeDigits: '7749', email: 'john.merrick@thestudio.com', phone: '(713) 555-0182', license: 'TX-BBR-0042871' };

export default function BarberSettingsPage() {
  const { prefix, highlight } = splitServiceName();

  const [pushOn, setPushOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [lateAlertOn, setLateAlertOn] = useState(true);
  const [poolReqOn, setPoolReqOn] = useState(true);
  const [emailOn, setEmailOn] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(true);

  const [bufferTime, setBufferTime] = useState<BufferTime>('15 min');
  const [advanceLimit, setAdvanceLimit] = useState<AdvanceLimit>('2 wks');
  const [cancelPolicy, setCancelPolicy] = useState<CancelPolicy>('Standard — 50% within 24hrs');
  const [noShowPolicy, setNoShowPolicy] = useState<NoShowPolicy>('Waive first · charge after');
  const [rescheduleWindow, setRescheduleWindow] = useState<RescheduleWindow>('Same week');
  const [freeMisses, setFreeMisses] = useState<FreeMisses>('1');
  const [loyaltyOverride, setLoyaltyOverride] = useState<LoyaltyOverride>('25+ visits');

  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  return (
    <>
      <style>{`
        .bs-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .bs-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .bs-tb-left{display:flex;align-items:center;gap:.85rem;}
        .bs-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .bs-logo span{color:#F5A623;}
        .bs-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .bs-code .city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .bs-code .state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .bs-code .init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .bs-code .digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .bs-tb-right{display:flex;align-items:center;gap:.75rem;}
        .bs-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .bs-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .bs-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .bs-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .bs-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .bs-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .bs-nav:hover{background:rgba(255,255,255,.05);}
        .bs-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .bs-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .bs-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .bs-nav.on .bs-nav-label,.bs-nav:hover .bs-nav-label{color:#fff;}
        .bs-nav.on .bs-nav-label{font-weight:600;}
        .bs-nav-badge{margin-left:auto;border-radius:9999px;font-size:.58rem;font-weight:800;padding:.1rem .45rem;background:#F5A623;color:#0a0a2e;}
        .bs-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .bs-main{overflow-y:auto;padding:1.5rem 1.5rem 2rem;background:#F7F7F8;}
        .bs-page-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#111118;margin-bottom:1.25rem;}

        .bs-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .bs-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .bs-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .bs-row{display:flex;justify-content:space-between;align-items:center;padding:.85rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .bs-row:last-child{border-bottom:none;}
        .bs-row.col{flex-direction:column;align-items:flex-start;}
        .bs-left{flex:1;}
        .bs-label{font-size:.85rem;font-weight:600;color:#111118;margin-bottom:.15rem;}
        .bs-sub{font-size:.68rem;color:#9A9AAA;line-height:1.4;}
        .bs-right{flex-shrink:0;margin-left:1rem;}

        .bs-toggle{width:2.75rem;height:1.5rem;border-radius:9999px;background:#d0d0dc;position:relative;cursor:pointer;border:none;flex-shrink:0;transition:background .2s;}
        .bs-toggle.on{background:#0a0a2e;}
        .bs-knob{width:1.1rem;height:1.1rem;border-radius:50%;background:#fff;position:absolute;top:50%;transform:translateY(-50%);left:.2rem;transition:left .2s;box-shadow:0 .1rem .3rem rgba(0,0,0,.2);}
        .bs-toggle.on .bs-knob{left:1.45rem;}

        .bs-policy-opts{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem;}
        .bs-policy-opt{border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.45rem .85rem;font-size:.72rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .bs-policy-opt:hover{border-color:rgba(245,166,35,.25);}
        .bs-policy-opt.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .bs-philosophy{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.25rem;margin-bottom:1rem;}
        .bs-phil-label{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.6rem;}
        .bs-phil-text{font-size:.8rem;color:rgba(255,255,255,.75);line-height:1.8;font-style:italic;}

        .bs-account-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .bs-account-row:last-child{border-bottom:none;}
        .bs-ar-key{font-size:.72rem;color:#9A9AAA;font-weight:600;}
        .bs-ar-val{font-size:.82rem;font-weight:600;color:#111118;}
        .bs-ar-change{font-size:.68rem;font-weight:600;color:#D4830A;cursor:pointer;background:none;border:none;font-family:inherit;}

        .bs-pill-active{background:#EAF3DE;color:#3B6D11;border:1px solid #97C459;border-radius:9999px;padding:.1rem .5rem;font-size:.6rem;font-weight:700;}

        .bs-danger{border:1.5px solid rgba(180,40,40,.2);border-radius:1.25rem;padding:1.25rem;background:rgba(180,40,40,.03);}
        .bs-dz-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#b42828;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .bs-dz-title::after{content:'';flex:1;height:1px;background:rgba(180,40,40,.15);}
        .bs-dz-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(180,40,40,.1);gap:1rem;}
        .bs-dz-row:last-child{border-bottom:none;}
        .bs-dz-label{font-size:.82rem;font-weight:600;color:#111118;}
        .bs-dz-sub{font-size:.65rem;color:#9A9AAA;margin-top:.1rem;line-height:1.4;}
        .bs-dz-btn{border:1.5px solid rgba(180,40,40,.3);border-radius:1rem;padding:.4rem .85rem;font-size:.72rem;font-weight:700;color:#b42828;cursor:pointer;background:none;font-family:inherit;white-space:nowrap;}
        .bs-dz-btn:hover{background:rgba(180,40,40,.07);}

        .bs-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="bs-shell">
        <nav className="bs-topbar">
          <div className="bs-tb-left">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="bs-logo">{prefix}<span>{highlight}</span></div>
            </Link>
            <div className="bs-code">
              <div className="city">{barber.city}</div>
              <div className="state">{barber.state}</div>
              <div className="init">{barber.codeInitials}</div>
              <div className="digits">{barber.codeDigits}</div>
            </div>
          </div>
          <div className="bs-tb-right">
            <div className="bs-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="bs-bell-badge"></div>
            </div>
            <div className="bs-tb-avatar">{barber.initials}</div>
          </div>
        </nav>

        <aside className="bs-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{barber.initials}</div>
            <div className="si-name">{barber.name}</div>
            <div className="si-id">{barber.codeId}</div>
          </div>

          <div className="bs-side-section">Main</div>
          <Link href="/dashboard" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="bs-nav-label">Dashboard</span>
          </Link>
          <Link href="/calendar" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="bs-nav-label">Calendar</span>
          </Link>
          <Link href="/clients" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span className="bs-nav-label">Clients</span>
            <span className="bs-nav-badge">14</span>
          </Link>

          <div className="bs-side-section">Business</div>
          <Link href="/payment-log" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span className="bs-nav-label">Payment Log</span>
          </Link>
          <Link href="/share" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <span className="bs-nav-label">Share Code</span>
          </Link>

          <div className="bs-side-section">Account</div>
          <Link href="/public-profile" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="bs-nav-label">Profile</span>
          </Link>
          <button type="button" className="bs-nav" onClick={() => showToast('Opens work history')}>
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="bs-nav-label">Work History</span>
            <span className="bs-nav-badge">312</span>
          </button>
          <Link href="/settings" className="bs-nav on">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="bs-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="bs-nav">
            <span className="bs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="bs-nav-label">Support</span>
          </Link>

          <div className="bs-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="bs-main">
          <div className="bs-page-title">Settings</div>

          {/* Notifications */}
          <div className="bs-card">
            <div className="bs-card-title">Notifications</div>

            {([
              { label: 'Push notifications', sub: 'New booking requests · confirmations · reminders', val: pushOn, set: setPushOn },
              { label: 'SMS alerts', sub: 'Text messages for new requests and confirmations', val: smsOn, set: setSmsOn },
              { label: 'Client running late alert', sub: "Notify me if a client hasn't confirmed 30 mins before", val: lateAlertOn, set: setLateAlertOn },
              { label: 'New pool connection request', sub: 'Alert when a pool visitor requests to connect', val: poolReqOn, set: setPoolReqOn },
              { label: 'Email notifications', sub: 'Weekly summary · payment reminders', val: emailOn, set: setEmailOn },
            ] as const).map(item => (
              <div key={item.label} className="bs-row">
                <div className="bs-left">
                  <div className="bs-label">{item.label}</div>
                  <div className="bs-sub">{item.sub}</div>
                </div>
                <div className="bs-right">
                  <button
                    type="button"
                    className={'bs-toggle' + (item.val ? ' on' : '')}
                    onClick={() => item.set(!item.val)}
                  >
                    <div className="bs-knob"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Defaults */}
          <div className="bs-card">
            <div className="bs-card-title">Booking Defaults</div>

            <div className="bs-row">
              <div className="bs-left">
                <div className="bs-label">Auto-confirm bookings</div>
                <div className="bs-sub">Connected clients skip approval &middot; books instantly</div>
              </div>
              <div className="bs-right">
                <button type="button" className={'bs-toggle' + (autoConfirm ? ' on' : '')} onClick={() => setAutoConfirm(p => !p)}>
                  <div className="bs-knob"></div>
                </button>
              </div>
            </div>

            <div className="bs-row">
              <div className="bs-left">
                <div className="bs-label">Appointment buffer time</div>
                <div className="bs-sub">Gap between appointments to avoid back-to-back pressure</div>
              </div>
              <div className="bs-right">
                <div style={{ display: 'flex', gap: '.35rem' }}>
                  {(['None', '15 min', '30 min'] as BufferTime[]).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={'bs-policy-opt' + (bufferTime === opt ? ' on' : '')}
                      onClick={() => setBufferTime(opt)}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bs-row">
              <div className="bs-left">
                <div className="bs-label">Advance booking limit</div>
                <div className="bs-sub">How far ahead clients can book</div>
              </div>
              <div className="bs-right">
                <div style={{ display: 'flex', gap: '.35rem' }}>
                  {(['1 wk', '2 wks', '1 mo', 'No limit'] as AdvanceLimit[]).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={'bs-policy-opt' + (advanceLimit === opt ? ' on' : '')}
                      onClick={() => setAdvanceLimit(opt)}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="bs-philosophy">
            <div className="bs-phil-label">A note before you set your policy</div>
            <div className="bs-phil-text">&ldquo;Your best clients are regulars. Regulars have lives &mdash; kids, work, emergencies. A rigid policy pushes them to Booksy or StyleSeat. A flexible policy keeps them loyal for years. This platform is here to help you keep clients &mdash; not give them a reason to leave.&rdquo;</div>
          </div>

          {/* Cancellation Policy */}
          <div className="bs-card">
            <div className="bs-card-title">Cancellation Policy</div>

            <div className="bs-row col">
              <div className="bs-label">Cancellation</div>
              <div className="bs-sub" style={{ marginBottom: '.5rem' }}>Your default policy for all clients &middot; override per client in their profile</div>
              <div className="bs-policy-opts">
                {(['Flexible — no charge ever', 'Standard — 50% within 24hrs', 'Custom'] as CancelPolicy[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={'bs-policy-opt' + (cancelPolicy === opt ? ' on' : '')}
                    onClick={() => setCancelPolicy(opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className="bs-row col">
              <div className="bs-label">No-show policy</div>
              <div className="bs-policy-opts">
                {(['Charge full', 'Charge 50%', 'Waive first · charge after', 'Always forgive'] as NoShowPolicy[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={'bs-policy-opt' + (noShowPolicy === opt ? ' on' : '')}
                    onClick={() => setNoShowPolicy(opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className="bs-row col">
              <div className="bs-label">Reschedule forgiveness</div>
              <div className="bs-sub" style={{ marginBottom: '.5rem' }}>If client reschedules within this window &mdash; no charge</div>
              <div className="bs-policy-opts">
                {(['Same day', '24 hrs', '48 hrs', 'Same week', 'None'] as RescheduleWindow[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={'bs-policy-opt' + (rescheduleWindow === opt ? ' on' : '')}
                    onClick={() => setRescheduleWindow(opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className="bs-row col">
              <div className="bs-label">Free misses per year</div>
              <div className="bs-policy-opts">
                {(['0', '1', '2', 'Unlimited'] as FreeMisses[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={'bs-policy-opt' + (freeMisses === opt ? ' on' : '')}
                    onClick={() => setFreeMisses(opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className="bs-row col" style={{ borderBottom: 'none' }}>
              <div className="bs-label">Loyalty override</div>
              <div className="bs-sub" style={{ marginBottom: '.5rem' }}>Long-term clients above this visit count are always forgiven</div>
              <div className="bs-policy-opts">
                {(['Off', '10+ visits', '25+ visits', '50+ visits'] as LoyaltyOverride[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={'bs-policy-opt' + (loyaltyOverride === opt ? ' on' : '')}
                    onClick={() => setLoyaltyOverride(opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bs-card">
            <div className="bs-card-title">Account</div>

            <div className="bs-account-row">
              <div className="bs-ar-key">Email</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div className="bs-ar-val">{barber.email}</div>
                <button type="button" className="bs-ar-change" onClick={() => showToast('Edit email')}>Change</button>
              </div>
            </div>

            <div className="bs-account-row">
              <div className="bs-ar-key">Phone</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div className="bs-ar-val">{barber.phone}</div>
                <button type="button" className="bs-ar-change" onClick={() => showToast('Edit phone')}>Change</button>
              </div>
            </div>

            <div className="bs-account-row">
              <div className="bs-ar-key">Password</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div className="bs-ar-val">············</div>
                <button type="button" className="bs-ar-change" onClick={() => showToast('Change password')}>Change</button>
              </div>
            </div>

            <div className="bs-account-row">
              <div className="bs-ar-key">Barber License</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div className="bs-ar-val" style={{ fontFamily: "'DM Mono', monospace", fontSize: '.75rem' }}>{barber.license}</div>
                <span className="bs-pill-active">Verified</span>
              </div>
            </div>

            <div className="bs-account-row">
              <div className="bs-ar-key">Subscription</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div className="bs-ar-val">{config.serviceName} Pro</div>
                <span className="bs-pill-active">Active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bs-danger">
            <div className="bs-dz-title">Danger Zone</div>
            <div className="bs-dz-row">
              <div>
                <div className="bs-dz-label">Deactivate account</div>
                <div className="bs-dz-sub">Temporarily disable. Your code, clients, and history are saved.</div>
              </div>
              <button type="button" className="bs-dz-btn" onClick={() => showToast('Opens deactivate confirmation')}>Deactivate</button>
            </div>
            <div className="bs-dz-row">
              <div>
                <div className="bs-dz-label">Delete account</div>
                <div className="bs-dz-sub">Permanently delete your account and all data. Cannot be undone.</div>
              </div>
              <button type="button" className="bs-dz-btn" onClick={() => showToast('Opens delete confirmation')}>Delete</button>
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="bs-toast">{toast}</div>}
    </>
  );
}
