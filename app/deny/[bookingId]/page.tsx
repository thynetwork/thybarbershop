'use client';

import { useState, useEffect } from 'react';
import { config, splitServiceName } from '@/lib/config';

export default function DenyBookingPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { prefix, highlight } = splitServiceName();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    params.then((resolved) => {
      setBookingId(resolved.bookingId);
      denyBooking(resolved.bookingId);
    });
  }, [params]);

  async function denyBooking(id: string) {
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deny' }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Booking denied successfully.');
      } else if (response.status === 409) {
        setStatus('already');
        setMessage(data.error || 'This booking has already been processed.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to deny booking.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
      </div>
      <div className="layout-center">
        <div style={{ textAlign: 'center', maxWidth: 420, padding: '40px 24px' }}>
          {status === 'loading' && (
            <>
              <div className="timer-wrap">
                <div className="timer-ring" />
              </div>
              <div className="t-subtitle mb-8">Processing...</div>
              <div className="t-small">Please wait while we process your response.</div>
            </>
          )}

          {status === 'success' && (
            <div className="card-surface" style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>&#10007;</div>
              <div className="t-subtitle mb-8">Booking Denied</div>
              <div className="t-small">{message}<br />The client has been notified and can rebook at a different time.</div>
            </div>
          )}

          {status === 'already' && (
            <div className="card-amber-tint" style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>&#8505;</div>
              <div className="t-subtitle mb-8">Already Processed</div>
              <div className="t-small" style={{ color: 'var(--amber-dim)' }}>{message}</div>
            </div>
          )}

          {status === 'error' && (
            <div className="card-red-tint" style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>!</div>
              <div className="t-subtitle mb-8" style={{ color: 'var(--red)' }}>Error</div>
              <div className="t-small" style={{ color: 'var(--red)' }}>{message}</div>
            </div>
          )}

          {status !== 'loading' && (
            <a
              href="/dashboard"
              className="btn btn-primary btn-lg w-full"
              style={{ textDecoration: 'none', marginTop: 24, display: 'inline-flex' }}
            >
              Go to Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
