import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

/**
 * GET /api/driver/[code]
 * Returns a driver's public profile by their driver code.
 * Code format: "MRC3341" (no dot in URL, dot added for display)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const supabase = getSupabaseServer();

  // Parse code into initials + digits
  const initialsMatch = code.match(/^([A-Za-z]{2,3})(\d{4})$/);
  if (!initialsMatch) {
    return NextResponse.json(
      { error: 'Invalid driver code format. Expected 2-3 letters + 4 digits.' },
      { status: 400 }
    );
  }

  const codeInitials = initialsMatch[1].toUpperCase();
  const codeDigits = initialsMatch[2];

  // TODO: Query Supabase
  // const { data: driver, error } = await supabase
  //   .from('drivers')
  //   .select('*, users(*), vehicles(*)')
  //   .eq('code_initials', codeInitials)
  //   .eq('code_digits', codeDigits)
  //   .single();

  // Demo driver profile
  const driver = {
    id: 'd1',
    name: 'Marcus Rivera',
    initials: 'JR',
    codeInitials,
    codeDigits,
    codeDisplay: `${codeInitials}\u00B7${codeDigits}`,
    city: 'Houston, TX',
    bio: 'Professional driver serving Houston metro area.',
    avatarUrl: null,
    photoUrl: null,

    // Rates
    rateHourly: 35,
    flatLocal: 25,
    flatFeeDistance: 50,
    emptyReturnType: 'fixed',
    emptyReturnValue: 50,
    setAmountDefault: 120,

    // Availability
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availabilityHours: '7:00 am \u2013 10:00 pm',

    // Vehicle
    vehicle: {
      make: 'Toyota',
      model: 'Camry XSE',
      year: 2022,
      color: 'Silver',
      seats: 3,
      seatbeltConfirmed: true,
    },

    // Badges / verification
    airportPermitted: true,
    airportPermitNumber: 'AP-12345',
    safetyProtocolComplete: true,
    insuranceProvider: 'Allstate',
    insurancePolicyNumber: null, // never exposed to riders
    insuranceType: 'Rideshare',
    isActive: true,
    rating: 4.97,
    totalRides: 312,

    // Cancellation / payment
    cancellationPolicy: 'Free cancellation >24hrs. 50% within 24hrs. Full no-show.',
    paymentTiming: 'on_pickup',
    paymentMethods: [
      { method: 'zelle', handle: 'mrivera@email.com', qrImageUrl: null, isEnabled: true },
      { method: 'venmo', handle: '@james-rivera-htx', qrImageUrl: null, isEnabled: true },
      { method: 'cashapp', handle: '$JamesHTX', qrImageUrl: null, isEnabled: true },
    ],
  };

  return NextResponse.json({ driver });
}
