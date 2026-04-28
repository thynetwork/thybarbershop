'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

const POPULAR_AREAS = [
  { zip: '77587', city: 'South Houston', state: 'TX', count: 12 },
  { zip: '77002', city: 'Houston', state: 'TX', count: 17 },
  { zip: '90002', city: 'Watts', state: 'CA', count: 9 },
  { zip: '90001', city: 'Los Angeles', state: 'CA', count: 31 },
  { zip: '30303', city: 'Atlanta', state: 'GA', count: 24 },
  { zip: '60601', city: 'Chicago', state: 'IL', count: 18 },
  { zip: '10001', city: 'New York', state: 'NY', count: 28 },
  { zip: '33101', city: 'Miami', state: 'FL', count: 15 },
];

export default function FindABarberPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const [zipCode, setZipCode] = useState('');
  const [selectedZip, setSelectedZip] = useState<string | null>(null);

  function handleSearch() {
    const z = (zipCode || selectedZip || '').trim();
    if (/^\d{5}$/.test(z)) {
      router.push(`/find-a-driver/${z}`);
    }
  }

  function handleAreaClick(zip: string) {
    setSelectedZip(zip);
    setZipCode(zip);
    router.push(`/find-a-driver/${zip}`);
  }

  return (
    <>
      <div className="app-topbar">
        <div className="topbar-logo">
          {prefix}<span>{highlight}</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-avatar">SC</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '620px', background: 'var(--white)', padding: '40px' }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          <div className="text-center mb-24">
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>&#9986;</div>
            <div className="t-display mb-8">Find a {config.providerLabel}</div>
            <div className="t-body" style={{ color: 'var(--text-2)' }}>
              Enter your zip code. We&rsquo;ll show every {config.providerLabel.toLowerCase()} in your area &mdash; their shop, their rates, and how to reach them. Browse anonymously.
            </div>
          </div>

          <div className="form-group mb-16">
            <label className="form-label">Zip code</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                className="form-input"
                placeholder="77587"
                value={zipCode}
                inputMode="numeric"
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setZipCode(v);
                  setSelectedZip(null);
                }}
                maxLength={5}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  color: 'var(--navy)',
                }}
              />
              <button
                className="btn btn-primary btn-lg"
                style={{ whiteSpace: 'nowrap', opacity: /^\d{5}$/.test(zipCode) ? 1 : 0.5 }}
                onClick={handleSearch}
                disabled={!/^\d{5}$/.test(zipCode)}
              >
                Search &rarr;
              </button>
            </div>
            <div className="t-small" style={{ marginTop: 6 }}>
              5 digits required. We match {config.providerLabel.toLowerCase()}s whose zip equals yours OR whose service areas include it.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <div className="t-small">Popular areas</div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div className="grid-4 mb-24" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {POPULAR_AREAS.map((a) => {
              const isSelected = selectedZip === a.zip || zipCode === a.zip;
              return (
                <div
                  key={a.zip}
                  onClick={() => handleAreaClick(a.zip)}
                  style={{
                    background: isSelected ? 'var(--amber)' : 'var(--surface)',
                    border: isSelected ? '1px solid var(--amber)' : '1px solid var(--border)',
                    borderRadius: 'var(--r-md)',
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '15px',
                    fontWeight: 800,
                    color: 'var(--navy)',
                    marginBottom: '3px',
                    letterSpacing: '0.05em',
                  }}>
                    {a.zip}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isSelected ? 'rgba(10,10,46,.6)' : 'var(--text-2)',
                  }}>
                    {a.city} &middot; {a.state}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isSelected ? 'var(--navy)' : 'var(--green)',
                    marginTop: '4px',
                  }}>
                    &#9679; {a.count} {config.providerLabel.toLowerCase()}s
                  </div>
                </div>
              );
            })}
          </div>

          <div className="privacy-notice">
            <div className="pn-icon">&#128274;</div>
            <div className="pn-text">
              <strong>Privacy protected.</strong> {config.providerLabel} contact info and full codes are hidden until you request a connection and pay the one-time $9.99 matching fee. You browse completely anonymously.
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/conditions">Conditions</a>
      </div>
    </>
  );
}
