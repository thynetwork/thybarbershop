import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { sendBookingNotification } from '@/lib/notifications';
import { scheduleEscalation } from '@/lib/escalation';
import config from '@/lib/config';

/**
 * GET /api/booking
 * Returns bookings for the authenticated user.
 */
export async function GET(request: Request) {
  const supabase = getSupabaseServer();

  // TODO: Extract user ID from JWT session cookie and filter bookings

  const bookings = [
    {
      id: 'b1',
      driverId: 'd1',
      riderId: 'r1',
      driverName: 'Marcus Rivera',
      driverCode: 'MRC\u00B73341',
      date: '2026-07-17',
      timeSlot: '9:00 am',
      pickupAddress: '456 Westheimer Rd, Houston TX',
      dropoffAddress: '456 Main St, South Houston TX',
      estimatedMiles: 25,
      routeType: 'standard',
      status: 'confirmed',
      rateType: 'set_amount',
      rateAmount: 120,
      paymentTiming: 'on_pickup',
      createdAt: '2026-07-10T14:30:00Z',
    },
    {
      id: 'b2',
      driverId: 'd1',
      riderId: 'r1',
      driverName: 'Marcus Rivera',
      driverCode: 'MRC\u00B73341',
      date: '2026-07-19',
      timeSlot: '6:00 am',
      pickupAddress: '456 Westheimer Rd, Houston TX',
      dropoffAddress: '800 Congress Ave, Austin TX',
      estimatedMiles: 165,
      routeType: 'longhaul',
      status: 'pending',
      rateType: 'hourly',
      rateAmount: 210,
      driverEstimate: 187.5,
      driverFinalPrice: 210,
      driverAdjustmentReason: 'hours',
      driverAdjustmentNote: 'Early morning rate applies before 7am.',
      paymentTiming: 'on_pickup',
      createdAt: '2026-07-12T09:00:00Z',
    },
  ];

  return NextResponse.json({ bookings });
}

/**
 * POST /api/booking
 * Creates a new booking.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseServer();

  try {
    const body = await request.json();

    const {
      driverId,
      riderId,
      date,
      timeSlot,
      pickupAddress,
      dropoffAddress,
      estimatedMiles,
      routeType,
      rateType,
      rateAmount,
    } = body;

    // Validate required fields
    if (!driverId || !riderId || !date || !timeSlot || !pickupAddress || !dropoffAddress) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    // Determine route type from miles
    const computedRouteType = routeType || (estimatedMiles > 51 ? 'longhaul' : 'standard');

    // TODO: Insert into Supabase bookings table
    // const { data, error } = await supabase.from('bookings').insert({ ... });

    const newBooking = {
      id: `b_${Date.now()}`,
      driverId,
      riderId,
      date,
      timeSlot,
      pickupAddress,
      dropoffAddress,
      estimatedMiles: estimatedMiles || null,
      routeType: computedRouteType,
      status: 'pending',
      rateType: rateType || 'set_amount',
      rateAmount: rateAmount || null,
      paymentTiming: 'on_pickup',
      createdAt: new Date().toISOString(),
    };

    // Fetch driver and rider details for notifications
    const { data: driverUser } = await supabase
      .from('users')
      .select('id, name, phone, email')
      .eq('id', driverId)
      .single();

    const { data: riderUser } = await supabase
      .from('users')
      .select('id, name, phone, email, rider_id, preferred_name')
      .eq('id', riderId)
      .single();

    // Count previous bookings between this rider and driver
    const { count: previousBookingCount } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('driver_id', driverId)
      .eq('rider_id', riderId)
      .eq('status', 'completed');

    // Send notifications to the driver (all channels)
    if (driverUser && riderUser) {
      await sendBookingNotification(
        {
          id: newBooking.id,
          date: newBooking.date,
          timeSlot: newBooking.timeSlot,
          pickupAddress: newBooking.pickupAddress,
          dropoffAddress: newBooking.dropoffAddress,
          rateAmount: newBooking.rateAmount,
          rateType: newBooking.rateType,
          routeType: newBooking.routeType,
        },
        {
          id: driverUser.id,
          name: driverUser.name,
          phone: driverUser.phone || undefined,
          email: driverUser.email || undefined,
        },
        {
          id: riderUser.id,
          name: riderUser.name,
          riderId: riderUser.rider_id || undefined,
          preferredName: riderUser.preferred_name || undefined,
          phone: riderUser.phone || undefined,
          email: riderUser.email || undefined,
          previousBookingCount: previousBookingCount || 0,
        }
      );

      // Start escalation ladder
      scheduleEscalation(newBooking.id);
    }

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
