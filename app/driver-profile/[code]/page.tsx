'use client';

import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

/* ── Demo data ─────────────────────────────────────────────── */
const driver = {
  initials: 'MR',
  name: 'Marcus R.',
  airportCode: 'South Houston',
  codeInitials: 'MRC',
  codeDigits: '3341',
  rating: 4.97,
  rides: 312,
  airports: [
    { code: 'South Houston', name: 'South Houston, TX' },
    { code: 'HOU', name: 'William P. Hobby' },
  ],
  safetyProtocol: true,
  professionalStandard: true,
  insuranceProvider: 'Allstate',
  insuranceType: 'Rideshare',
  vehicle: {
    makeModel: '2022 Toyota Camry XSE',
    vehicleClass: 'Comfort',
    color: 'Silver',
    passengers: 3,
    seatbelts: true,
  },
  rates: {
    setAmount: 50,
    flatLocal: 25,
    airportRun: 45,
    hourly: 35,
    distance: 50,
    emptyReturn: 50,
  },
  availability: { days: 'Mon \u2013 Sat', hours: '7:00 am \u2013 10:00 pm', accepting: true },
  drivingRecord: {
    yearsLicensed: '30+',
    accidents5yr: 'None',
    accidents10yr: 'None',
  },
  aboutMe: 'Military veteran and family man. Been driving professionally for 35 years. I treat every passenger like family. Your safety and comfort is always my priority.',
  interests: 'Military veteran, family man. Enjoy traveling, sports, and music. Three generations of military service \u2014 150 years combined family service.',
  reviews: [
    'Always on time. Knows every terminal. My go-to every Thursday.',
    'Professional and reliable. Has been my airport driver for 2 years.',
    'Clean car, quiet ride, never late. Exactly what I need.',
  ],
};

export default function DriverPublicProfile() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer', padding: '4px 8px', marginRight: 4, lineHeight: 1 }}
          aria-label="Back"
        >&larr;</button>
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-avatar">SC</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 580 }}>
        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content" style={{ overflowY: 'auto' }}>
          {/* Banner */}
          <div className="profile-banner" style={{ margin: '-28px -32px 0', borderRadius: 0 }}>
            <div className="pb-av pb-av-amber">{driver.initials}</div>
          </div>
          <div style={{ paddingTop: 44, marginBottom: 14 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{driver.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="driver-code">
                <div className="dc-airport">{driver.airportCode}</div>
                <div className="dc-initials">{driver.codeInitials}</div>
                <div className="dc-digits">{driver.codeDigits}</div>
              </div>
              <span className="badge badge-green">&#9733; {driver.rating} &middot; {driver.rides} rides</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {driver.airports.map((a) => (
                <span key={a.code} className="badge badge-blue">&#9992; {a.code}</span>
              ))}
              <span className="badge badge-green">&#10003; Safety Protocol</span>
              <span className="badge badge-green">&#10003; Insured &middot; {driver.insuranceProvider}</span>
              {driver.professionalStandard && (
                <span className="badge badge-green">&#10003; Professional Standard</span>
              )}
            </div>
          </div>

          {/* Insurance strip */}
          <div className="ins-strip" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--green-pale)', borderRadius: 'var(--r-md)', padding: '7px 11px', marginBottom: 12 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>{driver.insuranceType} insured &middot; {driver.insuranceProvider} &middot; Active coverage</div>
          </div>

          {/* Vehicle */}
          <div className="t-label" style={{ marginBottom: 8 }}>Vehicle</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div className="row"><span className="pref-label">Vehicle</span><span className="pref-value">{driver.vehicle.makeModel}</span></div>
            <div className="row"><span className="pref-label">Class</span><span className="pref-value">{driver.vehicle.vehicleClass}</span></div>
            <div className="row"><span className="pref-label">Color</span><span className="pref-value">{driver.vehicle.color}</span></div>
            <div className="row"><span className="pref-label">Passengers</span><span className="pref-value">{driver.vehicle.passengers} max</span></div>
            <div className="row"><span className="pref-label">Seatbelts</span><span className="badge badge-green">&#10003; Confirmed</span></div>
          </div>

          {/* Rates */}
          <div className="t-label" style={{ marginBottom: 8 }}>Rates</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div className="row"><span className="pref-label">Set amount</span><span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#3C3489' }}>${driver.rates.setAmount} &middot; agreed per client</span></div>
            <div className="row"><span className="pref-label">Flat local</span><span className="pref-value">${driver.rates.flatLocal} &middot; 10 miles or less</span></div>
            <div className="row"><span className="pref-label">Airport run</span><span className="pref-value">${driver.rates.airportRun} &middot; 50 miles or less</span></div>
            <div className="row"><span className="pref-label">Hourly</span><span className="pref-value">${driver.rates.hourly}/hr</span></div>
            <div className="row"><span className="pref-label">Distance</span><span className="pref-value">${driver.rates.distance} &middot; 51+ miles</span></div>
            <div className="row"><span className="pref-label">Empty return</span><span className="pref-value">${driver.rates.emptyReturn} fixed</span></div>
          </div>

          {/* Availability */}
          <div className="t-label" style={{ marginBottom: 8 }}>Availability</div>
          <div className="card-surface" style={{ marginBottom: 20 }}>
            <div className="row"><span className="pref-label">Days</span><span className="pref-value">{driver.availability.days}</span></div>
            <div className="row"><span className="pref-label">Hours</span><span className="pref-value">{driver.availability.hours}</span></div>
            <div className="row"><span className="pref-label">Accepting clients</span><span className="badge badge-green">&#9679; Open</span></div>
          </div>

          <hr className="divider" />

          {/* Self-reported disclaimer */}
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', marginBottom: 16, textAlign: 'center' }}>
            The following information is self-reported by the driver and has not been verified by {config.serviceName}.
          </div>

          {/* Driving record */}
          <div className="t-label" style={{ marginBottom: 8 }}>Driving Record &middot; Self-reported</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge badge-green">{driver.drivingRecord.yearsLicensed} Years Licensed</span>
              <span className="badge badge-green">10 Year Accident Free</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 4 }}>Self-reported by driver</div>
          </div>

          {/* About me */}
          <div className="t-label" style={{ marginBottom: 8 }}>About Me</div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.7, fontStyle: 'italic' }}>
              &ldquo;{driver.aboutMe}&rdquo;
            </div>
          </div>

          {/* Interests */}
          <div className="t-label" style={{ marginBottom: 8 }}>Interests &amp; Background</div>
          <div className="card-surface" style={{ marginBottom: 20, fontSize: 13, color: 'var(--text-1)', lineHeight: 1.7 }}>
            {driver.interests}
          </div>
        </div>

        {/* ── Right panel ───────────────────────────────────── */}
        <div className="right-panel">
          <div className="t-label" style={{ marginBottom: 8 }}>Airports served</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {driver.airports.map((a) => (
              <div key={a.code} style={{ background: 'var(--navy)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>&#9992;</span>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: 'var(--amber)' }}>{a.code}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>{a.name}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="t-label" style={{ marginBottom: 8 }}>Reviews</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {driver.reviews.map((r, i) => (
              <div key={i} className="card-surface" style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, fontStyle: 'italic' }}>
                &ldquo;{r}&rdquo;
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-full" onClick={() => router.push(`/join/${driver.airportCode}\u00B7${driver.codeInitials}\u00B7${driver.codeDigits}`)}>
            Request Connection &rarr;
          </button>
        </div>
      </div>

      <footer className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName} &middot; {config.companyName}{' '}
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/conditions">Conditions</a>
      </footer>
    </div>
  );
}
