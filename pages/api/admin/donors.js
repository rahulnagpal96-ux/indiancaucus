import Stripe from 'stripe'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return res.status(200).json({ donors: [], error: 'Stripe not configured' })

  const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

  try {
    const intents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.latest_charge'],
    })

    const donors = intents.data
      .filter(p => p.status === 'succeeded')
      .map(p => {
        const charge = p.latest_charge
        return {
          id: p.id,
          amount: p.amount,
          currency: p.currency,
          date: p.created,
          email: charge?.billing_details?.email || p.receipt_email || null,
          name: charge?.billing_details?.name || null,
          type: p.metadata?.type || (p.invoice ? 'monthly' : 'one-time'),
          receiptUrl: charge?.receipt_url || null,
        }
      })

    return res.status(200).json({ donors })
  } catch (err) {
    console.error('donors error:', err)
    return res.status(500).json({ error: err.message })
  }
}
