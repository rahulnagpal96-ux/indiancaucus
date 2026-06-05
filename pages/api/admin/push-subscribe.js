import { isAuthenticated, getCurrentUser } from '../../../lib/auth'
import { savePushSubscription } from '../../../lib/db'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const sub = req.body || {}
  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return res.status(400).json({ error: 'Invalid subscription' })
  }

  try {
    const me = await getCurrentUser(req, res)
    await savePushSubscription({
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      userEmail: me?.email || null,
      userAgent: req.headers['user-agent'] || null,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('push-subscribe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
