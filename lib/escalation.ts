/* ============================================================
   ESCALATION SYSTEM
   Automatic escalation ladder for unanswered booking requests.
   Uses setTimeout for development; production should use a job queue
   (e.g., BullMQ, Inngest, or Supabase Edge Functions with pg_cron).
   ============================================================ */

import { getSupabaseServer } from '@/lib/supabase';
import { sendSMS, sendPushNotification, saveInAppNotification } from '@/lib/notifications';
import config from '@/lib/config';

/* ── Intervals in milliseconds ──────────────────────────────── */
const ESCALATION_STEPS = {
  REMINDER_30MIN: 30 * 60 * 1000,
  REMINDER_60MIN: 60 * 60 * 1000,
  FINAL_90MIN: 90 * 60 * 1000,
  EXPIRE_120MIN: 120 * 60 * 1000,
};

/* ── Active escalation timers (in-memory; resets on server restart) */
const activeEscalations = new Map<string, NodeJS.Timeout[]>();

/**
 * Check if a booking is still pending.
 */
async function isBookingStillPending(bookingId: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('bookings')
    .select('status')
    .eq('id', bookingId)
    .single();

  return data?.status === 'pending';
}

/**
 * Get the barber and client info for a booking.
 */
async function getBookingParties(bookingId: string) {
  const supabase = getSupabaseServer();

  const { data: booking } = await supabase
    .from('bookings')
    .select('driver_id, rider_id, date, time_slot, pickup_address, dropoff_address')
    .eq('id', bookingId)
    .single();

  if (!booking) return null;

  const { data: barber } = await supabase
    .from('users')
    .select('id, name, phone, email')
    .eq('id', booking.driver_id)
    .single();

  const { data: client } = await supabase
    .from('users')
    .select('id, name, phone, rider_id, preferred_name')
    .eq('id', booking.rider_id)
    .single();

  return { booking, barber, client };
}

/**
 * Auto-expire a booking and notify the client.
 */
async function expireBooking(bookingId: string): Promise<void> {
  const supabase = getSupabaseServer();

  const stillPending = await isBookingStillPending(bookingId);
  if (!stillPending) return;

  // Update booking status to expired
  await supabase
    .from('bookings')
    .update({ status: 'expired' })
    .eq('id', bookingId);

  const parties = await getBookingParties(bookingId);
  if (!parties) return;

  const { barber, client, booking } = parties;

  // Notify client that booking expired
  if (client) {
    await saveInAppNotification(client.id, {
      type: 'booking_expired',
      title: 'Booking expired',
      body: `Your booking for ${booking.date} at ${booking.time_slot} was not confirmed by ${barber?.name || 'the barber'} within 2 hours and has expired. Please try booking again or contact your barber directly.`,
      data: { booking_id: bookingId },
    });

    if (client.phone) {
      await sendSMS(
        client.phone,
        `${config.serviceName}: Your booking for ${booking.date} at ${booking.time_slot} has expired. ${barber?.name || 'Your barber'} did not respond within 2 hours. Please rebook or contact your barber.`
      );
    }
  }

  // Notify barber that the booking auto-expired
  if (barber) {
    await saveInAppNotification(barber.id, {
      type: 'booking_expired',
      title: 'Booking auto-expired',
      body: `The booking from ${client?.preferred_name || client?.name || 'a client'} for ${booking.date} at ${booking.time_slot} has expired because it was not confirmed within 2 hours.`,
      data: { booking_id: bookingId },
    });
  }

  console.log(`[${config.serviceName} Escalation] Booking ${bookingId} auto-expired`);
}

/**
 * Schedule the escalation ladder for a booking.
 * Called after a booking is created.
 */
export function scheduleEscalation(bookingId: string): void {
  // Cancel any existing escalation for this booking
  cancelEscalation(bookingId);

  const timers: NodeJS.Timeout[] = [];

  // 30min: SMS reminder to barber
  timers.push(
    setTimeout(async () => {
      const stillPending = await isBookingStillPending(bookingId);
      if (!stillPending) return;

      const parties = await getBookingParties(bookingId);
      if (!parties?.barber) return;

      const { barber, client, booking } = parties;
      const clientName = client?.preferred_name || client?.name || 'A client';

      if (barber.phone) {
        await sendSMS(
          barber.phone,
          `${config.serviceName} Reminder: ${clientName} is waiting for your response on the ${booking.date} ${booking.time_slot} booking. Reply CONFIRM or DENY.`
        );
      }

      await saveInAppNotification(barber.id, {
        type: 'reminder',
        title: 'Booking awaiting your response',
        body: `${clientName} is still waiting for your response on the ${booking.date} booking. Please confirm or deny.`,
        data: { booking_id: bookingId },
      });

      console.log(`[${config.serviceName} Escalation] 30min reminder sent for booking ${bookingId}`);
    }, ESCALATION_STEPS.REMINDER_30MIN)
  );

  // 60min: Push + SMS reminder
  timers.push(
    setTimeout(async () => {
      const stillPending = await isBookingStillPending(bookingId);
      if (!stillPending) return;

      const parties = await getBookingParties(bookingId);
      if (!parties?.barber) return;

      const { barber, client, booking } = parties;
      const clientName = client?.preferred_name || client?.name || 'A client';

      if (barber.phone) {
        await sendSMS(
          barber.phone,
          `${config.serviceName} URGENT: ${clientName}'s booking for ${booking.date} ${booking.time_slot} needs your response. 1 hour without reply. Reply CONFIRM or DENY now.`
        );
      }

      // Push notification (if token were available)
      await sendPushNotification(
        '', // No push token stored yet in this version
        'Urgent: Booking needs response',
        `${clientName}'s booking for ${booking.date} at ${booking.time_slot} has been waiting 1 hour.`
      );

      await saveInAppNotification(barber.id, {
        type: 'reminder',
        title: 'Urgent: Booking needs response',
        body: `${clientName}'s booking for ${booking.date} at ${booking.time_slot} has been waiting 1 hour. Please respond soon or it will auto-expire.`,
        data: { booking_id: bookingId },
      });

      console.log(`[${config.serviceName} Escalation] 60min push+SMS sent for booking ${bookingId}`);
    }, ESCALATION_STEPS.REMINDER_60MIN)
  );

  // 90min: Final SMS notice
  timers.push(
    setTimeout(async () => {
      const stillPending = await isBookingStillPending(bookingId);
      if (!stillPending) return;

      const parties = await getBookingParties(bookingId);
      if (!parties?.barber) return;

      const { barber, client, booking } = parties;
      const clientName = client?.preferred_name || client?.name || 'A client';

      if (barber.phone) {
        await sendSMS(
          barber.phone,
          `${config.serviceName} FINAL NOTICE: ${clientName}'s booking for ${booking.date} ${booking.time_slot} will auto-expire in 30 minutes if not confirmed. Reply CONFIRM or DENY.`
        );
      }

      await saveInAppNotification(barber.id, {
        type: 'reminder',
        title: 'Final notice: Booking expiring soon',
        body: `${clientName}'s booking for ${booking.date} at ${booking.time_slot} will auto-expire in 30 minutes. This is your last chance to respond.`,
        data: { booking_id: bookingId },
      });

      console.log(`[${config.serviceName} Escalation] 90min final notice sent for booking ${bookingId}`);
    }, ESCALATION_STEPS.FINAL_90MIN)
  );

  // 120min: Auto-expire booking
  timers.push(
    setTimeout(async () => {
      await expireBooking(bookingId);
    }, ESCALATION_STEPS.EXPIRE_120MIN)
  );

  activeEscalations.set(bookingId, timers);
  console.log(`[${config.serviceName} Escalation] Scheduled escalation ladder for booking ${bookingId}`);
}

/**
 * Cancel all escalation timers for a booking.
 * Called when a booking is confirmed, denied, or cancelled.
 */
export function cancelEscalation(bookingId: string): void {
  const timers = activeEscalations.get(bookingId);
  if (timers) {
    timers.forEach((timer) => clearTimeout(timer));
    activeEscalations.delete(bookingId);
    console.log(`[${config.serviceName} Escalation] Cancelled escalation for booking ${bookingId}`);
  }
}
