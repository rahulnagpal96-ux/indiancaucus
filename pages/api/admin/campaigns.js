import { createCampaign, getCampaigns, markCampaignSent, getSubscribers } from '../../../lib/db'
import { isAuthenticated } from '../../../lib/auth'

function getBroadcastSegmentId() {
  return process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID || ''
}

function getCampaignFromAddress() {
  return process.env.EMAIL_FROM_EVENTS || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <noreply@newsletters.indiancaucus.org>'
}

function getBroadcastHtml(htmlContent) {
  return htmlContent
    .replace(/\{\{name\}\}/g, '{{{contact.first_name|Friend}}}')
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

async function createAndSendBroadcast(subject, htmlContent, recipientCount) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) throw new Error('RESEND_API_KEY not configured')
  const segmentId = getBroadcastSegmentId()
  if (!segmentId) throw new Error('RESEND_AUDIENCE_ID not configured')
  if (!htmlContent || typeof htmlContent !== 'string') throw new Error('Campaign HTML content is missing')

  const resp = await fetch('https://api.resend.com/broadcasts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        segment_id: segmentId,
        from: getCampaignFromAddress(),
        subject,
        name: subject,
        html: getBroadcastHtml(htmlContent),
        send: true,
      }),
    })

  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Resend broadcast error (${resp.status}): ${body}`)
  }

  const data = await resp.json()
  return {
    broadcastId: data?.id || null,
    sent: recipientCount,
  }
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    try {
      const result = await getCampaigns()
      return res.status(200).json({ campaigns: result.rows })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { subject, htmlContent, send = false } = req.body
    if (!subject || !htmlContent) return res.status(400).json({ error: 'subject and htmlContent required' })

    try {
      const created = await createCampaign({ subject, htmlContent })
      const campaign = created.rows[0]

      if (send) {
        const subsResult = await getSubscribers({ status: 'active' })
        const subscribers = subsResult.rows
        const sentCount = getEligibleRecipientCount(subscribers)
        if (sentCount === 0) {
          return res.status(400).json({ error: 'No valid active recipients found in the Resend audience' })
        }

        const broadcast = await createAndSendBroadcast(subject, htmlContent, sentCount)
        await markCampaignSent(campaign.id, sentCount)
        return res.status(200).json({ ok: true, sent: sentCount, campaignId: campaign.id, broadcastId: broadcast.broadcastId })
      }

      return res.status(200).json({ ok: true, campaign })
    } catch (err) {
      console.error('campaigns POST error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // Send an existing saved draft
  if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Campaign ID required' })

    try {
      const allCampaigns = await getCampaigns()
      const campaign = allCampaigns.rows.find((c) => c.id === parseInt(id))
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' })

      // Need full content — fetch from a separate query
      const { sql } = await import('@vercel/postgres')
      const full = await sql`SELECT html_content FROM campaigns WHERE id = ${id}`
      const htmlContent = full.rows[0]?.html_content

      const subsResult = await getSubscribers({ status: 'active' })
      const sentCount = getEligibleRecipientCount(subsResult.rows)
      if (sentCount === 0) {
        return res.status(400).json({ error: 'No valid active recipients found in the Resend audience' })
      }

      const broadcast = await createAndSendBroadcast(campaign.subject, htmlContent, sentCount)
      await markCampaignSent(id, sentCount)

      return res.status(200).json({ ok: true, sent: sentCount, broadcastId: broadcast.broadcastId })
    } catch (err) {
      console.error('campaigns PATCH error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
