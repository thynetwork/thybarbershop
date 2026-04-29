import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { sendConnectionDeniedNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { connectionId } = await request.json();
    if (!connectionId) {
      return NextResponse.json({ error: 'Missing connectionId' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Get the connection
    const { data: connection } = await supabase
      .from('connections')
      .select('id, driver_id, rider_id, status, source')
      .eq('id', connectionId)
      .single();

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    if (connection.driver_id !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (connection.status !== 'pending') {
      return NextResponse.json({ error: 'Connection is not pending' }, { status: 400 });
    }

    // Deny the connection
    const { error: updateErr } = await supabase
      .from('connections')
      .update({ status: 'denied' })
      .eq('id', connectionId);

    if (updateErr) {
      return NextResponse.json({ error: 'Failed to deny connection' }, { status: 500 });
    }

    // Get driver and client info for notifications
    const { data: driverUser } = await supabase
      .from('users')
      .select('name')
      .eq('id', session.userId)
      .single();

    const { data: clientUser } = await supabase
      .from('users')
      .select('id, name, phone, rider_id, preferred_name')
      .eq('id', connection.rider_id)
      .single();

    // Send denial notification — "unable to accept at this time"
    if (driverUser && clientUser) {
      await sendConnectionDeniedNotification(
        { id: session.userId, name: driverUser.name },
        {
          id: clientUser.id,
          name: clientUser.name,
          clientId: clientUser.rider_id,
          preferredName: clientUser.preferred_name,
          phone: clientUser.phone,
        }
      );
    }

    return NextResponse.json({ success: true, source: connection.source });
  } catch (err: unknown) {
    console.error('Connection deny error:', err);
    return NextResponse.json({ error: 'Failed to deny connection' }, { status: 500 });
  }
}
