'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

// Demo barber identity — wire to /api/barber/dashboard once ready.
const BARBER = {
  city: 'South Houston',
  state: 'TX',
  initials: 'JMR',
  digits: '7749',
  licenseNumber: 'TX-BBR-0042871',
  expiresLabel: 'July 30, 2026',
  daysLeft: 14,
};

export default function LicenseRenewPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [file, setFile] = useState<File | null>(null);
  const [expiry, setExpiry] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function submitLicense() {
    if (!file) {
      showToast('Please upload your renewed license first');
      return;
    }
    setSubmitting(true);
    // TODO: POST FormData to /api/barber/license-renew once endpoint exists.
    // ThyAdmin reads barber-documents/{barberCode}/barber-license.{ext} after
    // upsert and re-verifies via the existing 5-step approval workflow.
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      showToast(`License submitted · ${config.serviceName} will review within 24 hours`);
    }, 600);
  }

  return (
    <>
      <style>{`
        .lx-shell{min-height:100vh;background:#F7F7F8;color:#111118;font-family:'DM Sans',sans-serif;}
        .lx-topbar{background:#0a0a2e;height:3.5rem;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;}
        .lx-topbar-left{display:flex;align-items:center;gap:.85rem;}
        .lx-topbar-logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;}
        .lx-topbar-logo span{color:#F5A623;}
        .lx-topbar-code{display:inline-flex;border-radius:.3rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;}
        .lx-tc-city{background:#F5A623;color:#0a0a2e;padding:.2rem .5rem;}
        .lx-tc-state{background:#12124a;color:#fff;padding:.2rem .4rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .lx-tc-init{background:#12124a;color:#F5A623;padding:.2rem .4rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .lx-tc-digits{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);padding:.2rem .5rem;}
        .lx-topbar-back{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.5);cursor:pointer;background:none;border:none;font-family:inherit;}
        .lx-topbar-back:hover{color:#fff;}

        .lx-main{max-width:28rem;margin:0 auto;padding:2.5rem 1.5rem 4rem;text-align:center;animation:lx-fade .25s ease both;}
        @keyframes lx-fade{from{opacity:0;transform:translateY(.375rem);}to{opacity:1;transform:translateY(0);}}

        .lx-badge-icon{width:10rem;height:10rem;border-radius:50%;background:rgba(245,166,35,.08);border:2px solid rgba(245,166,35,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 1.75rem;}

        .lx-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#111118;margin-bottom:.4rem;line-height:1.2;}
        .lx-sub{font-size:.88rem;color:#5A5A6A;line-height:1.7;margin-bottom:1.75rem;}

        .lx-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;margin-bottom:1.25rem;text-align:left;box-shadow:0 .25rem 1rem rgba(0,0,0,.07);}
        .lx-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.75rem;display:flex;align-items:center;gap:.4rem;}
        .lx-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .lx-row{display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .lx-row:last-child{border-bottom:none;}
        .lx-key{font-size:.72rem;font-weight:600;color:#9A9AAA;}
        .lx-val{font-size:.82rem;font-weight:600;color:#111118;}
        .lx-val.expiring{color:#D4830A;}

        .lx-status-badge{background:#EAF3DE;color:#3B6D11;border:1px solid #97C459;border-radius:9999px;padding:.1rem .5rem;font-size:.6rem;font-weight:700;}

        .lx-upload{border:2px dashed rgba(245,166,35,.25);border-radius:1rem;padding:1.75rem;text-align:center;cursor:pointer;background:rgba(245,166,35,.08);margin-bottom:1rem;position:relative;display:block;}
        .lx-upload:hover{border-color:#F5A623;background:rgba(245,166,35,.12);}
        .lx-upload.uploaded{border-color:#3B6D11;background:#EAF3DE;border-style:solid;}
        .lx-upload input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
        .lx-uz-icon{font-size:2.5rem;margin-bottom:.5rem;}
        .lx-uz-label{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .lx-upload.uploaded .lx-uz-label{color:#3B6D11;}
        .lx-uz-sub{font-size:.72rem;color:#9A9AAA;}

        .lx-field{margin-bottom:1rem;}
        .lx-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.4rem;display:block;}
        .lx-label span{font-weight:400;text-transform:none;letter-spacing:0;}
        .lx-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.75rem 1rem;font-family:'DM Sans',sans-serif;font-size:.9rem;color:#111118;outline:none;background:#fff;}
        .lx-input:focus{border-color:#F5A623;}

        .lx-pending{background:#EAF3DE;border:1.5px solid #97C459;border-radius:1.25rem;padding:1.25rem;margin-bottom:1.25rem;text-align:left;}
        .lx-pc-icon-row{display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem;}
        .lx-pc-title{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#3B6D11;}
        .lx-pc-sub{font-size:.75rem;color:#5A5A6A;line-height:1.7;}

        .lx-btn-primary{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.95rem;font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#F5A623;cursor:pointer;margin-bottom:.75rem;}
        .lx-btn-primary:hover{background:#14145c;}
        .lx-btn-primary:disabled{opacity:.5;cursor:not-allowed;}
        .lx-btn-secondary{width:100%;background:none;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.85rem;font-size:.88rem;font-weight:600;color:#5A5A6A;cursor:pointer;font-family:inherit;}
        .lx-btn-secondary:hover{border-color:#F5A623;color:#D4830A;}

        .lx-note{background:#F7F7F8;border-radius:1rem;padding:.85rem 1rem;font-size:.72rem;color:#5A5A6A;line-height:1.7;text-align:left;margin-top:1rem;}
        .lx-note strong{color:#111118;}

        .lx-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.7rem 1.4rem;border-radius:2rem;font-size:.82rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="lx-shell">
        <nav className="lx-topbar">
          <div className="lx-topbar-left">
            <div className="lx-topbar-logo">{prefix}<span>{highlight}</span></div>
            <div className="lx-topbar-code">
              <div className="lx-tc-city">{BARBER.city}</div>
              <div className="lx-tc-state">{BARBER.state}</div>
              <div className="lx-tc-init">{BARBER.initials}</div>
              <div className="lx-tc-digits">{BARBER.digits}</div>
            </div>
          </div>
          <button type="button" className="lx-topbar-back" onClick={() => router.push('/dashboard')}>← Dashboard</button>
        </nav>

        <div className="lx-main">
          <div className="lx-badge-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="1.5">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>

          <div className="lx-title">Keep your<br/>Verified badge</div>
          <div className="lx-sub">Your barber license is expiring soon. Upload your renewed license so {config.serviceName} can re-verify and keep the Verified badge on your public profile.</div>

          <div className="lx-card">
            <div className="lx-card-title">Current License</div>
            <div className="lx-row">
              <div className="lx-key">License Number</div>
              <div className="lx-val" style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{BARBER.licenseNumber}</div>
            </div>
            <div className="lx-row">
              <div className="lx-key">Expires</div>
              <div className="lx-val expiring">{BARBER.expiresLabel} · {BARBER.daysLeft} days</div>
            </div>
            <div className="lx-row">
              <div className="lx-key">Status</div>
              <div className="lx-val" style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <span className="lx-status-badge">Verified</span>
                <span style={{ fontSize: '.72rem', color: '#9A9AAA' }}>· expires with license</span>
              </div>
            </div>
          </div>

          <div className="lx-card">
            <div className="lx-card-title">Upload Renewed License</div>

            <label className={'lx-upload' + (file ? ' uploaded' : '')}>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="lx-uz-icon">{file ? '✓' : '📄'}</div>
              <div className="lx-uz-label">{file ? `${file.name} uploaded` : 'Tap to upload renewed license'}</div>
              <div className="lx-uz-sub">{file ? 'Tap to replace' : 'PDF · JPG · PNG · max 10MB'}</div>
            </label>

            <div className="lx-field">
              <label className="lx-label">New Expiry Date</label>
              <input
                className="lx-input"
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>

            <div className="lx-field">
              <label className="lx-label">License Number <span>· if your number changed</span></label>
              <input
                className="lx-input"
                placeholder={BARBER.licenseNumber}
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                style={{ fontFamily: "'DM Mono',monospace", letterSpacing: '.05em' }}
              />
            </div>
          </div>

          {submitted && (
            <div className="lx-pending">
              <div className="lx-pc-icon-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <div className="lx-pc-title">Submitted — under review</div>
              </div>
              <div className="lx-pc-sub">{config.serviceName} will review your renewed license within 24 hours. Your Verified badge stays active until the review is complete. You&rsquo;ll get a notification once it&rsquo;s approved.</div>
            </div>
          )}

          {!submitted && (
            <button type="button" className="lx-btn-primary" onClick={submitLicense} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit for Review →'}
            </button>
          )}
          <button type="button" className="lx-btn-secondary" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>

          <div className="lx-note">
            <strong>Your Verified badge</strong> tells clients your license has been reviewed by {config.serviceName}. It shows on your public profile and in the barber pool. You keep full dashboard access whether or not your badge is active.
          </div>
        </div>

        {toast && <div className="lx-toast">{toast}</div>}
      </div>
    </>
  );
}
