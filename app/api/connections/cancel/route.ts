import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'rider') {
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
      .select('id, rider_id, status, source')
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

    // Cancel the connection
    const { error: updateErr } = await supabase
      .from('connections')
      .update({ status: 'revoked' })
      .eq('id', connectionId);

    if (updateErr) {
      return NextResponse.json({ error: 'Failed to cancel request' }, { status: 500 });
    }

    // Fee waiver rules:
    // - Invite flow: no fee was ever charged — nothing to waive
    // - Find a Driver: $9.99 one-time fee — waived only if driver never responded
    //   (cancellation after no response = fee waived)
    // - Manual: same as invite — no fee
    // Rider ID kept permanently regardless of outcome

    return NextResponse.json({
      success: true,
      source: connection.source,
      feeWaived: connection.source === 'find_a_driver',
    });
  } catch (err: unknown) {
    console.error('Connection cancel error:', err);
    return NextResponse.json({ error: 'Failed to cancel request' }, { status: 500 });
  }
}
