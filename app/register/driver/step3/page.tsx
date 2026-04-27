'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DriverStep3() {
  const router = useRouter();

  const [setAmount, setSetAmount] = useState('120.00');
  const [hourlyRate, setHourlyRate] = useState('35.00');
  const [flatLocal, setFlatLocal] = useState('25.00');
  const [flatAirport, setFlatAirport] = useState('45.00');
  const [flatDistance, setFlatDistance] = useState('50.00');
  const [emptyReturnType, setEmptyReturnType] = useState<'fixed' | 'percent'>('fixed');
  const [emptyReturnValue, setEmptyReturnValue] = useState('50.00');
  const [vehicleClass, setVehicleClass] = useState<'comfort' | 'xl_mid' | 'xl_large' | 'black'>('comfort');

  const [available24hrs, setAvailable24hrs] = useState(false);
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [startTime, setStartTime] = useState('7:00 am');
  const [endTime, setEndTime] = useState('10:00 pm');
  const [error, setError] = useState('');

  function toggleDay(day: string) {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleContinue() {
    setError('');
    if (!setAmount || !hourlyRate || !flatLocal || !flatAirport || !flatDistance || !emptyReturnValue) {
      setError('All rate fields are required.');
      return;
    }
    if (availableDays.length === 0) {
      setError('Please select at least one available day.');
      return;
    }
    sessionStorage.setItem('driverStep3', JSON.stringify({
      setAmount, hourlyRate, flatLocal, flatAirport, flatDistance,
      emptyReturnType, emptyReturnValue, vehicleClass,
      available24hrs, availableDays, startTime, endTime,
    }));
    router.push('/register/driver/step4');
  }

  return (
    <div className="app-shell">
      <div className="layout-2col">
        {/* Main form */}
        <div className="main-content">
          {/* Progress bar */}
          <div className="progress-bar">
            <div className="progress-step done" />
            <div className="progress-step done" />
            <div className="progress-step active" />
            <div className="progress-step" />
            <div className="progress-step" />
            <div className="progress-step" />
          </div>

          <div className="t-title mb-4">Rates &amp; Availability</div>
          <div className="t-small mb-20">Step 3 of 6 — You control your pricing</div>

          {error && <div className="form-error">{error}</div>}

          {/* Set Amount card */}
          <div className="card-purple-tint mb-16">
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--purple)', marginBottom: 4 }}>
              Set Amount
            </div>
            <div style={{ fontSize: 12, color: 'var(--purple-mid)', marginBottom: 10, lineHeight: 1.5 }}>
              A custom agreed rate between you and a specific client. Set a default here — you can override per client after they connect.
            </div>
            <input
              className="form-input"
              value={`$${setAmount}`}
              onChange={(e) => setSetAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                textAlign: 'center',
                borderColor: 'var(--purple-border)',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--purple-mid)', marginTop: 6 }}>
              Both you and your client must agree before the Set Amount activates.
            </div>
          </div>

          {/* Flat local */}
          <div className="form-group">
            <label className="form-label">Flat fee — local (&le;10 miles)</label>
            <input
              className="form-input"
              value={`$${flatLocal}`}
              onChange={(e) => setFlatLocal(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
          </div>

          {/* Flat fee — airport run */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>FLAT FEE — AIRPORT RUN (50 MILES OR LESS)</label>
            <input
              className="form-input"
              value={`$${flatAirport}`}
              onChange={(e) => setFlatAirport(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
          </div>

          {/* Hourly rate */}
          <div className="form-group">
            <label className="form-label">Hourly rate ($/hr)</label>
            <input
              className="form-input"
              value={`$${hourlyRate}`}
              onChange={(e) => setHourlyRate(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
          </div>

          {/* Flat distance */}
          <div className="form-group">
            <label className="form-label">Flat fee — distance (over 51 miles, single flat)</label>
            <input
              className="form-input"
              value={`$${flatDistance} flat`}
              onChange={(e) => setFlatDistance(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
          </div>

          {/* Empty return charge */}
          <div className="card-surface mb-16">
            <div className="t-label mb-8">Empty return charge</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.5 }}>
              For one-way long trips where you drive back empty (e.g. Houston &rarr; Austin). Client sees this before confirming.
            </div>
            <div className="seg-control mb-8">
              <button
                className={`seg-opt${emptyReturnType === 'fixed' ? ' on' : ''}`}
                onClick={() => setEmptyReturnType('fixed')}
                type="button"
              >
                Fixed amount
              </button>
              <button
                className={`seg-opt${emptyReturnType === 'percent' ? ' on' : ''}`}
                onClick={() => setEmptyReturnType('percent')}
                type="button"
              >
                % of fare
              </button>
            </div>
            <input
              className="form-input"
              value={emptyReturnType === 'fixed' ? `$${emptyReturnValue}` : `${emptyReturnValue}%`}
              onChange={(e) => setEmptyReturnValue(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>

          <hr className="divider" />

          {/* Vehicle class */}
          <div className="t-label mb-12">Vehicle class</div>
          <div className="seg-control mb-16">
            {([
              { key: 'comfort' as const, label: 'Comfort' },
              { key: 'xl_mid' as const, label: 'XL Mid (5)' },
              { key: 'xl_large' as const, label: 'XL Large (7-8)' },
              { key: 'black' as const, label: 'Black' },
            ]).map((vc) => (
              <button
                key={vc.key}
                className={`seg-opt${vehicleClass === vc.key ? ' on' : ''}`}
                onClick={() => setVehicleClass(vc.key)}
                type="button"
              >
                {vc.label}
              </button>
            ))}
          </div>

          <hr className="divider" />

          {/* Availability */}
          <div className="t-label mb-12">Availability</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {DAYS.map((day) => (
              <button
                key={day}
                className={`btn btn-sm ${availableDays.includes(day) ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => toggleDay(day)}
                type="button"
              >
                {day}
              </button>
            ))}
          </div>

          {/* Available 24 hours checkbox */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
              cursor: 'pointer',
            }}
            onClick={() => setAvailable24hrs(!available24hrs)}
          >
            <div style={{
              width: 20,
              height: 20,
              border: available24hrs ? 'none' : '2px solid var(--border-mid)',
              borderRadius: 4,
              background: available24hrs ? 'var(--navy)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--amber)',
              fontSize: 13,
              fontWeight: 800,
            }}>
              {available24hrs ? '\u2713' : ''}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Available 24 hours</div>
          </div>

          <div className="form-row" style={{ opacity: available24hrs ? 0.4 : 1, pointerEvents: available24hrs ? 'none' : 'auto' }}>
            <div className="form-group">
              <label className="form-label">Start time</label>
              <input
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={available24hrs}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End time</label>
              <input
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={available24hrs}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleContinue}
              style={{ width: '100%' }}
            >
              Continue — Vehicle Info &rarr;
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/register/driver/step2b')}
              style={{ width: '100%' }}
            >
              &larr; Back
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">Rate order on your profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="card-purple-tint">
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple)' }}>1. Set Amount</div>
              <div className="t-small" style={{ color: 'var(--purple-mid)' }}>Shown first — most prominent</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500 }}>2. Flat local</div>
              <div className="t-small">${flatLocal} &middot; 10 miles or less</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500 }}>3. Airport run</div>
              <div className="t-small">${flatAirport} &middot; 50 miles or less</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500 }}>4. Hourly</div>
              <div className="t-small">${hourlyRate}/hr</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500 }}>5. Flat distance</div>
              <div className="t-small">${flatDistance} flat &middot; over 51 miles</div>
            </div>
            <div className="card-amber-tint">
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--amber-dim)' }}>6. Empty return</div>
              <div className="t-small" style={{ color: 'var(--amber-dim)' }}>${emptyReturnValue} &middot; long haul one-way trips</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
