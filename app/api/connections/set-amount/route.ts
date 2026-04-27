import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { sendSMS, saveInAppNotification } from '@/lib/notifications';
import config from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { connectionId, amount } = await request.json();
    if (!connectionId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Missing connectionId or valid amount' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Get the connection
    const { data: connection } = await supabase
      .from('connections')
      .select('id, driver_id, rider_id, status')
      .eq('id', connectionId)
      .single();

    if (!connection || connection.driver_id !== session.userId) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    if (connection.status !== 'approved') {
      return NextResponse.json({ error: 'Connection must be approved first' }, { status: 400 });
    }

    // Set the amount — pending rider confirmation
    const { error: updateErr } = await supabase
      .from('connections')
      .update({
        set_amount: amount,
        set_amount_set_by: 'driver',
      })
      .eq('id', connectionId);

    if (updateErr) {
      return NextResponse.json({ error: 'Failed to set amount' }, { status: 500 });
    }

    // Notify rider
    const { data: driverUser } = await supabase
      .from('users')
      .select('name')
      .eq('id', session.userId)
      .single();

    const { data: riderUser } = await supabase
      .from('users')
      .select('id, phone, rider_id')
      .eq('id', connection.rider_id)
      .single();

    if (driverUser && riderUser) {
      const driverFirstName = driverUser.name.split(' ')[0];

      if (riderUser.phone) {
        await sendSMS(
          riderUser.phone,
          `${config.serviceName}: ${driverFirstName} has suggested a set amount of $${amount} for your rides.\nReview and confirm: ${config.domain}/home`
        );
      }

      await saveInAppNotification(riderUser.id, {
        type: 'set_amount_suggested',
        title: `${driverFirstName} suggested $${amount}`,
        body: `Review and confirm this set amount from your home screen.`,
        data: { driver_name: driverUser.name, amount, connection_id: connectionId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Set amount error:', err);
    return NextResponse.json({ error: 'Failed to set amount' }, { status: 500 });
  }
}
