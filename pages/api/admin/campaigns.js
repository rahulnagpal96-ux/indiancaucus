import { createCampaign, getCampaigns, markCampaignSent, getSubscribers } from '../../../lib/db'
import { isAuthenticated } from '../../../lib/auth'

async function sendBatchEmails(subscribers, subject, htmlContent) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) throw new Error('RESEND_API_KEY not configured')

  const fromAddress = process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <newsletter@indiancaucusofsecaucus.org>'
  const BATCH_SIZE = 100
  let sent = 0

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE).map((sub) => ({
      from: fromAddress,
      to: sub.email,
      subject,
      html: htmlContent.replace(/\{\{name\}\}/g, sub.first_name || 'Friend'),
    }))

    const resp = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    })

    if (!resp.ok) {
      const body = await resp.text()
      throw new Error(`Resend batch error (${resp.status}): ${body}`)
    }
    sent += batch.length
  }

  return sent
}

export default async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })

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
        const sentCount = await sendBatchEmails(subscribers, subject, htmlContent)
        await markCampaignSent(campaign.id, sentCount)
        return res.status(200).json({ ok: true, sent: sentCount, campaignId: campaign.id })
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
      const sentCount = await sendBatchEmails(subsResult.rows, campaign.subject, htmlContent)
      await markCampaignSent(id, sentCount)

      return res.status(200).json({ ok: true, sent: sentCount })
    } catch (err) {
      console.error('campaigns PATCH error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
