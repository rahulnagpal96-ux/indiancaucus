import Stripe from 'stripe'
import { isAuthenticated } from '../../../lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Creates a PaymentIntent for an in-person (POS / Terminal) card payment.
// The card itself is collected client-side by Stripe Elements, so no card
// data ever touches this server.
export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' })
  }

  // amount arrives in cents (integer) from the keypad
  const cents = Math.round(Number(req.body?.amount))
  if (!Number.isFinite(cents) || cents < 50) {
    return res.status(400).json({ error: 'Amount must be at least $0.50' })
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: 'usd',
      payment_method_types: ['card'],
      description: (req.body?.description || '').trim() || 'In-person payment',
      metadata: { source: 'dashboard-pos' },
    })
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ clientSecret: intent.client_secret, paymentIntentId: intent.id })
  } catch (err) {
    console.error('terminal-intent error:', err)
    return res.status(500).json({ error: err.message })
  }
}
