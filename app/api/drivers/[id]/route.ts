import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseServer();

  const { data: driver, error } = await supabase
    .from('drivers')
    .select('id, code_initials, code_digits, airport_code, vehicle_class, is_active, insurance_provider, airport_permitted, rate_hourly, flat_fee_local, flat_fee_airport, flat_fee_distance, users!inner(name)')
    .eq('id', id)
    .single();

  if (error || !driver) {
    return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
  }

  const user = driver.users as unknown as Record<string, string>;
  const name = user?.name || 'Unknown';
  const nameParts = name.split(' ');
  const initials = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  return NextResponse.json({
    id: driver.id,
    name,
    initials,
    airportCode: driver.airport_code,
    codeInitials: driver.code_initials,
    codeDigits: driver.code_digits,
    airportPermitted: driver.airport_permitted || false,
    insuranceVerified: !!(driver.insurance_provider),
    vehicleClass: driver.vehicle_class,
    rateHourly: driver.rate_hourly,
    rateFlatLocal: driver.flat_fee_local,
    rateFlatAirport: driver.flat_fee_airport,
    rateFlatDistance: driver.flat_fee_distance,
  });
}
