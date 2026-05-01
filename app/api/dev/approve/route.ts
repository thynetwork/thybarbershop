/* GET /api/dev/approve?barber={code}
 *
 * Development-only shortcut. Flips a barber row to fully approved:
 *   is_active        = true
 *   license_verified = true
 *   id_verified      = true
 *   address_verified = true
 *   shop_license_verified = true
 * so the team can run end-to-end tests without opening Supabase's
 * Table Editor or wiring through ThyAdmin's verification queue.
 *
 * Hard-blocked when NODE_ENV === 'production'.
 *
 * Lookup:
 *   ?barber=MRC3341     (initials + digits, no separator — recommended)
 *   ?barber=MRC·3341    (middle-dot separator also accepted)
 *   ?barber=<uuid>      (drivers.id direct hit)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

function parseCode(raw: string): { initials: string; digits: string } | null {
  // Strip a middle-dot or hyphen separator if present.
  const cleaned = raw.replace(/[·\-\s]/g, '').toUpperCase();
  const m = cleaned.match(/^([A-Z]{3,4})(\d{4})$/);
  if (!m) return null;
  return { initials: m[1], digits: m[2] };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Disabled in production.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const barberArg = (searchParams.get('barber') || '').trim();
  if (!barberArg) {
    return NextResponse.json(
      { error: 'Pass ?barber=<code> (e.g., MRC3341) or a drivers.id uuid.' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();

  // Resolve target row.
  let targetId: string | null = null;
  if (UUID_RE.test(barberArg)) {
    targetId = barberArg;
  } else {
    const parsed = parseCode(barberArg);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Could not parse code. Expected format like MRC3341 or MRC·3341.' },
        { status: 400 }
      );
    }
    const { data: hit } = await supabase
      .from('drivers')
      .select('id')
      .eq('code_initials', parsed.initials)
      .eq('code_digits', parsed.digits)
      .single();
    if (!hit) {
      return NextResponse.json(
        { error: `No barber found with code ${parsed.initials}·${parsed.digits}.` },
        { status: 404 }
      );
    }
    targetId = hit.id as string;
  }

  const { data: updated, error } = await supabase
    .from('drivers')
    .update({
      is_active: true,
      license_verified: true,
      id_verified: true,
      address_verified: true,
      shop_license_verified: true,
      flagged_for_review: false,
      disapproval_reason: null,
    })
    .eq('id', targetId)
    .select('id, code_initials, code_digits, city, state, is_active, license_verified')
    .single();

  if (error || !updated) {
    console.error('Dev approve failed:', error);
    return NextResponse.json(
      { error: 'Update failed. Check that the barber row exists.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `${updated.code_initials}·${updated.code_digits} (${updated.city}, ${updated.state}) is now active and verified.`,
    barber: updated,
  });
}
