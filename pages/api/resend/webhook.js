import crypto from 'crypto'
import { recordCampaignEvent, recordWelcomeEmailEvent } from '../../../lib/db'

// Resend delivers signed webhooks (Svix). We read the raw body to verify.
export const config = { api: { bodyParser: false } }

async function readRaw(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks).toString('utf8')
}

function verifySvix(rawBody, headers, secret) {
  if (!secret) return true // no secret configured — accept (set RESEND_WEBHOOK_SECRET to enforce)
  const id = headers['svix-id']
  const ts = headers['svix-timestamp']
  const sigHeader = headers['svix-signature']
  if (!id || !ts || !sigHeader) return false
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = crypto.createHmac('sha256', secretBytes).update(`${id}.${ts}.${rawBody}`).digest('base64')
  // Header is a space-separated list of "v1,<signature>"
  return sigHeader.split(' ').some((part) => {
    const sig = part.split(',')[1]
    if (!sig) return false
    try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) } catch { return false }
  })
}

const EVENT_MAP = {
  'email.delivered': 'delivered',
  'email.opened': 'opened',
  'email.clicked': 'clicked',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const raw = await readRaw(req)
  if (!verifySvix(raw, req.headers, process.env.RESEND_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  let event
  try { event = JSON.parse(raw) } catch { return res.status(400).json({ error: 'Bad JSON' }) }

  const eventType = EVENT_MAP[event?.type]
  const data = event?.data || {}
  const broadcastId = data.broadcast_id
  const emailId = data.email_id
  const email = Array.isArray(data.to) ? data.to[0] : (data.to || data.email)

  if (eventType && broadcastId) {
    // Broadcast (campaign) emails carry a broadcast_id — tally those.
    try {
      await recordCampaignEvent(broadcastId, email, eventType)
    } catch (err) {
      console.error('resend webhook record error:', err)
    }
  } else if (eventType && emailId) {
    // Transactional emails (e.g. welcome emails) carry an email_id but no
    // broadcast_id — advance the matching welcome email's delivery status.
    try {
      await recordWelcomeEmailEvent(emailId, eventType)
    } catch (err) {
      console.error('resend webhook welcome record error:', err)
    }
  }

  return res.status(200).json({ ok: true })
}
