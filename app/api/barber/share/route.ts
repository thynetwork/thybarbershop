/* GET /api/barber/share
 *
 * Returns the share-code payload SC1 needs:
 *   { codeInitials, codeDigits, inviteUrl, qrCodeUrl }
 *
 * If qr_code_url is missing on the row, regenerate on demand and persist.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { generateAndUploadBarberQr, inviteUrlFor } from '@/lib/qr';

export async function GET(_request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'driver') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const { data: barber, error } = await supabase
    .from('drivers')
    .select('code_initials, code_digits, qr_code_url')
    .eq('id', session.userId)
    .single();

  if (error || !barber) {
    return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
  }

  const initials = barber.code_initials as string;
  const digits = barber.code_digits as string;
  const inviteUrl = inviteUrlFor(initials, digits);

  let qrCodeUrl = (barber.qr_code_url as string | null) ?? null;
  if (!qrCodeUrl) {
    qrCodeUrl = await generateAndUploadBarberQr({ initials, digits });
    if (qrCodeUrl) {
      await supabase.from('drivers').update({ qr_code_url: qrCodeUrl }).eq('id', session.userId);
    }
  }

  return NextResponse.json({ codeInitials: initials, codeDigits: digits, inviteUrl, qrCodeUrl });
}
