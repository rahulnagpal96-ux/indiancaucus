import Stripe from 'stripe'
import { isAuthenticated } from '../../../lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe is not configured.' })
  }

  const { paymentIntentId, number, exp_month, exp_year, cvc } = req.body
  if (!paymentIntentId || !number || !exp_month || !exp_year || !cvc) {
    return res.status(400).json({ error: 'Missing card details.' })
  }

  try {
    const pm = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: String(number).replace(/\s/g, ''),
        exp_month: parseInt(exp_month, 10),
        exp_year: parseInt(exp_year, 10),
        cvc: String(cvc),
      },
    })

    const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: pm.id,
    })

    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ status: intent.status, id: intent.id })
  } catch (err) {
    console.error('terminal-charge error:', err)
    return res.status(500).json({ error: err.message })
  }
}
