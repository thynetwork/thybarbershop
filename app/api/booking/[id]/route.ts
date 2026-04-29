import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

/**
 * GET /api/booking/[id]
 * Returns a single booking by ID.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseServer();

  // TODO: Fetch from Supabase
  // const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();

  // Demo booking
  const booking = {
    id,
    driverId: 'd1',
    clientId: 'r1',
    driverName: 'Marcus Rivera',
    driverCode: 'MRC\u00B73341',
    driverInitials: 'MR',
    driverPhone: '(713) 555-0121',
    driverInsurance: 'Allstate',
    driverInsuranceType: 'Rideshare',
    driverVehicle: '2022 Toyota Camry XSE',
    driverVehicleColor: 'Silver',
    driverSeats: 3,
    clientName: 'Dana Torres',
    clientInitials: 'DT',
    date: '2026-07-19',
    timeSlot: '6:00 am',
    pickupAddress: '456 Westheimer Rd, Houston TX',
    dropoffAddress: '800 Congress Ave, Austin TX',
    estimatedMiles: 165,
    routeType: 'longhaul',
    status: 'confirmed',
    rateType: 'hourly',
    rateAmount: 210,
    driverEstimate: 187.5,
    driverFinalPrice: 210,
    driverAdjustmentReason: 'hours',
    driverAdjustmentNote: 'Early morning rate applies before 7am.',
    paymentTiming: 'on_pickup',
    paidAt: null,
    driverConfirmedAt: '2026-07-12T10:30:00Z',
    createdAt: '2026-07-12T09:00:00Z',
    paymentMethods: [
      { method: 'zelle', handle: 'mrivera@email.com', isEnabled: true },
      { method: 'venmo', handle: '@james-rivera-htx', isEnabled: true },
      { method: 'cashapp', handle: '$JamesHTX', isEnabled: true },
    ],
  };

  return NextResponse.json({ booking });
}

/**
 * PATCH /api/booking/[id]
 * Updates a booking (status, payment, client response, etc.)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseServer();

  try {
    const body = await request.json();

    const allowedFields = [
      'status',
      'client_response',
      'hold_expires_at',
      'paid_at',
      'driver_confirmed_at',
      'cancellation_reason',
      'driver_final_price',
      'driver_adjustment_reason',
      'driver_adjustment_note',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // TODO: Update in Supabase
    // const { data, error } = await supabase.from('bookings').update(updates).eq('id', id);

    return NextResponse.json({
      booking: { id, ...updates, updatedAt: new Date().toISOString() },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
