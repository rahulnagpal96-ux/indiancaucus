import { isAuthenticated } from '../../../lib/auth'
import { sql } from '@vercel/postgres'

async function fetchAllMailchimpMembers(apiKey, listId) {
  const dc = apiKey.split('-').pop()
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`
  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
  const pageSize = 1000
  let offset = 0
  let all = []

  while (true) {
    const url = `${base}?count=${pageSize}&offset=${offset}&status=subscribed&fields=members.email_address,members.merge_fields,members.status`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) {
      const err = await resp.json()
      throw new Error(`Mailchimp error: ${err.detail || resp.status}`)
    }
    const data = await resp.json()
    const members = data.members ?? []
    all = all.concat(members)
    if (members.length < pageSize) break
    offset += pageSize
  }

  return all
}

export default async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  if (!apiKey || !listId) {
    return res.status(400).json({ error: 'MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID are not configured' })
  }

  try {
    const members = await fetchAllMailchimpMembers(apiKey, listId)
    let imported = 0
    let skipped = 0

    for (const m of members) {
      const email = (m.email_address || '').toLowerCase().trim()
      if (!email) { skipped++; continue }

      const firstName = (m.merge_fields?.FNAME || '').trim() || null
      const phone = (m.merge_fields?.PHONE || '').trim() || null

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
      } catch {
        skipped++
      }
    }

    return res.status(200).json({ ok: true, imported, skipped, total: members.length })
  } catch (err) {
    console.error('sync-mailchimp error:', err)
    return res.status(500).json({ error: err.message })
  }
}
