'use client';

import { useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';
import { ACCOUNT_PLAN, HOUSEHOLD_RENEWAL } from '@/lib/account';

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
  email: 'rayford.gibson@email.com',
  phone: '(713) 555-0199',
};

type ReminderTime = '1hr' | '2hrs' | 'Day before' | 'None';

export default function ClientSettingsPage() {
  const { prefix, highlight } = splitServiceName();

  const [pushOn, setPushOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [emailOn, setEmailOn] = useState(false);
  const [reminderTime, setReminderTime] = useState<ReminderTime>('2hrs');
  const [bannerKey, setBannerKey] = useState('navy');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function copyClientId() {
    navigator.clipboard.writeText(client.clientId).then(
      () => showToast('Copied: ' + client.clientId),
    ).catch(() => showToast(client.clientId));
  }

  function deactivate() {
    if (confirm('Deactivate your account? Your Client ID and barber connections will be saved.')) {
      showToast('Account deactivated');
    }
  }

  function deleteAccount() {
    if (confirm('Permanently delete your account? This cannot be undone.')) {
      showToast('Account deleted');
    }
  }

  return (
    <>
      <style>{`
        .rs-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .rs-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .rs-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .rs-logo span{color:#F5A623;}
        .rs-tb-right{display:flex;align-items:center;gap:.75rem;}
        .rs-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .rs-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .rs-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .rs-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .rs-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .rs-side-section:first-child{margin-top:0;}
        .rs-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .rs-nav:hover{background:rgba(255,255,255,.05);}
        .rs-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .rs-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .rs-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .rs-nav.on .rs-nav-label,.rs-nav:hover .rs-nav-label{color:#fff;}
        .rs-nav.on .rs-nav-label{font-weight:600;}
        .rs-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .rs-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}

        .rs-page-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .rs-page-sub{font-size:.78rem;color:#5A5A6A;margin-bottom:1.5rem;}

        .rs-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .rs-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .rs-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .rs-row{display:flex;justify-content:space-between;align-items:center;padding:.85rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .rs-row:last-child{border-bottom:none;}
        .rs-left{flex:1;}
        .rs-label{font-size:.85rem;font-weight:600;color:#111118;margin-bottom:.15rem;}
        .rs-sub{font-size:.68rem;color:#9A9AAA;line-height:1.4;}
        .rs-right{flex-shrink:0;margin-left:1rem;}

        .rs-toggle{width:2.75rem;height:1.5rem;border-radius:9999px;background:rgba(0,0,0,.09);position:relative;cursor:pointer;border:none;flex-shrink:0;transition:background .2s;}
        .rs-toggle.on{background:#0a0a2e;}
        .rs-knob{width:1.1rem;height:1.1rem;border-radius:50%;background:#fff;position:absolute;top:50%;transform:translateY(-50%);left:.2rem;transition:left .2s;box-shadow:0 .1rem .3rem rgba(0,0,0,.2);}
        .rs-toggle.on .rs-knob{left:1.45rem;}

        .rs-timing{display:flex;gap:.35rem;}
        .rs-timing-btn{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.25rem .6rem;font-size:.68rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .rs-timing-btn.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .rs-timing-btn:hover:not(.on){border-color:rgba(245,166,35,.25);}

        .rs-account-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .rs-account-row:last-child{border-bottom:none;}
        .rs-ar-key{font-size:.72rem;color:#9A9AAA;font-weight:600;}
        .rs-ar-val{font-size:.82rem;font-weight:600;color:#111118;}
        .rs-ar-change{font-size:.68rem;font-weight:600;color:#D4830A;cursor:pointer;background:none;border:none;font-family:inherit;}

        .rs-cid-display{background:rgba(10,10,46,.04);border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.75rem 1rem;display:flex;align-items:center;justify-content:space-between;}
        .rs-cid-val{font-family:'DM Mono',monospace;font-size:1rem;font-weight:500;color:#0a0a2e;letter-spacing:.05em;}
        .rs-cid-label{font-size:.6rem;color:#9A9AAA;margin-top:.15rem;}
        .rs-cid-copy{font-size:.68rem;font-weight:600;color:#D4830A;cursor:pointer;background:none;border:none;font-family:inherit;}

        .rs-banner-swatches{display:flex;gap:.3rem;}
        .rs-banner-swatch{width:1.4rem;height:1.4rem;border-radius:.25rem;cursor:pointer;border:.15rem solid transparent;}
        .rs-banner-swatch.on{border-color:#0a0a2e;}

        .rs-link{font-size:.72rem;font-weight:600;color:#3B6D11;cursor:pointer;background:none;border:none;font-family:inherit;}
        .rs-link.amber{color:#D4830A;}

        .rs-pref-edit{font-size:.68rem;font-weight:600;color:#D4830A;cursor:pointer;background:none;border:none;margin-left:.6rem;font-family:inherit;}
        .rs-pref-val{font-size:.82rem;font-weight:600;color:#111118;}

        .rs-active-pill{background:#EAF3DE;color:#3B6D11;border:1px solid #97C459;border-radius:9999px;padding:.2rem .65rem;font-size:.62rem;font-weight:700;}
        .rs-upgrade-btn{border:1.5px solid rgba(245,166,35,.25);border-radius:1rem;padding:.35rem .85rem;font-size:.72rem;font-weight:700;color:#D4830A;cursor:pointer;background:rgba(245,166,35,.08);white-space:nowrap;font-family:inherit;}

        .rs-danger{border:1.5px solid rgba(180,40,40,.2);border-radius:1.25rem;padding:1.25rem;background:rgba(180,40,40,.03);margin-bottom:1.25rem;}
        .rs-dz-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#b42828;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .rs-dz-title::after{content:'';flex:1;height:1px;background:rgba(180,40,40,.15);}
        .rs-dz-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(180,40,40,.1);gap:1rem;}
        .rs-dz-row:last-child{border-bottom:none;}
        .rs-dz-label{font-size:.82rem;font-weight:600;color:#111118;}
        .rs-dz-sub{font-size:.65rem;color:#9A9AAA;margin-top:.1rem;line-height:1.4;}
        .rs-dz-btn{border:1.5px solid rgba(180,40,40,.3);border-radius:1rem;padding:.4rem .85rem;font-size:.72rem;font-weight:700;color:#b42828;cursor:pointer;background:none;white-space:nowrap;font-family:inherit;}
        .rs-dz-btn:hover{background:rgba(180,40,40,.07);}

        .rs-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="rs-shell">
        <nav className="rs-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="rs-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="rs-tb-right">
            <div className="rs-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="rs-bell-badge"></div>
            </div>
            <div className="rs-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="rs-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>
          <div className="rs-side-section">Booking</div>
          <Link href="/home" className="rs-nav">
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="rs-nav-label">Home</span>
          </Link>
          <button type="button" className="rs-nav" onClick={() => showToast('Goes to booking flow')}>
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <span className="rs-nav-label">Book</span>
          </button>
          <button type="button" className="rs-nav" onClick={() => showToast('Opens notifications')}>
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="rs-nav-label">Notifications</span>
          </button>

          <div className="rs-side-section">Account</div>
          <Link href="/profile" className="rs-nav">
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="rs-nav-label">My Profile</span>
          </Link>
          {ACCOUNT_PLAN === 'household' && (
            <Link href="/household" className="rs-nav">
              <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
              <span className="rs-nav-label">Household</span>
            </Link>
          )}
          <Link href="/history" className="rs-nav">
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="rs-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="rs-nav on">
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="rs-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="rs-nav">
            <span className="rs-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="rs-nav-label">Support</span>
          </Link>

          <div className="rs-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="rs-main">
          <div className="rs-page-title">Settings</div>
          <div className="rs-page-sub">{client.name} &middot; {client.clientId}</div>

          {/* Notifications */}
          <div className="rs-card">
            <div className="rs-card-title">Notifications</div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Push notifications</div>
                <div className="rs-sub">Booking confirmations &middot; reminders &middot; updates</div>
              </div>
              <div className="rs-right">
                <button type="button" className={'rs-toggle' + (pushOn ? ' on' : '')} onClick={() => setPushOn(p => !p)}>
                  <div className="rs-knob"></div>
                </button>
              </div>
            </div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">SMS alerts</div>
                <div className="rs-sub">Text messages &middot; barber confirmations &middot; reminders</div>
              </div>
              <div className="rs-right">
                <button type="button" className={'rs-toggle' + (smsOn ? ' on' : '')} onClick={() => setSmsOn(p => !p)}>
                  <div className="rs-knob"></div>
                </button>
              </div>
            </div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Email notifications</div>
                <div className="rs-sub">Full booking details sent to your email</div>
              </div>
              <div className="rs-right">
                <button type="button" className={'rs-toggle' + (emailOn ? ' on' : '')} onClick={() => setEmailOn(p => !p)}>
                  <div className="rs-knob"></div>
                </button>
              </div>
            </div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Appointment reminders</div>
                <div className="rs-sub">How early before your appointment</div>
              </div>
              <div className="rs-right">
                <div className="rs-timing">
                  {(['1hr', '2hrs', 'Day before', 'None'] as ReminderTime[]).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={'rs-timing-btn' + (reminderTime === opt ? ' on' : '')}
                      onClick={() => setReminderTime(opt)}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="rs-card">
            <div className="rs-card-title">Privacy</div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Safety Protocol</div>
                <div className="rs-sub">Encrypted &middot; emergency use only &middot; completed</div>
              </div>
              <div className="rs-right">
                <button type="button" className="rs-link" onClick={() => showToast('Opens Safety Protocol update')}>View / Update</button>
              </div>
            </div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Profile photo</div>
                <div className="rs-sub">Shown to your barber on booking confirmation</div>
              </div>
              <div className="rs-right">
                <button type="button" className="rs-link amber" onClick={() => showToast('Opens photo update')}>Update photo</button>
              </div>
            </div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Profile banner</div>
                <div className="rs-sub">Background on your profile page &middot; choose a color or upload your own photo</div>
              </div>
              <div className="rs-right" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="rs-banner-swatches">
                  {BANNER_GRADIENTS.map(g => (
                    <div
                      key={g.key}
                      className={'rs-banner-swatch' + (bannerKey === g.key ? ' on' : '')}
                      style={{ background: g.gradient }}
                      title={g.title}
                      onClick={() => { setBannerKey(g.key); showToast('Banner color updated — saved to your profile'); }}
                    />
                  ))}
                </div>
                <button type="button" className="rs-link amber" onClick={() => showToast('Opens file picker for banner photo')}>Upload</button>
              </div>
            </div>

            <div className="rs-row">
              <div className="rs-left">
                <div className="rs-label">Preferred name</div>
                <div className="rs-sub">What your barber calls you</div>
              </div>
              <div className="rs-right">
                <span className="rs-pref-val">{client.preferredName}</span>
                <button type="button" className="rs-pref-edit" onClick={() => showToast('Edit preferred name')}>Edit</button>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="rs-card">
            <div className="rs-card-title">Account</div>

            <div className="rs-account-row">
              <div className="rs-ar-key">Email</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="rs-ar-val">{client.email}</div>
                <button type="button" className="rs-ar-change" onClick={() => showToast('Edit email — opens inline edit field')}>Change</button>
              </div>
            </div>

            <div className="rs-account-row">
              <div className="rs-ar-key">Phone</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="rs-ar-val">{client.phone}</div>
                <button type="button" className="rs-ar-change" onClick={() => showToast('Edit phone — opens inline edit field')}>Change</button>
              </div>
            </div>

            <div className="rs-account-row">
              <div className="rs-ar-key">Password</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="rs-ar-val">············</div>
                <button type="button" className="rs-ar-change" onClick={() => showToast('Edit password — opens inline edit field')}>Change</button>
              </div>
            </div>

            <div className="rs-account-row">
              <div className="rs-ar-key">Client ID</div>
              <div>
                <div className="rs-cid-display">
                  <div>
                    <div className="rs-cid-val">{client.clientId}</div>
                    <div className="rs-cid-label">Permanent &middot; never changes</div>
                  </div>
                  <button type="button" className="rs-cid-copy" onClick={copyClientId}>Copy</button>
                </div>
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className="rs-card">
            <div className="rs-card-title">Membership</div>
            {ACCOUNT_PLAN === 'household' ? (
              <div className="rs-row">
                <div className="rs-left">
                  <div className="rs-label">Household Pass &middot; $19.99/year</div>
                  <div className="rs-sub">All {config.companyName.replace(' Inc.', '')} platforms &middot; up to 5 members &middot; renews {HOUSEHOLD_RENEWAL}</div>
                </div>
                <div className="rs-right" style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <span className="rs-active-pill">Active</span>
                  <Link href="/household" className="rs-link amber">Manage Household &rarr;</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="rs-row">
                  <div className="rs-left">
                    <div className="rs-label">Single Platform</div>
                    <div className="rs-sub">{config.serviceName} &middot; one-time access fee paid</div>
                  </div>
                  <div className="rs-right">
                    <span className="rs-active-pill">Active</span>
                  </div>
                </div>
                <div className="rs-row">
                  <div className="rs-left">
                    <div className="rs-label">Household Pass</div>
                    <div className="rs-sub">Upgrade to access all {config.companyName.replace(' Inc.', '')} platforms &middot; up to 5 members &middot; $19.99/year</div>
                  </div>
                  <div className="rs-right">
                    <button type="button" className="rs-upgrade-btn" onClick={() => showToast('Opens Household Pass upgrade flow')}>Upgrade</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Danger Zone */}
          <div className="rs-danger">
            <div className="rs-dz-title">Danger Zone</div>
            <div className="rs-dz-row">
              <div>
                <div className="rs-dz-label">Deactivate account</div>
                <div className="rs-dz-sub">Temporarily disable your account. Your Client ID and barber connections are saved.</div>
              </div>
              <button type="button" className="rs-dz-btn" onClick={deactivate}>Deactivate</button>
            </div>
            <div className="rs-dz-row">
              <div>
                <div className="rs-dz-label">Delete account</div>
                <div className="rs-dz-sub">Permanently delete your account and all data. This cannot be undone.</div>
              </div>
              <button type="button" className="rs-dz-btn" onClick={deleteAccount}>Delete</button>
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="rs-toast">{toast}</div>}
    </>
  );
}
