import webpush from 'web-push'
import { getPushSubscriptions, getPushSubscriptionsForEvent, getPushRowsForUser, deletePushSubscription } from './db'

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const PRIVATE = process.env.VAPID_PRIVATE_KEY
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@indiancaucus.org'

let configured = false
function ensureVapid() {
  if (!PUBLIC || !PRIVATE) return false
  if (!configured) { webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE); configured = true }
  return true
}

// Push to a set of subscription rows. Never throws; prunes expired endpoints.
async function pushToRows(rows, payload) {
  let sent = 0
  await Promise.all(rows.map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)
      sent++
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await deletePushSubscription(s.endpoint).catch(() => {})
      }
    }
  }))
  return { ok: true, sent, total: rows.length }
}

// Send to every stored subscription (used by the manual "send test" action).
export async function sendPushToAll({ title = 'Indian Caucus', body = '', url = '/dashboard' }) {
  if (!ensureVapid()) return { ok: false, sent: 0, total: 0, error: 'VAPID not configured' }
  try {
    const rows = (await getPushSubscriptions()).rows
    return await pushToRows(rows, JSON.stringify({ title, body, url }))
  } catch (err) {
    return { ok: false, sent: 0, total: 0, error: err.message }
  }
}

// Send only to a single user's own devices (used by the "send test" action).
export async function sendPushToUser(email, { title = 'Indian Caucus', body = '', url = '/dashboard' }) {
  if (!ensureVapid()) return { ok: false, sent: 0, total: 0, error: 'VAPID not configured' }
  try {
    const rows = (await getPushRowsForUser(email)).rows
    return await pushToRows(rows, JSON.stringify({ title, body, url }))
  } catch (err) {
    return { ok: false, sent: 0, total: 0, error: err.message }
  }
}

// Send for an event kind ('sale' | 'subscriber'), honoring each owner's
// per-user notification preferences.
export async function sendPushForEvent({ kind, title = 'Indian Caucus', body = '', url = '/dashboard' }) {
  if (!ensureVapid()) return { ok: false, sent: 0, total: 0, error: 'VAPID not configured' }
  try {
    const rows = (await getPushSubscriptionsForEvent(kind)).rows
    return await pushToRows(rows, JSON.stringify({ title, body, url }))
  } catch (err) {
    return { ok: false, sent: 0, total: 0, error: err.message }
  }
}
