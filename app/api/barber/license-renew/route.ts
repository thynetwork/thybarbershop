/* POST /api/barber/license-renew
 *
 * Submits a renewed barber license for re-verification.
 *
 * Multipart body:
 *   file               (the renewed license — image or PDF)
 *   barberLicenseExpiry (yyyy-mm-dd)
 *   barberLicenseNumber (optional — only if number changed)
 *
 * On success the file lands in
 *   barber-documents/{codeInitials}{codeDigits}/barber-license.{ext}
 * (upserted via lib/uploads.ts) and the drivers row is updated:
 *   barber_license_url     ← new storage URL
 *   barber_license_expiry  ← new expiry
 *   barber_license_number  ← new number if provided, else unchanged
 *   license_verified       ← false (re-enters ThyAdmin's 5-step queue)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { uploadBarberDocument } from '@/lib/uploads';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'driver') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ct = (req.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Multipart form-data required.' }, { status: 400 });
  }

  const fd = await req.formData();
  const file = fd.get('file');
  const expiry = (fd.get('barberLicenseExpiry') as string | null) || '';
  const number = (fd.get('barberLicenseNumber') as string | null) || '';

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'License file is required.' }, { status: 400 });
  }
  if (!expiry || !/^\d{4}-\d{2}-\d{2}$/.test(expiry)) {
    return NextResponse.json({ error: 'New expiry date is required (yyyy-mm-dd).' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data: barber, error: fetchErr } = await supabase
    .from('drivers')
    .select('code_initials, code_digits')
    .eq('id', session.userId)
    .single();

  if (fetchErr || !barber) {
    return NextResponse.json({ error: 'Barber row not found.' }, { status: 404 });
  }

  const barberCode = `${barber.code_initials as string}${barber.code_digits as string}`;
  const url = await uploadBarberDocument({ file, barberCode, slot: 'barber-license' });
  if (!url) {
    return NextResponse.json({ error: 'License upload failed. Please try again.' }, { status: 502 });
  }

  const updates: Record<string, unknown> = {
    barber_license_url: url,
    barber_license_expiry: expiry,
    license_verified: false, // back into ThyAdmin's review queue
  };
  if (number.trim()) updates.barber_license_number = number.trim();

  const { error: updateErr } = await supabase
    .from('drivers')
    .update(updates)
    .eq('id', session.userId);

  if (updateErr) {
    console.error('License renew update failed:', updateErr);
    return NextResponse.json({ error: 'Failed to save renewal. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: 'License submitted — ThyAdmin will review within 24 hours.',
  });
}
