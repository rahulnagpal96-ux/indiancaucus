import { sql } from '@vercel/postgres'

async function fetchAllMailchimpMembers(apiKey, listId) {
  const dc = apiKey.split('-').pop()
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`
  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
  const pageSize = 1000
  let offset = 0
  let all = []

  while (true) {
    const url = `${base}?count=${pageSize}&offset=${offset}&status=subscribed&fields=members.email_address,members.merge_fields`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(`Mailchimp ${resp.status}`)
    const data = await resp.json()
    const members = data.members ?? []
    all = all.concat(members)
    if (members.length < pageSize) break
    offset += pageSize
  }

  return all
}

export default async function handler(req, res) {
  // Vercel cron calls with authorization header — verify it
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  if (!apiKey || !listId) {
    return res.status(200).json({ skipped: true, reason: 'Mailchimp not configured' })
  }

  try {
    const members = await fetchAllMailchimpMembers(apiKey, listId)
    let imported = 0

    for (const m of members) {
      const email = (m.email_address || '').toLowerCase().trim()
      if (!email) continue
      const mf = m.merge_fields || {}
      const firstName = (mf.FNAME || mf.FIRST_NAME || mf.FIRSTNAME || '').trim() || null
      const phone = (mf.PHONE || mf.MPHONE || mf.CELL || mf.MOBILE || mf.PHONE_NUMBER || '').trim() || null

      try {
        await sql`
          INSERT INTO subscribers (email, first_name, phone, source)
          VALUES (${email}, ${firstName}, ${phone}, 'mailchimp')
          ON CONFLICT (email) DO UPDATE SET
            first_name = COALESCE(EXCLUDED.first_name, subscribers.first_name),
            phone      = COALESCE(EXCLUDED.phone, subscribers.phone),
            status     = 'active'
        `
        imported++
      } catch { /* skip individual row errors */ }
    }

    console.log(`[cron] Mailchimp sync: ${imported}/${members.length} upserted`)
    return res.status(200).json({ ok: true, imported, total: members.length })
  } catch (err) {
    console.error('[cron] Mailchimp sync error:', err)
    return res.status(500).json({ error: err.message })
  }
}
