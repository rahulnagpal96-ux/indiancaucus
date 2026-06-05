import { isAuthenticated } from '../../../lib/auth'
import { sendPushToAll } from '../../../lib/push'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { title = 'Indian Caucus', body = '', url = '/dashboard' } = req.body || {}
  const result = await sendPushToAll({ title, body, url })
  if (!result.ok) return res.status(400).json({ error: result.error || 'Send failed' })
  return res.status(200).json(result)
}
