'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

export default function DriverStep2b() {
  const router = useRouter();

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [hasHirePermit, setHasHirePermit] = useState(false);
  const [hirePermitNumber, setHirePermitNumber] = useState('');
  const [hasAirportPermit, setHasAirportPermit] = useState(false);
  const [permitNumber, setPermitNumber] = useState('');
  const [error, setError] = useState('');

  function handleContinue() {
    setError('');
    if (!emergencyName || !emergencyPhone) {
      setError('Please enter your emergency contact information.');
      return;
    }
    sessionStorage.setItem('driverStep2b', JSON.stringify({
      emergencyName, emergencyPhone, hasHirePermit, hirePermitNumber, hasAirportPermit, permitNumber,
    }));
    router.push('/register/driver/step3');
  }

  return (
    <div className="app-shell">
      <div className="layout-2col">
        {/* Main form */}
        <div className="main-content">
          {/* Progress bar */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step active" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
          </div>

          <div className="t-title mb-4">Emergency contact &amp; permits</div>
          <div className="t-small mb-20">Step 2 of 6 — Almost done with credentials</div>

          {error && <div className="form-error">{error}</div>}

          {/* Emergency contact */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Emergency contact name</label>
              <input
                className="form-input"
                placeholder="Maria Rivera"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency contact phone</label>
              <input
                className="form-input"
                placeholder="(713) 555-0192"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>

          <hr className="divider" />

          {/* Hire Driver Permit toggle */}
          <div className="t-label mb-12">Hire Driver Permit</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)',
              borderRadius: 'var(--r-md)',
              padding: '14px 16px',
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>I hold a for-hire / chauffeur permit</div>
              <div className="t-small mt-8">For-hire or chauffeur license issued by your city or county</div>
            </div>
            <div
              onClick={() => setHasHirePermit(!hasHirePermit)}
              style={{
                width: 44,
                height: 24,
                background: hasHirePermit ? 'var(--navy)' : 'var(--surface-2)',
                borderRadius: 12,
                position: 'relative',
                cursor: 'pointer',
                border: hasHirePermit ? 'none' : '1px solid var(--border-mid)',
                transition: 'background 0.15s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  background: hasHirePermit ? 'var(--amber)' : 'var(--white)',
                  borderRadius: '50%',
                  top: 3,
                  right: hasHirePermit ? 3 : 'auto',
                  left: hasHirePermit ? 'auto' : 3,
                  transition: 'all 0.15s',
                }}
              />
            </div>
          </div>

          {hasHirePermit && (
            <div className="card-surface mb-16">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Permit number (optional)</label>
                <input
                  className="form-input"
                  placeholder="FH-2026-00421"
                  value={hirePermitNumber}
                  onChange={(e) => setHirePermitNumber(e.target.value)}
                />
              </div>
              <div className="t-small mt-8">Enabling this adds a For-Hire Permit badge to your profile</div>
            </div>
          )}

          <hr className="divider" />

          {/* Airport permit toggle */}
          <div className="t-label mb-12">Airport RideShare Permit</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)',
              borderRadius: 'var(--r-md)',
              padding: '14px 16px',
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>I hold a city airport pickup permit</div>
              <div className="t-small mt-8">Airport rideshare or ground transportation permit</div>
            </div>
            <div
              onClick={() => setHasAirportPermit(!hasAirportPermit)}
              style={{
                width: 44,
                height: 24,
                background: hasAirportPermit ? 'var(--navy)' : 'var(--surface-2)',
                borderRadius: 12,
                position: 'relative',
                cursor: 'pointer',
                border: hasAirportPermit ? 'none' : '1px solid var(--border-mid)',
                transition: 'background 0.15s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  background: hasAirportPermit ? 'var(--amber)' : 'var(--white)',
                  borderRadius: '50%',
                  top: 3,
                  right: hasAirportPermit ? 3 : 'auto',
                  left: hasAirportPermit ? 'auto' : 3,
                  transition: 'all 0.15s',
                }}
              />
            </div>
          </div>

          {/* Airport permit details — optional upload */}
          {hasAirportPermit && (
            <div className="card-surface mb-16">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Permit number (optional)</label>
                <input
                  className="form-input"
                  placeholder="HOU-RS-00421"
                  value={permitNumber}
                  onChange={(e) => setPermitNumber(e.target.value)}
                />
              </div>
            </div>
          )}

          <hr className="divider" />

          {/* ── Document uploads ──────────────────────────────── */}
          <div className="t-label mb-12">Required document uploads</div>
          <div className="card-surface mb-16" style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
            All documents are stored securely and reviewed by {config.serviceName} admin only. Your profile will not go live until required documents are approved.
          </div>

          <div className="form-group">
            <label className="form-label">Driver&apos;s License &mdash; Front</label>
            <div className="upload-box" style={{ padding: '16px', textAlign: 'center', background: 'var(--surface)', border: '2px dashed var(--border-mid)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>&#128247;</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Upload photo or PDF &middot; JPG, PNG, PDF &middot; Max 10MB</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Driver&apos;s License &mdash; Back</label>
            <div className="upload-box" style={{ padding: '16px', textAlign: 'center', background: 'var(--surface)', border: '2px dashed var(--border-mid)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>&#128247;</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Upload photo or PDF &middot; JPG, PNG, PDF &middot; Max 10MB</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Insurance Declaration Page</label>
            <div className="upload-box" style={{ padding: '16px', textAlign: 'center', background: 'var(--surface)', border: '2px dashed var(--border-mid)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>&#128196;</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Must show your name, vehicle, coverage type, and active dates</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>JPG, PNG, PDF &middot; Max 10MB</div>
            </div>
          </div>

          {hasAirportPermit && (
            <div className="form-group">
              <label className="form-label">Airport RideShare Permit <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <div className="upload-box" style={{ padding: '16px', textAlign: 'center', background: 'var(--surface)', border: '2px dashed var(--border-mid)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>&#128196;</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Upload photo or PDF</div>
              </div>
            </div>
          )}

          {hasHirePermit && (
            <div className="form-group">
              <label className="form-label">Hire Driver Permit <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <div className="upload-box" style={{ padding: '16px', textAlign: 'center', background: 'var(--surface)', border: '2px dashed var(--border-mid)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>&#128196;</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Upload photo or PDF</div>
              </div>
            </div>
          )}

          {/* Safety protocol complete banner */}
          <div className="card-amber-tint mb-16" style={{ fontSize: 13, color: 'var(--amber-dim)', lineHeight: 1.5 }}>
            Your Safety Protocol is now complete. This information is encrypted and only accessed by {config.serviceName} in an emergency or dispute.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleContinue}
              style={{ width: '100%' }}
            >
              Continue — Set Your Rates &rarr;
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/register/driver/step2')}
              style={{ width: '100%' }}
            >
              &larr; Back
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {/* Safety complete card */}
          <div className="safety-complete">
            <div className="sc-icon">&#128737;</div>
            <div className="sc-title">Safety Protocol</div>
            <div className="sc-sub">All required fields complete. Your credentials are encrypted and secure.</div>
          </div>

          {/* Credential status */}
          <div className="card-surface">
            <div className="row"><span className="row-label">Profile photo</span><span className="badge badge-green">Saved</span></div>
            <div className="row"><span className="row-label">DL verified</span><span className="badge badge-green">Encrypted</span></div>
            <div className="row"><span className="row-label">Insurance</span><span className="badge badge-green">Saved</span></div>
            <div className="row"><span className="row-label">Emergency contact</span><span className="badge badge-amber">Pending</span></div>
            <div className="row"><span className="row-label">For-Hire permit</span><span className={`badge ${hasHirePermit ? 'badge-blue' : 'badge-amber'}`}>{hasHirePermit ? 'Active' : 'Optional'}</span></div>
            <div className="row"><span className="row-label">Airport permit</span><span className={`badge ${hasAirportPermit ? 'badge-blue' : 'badge-amber'}`}>{hasAirportPermit ? 'Active' : 'Optional'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
