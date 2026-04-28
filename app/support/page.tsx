'use client';

import { useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';

interface Faq {
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    q: 'How do I change my Chair Rate with a barber?',
    a: 'Chair Rates are set together when you and your barber connect. To change it, either you or your barber can initiate a rate update from the client profile page. Both sides must confirm the new rate.',
  },
  {
    q: 'What happens if I miss an appointment?',
    a: "Each barber sets their own cancellation and no-show policy. The policy is shown to you on the How to Pay screen before you confirm. If you reschedule within the barber's forgiveness window, no charge applies.",
  },
  {
    q: 'How do I find a new barber?',
    a: 'Go to Find a Barber in the sidebar. Enter your zip code to browse verified barbers in your area. View their full profile, check their portfolio, and send a connection request.',
  },
  {
    q: 'Is my rating really anonymous?',
    a: 'Yes — completely. Your name and Client ID are never attached to a rating. Ratings are aggregated and updated weekly. The barber sees their overall score only, never who submitted what.',
  },
  {
    q: 'How do I report a safety concern?',
    a: 'Tap "Report a Safety Issue" above. Safety reports are reviewed within 24 hours. For immediate danger, contact local emergency services first. A 0-star rating also flags an account for review.',
  },
];

interface Ticket {
  id: string;
  subject: string;
  date: string;
  number: string;
  status: 'Open' | 'Resolved';
}

const TICKETS: Ticket[] = [
  { id: 't1', subject: 'Appointment not showing in history', date: 'Opened Jul 14', number: 'TBS-0442', status: 'Open' },
  { id: 't2', subject: 'Chair Rate disagreement with barber', date: 'Opened Jun 28', number: 'TBS-0391', status: 'Resolved' },
];

const TOPICS = [
  'Select a topic',
  'Booking issue',
  'Payment dispute',
  'Chair Rate disagreement',
  'Account access',
  'Barber conduct',
  'Safety concern',
  'Other',
];

const client = { initials: 'RG', name: 'Rayford Gibson', clientId: 'RAYF·8834' };

export default function SupportPage() {
  const { prefix, highlight } = splitServiceName();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function sendMessage() {
    showToast('Message sent — we will respond within 2 hours');
    setSubject('');
    setMessage('');
  }

  return (
    <>
      <style>{`
        .sp-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .sp-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .sp-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .sp-logo span{color:#F5A623;}
        .sp-tb-right{display:flex;align-items:center;gap:.75rem;}
        .sp-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .sp-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .sp-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .sp-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .sp-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .sp-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .sp-nav:hover{background:rgba(255,255,255,.05);}
        .sp-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .sp-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .sp-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .sp-nav.on .sp-nav-label,.sp-nav:hover .sp-nav-label{color:#fff;}
        .sp-nav.on .sp-nav-label{font-weight:600;}
        .sp-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .sp-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}
        .sp-page-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .sp-page-sub{font-size:.78rem;color:#5A5A6A;margin-bottom:1.5rem;}

        .sp-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start;}

        .sp-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .sp-card:last-child{margin-bottom:0;}
        .sp-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;gap:.4rem;}
        .sp-card-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .sp-contact-btn{width:100%;display:flex;align-items:center;gap:.85rem;padding:.85rem 1rem;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;background:#fff;cursor:pointer;margin-bottom:.5rem;text-align:left;font-family:inherit;}
        .sp-contact-btn:last-child{margin-bottom:0;}
        .sp-contact-btn:hover{border-color:#F5A623;background:rgba(245,166,35,.08);}
        .sp-contact-btn.emergency{border-color:rgba(180,40,40,.25);background:rgba(180,40,40,.03);}
        .sp-contact-btn.emergency:hover{border-color:#b42828;background:rgba(180,40,40,.07);}
        .sp-cb-icon{width:2.4rem;height:2.4rem;border-radius:.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .sp-cb-info{flex:1;}
        .sp-cb-label{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#111118;margin-bottom:.1rem;}
        .sp-contact-btn.emergency .sp-cb-label{color:#b42828;}
        .sp-cb-sub{font-size:.65rem;color:#9A9AAA;line-height:1.4;}
        .sp-cb-arrow{font-size:1.1rem;color:#9A9AAA;flex-shrink:0;}

        .sp-form-field{margin-bottom:.85rem;}
        .sp-form-field:last-of-type{margin-bottom:0;}
        .sp-form-label{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.35rem;display:block;}
        .sp-form-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.82rem;color:#111118;outline:none;}
        .sp-form-input:focus{border-color:#F5A623;}
        .sp-form-select{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.82rem;color:#111118;outline:none;background:#fff;cursor:pointer;}
        .sp-form-textarea{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.82rem;color:#111118;resize:none;outline:none;line-height:1.5;}
        .sp-form-textarea:focus{border-color:#F5A623;}
        .sp-btn-send{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.8rem;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#F5A623;cursor:pointer;margin-top:.85rem;}
        .sp-btn-send:hover{background:#14145c;}

        .sp-faq-item{border-bottom:1px solid rgba(0,0,0,.09);padding:.75rem 0;cursor:pointer;}
        .sp-faq-item:last-child{border-bottom:none;}
        .sp-faq-q{display:flex;justify-content:space-between;align-items:center;font-size:.82rem;font-weight:600;color:#111118;}
        .sp-faq-arrow{color:#9A9AAA;font-size:.85rem;transition:transform .2s;}
        .sp-faq-item.open .sp-faq-arrow{transform:rotate(90deg);}
        .sp-faq-a{font-size:.75rem;color:#5A5A6A;line-height:1.7;margin-top:.5rem;}

        .sp-ticket-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .sp-ticket-row:last-child{border-bottom:none;}
        .sp-tr-info{flex:1;}
        .sp-tr-subject{font-size:.82rem;font-weight:600;color:#111118;}
        .sp-tr-date{font-size:.65rem;color:#9A9AAA;margin-top:.1rem;}
        .sp-tr-status{display:inline-flex;border-radius:9999px;padding:.15rem .6rem;font-size:.6rem;font-weight:700;}
        .ts-open{background:rgba(245,166,35,.08);color:#D4830A;}
        .ts-resolved{background:#EAF3DE;color:#3B6D11;}

        .sp-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}

        @media(max-width:60rem){.sp-two-col{grid-template-columns:1fr;}}
      `}</style>

      <div className="sp-shell">
        <nav className="sp-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="sp-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="sp-tb-right">
            <div className="sp-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="sp-bell-badge"></div>
            </div>
            <div className="sp-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="sp-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>

          <div className="sp-side-section">Booking</div>
          <Link href="/home" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="sp-nav-label">Home</span>
          </Link>
          <Link href="/find-a-barber" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <span className="sp-nav-label">Find a {config.providerLabel}</span>
          </Link>
          <Link href="/notifications" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="sp-nav-label">Notifications</span>
          </Link>

          <div className="sp-side-section">Account</div>
          <Link href="/profile" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="sp-nav-label">My Profile</span>
          </Link>
          <Link href="/household" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
            <span className="sp-nav-label">Household</span>
          </Link>
          <Link href="/history" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="sp-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="sp-nav">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="sp-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="sp-nav on">
            <span className="sp-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="sp-nav-label">Support</span>
          </Link>

          <div className="sp-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="sp-main">
          <div className="sp-page-title">Support</div>
          <div className="sp-page-sub">How can we help you today?</div>

          <div className="sp-two-col">
            {/* LEFT */}
            <div>
              <div className="sp-card">
                <div className="sp-card-title">Contact Us</div>

                <button type="button" className="sp-contact-btn" onClick={() => showToast('Opening live chat...')}>
                  <div className="sp-cb-icon" style={{ background: 'rgba(245,166,35,.08)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div className="sp-cb-info">
                    <div className="sp-cb-label">Message Support</div>
                    <div className="sp-cb-sub">Typical response within 2 hours &middot; Mon&ndash;Sat</div>
                  </div>
                  <div className="sp-cb-arrow">&rsaquo;</div>
                </button>

                <button type="button" className="sp-contact-btn" onClick={() => showToast('Opening call scheduler...')}>
                  <div className="sp-cb-icon" style={{ background: '#EAF3DE' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div className="sp-cb-info">
                    <div className="sp-cb-label">Schedule a Call</div>
                    <div className="sp-cb-sub">Book a 15-min support call &middot; available Mon&ndash;Fri</div>
                  </div>
                  <div className="sp-cb-arrow">&rsaquo;</div>
                </button>

                <button type="button" className="sp-contact-btn emergency" onClick={() => showToast('Opening safety report form...')}>
                  <div className="sp-cb-icon" style={{ background: 'rgba(180,40,40,.08)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b42828" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div className="sp-cb-info">
                    <div className="sp-cb-label">Report a Safety Issue</div>
                    <div className="sp-cb-sub">Dangerous situation &middot; violence &middot; threats &middot; drug activity &middot; hate speech</div>
                  </div>
                  <div className="sp-cb-arrow">&rsaquo;</div>
                </button>
              </div>

              <div className="sp-card">
                <div className="sp-card-title">Your Tickets</div>
                {TICKETS.map(t => (
                  <div key={t.id} className="sp-ticket-row">
                    <div className="sp-tr-info">
                      <div className="sp-tr-subject">{t.subject}</div>
                      <div className="sp-tr-date">{t.date} &middot; Ticket #{t.number}</div>
                    </div>
                    <span className={'sp-tr-status ' + (t.status === 'Open' ? 'ts-open' : 'ts-resolved')}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="sp-card">
                <div className="sp-card-title">Send a Message</div>
                <div className="sp-form-field">
                  <label className="sp-form-label">Topic</label>
                  <select className="sp-form-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="sp-form-field">
                  <label className="sp-form-label">Subject</label>
                  <input
                    className="sp-form-input"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="sp-form-field">
                  <label className="sp-form-label">Message</label>
                  <textarea
                    className="sp-form-textarea"
                    rows={4}
                    placeholder="Describe your issue in detail. Include appointment dates, barber codes, or any relevant information..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="button" className="sp-btn-send" onClick={sendMessage}>Send Message</button>
              </div>

              <div className="sp-card">
                <div className="sp-card-title">Common Questions</div>
                {FAQS.map((f, i) => (
                  <div
                    key={i}
                    className={'sp-faq-item' + (openFaq === i ? ' open' : '')}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div className="sp-faq-q">
                      {f.q}
                      <span className="sp-faq-arrow">&rsaquo;</span>
                    </div>
                    {openFaq === i && <div className="sp-faq-a">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {toast && <div className="sp-toast">{toast}</div>}
    </>
  );
}
