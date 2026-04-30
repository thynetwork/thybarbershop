/* GET /api/client/home
 *
 * Returns the logged-in client's home payload:
 *   - client { id, name, initials, email, role, safetyProtocolComplete, clientId }
 *   - connectedBarber  (most recently approved connection's barber, or null)
 *   - connection       (the approved connection row, or null)
 *   - recentBooking    (most recent booking with that barber, or null)
 *
 * Auth: requires a rider/client session.
 */

import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

function initialsFor(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'rider') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const clientId = session.userId;

  const { data: clientRow } = await supabase
    .from('users')
    .select('id, name, email, role, rider_id, preferred_name')
    .eq('id', clientId)
    .single();

  if (!clientRow) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const safetyR = await supabase
    .from('rider_safety_profiles')
    .select('completed_at')
    .eq('rider_id', clientId)
    .maybeSingle();

  const client = {
    id: clientRow.id,
    name: clientRow.preferred_name || clientRow.name || '',
    initials: initialsFor(clientRow.preferred_name || clientRow.name || ''),
    email: clientRow.email,
    role: clientRow.role,
    clientId: clientRow.rider_id,
    safetyProtocolComplete: !!safetyR.data?.completed_at,
  };

  // Most-recent approved connection (clients can connect with multiple barbers
  // but the home screen surfaces the latest one).
  const { data: connectionRow } = await supabase
    .from('connections')
    .select('id, driver_id, status, set_amount, source, created_at')
    .eq('rider_id', clientId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!connectionRow) {
    return NextResponse.json({
      client,
      connectedBarber: null,
      connection: null,
      recentBooking: null,
    });
  }

  const barberId = connectionRow.driver_id;

  const [barberRowR, barberUserR, vehicleR, recentBookingR] = await Promise.all([
    supabase
      .from('drivers')
      .select('id, code_initials, code_digits, airport_code, city, rate_hourly, flat_fee_local, available_24hrs, vehicle_class, airport_permitted, insurance_provider, insurance_type')
      .eq('id', barberId)
      .single(),
    supabase
      .from('users')
      .select('id, name')
      .eq('id', barberId)
      .single(),
    supabase
      .from('vehicles')
      .select('make, model, year, color, seats')
      .eq('driver_id', barberId)
      .limit(1)
      .maybeSingle(),
    supabase
      .from('bookings')
      .select('id, date, time_slot, pickup_address, dropoff_address, status, rate_amount, rate_type, route_type')
      .eq('rider_id', clientId)
      .eq('driver_id', barberId)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const b = barberRowR.data;
  const bu = barberUserR.data;
  const v = vehicleR.data;
  const rb = recentBookingR.data;

  // Average rating for the connected barber (cheap secondary fetch).
  let rating: number | null = null;
  if (b) {
    const { data: ratingsRows } = await supabase
      .from('ratings')
      .select('stars')
      .eq('driver_id', barberId);
    if (ratingsRows && ratingsRows.length > 0) {
      rating = Number((ratingsRows.reduce((s, r) => s + (r.stars as number), 0) / ratingsRows.length).toFixed(2));
    }
  }

  const fullName = bu?.name || 'Barber';
  const parts = fullName.split(/\s+/).filter(Boolean);

  const connectedBarber = b ? {
    id: b.id,
    name: fullName,
    initials: initialsFor(fullName),
    code: `${b.code_initials}·${b.code_digits}`,
    codeInitials: b.code_initials,
    codeDigits: b.code_digits,
    rating,
    airportPermitted: !!b.airport_permitted,
    insuranceProvider: b.insurance_provider,
    insuranceType: b.insurance_type,
    rateHourly: Number(b.rate_hourly ?? 0),
    flatLocal: Number(b.flat_fee_local ?? 0),
    vehicleMakeModel: v ? `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim() : null,
    vehicleColor: v?.color ?? null,
    vehicleSeats: v?.seats ?? null,
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // availability_json TBD
    availabilityHours: b.available_24hrs ? '24 hours' : '',
    firstName: parts[0] || 'Barber',
  } : null;

  return NextResponse.json({
    client,
    connectedBarber,
    connection: {
      id: connectionRow.id,
      barberId: connectionRow.driver_id,
      clientId: clientId,
      status: connectionRow.status,
      setAmount: connectionRow.set_amount,
      source: connectionRow.source,
    },
    recentBooking: rb ? {
      id: rb.id,
      barberId: barberId,
      clientId: clientId,
      date: rb.date,
      timeSlot: rb.time_slot,
      pickupAddress: rb.pickup_address,
      dropoffAddress: rb.dropoff_address,
      status: rb.status,
      rateType: rb.rate_type,
      rateAmount: Number(rb.rate_amount ?? 0),
      routeType: rb.route_type,
    } : null,
  });
}
