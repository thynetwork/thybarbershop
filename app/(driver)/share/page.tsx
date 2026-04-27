'use client';

import { useState } from 'react';
import { config, splitServiceName } from '@/lib/config';

export default function ShareBarberCode() {
  const { prefix, highlight } = splitServiceName();

  // TODO: Replace with real barber data from session
  const barberCity = 'South Houston';
  const barberState = 'TX';
  const barberInitials = 'MRC';
  const barberDigits = '3341';
  const inviteLink = `thybarbershop.com/join/${barberCity.replace(/\s/g, '-')}\u00B7${barberState}\u00B7${barberInitials}\u00B7${barberDigits}`;
  const inviteUrl = `https://${inviteLink}`;

  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [qrFullScreen, setQrFullScreen] = useState(false);

  const smsTemplate = `I'm on ThyBarberShop \u2014 your personal barber, on your schedule. Use my link to set up your account \u2014 takes 2 minutes:\n\n${inviteUrl}\n\nYour chair is ready whenever you are. Takes 2 minutes to set up.`;

  const emailSubject = 'Your regular barber is on ThyBarberShop';
  const emailBody = `I'm on ThyBarberShop \u2014 your personal barber, on your schedule. Use my link to set up your account \u2014 takes 2 minutes:\n\n${inviteUrl}\n\nNever wait for a chair or deal with walk-in prices again.`;

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleText() {
    window.open(`sms:?body=${encodeURIComponent(smsTemplate)}`, '_self');
  }

  function handleEmail() {
    window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_self');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: `${config.serviceName}`, text: smsTemplate, url: inviteUrl }).catch(() => {});
    } else {
      copyLink();
    }
  }

  function copyText(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  const qrPattern = [1,1,1,0,1,1,0,1,1,0,0,1,0,1,1,0,0,1,1,0,1,0,1,1,1,0,1,1,0,1,0,0,0,1,0,1,1,0,1,1,1,1,0,0,1,1,0,1,0,1,1,0,0,1,1,0,1,0,0,1,1,0,1,1];

  if (qrFullScreen) {
    return (
      <div onClick={() => setQrFullScreen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <div style={{ width: 280, height: 280, background: '#fff', borderRadius: 'var(--r-xl)', border: '2px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 4, padding: 20 }}>
          {qrPattern.map((f, i) => (<div key={i} className={f ? 'qr-c' : 'qr-e'} />))}
        </div>
        <div style={{ marginTop: 20, fontSize: 13, color: 'var(--text-2)' }}>Tap anywhere to close</div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-3)' }}>{inviteLink}</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* 4-part barber code in topbar */}
          <div className="driver-code" style={{ display: 'flex', minWidth: 160 }}>
            <div className="dc-airport" style={{ flex: 4, fontSize: 11, padding: '3px 7px', whiteSpace: 'nowrap' }}>{barberCity}</div>
            <div style={{ flex: 1, fontSize: 11, padding: '3px 5px', background: '#0a0a2e', color: '#fff', textAlign: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>{barberState}</div>
            <div className="dc-initials" style={{ flex: 1, fontSize: 11, padding: '3px 5px' }}>{barberInitials}</div>
            <div className="dc-digits" style={{ flex: 1, fontSize: 11, padding: '3px 7px' }}>{barberDigits}</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: 'var(--navy)' }}>JR</div>
        </div>
      </div>

      <div className="layout-2col">
        <div className="main-content">
          <div className="t-title mb-4">Share your code</div>
          <div className="t-small mb-16">Give new clients your invite link &mdash; their info pre-fills automatically</div>

          {/* QR Code — dominant, expanded */}
          <div className="card-navy mb-16" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              Scan to connect &middot; {inviteLink}
            </div>
            <div className="qr-display" onClick={() => setQrFullScreen(true)} style={{ cursor: 'pointer' }}>
              {qrPattern.map((f, i) => (<div key={i} className={f ? 'qr-c' : 'qr-e'} />))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 10 }}>Tap to go full screen &middot; Client scans to connect</div>

            <div className="share-btn-row">
              <button type="button" className="share-btn" onClick={copyLink}>{copied ? '\u2713 Copied!' : '\uD83D\uDCCB Copy'}</button>
              <button type="button" className="share-btn" onClick={handleText}>&#128172; Text</button>
              <button type="button" className="share-btn" onClick={handleEmail}>&#9993; Email</button>
              <button type="button" className="share-btn" onClick={handleShare}>&uarr; Share</button>
            </div>
          </div>

          {/* Invite link */}
          <div className="form-group">
            <label className="form-label">Your invite link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="form-input" style={{ flex: 1, color: 'var(--navy)', fontWeight: 500, display: 'flex', alignItems: 'center' }}>{inviteLink}</div>
              <button type="button" className="btn btn-primary btn-sm" onClick={copyLink}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>

          {/* Barber code display — 4-part verbal */}
          <div className="t-label mb-8">Or share your code verbally</div>
          <div className="card-surface" style={{ textAlign: 'center', padding: 20 }}>
            <div className="driver-code" style={{ display: 'inline-flex', marginBottom: 10, width: '100%' }}>
              <div className="dc-airport" style={{ flex: 4, fontSize: 18, padding: '8px 14px', whiteSpace: 'nowrap' }}>{barberCity}</div>
              <div style={{ flex: 1, fontSize: 18, padding: '8px 12px', background: '#0a0a2e', color: '#fff', textAlign: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, borderLeft: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)' }}>{barberState}</div>
              <div className="dc-initials" style={{ flex: 1, fontSize: 18, padding: '8px 12px' }}>{barberInitials}</div>
              <div className="dc-digits" style={{ flex: 1, fontSize: 18, padding: '8px 14px' }}>{barberDigits}</div>
            </div>
            <div className="t-small">Client enters this at {config.domain} &middot; &ldquo;First time here? Create your client account&rdquo;</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-12">Pre-written messages</div>

          <div style={{ marginBottom: 16 }}>
            <div className="t-label mb-6">Text message</div>
            <div style={{ background: '#E8F5E9', borderRadius: '18px 18px 4px 18px', padding: '14px 16px', fontSize: 13, color: '#1a1a1a', lineHeight: 1.6 }}>
              I&apos;m on {config.serviceName} &mdash; your personal {config.providerLabel.toLowerCase()}, on your schedule. Use my link to set up your account &mdash; takes 2 minutes:
              <br /><br />
              <strong>{inviteUrl}</strong>
              <br /><br />
              Your chair is ready whenever you are. Takes 2 minutes to set up.
            </div>
            <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => copyText(smsTemplate, setCopiedText)}>
              {copiedText ? '\u2713 Copied!' : 'Copy text message'}
            </button>
          </div>

          <div>
            <div className="t-label mb-6">Email</div>
            <div className="card-surface">
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Subject: Your regular {config.providerLabel.toLowerCase()} is on {config.serviceName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.6 }}>
                I&apos;m on {config.serviceName} &mdash; your personal {config.providerLabel.toLowerCase()}, on your schedule. Use my link to set up your account &mdash; takes 2 minutes:
                <br /><br />
                <strong>{inviteUrl}</strong>
                <br /><br />
                Never wait for a chair or deal with walk-in prices again.
              </div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => copyText(`Subject: ${emailSubject}\n\n${emailBody}`, setCopiedEmail)}>
              {copiedEmail ? '\u2713 Copied!' : 'Copy email'}
            </button>
          </div>

          <hr className="divider" />

          <div className="t-label mb-8">How it works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="card-surface"><div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>1. Client clicks your link</div><div className="t-small">Your {config.providerLabel.toLowerCase()} card pre-fills automatically</div></div>
            <div className="card-surface"><div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>2. They fill in their info</div><div className="t-small">Name, email, phone, password &mdash; 2 minutes</div></div>
            <div className="card-surface"><div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>3. You get a request</div><div className="t-small">All 4 notifications fire &mdash; approve or deny</div></div>
            <div className="card-surface"><div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>4. They can book</div><div className="t-small">Connection live &mdash; ready to visit</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
