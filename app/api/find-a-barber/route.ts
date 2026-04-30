import { NextResponse } from 'next/server';

const AIRPORTS = [
  { code: 'IAH', city: 'Houston', fullName: 'George Bush Intercontinental', barbers: 17 },
  { code: 'MCO', city: 'Orlando', fullName: 'Orlando International', barbers: 9 },
  { code: 'ATL', city: 'Atlanta', fullName: 'Hartsfield-Jackson International', barbers: 24 },
  { code: 'LAX', city: 'Los Angeles', fullName: 'Los Angeles International', barbers: 31 },
  { code: 'DFW', city: 'Dallas', fullName: 'Dallas/Fort Worth International', barbers: 22 },
  { code: 'ORD', city: 'Chicago', fullName: "O'Hare International", barbers: 18 },
  { code: 'JFK', city: 'New York', fullName: 'John F. Kennedy International', barbers: 28 },
  { code: 'MIA', city: 'Miami', fullName: 'Miami International', barbers: 15 },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    airports: AIRPORTS,
    total: AIRPORTS.reduce((sum, a) => sum + a.barbers, 0),
  });
}
