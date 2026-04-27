import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const airport = searchParams.get('airport')?.toUpperCase();
  const initials = searchParams.get('initials')?.toUpperCase();
  const digits = searchParams.get('digits');

  if (!airport || !initials || !digits) {
    return NextResponse.json({ error: 'Missing code parameters' }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { data: driver, error } = await supabase
    .from('drivers')
    .select('id, code_initials, code_digits, airport_code, is_active, insurance_provider, insurance_type, airport_permitted, users!inner(name)')
    .eq('airport_code', airport)
    .eq('code_initials', initials)
    .eq('code_digits', digits)
    .single();

  if (error || !driver) {
    return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
  }

  if (!driver.is_active) {
    return NextResponse.json({ error: 'This driver is not currently active' }, { status: 404 });
  }

  const user = driver.users as unknown as Record<string, string>;
  const name = user?.name || 'Unknown';
  const nameParts = name.split(' ');
  const initials2 = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  return NextResponse.json({
    id: driver.id,
    name,
    initials: initials2,
    airportCode: driver.airport_code,
    codeInitials: driver.code_initials,
    codeDigits: driver.code_digits,
    airportPermitted: driver.airport_permitted || false,
    insuranceVerified: !!(driver.insurance_provider),
  });
}
