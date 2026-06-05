import { isAuthenticated } from '../../../lib/auth'
import { getPosRevenueStats, getPosDailyTotals } from '../../../lib/db'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const [stats, daily] = await Promise.all([getPosRevenueStats(), getPosDailyTotals(30)])
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ ...stats, daily })
  } catch (err) {
    console.error('pos-analytics error:', err)
    return res.status(500).json({ error: err.message })
  }
}
