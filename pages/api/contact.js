import { upsertSubscriber } from '../../lib/db'
import { syncResendAudience, syncMailchimp } from '../../lib/syncSubscriber'
import { buildWelcomeEmail, shouldSendWelcomeEmail } from '../../lib/welcomeEmail'

async function sendWelcomeEmail(email, firstName) {
  if (!shouldSendWelcomeEmail()) return

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return
  const fromAddress = process.env.EMAIL_FROM_NEWSLETTER || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <noreply@newsletters.indiancaucus.org>'
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

// ─── Lightweight spam protection ────────────────────────────────────────────
// In-memory, per-IP rate limiter. State lives per warm serverless instance, so
// it isn't a hard guarantee, but it absorbs bursts from a single source without
// any external dependency. Paired with the honeypot + timing trap below it stops
// the overwhelming majority of automated contact-form spam.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 5 // max submissions per IP per window
const MIN_FILL_MS = 3000 // forms submitted faster than this are almost always bots
const rateLimitHits = new Map() // ip -> number[] (timestamps)

function getClientIp(req){
  const xff = req.headers['x-forwarded-for']
  if(typeof xff === 'string' && xff.length) return xff.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function isRateLimited(ip){
  const now = Date.now()
  const hits = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  hits.push(now)
  rateLimitHits.set(ip, hits)
  // Opportunistically drop stale entries so the map doesn't grow unbounded.
  if(rateLimitHits.size > 5000){
    for(const [k, v] of rateLimitHits){
      if(v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitHits.delete(k)
    }
  }
  return hits.length > RATE_LIMIT_MAX
}

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, subject, message, website, elapsed } = req.body
  if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  // 1) Honeypot — a hidden field real users never fill. If it has any value the
  // submission is a bot. Return a success-looking response so bots don't learn
  // they were filtered, but skip all delivery/storage.
  if(website){
    console.warn('Contact form honeypot triggered — dropping submission')
    return res.status(200).json({ status: 'ok' })
  }

  // 2) Timing trap — humans take at least a few seconds to fill the form; bots
  // post almost instantly. Treat implausibly fast submissions as spam.
  if(typeof elapsed === 'number' && elapsed >= 0 && elapsed < MIN_FILL_MS){
    console.warn('Contact form submitted too fast — dropping submission', { elapsed })
    return res.status(200).json({ status: 'ok' })
  }

  // 3) Rate limit per IP to blunt repeated automated submissions.
  const ip = getClientIp(req)
  if(isRateLimited(ip)){
    console.warn('Contact form rate limit exceeded for', ip)
    return res.status(429).json({ error: 'Too many messages. Please try again later.' })
  }

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
          from: process.env.EMAIL_FROM_DONATIONS || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <noreply@indiancaucus.org>',
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
