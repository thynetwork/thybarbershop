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

    // Verify this barber owns this connection
    const { data: barberRecord } = await supabase
      .from('drivers')
      .select('id')
      .eq('id', session.userId)
      .single();

    if (!barberRecord || connection.driver_id !== barberRecord.id) {
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

    // Get barber and client info for notifications
    const { data: barberUser } = await supabase
      .from('users')
      .select('name, email, phone')
      .eq('id', session.userId)
      .single();

    const { data: barberInfo } = await supabase
      .from('drivers')
      .select('airport_code, code_initials, code_digits, insurance_provider')
      .eq('id', session.userId)
      .single();

    const { data: clientUser } = await supabase
      .from('users')
      .select('id, name, email, phone, rider_id, preferred_name')
      .eq('id', connection.rider_id)
      .single();

    // Send approval notifications
    if (barberUser && clientUser && barberInfo) {
      const barberCode = `${barberInfo.airport_code}·${barberInfo.code_initials}·${barberInfo.code_digits}`;

      await sendConnectionApprovedNotification(
        {
          id: session.userId,
          name: barberUser.name,
          phone: barberUser.phone,
          email: barberUser.email,
        },
        {
          id: clientUser.id,
          name: clientUser.name,
          clientId: clientUser.rider_id,
          preferredName: clientUser.preferred_name,
          phone: clientUser.phone,
          email: clientUser.email,
        },
        barberCode,
        {
          airport: barberInfo.airport_code,
          phone: barberUser.phone,
          insurance: barberInfo.insurance_provider,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Connection approve error:', err);
    return NextResponse.json({ error: 'Failed to approve connection' }, { status: 500 });
  }
}
