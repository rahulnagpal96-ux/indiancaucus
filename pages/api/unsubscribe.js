import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    await sql`UPDATE subscribers SET status = 'unsubscribed' WHERE email = ${email.toLowerCase().trim()}`
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('unsubscribe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
