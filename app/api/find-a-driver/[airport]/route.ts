import { NextRequest, NextResponse } from 'next/server';

interface Driver {
  id: string;
  firstName: string;
  lastInitial: string;
  initials: string;
  vehicleClass: string;
  rating: number;
  rides: number;
  airports: string[];
  maskedCode: { airport: string; initials: string; digits: string };
  vehicle: {
    year: number; make: string; model: string; trim: string;
    color: string; passengers: number; seatbelts: boolean;
    insuranceType: string;
  };
  rates: { hourly: number; flatLocal: number };
  availability: { days: boolean[]; hours: string };
  verified: boolean;
}

const DEMO_DRIVERS: Driver[] = [
  {
    id: 'ray-r', firstName: 'Ray', lastInitial: 'R', initials: 'RR',
    vehicleClass: 'comfort', rating: 4.94, rides: 187, airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'R**', digits: '****' },
    vehicle: { year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE', color: 'Silver', passengers: 3, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 32, flatLocal: 22 },
    availability: { days: [true, true, true, true, true, true, false], hours: '6:00 am – 11:00 pm' },
    verified: true,
  },
  {
    id: 'david-m', firstName: 'David', lastInitial: 'M', initials: 'DM',
    vehicleClass: 'xl', rating: 4.98, rides: 243, airports: ['MCO', 'SFB'],
    maskedCode: { airport: 'MCO', initials: 'D**', digits: '****' },
    vehicle: { year: 2022, make: 'Toyota', model: 'Highlander', trim: 'XLE', color: 'Black', passengers: 6, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 45, flatLocal: 35 },
    availability: { days: [true, true, true, true, true, false, false], hours: '5:00 am – 10:00 pm' },
    verified: true,
  },
  {
    id: 'marcus-s', firstName: 'Marcus', lastInitial: 'S', initials: 'MS',
    vehicleClass: 'black', rating: 5.0, rides: 89, airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'M**', digits: '****' },
    vehicle: { year: 2023, make: 'Cadillac', model: 'CT5', trim: 'Premium', color: 'Black', passengers: 4, seatbelts: true, insuranceType: 'Commercial livery' },
    rates: { hourly: 75, flatLocal: 65 },
    availability: { days: [true, true, true, true, true, true, true], hours: '24 hours · 7 days' },
    verified: true,
  },
  {
    id: 'tony-v', firstName: 'Tony', lastInitial: 'V', initials: 'TV',
    vehicleClass: 'xll', rating: 4.91, rides: 156, airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'T**', digits: '****' },
    vehicle: { year: 2023, make: 'Chevrolet', model: 'Suburban', trim: 'LT', color: 'White', passengers: 7, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 55, flatLocal: 45 },
    availability: { days: [true, true, true, true, true, true, false], hours: '5:00 am – 9:00 pm' },
    verified: true,
  },
  {
    id: 'sarah-k', firstName: 'Sarah', lastInitial: 'K', initials: 'SK',
    vehicleClass: 'comfort', rating: 4.87, rides: 312, airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'S**', digits: '****' },
    vehicle: { year: 2022, make: 'Honda', model: 'Accord', trim: 'EX', color: 'Blue', passengers: 3, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 30, flatLocal: 20 },
    availability: { days: [true, true, true, true, true, false, false], hours: '7:00 am – 8:00 pm' },
    verified: true,
  },
  {
    id: 'james-w', firstName: 'James', lastInitial: 'W', initials: 'JW',
    vehicleClass: 'xl', rating: 4.96, rides: 198, airports: ['MCO'],
    maskedCode: { airport: 'MCO', initials: 'J**', digits: '****' },
    vehicle: { year: 2023, make: 'Ford', model: 'Explorer', trim: 'XLT', color: 'Gray', passengers: 5, seatbelts: true, insuranceType: 'Rideshare insured' },
    rates: { hourly: 42, flatLocal: 32 },
    availability: { days: [true, true, true, true, true, true, false], hours: '6:00 am – 10:00 pm' },
    verified: true,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ airport: string }> }
) {
  const { airport } = await params;
  const airportCode = airport.toUpperCase();
  const { searchParams } = new URL(request.url);
  const classFilter = searchParams.get('class') || 'all';
  const sort = searchParams.get('sort') || 'rating';

  let drivers = DEMO_DRIVERS.map((d) => ({
    ...d,
    maskedCode: { ...d.maskedCode, airport: airportCode },
  }));

  if (classFilter !== 'all') {
    drivers = drivers.filter((d) => d.vehicleClass === classFilter);
  }

  drivers.sort((a, b) => {
    switch (sort) {
      case 'rating': return b.rating - a.rating;
      case 'rate-low': return a.rates.hourly - b.rates.hourly;
      case 'rate-high': return b.rates.hourly - a.rates.hourly;
      case 'availability': return b.rides - a.rides;
      default: return b.rating - a.rating;
    }
  });

  return NextResponse.json({
    success: true,
    airport: airportCode,
    total: drivers.length,
    drivers,
  });
}
