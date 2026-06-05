export async function syncResendAudience(email, firstName, lastName, unsubscribed = false) {
  const resendKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID || process.env.RESEND_SEGMENT_ID
  if (!resendKey || !audienceId) return false
  try {
    const resp = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        unsubscribed,
        segments: [{ id: audienceId }],
      }),
    })
    if (!resp.ok) {
      console.error('Resend audience sync error:', await resp.text())
      return false
    }
    return true
  } catch (err) {
    console.error('Resend audience sync exception:', err.message)
    return false
  }
}
