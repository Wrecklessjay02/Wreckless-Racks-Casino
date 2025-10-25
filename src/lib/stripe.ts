// Stripe functionality temporarily disabled
// import { loadStripe } from '@stripe/stripe-js'

// Stripe temporarily unavailable
const stripePromise = Promise.resolve(null)

export default stripePromise

export const coinPackages = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 1000,
    price: 0.99,
    bonus: 0,
    popular: false,
    priceId: 'price_starter_pack'
  },
  {
    id: 'value',
    name: 'Value Pack',
    coins: 5000,
    price: 4.99,
    bonus: 1000,
    popular: true,
    priceId: 'price_value_pack'
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    coins: 12000,
    price: 9.99,
    bonus: 3000,
    popular: false,
    priceId: 'price_premium_pack'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    coins: 25000,
    price: 19.99,
    bonus: 7500,
    popular: false,
    priceId: 'price_ultimate_pack'
  },
  {
    id: 'whale',
    name: 'Whale Pack',
    coins: 60000,
    price: 49.99,
    bonus: 20000,
    popular: false,
    priceId: 'price_whale_pack'
  }
]