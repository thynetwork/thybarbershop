'use client';

import { FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import config, { splitServiceName, getLoginFeatures } from '@/lib/config';

type Role = 'client' | 'barber';

export default function LoginPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const features = getLoginFeatures();

  const [role, setRole] = useState<Role>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeCity, setCodeCity] = useState('');
  const [codeState, setCodeState] = useState('');
  const [codeInitials, setCodeInitials] = useState('');
  const [codeDigits, setCodeDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stateRef = useRef<HTMLInputElement>(null);
  const initRef = useRef<HTMLInputElement>(null);
  const digitsRef = useRef<HTMLInputElement>(null);

  function autoTab(value: string, max: number, next?: HTMLInputElement | null) {
    if (value.length >= max && next) next.focus();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: Record<string, string> = {
        email,
        password,
        role: role === 'client' ? 'rider' : 'driver',
      };
      if (role === 'client') {
        if (!codeCity || !codeState || !codeInitials || !codeDigits) {
          setError(`Enter your ${config.providerLabel} Code to continue.`);
          setLoading(false);
          return;
        }
        body.codeAirport = codeCity.toUpperCase();
        body.codeState = codeState.toUpperCase();
        body.codeInitials = codeInitials.toUpperCase();
        body.codeDigits = codeDigits;
        body.barberCode = `${codeCity.toUpperCase()}${codeState.toUpperCase()}${codeInitials.toUpperCase()}${codeDigits}`;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }
      if (data.redirect) router.push(data.redirect);
      else router.push(role === 'barber' ? '/dashboard' : '/home');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        :root{
          --navy:#0a0a2e;--navy-mid:#12124a;--navy-light:#1a1a6e;
          --amber:#F5A623;--amber-dim:#D4830A;
          --white:#fff;--off-white:#F7F7F8;
          --text-dark:#111118;--text-mid:#5A5A6A;--text-light:#9A9AAA;
          --border-light:rgba(255,255,255,0.07);
          --r-md:.625rem;--r-lg:.875rem;--r-full:9999px;
        }
        html,body{height:100%;background:#0a0a2e;color:#fff;font-family:'DM Sans',sans-serif;overflow:hidden;}

        .lg-shell{display:grid;grid-template-columns:1fr 1fr;height:100vh;min-height:37.5rem;}

        /* LEFT */
        .lg-left{
          background:#0a0a2e;
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(26,26,110,.6) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 90%, rgba(245,166,35,.06) 0%, transparent 50%);
          padding:3rem 2.75rem;display:flex;flex-direction:column;justify-content:space-between;
          border-right:1px solid var(--border-light);position:relative;overflow:hidden;
        }
        .lg-left::before{
          content:'';position:absolute;top:0;right:0;width:.1875rem;height:100%;
          background:repeating-linear-gradient(180deg,#F5A623 0,#F5A623 1.125rem,transparent 1.125rem,transparent 2.25rem,#fff 2.25rem,#fff 3.375rem,transparent 3.375rem,transparent 4.5rem);
          opacity:.12;
        }
        .lg-brand-logo{font-family:'Syne',sans-serif;font-size:1.875rem;font-weight:800;color:#fff;line-height:1;margin-bottom:.375rem;animation:lgFadeUp .5s ease both;}
        .lg-brand-logo span{color:#F5A623;}
        .lg-brand-tagline{font-size:.625rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:1.75rem;animation:lgFadeUp .5s .08s ease both;}

        .lg-city-row{display:flex;gap:.375rem;flex-wrap:wrap;margin-bottom:1.75rem;animation:lgFadeUp .5s .14s ease both;}
        .lg-city-pill{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:9999px;padding:.25rem .75rem;font-size:.625rem;font-weight:700;color:#F5A623;letter-spacing:.06em;}
        .lg-city-pill.more{background:rgba(245,166,35,.2);border:1px solid rgba(245,166,35,.5);color:#F5A623;font-weight:700;}

        .lg-features{display:flex;flex-direction:column;gap:.625rem;margin-bottom:2rem;animation:lgFadeUp .5s .2s ease both;}
        .lg-feat{display:flex;align-items:flex-start;gap:.625rem;font-size:.75rem;color:rgba(255,255,255,.5);line-height:1.5;}
        .lg-feat-dot{width:.3125rem;height:.3125rem;border-radius:50%;background:#F5A623;margin-top:.3125rem;flex-shrink:0;opacity:.7;}
        .lg-feat strong{color:rgba(255,255,255,.85);font-weight:500;}

        .lg-find-card{background:rgba(245,166,35,.08);border:2px solid rgba(245,166,35,.55);border-radius:.875rem;padding:1.2rem;margin:1.2rem 0;animation:lgFadeUp .5s .26s ease both;cursor:pointer;box-shadow:0 0 0 1px rgba(245,166,35,.15),0 .25rem 1.25rem rgba(245,166,35,.08);}
        .lg-find-card:hover{background:rgba(245,166,35,.13);border-color:rgba(245,166,35,.75);}
        .lg-find-card-label{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#F5A623;margin-bottom:.35rem;letter-spacing:.04em;}
        .lg-find-card-sub{font-size:.75rem;color:rgba(255,255,255,.5);margin-bottom:.9rem;line-height:1.5;}
        .lg-find-card-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;background:#F5A623;border:none;border-radius:.875rem;padding:.85rem 1rem;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#0a0a2e;letter-spacing:.04em;cursor:pointer;font-family:inherit;width:100%;}
        .lg-find-card-btn:hover{background:#e09910;}

        .lg-left-foot{font-size:.65rem;color:rgba(255,255,255,.25);line-height:1.8;text-align:center;width:100%;padding-top:1rem;border-top:1px solid rgba(255,255,255,.07);animation:lgFadeUp .5s .32s ease both;}

        /* RIGHT */
        .lg-right{background:#F7F7F8;display:flex;align-items:center;justify-content:center;padding:3rem 2.75rem;position:relative;overflow:hidden;}
        .lg-right::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 70% 20%,rgba(245,166,35,.04) 0%,transparent 50%);pointer-events:none;}
        .lg-form-shell{width:100%;max-width:22.5rem;animation:lgFadeUp .45s .1s ease both;}

        .lg-form-head{margin-bottom:1.5rem;}
        .lg-form-title{font-family:'Syne',sans-serif;font-size:1.375rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .lg-form-sub{font-size:.75rem;color:#9A9AAA;}
        .lg-form-blurb{font-size:.6875rem;color:#9A9AAA;margin-top:.375rem;line-height:1.6;}

        .lg-toggle-wrap{background:#EBEBED;border-radius:.875rem;padding:.25rem;display:grid;grid-template-columns:1fr 1fr;gap:.1875rem;margin-bottom:1.375rem;}
        .lg-toggle-btn{border:none;border-radius:.625rem;padding:.5625rem 0;font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:600;cursor:pointer;background:transparent;color:#9A9AAA;}
        .lg-toggle-btn.active{background:#fff;color:#111118;box-shadow:0 .125rem .5rem rgba(0,0,0,.1);}
        .lg-toggle-btn.active.barber{background:#0a0a2e;color:#F5A623;}

        .lg-field-group{display:flex;flex-direction:column;gap:.875rem;margin-bottom:1.125rem;}
        .lg-field{display:flex;flex-direction:column;gap:.3125rem;}
        .lg-field-label{font-size:.625rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#5A5A6A;}
        .lg-field-input{background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:.625rem;padding:.6875rem .875rem;font-family:'DM Sans',sans-serif;font-size:.8125rem;color:#111118;outline:none;width:100%;}
        .lg-field-input::placeholder{color:#9A9AAA;}
        .lg-field-input:focus{border-color:#F5A623;box-shadow:0 0 0 .1875rem rgba(245,166,35,.12);}

        .lg-code-field{display:flex;border-radius:.625rem;overflow:hidden;border:2px solid rgba(0,0,0,.15);background:none;}
        .lg-code-field:focus-within{border-color:#F5A623;box-shadow:0 0 0 .1875rem rgba(245,166,35,.12);}
        .lg-code-seg{border:none;outline:none;font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;padding:.7rem .5rem;text-align:center;text-transform:uppercase;min-width:0;}
        .lg-code-seg::placeholder{font-family:'Syne',sans-serif;font-weight:700;font-size:.8rem;text-transform:uppercase;}
        .lg-code-city{background:#F5A623;color:#0a0a2e;flex:4;border-right:.1875rem solid #fff;}
        .lg-code-city::placeholder{color:rgba(10,10,46,.45);}
        .lg-code-state{background:#0a0a2e;color:#fff;flex:1;border-right:.1875rem solid #fff;}
        .lg-code-state::placeholder{color:rgba(255,255,255,.35);}
        .lg-code-init{background:#0a0a2e;color:#F5A623;flex:1;border-right:.1875rem solid #fff;}
        .lg-code-init::placeholder{color:rgba(245,166,35,.45);}
        .lg-code-digits{background:#12124a;color:#fff;flex:1;}
        .lg-code-digits::placeholder{color:rgba(255,255,255,.45);}
        .lg-code-labels{display:flex;}
        .lg-code-label{flex:1;text-align:center;font-size:.6rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#9A9AAA;}
        .lg-code-label.city{flex:4;}

        .lg-forgot{display:block;text-align:right;font-size:.6875rem;color:#D4830A;cursor:pointer;margin-top:-.375rem;margin-bottom:.375rem;text-decoration:none;background:none;border:none;font-family:inherit;width:100%;}
        .lg-forgot:hover{text-decoration:underline;}

        .lg-barber-note{background:rgba(10,10,46,.05);border:1px solid rgba(10,10,46,.1);border-radius:.625rem;padding:.625rem .875rem;font-size:.6875rem;color:#5A5A6A;line-height:1.6;margin-bottom:.875rem;font-style:italic;}
        .lg-barber-note strong{color:#0a0a2e;font-style:normal;}

        .lg-error{background:rgba(180,40,40,.08);border:1px solid rgba(180,40,40,.25);border-radius:.625rem;padding:.5rem .75rem;color:#b42828;font-size:.75rem;margin-bottom:.875rem;}

        .lg-submit-btn{width:100%;background:#0a0a2e;color:#F5A623;border:none;border-radius:.875rem;padding:.875rem;font-family:'Syne',sans-serif;font-size:.875rem;font-weight:800;cursor:pointer;letter-spacing:.04em;margin-bottom:1rem;}
        .lg-submit-btn:hover{background:#14145c;}
        .lg-submit-btn.barber{background:#F5A623;color:#0a0a2e;}
        .lg-submit-btn.barber:hover{background:#e09910;}
        .lg-submit-btn:disabled{opacity:.6;cursor:not-allowed;}

        .lg-form-bottom{margin-top:1.125rem;display:flex;flex-direction:column;gap:.5rem;}
        .lg-no-code{font-size:.6875rem;color:#9A9AAA;text-align:center;line-height:1.5;}
        .lg-bottom-link{display:block;text-align:center;font-size:.75rem;color:#0a0a2e;font-weight:600;text-decoration:none;border-bottom:1px solid transparent;}
        .lg-bottom-link:hover{border-color:#0a0a2e;}

        .lg-form-legal{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;width:100%;margin-top:.8rem;padding-top:.8rem;border-top:1px solid rgba(0,0,0,.07);}
        .lg-form-legal a{font-size:.65rem;color:#9A9AAA;text-decoration:none;flex:1;text-align:center;padding:.2rem 0;border-right:1px solid rgba(0,0,0,.12);}
        .lg-form-legal a:last-of-type{border-right:none;}
        .lg-form-legal a:hover{color:#111118;}
        .lg-form-legal-copy{width:100%;text-align:center;font-size:.62rem;color:#9A9AAA;margin-top:.4rem;}

        @keyframes lgFadeUp{from{opacity:0;transform:translateY(.625rem);}to{opacity:1;transform:translateY(0);}}

        @media(max-width:43.75rem){
          html,body{overflow:auto;}
          .lg-shell{grid-template-columns:1fr;height:auto;}
          .lg-left{padding:2rem 1.5rem;border-right:none;border-bottom:1px solid var(--border-light);}
          .lg-right{padding:2rem 1.5rem;}
          .lg-left::before{display:none;}
        }
      `}</style>

      <div className="lg-shell">

        {/* LEFT — Brand */}
        <div className="lg-left">
          <div>
            <div className="lg-brand-logo">{prefix}<span>{highlight}</span></div>
            <div className="lg-brand-tagline">{config.tagline}</div>

            <div className="lg-city-row">
              {config.locationPills.map(p => <div key={p} className="lg-city-pill">{p}</div>)}
              <div className="lg-city-pill more">+ every city</div>
            </div>

            <div className="lg-features">
              {features.map((f, i) => {
                const m = f.match(/^(.+?\.)\s*(.*)$/);
                return (
                  <div key={i} className="lg-feat">
                    <div className="lg-feat-dot"></div>
                    <span>{m ? <><strong>{m[1]}</strong> {m[2]}</> : f}</span>
                  </div>
                );
              })}
            </div>

            <Link href="/find-a-barber" style={{ textDecoration: 'none' }}>
              <div className="lg-find-card">
                <div className="lg-find-card-label">Need a Regular {config.providerLabel}?</div>
                <div className="lg-find-card-sub">Search the pool anytime.</div>
                <div className="lg-find-card-btn">
                  <span>Find a {config.providerLabel}</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="lg-left-foot">
            {config.serviceName} is a private platform by {config.companyName}<br/>
            Professionals own their client relationships here.<br/>
            &copy; {config.copyrightYear} {config.companyName} All rights reserved.
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lg-right">
          <div className="lg-form-shell">
            <div className="lg-form-head">
              <div className="lg-form-title">Welcome back</div>
              <div className="lg-form-sub">{role === 'client' ? `Sign in to book your ${config.providerLabel.toLowerCase()}` : 'Sign in to manage your clients'}</div>
              <div className="lg-form-blurb">Private booking between you and your {config.providerLabel.toLowerCase()}.<br/>No app store. No algorithm. No strangers.</div>
            </div>

            <div className="lg-toggle-wrap">
              <button type="button" className={'lg-toggle-btn' + (role === 'client' ? ' active' : '')} onClick={() => setRole('client')}>Client</button>
              <button type="button" className={'lg-toggle-btn' + (role === 'barber' ? ' active barber' : '')} onClick={() => setRole('barber')}>{config.providerLabel}</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="lg-field-group">
                <div className="lg-field">
                  <div className="lg-field-label">Email</div>
                  <input className="lg-field-input" type="email" placeholder="your@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                {role === 'client' && (
                  <div className="lg-field">
                    <div className="lg-field-label">{config.providerLabel} Code</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.3125rem' }}>
                      <div className="lg-code-field">
                        <input
                          className="lg-code-seg lg-code-city"
                          maxLength={15}
                          placeholder="South Houston"
                          value={codeCity}
                          onChange={(e) => { const v = e.target.value.toUpperCase(); setCodeCity(v); autoTab(v, 15, stateRef.current); }}
                        />
                        <input
                          ref={stateRef}
                          className="lg-code-seg lg-code-state"
                          maxLength={2}
                          placeholder="TX"
                          value={codeState}
                          onChange={(e) => { const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); setCodeState(v); autoTab(v, 2, initRef.current); }}
                        />
                        <input
                          ref={initRef}
                          className="lg-code-seg lg-code-init"
                          maxLength={3}
                          placeholder="MRC"
                          value={codeInitials}
                          onChange={(e) => { const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); setCodeInitials(v); autoTab(v, 3, digitsRef.current); }}
                        />
                        <input
                          ref={digitsRef}
                          className="lg-code-seg lg-code-digits"
                          maxLength={5}
                          placeholder="3341"
                          value={codeDigits}
                          onChange={(e) => setCodeDigits(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        />
                      </div>
                      <div className="lg-code-labels">
                        <div className="lg-code-label city">City/Town</div>
                        <div className="lg-code-label">State</div>
                        <div className="lg-code-label">Initials</div>
                        <div className="lg-code-label">Digits</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="lg-field">
                  <div className="lg-field-label">Password</div>
                  <input className="lg-field-input" type="password" placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
              </div>

              <Link href="/forgot-code" className="lg-forgot">Forgot password?</Link>

              {role === 'barber' && (
                <div className="lg-barber-note">
                  <strong>{config.providerLabel}s:</strong> These aren&rsquo;t customers. They&rsquo;re your clients. Your list. Your rates. Your relationship — protected.
                </div>
              )}

              {error && <div className="lg-error">{error}</div>}

              <button type="submit" className={'lg-submit-btn' + (role === 'barber' ? ' barber' : '')} disabled={loading}>
                {loading ? 'Signing in…' : (role === 'client' ? `Book My ${config.providerLabel}` : 'Enter My Dashboard')}
              </button>
            </form>

            <div className="lg-form-bottom">
              {role === 'client' && (
                <div className="lg-no-code">Don&rsquo;t have a code? Request one from your {config.providerLabel.toLowerCase()}.</div>
              )}
              <Link href="/register/client" className="lg-bottom-link">First time here? Create your client account &rarr;</Link>
              {role === 'client' && (
                <Link href="/register/barber" className="lg-bottom-link">Are you a {config.providerLabel.toLowerCase()}? Create your account &rarr;</Link>
              )}
            </div>

            <div className="lg-form-legal">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/conditions">Conditions</a>
              <div className="lg-form-legal-copy">&copy; {config.copyrightYear} {config.companyName} All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
