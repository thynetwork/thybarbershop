/* ============================================================
   QR generation + upload to Supabase storage.
   Used at end of barber registration (DO1) to pre-bake the
   shareable invite QR for /share (SC1).
   ============================================================ */

import QRCode from 'qrcode';
import { getSupabaseServiceRole } from './supabase';

const BUCKET = 'barber-qr-codes';

/** Build the canonical invite URL for a barber. */
export function inviteUrlFor(initials: string, digits: string | number): string {
  return `https://thybarber.shop/invite/${initials}${digits}`;
}

/** Build the storage object key for a barber's QR PNG. */
export function qrObjectKey(initials: string, digits: string | number): string {
  return `QR_${initials}${digits}.png`;
}

/**
 * Generate a 300x300 PNG QR code for the given invite URL,
 * upload it to Supabase storage, and return its public URL.
 *
 * Style:
 *   fill #0a0a2e · background #ffffff · error correction H ·
 *   box size 12 · border (margin) 2.
 */
export async function generateAndUploadBarberQr(args: {
  initials: string;
  digits: string | number;
}): Promise<string | null> {
  // Service role bypasses storage RLS — same reasoning as lib/uploads.ts.
  const supabase = getSupabaseServiceRole();
  const url = inviteUrlFor(args.initials, args.digits);
  const key = qrObjectKey(args.initials, args.digits);

  // Build the PNG buffer with the requested style.
  const png = await QRCode.toBuffer(url, {
    type: 'png',
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 12,
    width: 300,
    color: { dark: '#0a0a2e', light: '#ffffff' },
  });

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(key, png, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadErr) {
    console.error('QR upload failed:', uploadErr);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data?.publicUrl ?? null;
}
