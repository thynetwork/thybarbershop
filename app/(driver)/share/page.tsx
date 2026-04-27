'use client';

import { useState } from 'react';
import { config, splitServiceName } from '@/lib/config';

export default function ShareDriverCode() {
  const { prefix, highlight } = splitServiceName();

  // TODO: Replace with real driver data from session
  const driverAirport = 'IAH';
  const driverInitials = 'JDR';
  const driverDigits = '4207';
  const inviteLink = `thydriver.com/join/${driverAirport}\u00B7${driverInitials}\u00B7${driverDigits}`;
  const inviteUrl = `https://${inviteLink}`;

  const [preSetAmount, setPreSetAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [qrFullScreen, setQrFullScreen] = useState(false);

  // Pre-written templates (locked — do not change)
  const smsTemplate = `I'm on ThyDriver — a personal driver for business professionals and frequent travelers. Use my link to set up your account — takes 2 minutes:\n\n${inviteUrl}\n\nNever wait on a driver or deal with high prices again.`;

  const emailSubject = 'Your personal driver is on ThyDriver';
  const emailBody = `I'm on ThyDriver — a personal driver for business professionals and frequent travelers. Use my link to set up your account — takes 2 minutes:\n\n${inviteUrl}\n\nNever wait on a driver or deal with high prices again.`;

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleText() {
    const body = encodeURIComponent(smsTemplate);
    window.open(`sms:?body=${body}`, '_self');
  }

  function handleEmail() {
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${config.serviceName} — Your personal driver`,
        text: smsTemplate,
        url: inviteUrl,
      }).catch(() => {});
    } else {
      copyLink();
    }
  }

  function copyText(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  /* QR placeholder pattern */
  const qrPattern = [
    1,1,1,0,1,1,0,1,
    1,0,0,1,0,1,1,0,
    0,1,1,0,1,0,1,1,
    1,0,1,1,0,1,0,0,
    0,1,0,1,1,0,1,1,
    1,1,0,0,1,1,0,1,
    0,1,1,0,0,1,1,0,
    1,0,0,1,1,0,1,1,
  ];

  // QR full screen overlay
  if (qrFullScreen) {
    return (
      <div
        onClick={() => setQrFullScreen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'var(--white)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: 280, height: 280, background: 'var(--white)',
          borderRadius: 'var(--r-xl)', border: '2px solid var(--border)',
          display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 4, padding: 20,
        }}>
          {qrPattern.map((filled, i) => (
            <div key={i} className={filled ? 'qr-c' : 'qr-e'} />
          ))}
        </div>
        <div style={{ marginTop: 20, fontSize: 13, color: 'var(--text-2)' }}>
          Tap anywhere to close
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-3)' }}>
          {inviteLink}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="driver-code">
            <div className="dc-airport">{driverAirport}</div>
            <div className="dc-initials">{driverInitials}</div>
            <div className="dc-digits">{driverDigits}</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: 'var(--navy)',
          }}>JR</div>
        </div>
      </div>

      <div className="layout-2col">
        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content">
          <div className="t-title mb-4">Share your code</div>
          <div className="t-small mb-16">Give new clients your invite link &mdash; their info pre-fills automatically</div>

          {/* Pre-set amount */}
          <div className="card-amber mb-16">
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
              color: 'var(--amber-dim)', marginBottom: 4,
            }}>
              Pre-set amount for this client{' '}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-2)' }}>(optional)</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.5 }}>
              Set this if you agreed on a rate in person. Your client will see it on their registration form and can accept or discuss.
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                style={{
                  flex: 1, background: 'var(--white)', border: '1.5px solid var(--amber-border)',
                  borderRadius: 'var(--r-md)', padding: '11px 14px',
                  fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800,
                  color: 'var(--navy)', textAlign: 'center',
                }}
                placeholder="$0.00"
                value={preSetAmount}
                onChange={(e) => setPreSetAmount(e.target.value)}
              />
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4, flex: 1 }}>
                Leave blank if no amount agreed yet
              </div>
            </div>
          </div>

          {/* QR Code — dominant element */}
          <div className="card-navy mb-16" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,.4)',
              letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              Scan to connect &middot; {inviteLink}
            </div>

            <div
              className="qr-display"
              onClick={() => setQrFullScreen(true)}
              style={{ cursor: 'pointer' }}
            >
              {qrPattern.map((filled, i) => (
                <div key={i} className={filled ? 'qr-c' : 'qr-e'} />
              ))}
            </div>

            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 10 }}>
              Tap to go full screen &middot; Client scans from back seat
            </div>

            {/* Share buttons */}
            <div className="share-btn-row">
              <button type="button" className="share-btn" onClick={copyLink}>
                {copied ? '\u2713 Copied!' : '\uD83D\uDCCB Copy'}
              </button>
              <button type="button" className="share-btn" onClick={handleText}>
                &#128172; Text
              </button>
              <button type="button" className="share-btn" onClick={handleEmail}>
                &#9993; Email
              </button>
              <button type="button" className="share-btn" onClick={handleShare}>
                &uarr; Share
              </button>
            </div>
          </div>

          {/* Invite link */}
          <div className="form-group">
            <label className="form-label">Your invite link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="form-input" style={{
                flex: 1, color: 'var(--navy)', fontWeight: 500,
                display: 'flex', alignItems: 'center',
              }}>
                {inviteLink}
              </div>
              <button type="button" className="btn btn-primary btn-sm" onClick={copyLink}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Driver code display */}
          <div className="t-label mb-8">Or share your code verbally</div>
          <div className="card-surface" style={{ textAlign: 'center', padding: 20 }}>
            <div className="driver-code" style={{ display: 'inline-flex', marginBottom: 10 }}>
              <div className="dc-airport" style={{ fontSize: 18, padding: '8px 14px' }}>{driverAirport}</div>
              <div className="dc-initials" style={{ fontSize: 18, padding: '8px 12px' }}>{driverInitials}</div>
              <div className="dc-digits" style={{ fontSize: 18, padding: '8px 14px' }}>{driverDigits}</div>
            </div>
            <div className="t-small">
              Client enters this at {config.domain} &middot; &ldquo;First time here? Create your rider account&rdquo;
            </div>
          </div>
        </div>

        {/* ── Right panel ───────────────────────────────────── */}
        <div className="right-panel">
          <div className="t-label mb-12">Pre-written messages</div>

          {/* SMS preview */}
          <div style={{ marginBottom: 16 }}>
            <div className="t-label mb-6">Text message</div>
            <div style={{
              background: '#E8F5E9', borderRadius: '18px 18px 4px 18px',
              padding: '14px 16px', fontSize: 13, color: '#1a1a1a', lineHeight: 1.6,
            }}>
              I&apos;m on ThyDriver &mdash; a personal driver for business professionals and frequent travelers. Use my link to set up your account &mdash; takes 2 minutes:
              <br /><br />
              <strong>{inviteUrl}</strong>
              <br /><br />
              Never wait on a driver or deal with high prices again.
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 8 }}
              onClick={() => copyText(smsTemplate, setCopiedText)}
            >
              {copiedText ? '\u2713 Copied!' : 'Copy text message'}
            </button>
          </div>

          {/* Email preview */}
          <div>
            <div className="t-label mb-6">Email</div>
            <div className="card-surface">
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>
                Subject: Your personal driver is on ThyDriver
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.6 }}>
                I&apos;m on ThyDriver &mdash; a personal driver for business professionals and frequent travelers. Use my link to set up your account &mdash; takes 2 minutes:
                <br /><br />
                <strong>{inviteUrl}</strong>
                <br /><br />
                Never wait on a driver or deal with high prices again.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 8 }}
              onClick={() => copyText(`Subject: ${emailSubject}\n\n${emailBody}`, setCopiedEmail)}
            >
              {copiedEmail ? '\u2713 Copied!' : 'Copy email'}
            </button>
          </div>

          <hr className="divider" />

          <div className="t-label mb-8">How it works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>1. Client clicks your link</div>
              <div className="t-small">Your driver card pre-fills automatically</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>2. They fill in their info</div>
              <div className="t-small">Name, email, phone, password &mdash; 2 minutes</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>3. You get a request</div>
              <div className="t-small">All 4 notifications fire &mdash; approve or deny</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>4. They can book</div>
              <div className="t-small">Connection live &mdash; ready to ride</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
