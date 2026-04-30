import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { sendExtensionNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'rider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { connectionId, hours } = await request.json();
    if (!connectionId) {
      return NextResponse.json({ error: 'Missing connectionId' }, { status: 400 });
    }

    // Default 8 hours if none specified
    const extendHours = parseInt(hours) || 8;
    if (extendHours < 1 || extendHours > 48) {
      return NextResponse.json({ error: 'Hours must be between 1 and 48' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Get the connection
    const { data: connection } = await supabase
      .from('connections')
      .select('id, driver_id, rider_id, status, expires_at, extended_hours')
      .eq('id', connectionId)
      .single();

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    if (connection.rider_id !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (connection.status !== 'pending') {
      return NextResponse.json({ error: 'Connection is not pending' }, { status: 400 });
    }

    // Set new expiry
    const newExpiry = new Date(Date.now() + extendHours * 60 * 60 * 1000).toISOString();
    const totalExtended = (connection.extended_hours || 0) + extendHours;

    const { error: updateErr } = await supabase
      .from('connections')
      .update({
        expires_at: newExpiry,
        extended_hours: totalExtended,
      })
      .eq('id', connectionId);

    if (updateErr) {
      return NextResponse.json({ error: 'Failed to extend time' }, { status: 500 });
    }

    // Notify barber
    const { data: barberUser } = await supabase
      .from('users')
      .select('id, name, phone, email')
      .eq('id', connection.driver_id)
      .single();

    const { data: clientUser } = await supabase
      .from('users')
      .select('id, name, rider_id, preferred_name')
      .eq('id', session.userId)
      .single();

    if (barberUser && clientUser) {
      await sendExtensionNotification(
        { id: barberUser.id, name: barberUser.name, phone: barberUser.phone, email: barberUser.email },
        { id: clientUser.id, name: clientUser.name, clientId: clientUser.rider_id, preferredName: clientUser.preferred_name },
        extendHours
      );
    }

    return NextResponse.json({ success: true, newExpiry, totalExtended });
  } catch (err: unknown) {
    console.error('Connection extend error:', err);
    return NextResponse.json({ error: 'Failed to extend time' }, { status: 500 });
  }
}
