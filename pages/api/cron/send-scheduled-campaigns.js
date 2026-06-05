import { sql } from '@vercel/postgres'
import { markCampaignSent, getSubscribers } from '../../../lib/db'

function getBroadcastHtml(htmlContent) {
  return htmlContent.replace(/\{\{name\}\}/g, '{{{contact.first_name|Friend}}}')
}

function getEligibleRecipientCount(subscribers) {
  const seen = new Set()
  return subscribers.reduce((count, sub) => {
    const email = sub?.email?.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || seen.has(email.toLowerCase())) return count
    seen.add(email.toLowerCase())
    return count + 1
  }, 0)
}

export default async function handler(req, res) {
  const secret = req.headers['authorization']?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) return res.status(401).end()

  const resendKey = process.env.RESEND_API_KEY
  const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID
  const fromAddr = process.env.EMAIL_FROM_EVENTS || 'Indian Caucus of Secaucus <noreply@newsletters.indiancaucus.org>'

  if (!resendKey || !segmentId) return res.status(200).json({ ok: true, skipped: 'no resend config' })

  // Find campaigns whose scheduled time has passed and haven't been sent yet
  const due = await sql`
    SELECT id, subject, html_content FROM campaigns
    WHERE status = 'scheduled' AND scheduled_at <= NOW()
  `

  if (due.rows.length === 0) return res.status(200).json({ ok: true, sent: 0 })

  const subsResult = await getSubscribers({ status: 'active' })
  const sentCount = getEligibleRecipientCount(subsResult.rows)

  let sent = 0
  for (const c of due.rows) {
    try {
      const resp = await fetch('https://api.resend.com/broadcasts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segment_id: segmentId,
          from: fromAddr,
          subject: c.subject,
          name: c.subject,
          html: getBroadcastHtml(c.html_content),
          send: true,
        }),
      })
      if (!resp.ok) {
        console.error(`Scheduled campaign ${c.id} failed:`, await resp.text())
        continue
      }
      const data = await resp.json()
      await markCampaignSent(c.id, sentCount, data?.id || null)
      sent++
    } catch (err) {
      console.error(`Scheduled campaign ${c.id} error:`, err)
    }
  }

  return res.status(200).json({ ok: true, sent })
}
