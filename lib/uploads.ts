/* ============================================================
   Barber document uploads (private bucket: barber-documents).
   Mirrors lib/qr.ts — same Supabase storage pattern, different
   bucket. Used at the end of barber registration (DO1) to push
   the verification documents that ThyAdmin's 5-step approval
   workflow reads back.
   ============================================================ */

import { getSupabaseServer } from './supabase';

const BUCKET = 'barber-documents';

export type DocumentSlot =
  | 'dl-front'
  | 'dl-back'
  | 'barber-license'
  | 'shop-license'
  | 'profile'
  | 'logo';

function extFor(file: File): string {
  const m = (file.name || '').match(/\.([a-zA-Z0-9]+)$/);
  if (m) return m[1].toLowerCase();
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/jpeg') return 'jpg';
  if (file.type === 'image/webp') return 'webp';
  return 'bin';
}

/** Build the storage object key for a barber's document. */
export function documentObjectKey(barberCode: string, slot: DocumentSlot, ext: string): string {
  return `${barberCode}/${slot}.${ext}`;
}

/**
 * Upload one File to barber-documents/{barberCode}/{slot}.{ext},
 * upserting any prior file in that slot. Returns the public URL or
 * null on failure (registration tolerates partial document submission).
 */
export async function uploadBarberDocument(args: {
  file: File;
  barberCode: string;
  slot: DocumentSlot;
}): Promise<string | null> {
  const supabase = getSupabaseServer();
  const ext = extFor(args.file);
  const key = documentObjectKey(args.barberCode, args.slot, ext);

  const buffer = Buffer.from(await args.file.arrayBuffer());
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(key, buffer, {
      contentType: args.file.type || 'application/octet-stream',
      upsert: true,
    });
  if (uploadErr) {
    console.error('Document upload failed:', args.slot, uploadErr);
    return null;
  }

  // Bucket is private — admin-only. Return the storage path; ThyAdmin
  // creates a short-lived signed URL when an admin opens the document.
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data?.publicUrl ?? null;
}
