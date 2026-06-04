export async function syncResendAudience(email, firstName) {
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

export async function syncMailchimp(email) {
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
