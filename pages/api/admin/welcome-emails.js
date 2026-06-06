import { getWelcomeEmailStats, getWelcomeEmails } from '../../../lib/db'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const [stats, list] = await Promise.all([getWelcomeEmailStats(), getWelcomeEmails(100)])
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ stats, welcomeEmails: list.rows })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
