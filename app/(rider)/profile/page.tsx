'use client';

import { useState } from 'react';
import { splitServiceName } from '@/lib/config';
import config from '@/lib/config';

/* ── Demo data ─────────────────────────────────────────────── */
const rider = {
  initials: 'SW',
  name: 'Sarah Williams',
  riderId: 'SARA\u00B78834',
  preferredName: 'Sarah',
  safetyComplete: true,
};

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function RiderProfilePage() {
  const { prefix, highlight } = splitServiceName();

  const [preferredName, setPreferredName] = useState(rider.preferredName);
  const [contact, setContact] = useState('text');
  const [serviceAnimal, setServiceAnimal] = useState(false);
  const [music, setMusic] = useState('none');
  const [conversation, setConversation] = useState('quiet');
  const [temperature, setTemperature] = useState('ac');
  const [accommodations, setAccommodations] = useState('Prefer morning appointments. Regular fade client.');
  const [travelFreq, setTravelFreq] = useState('weekly');
  const [travelDaysMode, setTravelDaysMode] = useState<'set' | 'varies'>('set');
  const [travelDays, setTravelDays] = useState([true, false, false, true, false, false, false]);
  const [depTerminal, setDepTerminal] = useState('Terminal C');
  const [arrTerminal, setArrTerminal] = useState('Terminal C');
  const [flightType, setFlightType] = useState('domestic');

  function toggleDay(i: number) {
    setTravelDays((prev) => prev.map((d, idx) => idx === i ? !d : d));
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-avatar">{rider.initials}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 580 }}>
        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content">
          {/* Banner */}
          <div className="profile-banner" style={{ margin: '-28px -32px 0', borderRadius: 0 }}>
            <div className="pb-av pb-av-amber">{rider.initials}</div>
          </div>
          <div style={{ paddingTop: 44, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 3 }}>{rider.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="rider-id" style={{ fontSize: 16 }}>{rider.riderId}</div>
              {rider.safetyComplete && <span className="badge badge-green">&#10003; Safety Protocol</span>}
            </div>
            <div className="t-small">Preferred name: {rider.preferredName}</div>
          </div>

          {/* Preferred name */}
          <div className="form-group">
            <label className="form-label">Preferred name</label>
            <input className="form-input" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
          </div>

          {/* Contact */}
          <div className="form-group">
            <label className="form-label">Best method of contact</label>
            <div className="radio-group">
              {[
                { value: 'call', label: 'Call' },
                { value: 'text', label: 'Text' },
                { value: 'either', label: 'Either' },
                { value: 'none', label: 'Do not contact \u2014 I will reach out' },
              ].map((opt) => (
                <div key={opt.value} className={`radio-opt ${contact === opt.value ? 'on' : ''}`} onClick={() => setContact(opt.value)}>
                  <div className="radio-dot">{contact === opt.value && <div className="radio-dot-inner" />}</div>
                  <div className="radio-label">{opt.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Service animal */}
          <div className="form-group">
            <label className="form-label">Service animal</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1.5px solid var(--border-mid)', borderRadius: 'var(--r-md)', padding: '11px 14px' }}>
              <input type="checkbox" checked={serviceAnimal} onChange={(e) => setServiceAnimal(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--navy)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-1)' }}>I travel with a service animal</span>
            </div>
          </div>

          {/* Ride preferences */}
          <div className="t-label" style={{ marginBottom: 8 }}>Ride preferences</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <div className="t-label" style={{ marginBottom: 6 }}>Music</div>
              <div className="seg-control">
                <button className={`seg-opt ${music === 'none' ? 'on' : ''}`} onClick={() => setMusic('none')}>No music</button>
                <button className={`seg-opt ${music === 'low' ? 'on' : ''}`} onClick={() => setMusic('low')}>Low volume</button>
                <button className={`seg-opt ${music === 'any' ? 'on' : ''}`} onClick={() => setMusic('any')}>No preference</button>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div className="t-label" style={{ marginBottom: 6 }}>Conversation</div>
              <div className="seg-control">
                <button className={`seg-opt ${conversation === 'quiet' ? 'on' : ''}`} onClick={() => setConversation('quiet')}>Quiet &mdash; working</button>
                <button className={`seg-opt ${conversation === 'chat' ? 'on' : ''}`} onClick={() => setConversation('chat')}>Happy to chat</button>
                <button className={`seg-opt ${conversation === 'any' ? 'on' : ''}`} onClick={() => setConversation('any')}>No preference</button>
              </div>
            </div>
            <div>
              <div className="t-label" style={{ marginBottom: 6 }}>Temperature</div>
              <div className="seg-control">
                <button className={`seg-opt ${temperature === 'ac' ? 'on' : ''}`} onClick={() => setTemperature('ac')}>AC preferred</button>
                <button className={`seg-opt ${temperature === 'noac' ? 'on' : ''}`} onClick={() => setTemperature('noac')}>No AC</button>
                <button className={`seg-opt ${temperature === 'any' ? 'on' : ''}`} onClick={() => setTemperature('any')}>No preference</button>
              </div>
            </div>
          </div>

          {/* Accommodations */}
          <div className="form-group">
            <label className="form-label">
              Additional accommodations <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              className="form-input"
              rows={3}
              maxLength={300}
              value={accommodations}
              onChange={(e) => setAccommodations(e.target.value.slice(0, 300))}
              style={{ resize: 'none' }}
            />
            <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right', marginTop: 3 }}>{accommodations.length}/300 characters</div>
          </div>
        </div>

        {/* ── Right panel ───────────────────────────────────── */}
        <div className="right-panel">
          {/* Travel pattern */}
          <div className="t-label" style={{ marginBottom: 8 }}>Travel pattern</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div className="t-label" style={{ marginBottom: 6 }}>How often</div>
            <div className="radio-group" style={{ marginBottom: 12 }}>
              {['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'As needed'].map((opt) => (
                <div key={opt} className={`radio-opt ${travelFreq === opt.toLowerCase().replace(/-/g, '') ? 'on' : ''}`} onClick={() => setTravelFreq(opt.toLowerCase().replace(/-/g, ''))}>
                  <div className="radio-dot">{travelFreq === opt.toLowerCase().replace(/-/g, '') && <div className="radio-dot-inner" />}</div>
                  <div className="radio-label">{opt}</div>
                </div>
              ))}
            </div>

            <div className="t-label" style={{ marginBottom: 6 }}>Travel days</div>
            <div className={`radio-opt ${travelDaysMode === 'set' ? 'on' : ''}`} style={{ marginBottom: 8 }} onClick={() => setTravelDaysMode('set')}>
              <div className="radio-dot">{travelDaysMode === 'set' && <div className="radio-dot-inner" />}</div>
              <div className="radio-label">Set days</div>
            </div>
            {travelDaysMode === 'set' && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                {DAYS.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => toggleDay(i)}
                    style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: travelDays[i] ? 'var(--navy)' : 'var(--surface)',
                      color: travelDays[i] ? 'var(--amber)' : 'var(--text-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, cursor: 'pointer',
                    }}
                  >{d}</div>
                ))}
              </div>
            )}
            <div className={`radio-opt ${travelDaysMode === 'varies' ? 'on' : ''}`} onClick={() => setTravelDaysMode('varies')}>
              <div className="radio-dot">{travelDaysMode === 'varies' && <div className="radio-dot-inner" />}</div>
              <div className="radio-label">No set days &mdash; varies</div>
            </div>
          </div>

          {/* Default terminal */}
          <div className="t-label" style={{ marginBottom: 8 }}>Default terminal</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label className="form-label">Departure terminal</label>
              <input className="form-input" value={depTerminal} onChange={(e) => setDepTerminal(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label className="form-label">Arrival terminal</label>
              <input className="form-input" value={arrTerminal} onChange={(e) => setArrTerminal(e.target.value)} />
            </div>
            <div className="t-label" style={{ marginBottom: 6 }}>Flight type</div>
            <div className="seg-control">
              <button className={`seg-opt ${flightType === 'domestic' ? 'on' : ''}`} onClick={() => setFlightType('domestic')}>Domestic</button>
              <button className={`seg-opt ${flightType === 'international' ? 'on' : ''}`} onClick={() => setFlightType('international')}>International</button>
              <button className={`seg-opt ${flightType === 'both' ? 'on' : ''}`} onClick={() => setFlightType('both')}>Both</button>
            </div>
          </div>

          {/* My drivers */}
          <div className="t-label" style={{ marginBottom: 8 }}>My drivers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--navy)', borderRadius: 10, padding: '10px 12px' }}>
              <div className="avatar av-amber av-sm">MR</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Marcus R.</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>South Houston &middot; MRC&middot;3341</div>
              </div>
              <span className="badge badge-green" style={{ fontSize: 9 }}>&#10003; Connected</span>
            </div>
          </div>

          <button className="btn btn-primary btn-full" style={{ marginTop: 16 }}>Save changes</button>
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
