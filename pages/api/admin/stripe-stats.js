import Stripe from 'stripe'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return res.status(200).json({ error: 'Stripe not configured' })

  const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000
    const startOfYear  = new Date(now.getFullYear(), 0, 1).getTime() / 1000

    // Fetch all YTD succeeded payment intents (auto-paginate).
    const ytdIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: { gte: Math.floor(startOfYear) },
    }).autoPagingToArray({ limit: 10000 })

    const succeeded = ytdIntents.filter(p => p.status === 'succeeded' && p.metadata?.source !== 'dashboard-pos')

    const ytdRaised   = succeeded.reduce((s, p) => s + p.amount, 0)
    const thisMonth   = succeeded.filter(p => p.created >= startOfMonth).reduce((s, p) => s + p.amount, 0)
    const donorCount  = new Set(succeeded.map(p => p.receipt_email || p.customer)).size
    const avgDonation = succeeded.length ? Math.round(ytdRaised / succeeded.length) : 0
    const recurring   = succeeded.filter(p => p.metadata?.type === 'monthly' || p.invoice).length

    return res.status(200).json({
      totalRaised: ytdRaised,
      thisMonth,
      thisYear: ytdRaised,
      donorCount,
      avgDonation,
      recurring,
      count: succeeded.length,
    })
  } catch (err) {
    console.error('stripe-stats error:', err)
    return res.status(500).json({ error: err.message })
  }
}
