'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type Step = 1 | 2 | 3 | 4;
type ContactPref = 'Text only' | 'Call' | 'Either';

const STEP_LABELS: Record<Step, string> = {
  1: 'Account',
  2: 'Safety',
  3: 'Profile',
  4: 'Connect',
};

const trigger = {
  initials: 'JM',
  name: 'John Merrick',
  shop: 'The Studio',
  city: 'South Houston',
  state: 'TX',
  codeInitials: 'JMR',
  codeDigits: '7749',
  address: '4521 Main St · South Houston, TX 77587',
  rating: '4.97',
  visits: '312 visits',
  yrsLicensed: '12 yrs licensed',
};

function ClientRegContent() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [completed, setCompleted] = useState<Set<Step>>(new Set());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [pledge1, setPledge1] = useState(false);
  const [pledge2, setPledge2] = useState(false);

  const [preferredName, setPreferredName] = useState('');
  const [contactPref, setContactPref] = useState<ContactPref>('Text only');

  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  // Derive a Client ID from first name + last initial. Real code is server-assigned.
  const clientId = useMemo(() => {
    const base = (firstName || 'RAYF').slice(0, 4).toUpperCase().padEnd(4, 'X');
    const random = searchParams.get('cid') || '8834';
    return `${base}·${random}`;
  }, [firstName, searchParams]);

  const fullName = `${firstName || 'Rayford'} ${lastName || 'Gibson'}`.trim();
  const photoInitials = ((firstName || 'R')[0] + (lastName || 'G')[0]).toUpperCase();

  function goStep(next: Step) {
    if (next > step) {
      setCompleted(prev => new Set(prev).add(step));
    }
    setStep(next);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  function completeRegistration() {
    showToast('Account created · connection request sent to ' + trigger.name.split(' ')[0]);
    setTimeout(() => router.push('/home'), 1500);
  }

  function skipConnection() {
    router.push('/home');
  }

  return (
    <>
      <style>{`
        .cr-topbar{background:#0a0a2e;height:3.5rem;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;position:sticky;top:0;z-index:10;}
        .cr-logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;}
        .cr-logo span{color:#F5A623;}
        .cr-tb-login{font-size:.82rem;font-weight:600;color:rgba(255,255,255,.6);cursor:pointer;background:none;border:none;font-family:inherit;}
        .cr-tb-login:hover{color:#fff;}

        .cr-main{max-width:32rem;margin:0 auto;padding:2.5rem 1.5rem 5rem;}

        .cr-trigger{background:#0a0a2e;border-radius:1.25rem;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1rem;margin-bottom:2rem;box-shadow:0 .5rem 2rem rgba(0,0,0,.14);}
        .cr-tb-avatar{width:3.5rem;height:3.5rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;flex-shrink:0;border:.18rem solid rgba(255,255,255,.15);}
        .cr-tb-info{flex:1;}
        .cr-tb-eyebrow{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:.2rem;}
        .cr-tb-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;margin-bottom:.15rem;}
        .cr-tb-shop{font-size:.72rem;color:rgba(255,255,255,.5);}
        .cr-tb-badge{background:#3B6D11;color:#fff;border-radius:9999px;padding:.25rem .75rem;font-size:.65rem;font-weight:700;white-space:nowrap;flex-shrink:0;}

        .cr-progress-wrap{margin-bottom:2.5rem;}
        .cr-progress-steps{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:.85rem;}
        .cr-prog-step{display:flex;align-items:center;}
        .cr-prog-dot{width:2.4rem;height:2.4rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.82rem;border:.18rem solid rgba(0,0,0,.09);background:#fff;color:#9A9AAA;flex-shrink:0;transition:all .3s;}
        .cr-prog-dot.done{background:#3B6D11;border-color:#3B6D11;color:#fff;}
        .cr-prog-dot.active{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .cr-prog-line{width:4rem;height:.18rem;background:rgba(0,0,0,.09);transition:background .3s;}
        .cr-prog-line.done{background:#3B6D11;}
        .cr-prog-labels{display:flex;justify-content:space-between;padding:0 .5rem;}
        .cr-prog-label{font-size:.68rem;font-weight:600;color:#9A9AAA;text-align:center;flex:1;}
        .cr-prog-label.active{color:#0a0a2e;font-weight:800;}
        .cr-prog-label.done{color:#3B6D11;}

        .cr-step-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#111118;margin-bottom:.4rem;line-height:1.2;}
        .cr-step-sub{font-size:.88rem;color:#5A5A6A;margin-bottom:2rem;line-height:1.6;}

        .cr-form-field{margin-bottom:1.25rem;}
        .cr-form-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.45rem;display:block;}
        .cr-form-label .sub{font-weight:400;text-transform:none;letter-spacing:0;font-size:.68rem;}
        .cr-form-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.9rem 1.1rem;font-family:'DM Sans',sans-serif;font-size:1rem;color:#111118;outline:none;background:#fff;}
        .cr-form-input:focus{border-color:#F5A623;}
        .cr-form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}

        .cr-safety-intro{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.5rem;margin-bottom:1.5rem;}
        .cr-si-icon{width:3rem;height:3rem;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;margin-bottom:.85rem;}
        .cr-si-title{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;margin-bottom:.4rem;}
        .cr-si-text{font-size:.82rem;color:rgba(255,255,255,.65);line-height:1.8;}
        .cr-si-text strong{color:#F5A623;}

        .cr-pledge{display:flex;align-items:flex-start;gap:.85rem;padding:1rem 1.1rem;background:#F7F7F8;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;cursor:pointer;margin-bottom:.85rem;}
        .cr-pledge:hover{border-color:rgba(245,166,35,.25);}
        .cr-pledge.checked{border-color:#3B6D11;background:#EAF3DE;}
        .cr-pledge-check{width:1.4rem;height:1.4rem;border-radius:.35rem;border:1.5px solid rgba(0,0,0,.09);background:#fff;flex-shrink:0;margin-top:.1rem;display:flex;align-items:center;justify-content:center;}
        .cr-pledge.checked .cr-pledge-check{background:#3B6D11;border-color:#3B6D11;}
        .cr-pledge-text{font-size:.82rem;color:#5A5A6A;line-height:1.7;}
        .cr-pledge-text strong{color:#111118;}

        .cr-photo-upload{width:7rem;height:7rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 1.5rem;cursor:pointer;border:.2rem dashed rgba(10,10,46,.2);font-family:'Syne',sans-serif;font-weight:800;font-size:1.4rem;}
        .cr-photo-upload:hover{opacity:.85;}
        .cr-photo-upload-lbl{font-size:.62rem;font-weight:700;color:#0a0a2e;margin-top:.3rem;text-transform:uppercase;letter-spacing:.05em;}

        .cr-contact-opts{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.1rem;}
        .cr-contact-opt{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.4rem 1rem;font-size:.8rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .cr-contact-opt:hover{border-color:rgba(245,166,35,.25);}
        .cr-contact-opt.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .cr-barber-confirm{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.5rem;}
        .cr-bc-banner{background:linear-gradient(135deg,#0d2818,#1a4a2e);height:5rem;display:flex;align-items:center;justify-content:center;}
        .cr-bc-avatar{width:3.5rem;height:3.5rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;border:.2rem solid rgba(255,255,255,.2);}
        .cr-bc-body{padding:1.25rem;}
        .cr-bc-name{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#111118;margin-bottom:.2rem;}
        .cr-bc-shop{font-size:.8rem;color:#5A5A6A;margin-bottom:.6rem;}
        .cr-bc-code{display:inline-flex;border-radius:.25rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;margin-bottom:.6rem;}
        .cr-bcc-city{background:#F5A623;color:#0a0a2e;padding:.18rem .5rem;}
        .cr-bcc-state{background:#0a0a2e;color:#fff;padding:.18rem .4rem;border-left:1px solid rgba(255,255,255,.3);border-right:1px solid rgba(255,255,255,.3);}
        .cr-bcc-init{background:#0a0a2e;color:#F5A623;padding:.18rem .4rem;border-right:1px solid rgba(255,255,255,.3);}
        .cr-bcc-digits{background:#12124a;color:rgba(255,255,255,.85);padding:.18rem .5rem;}
        .cr-bc-rating{font-size:.78rem;color:#5A5A6A;}
        .cr-bc-rating .stars{color:#F5A623;}

        .cr-cir{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.75rem;text-align:center;margin-bottom:1.5rem;box-shadow:0 .5rem 2rem rgba(0,0,0,.14);}
        .cr-cir-label{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.6rem;}
        .cr-cir-id{font-family:'DM Mono',monospace;font-size:2rem;font-weight:500;color:#F5A623;letter-spacing:.1em;margin-bottom:.4rem;}
        .cr-cir-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;margin-bottom:.2rem;}
        .cr-cir-sub{font-size:.72rem;color:rgba(255,255,255,.4);line-height:1.6;}

        .cr-btn-primary{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:1rem;font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#F5A623;cursor:pointer;margin-bottom:.85rem;}
        .cr-btn-primary:hover{background:#14145c;}
        .cr-btn-secondary{width:100%;background:none;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.85rem;font-size:.88rem;font-weight:600;color:#5A5A6A;cursor:pointer;font-family:inherit;}
        .cr-btn-secondary:hover{border-color:#F5A623;color:#D4830A;}

        .cr-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.7rem 1.4rem;border-radius:2rem;font-size:.82rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <nav className="cr-topbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="cr-logo">{prefix}<span>{highlight}</span></div>
        </Link>
        <button type="button" className="cr-tb-login" onClick={() => router.push('/')}>Already have an account? Sign in</button>
      </nav>

      <div className="cr-main">
        <div className="cr-trigger">
          <div className="cr-tb-avatar">{trigger.initials}</div>
          <div className="cr-tb-info">
            <div className="cr-tb-eyebrow">You tapped</div>
            <div className="cr-tb-name">{trigger.name}</div>
            <div className="cr-tb-shop">{trigger.shop} &middot; {trigger.city}, {trigger.state} &middot; {trigger.codeInitials}&middot;{trigger.codeDigits}</div>
          </div>
          <div className="cr-tb-badge">Free to connect</div>
        </div>

        <div className="cr-progress-wrap">
          <div className="cr-progress-steps">
            {([1, 2, 3, 4] as Step[]).map((n, i) => {
              const dotCls = completed.has(n) ? ' done' : step === n ? ' active' : '';
              const lineCls = completed.has(n) ? ' done' : '';
              return (
                <span key={n} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="cr-prog-step">
                    <div className={'cr-prog-dot' + dotCls}>
                      {completed.has(n) ? '✓' : n}
                    </div>
                  </div>
                  {i < 3 && <div className={'cr-prog-line' + lineCls}></div>}
                </span>
              );
            })}
          </div>
          <div className="cr-prog-labels">
            {([1, 2, 3, 4] as Step[]).map(n => {
              const cls = completed.has(n) ? ' done' : step === n ? ' active' : '';
              return <div key={n} className={'cr-prog-label' + cls}>{STEP_LABELS[n]}</div>;
            })}
          </div>
        </div>

        {step === 1 && (
          <div>
            <div className="cr-step-title">Create your account</div>
            <div className="cr-step-sub">Your information is private and encrypted. {config.serviceName} never sells your data.</div>

            <div className="cr-form-row">
              <div className="cr-form-field">
                <label className="cr-form-label">First Name</label>
                <input className="cr-form-input" placeholder="Rayford" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
              </div>
              <div className="cr-form-field">
                <label className="cr-form-label">Last Name</label>
                <input className="cr-form-input" placeholder="Gibson" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
              </div>
            </div>

            <div className="cr-form-field">
              <label className="cr-form-label">Email</label>
              <input className="cr-form-input" type="email" placeholder="rayford@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="cr-form-field">
              <label className="cr-form-label">Phone</label>
              <input className="cr-form-input" type="tel" placeholder="(713) 555-0199" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>
            <div className="cr-form-field">
              <label className="cr-form-label">Password</label>
              <input className="cr-form-input" type="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="cr-form-field">
              <label className="cr-form-label">Confirm Password</label>
              <input className="cr-form-input" type="password" placeholder="Repeat your password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}/>
            </div>

            <button type="button" className="cr-btn-primary" onClick={() => goStep(2)}>Continue &rarr;</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="cr-step-title">Safety Protocol</div>
            <div className="cr-step-sub">Required for all members. This keeps you and your barber safe.</div>

            <div className="cr-safety-intro">
              <div className="cr-si-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div className="cr-si-title">Your information is protected</div>
              <div className="cr-si-text">This is <strong>encrypted</strong> and only accessed in a genuine emergency. Your barber never sees it. {config.serviceName} staff only access it if there is a reported safety incident involving you.</div>
            </div>

            <div className="cr-form-field">
              <label className="cr-form-label">Emergency Contact Name</label>
              <input className="cr-form-input" placeholder="Full name of someone we can contact" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)}/>
            </div>
            <div className="cr-form-field">
              <label className="cr-form-label">Emergency Contact Phone</label>
              <input className="cr-form-input" type="tel" placeholder="(713) 555-0000" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)}/>
            </div>
            <div className="cr-form-field">
              <label className="cr-form-label">Home Address <span className="sub">&middot; used for mobile barber appointments</span></label>
              <input className="cr-form-input" placeholder="1234 Main St, Houston, TX 77006" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)}/>
            </div>

            <div className={'cr-pledge' + (pledge1 ? ' checked' : '')} onClick={() => setPledge1(p => !p)}>
              <div className="cr-pledge-check">
                {pledge1 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div className="cr-pledge-text">I understand this information is <strong>encrypted</strong> and will only be accessed in a genuine safety emergency. It will never be shared with my barber or used for any other purpose.</div>
            </div>

            <div className={'cr-pledge' + (pledge2 ? ' checked' : '')} onClick={() => setPledge2(p => !p)}>
              <div className="cr-pledge-check">
                {pledge2 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div className="cr-pledge-text">I agree to {config.serviceName}&apos;s <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.</div>
            </div>

            <button type="button" className="cr-btn-primary" style={{ marginTop: '.5rem' }} onClick={() => goStep(3)}>Continue &rarr;</button>
            <button type="button" className="cr-btn-secondary" onClick={() => goStep(1)}>&larr; Back</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="cr-step-title">Set up your profile</div>
            <div className="cr-step-sub">Your preferred name is what your barber calls you. Your photo helps them recognize you when you arrive.</div>

            <div className="cr-photo-upload" onClick={() => showToast('Opens camera or file picker in production')}>
              {photoInitials}
              <div className="cr-photo-upload-lbl">Add Photo</div>
            </div>

            <div className="cr-form-field">
              <label className="cr-form-label">Preferred Name <span className="sub">&middot; what your barber calls you</span></label>
              <input className="cr-form-input" placeholder="e.g. Ray · Skip if same as first name" value={preferredName} onChange={(e) => setPreferredName(e.target.value)}/>
            </div>

            <div className="cr-form-field">
              <label className="cr-form-label">How should your barber contact you?</label>
              <div className="cr-contact-opts">
                {(['Text only', 'Call', 'Either'] as ContactPref[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={'cr-contact-opt' + (contactPref === opt ? ' on' : '')}
                    onClick={() => setContactPref(opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <button type="button" className="cr-btn-primary" style={{ marginTop: '.5rem' }} onClick={() => goStep(4)}>Continue &rarr;</button>
            <button type="button" className="cr-btn-secondary" onClick={() => goStep(2)}>&larr; Back</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="cr-step-title">Connect with {trigger.name.split(' ')[0]}</div>
            <div className="cr-step-sub">You tapped {trigger.name}&apos;s profile. Confirm your connection request &mdash; it goes directly to him at no charge.</div>

            <div className="cr-barber-confirm">
              <div className="cr-bc-banner">
                <div className="cr-bc-avatar">{trigger.initials}</div>
              </div>
              <div className="cr-bc-body">
                <div className="cr-bc-name">{trigger.name}</div>
                <div className="cr-bc-shop">{trigger.shop} &middot; {trigger.address}</div>
                <div className="cr-bc-code">
                  <div className="cr-bcc-city">{trigger.city}</div>
                  <div className="cr-bcc-state">{trigger.state}</div>
                  <div className="cr-bcc-init">{trigger.codeInitials}</div>
                  <div className="cr-bcc-digits">{trigger.codeDigits}</div>
                </div>
                <div className="cr-bc-rating"><span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span> {trigger.rating} &middot; {trigger.visits} &middot; {trigger.yrsLicensed}</div>
              </div>
            </div>

            <div className="cr-cir">
              <div className="cr-cir-label">Your Client ID &mdash; assigned</div>
              <div className="cr-cir-id">{clientId}</div>
              <div className="cr-cir-name">{fullName}</div>
              <div className="cr-cir-sub">Permanent &middot; never changes &middot; your identity across all {config.companyName.replace(' Inc.', '')} platforms</div>
            </div>

            <button type="button" className="cr-btn-primary" onClick={completeRegistration}>Send Connection Request to {trigger.name.split(' ')[0]} &rarr;</button>
            <button type="button" className="cr-btn-secondary" onClick={skipConnection}>Skip for now &middot; go to my home</button>
          </div>
        )}
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>

      {toast && <div className="cr-toast">{toast}</div>}
    </>
  );
}

export default function ClientRegistrationPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      <ClientRegContent />
    </Suspense>
  );
}
