import Stripe from 'stripe'
import { isAuthenticated } from '../../../lib/auth'
import { recordPosPayment, getPosRecent, getPosSummary } from '../../../lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    try {
      const [summary, recent] = await Promise.all([getPosSummary(), getPosRecent(20)])
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ ...summary, recent: recent.rows })
    } catch (err) {
      console.error('pos GET error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { paymentIntentId } = req.body || {}
    if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required' })
    try {
      // Verify against Stripe before recording — never trust the client.
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
      if (pi.metadata?.source !== 'dashboard-pos') {
        return res.status(400).json({ error: 'Not a POS payment' })
      }
      if (pi.status !== 'succeeded' && pi.status !== 'processing') {
        return res.status(400).json({ error: `Payment not completed (${pi.status})` })
      }
      const result = await recordPosPayment({
        paymentIntentId: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        description: pi.description,
        status: pi.status,
        receiptEmail: pi.receipt_email || pi.latest_charge?.receipt_email || null,
        receiptUrl: pi.latest_charge?.receipt_url || null,
      })
      return res.status(200).json({ ok: true, payment: result.rows[0] })
    } catch (err) {
      console.error('pos POST error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
