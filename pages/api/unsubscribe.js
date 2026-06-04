import { sql } from '@vercel/postgres'
import { createHash } from 'crypto'
import { syncResendAudience } from '../../lib/syncSubscriber'

async function unsubscribeFromMailchimp(email) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  if (!apiKey || !listId) return

  try {
    const dc = apiKey.split('-').pop()
    const hash = createHash('md5').update(email.toLowerCase()).digest('hex')
    await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'unsubscribed' }),
    })
  } catch (err) {
    console.error('Mailchimp unsubscribe error:', err.message)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  const clean = email.toLowerCase().trim()

  try {
    // Mark unsubscribed in Postgres — record is kept
    await sql`UPDATE subscribers SET status = 'unsubscribed' WHERE email = ${clean}`

    // Sync unsubscribe to mailing services (non-blocking)
    syncResendAudience(clean, '', '', true)
    unsubscribeFromMailchimp(clean)

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('unsubscribe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
