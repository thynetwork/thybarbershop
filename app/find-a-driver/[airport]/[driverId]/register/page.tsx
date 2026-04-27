'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import config, { splitServiceName } from '@/lib/config';
import RiderRegistrationForm, { type DriverInfo } from '@/components/RiderRegistrationForm';

export default function FA4RegisterPage() {
  const params = useParams();
  const { prefix, highlight } = splitServiceName();
  const airport = (params.airport as string || '').toUpperCase();
  const driverId = params.driverId as string || '';

  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDriver() {
      try {
        const res = await fetch(`/api/drivers/${driverId}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setDriver({
          id: data.id,
          name: data.name,
          initials: data.initials,
          airportCode: data.airportCode || airport,
          codeInitials: data.codeInitials,
          codeDigits: data.codeDigits,
          airportPermitted: data.airportPermitted,
          insuranceVerified: data.insuranceVerified,
          vehicleClass: data.vehicleClass,
          vehicleMakeModel: data.vehicleMakeModel,
          rating: data.rating,
        });
      } catch {
        // Driver fetch failed
      }
      setLoading(false);
    }
    fetchDriver();
  }, [driverId, airport]);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-topbar">
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
            borderRadius: 'var(--r-full)', padding: '4px 12px',
          }}>
            <span style={{ fontSize: 12 }}>&#9992;</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, color: 'var(--amber)' }}>{airport}</span>
          </div>
        </div>
        <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center', justifyContent: 'center' }}>
          <div className="t-small">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        </Link>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)',
          borderRadius: 'var(--r-full)', padding: '4px 12px',
        }}>
          <span style={{ fontSize: 12 }}>&#9992;</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, color: 'var(--amber)' }}>{airport}</span>
        </div>
      </div>
      <div className="layout-center" style={{ background: 'var(--white)', alignItems: 'center' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          {driver && (
            <RiderRegistrationForm mode="find_a_driver" driver={driver} />
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
