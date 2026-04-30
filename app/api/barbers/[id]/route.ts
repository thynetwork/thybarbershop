import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseServer();

  const { data: barber, error } = await supabase
    .from('drivers')
    .select('id, code_initials, code_digits, airport_code, vehicle_class, is_active, insurance_provider, airport_permitted, rate_hourly, flat_fee_local, flat_fee_airport, flat_fee_distance, users!inner(name)')
    .eq('id', id)
    .single();

  if (error || !barber) {
    return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
  }

  const user = barber.users as unknown as Record<string, string>;
  const name = user?.name || 'Unknown';
  const nameParts = name.split(' ');
  const initials = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  return NextResponse.json({
    id: barber.id,
    name,
    initials,
    airportCode: barber.airport_code,
    codeInitials: barber.code_initials,
    codeDigits: barber.code_digits,
    airportPermitted: barber.airport_permitted || false,
    insuranceVerified: !!(barber.insurance_provider),
    vehicleClass: barber.vehicle_class,
    rateHourly: barber.rate_hourly,
    rateFlatLocal: barber.flat_fee_local,
    rateFlatAirport: barber.flat_fee_airport,
    rateFlatDistance: barber.flat_fee_distance,
  });
}
