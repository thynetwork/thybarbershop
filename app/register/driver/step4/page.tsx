'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { config, splitServiceName } from '@/lib/config';

export default function DriverStep4() {
  const router = useRouter();

  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [maxPassengers, setMaxPassengers] = useState('');
  const [seatbeltsConfirmed, setSeatbeltsConfirmed] = useState(false);
  const [vehiclePhotos, setVehiclePhotos] = useState<{ front: string; rear: string; interiorFront: string; interiorRear: string }>({
    front: '', rear: '', interiorFront: '', interiorRear: '',
  });
  const [error, setError] = useState('');

  // Retrieve vehicle class from step3 data if available
  const step3Data = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('driverStep3') || '{}') : {};
  const vehicleClass = step3Data.vehicleClass || 'comfort';
  const passengerPlaceholder = vehicleClass === 'comfort' ? '3' : vehicleClass === 'xl_mid' ? '5' : vehicleClass === 'xl_large' ? '7' : '4';

  function handleVehiclePhoto(position: keyof typeof vehiclePhotos, file: File | null) {
    if (file) {
      setVehiclePhotos((prev) => ({ ...prev, [position]: file.name }));
    }
  }

  function handleContinue() {
    setError('');
    if (!vehicleMake || !vehicleModel || !vehicleYear || !vehicleColor || !maxPassengers) {
      setError('All vehicle information fields are required.');
      return;
    }
    if (!seatbeltsConfirmed) {
      setError('Please confirm all seatbelts are functional.');
      return;
    }
    if (parseInt(vehicleYear) < 2018) {
      setError('Vehicle must be 2018 or newer.');
      return;
    }
    sessionStorage.setItem('driverStep4', JSON.stringify({
      vehicleMake, vehicleModel, vehicleYear, vehicleColor, maxPassengers,
      seatbeltsConfirmed, vehiclePhotos,
    }));
    router.push('/register/driver/step5');
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
            <div className="progress-step done" />
            <div className="progress-step active" />
            <div className="progress-step" />
            <div className="progress-step" />
          </div>

          <div className="t-title mb-4">Vehicle Information</div>
          <div className="t-small mb-20">Step 4 of 6 — Your vehicle details</div>

          {error && <div className="form-error">{error}</div>}

          {/* Vehicle make & model */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vehicle make</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Toyota"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle model</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Camry XSE"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Vehicle year & color */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vehicle year</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 2022"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                min={2018}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle color</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Silver"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Max passengers */}
          <div className="form-group">
            <label className="form-label">Max passengers</label>
            <input
              className="form-input"
              type="number"
              placeholder={passengerPlaceholder}
              value={maxPassengers}
              onChange={(e) => setMaxPassengers(e.target.value)}
              min={1}
              max={15}
              required
            />
            <div className="t-small" style={{ marginTop: 4 }}>
              Suggested: Comfort=3, XL Mid=5, XL Large=7, Black=4
            </div>
          </div>

          {/* Seatbelts confirmed */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
              cursor: 'pointer',
            }}
            onClick={() => setSeatbeltsConfirmed(!seatbeltsConfirmed)}
          >
            <div style={{
              width: 20,
              height: 20,
              border: seatbeltsConfirmed ? 'none' : '2px solid var(--border-mid)',
              borderRadius: 4,
              background: seatbeltsConfirmed ? 'var(--navy)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--amber)',
              fontSize: 13,
              fontWeight: 800,
            }}>
              {seatbeltsConfirmed ? '\u2713' : ''}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>All seatbelts functional</div>
          </div>

          {/* Vehicle photos */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13, letterSpacing: '.04em', marginBottom: 10, display: 'block' }}>
              VEHICLE PHOTOS (optional)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([
                { key: 'front' as const, label: 'Front exterior' },
                { key: 'rear' as const, label: 'Rear exterior' },
                { key: 'interiorFront' as const, label: 'Interior front' },
                { key: 'interiorRear' as const, label: 'Interior rear' },
              ]).map((photo) => (
                <label
                  key={photo.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed var(--border-mid)',
                    borderRadius: 10,
                    padding: '18px 10px',
                    cursor: 'pointer',
                    background: vehiclePhotos[photo.key] ? 'var(--surface)' : 'transparent',
                    transition: 'background 0.15s',
                    textAlign: 'center',
                    minHeight: 90,
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4, color: 'var(--text-2)' }}>&#128247;</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{photo.label}</div>
                  {vehiclePhotos[photo.key] && (
                    <div style={{ fontSize: 10, color: 'var(--purple)', marginTop: 4, wordBreak: 'break-all' }}>{vehiclePhotos[photo.key]}</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleVehiclePhoto(photo.key, e.target.files?.[0] || null)}
                  />
                </label>
              ))}
            </div>
            <div className="t-small" style={{ marginTop: 8, color: 'var(--text-2)' }}>
              Vehicle must be 2018 or newer. ThyBarberShop admin reviews photos before activation.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleContinue}
              style={{ width: '100%' }}
            >
              Continue — Payment Setup &rarr;
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => router.push('/register/driver/step3')}
              style={{ width: '100%' }}
            >
              &larr; Back
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">Vehicle requirements</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Year requirement</div>
              <div className="t-small">Vehicle must be model year 2018 or newer to qualify for the {config.serviceName} platform.</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Photo review</div>
              <div className="t-small">All vehicle photos are reviewed by {config.serviceName} admin before your pool listing is activated. Clear, well-lit photos speed up approval.</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Safety check</div>
              <div className="t-small">Confirming functional seatbelts is required. Vehicles must pass a visual safety standard to remain active.</div>
            </div>
            <div className="card-surface">
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Vehicle class</div>
              <div className="t-small">Your selected class: <strong>{vehicleClass === 'comfort' ? 'Comfort' : vehicleClass === 'xl_mid' ? 'XL Mid (5)' : vehicleClass === 'xl_large' ? 'XL Large (7-8)' : 'Black'}</strong>. You can change this on the previous step.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
