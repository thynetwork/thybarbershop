import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ zip: string; barberId: string }> }
) {
  const { zip, barberId } = await params;

  // Get authenticated user
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Sign in to request a barber.' }, { status: 401 });
  }

  const sb = getSupabaseServer();

  // Check if this user has already paid the one-time matching fee (tied to email)
  const { data: user } = await sb
    .from('users')
    .select('id, email, matching_fee_paid')
    .eq('id', session.userId)
    .single();

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
  }

  let requiresPayment = !user.matching_fee_paid;

  // If they haven't paid yet, process the $9.99 fee
  if (requiresPayment) {
    // Placeholder: In production, process Stripe payment here
    // const paymentIntent = await stripe.paymentIntents.create({ amount: 999, currency: 'usd' });

    // Mark matching fee as paid on the user record
    await sb
      .from('users')
      .update({ matching_fee_paid: true })
      .eq('id', user.id);
  }

  // Check if connection request already exists for this barber
  const { data: existing } = await sb
    .from('connections')
    .select('id, status')
    .eq('rider_id', user.id)
    .eq('driver_id', barberId)
    .single();

  if (existing) {
    if (existing.status === 'approved') {
      return NextResponse.json({ success: false, error: 'You are already connected to this barber.' }, { status: 400 });
    }
    if (existing.status === 'pending') {
      return NextResponse.json({ success: false, error: 'You already have a pending request to this barber.' }, { status: 400 });
    }
    // If denied or revoked, allow re-request
    await sb
      .from('connections')
      .update({ status: 'pending', created_at: new Date().toISOString() })
      .eq('id', existing.id);

    return NextResponse.json({
      success: true,
      requestId: existing.id,
      zip,
      barberId,
      feePaid: !requiresPayment,
      feeCharged: requiresPayment ? 9.99 : 0,
      status: 'pending_barber_approval',
      message: 'Connection request re-sent. The barber has 24 hours to respond.',
    });
  }

  // Create new connection request
  const { data: connection, error } = await sb
    .from('connections')
    .insert({
      driver_id: barberId,
      rider_id: user.id,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Connection request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send request.' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    requestId: connection?.id,
    zip,
    barberId,
    feePaid: !requiresPayment,
    feeCharged: requiresPayment ? 9.99 : 0,
    status: 'pending_barber_approval',
    message: 'Connection request sent. The barber has 24 hours to respond.',
  });
}
