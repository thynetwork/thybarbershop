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

  const { data: barber, error } = await supabase
    .from('drivers')
    .select('id, code_initials, code_digits, airport_code, is_active, insurance_provider, insurance_type, airport_permitted, users!inner(name)')
    .eq('airport_code', airport)
    .eq('code_initials', initials)
    .eq('code_digits', digits)
    .single();

  if (error || !barber) {
    return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
  }

  if (!barber.is_active) {
    return NextResponse.json({ error: 'This barber is not currently active' }, { status: 404 });
  }

  const user = barber.users as unknown as Record<string, string>;
  const name = user?.name || 'Unknown';
  const nameParts = name.split(' ');
  const initials2 = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  return NextResponse.json({
    id: barber.id,
    name,
    initials: initials2,
    airportCode: barber.airport_code,
    codeInitials: barber.code_initials,
    codeDigits: barber.code_digits,
    airportPermitted: barber.airport_permitted || false,
    insuranceVerified: !!(barber.insurance_provider),
  });
}
