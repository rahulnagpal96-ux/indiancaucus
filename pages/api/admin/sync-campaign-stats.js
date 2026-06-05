import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const key = process.env.RESEND_API_KEY
  if (!key) return res.status(400).json({ error: 'RESEND_API_KEY not configured' })

  try {
    // Ensure columns exist
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_opens  INT DEFAULT 0`
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_clicks INT DEFAULT 0`

    // Get all sent campaigns that have a broadcast ID
    const { rows: campaigns } = await sql`
      SELECT id, resend_broadcast_id
      FROM campaigns
      WHERE status = 'sent' AND resend_broadcast_id IS NOT NULL
    `

    if (campaigns.length === 0) return res.status(200).json({ ok: true, synced: 0 })

    let synced = 0
    const debug = []
    for (const c of campaigns) {
      try {
        const r = await fetch(`https://api.resend.com/broadcasts/${c.resend_broadcast_id}`, {
          headers: { Authorization: `Bearer ${key}` },
        })
        const data = await r.json()

        if (!r.ok) {
          debug.push({ id: c.id, broadcastId: c.resend_broadcast_id, error: data })
          continue
        }

        // Try all known Resend metrics field names
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

        debug.push({ id: c.id, broadcastId: c.resend_broadcast_id, status: data.status, metrics: data.metrics, opens, clicks })

        await sql`
          UPDATE campaigns
          SET resend_opens = ${opens}, resend_clicks = ${clicks}
          WHERE id = ${c.id}
        `
        synced++
      } catch (e) {
        debug.push({ id: c.id, broadcastId: c.resend_broadcast_id, exception: e.message })
      }
    }

    return res.status(200).json({ ok: true, synced, debug })
  } catch (err) {
    console.error('sync-campaign-stats error:', err)
    return res.status(500).json({ error: err.message })
  }
}
