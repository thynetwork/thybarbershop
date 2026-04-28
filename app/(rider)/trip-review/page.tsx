'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type StarRating = 0 | 1 | 2 | 3 | 4 | 5;

interface Definition {
  cls: string;
  label: string;
  placeholder: string;
}

const DEFINITIONS: Record<StarRating, Definition> = {
  5: { cls: 'def-5', label: '5 Stars — Awesome · Will & Would Be Back', placeholder: 'Tell John what made it above and beyond...' },
  4: { cls: 'def-4', label: '4 Stars — Excellent · Will Come Back', placeholder: 'What stood out? Would you recommend John to others?' },
  3: { cls: 'def-3', label: '3 Stars — Good · Okay But Not For Everyone', placeholder: 'What could John do better?' },
  2: { cls: 'def-2', label: '2 Stars — Average · Not What Was Expected', placeholder: 'What was different from what was quoted or shown?' },
  1: { cls: 'def-1', label: '1 Star — Poor · Unprofessional Conduct', placeholder: 'What happened? Please describe so we can follow up.' },
  0: { cls: 'def-0', label: '0 Stars — Dangerous · Safety Concern · Will Be Reviewed', placeholder: 'Please describe what you observed. This will be reviewed immediately.' },
};

const MEANINGS: { rating: StarRating; name: string; cls: string; desc: string }[] = [
  { rating: 5, name: 'Awesome', cls: 'c5', desc: 'Own soul and vibe · above and beyond · will and would be back' },
  { rating: 4, name: 'Excellent', cls: 'c4', desc: 'Great cut · no problems · will come back · recommend to others' },
  { rating: 3, name: 'Good', cls: 'c3', desc: 'Late or disorganized · minor issues · okay but not for everyone' },
  { rating: 2, name: 'Average', cls: 'c2', desc: 'Not what was quoted or shown · felt misled · would not return' },
  { rating: 1, name: 'Poor', cls: 'c1', desc: 'Heated argument · bad language · unprofessional · not child appropriate' },
  { rating: 0, name: 'Dangerous', cls: 'c0', desc: 'Safety concern · violence · threats · drug activity · hate speech' },
];

const EXAMPLES: { rating: StarRating; name: string; cls: string; items: string[] }[] = [
  { rating: 5, name: 'Awesome — 5 Stars', cls: 'c5', items: ['Exceeded all expectations', 'Distinct atmosphere and identity', 'Above and beyond the cut', 'Perfect execution', 'Will return without question', 'Would refer friends and family', 'No issues whatsoever'] },
  { rating: 4, name: 'Excellent — 4 Stars', cls: 'c4', items: ['Great cut', 'Will come back', 'Would recommend', 'Professional', 'No complaints', 'On time'] },
  { rating: 3, name: 'Good — 3 Stars', cls: 'c3', items: ['Ran late', 'Not very organized', 'Minor issues', 'Okay but not wow', 'Just not for me', 'Minor unprofessional moment'] },
  { rating: 2, name: 'Average — 2 Stars', cls: 'c2', items: ['Not what was quoted', 'Different from photos online', 'Felt misled', 'Stayed quiet about it', 'Would not return', 'False advertising'] },
  { rating: 1, name: 'Poor — 1 Star', cls: 'c1', items: ['Heated argument', 'Bad language used', 'Unprofessional conduct', 'Not child appropriate', 'Would not recommend', 'Beyond a disagreement'] },
  { rating: 0, name: 'Dangerous — 0 Stars', cls: 'c0', items: ['Drug use observed', 'Drug or gang activity', 'Violence or threats', 'Hate speech', 'Open racism', 'Safety concern — report required'] },
];

const client = { initials: 'RG', name: 'Rayford Gibson', clientId: 'RAYF·8834' };
const appt = { barberInitials: 'JM', barberName: 'John Merrick', firstName: 'John', service: 'Adult Haircut', dateTime: 'Thu Jul 17 · 11am · The Studio', amount: '$45' };

function commentLabelFor(r: StarRating): string {
  if (r >= 4) return 'Anything to add? (optional)';
  if (r >= 2) return 'What could be better? (optional)';
  return 'What happened? (required for this rating)';
}

function starGlyphsFor(r: StarRating): string {
  if (r === 0) return '0';
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

export default function EndAppointmentPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [selected, setSelected] = useState<StarRating | null>(null);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function submitRating() {
    showToast(`Check-in submitted — thank you, ${client.name.split(' ')[0]}`);
    setTimeout(() => router.push('/home'), 1500);
  }

  function skipRating() {
    router.push('/home');
  }

  const def = selected !== null ? DEFINITIONS[selected] : null;

  return (
    <>
      <style>{`
        .et-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .et-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .et-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .et-logo span{color:#F5A623;}
        .et-tb-right{display:flex;align-items:center;gap:.75rem;}
        .et-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .et-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .et-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .et-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .et-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .et-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .et-nav:hover{background:rgba(255,255,255,.05);}
        .et-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .et-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .et-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .et-nav.on .et-nav-label,.et-nav:hover .et-nav-label{color:#fff;}
        .et-nav.on .et-nav-label{font-weight:600;}
        .et-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .et-main{overflow-y:auto;padding:1.5rem;display:flex;gap:1.25rem;align-items:flex-start;background:#F7F7F8;}
        .et-left{flex:0 0 22rem;display:flex;flex-direction:column;gap:1.25rem;}
        .et-right{flex:1;min-width:0;}

        .et-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);}
        .et-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .et-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .et-barber-summary{display:flex;align-items:center;gap:.85rem;background:#0a0a2e;border-radius:1.25rem;padding:.85rem 1rem;margin-bottom:1.25rem;}
        .et-bs-avatar{width:2.6rem;height:2.6rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.78rem;flex-shrink:0;border:.15rem solid rgba(255,255,255,.15);}
        .et-bs-info{flex:1;text-align:left;}
        .et-bs-name{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#fff;}
        .et-bs-service{font-size:.65rem;color:rgba(255,255,255,.45);margin-top:.1rem;}
        .et-bs-amount{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#F5A623;}

        .et-checkin-q{font-family:'Syne',sans-serif;font-size:1.25rem;font-weight:800;color:#111118;margin-bottom:.15rem;}
        .et-checkin-sub{font-size:.72rem;color:#5A5A6A;line-height:1.5;margin-bottom:1.25rem;}

        .et-star-row{display:flex;justify-content:center;gap:.4rem;margin-bottom:.4rem;}
        .et-star{font-size:2.2rem;color:#d0d0dc;cursor:pointer;line-height:1;user-select:none;background:none;border:none;padding:0;font-family:inherit;}
        .et-star.lit{color:#F5A623;}
        .et-star:hover{transform:scale(1.12);}

        .et-zero-link{font-size:.68rem;color:#9A9AAA;cursor:pointer;margin-bottom:.85rem;text-align:center;text-decoration:underline;display:block;background:none;border:none;width:100%;font-family:inherit;}
        .et-zero-link:hover{color:#b42828;}

        .et-rating-def{border-radius:1rem;padding:.6rem .85rem;font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;text-align:center;margin-bottom:.85rem;}
        .et-rating-def.def-5,.et-rating-def.def-4{background:#EAF3DE;color:#3B6D11;}
        .et-rating-def.def-3{background:rgba(245,166,35,.08);color:#D4830A;}
        .et-rating-def.def-2{background:rgba(180,80,0,.07);color:#b45000;}
        .et-rating-def.def-1,.et-rating-def.def-0{background:rgba(180,40,40,.07);color:#b42828;}

        .et-comment-wrap{margin-bottom:1rem;text-align:left;}
        .et-comment-label{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.35rem;}
        .et-comment-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.78rem;color:#111118;resize:none;outline:none;line-height:1.5;}
        .et-comment-input:focus{border-color:#F5A623;}

        .et-btn-submit{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.85rem;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#F5A623;cursor:pointer;}
        .et-btn-submit:hover{background:#14145c;}
        .et-btn-skip{width:100%;border:none;background:none;font-size:.68rem;color:#9A9AAA;cursor:pointer;margin-top:.6rem;padding:.3rem;text-align:center;font-family:inherit;}
        .et-btn-skip:hover{color:#5A5A6A;}

        .et-disclaimer{background:#0a0a2e;border-radius:1.25rem;padding:1rem 1.25rem;display:flex;align-items:center;gap:.85rem;box-shadow:0 4px 16px rgba(0,0,0,.07);}
        .et-disclaimer-dot{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Syne',sans-serif;font-weight:800;font-size:.8rem;color:#0a0a2e;}
        .et-disclaimer-text{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.85);line-height:1.6;}
        .et-disclaimer-text strong{color:#F5A623;}

        .et-meaning-row{display:grid;grid-template-columns:3.5rem 5rem 1fr;gap:.4rem;align-items:baseline;padding:.4rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .et-meaning-row:last-child{border-bottom:none;}
        .et-mr-stars{font-size:.68rem;color:#F5A623;}
        .et-mr-zero{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#b42828;}
        .et-mr-name{font-size:.72rem;font-weight:800;}
        .et-mr-name.c5,.et-mr-name.c4{color:#3B6D11;}
        .et-mr-name.c3{color:#D4830A;}
        .et-mr-name.c2{color:#b45000;}
        .et-mr-name.c1,.et-mr-name.c0{color:#b42828;}
        .et-mr-desc{font-size:.62rem;color:#5A5A6A;line-height:1.4;}

        .et-sdr-row{padding:.85rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .et-sdr-row:last-child{border-bottom:none;}
        .et-sdr-header{display:flex;align-items:center;gap:.75rem;margin-bottom:.4rem;}
        .et-sdr-stars{font-size:.82rem;color:#F5A623;min-width:5rem;}
        .et-sdr-zero{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:800;color:#b42828;min-width:5rem;}
        .et-sdr-name{font-family:'Syne',sans-serif;font-size:.88rem;font-weight:800;}
        .et-sdr-name.c5,.et-sdr-name.c4{color:#3B6D11;}
        .et-sdr-name.c3{color:#D4830A;}
        .et-sdr-name.c2{color:#b45000;}
        .et-sdr-name.c1,.et-sdr-name.c0{color:#b42828;}
        .et-sdr-examples{display:flex;flex-wrap:wrap;gap:.3rem;}
        .et-sdr-ex{background:#F7F7F8;border:1px solid rgba(0,0,0,.09);border-radius:9999px;padding:.15rem .6rem;font-size:.62rem;color:#5A5A6A;}

        .et-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}

        @media(max-width:60rem){.et-main{flex-direction:column;}.et-left{flex:0 0 auto;width:100%;}}
      `}</style>

      <div className="et-shell">
        <nav className="et-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="et-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="et-tb-right">
            <div className="et-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="et-bell-badge"></div>
            </div>
            <div className="et-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="et-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>

          <div className="et-side-section">Booking</div>
          <Link href="/home" className="et-nav on">
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="et-nav-label">Home</span>
          </Link>
          <Link href="/find-a-barber" className="et-nav">
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <span className="et-nav-label">Find a {config.providerLabel}</span>
          </Link>
          <button type="button" className="et-nav" onClick={() => router.push('/notifications')}>
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="et-nav-label">Notifications</span>
          </button>

          <div className="et-side-section">Account</div>
          <Link href="/profile" className="et-nav">
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="et-nav-label">My Profile</span>
          </Link>
          <Link href="/history" className="et-nav">
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="et-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="et-nav">
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="et-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="et-nav">
            <span className="et-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="et-nav-label">Support</span>
          </Link>

          <div className="et-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="et-main">
          {/* LEFT */}
          <div className="et-left">
            <div className="et-card" style={{ textAlign: 'center' }}>
              <div className="et-card-title" style={{ textAlign: 'left' }}>Appointment Summary</div>

              <div className="et-barber-summary">
                <div className="et-bs-avatar">{appt.barberInitials}</div>
                <div className="et-bs-info">
                  <div className="et-bs-name">{appt.barberName}</div>
                  <div className="et-bs-service">{appt.service} &middot; {appt.dateTime}</div>
                </div>
                <div className="et-bs-amount">{appt.amount}</div>
              </div>

              <div className="et-checkin-q">How was your cut?</div>
              <div className="et-checkin-sub">Be honest &mdash; your feedback keeps the community strong.</div>

              <div className="et-star-row">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    type="button"
                    className={'et-star' + (selected !== null && selected >= i ? ' lit' : '')}
                    onClick={() => setSelected(i as StarRating)}
                  >★</button>
                ))}
              </div>
              <button type="button" className="et-zero-link" onClick={() => setSelected(0)}>Give 0 stars &mdash; safety concern</button>

              {def && (
                <div className={'et-rating-def ' + def.cls}>{def.label}</div>
              )}

              {selected !== null && (
                <>
                  <div className="et-comment-wrap">
                    <div className="et-comment-label">{commentLabelFor(selected)}</div>
                    <textarea
                      className="et-comment-input"
                      rows={3}
                      placeholder={def?.placeholder ?? ''}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <button type="button" className="et-btn-submit" onClick={submitRating}>Submit Check-in</button>
                </>
              )}
              <button type="button" className="et-btn-skip" onClick={skipRating}>Skip for now</button>
            </div>

            <div className="et-disclaimer">
              <div className="et-disclaimer-dot">*</div>
              <div className="et-disclaimer-text">
                Star ratings are updated on a <strong>weekly basis</strong>. All reviews are <strong>completely anonymous</strong>.
              </div>
            </div>

            <div className="et-card">
              <div className="et-card-title">What the Stars Mean</div>
              {MEANINGS.map(m => (
                <div key={m.rating} className="et-meaning-row">
                  <div className="et-mr-stars">
                    {m.rating === 0 ? <span className="et-mr-zero">0</span> : '★'.repeat(m.rating)}
                  </div>
                  <div className={'et-mr-name ' + m.cls}>{m.name}</div>
                  <div className="et-mr-desc">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="et-right">
            <div className="et-card">
              <div className="et-card-title">Rating Examples</div>
              {EXAMPLES.map(e => (
                <div key={e.rating} className="et-sdr-row">
                  <div className="et-sdr-header">
                    <div className={e.rating === 0 ? 'et-sdr-zero' : 'et-sdr-stars'}>
                      {starGlyphsFor(e.rating)}
                    </div>
                    <div className={'et-sdr-name ' + e.cls}>{e.name}</div>
                  </div>
                  <div className="et-sdr-examples">
                    {e.items.map(it => <span key={it} className="et-sdr-ex">{it}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="et-toast">{toast}</div>}
    </>
  );
}
