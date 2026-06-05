import { isAuthenticated, getCurrentUser } from '../../../lib/auth'
import { sendPushToUser } from '../../../lib/push'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const me = await getCurrentUser(req, res)
  if (!me?.email) return res.status(401).json({ error: 'Unauthorized' })

  const { title = 'Indian Caucus', body = '', url = '/dashboard' } = req.body || {}
  // A test only goes to the requesting user's own devices.
  const result = await sendPushToUser(me.email, { title, body, url })
  if (!result.ok) return res.status(400).json({ error: result.error || 'Send failed' })
  return res.status(200).json(result)
}
