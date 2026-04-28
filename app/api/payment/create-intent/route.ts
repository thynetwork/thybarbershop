import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICES: Record<string, { amount: number; description: string }> = {
  matching_fee: { amount: 999, description: 'ThyBarberShop Matching Fee' },
  subscription: { amount: 999, description: 'ThyBarberShop Weekly Subscription — $9.99/week' },
}

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    if (!type || !PRICES[type]) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 })
    }

    const { amount, description } = PRICES[type]

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
      metadata: { type },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment intent creation failed'
    console.error('Stripe create-intent error:', message)
    return NextResponse.json({ error: 'Failed to initialize payment. Please try again.' }, { status: 500 })
  }
}
