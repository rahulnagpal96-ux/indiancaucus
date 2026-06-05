import { upsertSubscriber } from '../../lib/db'
import { buildWelcomeEmail, shouldSendWelcomeEmail } from '../../lib/welcomeEmail'
import { syncResendAudience } from '../../lib/syncSubscriber'
import { sendPushForEvent } from '../../lib/push'

async function sendWelcomeEmail(email, firstName) {
  if (!shouldSendWelcomeEmail()) return

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const fromAddress = process.env.EMAIL_FROM_NEWSLETTER || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <noreply@newsletters.indiancaucus.org>'
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

    // Add the subscriber to the Resend broadcast audience that campaigns are
    // sent to. Awaited so it reliably completes on serverless (un-awaited work
    // can be dropped after the response). The helper never throws.
    await syncResendAudience(email, firstName, lastName, false)

    // Notify users who opted into subscriber alerts about new organic sign-ups
    // (skip admin's manual adds).
    if (isNew && source !== 'manual') {
      const name = [firstName, lastName].filter(Boolean).join(' ')
      sendPushForEvent({
        kind: 'subscriber',
        title: 'New subscriber',
        body: name ? `${name} · ${email}` : email,
        url: '/dashboard/subscribers',
      })
    }

    // Send the welcome email only to brand-new subscribers — never on a
    // re-subscribe or update. Awaited so it reliably sends on serverless.
    if (isNew) {
      await sendWelcomeEmail(email, firstName)
    }

    return res.status(200).json({ status: 'subscribed' })
  } catch (err) {
    // Surface storage failures instead of masking them with a fake success —
    // otherwise the form reports "subscribed" while no data was saved.
    console.error('subscribe error:', err)
    return res.status(500).json({ error: 'Could not save your details. Please try again.' })
  }
}
