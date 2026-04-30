import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { sendSMS, saveInAppNotification } from '@/lib/notifications';
import { cancelEscalation } from '@/lib/escalation';
import config from '@/lib/config';

/**
 * POST /api/webhooks/twilio
 * Twilio incoming SMS webhook.
 * Parses "CONFIRM" or "DENY" from SMS body.
 * Looks up the most recent pending booking for the barber's phone number.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = (formData.get('Body') as string || '').trim().toUpperCase();
    const fromPhone = (formData.get('From') as string || '').trim();

    if (!body || !fromPhone) {
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Invalid request.</Message></Response>',
        { status: 200, headers: { 'Content-Type': 'text/xml' } }
      );
    }

    const supabase = getSupabaseServer();

    // Look up the barber by phone number
    const { data: barberUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('phone', fromPhone)
      .eq('role', 'driver')
      .single();

    if (!barberUser) {
      return twimlResponse(`${config.serviceName}: We couldn't find a barber account for this phone number.`);
    }

    // Find the most recent pending booking for this barber
    const { data: pendingBooking } = await supabase
      .from('bookings')
      .select('id, rider_id, date, time_slot, pickup_address, dropoff_address')
      .eq('driver_id', barberUser.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!pendingBooking) {
      return twimlResponse(`${config.serviceName}: You have no pending booking requests right now.`);
    }

    // Get client info
    const { data: clientUser } = await supabase
      .from('users')
      .select('id, name, phone, rider_id, preferred_name')
      .eq('id', pendingBooking.rider_id)
      .single();

    const clientName = clientUser?.preferred_name || clientUser?.name || 'the client';

    if (body === 'CONFIRM' || body === 'YES' || body === 'Y') {
      // Confirm the booking
      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          driver_confirmed_at: new Date().toISOString(),
        })
        .eq('id', pendingBooking.id);

      // Cancel escalation timers
      cancelEscalation(pendingBooking.id);

      // Notify client
      if (clientUser) {
        await saveInAppNotification(clientUser.id, {
          type: 'booking_confirmed',
          title: 'Booking confirmed!',
          body: `${barberUser.name} confirmed your booking for ${pendingBooking.date} at ${pendingBooking.time_slot}. Pickup: ${pendingBooking.pickup_address}`,
          data: { booking_id: pendingBooking.id },
        });

        if (clientUser.phone) {
          await sendSMS(
            clientUser.phone,
            `${config.serviceName}: Great news! ${barberUser.name} confirmed your booking for ${pendingBooking.date} at ${pendingBooking.time_slot}. Pickup: ${pendingBooking.pickup_address}`
          );
        }
      }

      return twimlResponse(
        `${config.serviceName}: Booking CONFIRMED for ${clientName} on ${pendingBooking.date} at ${pendingBooking.time_slot}. ${clientName} has been notified.`
      );
    }

    if (body === 'DENY' || body === 'NO' || body === 'N' || body === 'DECLINE') {
      // Deny the booking
      await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: 'Denied by barber via SMS',
        })
        .eq('id', pendingBooking.id);

      // Cancel escalation timers
      cancelEscalation(pendingBooking.id);

      // Notify client
      if (clientUser) {
        await saveInAppNotification(clientUser.id, {
          type: 'booking_denied',
          title: 'Booking not confirmed',
          body: `${barberUser.name} was unable to accept your booking for ${pendingBooking.date} at ${pendingBooking.time_slot}. Please try a different time or contact your barber.`,
          data: { booking_id: pendingBooking.id },
        });

        if (clientUser.phone) {
          await sendSMS(
            clientUser.phone,
            `${config.serviceName}: ${barberUser.name} was unable to accept your booking for ${pendingBooking.date} at ${pendingBooking.time_slot}. Please try a different time or contact your barber directly.`
          );
        }
      }

      return twimlResponse(
        `${config.serviceName}: Booking DENIED for ${clientName} on ${pendingBooking.date}. ${clientName} has been notified.`
      );
    }

    // Unrecognized command
    return twimlResponse(
      `${config.serviceName}: Reply CONFIRM to accept or DENY to decline the pending booking from ${clientName} on ${pendingBooking.date} at ${pendingBooking.time_slot}.`
    );
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return twimlResponse(`${config.serviceName}: An error occurred processing your reply. Please try again.`);
  }
}

/**
 * Build a TwiML response.
 */
function twimlResponse(message: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

/**
 * Escape XML special characters.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
