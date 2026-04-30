/* GET /api/barber/dashboard
 *
 * Returns the logged-in barber's dashboard payload:
 *   - stats (this week, this month, pending requests, active clients)
 *   - bookingRequests (pending bookings)
 *   - clientRequests (pending connection requests)
 *   - upcomingBookings (confirmed, today onward)
 *   - todaySchedule (today's appointments)
 *   - credentials snapshot
 *   - license fields powering DD1A banner
 *
 * Auth: requires a driver session (cookie-backed JWT).
 */

import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

function startOfDayISO(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return x.toISOString().slice(0, 10);
}

function startOfWeekISO(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  // Monday-week start. Adjust if you prefer Sunday.
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

function startOfMonthISO(d = new Date()): string {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'driver') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const barberId = session.userId;

  const today = startOfDayISO();
  const weekStart = startOfWeekISO();
  const monthStart = startOfMonthISO();

  // Run independent reads in parallel.
  const [barberRowR, weekR, monthR, pendingConnectionsR, activeConnectionsR, todayBookingsR, pendingBookingsR, upcomingBookingsR] = await Promise.all([
    supabase
      .from('drivers')
      .select('barber_license_number, barber_license_expiry, license_verified, airport_permitted, insurance_provider, insurance_type')
      .eq('id', barberId)
      .single(),
    supabase
      .from('bookings')
      .select('rate_amount')
      .eq('driver_id', barberId)
      .eq('status', 'completed')
      .gte('date', weekStart),
    supabase
      .from('bookings')
      .select('rate_amount')
      .eq('driver_id', barberId)
      .eq('status', 'completed')
      .gte('date', monthStart),
    supabase
      .from('connections')
      .select('id', { count: 'exact', head: true })
      .eq('driver_id', barberId)
      .eq('status', 'pending'),
    supabase
      .from('connections')
      .select('rider_id', { count: 'exact', head: true })
      .eq('driver_id', barberId)
      .eq('status', 'approved'),
    supabase
      .from('bookings')
      .select('id, date, time_slot, pickup_address, dropoff_address, status, rate_amount, rate_type, rider_id')
      .eq('driver_id', barberId)
      .eq('date', today)
      .in('status', ['confirmed', 'pending'])
      .order('time_slot', { ascending: true }),
    supabase
      .from('bookings')
      .select('id, date, time_slot, pickup_address, dropoff_address, rate_amount, rate_type, route_type, rider_id')
      .eq('driver_id', barberId)
      .eq('status', 'pending')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(10),
    supabase
      .from('bookings')
      .select('id, date, time_slot, pickup_address, dropoff_address, rate_amount, rate_type, route_type, rider_id, status')
      .eq('driver_id', barberId)
      .eq('status', 'confirmed')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(10),
  ]);

  const barberRow = barberRowR.data;
  const sumAmount = (rows: { rate_amount: number | null }[] | null | undefined) =>
    Math.round((rows || []).reduce((s, r) => s + Number(r.rate_amount ?? 0), 0));

  // Hydrate client names for the booking lists in a second batched query.
  const allRiderIds = Array.from(new Set([
    ...(todayBookingsR.data || []).map(b => b.rider_id),
    ...(pendingBookingsR.data || []).map(b => b.rider_id),
    ...(upcomingBookingsR.data || []).map(b => b.rider_id),
  ].filter(Boolean) as string[]));

  let usersById: Record<string, { name: string | null; rider_id: string | null; preferred_name: string | null }> = {};
  if (allRiderIds.length > 0) {
    const { data: users } = await supabase
      .from('users')
      .select('id, name, rider_id, preferred_name')
      .in('id', allRiderIds);
    usersById = Object.fromEntries((users || []).map(u => [u.id as string, u]));
  }

  function clientFor(riderId: string | null) {
    const u = riderId ? usersById[riderId] : null;
    const name = u?.preferred_name || u?.name || 'Client';
    const initials = name.split(/\s+/).map(p => p[0]?.toUpperCase()).filter(Boolean).slice(0, 2).join('') || 'C';
    return { name, initials, clientId: u?.rider_id || '' };
  }

  return NextResponse.json({
    stats: {
      thisWeek: sumAmount(weekR.data),
      thisMonth: sumAmount(monthR.data),
      pendingRequests: pendingConnectionsR.count ?? 0,
      activeClients: activeConnectionsR.count ?? 0,
    },
    insurance: {
      provider: barberRow?.insurance_provider ?? null,
      coverageType: barberRow?.insurance_type ?? null,
      policyActive: !!barberRow?.insurance_provider,
    },
    bookingRequests: (pendingBookingsR.data || []).map(b => ({
      id: b.id,
      ...clientFor(b.rider_id as string | null),
      date: b.date,
      time: b.time_slot,
      route: [b.pickup_address, b.dropoff_address].filter(Boolean).join(' → ') || null,
      amount: b.rate_amount,
      type: b.rate_type,
    })),
    clientRequests: [], // filled by /api/barber/notifications-style endpoint; left empty here
    upcomingBookings: (upcomingBookingsR.data || []).map(b => ({
      id: b.id,
      ...clientFor(b.rider_id as string | null),
      date: b.date,
      time: b.time_slot,
      route: [b.pickup_address, b.dropoff_address].filter(Boolean).join(' → ') || null,
      amount: b.rate_amount,
      type: b.rate_type,
      status: b.status,
    })),
    todaySchedule: (todayBookingsR.data || []).map(b => ({
      id: b.id,
      ...clientFor(b.rider_id as string | null),
      time: b.time_slot,
      route: [b.pickup_address, b.dropoff_address].filter(Boolean).join(' → ') || null,
      amount: b.rate_amount,
      type: b.rate_type,
      status: b.status,
    })),
    credentials: {
      safetyProtocol: 'unknown',
      barbersLicense: barberRow?.license_verified ? 'verified' : 'pending',
      airportPermit: barberRow?.airport_permitted ? 'active' : 'inactive',
      insurance: barberRow?.insurance_provider ?? null,
    },
    licenseNumber: barberRow?.barber_license_number ?? null,
    licenseExpiry: barberRow?.barber_license_expiry ?? null,
    licenseVerified: !!barberRow?.license_verified,
  });
}
