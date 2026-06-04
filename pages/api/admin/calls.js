import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  const result = await sql`
    SELECT * FROM call_logs ORDER BY created_at DESC LIMIT 100
  `
  return res.status(200).json({ calls: result.rows })
}
