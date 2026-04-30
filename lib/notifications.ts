/* ============================================================
   NOTIFICATION SYSTEM
   Gracefully degrades — console.log when env vars not set.
   Channels: SMS (Twilio), Email (Resend), Push (Expo), In-App (Supabase)
   ============================================================ */

import { getSupabaseServer } from '@/lib/supabase';
import config from '@/lib/config';

/* ── Types ──────────────────────────────────────────────────── */

export interface BookingInfo {
  id: string;
  date: string;
  timeSlot: string;
  pickupAddress: string;
  dropoffAddress: string;
  rateAmount?: number;
  rateType?: string;
  routeType?: string;
}

export interface BarberInfo {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  pushToken?: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  clientId?: string;
  preferredName?: string;
  phone?: string;
  email?: string;
  previousBookingCount?: number;
}

export interface InAppNotification {
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/* ── SMS via Twilio ─────────────────────────────────────────── */

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.log(`[${config.serviceName} SMS] (no Twilio configured) To: ${phone}`);
    console.log(`[${config.serviceName} SMS] Message: ${message}`);
    return false;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: phone,
      From: fromNumber,
      Body: message,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[${config.serviceName} SMS] Twilio error:`, errorData);
      return false;
    }

    console.log(`[${config.serviceName} SMS] Sent to ${phone}`);
    return true;
  } catch (error) {
    console.error(`[${config.serviceName} SMS] Failed:`, error);
    return false;
  }
}

/* ── Email via Resend ───────────────────────────────────────── */

export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 're_placeholder') {
    console.log(`[${config.serviceName} Email] (no Resend configured) To: ${to}`);
    console.log(`[${config.serviceName} Email] Subject: ${subject}`);
    console.log(`[${config.serviceName} Email] Body: ${body}`);
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${config.serviceName} <notifications@${config.domain}>`,
        to: [to],
        subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[${config.serviceName} Email] Resend error:`, errorData);
      return false;
    }

    console.log(`[${config.serviceName} Email] Sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`[${config.serviceName} Email] Failed:`, error);
    return false;
  }
}

/* ── Push Notification (Expo placeholder) ───────────────────── */

export async function sendPushNotification(token: string, title: string, body: string): Promise<boolean> {
  if (!token) {
    console.log(`[${config.serviceName} Push] (no push token) Title: ${title}`);
    console.log(`[${config.serviceName} Push] Body: ${body}`);
    return false;
  }

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: token,
        title,
        body,
        sound: 'default',
      }),
    });

    if (!response.ok) {
      console.error(`[${config.serviceName} Push] Expo push error`);
      return false;
    }

    console.log(`[${config.serviceName} Push] Sent to token ${token.slice(0, 20)}...`);
    return true;
  } catch (error) {
    console.error(`[${config.serviceName} Push] Failed:`, error);
    return false;
  }
}

/* ── In-App Notification (Supabase) ─────────────────────────── */

export async function saveInAppNotification(
  userId: string,
  notification: InAppNotification
): Promise<boolean> {
  const supabase = getSupabaseServer();

  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    data: notification.data || null,
    read: false,
  });

  if (error) {
    console.error(`[${config.serviceName} InApp] Failed to save notification:`, error);
    return false;
  }

  console.log(`[${config.serviceName} InApp] Saved notification for user ${userId}`);
  return true;
}

/* ── Log booking notification sent ──────────────────────────── */

async function logBookingNotification(
  bookingId: string,
  channel: 'sms' | 'email' | 'push' | 'in_app',
  recipient: string,
  status: 'sent' | 'failed',
  message: string
): Promise<void> {
  const supabase = getSupabaseServer();

  await supabase.from('booking_notifications').insert({
    booking_id: bookingId,
    channel,
    recipient,
    status,
    message,
  });
}

/* ── Get barber notification preferences ────────────────────── */

async function getBarberPreferences(barberId: string) {
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('driver_id', barberId)
    .single();

  // Return defaults if no preferences saved
  return {
    push_enabled: data?.push_enabled ?? true,
    sms_enabled: data?.sms_enabled ?? true,
    email_enabled: data?.email_enabled ?? true,
    reminder_interval: data?.reminder_interval ?? '30min',
  };
}

/* ── Build notification message ─────────────────────────────── */

function buildBookingMessage(booking: BookingInfo, client: ClientInfo): string {
  const displayName = client.preferredName || client.name;
  const isRegular = (client.previousBookingCount || 0) > 5;
  const regularPrefix = isRegular ? 'Your regular ' : '';
  const clientLabel = client.clientId ? ` (${client.clientId})` : '';
  const amount = booking.rateAmount ? ` - $${booking.rateAmount}` : '';

  return (
    `${config.serviceName}: New booking request from ${regularPrefix}${displayName}${clientLabel}\n` +
    `Date: ${booking.date} at ${booking.timeSlot}\n` +
    `Pickup: ${booking.pickupAddress}\n` +
    `Dropoff: ${booking.dropoffAddress}${amount}\n` +
    `Reply CONFIRM or DENY`
  );
}

/* ── Client transfer notification ──────────────────────────── */

export function buildClientTransferMessage(
  clientName: string,
  fromBarberName: string,
  toBarberCode: string
): string {
  return (
    `${config.serviceName}: ${clientName}, your barber ${fromBarberName} has referred you to a new barber.\n` +
    `Your new barber code is: ${toBarberCode}\n` +
    `Use this code to book your next appointment.`
  );
}

/* ── Barber code recovery notification ─────────────────────── */

export function buildCodeRecoveryMessage(barberCode: string): string {
  return (
    `${config.serviceName}: Your barber code is ${barberCode}.\n` +
    `Write it down and keep it safe. Do not share this message.\n` +
    `If you did not request this, contact support immediately.`
  );
}

/* ── Send barber code recovery (SMS + Email) ───────────────── */

export async function sendCodeRecovery(
  phone: string | undefined,
  email: string | undefined,
  barberCode: string
): Promise<boolean> {
  const message = buildCodeRecoveryMessage(barberCode);
  let sent = false;

  if (phone) {
    const smsSent = await sendSMS(phone, message);
    if (smsSent) sent = true;
  }

  if (email) {
    const emailSent = await sendEmail(
      email,
      `${config.serviceName}: Your Barber Code Recovery`,
      message
    );
    if (emailSent) sent = true;
  }

  return sent;
}

/* ── Send client transfer notification ─────────────────────── */

export async function sendClientTransferNotification(
  clientPhone: string | undefined,
  clientEmail: string | undefined,
  clientName: string,
  fromBarberName: string,
  toBarberCode: string
): Promise<boolean> {
  const message = buildClientTransferMessage(clientName, fromBarberName, toBarberCode);
  let sent = false;

  if (clientPhone) {
    const smsSent = await sendSMS(clientPhone, message);
    if (smsSent) sent = true;
  }

  if (clientEmail) {
    const emailSent = await sendEmail(
      clientEmail,
      `${config.serviceName}: Barber Transfer Notification`,
      message
    );
    if (emailSent) sent = true;
  }

  return sent;
}

/* ── Connection Request — notify barber (all 4 channels) ───── */

export async function sendConnectionRequestNotification(
  barber: BarberInfo,
  client: ClientInfo,
  source: 'invite' | 'find_a_driver' | 'manual',
  noteToBarber?: string
): Promise<void> {
  const displayName = client.preferredName || client.name;
  const clientId = client.clientId || '';

  // SMS
  let smsBody = `${config.serviceName}: New connection request\n${clientId} ${displayName} wants to connect`;
  if (noteToBarber && source !== 'find_a_driver') {
    smsBody += `\nNote: ${noteToBarber}`;
  }
  smsBody += `\nApprove: ${config.domain}/dashboard\nReply CONFIRM or DENY`;

  if (barber.phone) {
    await sendSMS(barber.phone, smsBody);
  }

  // Email
  let emailBody = `${clientId} ${displayName} has requested to connect with you on ${config.serviceName}.\n`;
  if (noteToBarber && source !== 'find_a_driver') {
    emailBody += `\nNote from ${client.preferredName || client.name.split(' ')[0]}:\n"${noteToBarber}"\n`;
  }
  emailBody += `\nApprove or deny from your dashboard:\n${config.domain}/dashboard`;

  if (barber.email) {
    await sendEmail(
      barber.email,
      `New connection request — ${clientId} ${displayName}`,
      emailBody
    );
  }

  // Push
  if (barber.pushToken) {
    await sendPushNotification(
      barber.pushToken,
      `${config.serviceName}: New connection request`,
      `${clientId} ${displayName} wants to connect. Tap to approve or deny.`
    );
  }

  // In-app
  await saveInAppNotification(barber.id, {
    type: 'connection_request',
    title: `New connection request — ${clientId}`,
    body: `${displayName} wants to connect`,
    data: {
      rider_id: client.id,
      rider_display_id: clientId,
      rider_name: displayName,
      source,
      note: noteToBarber || null,
    },
  });
}

/* ── Connection Approved — notify client (all 4 channels) ───── */

export async function sendConnectionApprovedNotification(
  barber: BarberInfo,
  client: ClientInfo,
  barberCode: string,
  barberDetails?: {
    airport?: string;
    airportName?: string;
    phone?: string;
    vehicle?: string;
    insurance?: string;
  }
): Promise<void> {
  const clientId = client.clientId || '';
  const clientFirstName = (client.preferredName || client.name).split(' ')[0];

  // SMS
  const smsBody = `${config.serviceName}: You're connected with ${barber.name}\n\nPlease write down:\nBARBER CODE: ${barberCode}\nCLIENT ID: ${clientId}\n\nYour barber uses your Client ID to identify you on every booking request.\n\nBook your first appointment: ${config.domain}/home`;

  if (client.phone) {
    await sendSMS(client.phone, smsBody);
  }

  // Email
  let emailBody = `Welcome ${clientFirstName},\n\n${barber.name} has approved your connection.\n\n`;
  emailBody += `⚠ IMPORTANT — Please write these down:\n\n`;
  emailBody += `BARBER CODE:  ${barberCode}\nCLIENT ID:     ${clientId}\n\n`;
  emailBody += `Your Barber Code is how you log in and book appointments with ${barber.name}.\n`;
  emailBody += `Your Client ID is how ${barber.name} identifies you on every booking notification.\nKeep both somewhere safe.\n\n`;
  if (barberDetails) {
    emailBody += `YOUR BARBER:\n`;
    emailBody += `Name:     ${barber.name}\n`;
    emailBody += `Code:     ${barberCode}\n`;
    if (barberDetails.airport) emailBody += `Airport:  ${barberDetails.airport}${barberDetails.airportName ? ` — ${barberDetails.airportName}` : ''}\n`;
    if (barberDetails.phone) emailBody += `Phone:    ${barberDetails.phone}\n`;
    if (barberDetails.vehicle) emailBody += `Vehicle:  ${barberDetails.vehicle}\n`;
    if (barberDetails.insurance) emailBody += `Insured:  ${barberDetails.insurance}\n`;
    emailBody += '\n';
  }
  emailBody += `Book your first appointment:\n${config.domain}/home\n\n© ${config.copyrightYear} ${config.serviceName} · ${config.companyName}`;

  if (client.email) {
    await sendEmail(
      client.email,
      `You're connected with ${barber.name} on ${config.serviceName}`,
      emailBody
    );
  }

  // Push
  if (client.phone) {
    // Push token would come from client record — using placeholder
    await sendPushNotification(
      '', // client push token not stored yet
      `${config.serviceName}: ${barber.name} approved your connection.`,
      `You can now book appointments. ${config.domain}/home`
    );
  }

  // In-app
  await saveInAppNotification(client.id, {
    type: 'connection_approved',
    title: `${barber.name} approved your connection`,
    body: `You can now book appointments. Your Client ID: ${clientId}`,
    data: {
      driver_id: barber.id,
      driver_name: barber.name,
      driver_code: barberCode,
      rider_display_id: clientId,
    },
  });
}

/* ── Connection Denied — notify client (push + SMS) ─────────── */

export async function sendConnectionDeniedNotification(
  barber: BarberInfo,
  client: ClientInfo
): Promise<void> {
  const barberFirstName = barber.name.split(' ')[0];
  // Language rule: "unable to accept at this time" — never "rejected" or "denied"
  const message = `${config.serviceName}: ${barberFirstName} was unable to accept your connection request at this time.`;

  if (client.phone) {
    await sendSMS(client.phone, message);
  }

  await saveInAppNotification(client.id, {
    type: 'connection_denied',
    title: `${barberFirstName} was unable to accept`,
    body: `Your connection request was not accepted at this time. Your Client ID is saved.`,
    data: { driver_id: barber.id, driver_name: barber.name },
  });
}

/* ── Expiry — notify client that window expired ─────────────── */

export async function sendExpiryNotification(
  barber: BarberInfo,
  client: ClientInfo
): Promise<void> {
  const barberFirstName = barber.name.split(' ')[0];
  const message = `${config.serviceName}: ${barberFirstName} hasn't responded to your connection request yet.\n\nWould you like to give them more time?\n\n${config.domain}/pending`;

  if (client.phone) {
    await sendSMS(client.phone, message);
  }

  if (client.email) {
    await sendEmail(
      client.email,
      `${config.serviceName}: ${barberFirstName} hasn't responded yet`,
      message
    );
  }
}

/* ── Extension — notify barber that client gave more time ───── */

export async function sendExtensionNotification(
  barber: BarberInfo,
  client: ClientInfo,
  hours: number
): Promise<void> {
  const clientId = client.clientId || '';
  const displayName = client.preferredName || client.name;
  const message = `${config.serviceName}: ${clientId} ${displayName} has given you ${hours} more hours to respond.\n${config.domain}/dashboard\nReply CONFIRM or DENY`;

  if (barber.phone) {
    await sendSMS(barber.phone, message);
  }

  if (barber.email) {
    await sendEmail(
      barber.email,
      `${config.serviceName}: ${clientId} gave you ${hours} more hours`,
      message
    );
  }

  await saveInAppNotification(barber.id, {
    type: 'connection_extended',
    title: `${clientId} gave you more time`,
    body: `${displayName} has given you ${hours} more hours to respond.`,
    data: { rider_id: client.id, rider_display_id: clientId, hours },
  });
}

/* ── Main: Send Booking Notification (all channels) ─────────── */

export async function sendBookingNotification(
  booking: BookingInfo,
  barber: BarberInfo,
  client: ClientInfo
): Promise<void> {
  const prefs = await getBarberPreferences(barber.id);
  const message = buildBookingMessage(booking, client);
  const displayName = client.preferredName || client.name;
  const isRegular = (client.previousBookingCount || 0) > 5;
  const regularPrefix = isRegular ? 'Your regular ' : '';

  const notificationTitle = `New booking from ${regularPrefix}${displayName}`;
  const notificationBody = `${booking.date} at ${booking.timeSlot} - ${booking.pickupAddress} to ${booking.dropoffAddress}`;

  // Always save in-app notification
  const inAppSaved = await saveInAppNotification(barber.id, {
    type: 'booking_request',
    title: notificationTitle,
    body: notificationBody,
    data: {
      booking_id: booking.id,
      rider_id: client.clientId || null,
      rider_name: displayName,
      is_regular: isRegular,
    },
  });
  await logBookingNotification(
    booking.id, 'in_app', barber.id,
    inAppSaved ? 'sent' : 'failed', notificationTitle
  );

  // SMS
  if (prefs.sms_enabled && barber.phone) {
    const smsSent = await sendSMS(barber.phone, message);
    await logBookingNotification(
      booking.id, 'sms', barber.phone,
      smsSent ? 'sent' : 'failed', message
    );
  }

  // Email
  if (prefs.email_enabled && barber.email) {
    const emailSent = await sendEmail(
      barber.email,
      `${config.serviceName}: New booking from ${displayName}`,
      message
    );
    await logBookingNotification(
      booking.id, 'email', barber.email,
      emailSent ? 'sent' : 'failed', message
    );
  }

  // Push
  if (prefs.push_enabled && barber.pushToken) {
    const pushSent = await sendPushNotification(
      barber.pushToken,
      notificationTitle,
      notificationBody
    );
    await logBookingNotification(
      booking.id, 'push', barber.pushToken,
      pushSent ? 'sent' : 'failed', notificationTitle
    );
  }

  // Notify the client that their booking was submitted
  await saveInAppNotification(client.id, {
    type: 'booking_confirmed',
    title: 'Booking submitted',
    body: `Your booking for ${booking.date} at ${booking.timeSlot} has been sent to ${barber.name}. You'll be notified when they respond.`,
    data: {
      booking_id: booking.id,
      driver_name: barber.name,
    },
  });
}
