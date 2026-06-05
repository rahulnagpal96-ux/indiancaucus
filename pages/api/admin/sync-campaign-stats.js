import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const key = process.env.RESEND_API_KEY
  if (!key) return res.status(400).json({ error: 'RESEND_API_KEY not configured' })

  try {
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_opens  INT DEFAULT 0`
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_clicks INT DEFAULT 0`

    // Fetch all broadcasts from Resend to match any campaigns missing IDs
    const listResp = await fetch('https://api.resend.com/broadcasts', {
      headers: { Authorization: `Bearer ${key}` },
    })
    const listData = await listResp.json()
    const resendBroadcasts = listData.data ?? listData.broadcasts ?? []

    const { rows: campaigns } = await sql`
      SELECT id, subject, sent_at, resend_broadcast_id
      FROM campaigns
      WHERE status = 'sent'
    `

    let synced = 0
    for (const c of campaigns) {
      try {
        let broadcastId = c.resend_broadcast_id

        // Match missing IDs by subject
        if (!broadcastId && resendBroadcasts.length > 0) {
          const match = resendBroadcasts.find(b => b.name === c.subject || b.subject === c.subject)
          if (match) {
            broadcastId = match.id
            await sql`UPDATE campaigns SET resend_broadcast_id = ${broadcastId} WHERE id = ${c.id}`
          }
        }

        if (!broadcastId) continue
        synced++
      } catch { /* skip */ }
    }

    return res.status(200).json({ ok: true, synced })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
