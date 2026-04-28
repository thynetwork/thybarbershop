import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { hashPassword, generateCodeDigits } from '@/lib/auth';
import { generateRiderId } from '@/lib/rider-id';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone, role, driverCode, airportCode, airportCodes, codeAirport, codeInitials: bodyCodeInitials, codeDigits: bodyCodeDigits, preferredName, noteToDriver, source, acceptedSetAmount, driverId } = body as {
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
      role?: 'rider' | 'driver';
      driverCode?: string;
      airportCode?: string;
      airportCodes?: string[];
      codeAirport?: string;
      codeInitials?: string;
      codeDigits?: string;
      preferredName?: string;
      noteToDriver?: string;
      source?: 'invite' | 'find_a_driver' | 'manual';
      acceptedSetAmount?: number;
      driverId?: string;
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

    // Generate rider_id for riders
    let riderId: string | null = null;
    if (role === 'rider') {
      const firstName = name.trim().split(/\s+/)[0];
      riderId = await generateRiderId(firstName);
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
        rider_id: riderId,
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
      // Generate driver code: first 2-3 letters from name + 4 random digits
      const nameParts = name.trim().split(/\s+/);
      let initials = '';
      if (nameParts.length >= 3) {
        initials = (nameParts[0][0] + nameParts[1][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else if (nameParts.length >= 2) {
        initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else {
        initials = name.slice(0, 2).toUpperCase();
      }

      // Use first airport from airportCodes array, fall back to airportCode field
      const firstAirport = (airportCodes && airportCodes.length > 0 ? airportCodes[0] : airportCode) || '';
      const driverAirportCode = firstAirport.toUpperCase() || null;

      // Ensure unique code (unique across airport_code + initials + digits)
      let codeDigits = generateCodeDigits();
      let attempts = 0;
      while (attempts < 10) {
        let existQuery = supabase
          .from('drivers')
          .select('id')
          .eq('code_initials', initials)
          .eq('code_digits', codeDigits);

        if (driverAirportCode) {
          existQuery = existQuery.eq('airport_code', driverAirportCode);
        }

        const { data: existing } = await existQuery.single();

        if (!existing) break;
        codeDigits = generateCodeDigits();
        attempts++;
      }

      const { error: driverError } = await supabase
        .from('drivers')
        .insert({
          id: newUser.id,
          code_initials: initials,
          code_digits: codeDigits,
          airport_code: driverAirportCode,
          subscription_status: 'trial',
          is_active: false,
        });

      if (driverError) {
        console.error('Driver record error:', driverError);
        // Clean up user record
        await supabase.from('users').delete().eq('id', newUser.id);
        return NextResponse.json(
          { error: 'Failed to create driver profile.' },
          { status: 500 }
        );
      }

      const fullCode = driverAirportCode
        ? `${driverAirportCode}·${initials}·${codeDigits}`
        : `${initials}${codeDigits}`;

      // Notify admin of new driver registration for manual review
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'maxparable@gmail.com';
        const { sendEmail } = await import('@/lib/notifications');
        await sendEmail(
          adminEmail,
          `New Driver Registration — ${name} (${fullCode})`,
          `A new driver has registered and requires manual review.\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Phone: ${phone || 'Not provided'}\n` +
          `City: ${(body as Record<string, string>).city || 'Not provided'}\n` +
          `Airport: ${driverAirportCode || 'Not set'}\n` +
          `Driver Code: ${fullCode}\n\n` +
          `Review and approve at: https://thyadmin.com/platforms/thyfreelancers/thybarbershop\n`
        );
      } catch (emailErr) {
        console.error('Admin notification email failed:', emailErr);
      }

      return NextResponse.json({
        user: newUser,
        driverCode: fullCode,
        airportCode: driverAirportCode,
        message: 'Driver account created. Pending admin review.',
      });
    }

    // ── Rider registration ─────────────────────────────────

    if (role === 'rider') {
      // Support both 3-part (airport+initials+digits) and legacy 2-part codes
      let initials: string;
      let digits: string;
      let riderAirportCode: string | undefined;

      if (bodyCodeInitials && bodyCodeDigits) {
        // 3-part code from v3.0 registration
        initials = bodyCodeInitials.toUpperCase();
        digits = bodyCodeDigits;
        riderAirportCode = (codeAirport || '').toUpperCase() || undefined;
      } else if (driverCode) {
        // Legacy 2-part code format
        const codeMatch = driverCode.match(/^([A-Z]{2,3})(\d{4})$/i);
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
          { error: 'A Driver Code is required for rider registration.' },
          { status: 400 }
        );
      }

      // Look up driver
      let driverQuery = supabase
        .from('drivers')
        .select('id')
        .eq('code_initials', initials)
        .eq('code_digits', digits);

      if (riderAirportCode) {
        driverQuery = driverQuery.eq('airport_code', riderAirportCode);
      }

      const { data: driver } = await driverQuery.single();

      if (!driver) {
        // Clean up user record
        await supabase.from('users').delete().eq('id', newUser.id);
        return NextResponse.json(
          { error: 'Driver Code not found. Check with your driver and try again.' },
          { status: 404 }
        );
      }

      // Create connection request (pending driver approval)
      const connectionData: Record<string, unknown> = {
        driver_id: driver.id,
        rider_id: newUser.id,
        status: 'pending',
        source: source || 'manual',
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      };
      if (noteToDriver) connectionData.note_to_driver = noteToDriver.slice(0, 160);
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

      // Send 4-channel notification to driver
      try {
        const { sendConnectionRequestNotification } = await import('@/lib/notifications');
        const { data: driverUser } = await supabase
          .from('users')
          .select('name, email, phone')
          .eq('id', driver.id)
          .single();

        if (driverUser) {
          await sendConnectionRequestNotification(
            { id: driver.id, name: driverUser.name, phone: driverUser.phone, email: driverUser.email },
            { id: newUser.id, name: newUser.name, riderId: riderId || undefined, preferredName: preferredName || undefined },
            source || 'manual',
            noteToDriver || undefined
          );
        }
      } catch (notifErr) {
        console.error('Connection notification error:', notifErr);
      }

      return NextResponse.json({
        user: newUser,
        riderId: riderId,
        connectionStatus: 'pending',
        message: 'Account created. Connection request sent to your driver.',
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
