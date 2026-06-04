import { getSubscribers, deleteSubscriber } from '../../../lib/db'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { search = '', status = 'active' } = req.query
    try {
      const result = await getSubscribers({ status, search })
      return res.status(200).json({ subscribers: result.rows })
    } catch (err) {
      console.error('subscribers GET error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'ID required' })
    try {
      await deleteSubscriber(id)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('subscribers DELETE error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
