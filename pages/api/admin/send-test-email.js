import { isAuthenticated } from '../../../lib/auth'
import { buildWelcomeEmail } from '../../../lib/welcomeEmail'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { email, subject, html } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return res.status(400).json({ error: 'RESEND_API_KEY not configured' })

  const fromAddress = process.env.EMAIL_FROM_NEWSLETTER || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <noreply@newsletters.indiancaucus.org>'

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: fromAddress,
      to: email,
      subject: subject || '[TEST] Welcome to Indian Caucus of Secaucus',
      html: html || buildWelcomeEmail('Friend', email),
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    return res.status(500).json({ error: err })
  }

  return res.status(200).json({ ok: true })
}
