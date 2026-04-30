/* GET /api/find-a-barber/[airport]
 *
 * Pool search for clients. The [airport] param is treated as either
 * an airport code (legacy) or a 5-digit zip — pool rule matches if
 * barber.zip_code === zip OR barber.service_areas @> [zip].
 *
 * Query params:
 *   class:  'all' | 'comfort' | 'xl' | 'xl_mid' | 'xl_large' | 'black'
 *   sort:   'rating' | 'rate-low' | 'rate-high' | 'rides' | 'distance' (default rating)
 *
 * Returns a list of approved (is_active=true) barbers with masked codes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

interface DriverRow {
  id: string;
  code_initials: string;
  code_digits: string;
  airport_code: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  service_areas: string[] | null;
  vehicle_class: string | null;
  rate_hourly: number | null;
  flat_fee_local: number | null;
  available_24hrs: boolean | null;
  license_verified: boolean | null;
  is_active: boolean | null;
}

interface UserRow { id: string; name: string | null; }

interface VehicleRow {
  driver_id: string;
  make: string | null; model: string | null; year: number | null;
  color: string | null; seats: number | null; seatbelt_confirmed: boolean | null;
}

interface RatingRow { driver_id: string; stars: number; }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ airport: string }> }
) {
  const { airport: routeParam } = await params;
  const isZip = /^\d{5}$/.test(routeParam);
  const zip = isZip ? routeParam : null;
  const airportUpper = !isZip ? routeParam.toUpperCase() : null;

  const { searchParams } = new URL(request.url);
  const classFilter = searchParams.get('class') || 'all';
  const sort = searchParams.get('sort') || 'rating';

  const supabase = getSupabaseServer();

  // Base query: active barbers only.
  let query = supabase
    .from('drivers')
    .select('id, code_initials, code_digits, airport_code, city, state, zip_code, service_areas, vehicle_class, rate_hourly, flat_fee_local, available_24hrs, license_verified, is_active')
    .eq('is_active', true);

  if (zip) {
    // Match either zip_code OR service_areas array contains zip.
    // Supabase OR + contains: use `.or()` with PostgREST syntax.
    query = query.or(`zip_code.eq.${zip},service_areas.cs.{${zip}}`);
  } else if (airportUpper) {
    query = query.eq('airport_code', airportUpper);
  }

  if (classFilter !== 'all') {
    query = query.eq('vehicle_class', classFilter);
  }

  const { data: driverRows, error: driversErr } = await query.limit(50);
  if (driversErr) {
    console.error('Pool query failed:', driversErr);
    return NextResponse.json({ success: false, error: 'Pool query failed.' }, { status: 500 });
  }

  const drivers = (driverRows as DriverRow[] | null) || [];
  if (drivers.length === 0) {
    return NextResponse.json({ success: true, zip, airport: airportUpper, total: 0, barbers: [] });
  }

  const ids = drivers.map(d => d.id);

  // Hydrate names, vehicles, ratings in parallel.
  const [usersR, vehiclesR, ratingsR] = await Promise.all([
    supabase.from('users').select('id, name').in('id', ids),
    supabase.from('vehicles').select('driver_id, make, model, year, color, seats, seatbelt_confirmed').in('driver_id', ids),
    supabase.from('ratings').select('driver_id, stars').in('driver_id', ids),
  ]);

  const userById = new Map<string, UserRow>((usersR.data as UserRow[] | null || []).map(u => [u.id, u]));
  const vehicleByDriver = new Map<string, VehicleRow>((vehiclesR.data as VehicleRow[] | null || []).map(v => [v.driver_id, v]));
  const ratingsByDriver = new Map<string, number[]>();
  for (const r of (ratingsR.data as RatingRow[] | null || [])) {
    if (!ratingsByDriver.has(r.driver_id)) ratingsByDriver.set(r.driver_id, []);
    ratingsByDriver.get(r.driver_id)!.push(r.stars);
  }

  const barbers = drivers.map(d => {
    const user = userById.get(d.id);
    const v = vehicleByDriver.get(d.id);
    const stars = ratingsByDriver.get(d.id) || [];
    const avgRating = stars.length ? Number((stars.reduce((s, n) => s + n, 0) / stars.length).toFixed(2)) : 0;

    const fullName = user?.name || 'Barber';
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || 'Barber';
    const lastInitial = parts[1]?.[0] || '';
    const initials = (firstName[0] || '?') + (lastInitial || '');

    return {
      id: d.id,
      firstName,
      lastInitial,
      initials,
      vehicleClass: d.vehicle_class || 'comfort',
      rating: avgRating,
      rides: stars.length,
      zipCode: d.zip_code || '',
      serviceAreas: d.service_areas || [],
      city: d.city || '',
      state: d.state || '',
      distanceMiles: 0, // No lat/lng yet — distance computed client-side once geocoding lands
      airports: d.airport_code ? [d.airport_code] : [],
      maskedCode: {
        airport: d.city || d.airport_code || '',
        initials: (d.code_initials?.[0] || '') + '**',
        digits: '****',
      },
      vehicle: v ? {
        year: v.year || 0,
        make: v.make || '',
        model: v.model || '',
        trim: '',
        color: v.color || '',
        passengers: v.seats || 0,
        seatbelts: !!v.seatbelt_confirmed,
        insuranceType: 'Licensed barber',
      } : null,
      rates: {
        hourly: Number(d.rate_hourly ?? 0),
        flatLocal: Number(d.flat_fee_local ?? 0),
      },
      availability: {
        days: [true, true, true, true, true, true, false], // availability_json TBD
        hours: d.available_24hrs ? '24 hours' : '',
      },
      verified: !!d.license_verified,
    };
  });

  // Sorts.
  barbers.sort((a, b) => {
    switch (sort) {
      case 'rating': return b.rating - a.rating;
      case 'rate-low': return a.rates.hourly - b.rates.hourly;
      case 'rate-high': return b.rates.hourly - a.rates.hourly;
      case 'rides': return b.rides - a.rides;
      default: return b.rating - a.rating;
    }
  });

  return NextResponse.json({
    success: true,
    zip,
    airport: airportUpper,
    total: barbers.length,
    barbers,
  });
}
