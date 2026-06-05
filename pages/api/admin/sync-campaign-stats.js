import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

function extractStats(data) {
  const opens =
    data.metrics?.opens_count ??
    data.metrics?.opens_unique ??
    data.metrics?.opens ??
    data.opens ??
    data.open_count ??
    0
  const clicks =
    data.metrics?.clicks_count ??
    data.metrics?.clicks_unique ??
    data.metrics?.clicks ??
    data.clicks ??
    data.click_count ??
    0
  return { opens: Number(opens) || 0, clicks: Number(clicks) || 0 }
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const key = process.env.RESEND_API_KEY
  if (!key) return res.status(400).json({ error: 'RESEND_API_KEY not configured' })

  try {
    // Ensure columns exist
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_opens  INT DEFAULT 0`
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_clicks INT DEFAULT 0`

    // Step 1: fetch all broadcasts from Resend so we can match any that are missing IDs
    const listResp = await fetch('https://api.resend.com/broadcasts', {
      headers: { Authorization: `Bearer ${key}` },
    })
    const listData = await listResp.json()
    const resendBroadcasts = listData.data ?? listData.broadcasts ?? []

    // Step 2: get all sent campaigns (with or without broadcast ID)
    const { rows: campaigns } = await sql`
      SELECT id, subject, sent_at, resend_broadcast_id
      FROM campaigns
      WHERE status = 'sent'
    `

    const debug = []
    let synced = 0

    for (const c of campaigns) {
      try {
        let broadcastId = c.resend_broadcast_id

        // If no broadcast ID saved, try to match by subject from the Resend list
        if (!broadcastId && resendBroadcasts.length > 0) {
          const match = resendBroadcasts.find(b =>
            b.name === c.subject || b.subject === c.subject
          )
          if (match) {
            broadcastId = match.id
            // Save the matched broadcast ID back to DB
            await sql`UPDATE campaigns SET resend_broadcast_id = ${broadcastId} WHERE id = ${c.id}`
            debug.push({ id: c.id, action: 'matched broadcast by subject', broadcastId })
          }
        }

        if (!broadcastId) {
          debug.push({ id: c.id, subject: c.subject, action: 'no broadcast ID found in Resend' })
          continue
        }

        // Resend GET /broadcasts/{id} does not return metrics — opens/clicks
        // come through webhooks only (api/resend/webhook.js → campaign_email_events).
        // This step just ensures the broadcast_id is linked so webhook events match.
        debug.push({ id: c.id, broadcastId, note: 'broadcast linked — opens/clicks tracked via webhook' })
        synced++
      } catch (e) {
        debug.push({ id: c.id, exception: e.message })
      }
    }

    return res.status(200).json({
      ok: true,
      synced,
      totalBroadcastsFromResend: resendBroadcasts.length,
      debug,
    })
  } catch (err) {
    console.error('sync-campaign-stats error:', err)
    return res.status(500).json({ error: err.message })
  }
}
