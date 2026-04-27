import { NextResponse } from 'next/server';

const AIRPORTS = [
  { code: 'IAH', city: 'Houston', fullName: 'George Bush Intercontinental', drivers: 17 },
  { code: 'MCO', city: 'Orlando', fullName: 'Orlando International', drivers: 9 },
  { code: 'ATL', city: 'Atlanta', fullName: 'Hartsfield-Jackson International', drivers: 24 },
  { code: 'LAX', city: 'Los Angeles', fullName: 'Los Angeles International', drivers: 31 },
  { code: 'DFW', city: 'Dallas', fullName: 'Dallas/Fort Worth International', drivers: 22 },
  { code: 'ORD', city: 'Chicago', fullName: "O'Hare International", drivers: 18 },
  { code: 'JFK', city: 'New York', fullName: 'John F. Kennedy International', drivers: 28 },
  { code: 'MIA', city: 'Miami', fullName: 'Miami International', drivers: 15 },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    airports: AIRPORTS,
    total: AIRPORTS.reduce((sum, a) => sum + a.drivers, 0),
  });
}
