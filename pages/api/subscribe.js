import { upsertSubscriber } from '../../lib/db'
import { buildWelcomeEmail } from '../../lib/welcomeEmail'
import { syncResendAudience, syncMailchimp } from '../../lib/syncSubscriber'

async function sendWelcomeEmail(email, firstName) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const fromAddress = process.env.EMAIL_FROM_NEWSLETTER || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <newsletter@newsletters.indiancaucus.org>'
  const html = buildWelcomeEmail(firstName, email)

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: 'Welcome to Indian Caucus of Secaucus',
        html,
      }),
    })
    if (!resp.ok) console.error('Welcome email error:', await resp.text())
  } catch (err) {
    console.error('Welcome email exception:', err.message)
  }
}


export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, firstName, lastName, phone, source } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const result = await upsertSubscriber({ email, firstName, lastName, phone, source })
    const isNew = result.rows[0]?.inserted === true

    // Sync to Mailchimp and Resend audience (non-blocking)
    syncMailchimp(email)
    syncResendAudience(email, firstName, lastName)

    // Send welcome email to new subscribers OR anyone signing up via the form
    // (cron-synced contacts from Mailchimp won't have source='newsletter')
    const isFormSignup = !source || source === 'newsletter'
    if (isNew || isFormSignup) {
      sendWelcomeEmail(email, firstName)
    }

    return res.status(200).json({ status: 'subscribed' })
  } catch (err) {
    console.error('subscribe error:', err)
    return res.status(200).json({ status: 'ok' })
  }
}
