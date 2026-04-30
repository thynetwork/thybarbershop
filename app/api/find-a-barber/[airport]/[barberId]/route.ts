/* GET /api/find-a-barber/[airport]/[barberId]
 *
 * Detailed public profile for a single barber. Used by the
 * Find-a-Barber detail screen.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ airport: string; barberId: string }> }
) {
  const { airport, barberId } = await params;
  const supabase = getSupabaseServer();

  const [driverR, userR, vehicleR, ratingsR] = await Promise.all([
    supabase
      .from('drivers')
      .select('id, code_initials, code_digits, airport_code, city, state, vehicle_class, rate_hourly, flat_fee_local, flat_fee_distance, empty_return_value, payment_timing, available_24hrs, license_verified, is_active, airport_permitted, insurance_type, insurance_provider')
      .eq('id', barberId)
      .single(),
    supabase
      .from('users')
      .select('id, name')
      .eq('id', barberId)
      .single(),
    supabase
      .from('vehicles')
      .select('make, model, year, color, seats, seatbelt_confirmed')
      .eq('driver_id', barberId)
      .limit(1)
      .maybeSingle(),
    supabase
      .from('ratings')
      .select('stars, comment, created_at')
      .eq('driver_id', barberId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  if (!driverR.data || !driverR.data.is_active) {
    return NextResponse.json({ success: false, error: 'Barber not found' }, { status: 404 });
  }

  const d = driverR.data;
  const u = userR.data;
  const v = vehicleR.data;
  const ratings = (ratingsR.data || []) as { stars: number; comment: string | null }[];

  const stars = ratings.map(r => r.stars);
  const avgRating = stars.length ? Number((stars.reduce((s, n) => s + n, 0) / stars.length).toFixed(2)) : 0;
  const reviews = ratings
    .map(r => r.comment)
    .filter((c): c is string => !!c && c.trim().length > 0)
    .slice(0, 3);

  const fullName = u?.name || 'Barber';
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = parts[0] || 'Barber';
  const lastInitial = parts[1]?.[0] || '';
  const initials = (firstName[0] || '?') + (lastInitial || '');

  const profile = {
    id: d.id,
    firstName,
    lastInitial,
    initials,
    vehicleClass: d.vehicle_class || 'comfort',
    rating: avgRating,
    rides: stars.length,
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
      condition: '',
      insuranceType: d.insurance_type || 'Licensed barber',
    } : null,
    rates: {
      hourly: Number(d.rate_hourly ?? 0),
      flatLocal: Number(d.flat_fee_local ?? 0),
      flatDistance: Number(d.flat_fee_distance ?? 0),
      emptyReturn: Number(d.empty_return_value ?? 0),
      payTiming: d.payment_timing === 'on_pickup' ? 'On pickup'
        : d.payment_timing === 'at_booking' ? 'At booking'
        : d.payment_timing === 'end_of_ride' ? 'End of ride'
        : '',
    },
    availability: {
      days: [true, true, true, true, true, true, true],
      daysText: '',
      hours: d.available_24hrs ? '24 hours · 7 days' : '',
      accepting: !!d.is_active,
    },
    reviews,
    verified: !!d.license_verified,
    safetyProtocol: true,
  };

  return NextResponse.json({
    success: true,
    airport: airport.toUpperCase(),
    barber: profile,
  });
}
