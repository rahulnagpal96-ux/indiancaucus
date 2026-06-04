import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { body } = req.body
  if (!body) return res.status(400).json({ error: 'body required' })

  const apiKey = process.env.TELNYX_API_KEY
  const from = process.env.TELNYX_PHONE_NUMBER
  if (!apiKey || !from) return res.status(400).json({ error: 'Telnyx not configured' })

  // Get all active subscribers with phone numbers
  const result = await sql`
    SELECT email, first_name, phone FROM subscribers
    WHERE status = 'active' AND phone IS NOT NULL AND phone != ''
  `
  const subscribers = result.rows
  if (!subscribers.length) return res.status(200).json({ ok: true, sent: 0, message: 'No subscribers with phone numbers' })

  let sent = 0
  let failed = 0
  const DELAY_MS = 100 // avoid rate limits

  for (const sub of subscribers) {
    const personalized = body.replace(/\{\{name\}\}/g, sub.first_name || 'Friend')

    try {
      const resp = await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: sub.phone, text: personalized }),
      })
      const data = await resp.json()
      if (resp.ok) {
        await sql`
          INSERT INTO sms_messages (direction, from_number, to_number, body, status, telnyx_message_id)
          VALUES ('outbound', ${from}, ${sub.phone}, ${personalized}, 'sent', ${data.data?.id})
        `
        sent++
      } else {
        failed++
      }
    } catch {
      failed++
    }

    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  return res.status(200).json({ ok: true, sent, failed, total: subscribers.length })
}
