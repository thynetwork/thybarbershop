import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

/**
 * GET /api/client/home
 * Returns client data, connected driver, and recent booking.
 * For now returns demo data; will integrate Supabase auth + queries.
 */
export async function GET(request: Request) {
  const supabase = getSupabaseServer();

  // TODO: Extract client ID from JWT session cookie
  // const session = await verifySession(cookieToken);

  // Demo response matching the UI requirements
  const client = {
    id: 'r1',
    name: 'Sarah Chen',
    initials: 'SC',
    email: 'sarah@email.com',
    role: 'rider',
    safetyProtocolComplete: true,
  };

  const connectedDriver = {
    id: 'd1',
    name: 'Marcus Rivera',
    initials: 'MR',
    code: 'MRC\u00B73341',
    codeInitials: 'MRC',
    codeDigits: '3341',
    rating: 4.97,
    airportPermitted: true,
    insuranceProvider: 'Allstate',
    insuranceType: 'Rideshare',
    rateHourly: 35,
    flatLocal: 25,
    vehicleMakeModel: '2022 Toyota Camry XSE',
    vehicleColor: 'Silver',
    vehicleSeats: 3,
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availabilityHours: '7:00 am \u2013 10:00 pm',
  };

  const connection = {
    id: 'c1',
    driverId: 'd1',
    clientId: 'r1',
    status: 'approved',
    setAmount: 120,
    savedRoute: 'Airport to Home',
  };

  const recentBooking = {
    id: 'b1',
    driverId: 'd1',
    clientId: 'r1',
    date: '2026-07-17',
    timeSlot: '9:00 am',
    pickupAddress: '456 Westheimer Rd, Houston TX',
    dropoffAddress: 'IAH Terminal C, Houston TX',
    status: 'confirmed',
    rateType: 'set_amount',
    rateAmount: 120,
    routeType: 'standard',
  };

  return NextResponse.json({
    client,
    connectedDriver,
    connection,
    recentBooking,
  });
}
