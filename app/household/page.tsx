'use client';

import { useState } from 'react';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';
import { ACCOUNT_PLAN } from '@/lib/account';

type Relation = 'Spouse' | 'Son' | 'Daughter' | 'Parent' | 'Sibling' | 'Other family';

interface Member {
  id: string;
  initials: string;
  name: string;
  clientId: string;
  lastVisit: string;
  bg: string;
  fg: string;
  primary?: boolean;
}

const MAX_SLOTS = 5;

const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', initials: 'RG', name: 'Rayford Gibson', clientId: 'RAYF·8834', lastVisit: 'Last visit: Jul 10', bg: '#F5A623', fg: '#0a0a2e', primary: true },
  { id: 'm2', initials: 'MG', name: 'Margaret Gibson', clientId: 'MARG·4421', lastVisit: 'Last visit: Jun 28', bg: '#6b3fc8', fg: '#fff' },
  { id: 'm3', initials: 'DR', name: 'Darius Gibson', clientId: 'DRAY·5501', lastVisit: 'Last visit: Jul 5', bg: '#1565c0', fg: '#fff' },
  { id: 'm4', initials: 'KG', name: 'Kevin Gibson', clientId: 'KRAY·6612', lastVisit: 'Last visit: Jun 20', bg: '#2e7d32', fg: '#fff' },
  { id: 'm5', initials: 'SG', name: 'Shayla Gibson', clientId: 'SLEY·7723', lastVisit: 'No visits yet', bg: '#a0522d', fg: '#fff' },
];

const RELATIONS: Relation[] = ['Spouse', 'Son', 'Daughter', 'Parent', 'Sibling', 'Other family'];

const client = INITIAL_MEMBERS[0];

export default function HouseholdPage() {
  const { prefix, highlight } = splitServiceName();

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [activeId, setActiveId] = useState<string>('m1');
  const [toast, setToast] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [relation, setRelation] = useState<Relation>('Spouse');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function switchMember(m: Member) {
    setActiveId(m.id);
    showToast('Switched to ' + m.name + ' · ' + m.clientId);
  }

  function editMember(name: string) {
    showToast('Edit profile for ' + name);
  }

  function removeMember(m: Member) {
    if (m.primary) return;
    const ok = confirm('Remove ' + m.name + ' from the household? They will need to pay $9.99 to continue using ' + config.serviceName + '.');
    if (!ok) return;
    setMembers(prev => prev.filter(x => x.id !== m.id));
    showToast(m.name + ' removed from household');
  }

  function openAddMember() {
    if (members.length >= MAX_SLOTS) return;
    setNewName('');
    setNewEmail('');
    setRelation('Spouse');
    setModalOpen(true);
  }

  function submitAddMember() {
    setModalOpen(false);
    showToast('Invitation sent · they will receive an email to join');
  }

  const slotsUsed = members.length;
  const slotsRemaining = MAX_SLOTS - slotsUsed;

  return (
    <>
      <style>{`
        .hh-shell{display:grid;grid-template-columns:13.75rem 1fr;grid-template-rows:3.25rem 1fr auto;min-height:100vh;}
        .hh-topbar{grid-column:1/-1;background:#0a0a2e;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:10;}
        .hh-logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;}
        .hh-logo span{color:#F5A623;}
        .hh-tb-right{display:flex;align-items:center;gap:.75rem;}
        .hh-bell{position:relative;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .hh-bell-badge{position:absolute;top:.1rem;right:.1rem;width:.75rem;height:.75rem;background:#e53e3e;border-radius:50%;border:.125rem solid #0a0a2e;}
        .hh-tb-avatar{width:2rem;height:2rem;border-radius:50%;background:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:#0a0a2e;}

        .hh-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:1.5rem 0;overflow-y:auto;display:flex;flex-direction:column;}
        .sidebar-identity{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.5rem;}
        .si-avatar{width:3.75rem;height:3.75rem;border-radius:50%;background:#F5A623;color:#0a0a2e;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;border:0.2rem solid rgba(255,255,255,0.15);margin-bottom:0.6rem;box-shadow:0 0.25rem 0.75rem rgba(0,0,0,0.3);}
        .si-name{font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:800;color:#fff;margin-bottom:0.2rem;}
        .si-id{font-family:'DM Mono',monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);}
        .hh-side-section{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:0 1.25rem;margin-bottom:.5rem;margin-top:1rem;}
        .hh-nav{display:flex;align-items:center;gap:.7rem;padding:.65rem 1.25rem;cursor:pointer;border:none;background:none;width:100%;text-align:left;border-left:.1875rem solid transparent;text-decoration:none;}
        .hh-nav:hover{background:rgba(255,255,255,.05);}
        .hh-nav.on{background:rgba(245,166,35,.08);border-left-color:#F5A623;}
        .hh-nav-icon{font-size:1rem;width:1.2rem;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .hh-nav-label{font-size:.78rem;font-weight:500;color:rgba(255,255,255,.5);}
        .hh-nav.on .hh-nav-label,.hh-nav:hover .hh-nav-label{color:#fff;}
        .hh-nav.on .hh-nav-label{font-weight:600;}
        .hh-side-foot{margin-top:auto;padding:1rem 1.25rem 0;border-top:1px solid rgba(255,255,255,.06);font-size:.6rem;color:rgba(255,255,255,.2);line-height:1.6;}

        .hh-main{overflow-y:auto;padding:1.5rem;background:#F7F7F8;}

        .hh-plan{background:linear-gradient(135deg,#1a1a6e,#0a0a2e);border-radius:1.25rem;padding:1.25rem 1.5rem;margin-bottom:1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;box-shadow:0 .5rem 2rem rgba(0,0,0,.12);}
        .hh-pc-label{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.25rem;}
        .hh-pc-plan{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;margin-bottom:.15rem;}
        .hh-pc-detail{font-size:.72rem;color:rgba(255,255,255,.5);}
        .hh-pc-right{text-align:right;flex-shrink:0;}
        .hh-pc-price{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#F5A623;}
        .hh-pc-renewal{font-size:.65rem;color:rgba(255,255,255,.35);margin-top:.15rem;}
        .hh-pc-badge{background:#3B6D11;color:#fff;border-radius:9999px;padding:.2rem .7rem;font-size:.65rem;font-weight:700;margin-top:.4rem;display:inline-block;}

        .hh-card{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.07);margin-bottom:1.25rem;}
        .hh-card-title{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.85rem;display:flex;align-items:center;justify-content:space-between;}
        .hh-card-title-inner{display:flex;align-items:center;gap:.4rem;flex:1;}
        .hh-card-title-inner::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.09);}

        .hh-member-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:.85rem;}
        .hh-member-tile{border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.1rem;text-align:center;cursor:pointer;background:#fff;position:relative;font-family:inherit;}
        .hh-member-tile:hover{border-color:rgba(245,166,35,.25);box-shadow:0 4px 16px rgba(0,0,0,.07);}
        .hh-member-tile.active-member{border-color:#F5A623;background:rgba(245,166,35,.08);}
        .hh-member-tile.primary-tile{border-color:#0a0a2e;}

        .hh-mt-avatar{width:3.5rem;height:3.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.95rem;margin:0 auto .6rem;border:.18rem solid rgba(0,0,0,.08);}
        .hh-mt-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#111118;margin-bottom:.15rem;}
        .hh-mt-id{font-family:'DM Mono',monospace;font-size:.62rem;color:#9A9AAA;margin-bottom:.4rem;}
        .hh-mt-last{font-size:.62rem;color:#5A5A6A;}
        .hh-mt-badge{position:absolute;top:.5rem;right:.5rem;background:#0a0a2e;color:#F5A623;border-radius:9999px;padding:.1rem .45rem;font-size:.55rem;font-weight:800;}
        .hh-mt-active-badge{position:absolute;top:.5rem;left:.5rem;background:#F5A623;color:#0a0a2e;border-radius:9999px;padding:.1rem .45rem;font-size:.55rem;font-weight:800;}

        .hh-mt-actions{display:flex;gap:.35rem;margin-top:.6rem;justify-content:center;}
        .hh-mt-action-btn{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.18rem .6rem;font-size:.6rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .hh-mt-action-btn:hover{border-color:#F5A623;color:#D4830A;}
        .hh-mt-action-btn.danger{border-color:rgba(180,40,40,.2);color:#b42828;}
        .hh-mt-action-btn.danger:hover{background:rgba(180,40,40,.05);}

        .hh-add-tile{border:2px dashed rgba(0,0,0,.09);border-radius:1.25rem;padding:1.1rem;text-align:center;cursor:pointer;background:#F7F7F8;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:10rem;font-family:inherit;}
        .hh-add-tile:hover{border-color:#F5A623;background:rgba(245,166,35,.08);}
        .hh-amt-icon{width:3rem;height:3rem;border-radius:50%;background:rgba(0,0,0,.09);display:flex;align-items:center;justify-content:center;margin:0 auto .6rem;font-size:1.4rem;color:#9A9AAA;}
        .hh-add-tile:hover .hh-amt-icon{background:rgba(245,166,35,.08);color:#D4830A;}
        .hh-amt-label{font-size:.78rem;font-weight:600;color:#9A9AAA;}
        .hh-add-tile:hover .hh-amt-label{color:#D4830A;}

        .hh-full-tile{border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.1rem;text-align:center;background:#F7F7F8;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:10rem;opacity:.5;}
        .hh-full-title{font-size:.72rem;font-weight:600;color:#9A9AAA;}
        .hh-full-sub{font-size:.65rem;color:#9A9AAA;margin-top:.25rem;}

        .hh-elig{background:rgba(10,10,46,.04);border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.85rem 1rem;display:flex;align-items:flex-start;gap:.75rem;}
        .hh-elig-icon{flex-shrink:0;margin-top:.1rem;}
        .hh-elig-text{font-size:.72rem;color:#5A5A6A;line-height:1.7;}
        .hh-elig-text strong{color:#111118;}

        .hh-billing-row{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .hh-billing-row:last-of-type{border-bottom:none;}
        .hh-br-key{font-size:.72rem;color:#9A9AAA;font-weight:600;}
        .hh-br-val{font-size:.82rem;font-weight:600;color:#111118;}
        .hh-br-val.green{color:#3B6D11;}
        .hh-billing-note{font-size:.68rem;color:#9A9AAA;margin-top:.75rem;line-height:1.6;padding:.75rem;background:#F7F7F8;border-radius:.75rem;}

        .hh-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;}
        .hh-modal{background:#fff;border-radius:1.25rem;padding:1.5rem;width:100%;max-width:22rem;box-shadow:0 .5rem 2rem rgba(0,0,0,.12);}
        .hh-modal-title{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .hh-modal-sub{font-size:.72rem;color:#5A5A6A;margin-bottom:1.25rem;line-height:1.5;}
        .hh-modal-field{margin-bottom:.85rem;}
        .hh-modal-label{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9A9AAA;margin-bottom:.35rem;display:block;}
        .hh-modal-input{width:100%;border:1.5px solid rgba(0,0,0,.09);border-radius:.75rem;padding:.65rem .85rem;font-family:'DM Sans',sans-serif;font-size:.85rem;color:#111118;outline:none;}
        .hh-modal-input:focus{border-color:#F5A623;}
        .hh-modal-relation{display:flex;flex-wrap:wrap;gap:.35rem;}
        .hh-rel-opt{border:1.5px solid rgba(0,0,0,.09);border-radius:9999px;padding:.25rem .75rem;font-size:.7rem;font-weight:600;cursor:pointer;background:#fff;color:#5A5A6A;font-family:inherit;}
        .hh-rel-opt.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}
        .hh-modal-actions{display:flex;gap:.75rem;margin-top:1.25rem;}
        .hh-modal-btn-primary{flex:1;background:#0a0a2e;border:none;border-radius:1rem;padding:.75rem;font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#F5A623;cursor:pointer;}
        .hh-modal-btn-secondary{flex:1;background:none;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.75rem;font-size:.78rem;font-weight:600;color:#5A5A6A;cursor:pointer;font-family:inherit;}

        .hh-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.6rem 1.2rem;border-radius:2rem;font-size:.75rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}

        @media(max-width:60rem){.hh-member-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:40rem){.hh-member-grid{grid-template-columns:1fr;}.hh-plan{flex-direction:column;align-items:flex-start;}.hh-pc-right{text-align:left;}}
      `}</style>

      <div className="hh-shell">
        <nav className="hh-topbar">
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="hh-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="hh-tb-right">
            <div className="hh-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="hh-bell-badge"></div>
            </div>
            <div className="hh-tb-avatar">{client.initials}</div>
          </div>
        </nav>

        <aside className="hh-sidebar">
          <div className="sidebar-identity">
            <div className="si-avatar">{client.initials}</div>
            <div className="si-name">{client.name}</div>
            <div className="si-id">{client.clientId}</div>
          </div>

          <div className="hh-side-section">Booking</div>
          <Link href="/home" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
            <span className="hh-nav-label">Home</span>
          </Link>
          <Link href="/find-a-barber" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <span className="hh-nav-label">Find a {config.providerLabel}</span>
          </Link>
          <Link href="/notifications" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
            <span className="hh-nav-label">Notifications</span>
          </Link>

          <div className="hh-side-section">Account</div>
          <Link href="/profile" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="hh-nav-label">My Profile</span>
          </Link>
          {ACCOUNT_PLAN === 'household' && (
            <Link href="/household" className="hh-nav on">
              <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
              <span className="hh-nav-label">Household</span>
            </Link>
          )}
          <Link href="/history" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
            <span className="hh-nav-label">Appointment History</span>
          </Link>
          <Link href="/client-settings" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg></span>
            <span className="hh-nav-label">Settings</span>
          </Link>
          <Link href="/support" className="hh-nav">
            <span className="hh-nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span className="hh-nav-label">Support</span>
          </Link>

          <div className="hh-side-foot">&copy; {config.copyrightYear} {config.companyName}</div>
        </aside>

        <main className="hh-main">
          <div className="hh-plan">
            <div>
              <div className="hh-pc-label">Current Plan</div>
              <div className="hh-pc-plan">Household Pass</div>
              <div className="hh-pc-detail">Up to 5 members &middot; All {config.companyName.replace(' Inc.', '')} platforms</div>
              <div className="hh-pc-badge">Active</div>
            </div>
            <div className="hh-pc-right">
              <div className="hh-pc-price">$19.99</div>
              <div className="hh-pc-renewal">per year</div>
              <div className="hh-pc-renewal">Renews Jul 3, 2027</div>
            </div>
          </div>

          <div className="hh-card">
            <div className="hh-card-title">
              <div className="hh-card-title-inner">
                Family Members
                <span style={{ fontSize: '.6rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A9AAA' }}>&middot; {slotsUsed} of {MAX_SLOTS} slots used</span>
              </div>
            </div>

            <div className="hh-member-grid">
              {members.map(m => {
                const cls = (m.primary ? ' primary-tile' : '') + (activeId === m.id ? ' active-member' : '');
                return (
                  <button key={m.id} type="button" className={'hh-member-tile' + cls} onClick={() => switchMember(m)}>
                    {m.primary && <div className="hh-mt-badge">Primary</div>}
                    {activeId === m.id && <div className="hh-mt-active-badge">Active</div>}
                    <div className="hh-mt-avatar" style={{ background: m.bg, color: m.fg }}>{m.initials}</div>
                    <div className="hh-mt-name">{m.name}</div>
                    <div className="hh-mt-id">{m.clientId}</div>
                    <div className="hh-mt-last">{m.lastVisit}</div>
                    <div className="hh-mt-actions">
                      <button type="button" className="hh-mt-action-btn" onClick={(e) => { e.stopPropagation(); editMember(m.name); }}>Edit</button>
                      {!m.primary && (
                        <button type="button" className="hh-mt-action-btn danger" onClick={(e) => { e.stopPropagation(); removeMember(m); }}>Remove</button>
                      )}
                    </div>
                  </button>
                );
              })}

              {slotsRemaining === 0 ? (
                <div className="hh-full-tile">
                  <div className="hh-full-title">{MAX_SLOTS}/{MAX_SLOTS} slots filled</div>
                  <div className="hh-full-sub">Remove a member to add another</div>
                </div>
              ) : (
                <button type="button" className="hh-add-tile" onClick={openAddMember}>
                  <div className="hh-amt-icon">+</div>
                  <div className="hh-amt-label">Add Family Member</div>
                </button>
              )}
            </div>

            <div className="hh-elig">
              <div className="hh-elig-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9AAA" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="hh-elig-text">
                <strong>Family members only.</strong> Household Pass is for same-household or biological family members. Adding non-family members is a violation and will result in permanent account ban with no refund. The primary account holder is responsible for all activity on this account.
              </div>
            </div>
          </div>

          <div className="hh-card">
            <div className="hh-card-title">
              <div className="hh-card-title-inner">Billing</div>
            </div>
            <div className="hh-billing-row">
              <div className="hh-br-key">Plan</div>
              <div className="hh-br-val">Household Pass &middot; $19.99/year</div>
            </div>
            <div className="hh-billing-row">
              <div className="hh-br-key">Status</div>
              <div className="hh-br-val green">Active</div>
            </div>
            <div className="hh-billing-row">
              <div className="hh-br-key">Next renewal</div>
              <div className="hh-br-val">July 3, 2027</div>
            </div>
            <div className="hh-billing-row">
              <div className="hh-br-key">Payment method</div>
              <div className="hh-br-val">Visa ····4242</div>
            </div>
            <div className="hh-billing-row">
              <div className="hh-br-key">Members</div>
              <div className="hh-br-val">{slotsUsed} of {MAX_SLOTS}</div>
            </div>
            <div className="hh-billing-note">
              If a member leaves or is removed they must pay their own $9.99 non-refundable fee to continue using {config.serviceName}. No partial refunds are issued. Invite codes from barbers do not waive this fee for former household members.
            </div>
          </div>
        </main>

        <footer className="site-footer" style={{ gridColumn: '1 / -1' }}>
          &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
        </footer>
      </div>

      {modalOpen && (
        <div className="hh-modal-overlay">
          <div className="hh-modal">
            <div className="hh-modal-title">Add Family Member</div>
            <div className="hh-modal-sub">Same household or biological family only. Adding non-family members will result in a permanent account ban.</div>
            <div className="hh-modal-field">
              <label className="hh-modal-label">Full Name</label>
              <input className="hh-modal-input" placeholder="First and last name" value={newName} onChange={(e) => setNewName(e.target.value)}/>
            </div>
            <div className="hh-modal-field">
              <label className="hh-modal-label">Relationship</label>
              <div className="hh-modal-relation">
                {RELATIONS.map(r => (
                  <button
                    key={r}
                    type="button"
                    className={'hh-rel-opt' + (relation === r ? ' on' : '')}
                    onClick={() => setRelation(r)}
                  >{r}</button>
                ))}
              </div>
            </div>
            <div className="hh-modal-field">
              <label className="hh-modal-label">Their Email</label>
              <input className="hh-modal-input" type="email" placeholder="Their email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
            </div>
            <div className="hh-modal-actions">
              <button type="button" className="hh-modal-btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="button" className="hh-modal-btn-primary" onClick={submitAddMember}>Add Member</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="hh-toast">{toast}</div>}
    </>
  );
}
