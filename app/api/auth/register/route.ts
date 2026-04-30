import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { hashPassword, generateCodeDigits } from '@/lib/auth';
import { generateClientId } from '@/lib/client-id';

/**
 * Parse JSON or multipart/form-data into a plain record + file map.
 * Multipart is used by the barber registration wizard so document
 * files can be uploaded in the same request.
 */
async function parseRequest(req: NextRequest): Promise<{ body: Record<string, unknown>; files: Map<string, File> }> {
  const ct = (req.headers.get('content-type') || '').toLowerCase();
  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const body: Record<string, unknown> = {};
    const files = new Map<string, File>();
    fd.forEach((value, key) => {
      if (typeof value === 'string') {
        if (key === 'airportCodes' || key === 'serviceAreas') {
          // Comma-separated list serialized over the wire.
          body[key] = value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          body[key] = value;
        }
      } else if (value instanceof File && value.size > 0) {
        files.set(key, value);
      }
    });
    return { body, files };
  }
  const body = (await req.json()) as Record<string, unknown>;
  return { body, files: new Map() };
}

export async function POST(req: NextRequest) {
  try {
    const { body, files } = await parseRequest(req);
    const { email, password, name, phone, role, barberCode, airportCode, airportCodes, codeAirport, codeInitials: bodyCodeInitials, codeDigits: bodyCodeDigits, preferredName, noteToBarber, source, acceptedSetAmount, barberId, zipCode, city, state, serviceAreas, barberLicenseNumber, barberLicenseExpiry, dlNumber, yearsExperience } = body as {
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
      role?: 'rider' | 'driver';
      barberCode?: string;
      airportCode?: string;
      airportCodes?: string[];
      codeAirport?: string;
      codeInitials?: string;
      codeDigits?: string;
      preferredName?: string;
      noteToBarber?: string;
      source?: 'invite' | 'find_a_driver' | 'manual';
      acceptedSetAmount?: number;
      barberId?: string;
      zipCode?: string;
      city?: string;
      state?: string;
      serviceAreas?: string[];
      barberLicenseNumber?: string;
      barberLicenseExpiry?: string;
      dlNumber?: string;
      yearsExperience?: string;
    };

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required.' },
        { status: 400 }
      );
    }

    if (!['rider', 'driver'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate client identifier for client-role users.
    // The DB column stays `rider_id` (unchanged schema); the application
    // surface refers to it as Client ID.
    let clientId: string | null = null;
    if (role === 'rider') {
      const firstName = name.trim().split(/\s+/)[0];
      clientId = await generateClientId(firstName);
    }

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        role,
        rider_id: clientId,
        preferred_name: preferredName || null,
      })
      .select('id, email, name, role, rider_id, preferred_name')
      .single();

    if (userError || !newUser) {
      console.error('User creation error:', userError);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // ── Role-specific setup ────────────────────────────────

    if (role === 'driver') {
      // Barber code initials — always 3 letters per spec.
      //   3+ name parts (John Q Public)   → first + middle + last initials  (JQP)
      //   2 parts with internal capital   → first + internal cap + last     (DeShawn Jackson → DSJ)
      //   2 parts no internal cap         → first + last[0] + first cons.  (John Merrick   → JMR)
      const nameParts = name.trim().split(/\s+/).filter(Boolean);
      let initials = '';
      if (nameParts.length >= 3) {
        initials = (nameParts[0][0] + nameParts[1][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else if (nameParts.length === 2) {
        const first = nameParts[0];
        const last = nameParts[1];
        let internalCap = '';
        for (let i = 1; i < first.length; i++) {
          if (first[i] >= 'A' && first[i] <= 'Z') { internalCap = first[i]; break; }
        }
        if (internalCap) {
          initials = (first[0] + internalCap + last[0]).toUpperCase();
        } else {
          let third = last.length > 1 ? last[1] : 'X';
          for (let i = 1; i < last.length; i++) {
            const ch = last[i].toLowerCase();
            if (!'aeiou'.includes(ch)) { third = last[i]; break; }
          }
          initials = (first[0] + last[0] + third).toUpperCase();
        }
      } else {
        initials = (name.slice(0, 3).toUpperCase() + 'XX').slice(0, 3);
      }

      // Use first airport from airportCodes array, fall back to airportCode field
      const firstAirport = (airportCodes && airportCodes.length > 0 ? airportCodes[0] : airportCode) || '';
      const barberAirportCode = firstAirport.toUpperCase() || null;

      // Uniqueness key per spec: (city, state, initials, digits) — falls back
      // to airport_code if city/state aren't set on the row (legacy ThyDriver).
      // If 10 digit retries collide on the same initials, append a letter A→Z
      // to the initials and keep going (JMR → JMRA → JMRB …).
      let codeDigits = generateCodeDigits();
      const baseInitials = initials;
      let suffixIdx = -1; // -1 = no suffix; 0..25 = A..Z
      let attempts = 0;
      const MAX_DIGIT_RETRIES = 10;
      while (attempts < 26 * (MAX_DIGIT_RETRIES + 1)) {
        let existQuery = supabase
          .from('drivers')
          .select('id')
          .eq('code_initials', initials)
          .eq('code_digits', codeDigits);
        if (city) existQuery = existQuery.eq('city', city);
        if (state) existQuery = existQuery.eq('state', (state || '').toUpperCase());
        if (!city && barberAirportCode) existQuery = existQuery.eq('airport_code', barberAirportCode);

        const { data: existing } = await existQuery.single();
        if (!existing) break;

        attempts++;
        if (attempts % MAX_DIGIT_RETRIES === 0 && suffixIdx < 25) {
          // Bump initials suffix and reset digits.
          suffixIdx++;
          initials = baseInitials + String.fromCharCode(65 + suffixIdx);
        }
        codeDigits = generateCodeDigits();
      }

      const { error: barberError } = await supabase
        .from('drivers')
        .insert({
          id: newUser.id,
          code_initials: initials,
          code_digits: codeDigits,
          airport_code: barberAirportCode,
          zip_code: zipCode || null,
          city: city || null,
          state: (state || '').toUpperCase() || null,
          service_areas: serviceAreas || null,
          dl_number: dlNumber || null,
          barber_license_number: barberLicenseNumber || null,
          barber_license_expiry: barberLicenseExpiry || null,
          years_experience: yearsExperience || null,
          subscription_status: 'trial',
          is_active: false,
        });

      if (barberError) {
        console.error('Barber record error:', barberError);
        // Clean up user record
        await supabase.from('users').delete().eq('id', newUser.id);
        return NextResponse.json(
          { error: 'Failed to create barber profile.' },
          { status: 500 }
        );
      }

      // Pre-generate the shareable invite QR (SC1 reads barber.qr_code_url).
      // Failure here doesn't abort registration — SC1 can re-generate later.
      try {
        const { generateAndUploadBarberQr } = await import('@/lib/qr');
        const qrUrl = await generateAndUploadBarberQr({ initials, digits: codeDigits });
        if (qrUrl) {
          await supabase.from('drivers').update({ qr_code_url: qrUrl }).eq('id', newUser.id);
        }
      } catch (qrErr) {
        console.error('QR generation failed:', qrErr);
      }

      // Upload registration documents (DL front/back, barber & shop licenses,
      // profile photo, logo) to the private barber-documents bucket and write
      // the resulting URLs back onto the drivers row. Each upload is best-
      // effort: a missing or failed file does not abort registration —
      // ThyAdmin can request a re-upload during manual review.
      if (files.size > 0) {
        try {
          const { uploadBarberDocument } = await import('@/lib/uploads');
          const slotToColumn: Record<string, string> = {
            'profile':         'profile_photo_url',
            'logo':            'logo_url',
            'dl-front':        'dl_front_url',
            'dl-back':         'dl_back_url',
            'barber-license':  'barber_license_url',
            'shop-license':    'shop_license_url',
          };
          const fullBarberCode = `${initials}${codeDigits}`;
          const updates: Record<string, string> = {};
          for (const [slot, file] of files) {
            const column = slotToColumn[slot];
            if (!column) continue;
            const url = await uploadBarberDocument({
              file,
              barberCode: fullBarberCode,
              slot: slot as 'dl-front' | 'dl-back' | 'barber-license' | 'shop-license' | 'profile' | 'logo',
            });
            if (url) updates[column] = url;
          }
          if (Object.keys(updates).length > 0) {
            await supabase.from('drivers').update(updates).eq('id', newUser.id);
          }
        } catch (uploadErr) {
          console.error('Document upload step failed:', uploadErr);
        }
      }

      const fullCode = barberAirportCode
        ? `${barberAirportCode}·${initials}·${codeDigits}`
        : `${initials}${codeDigits}`;

      // Notify admin of new barber registration for manual review
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'maxparable@gmail.com';
        const { sendEmail } = await import('@/lib/notifications');
        await sendEmail(
          adminEmail,
          `New Barber Registration — ${name} (${fullCode})`,
          `A new barber has registered and requires manual review.\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Phone: ${phone || 'Not provided'}\n` +
          `City: ${city || 'Not provided'}\n` +
          `State: ${state || 'Not provided'}\n` +
          `Zip: ${zipCode || 'Not provided'}\n` +
          `Airport: ${barberAirportCode || 'Not set'}\n` +
          `Barber Code: ${fullCode}\n\n` +
          `Review and approve at: https://thyadmin.com/platforms/thyfreelancers/thybarbershop\n`
        );
      } catch (emailErr) {
        console.error('Admin notification email failed:', emailErr);
      }

      return NextResponse.json({
        user: newUser,
        barberCode: fullCode,
        airportCode: barberAirportCode,
        message: 'Barber account created. Pending admin review.',
      });
    }

    // ── Client registration ────────────────────────────────

    if (role === 'rider') {
      // Support both 3-part (airport+initials+digits) and legacy 2-part codes
      let initials: string;
      let digits: string;
      let clientAirportCode: string | undefined;

      if (bodyCodeInitials && bodyCodeDigits) {
        // 3-part code from v3.0 registration
        initials = bodyCodeInitials.toUpperCase();
        digits = bodyCodeDigits;
        clientAirportCode = (codeAirport || '').toUpperCase() || undefined;
      } else if (barberCode) {
        // Legacy 2-part code format
        const codeMatch = barberCode.match(/^([A-Z]{2,3})(\d{4})$/i);
        if (!codeMatch) {
          return NextResponse.json(
            { error: 'Invalid Barber Code format. Expected city + initials + digits (e.g., South Houston·MRC·3341).' },
            { status: 400 }
          );
        }
        initials = codeMatch[1].toUpperCase();
        digits = codeMatch[2];
      } else {
        return NextResponse.json(
          { error: 'A Barber Code is required for client registration.' },
          { status: 400 }
        );
      }

      // Look up barber
      let barberQuery = supabase
        .from('drivers')
        .select('id')
        .eq('code_initials', initials)
        .eq('code_digits', digits);

      if (clientAirportCode) {
        barberQuery = barberQuery.eq('airport_code', clientAirportCode);
      }

      const { data: barber } = await barberQuery.single();

      if (!barber) {
        // Clean up user record
        await supabase.from('users').delete().eq('id', newUser.id);
        return NextResponse.json(
          { error: 'Barber Code not found. Check with your barber and try again.' },
          { status: 404 }
        );
      }

      // Create connection request (pending barber approval).
      // DB columns are unchanged: connections.rider_id stores the client.
      const connectionData: Record<string, unknown> = {
        driver_id: barber.id,
        rider_id: newUser.id,
        status: 'pending',
        source: source || 'manual',
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      };
      if (noteToBarber) connectionData.note_to_driver = noteToBarber.slice(0, 160);
      if (acceptedSetAmount) {
        connectionData.set_amount = acceptedSetAmount;
        connectionData.accepted_set_amount = acceptedSetAmount;
        connectionData.set_amount_set_by = 'driver';
      }

      const { error: connError } = await supabase
        .from('connections')
        .insert(connectionData);

      if (connError) {
        console.error('Connection error:', connError);
      }

      // Send 4-channel notification to barber
      try {
        const { sendConnectionRequestNotification } = await import('@/lib/notifications');
        const { data: barberUser } = await supabase
          .from('users')
          .select('name, email, phone')
          .eq('id', barber.id)
          .single();

        if (barberUser) {
          await sendConnectionRequestNotification(
            { id: barber.id, name: barberUser.name, phone: barberUser.phone, email: barberUser.email },
            { id: newUser.id, name: newUser.name, clientId: clientId || undefined, preferredName: preferredName || undefined },
            source || 'manual',
            noteToBarber || undefined
          );
        }
      } catch (notifErr) {
        console.error('Connection notification error:', notifErr);
      }

      return NextResponse.json({
        user: newUser,
        clientId: clientId,
        connectionStatus: 'pending',
        message: 'Account created. Connection request sent to your barber.',
      });
    }

    return NextResponse.json({ user: newUser });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Registration error:', msg);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
