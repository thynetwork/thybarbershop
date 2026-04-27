/* ============================================================
   RIDER ID GENERATION
   Format: first 4 chars of name (uppercase) + middle dot + 4 random digits
   Example: KIM·2121, SARA·4807, ALEX·9031
   ============================================================ */

import { getSupabaseServer } from '@/lib/supabase';

/**
 * Generate 4 random digits (1000-9999).
 */
function randomDigits(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Extract the name prefix: up to 4 alphabetical characters from the first name, uppercased.
 */
function extractPrefix(firstName: string): string {
  const cleaned = firstName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return cleaned.slice(0, 4) || 'RIDE';
}

/**
 * Format a rider ID from prefix and digits.
 */
function formatRiderId(prefix: string, digits: string): string {
  return `${prefix}\u00B7${digits}`;
}

/**
 * Generate a unique Rider ID.
 * Checks against the database to ensure uniqueness.
 * Returns a formatted string like "KIM·2121".
 */
export async function generateRiderId(firstName: string): Promise<string> {
  const supabase = getSupabaseServer();
  const prefix = extractPrefix(firstName);

  let attempts = 0;
  while (attempts < 20) {
    const digits = randomDigits();
    const riderId = formatRiderId(prefix, digits);

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('rider_id', riderId)
      .single();

    if (!existing) {
      return riderId;
    }

    attempts++;
  }

  // Fallback: use full random suffix if too many collisions
  const fallbackDigits = Math.floor(10000 + Math.random() * 90000).toString().slice(0, 4);
  return formatRiderId(prefix, fallbackDigits);
}

/**
 * Parse a rider ID string into its components.
 */
export function parseRiderId(riderId: string): { prefix: string; digits: string } | null {
  const match = riderId.match(/^([A-Z]{1,4})\u00B7(\d{4})$/);
  if (!match) return null;
  return { prefix: match[1], digits: match[2] };
}
