import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, phone } = req.body
  if (!email || !phone) return res.status(400).json({ error: 'Email and phone required' })

  try {
    await sql`
      UPDATE subscribers
      SET phone = ${phone.trim()}
      WHERE email = ${email.toLowerCase().trim()}
    `
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('update-contact error:', err)
    return res.status(500).json({ error: err.message })
  }
}
