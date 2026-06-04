import { upsertSubscriber } from '../../lib/db'
import { buildWelcomeEmail } from '../../lib/welcomeEmail'

async function sendWelcomeEmail(email, firstName) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const fromAddress = process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <newsletter@indiancaucusofsecaucus.org>'
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

async function syncResendAudience(email, firstName) {
  const resendKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!resendKey || !audienceId) return
  try {
    const resp = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name: firstName || '', unsubscribed: false }),
    })
    if (!resp.ok) console.error('Resend audience sync error:', await resp.text())
  } catch (err) {
    console.error('Resend audience sync exception:', err.message)
  }
}

async function syncMailchimp(email) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  if (!apiKey || !listId) return
  try {
    const dc = apiKey.split('-').pop()
    const resp = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, status: 'subscribed' }),
    })
    const data = await resp.json()
    if (!resp.ok && data.title !== 'Member Exists') {
      console.error('Mailchimp sync error:', resp.status, JSON.stringify(data))
    }
  } catch (err) {
    console.error('Mailchimp sync exception:', err.message)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, firstName, phone, source } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const result = await upsertSubscriber({ email, firstName, phone, source })
    const isNew = result.rows[0]?.inserted === true

    // Sync to Mailchimp and Resend audience (non-blocking)
    syncMailchimp(email)
    syncResendAudience(email, firstName)

    // Fire welcome email via Resend once configured (non-blocking)
    if (isNew) {
      sendWelcomeEmail(email, firstName)
    }

    return res.status(200).json({ status: 'subscribed' })
  } catch (err) {
    console.error('subscribe error:', err)
    return res.status(200).json({ status: 'ok' })
  }
}
