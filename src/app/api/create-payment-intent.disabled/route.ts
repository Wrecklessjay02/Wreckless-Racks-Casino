import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with error handling
let stripe: Stripe | null = null
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error)
}

export async function POST(request: NextRequest) {
  try {
    const { packageId, userId } = await request.json()

    // Check if Stripe is initialized
    if (!stripe) {
      console.error('Stripe not initialized - missing STRIPE_SECRET_KEY')
      return NextResponse.json({
        error: 'Payment system unavailable',
        clientSecret: 'demo_mode'
      }, { status: 503 })
    }

    // Define coin packages (should match your frontend)
    const packages = {
      starter: { coins: 1000, price: 99, bonus: 0 }, // price in cents
      value: { coins: 5000, price: 499, bonus: 1000 },
      premium: { coins: 12000, price: 999, bonus: 3000 },
      ultimate: { coins: 25000, price: 1999, bonus: 7500 },
      whale: { coins: 60000, price: 4999, bonus: 20000 }
    }

    const selectedPackage = packages[packageId as keyof typeof packages]
    if (!selectedPackage) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPackage.price,
      currency: 'usd',
      metadata: {
        packageId,
        userId,
        coins: selectedPackage.coins.toString(),
        bonus: selectedPackage.bonus.toString(),
        totalCoins: (selectedPackage.coins + selectedPackage.bonus).toString()
      },
      description: `${selectedPackage.coins + selectedPackage.bonus} coins for Wreckless Racks Casino`
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: selectedPackage.price,
      coins: selectedPackage.coins,
      bonus: selectedPackage.bonus,
      totalCoins: selectedPackage.coins + selectedPackage.bonus
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}