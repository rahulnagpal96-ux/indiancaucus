import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { rows, source = 'csv-import' } = req.body
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'rows array required' })
  }
  if (rows.length > 5000) {
    return res.status(400).json({ error: 'Max 5000 rows per import' })
  }

  let imported = 0
  let skipped = 0
  const errors = []

  for (const row of rows) {
    const email = (row.email || '').trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      skipped++
      continue
    }
    const firstName = (row.first_name || row.firstName || row.name || '').trim() || null
    const phone = (row.phone || row.mobile || row.cell || '').trim() || null

    try {
      await sql`
        INSERT INTO subscribers (email, first_name, phone, source)
        VALUES (${email}, ${firstName}, ${phone}, ${source})
        ON CONFLICT (email) DO UPDATE SET
          first_name = COALESCE(EXCLUDED.first_name, subscribers.first_name),
          phone = COALESCE(EXCLUDED.phone, subscribers.phone),
          status = 'active'
      `
      imported++
    } catch (err) {
      errors.push({ email, error: err.message })
      skipped++
    }
  }

  return res.status(200).json({ imported, skipped, errors: errors.slice(0, 10) })
}
