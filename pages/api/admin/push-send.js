import webpush from 'web-push'
import { isAuthenticated } from '../../../lib/auth'
import { getPushSubscriptions, deletePushSubscription } from '../../../lib/db'

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const PRIVATE = process.env.VAPID_PRIVATE_KEY
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@indiancaucus.org'

if (PUBLIC && PRIVATE) {
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE)
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()
  if (!PUBLIC || !PRIVATE) return res.status(400).json({ error: 'Push not configured (VAPID keys missing)' })

  const { title = 'Indian Caucus', body = '', url = '/dashboard' } = req.body || {}
  const payload = JSON.stringify({ title, body, url })

  try {
    const subs = (await getPushSubscriptions()).rows
    let sent = 0
    await Promise.all(subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)
        sent++
      } catch (err) {
        // Subscription expired/invalid — clean it up.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await deletePushSubscription(s.endpoint).catch(() => {})
        }
      }
    }))
    return res.status(200).json({ ok: true, sent, total: subs.length })
  } catch (err) {
    console.error('push-send error:', err)
    return res.status(500).json({ error: err.message })
  }
}
