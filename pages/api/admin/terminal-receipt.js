import Stripe from 'stripe'
import { isAuthenticated } from '../../../lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Email: let Stripe send its own branded receipt (configured in the Stripe
// Dashboard → Settings → Branding / Customer emails). Setting receipt_email on
// the charge triggers Stripe to email the receipt automatically (live mode).
async function sendEmailReceipt(charge, paymentIntentId, email) {
  try {
    if (charge?.id) {
      await stripe.charges.update(charge.id, { receipt_email: email })
    } else {
      // No charge yet (e.g. still processing) — set it on the intent so Stripe
      // emails the receipt once the charge settles.
      await stripe.paymentIntents.update(paymentIntentId, { receipt_email: email })
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

// SMS isn't something Stripe sends, so deliver the official Stripe receipt link
// over Telnyx.
async function sendSmsReceipt(to, amountStr, receiptUrl) {
  const key = process.env.TELNYX_API_KEY
  const from = process.env.TELNYX_PHONE_NUMBER
  if (!key || !from) return { ok: false, error: 'SMS not configured (Telnyx missing)' }

  const text = `Indian Caucus of Secaucus — payment of ${amountStr} received. Thank you!` + (receiptUrl ? ` Receipt: ${receiptUrl}` : '')
  try {
    const resp = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, text }),
    })
    const data = await resp.json().catch(() => ({}))
    if (!resp.ok) return { ok: false, error: data.errors?.[0]?.detail || 'SMS send failed' }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { paymentIntentId, email, phone } = req.body || {}
  if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required' })
  if (!email && !phone) return res.status(400).json({ error: 'Provide an email or phone number' })

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
    const amountStr = fmt(pi.amount)
    const receiptUrl = pi.latest_charge?.receipt_url || null

    const result = {}
    if (email) result.email = await sendEmailReceipt(pi.latest_charge, pi.id, email)
    if (phone) result.sms = await sendSmsReceipt(phone, amountStr, receiptUrl)

    const anyOk = result.email?.ok || result.sms?.ok
    return res.status(anyOk ? 200 : 500).json({ ok: anyOk, ...result })
  } catch (err) {
    console.error('terminal-receipt error:', err)
    return res.status(500).json({ error: err.message })
  }
}
