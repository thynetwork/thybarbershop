'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

const POPULAR_AIRPORTS = [
  { code: 'IAH', city: 'Houston', drivers: 17 },
  { code: 'MCO', city: 'Orlando', drivers: 9 },
  { code: 'ATL', city: 'Atlanta', drivers: 24 },
  { code: 'LAX', city: 'Los Angeles', drivers: 31 },
  { code: 'DFW', city: 'Dallas', drivers: 22 },
  { code: 'ORD', city: 'Chicago', drivers: 18 },
  { code: 'JFK', city: 'New York', drivers: 28 },
  { code: 'MIA', city: 'Miami', drivers: 15 },
];

export default function FindADriverPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const [airportCode, setAirportCode] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);

  function handleSearch() {
    const code = (airportCode || selectedAirport || '').toUpperCase().trim();
    if (code.length >= 2) {
      router.push(`/find-a-driver/${code}`);
    }
  }

  function handleAirportClick(code: string) {
    setSelectedAirport(code);
    setAirportCode(code);
    router.push(`/find-a-driver/${code}`);
  }

  return (
    <>
      {/* Top bar */}
      <div className="app-topbar">
        <div className="topbar-logo">
          {prefix}<span>{highlight}</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-avatar">SC</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '620px', background: 'var(--white)', padding: '40px' }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          <div className="text-center mb-24">
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>&#9992;</div>
            <div className="t-display mb-8">Find a {config.providerLabel}</div>
            <div className="t-body" style={{ color: 'var(--text-2)' }}>
              Enter the airport code where you need a trusted {config.providerLabel.toLowerCase()}. Browse verified {config.providerLabel.toLowerCase()}s, check their vehicles, and choose who you want.
            </div>
          </div>

          <div className="form-group mb-16">
            <label className="form-label">Airport code</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                className="form-input"
                placeholder="e.g. MCO, LAX, ATL"
                value={airportCode}
                onChange={(e) => {
                  setAirportCode(e.target.value.toUpperCase());
                  setSelectedAirport(null);
                }}
                maxLength={4}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textAlign: 'center',
                  color: 'var(--navy)',
                }}
              />
              <button className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }} onClick={handleSearch}>
                Search &rarr;
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <div className="t-small">Popular airports</div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div className="grid-4 mb-24" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {POPULAR_AIRPORTS.map((ap) => {
              const isSelected = selectedAirport === ap.code || airportCode === ap.code;
              return (
                <div
                  key={ap.code}
                  onClick={() => handleAirportClick(ap.code)}
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
                  }}>
                    {ap.code}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isSelected ? 'rgba(10,10,46,.6)' : 'var(--text-2)',
                  }}>
                    {ap.city}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isSelected ? 'var(--navy)' : 'var(--green)',
                    marginTop: '4px',
                  }}>
                    &#9679; {ap.drivers} {config.providerLabel.toLowerCase()}s
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

      {/* Footer */}
      <div className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Conditions</a>
      </div>
    </>
  );
}
