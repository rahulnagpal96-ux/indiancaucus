import { upsertSubscriber } from '../../lib/db'
import { syncResendAudience, syncMailchimp } from '../../lib/syncSubscriber'
import { buildWelcomeEmail, shouldSendWelcomeEmail } from '../../lib/welcomeEmail'

async function sendWelcomeEmail(email, firstName) {
  if (!shouldSendWelcomeEmail()) return

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return
  const fromAddress = process.env.EMAIL_FROM_NEWSLETTER || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <newsletter@newsletters.indiancaucus.org>'
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: 'Welcome to Indian Caucus of Secaucus',
        html: buildWelcomeEmail(firstName, email),
      }),
    })
    if (!resp.ok) console.error('Welcome email error (contact):', await resp.text())
  } catch (err) {
    console.error('Welcome email exception (contact):', err.message)
  }
}

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, subject, message } = req.body
  if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  // Auto-subscribe contact form submitters (non-blocking)
  const [firstName, ...rest] = name.trim().split(/\s+/)
  const lastName = rest.join(' ') || null
  upsertSubscriber({ email, firstName, lastName, source: 'contact-form' })
    .then(() => {
      syncResendAudience(email, firstName, lastName)
      syncMailchimp(email)
      sendWelcomeEmail(email, firstName)
    })
    .catch((err) => console.error('contact auto-subscribe error:', err.message))

  const ticketSubject = subject
    ? `[${subject}] Message from ${name}`
    : `Website message from ${name}`

  // Try Freshdesk if configured
  const apiKey = process.env.FRESHDESK_API_KEY
  const domain = process.env.FRESHDESK_DOMAIN
  if(apiKey && domain){
    try{
      const auth = Buffer.from(`${apiKey}:X`).toString('base64')
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
      const resp = await fetch(`https://${cleanDomain}/api/v2/tickets`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          description: `From: ${email}\n\nSubject: ${subject || 'General'}\n\n${message}`,
          email,
          priority: 1,
          status: 2
        })
      })
      if(resp.ok) return res.status(200).json({ status: 'created' })
      console.error('Freshdesk error:', resp.status, await resp.text())
    }catch(err){
      console.error('Freshdesk exception:', err.message)
    }
  }

  // Try Resend if configured
  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || 'indiancaucusofsecaucus@gmail.com'
  if(resendKey){
    try{
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM_DONATIONS || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <donate@newsletters.indiancaucus.org>',
          to: notifyEmail,
          reply_to: email,
          subject: ticketSubject,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'General'}\n\n${message}`
        })
      })
      if(resp.ok) return res.status(200).json({ status: 'sent' })
      console.error('Resend error:', await resp.text())
    }catch(err){
      console.error('Resend exception:', err.message)
    }
  }

  // Fallback — log and return success so form doesn't show error to visitor
  console.log('Contact form submission (no delivery service configured):', { name, email, subject, message })
  return res.status(200).json({ status: 'logged' })
}
