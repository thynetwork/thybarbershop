/* GET /api/find-a-barber/[zip]
 *
 * Pool search for clients. The [zip] param is a 5-digit US zip code.
 * Pool rule matches if barber.zip_code === zip OR
 * barber.service_areas @> [zip].
 *
 * Query params:
 *   sort:   'rating' | 'rate-low' | 'rate-high' | 'rides' (default rating)
 *
 * Returns a list of approved (is_active=true) barbers with masked codes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

interface DriverRow {
  id: string;
  code_initials: string;
  code_digits: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  service_areas: string[] | null;
  rate_hourly: number | null;
  flat_fee_local: number | null;
  available_24hrs: boolean | null;
  license_verified: boolean | null;
  is_active: boolean | null;
}

interface UserRow { id: string; name: string | null; }

interface RatingRow { driver_id: string; stars: number; }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ zip: string }> }
) {
  const { zip: rawZip } = await params;
  const zip = /^\d{5}$/.test(rawZip) ? rawZip : null;

  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'rating';

  if (!zip) {
    return NextResponse.json(
      { success: false, error: 'A 5-digit zip is required.' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();

  const { data: driverRows, error: driversErr } = await supabase
    .from('drivers')
    .select('id, code_initials, code_digits, city, state, zip_code, service_areas, rate_hourly, flat_fee_local, available_24hrs, license_verified, is_active')
    .eq('is_active', true)
    .or(`zip_code.eq.${zip},service_areas.cs.{${zip}}`)
    .limit(50);

  if (driversErr) {
    console.error('Pool query failed:', driversErr);
    return NextResponse.json({ success: false, error: 'Pool query failed.' }, { status: 500 });
  }

  const barberRows = (driverRows as DriverRow[] | null) || [];
  if (barberRows.length === 0) {
    return NextResponse.json({ success: true, zip, total: 0, barbers: [] });
  }

  const ids = barberRows.map(b => b.id);

  const [usersR, ratingsR] = await Promise.all([
    supabase.from('users').select('id, name').in('id', ids),
    supabase.from('ratings').select('driver_id, stars').in('driver_id', ids),
  ]);

  const userById = new Map<string, UserRow>(((usersR.data as UserRow[] | null) || []).map(u => [u.id, u]));
  const ratingsByBarber = new Map<string, number[]>();
  for (const r of (ratingsR.data as RatingRow[] | null || [])) {
    if (!ratingsByBarber.has(r.driver_id)) ratingsByBarber.set(r.driver_id, []);
    ratingsByBarber.get(r.driver_id)!.push(r.stars);
  }

  const barbers = barberRows.map(b => {
    const user = userById.get(b.id);
    const stars = ratingsByBarber.get(b.id) || [];
    const avgRating = stars.length ? Number((stars.reduce((s, n) => s + n, 0) / stars.length).toFixed(2)) : 0;

    const fullName = user?.name || 'Barber';
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || 'Barber';
    const lastInitial = parts[1]?.[0] || '';
    const initials = (firstName[0] || '?') + (lastInitial || '');

    return {
      id: b.id,
      firstName,
      lastInitial,
      initials,
      rating: avgRating,
      visits: stars.length,
      zipCode: b.zip_code || '',
      serviceAreas: b.service_areas || [],
      city: b.city || '',
      state: b.state || '',
      maskedCode: {
        city: b.city || '',
        state: b.state || '',
        initials: (b.code_initials?.[0] || '') + '**',
        digits: '****',
      },
      rates: {
        hourly: Number(b.rate_hourly ?? 0),
        flatLocal: Number(b.flat_fee_local ?? 0),
      },
      availability: {
        days: [true, true, true, true, true, true, false], // availability_json TBD
        hours: b.available_24hrs ? '24 hours' : '',
      },
      verified: !!b.license_verified,
    };
  });

  barbers.sort((a, b) => {
    switch (sort) {
      case 'rating': return b.rating - a.rating;
      case 'rate-low': return a.rates.hourly - b.rates.hourly;
      case 'rate-high': return b.rates.hourly - a.rates.hourly;
      case 'rides':
      case 'visits': return b.visits - a.visits;
      default: return b.rating - a.rating;
    }
  });

  return NextResponse.json({
    success: true,
    zip,
    total: barbers.length,
    barbers,
  });
}
