import { upsertSubscriber } from '../../lib/db'

async function sendWelcomeEmail(email, firstName) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const name = firstName || 'Friend'
  const fromAddress = process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <newsletter@indiancaucusofsecaucus.org>'

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1a2744;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              Indian Caucus of Secaucus
            </h1>
            <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">Community · Culture · Civic Engagement</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="margin:0 0 16px;color:#1a2744;font-size:20px;">Welcome, ${name}! 🎉</h2>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
              Thank you for joining the Indian Caucus of Secaucus community. We're thrilled to have you with us!
            </p>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
              You'll be the first to hear about:
            </p>
            <ul style="margin:0 0 24px;padding-left:20px;color:#374151;font-size:15px;line-height:1.8;">
              <li>Upcoming community events and celebrations</li>
              <li>Cultural programs and performances</li>
              <li>Civic engagement opportunities</li>
              <li>Community news and announcements</li>
            </ul>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#e85d04;border-radius:8px;padding:0;">
                  <a href="https://www.indiancaucusofsecaucus.org/events"
                     style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                    View Upcoming Events →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
              If you have any questions, feel free to reach out at
              <a href="mailto:indiancaucusofsecaucus@gmail.com" style="color:#1a2744;">indiancaucusofsecaucus@gmail.com</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">
              © 2025 Indian Caucus of Secaucus · Secaucus, NJ
            </p>
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              You're receiving this because you subscribed at indiancaucusofsecaucus.org.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim()

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: 'Welcome to Indian Caucus of Secaucus! 🎉',
        html,
      }),
    })
    if (!resp.ok) console.error('Welcome email error:', await resp.text())
  } catch (err) {
    console.error('Welcome email exception:', err.message)
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

    // Always sync to Mailchimp while it's still configured (non-blocking)
    syncMailchimp(email)

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
