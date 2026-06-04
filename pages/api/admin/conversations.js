import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { thread } = req.query

    if (thread) {
      // Full thread with a specific number
      const result = await sql`
        SELECT * FROM sms_messages
        WHERE from_number = ${thread} OR to_number = ${thread}
        ORDER BY created_at ASC
      `
      return res.status(200).json({ messages: result.rows })
    }

    // All conversation threads (latest message per contact)
    const result = await sql`
      SELECT DISTINCT ON (contact_number)
        id, direction, body, status, created_at,
        CASE WHEN direction = 'inbound' THEN from_number ELSE to_number END AS contact_number
      FROM sms_messages
      ORDER BY contact_number, created_at DESC
    `
    return res.status(200).json({ threads: result.rows })
  }

  if (req.method === 'POST') {
    // Send a reply SMS
    const { to, body } = req.body
    if (!to || !body) return res.status(400).json({ error: 'to and body required' })

    const apiKey = process.env.TELNYX_API_KEY
    const from = process.env.TELNYX_PHONE_NUMBER
    if (!apiKey || !from) return res.status(400).json({ error: 'Telnyx not configured' })

    const resp = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, text: body }),
    })
    const data = await resp.json()

    if (!resp.ok) return res.status(500).json({ error: data.errors?.[0]?.detail || 'Send failed' })

    await sql`
      INSERT INTO sms_messages (direction, from_number, to_number, body, status, telnyx_message_id)
      VALUES ('outbound', ${from}, ${to}, ${body}, 'sent', ${data.data?.id})
    `
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
