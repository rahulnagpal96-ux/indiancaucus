import { isAuthenticated } from '../../../lib/auth'
import { getPayments, getPaymentsSummary } from '../../../lib/db'

// Accept only YYYY-MM-DD; anything else becomes null (no filter).
function cleanDate(v) {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  const from = cleanDate(req.query.from)
  const to = cleanDate(req.query.to)
  const status = req.query.status === 'succeeded' || req.query.status === 'processing' ? req.query.status : null

  try {
    const [payments, summary] = await Promise.all([
      getPayments({ from, to, status }),
      getPaymentsSummary({ from, to, status }),
    ])
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ payments: payments.rows, ...summary })
  } catch (err) {
    console.error('payments GET error:', err)
    return res.status(500).json({ error: err.message })
  }
}
