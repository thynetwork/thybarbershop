'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { splitServiceName } from '@/lib/config';
import config from '@/lib/config';
import DriverSidebar from '@/components/DriverSidebar';

export default function DriverProfileEditPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  const [yearsLicensed, setYearsLicensed] = useState('30+');
  const [accidents10, setAccidents10] = useState('none');
  const [accidents5, setAccidents5] = useState('none');
  const [aboutMe, setAboutMe] = useState('Military veteran and family man. Been driving professionally for 35 years. I treat every passenger like family. Your safety and comfort is always my priority.');
  const [interests, setInterests] = useState('');

  const yearsBadge = yearsLicensed === '30+' ? '30+ Years Licensed' : `${yearsLicensed} Years Licensed`;
  const accidentBadge = accidents10 === 'none' ? '10 Year Accident Free' : accidents5 === 'none' ? '5 Year Accident Free' : null;

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="driver-code">
            <div className="dc-airport">IAH</div>
            <div className="dc-initials">JDR</div>
            <div className="dc-digits">4207</div>
          </div>
          <div className="topbar-avatar">JR</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', minHeight: 580 }}>
        <DriverSidebar activeItem="Profile" />

        <div className="main-content">
          <div className="card-amber" style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--amber-dim)', marginBottom: 4 }}>Complete your profile</div>
            <div style={{ fontSize: 12, color: 'var(--amber-dim)', lineHeight: 1.5 }}>Help riders get to know you before their first ride. This information appears at the bottom of your public profile. All fields are optional.</div>
          </div>

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Driver Profile</div>
          <div className="t-small" style={{ marginBottom: 20 }}>{config.domain}/edit-profile &middot; Editable anytime</div>
          <hr className="divider" />

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Tell riders about yourself</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.5 }}>This appears at the bottom of your public profile. All fields are optional but help riders choose you with confidence.</div>

          {/* Driving record */}
          <div className="form-group">
            <label className="form-label">Driving Record &middot; Self-reported</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
              <div>
                <div className="t-label" style={{ marginBottom: 6 }}>Years licensed in the US</div>
                <div className="radio-group">
                  {['1-5', '6-10', '11-20', '21-30', '30+'].map((val) => (
                    <div key={val} className={`radio-opt ${yearsLicensed === val ? 'on' : ''}`} onClick={() => setYearsLicensed(val)}>
                      <div className="radio-dot">{yearsLicensed === val && <div className="radio-dot-inner" />}</div>
                      <div className="radio-label">{val} years</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="t-label" style={{ marginBottom: 6 }}>Accidents in last 10 years</div>
                <div className="radio-group" style={{ marginBottom: 8 }}>
                  {[{ v: 'none', l: 'None' }, { v: '1-2', l: '1\u20132' }, { v: '3+', l: '3 or more' }, { v: 'prefer-not', l: 'Prefer not to say' }].map((o) => (
                    <div key={o.v} className={`radio-opt ${accidents10 === o.v ? 'on' : ''}`} onClick={() => setAccidents10(o.v)}>
                      <div className="radio-dot">{accidents10 === o.v && <div className="radio-dot-inner" />}</div>
                      <div className="radio-label">{o.l}</div>
                    </div>
                  ))}
                </div>
                <div className="t-label" style={{ marginBottom: 6 }}>Accidents in last 5 years</div>
                <div className="radio-group">
                  {[{ v: 'none', l: 'None' }, { v: '1', l: '1' }, { v: '2+', l: '2 or more' }, { v: 'prefer-not', l: 'Prefer not to say' }].map((o) => (
                    <div key={o.v} className={`radio-opt ${accidents5 === o.v ? 'on' : ''}`} onClick={() => setAccidents5(o.v)}>
                      <div className="radio-dot">{accidents5 === o.v && <div className="radio-dot-inner" />}</div>
                      <div className="radio-label">{o.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontStyle: 'italic' }}>Displayed on your profile with &ldquo;Self-reported by driver&rdquo; label</div>
          </div>

          {/* About me */}
          <div className="form-group">
            <label className="form-label">About Me <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <textarea className="form-input" rows={4} maxLength={300} placeholder="Tell riders who you are. Your background, your values, why you drive. This is what turns a stranger into a regular client." value={aboutMe} onChange={(e) => setAboutMe(e.target.value.slice(0, 300))} style={{ resize: 'none' }} />
            <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right', marginTop: 3 }}>{aboutMe.length}/300 characters</div>
          </div>

          {/* Interests */}
          <div className="form-group">
            <label className="form-label">Interests &amp; Background <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <textarea className="form-input" rows={4} maxLength={300} placeholder="What would you talk about on a 30-minute ride?" value={interests} onChange={(e) => setInterests(e.target.value.slice(0, 300))} style={{ resize: 'none' }} />
            <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right', marginTop: 3 }}>{interests.length}/300 characters</div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-lg" onClick={() => router.back()}>&larr; Back</button>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }}>Save profile</button>
          </div>
        </div>

        {/* Right panel: Preview */}
        <div className="right-panel">
          <div className="t-label" style={{ marginBottom: 8 }}>Profile preview</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 12 }}>This is what riders see at the bottom of your profile</div>

          <div className="card-surface" style={{ marginBottom: 10 }}>
            <div className="t-label" style={{ marginBottom: 6 }}>Driving Record &middot; Self-reported</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="badge badge-green" style={{ fontSize: 9 }}>{yearsBadge}</span>
              {accidentBadge && <span className="badge badge-green" style={{ fontSize: 9 }}>{accidentBadge}</span>}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontStyle: 'italic' }}>Self-reported by driver</div>
          </div>

          <div className="card-surface" style={{ marginBottom: 10 }}>
            <div className="t-label" style={{ marginBottom: 6 }}>About Me</div>
            <div style={{ fontSize: 11, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic' }}>
              &ldquo;{aboutMe ? aboutMe.slice(0, 80) + (aboutMe.length > 80 ? '...' : '') : 'Not yet written'}&rdquo;
            </div>
          </div>

          <div className="card-surface" style={{ marginBottom: 10 }}>
            <div className="t-label" style={{ marginBottom: 6 }}>Interests &amp; Background</div>
            <div style={{ fontSize: 11, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {interests ? `"${interests.slice(0, 80)}${interests.length > 80 ? '...' : ''}"` : 'Not yet written'}
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.5 }}>
            The following is self-reported by the driver and has not been verified by {config.serviceName}.
          </div>
        </div>
      </div>
    </div>
  );
}
