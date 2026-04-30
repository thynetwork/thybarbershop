import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import { createSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, barberCode } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing payment information.' }, { status: 400 })
    }
    if (!barberCode || barberCode.length < 7) {
      return NextResponse.json({ error: 'Missing barber code.' }, { status: 400 })
    }

    // Parse 3-part barber code: first 3 = airport, next 2-3 = initials, rest = digits
    const airportCode = barberCode.slice(0, 3).toUpperCase()
    const initials = barberCode.slice(3, 6).toUpperCase()
    const digits = barberCode.slice(6)

    // Verify the PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment has not been completed.' }, { status: 400 })
    }

    if (paymentIntent.amount !== 999) {
      return NextResponse.json({ error: 'Invalid payment amount.' }, { status: 400 })
    }

    // Look up the barber
    const supabase = getSupabaseServer()
    const { data: barber, error: lookupErr } = await supabase
      .from('drivers')
      .select('id, subscription_status')
      .eq('airport_code', airportCode)
      .eq('code_initials', initials)
      .eq('code_digits', digits)
      .single()

    if (lookupErr || !barber) {
      console.error('Barber lookup error:', lookupErr)
      return NextResponse.json({ error: 'Barber not found.' }, { status: 404 })
    }

    // Activate the barber subscription
    const { error: updateErr } = await supabase
      .from('drivers')
      .update({
        subscription_status: 'active',
        is_active: true,
      })
      .eq('id', barber.id)

    if (updateErr) {
      console.error('Barber activation error:', updateErr)
      return NextResponse.json({ error: 'Failed to activate subscription.' }, { status: 500 })
    }

    // Get the user info for the session
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', barber.id)
      .single()

    // Set a session cookie so the barber is logged in
    if (user) {
      const token = await createSession({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      })

      const cookieStore = await cookies()
      cookieStore.set('thybarbershop_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return NextResponse.json({
      success: true,
      redirect: '/dashboard',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Subscription activation failed'
    console.error('Subscribe error:', message)
    return NextResponse.json({ error: 'Failed to activate subscription. Please try again.' }, { status: 500 })
  }
}
