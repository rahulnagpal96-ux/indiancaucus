import { getSubscribers, deleteSubscriber } from '../../../lib/db'
import { isAuthenticated } from '../../../lib/auth'
import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { search = '', status = 'active' } = req.query
    try {
      const result = await getSubscribers({ status, search })
      return res.status(200).json({ subscribers: result.rows })
    } catch (err) {
      console.error('subscribers GET error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'ID required' })
    const { email, firstName, phone, status } = req.body
    try {
      const result = await sql`
        UPDATE subscribers SET
          email      = COALESCE(${email?.trim() || null}, email),
          first_name = COALESCE(${firstName?.trim() || null}, first_name),
          phone      = COALESCE(${phone?.trim() || null}, phone),
          status     = COALESCE(${status || null}, status)
        WHERE id = ${id}
        RETURNING *
      `
      return res.status(200).json({ subscriber: result.rows[0] })
    } catch (err) {
      console.error('subscribers PATCH error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'ID required' })
    try {
      await deleteSubscriber(id)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('subscribers DELETE error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
