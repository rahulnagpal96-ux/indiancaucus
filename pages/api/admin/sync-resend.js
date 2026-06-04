import { isAuthenticated } from '../../../lib/auth'
import { sql } from '../../../lib/db'
import { syncResendAudience } from '../../../lib/syncSubscriber'

async function processWithConcurrency(items, concurrency, worker) {
  let index = 0
  const runners = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const currentIndex = index++
      const item = items[currentIndex]
      if (!item) continue
      await worker(item)
    }
  })
  await Promise.all(runners)
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  if (!process.env.RESEND_API_KEY) {
    return res.status(400).json({ error: 'RESEND_API_KEY is not configured' })
  }

  if (!process.env.RESEND_AUDIENCE_ID && !process.env.RESEND_SEGMENT_ID) {
    return res.status(400).json({ error: 'RESEND_AUDIENCE_ID or RESEND_SEGMENT_ID is not configured' })
  }

  const limit = Math.min(Math.max(parseInt(req.query.limit || req.body?.limit || '100', 10) || 100, 1), 100)
  const afterId = Math.max(parseInt(req.query.afterId || req.body?.afterId || '0', 10) || 0, 0)

  try {
    const result = await sql`
      SELECT id, email, first_name, last_name, status
      FROM subscribers
      WHERE id > ${afterId}
      ORDER BY id ASC
      LIMIT ${limit}
    `

    let synced = 0
    let skipped = 0

    await processWithConcurrency(result.rows, 10, async (subscriber) => {
      const email = (subscriber.email || '').toLowerCase().trim()
      if (!email) {
        skipped++
        return
      }

      try {
        const ok = await syncResendAudience(
          email,
          subscriber.first_name || '',
          subscriber.last_name || '',
          subscriber.status !== 'active'
        )
        if (ok) synced++
        else skipped++
      } catch {
        skipped++
      }
    })

    const nextCursor = result.rows.length ? result.rows[result.rows.length - 1].id : null
    const hasMore = result.rows.length === limit

    return res.status(200).json({
      ok: true,
      synced,
      skipped,
      total: result.rows.length,
      nextCursor,
      hasMore,
    })
  } catch (err) {
    console.error('sync-resend error:', err)
    return res.status(500).json({ error: err.message })
  }
}
