'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type Slide = 1 | 2 | 3 | 4 | 5 | 6;

const TOTAL: Slide = 6;

const barber = {
  firstName: 'John',
  city: 'South Houston',
  state: 'TX',
  codeInitials: 'JMR',
  codeDigits: '7749',
  inviteHandle: 'thybarber.shop/invite/JMR7749',
};

interface CheckItem {
  id: string;
  done: boolean;
  title: string;
  sub: string;
  href?: string;
}

const INITIAL_CHECKS: CheckItem[] = [
  { id: 'c1', done: true,  title: 'Account created', sub: 'Registration approved · code assigned' },
  { id: 'c2', done: false, title: 'Complete your profile', sub: 'Shop Vibe · photos · specialties · payment handles', href: '/edit-profile' },
  { id: 'c3', done: false, title: 'Upload portfolio photos', sub: 'Show clients what you can do', href: '/edit-profile' },
  { id: 'c4', done: false, title: 'Share your invite link', sub: 'Text it to your regulars · post your QR code', href: '/share' },
  { id: 'c5', done: false, title: 'Set your availability', sub: 'Calendar · hours · block days off', href: '/calendar' },
  { id: 'c6', done: false, title: 'Set your cancellation policy', sub: 'Protect your time · keep your regulars', href: '/settings' },
];

export default function BarberOnboardingPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [slide, setSlide] = useState<Slide>(1);
  const [maxReached, setMaxReached] = useState<Slide>(1);

  function goSlide(n: Slide) {
    setSlide(n);
    if (n > maxReached) setMaxReached(n);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  function goToDashboard() {
    router.push('/dashboard');
  }

  return (
    <>
      <style>{`
        .ob-root{min-height:100vh;background:#0a0a2e;color:#111118;font-family:'DM Sans',sans-serif;}
        .ob-topbar{background:rgba(0,0,0,.2);height:3.5rem;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;}
        .ob-logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;}
        .ob-logo span{color:#F5A623;}
        .ob-skip{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.4);cursor:pointer;background:none;border:none;font-family:inherit;}
        .ob-skip:hover{color:rgba(255,255,255,.7);}

        .ob-main{max-width:34rem;margin:0 auto;padding:2rem 1.5rem 4rem;}

        .ob-step-dots{display:flex;justify-content:center;gap:.5rem;margin-bottom:2.5rem;}
        .ob-step-dot{width:.5rem;height:.5rem;border-radius:50%;background:rgba(255,255,255,.15);transition:all .3s;cursor:pointer;border:none;padding:0;}
        .ob-step-dot.on{background:#F5A623;width:1.5rem;border-radius:9999px;}
        .ob-step-dot.done{background:#3B6D11;}

        .ob-welcome-badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(59,109,17,.2);border:1px solid rgba(126,200,90,.3);border-radius:9999px;padding:.35rem 1rem;font-size:.72rem;font-weight:700;color:#7ec85a;margin-bottom:1.5rem;}
        .ob-slide-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;line-height:1.2;margin-bottom:.75rem;}
        .ob-slide-title span{color:#F5A623;}
        .ob-slide-sub{font-size:.9rem;color:rgba(255,255,255,.6);line-height:1.8;margin-bottom:2rem;}

        .ob-code-reveal{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:1.25rem;padding:1.25rem;margin-bottom:2rem;text-align:center;}
        .ob-cr-label{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.6rem;}
        .ob-cr-code{display:inline-flex;border-radius:.4rem;overflow:hidden;font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;}
        .ob-crc-city{background:#F5A623;color:#0a0a2e;padding:.4rem .85rem;}
        .ob-crc-state{background:rgba(255,255,255,.12);color:#fff;padding:.4rem .65rem;border-left:1.5px solid rgba(255,255,255,.2);border-right:1.5px solid rgba(255,255,255,.2);}
        .ob-crc-init{background:rgba(255,255,255,.08);color:#F5A623;padding:.4rem .65rem;border-right:1.5px solid rgba(255,255,255,.2);}
        .ob-crc-digits{background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);padding:.4rem .85rem;}
        .ob-cr-sub{font-size:.68rem;color:rgba(255,255,255,.3);margin-top:.6rem;line-height:1.6;}

        .ob-feature-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:1.25rem;padding:1.25rem;margin-bottom:1rem;display:flex;align-items:flex-start;gap:1rem;}
        .ob-fc-icon{width:2.75rem;height:2.75rem;border-radius:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .ob-fc-title{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:800;color:#fff;margin-bottom:.3rem;}
        .ob-fc-desc{font-size:.78rem;color:rgba(255,255,255,.55);line-height:1.7;}

        .ob-standard-card{background:linear-gradient(135deg,rgba(245,166,35,.1),rgba(245,166,35,.04));border:1px solid rgba(245,166,35,.25);border-radius:1.25rem;padding:1.5rem;margin-bottom:1.5rem;}
        .ob-sc-title{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#F5A623;margin-bottom:.75rem;}
        .ob-sc-items{display:flex;flex-direction:column;gap:.5rem;}
        .ob-sc-item{display:flex;align-items:flex-start;gap:.6rem;font-size:.78rem;color:rgba(255,255,255,.65);line-height:1.6;}
        .ob-sc-dot{width:.4rem;height:.4rem;border-radius:50%;background:#F5A623;flex-shrink:0;margin-top:.5rem;}

        .ob-checklist{display:flex;flex-direction:column;gap:.75rem;margin-bottom:2rem;}
        .ob-check-item{display:flex;align-items:center;gap:.85rem;padding:.9rem 1.1rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:1rem;cursor:pointer;font-family:inherit;text-align:left;width:100%;}
        .ob-check-item:hover{background:rgba(255,255,255,.08);}
        .ob-check-item.done{border-color:rgba(59,109,17,.4);background:rgba(59,109,17,.1);}
        .ob-ci-check{width:1.4rem;height:1.4rem;border-radius:50%;border:1.5px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .ob-check-item.done .ob-ci-check{background:#3B6D11;border-color:#3B6D11;}
        .ob-ci-info{flex:1;}
        .ob-ci-title{font-size:.85rem;font-weight:600;color:#fff;margin-bottom:.1rem;}
        .ob-ci-sub{font-size:.68rem;color:rgba(255,255,255,.4);}
        .ob-ci-action{font-size:.7rem;font-weight:700;color:#F5A623;white-space:nowrap;flex-shrink:0;}

        .ob-btn-primary{width:100%;background:#F5A623;border:none;border-radius:1rem;padding:1rem;font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#0a0a2e;cursor:pointer;margin-bottom:.75rem;}
        .ob-btn-primary:hover{opacity:.88;}
        .ob-btn-secondary{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:1rem;padding:.85rem;font-size:.88rem;font-weight:600;color:rgba(255,255,255,.6);cursor:pointer;font-family:inherit;}
        .ob-btn-secondary:hover{background:rgba(255,255,255,.1);color:#fff;}
      `}</style>

      <div className="ob-root">
        <nav className="ob-topbar">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="ob-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <button type="button" className="ob-skip" onClick={() => goSlide(6)}>Skip &rarr;</button>
        </nav>

        <div className="ob-main">
          <div className="ob-step-dots">
            {([1, 2, 3, 4, 5, 6] as Slide[]).map(n => {
              const cls = slide === n ? ' on' : maxReached > n ? ' done' : '';
              return (
                <button
                  key={n}
                  type="button"
                  className={'ob-step-dot' + cls}
                  onClick={() => goSlide(n)}
                  aria-label={`Slide ${n}`}
                />
              );
            })}
          </div>

          {slide === 1 && (
            <div>
              <div className="ob-welcome-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Account Approved
              </div>
              <div className="ob-slide-title">Welcome to<br/><span>{config.serviceName}</span>,<br/>{barber.firstName}.</div>
              <div className="ob-slide-sub">Your account is live. This is your home for managing clients, bookings, and your business &mdash; all in one place.</div>

              <div className="ob-code-reveal">
                <div className="ob-cr-label">Your {config.providerLabel} Code &mdash; permanent &middot; never changes</div>
                <div className="ob-cr-code">
                  <div className="ob-crc-city">{barber.city}</div>
                  <div className="ob-crc-state">{barber.state}</div>
                  <div className="ob-crc-init">{barber.codeInitials}</div>
                  <div className="ob-crc-digits">{barber.codeDigits}</div>
                </div>
                <div className="ob-cr-sub">This is your identity on {config.serviceName}. Share it with clients so they can find and connect with you directly.</div>
              </div>

              <button type="button" className="ob-btn-primary" onClick={() => goSlide(2)}>Let&rsquo;s go &rarr;</button>
            </div>
          )}

          {slide === 2 && (
            <div>
              <div className="ob-slide-title">Your <span>Dashboard</span></div>
              <div className="ob-slide-sub">Everything you need to run your day &mdash; appointments, clients, and earnings &mdash; in one screen.</div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: 'rgba(245,166,35,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Today&rsquo;s Schedule</div>
                  <div className="ob-fc-desc">See every appointment for the day. Mark complete, running late, or no-show with one tap.</div>
                </div>
              </div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: '#EAF3DE' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Pending Requests</div>
                  <div className="ob-fc-desc">New clients who want to connect appear here. Review their profile and approve or decline.</div>
                </div>
              </div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: 'rgba(10,10,46,0.06)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a2e" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Earnings at a Glance</div>
                  <div className="ob-fc-desc">This week, this month, total. You get paid directly &mdash; {config.serviceName} takes no commission. Ever.</div>
                </div>
              </div>

              <button type="button" className="ob-btn-primary" onClick={() => goSlide(3)}>Next &rarr;</button>
              <button type="button" className="ob-btn-secondary" onClick={() => goSlide(1)}>&larr; Back</button>
            </div>
          )}

          {slide === 3 && (
            <div>
              <div className="ob-slide-title">Your <span>Clients</span></div>
              <div className="ob-slide-sub">Every client you connect with gets their own profile. You set a Chair Rate together &mdash; a private agreed price just between you two.</div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: 'rgba(245,166,35,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Chair Rate</div>
                  <div className="ob-fc-desc">Your Chair Rate is a private price you set with each client. Ray pays $45. Todd pays $55. It&rsquo;s between you and them &mdash; no one else sees it.</div>
                </div>
              </div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: '#EAF3DE' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Safety Protocol</div>
                  <div className="ob-fc-desc">Every client completes a Safety Protocol at signup. You never see it &mdash; it&rsquo;s encrypted and only used in emergencies.</div>
                </div>
              </div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: 'rgba(10,10,46,0.06)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a2e" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Private Notes</div>
                  <div className="ob-fc-desc">Keep private notes on each client &mdash; their hair type, sensitivities, tipping habits, anything. Only you see them.</div>
                </div>
              </div>

              <button type="button" className="ob-btn-primary" onClick={() => goSlide(4)}>Next &rarr;</button>
              <button type="button" className="ob-btn-secondary" onClick={() => goSlide(2)}>&larr; Back</button>
            </div>
          )}

          {slide === 4 && (
            <div>
              <div className="ob-slide-title">Share your <span>code</span></div>
              <div className="ob-slide-sub">Your barber code and invite link are how clients find you and connect for free. Share it everywhere.</div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: 'rgba(245,166,35,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Invite Link</div>
                  <div className="ob-fc-desc">{barber.inviteHandle} &middot; Send by text, WhatsApp, Instagram. Clients who use your link connect for free &mdash; no fee for them.</div>
                </div>
              </div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: 'rgba(10,10,46,0.06)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a2e" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">QR Code</div>
                  <div className="ob-fc-desc">Download your QR code and post it on your mirror, chair, or business card. Clients scan it and connect instantly.</div>
                </div>
              </div>

              <div className="ob-feature-card">
                <div className="ob-fc-icon" style={{ background: '#EAF3DE' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="ob-fc-title">Pool (optional)</div>
                  <div className="ob-fc-desc">New clients can also find you by zip code in the {config.providerLabel.toLowerCase()} pool. Complete your profile to show up in searches.</div>
                </div>
              </div>

              <button type="button" className="ob-btn-primary" onClick={() => goSlide(5)}>Next &rarr;</button>
              <button type="button" className="ob-btn-secondary" onClick={() => goSlide(3)}>&larr; Back</button>
            </div>
          )}

          {slide === 5 && (
            <div>
              <div className="ob-slide-title">The <span>Professional<br/>Standard</span></div>
              <div className="ob-slide-sub">You pledged this at registration. This is what it means in practice.</div>

              <div className="ob-standard-card">
                <div className="ob-sc-title">What you committed to</div>
                <div className="ob-sc-items">
                  <div className="ob-sc-item"><div className="ob-sc-dot"></div>Show up on time or communicate early if you can&rsquo;t.</div>
                  <div className="ob-sc-item"><div className="ob-sc-dot"></div>Treat every client with respect &mdash; regardless of who they are.</div>
                  <div className="ob-sc-item"><div className="ob-sc-dot"></div>Keep your workspace clean and professional at all times.</div>
                  <div className="ob-sc-item"><div className="ob-sc-dot"></div>No hate speech, discrimination, or hostile conduct.</div>
                  <div className="ob-sc-item"><div className="ob-sc-dot"></div>Deliver what you advertise &mdash; no bait and switch on pricing or service.</div>
                  <div className="ob-sc-item"><div className="ob-sc-dot"></div>A 0-star safety report triggers an immediate review. Three violations result in permanent removal.</div>
                </div>
              </div>

              <button type="button" className="ob-btn-primary" onClick={() => goSlide(6)}>Next &rarr;</button>
              <button type="button" className="ob-btn-secondary" onClick={() => goSlide(4)}>&larr; Back</button>
            </div>
          )}

          {slide === 6 && (
            <div>
              <div className="ob-slide-title">You&rsquo;re <span>live.</span><br/>Now finish your setup.</div>
              <div className="ob-slide-sub">Complete these steps to start getting clients. Takes about 10 minutes.</div>

              <div className="ob-checklist">
                {INITIAL_CHECKS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={'ob-check-item' + (item.done ? ' done' : '')}
                    onClick={() => item.href && router.push(item.href)}
                    disabled={!item.href}
                  >
                    <div className="ob-ci-check">
                      {item.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div className="ob-ci-info">
                      <div className="ob-ci-title">{item.title}</div>
                      <div className="ob-ci-sub">{item.sub}</div>
                    </div>
                    {item.href && <div className="ob-ci-action">Go &rarr;</div>}
                  </button>
                ))}
              </div>

              <button type="button" className="ob-btn-primary" onClick={goToDashboard}>Go to my dashboard &rarr;</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
