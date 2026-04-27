import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { verifySession } from '@/lib/auth';

/**
 * GET /api/driver/notifications
 * Returns the driver's notification preferences.
 */
export async function GET(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifySession(session);
  if (!payload || payload.role !== 'driver') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseServer();

  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('driver_id', payload.userId)
    .single();

  // Return defaults if no row exists yet
  const preferences = {
    push_enabled: prefs?.push_enabled ?? true,
    sms_enabled: prefs?.sms_enabled ?? true,
    email_enabled: prefs?.email_enabled ?? true,
    in_app_enabled: true, // Always ON, cannot be disabled
    reminder_interval: prefs?.reminder_interval ?? '30min',
  };

  return NextResponse.json({ preferences });
}

/**
 * PATCH /api/driver/notifications
 * Updates the driver's notification preferences.
 */
export async function PATCH(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifySession(session);
  if (!payload || payload.role !== 'driver') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { push_enabled, sms_enabled, email_enabled, reminder_interval } = body as {
    push_enabled?: boolean;
    sms_enabled?: boolean;
    email_enabled?: boolean;
    reminder_interval?: string;
  };

  // Validate reminder_interval if provided
  if (reminder_interval && !['15min', '30min', '1hr', 'none'].includes(reminder_interval)) {
    return NextResponse.json(
      { error: 'Invalid reminder_interval. Must be 15min, 30min, 1hr, or none.' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (push_enabled !== undefined) updates.push_enabled = push_enabled;
  if (sms_enabled !== undefined) updates.sms_enabled = sms_enabled;
  if (email_enabled !== undefined) updates.email_enabled = email_enabled;
  if (reminder_interval !== undefined) updates.reminder_interval = reminder_interval;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No fields to update' },
      { status: 400 }
    );
  }

  // Upsert: insert if not exists, update if exists
  const { data: existing } = await supabase
    .from('notification_preferences')
    .select('id')
    .eq('driver_id', payload.userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('notification_preferences')
      .update(updates)
      .eq('driver_id', payload.userId);

    if (error) {
      console.error('Failed to update notification preferences:', error);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }
  } else {
    const { error } = await supabase
      .from('notification_preferences')
      .insert({
        driver_id: payload.userId,
        push_enabled: push_enabled ?? true,
        sms_enabled: sms_enabled ?? true,
        email_enabled: email_enabled ?? true,
        reminder_interval: reminder_interval ?? '30min',
      });

    if (error) {
      console.error('Failed to create notification preferences:', error);
      return NextResponse.json(
        { error: 'Failed to save preferences' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Notification preferences updated.',
  });
}
