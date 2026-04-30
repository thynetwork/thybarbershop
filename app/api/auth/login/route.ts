import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, barberCode, codeAirport, codeInitials: bodyCodeInitials, codeDigits: bodyCodeDigits } = body as {
      email?: string;
      password?: string;
      role?: 'rider' | 'driver';
      barberCode?: string;
      codeAirport?: string;
      codeInitials?: string;
      codeDigits?: string;
    };

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Look up user
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, password, role')
      .eq('email', email.toLowerCase())
      .eq('role', role)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // ── Client: validate barber code + connection ─────────

    if (role === 'rider') {
      // Support both 3-part (airport+initials+digits) and legacy 2-part (initials+digits) codes
      let initials: string;
      let digits: string;
      let airportCode: string | undefined;

      if (bodyCodeInitials && bodyCodeDigits) {
        // 3-part code from v3.0 login
        initials = bodyCodeInitials.toUpperCase();
        digits = bodyCodeDigits;
        airportCode = codeAirport?.toUpperCase();

        if (!airportCode || !/^[A-Z]{3}$/.test(airportCode)) {
          return NextResponse.json(
            { error: 'A valid 3-letter airport code is required.' },
            { status: 400 }
          );
        }
        if (!/^[A-Z]{2,3}$/.test(initials)) {
          return NextResponse.json(
            { error: 'Initials must be 2-3 letters.' },
            { status: 400 }
          );
        }
        if (!/^\d{4}$/.test(digits)) {
          return NextResponse.json(
            { error: 'Digits must be exactly 4 numbers.' },
            { status: 400 }
          );
        }
      } else if (barberCode) {
        // Legacy 2-part code format
        const codeMatch = barberCode.match(/^([A-Z]{2,3})(\d{4})$/i);
        if (!codeMatch) {
          return NextResponse.json(
            { error: 'Invalid Barber Code format.' },
            { status: 400 }
          );
        }
        initials = codeMatch[1].toUpperCase();
        digits = codeMatch[2];
      } else {
        return NextResponse.json(
          { error: 'Barber Code is required for client login.' },
          { status: 400 }
        );
      }

      // Find barber by initials + digits
      let barberQuery = supabase
        .from('drivers')
        .select('id')
        .eq('code_initials', initials)
        .eq('code_digits', digits);

      // If airport code provided, also filter by it
      if (airportCode) {
        barberQuery = barberQuery.eq('airport_code', airportCode);
      }

      const { data: barber } = await barberQuery.single();

      if (!barber) {
        return NextResponse.json(
          { error: 'Barber Code not found.' },
          { status: 404 }
        );
      }

      // Check connection
      const { data: connection } = await supabase
        .from('connections')
        .select('id, status')
        .eq('driver_id', barber.id)
        .eq('rider_id', user.id)
        .single();

      if (!connection) {
        // Auto-create connection request
        await supabase.from('connections').insert({
          driver_id: barber.id,
          rider_id: user.id,
          status: 'pending',
        });

        return NextResponse.json(
          { error: 'Connection request sent. Waiting for barber approval.' },
          { status: 403 }
        );
      }

      if (connection.status === 'pending') {
        return NextResponse.json(
          { error: 'Your connection request is pending barber approval.' },
          { status: 403 }
        );
      }

      if (connection.status === 'denied' || connection.status === 'revoked') {
        return NextResponse.json(
          { error: 'Your connection to this barber has been revoked.' },
          { status: 403 }
        );
      }
    }

    // ── Create JWT session ─────────────────────────────────

    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Set httpOnly cookie
    const redirect = role === 'driver' ? '/dashboard' : '/home';

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      redirect,
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
