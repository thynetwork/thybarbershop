import { NextRequest, NextResponse } from 'next/server';

const DEMO_PROFILES: Record<string, object> = {
  'ray-r': {
    id: 'ray-r',
    firstName: 'Ray',
    lastInitial: 'R',
    initials: 'RR',
    vehicleClass: 'comfort',
    rating: 4.94,
    rides: 187,
    airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'R**', digits: '****' },
    vehicle: {
      year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE',
      color: 'Silver', passengers: 3, seatbelts: true,
      condition: 'Clean · Minor wear acceptable',
      insuranceType: 'Rideshare insured',
    },
    rates: {
      hourly: 32, flatLocal: 22, flatDistance: 48,
      emptyReturn: 40, payTiming: 'On pickup',
    },
    availability: {
      days: [true, true, true, true, true, true, false],
      daysText: 'Monday – Saturday',
      hours: '6:00 am – 11:00 pm',
      accepting: true,
    },
    reviews: [
      'Always on time at MCO. Never missed a pickup even when my flight changed.',
      'Clean car, professional, knows all the terminals. My go-to every trip.',
      'Been using Ray for 8 months. Consistent every single time.',
    ],
    verified: true,
    safetyProtocol: true,
  },
  'david-m': {
    id: 'david-m',
    firstName: 'David',
    lastInitial: 'M',
    initials: 'DM',
    vehicleClass: 'xl',
    rating: 4.98,
    rides: 243,
    airports: ['MCO', 'SFB'],
    maskedCode: { airport: 'MCO', initials: 'D**', digits: '****' },
    vehicle: {
      year: 2022, make: 'Toyota', model: 'Highlander', trim: 'XLE',
      color: 'Black', passengers: 6, seatbelts: true,
      condition: 'Excellent · Like new',
      insuranceType: 'Rideshare insured',
    },
    rates: {
      hourly: 45, flatLocal: 35, flatDistance: 65,
      emptyReturn: 50, payTiming: 'On pickup',
    },
    availability: {
      days: [true, true, true, true, true, false, false],
      daysText: 'Monday – Friday',
      hours: '5:00 am – 10:00 pm',
      accepting: true,
    },
    reviews: [
      'David is fantastic. Spacious SUV, always clean, very professional.',
      'Best XL barber at MCO. Highly recommend for families.',
      'Reliable and friendly. Will keep using David for all my Orlando trips.',
    ],
    verified: true,
    safetyProtocol: true,
  },
  'marcus-s': {
    id: 'marcus-s',
    firstName: 'Marcus',
    lastInitial: 'S',
    initials: 'MS',
    vehicleClass: 'black',
    rating: 5.0,
    rides: 89,
    airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'M**', digits: '****' },
    vehicle: {
      year: 2023, make: 'Cadillac', model: 'CT5', trim: 'Premium',
      color: 'Black', passengers: 4, seatbelts: true,
      condition: 'Immaculate · Premium maintained',
      insuranceType: 'Commercial livery',
    },
    rates: {
      hourly: 75, flatLocal: 65, flatDistance: 120,
      emptyReturn: 80, payTiming: 'On pickup',
    },
    availability: {
      days: [true, true, true, true, true, true, true],
      daysText: 'Every day',
      hours: '24 hours · 7 days',
      accepting: true,
    },
    reviews: [
      'Top-tier service. Marcus treats every ride like a VIP experience.',
      'The Cadillac is stunning. Worth every penny for airport transfers.',
      'Most professional barber I have ever used. Period.',
    ],
    verified: true,
    safetyProtocol: true,
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ airport: string; barberId: string }> }
) {
  const { airport, barberId } = await params;
  const profile = DEMO_PROFILES[barberId];

  if (!profile) {
    return NextResponse.json(
      { success: false, error: 'Barber not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    airport: airport.toUpperCase(),
    barber: profile,
  });
}
