import webpush from 'web-push'
import { getPushSubscriptions, deletePushSubscription } from './db'

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const PRIVATE = process.env.VAPID_PRIVATE_KEY
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@indiancaucus.org'

let configured = false
function ensureVapid() {
  if (!PUBLIC || !PRIVATE) return false
  if (!configured) { webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE); configured = true }
  return true
}

// Send a web-push notification to every stored subscription. Resolves with a
// summary; never throws so callers can fire-and-forget safely. Expired
// subscriptions are pruned automatically.
export async function sendPushToAll({ title = 'Indian Caucus', body = '', url = '/dashboard' }) {
  if (!ensureVapid()) return { ok: false, sent: 0, total: 0, error: 'VAPID not configured' }
  const payload = JSON.stringify({ title, body, url })
  let sent = 0
  let total = 0
  try {
    const subs = (await getPushSubscriptions()).rows
    total = subs.length
    await Promise.all(subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)
        sent++
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await deletePushSubscription(s.endpoint).catch(() => {})
        }
      }
    }))
  } catch (err) {
    return { ok: false, sent, total, error: err.message }
  }
  return { ok: true, sent, total }
}
