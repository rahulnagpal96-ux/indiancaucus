import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getStats } from '../../../lib/db'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const stats = await getStats()
    return res.status(200).json(stats)
  } catch (err) {
    console.error('stats error:', err)
    return res.status(500).json({ error: err.message })
  }
}
