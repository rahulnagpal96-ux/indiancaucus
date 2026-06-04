import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

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
  return res.status(200).json({ ok: true, messageId: data.data?.id })
}
