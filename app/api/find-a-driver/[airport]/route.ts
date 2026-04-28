import { NextRequest, NextResponse } from 'next/server';

interface Barber {
  id: string;
  firstName: string;
  lastInitial: string;
  initials: string;
  vehicleClass: string;
  rating: number;
  rides: number;
  zipCode: string;
  serviceAreas: string[];
  city: string;
  state: string;
  distanceMiles: number;
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

const DEMO_BARBERS: Barber[] = [
  {
    id: 'marcus-r', firstName: 'Marcus', lastInitial: 'R', initials: 'MR',
    vehicleClass: 'comfort', rating: 4.97, rides: 312,
    zipCode: '77587', serviceAreas: ['77587', '77502', '77584'], city: 'South Houston', state: 'TX', distanceMiles: 0.4,
    airports: ['IAH'],
    maskedCode: { airport: 'South Houston', initials: 'M**', digits: '****' },
    vehicle: { year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE', color: 'Silver', passengers: 3, seatbelts: true, insuranceType: 'Licensed barber' },
    rates: { hourly: 45, flatLocal: 25 },
    availability: { days: [false, true, true, true, true, false, true], hours: '8:00 am – 6:00 pm' },
    verified: true,
  },
  {
    id: 'deshawn-j', firstName: 'DeShawn', lastInitial: 'J', initials: 'DJ',
    vehicleClass: 'xl', rating: 4.98, rides: 243,
    zipCode: '77002', serviceAreas: ['77002', '77003', '77006'], city: 'Houston', state: 'TX', distanceMiles: 1.2,
    airports: ['HOU'],
    maskedCode: { airport: 'Houston', initials: 'D**', digits: '****' },
    vehicle: { year: 2022, make: 'Toyota', model: 'Highlander', trim: 'XLE', color: 'Black', passengers: 6, seatbelts: true, insuranceType: 'Licensed barber' },
    rates: { hourly: 50, flatLocal: 35 },
    availability: { days: [true, true, true, true, true, false, false], hours: '9:00 am – 7:00 pm' },
    verified: true,
  },
  {
    id: 'tony-v', firstName: 'Tony', lastInitial: 'V', initials: 'TV',
    vehicleClass: 'comfort', rating: 4.91, rides: 156,
    zipCode: '77502', serviceAreas: ['77502', '77587'], city: 'Pasadena', state: 'TX', distanceMiles: 2.8,
    airports: ['IAH'],
    maskedCode: { airport: 'Pasadena', initials: 'T**', digits: '****' },
    vehicle: { year: 2023, make: 'Chevrolet', model: 'Suburban', trim: 'LT', color: 'White', passengers: 7, seatbelts: true, insuranceType: 'Licensed barber' },
    rates: { hourly: 55, flatLocal: 45 },
    availability: { days: [true, true, true, true, true, true, false], hours: '7:00 am – 9:00 pm' },
    verified: true,
  },
  {
    id: 'sarah-k', firstName: 'Sarah', lastInitial: 'K', initials: 'SK',
    vehicleClass: 'comfort', rating: 4.87, rides: 312,
    zipCode: '90002', serviceAreas: ['90002', '90001', '90003'], city: 'Watts', state: 'CA', distanceMiles: 0.7,
    airports: ['LAX'],
    maskedCode: { airport: 'Watts', initials: 'S**', digits: '****' },
    vehicle: { year: 2022, make: 'Honda', model: 'Accord', trim: 'EX', color: 'Blue', passengers: 3, seatbelts: true, insuranceType: 'Licensed barber' },
    rates: { hourly: 30, flatLocal: 20 },
    availability: { days: [true, true, true, true, true, false, false], hours: '7:00 am – 8:00 pm' },
    verified: true,
  },
  {
    id: 'james-w', firstName: 'James', lastInitial: 'W', initials: 'JW',
    vehicleClass: 'xl', rating: 4.96, rides: 198,
    zipCode: '90001', serviceAreas: ['90001', '90002'], city: 'Los Angeles', state: 'CA', distanceMiles: 1.4,
    airports: ['LAX'],
    maskedCode: { airport: 'Los Angeles', initials: 'J**', digits: '****' },
    vehicle: { year: 2023, make: 'Ford', model: 'Explorer', trim: 'XLT', color: 'Gray', passengers: 5, seatbelts: true, insuranceType: 'Licensed barber' },
    rates: { hourly: 42, flatLocal: 32 },
    availability: { days: [true, true, true, true, true, true, false], hours: '6:00 am – 10:00 pm' },
    verified: true,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ airport: string }> }
) {
  const { airport: routeParam } = await params;
  const isZip = /^\d{5}$/.test(routeParam);
  const zipQuery = isZip ? routeParam : null;
  const { searchParams } = new URL(request.url);
  const classFilter = searchParams.get('class') || 'all';
  const sort = searchParams.get('sort') || 'distance';

  // Pool search rule:
  //   barber.zip_code matches OR barber.service_areas includes the zip
  let barbers = zipQuery
    ? DEMO_BARBERS.filter(b => b.zipCode === zipQuery || b.serviceAreas.includes(zipQuery))
    : DEMO_BARBERS;

  if (classFilter !== 'all') {
    barbers = barbers.filter((b) => b.vehicleClass === classFilter);
  }

  barbers.sort((a, b) => {
    switch (sort) {
      case 'distance': return a.distanceMiles - b.distanceMiles;
      case 'rating': return b.rating - a.rating;
      case 'rate-low': return a.rates.hourly - b.rates.hourly;
      case 'rate-high': return b.rates.hourly - a.rates.hourly;
      case 'availability': return b.rides - a.rides;
      default: return a.distanceMiles - b.distanceMiles;
    }
  });

  return NextResponse.json({
    success: true,
    zip: zipQuery,
    airport: routeParam.toUpperCase(),
    total: barbers.length,
    drivers: barbers,
  });
}
