import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { sendConnectionApprovedNotification } from '@/lib/notifications';

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
    const { data: connection, error: connErr } = await supabase
      .from('connections')
      .select('id, driver_id, rider_id, status, accepted_set_amount, source')
      .eq('id', connectionId)
      .single();

    if (connErr || !connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Verify this driver owns this connection
    const { data: driverRecord } = await supabase
      .from('drivers')
      .select('id')
      .eq('id', session.userId)
      .single();

    if (!driverRecord || connection.driver_id !== driverRecord.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (connection.status !== 'pending') {
      return NextResponse.json({ error: 'Connection is not pending' }, { status: 400 });
    }

    // Approve the connection
    const { error: updateErr } = await supabase
      .from('connections')
      .update({ status: 'approved' })
      .eq('id', connectionId);

    if (updateErr) {
      return NextResponse.json({ error: 'Failed to approve connection' }, { status: 500 });
    }

    // If pre-set amount was accepted, set it
    if (connection.accepted_set_amount) {
      await supabase
        .from('connections')
        .update({
          set_amount: connection.accepted_set_amount,
          set_amount_set_by: 'driver',
          set_amount_agreed_at: new Date().toISOString(),
        })
        .eq('id', connectionId);
    }

    // Get driver and rider info for notifications
    const { data: driverUser } = await supabase
      .from('users')
      .select('name, email, phone')
      .eq('id', session.userId)
      .single();

    const { data: driverInfo } = await supabase
      .from('drivers')
      .select('airport_code, code_initials, code_digits, insurance_provider')
      .eq('id', session.userId)
      .single();

    const { data: riderUser } = await supabase
      .from('users')
      .select('id, name, email, phone, rider_id, preferred_name')
      .eq('id', connection.rider_id)
      .single();

    // Send approval notifications
    if (driverUser && riderUser && driverInfo) {
      const driverCode = `${driverInfo.airport_code}\u00B7${driverInfo.code_initials}\u00B7${driverInfo.code_digits}`;

      await sendConnectionApprovedNotification(
        {
          id: session.userId,
          name: driverUser.name,
          phone: driverUser.phone,
          email: driverUser.email,
        },
        {
          id: riderUser.id,
          name: riderUser.name,
          riderId: riderUser.rider_id,
          preferredName: riderUser.preferred_name,
          phone: riderUser.phone,
          email: riderUser.email,
        },
        driverCode,
        {
          airport: driverInfo.airport_code,
          phone: driverUser.phone,
          insurance: driverInfo.insurance_provider,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Connection approve error:', err);
    return NextResponse.json({ error: 'Failed to approve connection' }, { status: 500 });
  }
}
