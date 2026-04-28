'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

export default function TripReviewPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  // TODO: Get from query params or session
  const trip = {
    driverName: 'Marcus R.',
    driverCode: 'South Houston\u00B7MRC\u00B73341',
    date: 'Thu Jul 17',
    time: '9:00 am',
    route: 'Airport to Home',
    amount: '$50',
  };

  const [selection, setSelection] = useState<'great' | 'ok' | 'unprofessional' | null>(null);
  const [report, setReport] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(choice: 'great' | 'ok' | 'unprofessional') {
    setSelection(choice);
    if (choice !== 'unprofessional') {
      setSubmitted(true);
    }
  }

  function handleSendReport() {
    // TODO: Send report to API
    setSubmitted(true);
  }

  // Thank you screen
  if (submitted && selection !== 'unprofessional') {
    return (
      <div className="app-shell">
        <div className="app-topbar"><div className="topbar-logo">{prefix}<span>{highlight}</span></div><div className="topbar-avatar">SW</div></div>
        <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{selection === 'great' ? '\uD83D\uDC4D' : '\uD83D\uDC4C'}</div>
            <div className="t-display mb-8">{selection === 'great' ? 'Glad to hear it.' : 'Thanks for letting us know.'}</div>
            <div className="t-small mb-20">{selection === 'great' ? 'See you next time.' : ''}</div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => router.push('/home')}>Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  // Report submitted screen
  if (submitted && selection === 'unprofessional') {
    return (
      <div className="app-shell">
        <div className="app-topbar"><div className="topbar-logo">{prefix}<span>{highlight}</span></div><div className="topbar-avatar">SW</div></div>
        <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128737;</div>
            <div className="t-display mb-8">Your report has been received.</div>
            <div className="t-small mb-20" style={{ lineHeight: 1.6 }}>{config.serviceName} will review and follow up. Thank you for letting us know.</div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => router.push('/home')}>Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-avatar">SW</div>
      </div>

      <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          {/* Trip summary card */}
          <div className="card-navy" style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Trip complete</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{trip.driverName} &middot; {trip.driverCode}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{trip.date} &middot; {trip.time} &middot; {trip.route} &middot; {trip.amount}</div>
          </div>

          <div className="t-display" style={{ textAlign: 'center', marginBottom: 4 }}>How was your trip?</div>
          <div className="t-small" style={{ textAlign: 'center', marginBottom: 20 }}>Takes one tap &middot; completely optional</div>

          {/* Three options */}
          {!selection && (
            <>
              <div
                onClick={() => handleSelect('great')}
                style={{ background: 'var(--green-pale)', border: '2px solid var(--green-border)', borderRadius: 'var(--r-xl)', padding: 18, textAlign: 'center', cursor: 'pointer', marginBottom: 10, transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>&#128077;</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--green)' }}>Great</div>
              </div>
              <div
                onClick={() => handleSelect('ok')}
                style={{ background: 'var(--surface)', border: '2px solid var(--border-mid)', borderRadius: 'var(--r-xl)', padding: 18, textAlign: 'center', cursor: 'pointer', marginBottom: 10, transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>&#128076;</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--text-2)' }}>OK</div>
              </div>
              <div
                onClick={() => handleSelect('unprofessional')}
                style={{ background: 'var(--red-pale)', border: '2px solid rgba(163,45,45,0.2)', borderRadius: 'var(--r-xl)', padding: 18, textAlign: 'center', cursor: 'pointer', marginBottom: 10, transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>&#128548;</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--red)' }}>Unprofessional</div>
              </div>
              <button className="btn btn-ghost btn-full" style={{ marginTop: 8, fontSize: 12 }} onClick={() => router.push('/home')}>Skip for now</button>
            </>
          )}

          {/* Unprofessional — report form */}
          {selection === 'unprofessional' && (
            <>
              <hr className="divider" />
              <div className="form-group">
                <label className="form-label">Tell us what happened</label>
                <textarea
                  className="form-input"
                  rows={4}
                  maxLength={500}
                  placeholder="Describe the issue — appearance, behavior, vehicle condition, or anything else"
                  value={report}
                  onChange={(e) => setReport(e.target.value.slice(0, 500))}
                  style={{ resize: 'none' }}
                />
                <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right', marginTop: 3 }}>{report.length}/500 characters</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleSendReport}>Send report</button>
                <button className="btn btn-amber btn-lg" style={{ flex: 1 }} onClick={() => router.push('/support')}>Speak to someone &rarr;</button>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
