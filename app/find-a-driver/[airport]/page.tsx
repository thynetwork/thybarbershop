'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { config, splitServiceName } from '@/lib/config';

type VehicleClass = 'all' | 'comfort' | 'xl' | 'black' | 'xll';
type SortBy = 'rating' | 'availability' | 'rate-low' | 'rate-high';

interface DemoDriver {
  id: string;
  firstName: string;
  lastInitial: string;
  initials: string;
  vehicleClass: 'comfort' | 'xl' | 'black' | 'xll';
  rating: number;
  rides: number;
  airports: string[];
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string;
    color: string;
    passengers: number;
    seatbelts: boolean;
    insuranceType: string;
  };
  rates: { hourly: number; flatLocal: number };
  availability: {
    days: boolean[];
    hours: string;
  };
}

const AIRPORT_NAMES: Record<string, string> = {
  IAH: 'Houston',
  MCO: 'Orlando',
  ATL: 'Atlanta',
  LAX: 'Los Angeles',
  DFW: 'Dallas',
  ORD: 'Chicago',
  JFK: 'New York',
  MIA: 'Miami',
  SFB: 'Sanford',
};

const AIRPORT_FULL_NAMES: Record<string, string> = {
  IAH: 'George Bush Intercontinental',
  MCO: 'Orlando International',
  ATL: 'Hartsfield-Jackson International',
  LAX: 'Los Angeles International',
  DFW: 'Dallas/Fort Worth International',
  ORD: "O'Hare International",
  JFK: 'John F. Kennedy International',
  MIA: 'Miami International',
};

const DEMO_DRIVERS: DemoDriver[] = [
  {
    id: 'ray-r',
    firstName: 'Ray',
    lastInitial: 'R',
    initials: 'RR',
    vehicleClass: 'comfort',
    rating: 4.94,
    rides: 187,
    airports: ['MCO'],
    vehicle: { year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE', color: 'Silver', passengers: 3, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 32, flatLocal: 22 },
    availability: { days: [true, true, true, true, true, true, false], hours: '6:00 am – 11:00 pm' },
  },
  {
    id: 'david-m',
    firstName: 'David',
    lastInitial: 'M',
    initials: 'DM',
    vehicleClass: 'xl',
    rating: 4.98,
    rides: 243,
    airports: ['MCO', 'SFB'],
    vehicle: { year: 2022, make: 'Toyota', model: 'Highlander', trim: 'XLE', color: 'Black', passengers: 6, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 45, flatLocal: 35 },
    availability: { days: [true, true, true, true, true, false, false], hours: '5:00 am – 10:00 pm' },
  },
  {
    id: 'marcus-s',
    firstName: 'Marcus',
    lastInitial: 'S',
    initials: 'MS',
    vehicleClass: 'black',
    rating: 5.0,
    rides: 89,
    airports: ['MCO'],
    vehicle: { year: 2023, make: 'Cadillac', model: 'CT5', trim: 'Premium', color: 'Black', passengers: 4, seatbelts: true, insuranceType: 'Commercial livery' },
    rates: { hourly: 75, flatLocal: 65 },
    availability: { days: [true, true, true, true, true, true, true], hours: '24 hours · 7 days' },
  },
  {
    id: 'tony-v',
    firstName: 'Tony',
    lastInitial: 'V',
    initials: 'TV',
    vehicleClass: 'xll',
    rating: 4.91,
    rides: 156,
    airports: ['MCO'],
    vehicle: { year: 2023, make: 'Chevrolet', model: 'Suburban', trim: 'LT', color: 'White', passengers: 7, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 55, flatLocal: 45 },
    availability: { days: [true, true, true, true, true, true, false], hours: '5:00 am – 9:00 pm' },
  },
  {
    id: 'sarah-k',
    firstName: 'Sarah',
    lastInitial: 'K',
    initials: 'SK',
    vehicleClass: 'comfort',
    rating: 4.87,
    rides: 312,
    airports: ['MCO'],
    vehicle: { year: 2022, make: 'Honda', model: 'Accord', trim: 'EX', color: 'Blue', passengers: 3, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 30, flatLocal: 20 },
    availability: { days: [true, true, true, true, true, false, false], hours: '7:00 am – 8:00 pm' },
  },
  {
    id: 'james-w',
    firstName: 'James',
    lastInitial: 'W',
    initials: 'JW',
    vehicleClass: 'xl',
    rating: 4.96,
    rides: 198,
    airports: ['MCO'],
    vehicle: { year: 2023, make: 'Ford', model: 'Explorer', trim: 'XLT', color: 'Gray', passengers: 5, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 42, flatLocal: 32 },
    availability: { days: [true, true, true, true, true, true, false], hours: '6:00 am – 10:00 pm' },
  },
];

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function starsString(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export default function AirportPoolPage() {
  const params = useParams();
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();
  const airport = (params.airport as string).toUpperCase();
  const airportCity = AIRPORT_NAMES[airport] || airport;
  const airportFull = AIRPORT_FULL_NAMES[airport] || `${airportCity} International`;

  const [classFilter, setClassFilter] = useState<VehicleClass>('all');
  const [sortBy, setSortBy] = useState<SortBy>('rating');

  const filteredDrivers = useMemo(() => {
    let drivers = [...DEMO_DRIVERS];
    if (classFilter !== 'all') {
      drivers = drivers.filter((d) => d.vehicleClass === classFilter);
    }
    drivers.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'rate-low': return a.rates.hourly - b.rates.hourly;
        case 'rate-high': return b.rates.hourly - a.rates.hourly;
        default: return b.rides - a.rides;
      }
    });
    return drivers;
  }, [classFilter, sortBy]);

  const avatarClass = (vc: string) => {
    if (vc === 'black') return 'av-black';
    if (vc === 'xl') return 'av-navy';
    if (vc === 'xll') return 'av-navy';
    return 'av-amber';
  };

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

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-label">Vehicle class</div>
        <button className={`filter-opt ${classFilter === 'all' ? 'fo-all' : ''}`} onClick={() => setClassFilter('all')}>All Classes</button>
        <button className={`filter-opt ${classFilter === 'comfort' ? 'fo-all' : 'fo-comfort'}`} onClick={() => setClassFilter('comfort')}>Comfort</button>
        <button className={`filter-opt ${classFilter === 'xl' ? 'fo-all' : 'fo-xl'}`} onClick={() => setClassFilter('xl')}>XL</button>
        <button className={`filter-opt ${classFilter === 'black' ? 'fo-all' : 'fo-black'}`} onClick={() => setClassFilter('black')}>Black</button>
        <button className={`filter-opt ${classFilter === 'xll' ? 'fo-all' : 'fo-xll'}`} onClick={() => setClassFilter('xll')}>XLL</button>
        <div className="filter-sort">
          <span>Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
            <option value="rating">&#9733; Rating</option>
            <option value="availability">Availability</option>
            <option value="rate-low">Rate: Low to High</option>
            <option value="rate-high">Rate: High to Low</option>
          </select>
        </div>
      </div>

      {/* Pool header */}
      <div className="pool-header mb-8">
        <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>
          <strong style={{ color: 'var(--text-1)' }}>{filteredDrivers.length} {config.providerLabel.toLowerCase()}s</strong> accepting new clients at {airport} &middot; {airportFull}
        </div>
        <div className="t-small">$9.99 one-time access fee &middot; No additional charges to keep searching &middot; Your Rider ID stays the same</div>
      </div>

      {/* Pool grid */}
      <div className="pool-grid">
        {filteredDrivers.map((driver) => (
          <div className="pool-card" key={driver.id}>
            <div className={`pc-photo pc-photo-${driver.vehicleClass}`}>
              <div className={`avatar ${avatarClass(driver.vehicleClass)} av-lg`}>{driver.initials}</div>
              <div className="pc-class-tag">
                <div className={`vc vc-${driver.vehicleClass}`}>{driver.vehicleClass.toUpperCase()}</div>
              </div>
              <div className="pc-verified">&#10003; Verified</div>
            </div>
            <div className="pc-body">
              <div className="pc-name">{driver.firstName} {driver.lastInitial}.</div>
              <div style={{ marginBottom: '8px' }}>
                <div className="masked-code">
                  <div className="mc-airport">{airport}</div>
                  <div className="mc-initials">{driver.lastInitial[0]}**</div>
                  <div className="mc-digits">****</div>
                </div>
              </div>
              <div className="pc-rating">
                <span className="pc-stars">{starsString(driver.rating)}</span>
                <span>{driver.rating.toFixed(2)} &middot; {driver.rides} rides</span>
              </div>
              <div className="pc-airports mb-8">
                {driver.airports.map((ap) => (
                  <div className="airport-badge-sm" key={ap}>
                    <div className="abs-iata">{ap}</div>
                  </div>
                ))}
              </div>
              <div className="pc-vehicle">
                <div className="pcv-make">{driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model} {driver.vehicle.trim}</div>
                <div className="pcv-detail">{driver.vehicle.color} &middot; {driver.vehicle.passengers} passengers &middot; {driver.vehicle.seatbelts ? '✓ Seatbelts' : ''}</div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
                  <span className="badge badge-green" style={{ fontSize: '9px' }}>&#10003; Approved</span>
                  <span className="badge badge-blue" style={{ fontSize: '9px' }}>{driver.vehicle.insuranceType}</span>
                </div>
              </div>
              <div className="pc-rates">
                <div className="pc-rate-box"><div className="prb-label">Hourly</div><div className="prb-value">${driver.rates.hourly}/hr</div></div>
                <div className="pc-rate-box"><div className="prb-label">Flat local</div><div className="prb-value">${driver.rates.flatLocal}</div></div>
              </div>
              <div className="t-label mb-4">Availability</div>
              <div className="pc-days">
                {DAY_LABELS.map((day, i) => (
                  <div className={`pd-day ${driver.availability.days[i] ? 'pd-on' : 'pd-off'}`} key={i}>{day}</div>
                ))}
              </div>
              <div className="t-small mb-8">{driver.availability.hours}</div>
              <div className="pc-buttons">
                <button className="pcb-view" onClick={() => router.push(`/find-a-driver/${airport}/${driver.id}`)}>View Profile</button>
                <button className="pcb-request" onClick={() => router.push(`/find-a-driver/${airport}/${driver.id}/request`)}>Request &middot; $9.99</button>
              </div>
            </div>
          </div>
        ))}
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
