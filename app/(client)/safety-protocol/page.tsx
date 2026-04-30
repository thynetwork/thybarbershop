'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'New Client', initials: 'NC' };

const WHY_CARDS = [
  {
    icon: '\uD83D\uDD12',
    title: 'Encrypted & private',
    text: `Your information is stored encrypted. Neither your ${config.providerLabel.toLowerCase()} nor other ${config.clientLabel.toLowerCase()}s can see your raw data \u2014 only verification checkmarks.`,
  },
  {
    icon: '\uD83D\uDEA8',
    title: 'Emergency use only',
    text: `Your emergency contact is only accessed if there is an incident during a trip. ${config.serviceName} admin can view credentials in a dispute.`,
  },
  {
    icon: '\u2705',
    title: 'One time only',
    text: `You complete this once. It applies to all future bookings with all your ${config.providerLabel.toLowerCase()}s on ${config.serviceName}.`,
  },
  {
    icon: '\uD83E\uDD1D',
    title: 'Mutual protection',
    text: `Your ${config.providerLabel.toLowerCase()} has completed their own Safety Protocol \u2014 DL digits, insurance, and emergency contact on file.`,
  },
];

type IDType = 'dl' | 'stateid' | 'passport';

export default function SafetyProtocolPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [legalName, setLegalName] = useState('');
  const [dob, setDob] = useState('');
  const [idType, setIdType] = useState<IDType>('dl');
  const [idLast4, setIdLast4] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [barberNote, setBarberNote] = useState('');

  function handleSubmit() {
    router.push('/book/confirmed');
  }

  return (
    <div className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-name">{demoUser.name}</div>
          <div className="topbar-avatar">{demoUser.initials}</div>
        </div>
      </div>

      <div className="layout-2col">
        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content">
          {/* Navy header card */}
          <div className="card-navy mb-20" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>&#128737;</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--white)', marginBottom: 6 }}>
              One last step before your first ride
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Takes 2 minutes. Your information is encrypted and only accessed by {config.serviceName} in an emergency or dispute. You complete this once &mdash; it applies to all future rides with all your {config.providerLabel.toLowerCase()}s.
            </div>
          </div>

          {/* Profile photo upload */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div className="upload-circle" style={{ width: 100, height: 100 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>&#128247;</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Add your photo</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
              Your photo appears on the {config.providerLabel.toLowerCase()}&apos;s booking confirmation
            </div>
          </div>

          {/* Form fields */}
          <div className="form-row mb-0">
            <div className="form-group">
              <label className="form-label">Full legal name</label>
              <input
                className="form-input"
                placeholder="Sarah A. Chen"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of birth</label>
              <input
                className="form-input"
                placeholder="MM / DD / YYYY"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          {/* Government ID */}
          <div className="form-group">
            <label className="form-label">Government ID &mdash; last 4 digits</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="seg-control" style={{ flex: '0 0 auto', width: 280 }}>
                <button
                  className={`seg-opt ${idType === 'dl' ? 'on' : ''}`}
                  onClick={() => setIdType('dl')}
                >
                  Driver&apos;s License
                </button>
                <button
                  className={`seg-opt ${idType === 'stateid' ? 'on' : ''}`}
                  onClick={() => setIdType('stateid')}
                >
                  State ID
                </button>
                <button
                  className={`seg-opt ${idType === 'passport' ? 'on' : ''}`}
                  onClick={() => setIdType('passport')}
                >
                  Passport
                </button>
              </div>
              <input
                className="form-input"
                placeholder="Last 4"
                value={idLast4}
                onChange={(e) => setIdLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '0.15em', maxWidth: 100 }}
              />
            </div>
          </div>

          {/* Emergency contact */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Emergency contact name</label>
              <input
                className="form-input"
                placeholder="Full name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency contact phone</label>
              <input
                className="form-input"
                placeholder="(713) 555-0000"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Home address */}
          <div className="form-group">
            <label className="form-label">Home address (default pickup)</label>
            <input
              className="form-input"
              placeholder="123 Main St, Houston TX"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
            />
          </div>

          {/* Barber note */}
          <div className="form-group">
            <label className="form-label">
              Note for {config.providerLabel.toLowerCase()} (optional)
            </label>
            <input
              className="form-input"
              placeholder={`Luggage, mobility needs, gate codes, anything your ${config.providerLabel.toLowerCase()} should know`}
              value={barberNote}
              onChange={(e) => setBarberNote(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={handleSubmit}
          >
            Complete Safety Protocol &rarr;
          </button>
        </div>

        {/* ── Right panel: Why we ask ───────────────────────── */}
        <div className="right-panel">
          <div className="t-label mb-12">Why we ask</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {WHY_CARDS.map((card) => (
              <div key={card.title} className="card-surface">
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>
                  {card.icon} {card.title}
                </div>
                <div className="t-small">{card.text}</div>
              </div>
            ))}
          </div>
          <hr className="divider" />
          <div className="card-green">
            <div style={{ fontSize: 12, color: 'var(--green)', lineHeight: 1.6 }}>
              Your barber has been notified that you connected. Once you complete Safety Protocol your client home screen unlocks and you can book your first ride.
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
