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

export interface DriverInfo {
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

/* ── Get driver notification preferences ────────────────────── */

async function getDriverPreferences(driverId: string) {
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('driver_id', driverId)
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
  fromDriverName: string,
  toDriverCode: string
): string {
  return (
    `${config.serviceName}: ${clientName}, your driver ${fromDriverName} has referred you to a new driver.\n` +
    `Your new driver code is: ${toDriverCode}\n` +
    `Use this code to book your next ride.`
  );
}

/* ── Driver code recovery notification ─────────────────────── */

export function buildCodeRecoveryMessage(driverCode: string): string {
  return (
    `${config.serviceName}: Your driver code is ${driverCode}.\n` +
    `Write it down and keep it safe. Do not share this message.\n` +
    `If you did not request this, contact support immediately.`
  );
}

/* ── Send driver code recovery (SMS + Email) ───────────────── */

export async function sendCodeRecovery(
  phone: string | undefined,
  email: string | undefined,
  driverCode: string
): Promise<boolean> {
  const message = buildCodeRecoveryMessage(driverCode);
  let sent = false;

  if (phone) {
    const smsSent = await sendSMS(phone, message);
    if (smsSent) sent = true;
  }

  if (email) {
    const emailSent = await sendEmail(
      email,
      `${config.serviceName}: Your Driver Code Recovery`,
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
  fromDriverName: string,
  toDriverCode: string
): Promise<boolean> {
  const message = buildClientTransferMessage(clientName, fromDriverName, toDriverCode);
  let sent = false;

  if (clientPhone) {
    const smsSent = await sendSMS(clientPhone, message);
    if (smsSent) sent = true;
  }

  if (clientEmail) {
    const emailSent = await sendEmail(
      clientEmail,
      `${config.serviceName}: Driver Transfer Notification`,
      message
    );
    if (emailSent) sent = true;
  }

  return sent;
}

/* ── Connection Request — notify driver (all 4 channels) ───── */

export async function sendConnectionRequestNotification(
  driver: DriverInfo,
  client: ClientInfo,
  source: 'invite' | 'find_a_driver' | 'manual',
  noteToDriver?: string
): Promise<void> {
  const displayName = client.preferredName || client.name;
  const clientId = client.clientId || '';

  // SMS
  let smsBody = `${config.serviceName}: New connection request\n${clientId} ${displayName} wants to connect`;
  if (noteToDriver && source !== 'find_a_driver') {
    smsBody += `\nNote: ${noteToDriver}`;
  }
  smsBody += `\nApprove: ${config.domain}/dashboard\nReply CONFIRM or DENY`;

  if (driver.phone) {
    await sendSMS(driver.phone, smsBody);
  }

  // Email
  let emailBody = `${clientId} ${displayName} has requested to connect with you on ${config.serviceName}.\n`;
  if (noteToDriver && source !== 'find_a_driver') {
    emailBody += `\nNote from ${client.preferredName || client.name.split(' ')[0]}:\n"${noteToDriver}"\n`;
  }
  emailBody += `\nApprove or deny from your dashboard:\n${config.domain}/dashboard`;

  if (driver.email) {
    await sendEmail(
      driver.email,
      `New connection request — ${clientId} ${displayName}`,
      emailBody
    );
  }

  // Push
  if (driver.pushToken) {
    await sendPushNotification(
      driver.pushToken,
      `${config.serviceName}: New connection request`,
      `${clientId} ${displayName} wants to connect. Tap to approve or deny.`
    );
  }

  // In-app
  await saveInAppNotification(driver.id, {
    type: 'connection_request',
    title: `New connection request — ${clientId}`,
    body: `${displayName} wants to connect`,
    data: {
      rider_id: client.id,
      rider_display_id: clientId,
      rider_name: displayName,
      source,
      note: noteToDriver || null,
    },
  });
}

/* ── Connection Approved — notify client (all 4 channels) ───── */

export async function sendConnectionApprovedNotification(
  driver: DriverInfo,
  client: ClientInfo,
  driverCode: string,
  driverDetails?: {
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
  const smsBody = `${config.serviceName}: You're connected with ${driver.name}\n\nPlease write down:\nDRIVER CODE: ${driverCode}\nCLIENT ID: ${clientId}\n\nYour driver uses your Client ID to identify you on every booking request.\n\nBook your first ride: ${config.domain}/home`;

  if (client.phone) {
    await sendSMS(client.phone, smsBody);
  }

  // Email
  let emailBody = `Welcome ${clientFirstName},\n\n${driver.name} has approved your connection.\n\n`;
  emailBody += `⚠ IMPORTANT — Please write these down:\n\n`;
  emailBody += `DRIVER CODE:  ${driverCode}\nCLIENT ID:     ${clientId}\n\n`;
  emailBody += `Your Driver Code is how you log in and book rides with ${driver.name}.\n`;
  emailBody += `Your Client ID is how ${driver.name} identifies you on every booking notification.\nKeep both somewhere safe.\n\n`;
  if (driverDetails) {
    emailBody += `YOUR DRIVER:\n`;
    emailBody += `Name:     ${driver.name}\n`;
    emailBody += `Code:     ${driverCode}\n`;
    if (driverDetails.airport) emailBody += `Airport:  ${driverDetails.airport}${driverDetails.airportName ? ` — ${driverDetails.airportName}` : ''}\n`;
    if (driverDetails.phone) emailBody += `Phone:    ${driverDetails.phone}\n`;
    if (driverDetails.vehicle) emailBody += `Vehicle:  ${driverDetails.vehicle}\n`;
    if (driverDetails.insurance) emailBody += `Insured:  ${driverDetails.insurance}\n`;
    emailBody += '\n';
  }
  emailBody += `Book your first ride:\n${config.domain}/home\n\n© ${config.copyrightYear} ${config.serviceName} · ${config.companyName}`;

  if (client.email) {
    await sendEmail(
      client.email,
      `You're connected with ${driver.name} on ${config.serviceName}`,
      emailBody
    );
  }

  // Push
  if (client.phone) {
    // Push token would come from client record — using placeholder
    await sendPushNotification(
      '', // client push token not stored yet
      `${config.serviceName}: ${driver.name} approved your connection.`,
      `You can now book rides. ${config.domain}/home`
    );
  }

  // In-app
  await saveInAppNotification(client.id, {
    type: 'connection_approved',
    title: `${driver.name} approved your connection`,
    body: `You can now book rides. Your Client ID: ${clientId}`,
    data: {
      driver_id: driver.id,
      driver_name: driver.name,
      driver_code: driverCode,
      rider_display_id: clientId,
    },
  });
}

/* ── Connection Denied — notify client (push + SMS) ─────────── */

export async function sendConnectionDeniedNotification(
  driver: DriverInfo,
  client: ClientInfo
): Promise<void> {
  const driverFirstName = driver.name.split(' ')[0];
  // Language rule: "unable to accept at this time" — never "rejected" or "denied"
  const message = `${config.serviceName}: ${driverFirstName} was unable to accept your connection request at this time.`;

  if (client.phone) {
    await sendSMS(client.phone, message);
  }

  await saveInAppNotification(client.id, {
    type: 'connection_denied',
    title: `${driverFirstName} was unable to accept`,
    body: `Your connection request was not accepted at this time. Your Client ID is saved.`,
    data: { driver_id: driver.id, driver_name: driver.name },
  });
}

/* ── Expiry — notify client that window expired ─────────────── */

export async function sendExpiryNotification(
  driver: DriverInfo,
  client: ClientInfo
): Promise<void> {
  const driverFirstName = driver.name.split(' ')[0];
  const message = `${config.serviceName}: ${driverFirstName} hasn't responded to your connection request yet.\n\nWould you like to give them more time?\n\n${config.domain}/pending`;

  if (client.phone) {
    await sendSMS(client.phone, message);
  }

  if (client.email) {
    await sendEmail(
      client.email,
      `${config.serviceName}: ${driverFirstName} hasn't responded yet`,
      message
    );
  }
}

/* ── Extension — notify driver that client gave more time ───── */

export async function sendExtensionNotification(
  driver: DriverInfo,
  client: ClientInfo,
  hours: number
): Promise<void> {
  const clientId = client.clientId || '';
  const displayName = client.preferredName || client.name;
  const message = `${config.serviceName}: ${clientId} ${displayName} has given you ${hours} more hours to respond.\n${config.domain}/dashboard\nReply CONFIRM or DENY`;

  if (driver.phone) {
    await sendSMS(driver.phone, message);
  }

  if (driver.email) {
    await sendEmail(
      driver.email,
      `${config.serviceName}: ${clientId} gave you ${hours} more hours`,
      message
    );
  }

  await saveInAppNotification(driver.id, {
    type: 'connection_extended',
    title: `${clientId} gave you more time`,
    body: `${displayName} has given you ${hours} more hours to respond.`,
    data: { rider_id: client.id, rider_display_id: clientId, hours },
  });
}

/* ── Main: Send Booking Notification (all channels) ─────────── */

export async function sendBookingNotification(
  booking: BookingInfo,
  driver: DriverInfo,
  client: ClientInfo
): Promise<void> {
  const prefs = await getDriverPreferences(driver.id);
  const message = buildBookingMessage(booking, client);
  const displayName = client.preferredName || client.name;
  const isRegular = (client.previousBookingCount || 0) > 5;
  const regularPrefix = isRegular ? 'Your regular ' : '';

  const notificationTitle = `New booking from ${regularPrefix}${displayName}`;
  const notificationBody = `${booking.date} at ${booking.timeSlot} - ${booking.pickupAddress} to ${booking.dropoffAddress}`;

  // Always save in-app notification
  const inAppSaved = await saveInAppNotification(driver.id, {
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
    booking.id, 'in_app', driver.id,
    inAppSaved ? 'sent' : 'failed', notificationTitle
  );

  // SMS
  if (prefs.sms_enabled && driver.phone) {
    const smsSent = await sendSMS(driver.phone, message);
    await logBookingNotification(
      booking.id, 'sms', driver.phone,
      smsSent ? 'sent' : 'failed', message
    );
  }

  // Email
  if (prefs.email_enabled && driver.email) {
    const emailSent = await sendEmail(
      driver.email,
      `${config.serviceName}: New booking from ${displayName}`,
      message
    );
    await logBookingNotification(
      booking.id, 'email', driver.email,
      emailSent ? 'sent' : 'failed', message
    );
  }

  // Push
  if (prefs.push_enabled && driver.pushToken) {
    const pushSent = await sendPushNotification(
      driver.pushToken,
      notificationTitle,
      notificationBody
    );
    await logBookingNotification(
      booking.id, 'push', driver.pushToken,
      pushSent ? 'sent' : 'failed', notificationTitle
    );
  }

  // Notify the client that their booking was submitted
  await saveInAppNotification(client.id, {
    type: 'booking_confirmed',
    title: 'Booking submitted',
    body: `Your booking for ${booking.date} at ${booking.timeSlot} has been sent to ${driver.name}. You'll be notified when they respond.`,
    data: {
      booking_id: booking.id,
      driver_name: driver.name,
    },
  });
}
