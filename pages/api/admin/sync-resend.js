import { isAuthenticated } from '../../../lib/auth'
import { getSubscribers } from '../../../lib/db'
import { syncResendAudience } from '../../../lib/syncSubscriber'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  if (!process.env.RESEND_API_KEY) {
    return res.status(400).json({ error: 'RESEND_API_KEY is not configured' })
  }

  if (!process.env.RESEND_AUDIENCE_ID && !process.env.RESEND_SEGMENT_ID) {
    return res.status(400).json({ error: 'RESEND_AUDIENCE_ID or RESEND_SEGMENT_ID is not configured' })
  }

  try {
    const result = await getSubscribers({ status: 'all' })
    let synced = 0
    let skipped = 0

    for (const subscriber of result.rows) {
      const email = (subscriber.email || '').toLowerCase().trim()
      if (!email) {
        skipped++
        continue
      }

      try {
        await syncResendAudience(
          email,
          subscriber.first_name || '',
          subscriber.last_name || '',
          subscriber.status !== 'active'
        )
        synced++
      } catch {
        skipped++
      }
    }

    return res.status(200).json({ ok: true, synced, skipped, total: result.rows.length })
  } catch (err) {
    console.error('sync-resend error:', err)
    return res.status(500).json({ error: err.message })
  }
}
