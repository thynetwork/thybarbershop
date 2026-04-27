'use client';

import { useParams, useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

const AIRPORT_NAMES: Record<string, string> = {
  IAH: 'Houston', MCO: 'Orlando', ATL: 'Atlanta', LAX: 'Los Angeles',
  DFW: 'Dallas', ORD: 'Chicago', JFK: 'New York', MIA: 'Miami',
};

const AIRPORT_FULL_NAMES: Record<string, string> = {
  IAH: 'George Bush Intercontinental', MCO: 'Orlando International',
  ATL: 'Hartsfield-Jackson International', LAX: 'Los Angeles International',
  DFW: 'Dallas/Fort Worth International', ORD: "O'Hare International",
  JFK: 'John F. Kennedy International', MIA: 'Miami International',
};

interface DriverProfile {
  id: string;
  firstName: string;
  lastInitial: string;
  initials: string;
  vehicleClass: 'comfort' | 'xl' | 'black' | 'xll';
  rating: number;
  rides: number;
  airports: string[];
  vehicle: {
    year: number; make: string; model: string; trim: string;
    color: string; passengers: number; seatbelts: boolean;
    condition: string; insuranceType: string;
  };
  rates: {
    hourly: number; flatLocal: number; flatDistance: number;
    emptyReturn: number; payTiming: string;
  };
  availability: {
    days: boolean[];
    daysText: string;
    hours: string;
    accepting: boolean;
  };
  reviews: string[];
}

const DEMO_DRIVERS: Record<string, DriverProfile> = {
  'ray-r': {
    id: 'ray-r',
    firstName: 'Ray',
    lastInitial: 'R',
    initials: 'RR',
    vehicleClass: 'comfort',
    rating: 4.94,
    rides: 187,
    airports: ['MCO'],
    vehicle: { year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE', color: 'Silver', passengers: 3, seatbelts: true, condition: 'Clean · Minor wear acceptable', insuranceType: 'Rideshare insured' },
    rates: { hourly: 32, flatLocal: 22, flatDistance: 48, emptyReturn: 40, payTiming: 'On pickup' },
    availability: { days: [true, true, true, true, true, true, false], daysText: 'Monday – Saturday', hours: '6:00 am – 11:00 pm', accepting: true },
    reviews: [
      'Always on time at MCO. Never missed a pickup even when my flight changed.',
      'Clean car, professional, knows all the terminals. My go-to every trip.',
      'Been using Ray for 8 months. Consistent every single time.',
    ],
  },
  'david-m': {
    id: 'david-m',
    firstName: 'David',
    lastInitial: 'M',
    initials: 'DM',
    vehicleClass: 'xl',
    rating: 4.98,
    rides: 243,
    airports: ['MCO', 'SFB'],
    vehicle: { year: 2022, make: 'Toyota', model: 'Highlander', trim: 'XLE', color: 'Black', passengers: 6, seatbelts: true, condition: 'Excellent · Like new', insuranceType: 'Rideshare insured' },
    rates: { hourly: 45, flatLocal: 35, flatDistance: 65, emptyReturn: 50, payTiming: 'On pickup' },
    availability: { days: [true, true, true, true, true, false, false], daysText: 'Monday – Friday', hours: '5:00 am – 10:00 pm', accepting: true },
    reviews: [
      'David is fantastic. Spacious SUV, always clean, very professional.',
      'Best XL driver at MCO. Highly recommend for families.',
      'Reliable and friendly. Will keep using David for all my Orlando trips.',
    ],
  },
  'marcus-s': {
    id: 'marcus-s',
    firstName: 'Marcus',
    lastInitial: 'S',
    initials: 'MS',
    vehicleClass: 'black',
    rating: 5.0,
    rides: 89,
    airports: ['MCO'],
    vehicle: { year: 2023, make: 'Cadillac', model: 'CT5', trim: 'Premium', color: 'Black', passengers: 4, seatbelts: true, condition: 'Immaculate · Premium maintained', insuranceType: 'Commercial livery' },
    rates: { hourly: 75, flatLocal: 65, flatDistance: 120, emptyReturn: 80, payTiming: 'On pickup' },
    availability: { days: [true, true, true, true, true, true, true], daysText: 'Every day', hours: '24 hours · 7 days', accepting: true },
    reviews: [
      'Top-tier service. Marcus treats every ride like a VIP experience.',
      'The Cadillac is stunning. Worth every penny for airport transfers.',
      'Most professional driver I have ever used. Period.',
    ],
  },
  'tony-v': {
    id: 'tony-v',
    firstName: 'Tony',
    lastInitial: 'V',
    initials: 'TV',
    vehicleClass: 'xll',
    rating: 4.91,
    rides: 156,
    airports: ['MCO'],
    vehicle: { year: 2023, make: 'Chevrolet', model: 'Suburban', trim: 'LT', color: 'White', passengers: 7, seatbelts: true, condition: 'Excellent · Well maintained', insuranceType: 'Rideshare insured' },
    rates: { hourly: 55, flatLocal: 45, flatDistance: 85, emptyReturn: 60, payTiming: 'On pickup' },
    availability: { days: [true, true, true, true, true, true, false], daysText: 'Monday – Saturday', hours: '5:00 am – 9:00 pm', accepting: true },
    reviews: [
      'Tony is great for large groups. Fits everyone with luggage no problem.',
      'Super reliable. Great communication before pickup.',
      'The Suburban is perfect for our family of 6 with bags.',
    ],
  },
  'sarah-k': {
    id: 'sarah-k',
    firstName: 'Sarah',
    lastInitial: 'K',
    initials: 'SK',
    vehicleClass: 'comfort',
    rating: 4.87,
    rides: 312,
    airports: ['MCO'],
    vehicle: { year: 2022, make: 'Honda', model: 'Accord', trim: 'EX', color: 'Blue', passengers: 3, seatbelts: true, condition: 'Clean · Good condition', insuranceType: 'Rideshare insured' },
    rates: { hourly: 30, flatLocal: 20, flatDistance: 42, emptyReturn: 35, payTiming: 'On pickup' },
    availability: { days: [true, true, true, true, true, false, false], daysText: 'Monday – Friday', hours: '7:00 am – 8:00 pm', accepting: true },
    reviews: [
      'Sarah is always friendly and on time. Great value for comfort rides.',
      'Very safe driver. Car is always clean inside.',
      'Consistently reliable. My regular MCO driver.',
    ],
  },
  'james-w': {
    id: 'james-w',
    firstName: 'James',
    lastInitial: 'W',
    initials: 'JW',
    vehicleClass: 'xl',
    rating: 4.96,
    rides: 198,
    airports: ['MCO'],
    vehicle: { year: 2023, make: 'Ford', model: 'Explorer', trim: 'XLT', color: 'Gray', passengers: 5, seatbelts: true, condition: 'Excellent · Very clean', insuranceType: 'Rideshare insured' },
    rates: { hourly: 42, flatLocal: 32, flatDistance: 58, emptyReturn: 45, payTiming: 'On pickup' },
    availability: { days: [true, true, true, true, true, true, false], daysText: 'Monday – Saturday', hours: '6:00 am – 10:00 pm', accepting: true },
    reviews: [
      'James is awesome. Always professional, always on time.',
      'Great SUV for the price. Comfortable ride every time.',
      'Highly recommend James for airport runs.',
    ],
  },
};

function starsString(rating: number): string {
  const full = Math.round(rating);
  return '\u2605'.repeat(full) + '\u2606'.repeat(5 - full);
}

export default function DriverProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const airport = (params.airport as string).toUpperCase();
  const driverId = params.driverId as string;
  const airportCity = AIRPORT_NAMES[airport] || airport;

  const driver = DEMO_DRIVERS[driverId];

  if (!driver) {
    return (
      <>
        <div className="app-topbar">
          <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
          <div className="topbar-right"><div className="topbar-avatar">SC</div></div>
        </div>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <div className="t-display mb-8">{config.providerLabel} not found</div>
          <button className="btn btn-ghost" onClick={() => router.push(`/find-a-driver/${airport}`)}>
            &larr; Back to pool
          </button>
        </div>
      </>
    );
  }

  const vcLabel = driver.vehicleClass.toUpperCase();
  const avatarCls = driver.vehicleClass === 'black' ? 'av-black' : (driver.vehicleClass === 'comfort' ? 'av-amber' : 'av-navy');

  return (
    <>
      {/* Top bar */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-airport">
            <span style={{ fontSize: '12px' }}>&#9992;</span>
            <div className="ta-iata">{airport}</div>
            <div className="ta-name">{airportCity}</div>
          </div>
          <div className="topbar-avatar">SC</div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="layout-2col" style={{ gridTemplateColumns: '1fr 360px' }}>
        {/* Main content */}
        <div className="main-content" style={{ padding: 0 }}>
          {/* Banner */}
          <div className="profile-banner">
            <div className="pb-avatar">{driver.initials}</div>
            <div className="pb-class">
              <div className={`vc vc-${driver.vehicleClass}`} style={{ fontSize: '12px', padding: '5px 14px' }}>{vcLabel}</div>
            </div>
          </div>
          <div className="profile-body">
            <div className="profile-name">{driver.firstName} {driver.lastInitial}.</div>
            <div className="profile-meta">
              <div className="masked-code">
                <div className="mc-airport">{airport}</div>
                <div className="mc-initials">{driver.lastInitial[0]}**</div>
                <div className="mc-digits">****</div>
              </div>
              <span className="badge badge-green">&#9733; {driver.rating.toFixed(2)} &middot; {driver.rides} rides</span>
              <span className="badge badge-blue">&#9992; {airport}</span>
              <span className="badge badge-green">&#10003; Safety Protocol</span>
            </div>
            <div className="ins-strip mb-16">
              <div className="ins-dot"></div>
              <div className="ins-text">{driver.vehicle.insuranceType} &middot; {config.serviceName} verified &middot; Vehicle approved</div>
            </div>

            <div className="privacy-notice mb-16">
              <div className="pn-icon">&#128274;</div>
              <div className="pn-text">
                <strong>Contact info is hidden.</strong> {driver.firstName}&apos;s phone, email, and full {config.providerLabel.toLowerCase()} code unlock only after you send a connection request and your $9.99 matching fee is processed.
              </div>
            </div>

            <div className="t-label mb-8">Vehicle photos</div>
            <div className="vphoto-grid mb-4">
              <div><div className="vphoto vp-front">&#128663;</div><div className="vphoto-label">Front</div></div>
              <div><div className="vphoto vp-rear">&#128663;</div><div className="vphoto-label">Rear</div></div>
              <div><div className="vphoto vp-int-f">&#129681;</div><div className="vphoto-label">Interior front</div></div>
              <div><div className="vphoto vp-int-r">&#129681;</div><div className="vphoto-label">Interior rear</div></div>
            </div>
            <div className="mb-16">
              <span className="badge badge-green">&#10003; Vehicle approved by {config.serviceName} admin</span>
            </div>

            <div className="t-label mb-8">Vehicle details</div>
            <div className="card-surface mb-16">
              <div className="row"><span className="row-label">Make &amp; model</span><span className="row-value">{driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model} {driver.vehicle.trim}</span></div>
              <div className="row"><span className="row-label">Color</span><span className="row-value">{driver.vehicle.color}</span></div>
              <div className="row"><span className="row-label">Year</span><span className="row-value">{driver.vehicle.year}</span></div>
              <div className="row"><span className="row-label">Max passengers</span><span className="row-value">{driver.vehicle.passengers}</span></div>
              <div className="row"><span className="row-label">Seatbelts</span><span className="badge badge-green">&#10003; All confirmed</span></div>
              <div className="row"><span className="row-label">Condition</span><span className="row-value">{driver.vehicle.condition}</span></div>
            </div>

            <div className="t-label mb-8">Rates</div>
            <div className="card-surface mb-16">
              <div className="row"><span className="row-label">Hourly</span><span className="row-value">${driver.rates.hourly}/hr</span></div>
              <div className="row"><span className="row-label">Flat local (&le;10 mi)</span><span className="row-value">${driver.rates.flatLocal} flat</span></div>
              <div className="row"><span className="row-label">Distance (51+ mi)</span><span className="row-value">${driver.rates.flatDistance} flat</span></div>
              <div className="row"><span className="row-label">Empty return</span><span className="row-value">${driver.rates.emptyReturn} fixed</span></div>
              <div className="row"><span className="row-label">Pay timing</span><span className="row-value">{driver.rates.payTiming}</span></div>
            </div>

            <div className="t-label mb-8">Availability</div>
            <div className="card-surface mb-20">
              <div className="row"><span className="row-label">Days</span><span className="row-value">{driver.availability.daysText}</span></div>
              <div className="row"><span className="row-label">Hours</span><span className="row-value">{driver.availability.hours}</span></div>
              <div className="row"><span className="row-label">Accepting clients</span><span className="badge badge-green">&#9679; Open</span></div>
            </div>

            {/* Fee info box */}
            <div className="card-info mb-16" style={{ fontSize: 12, color: 'var(--blue)', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>&#8505; &nbsp;About the $9.99 one-time fee</div>
              This one-time fee gives you access to the full {config.serviceName} pool. If this driver does not respond or is unable to accept you can keep searching at no additional cost. Your Rider ID stays the same &mdash; you never register again.
              <div style={{ marginTop: 8, fontWeight: 500 }}>
                Already have a Rider ID from an invite? You never pay this fee.
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => router.push(`/find-a-driver/${airport}/${driverId}/register`)}
            >
              Request Connection &middot; $9.99 &rarr;
            </button>
            <button
              className="btn btn-ghost btn-full mt-8"
              onClick={() => router.push(`/find-a-driver/${airport}`)}
            >
              &larr; Back to pool
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="t-label mb-8">Ratings</div>
          <div className="card-surface mb-12 text-center" style={{ padding: '16px' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '40px', fontWeight: 800, color: 'var(--text-1)' }}>
              {driver.rating.toFixed(2)}
            </div>
            <div style={{ color: 'var(--amber)', fontSize: '20px', marginBottom: '6px' }}>
              {starsString(driver.rating)}
            </div>
            <div className="t-small">Based on {driver.rides} rides</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {driver.reviews.map((review, i) => (
              <div className="card-surface" key={i} style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5, fontStyle: 'italic' }}>
                &ldquo;{review}&rdquo;
              </div>
            ))}
          </div>

          <div className="t-label mb-8">Airports served</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
            {driver.airports.map((ap) => (
              <div className="airport-badge" key={ap} style={{ borderRadius: '10px' }}>
                <div style={{ fontSize: '16px' }}>&#9992;</div>
                <div>
                  <div className="ab-iata">{ap}</div>
                  <div className="ab-name">{AIRPORT_FULL_NAMES[ap] || `${AIRPORT_NAMES[ap] || ap} International`}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="t-label mb-8">After connecting</div>
          <div className="card-surface" style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Once {driver.firstName} approves your request, {driver.firstName.toLowerCase() === driver.firstName ? 'their' : `${driver.firstName}'s`} full {config.providerLabel.toLowerCase()} code and contact information unlock. You can book rides directly through {config.serviceName} from that point forward.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="site-footer">
        &copy; {config.copyrightYear} {config.serviceName}{' '}
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Conditions</a>
      </div>
    </>
  );
}
