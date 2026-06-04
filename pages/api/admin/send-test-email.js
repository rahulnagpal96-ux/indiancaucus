import { isAuthenticated } from '../../../lib/auth'

function getCampaignFromAddress() {
  return process.env.EMAIL_FROM_EVENTS || process.env.EMAIL_FROM || 'Indian Caucus of Secaucus <noreply@newsletters.indiancaucus.org>'
}

function getBroadcastHtml(html) {
  return html
    .replace(/\{\{name\}\}/g, '{{{contact.first_name|Friend}}}')
}

async function resendRequest(path, { method = 'GET', body } = {}) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) throw new Error('RESEND_API_KEY not configured')

  const resp = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!resp.ok) {
    const message = await resp.text()
    throw new Error(`Resend error (${resp.status}): ${message}`)
  }

  const text = await resp.text()
  return text ? JSON.parse(text) : {}
}

async function sendTestBroadcast({ email, subject, html }) {
  if (!html || typeof html !== 'string') {
    throw new Error('Campaign HTML content is required for broadcast test sends')
  }

  const segment = await resendRequest('/segments', {
    method: 'POST',
    body: { name: `Campaign test ${new Date().toISOString()}` },
  })

  await resendRequest('/contacts', {
    method: 'POST',
    body: {
      email,
      segments: [{ id: segment.id }],
    },
  })

  const broadcast = await resendRequest('/broadcasts', {
    method: 'POST',
    body: {
      segment_id: segment.id,
      from: getCampaignFromAddress(),
      subject,
      name: subject,
      html: getBroadcastHtml(html),
      send: true,
    },
  })

  return { broadcastId: broadcast.id, segmentId: segment.id }
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const { email, subject, html, broadcast = true } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  if (!broadcast) {
    return res.status(400).json({ error: 'Broadcast mode is required for test sends' })
  }

  if (!html) return res.status(400).json({ error: 'Campaign HTML content required for broadcast test' })

  try {
    const result = await sendTestBroadcast({ email, subject: subject || '[TEST] Welcome to Indian Caucus of Secaucus', html })
    return res.status(200).json({ ok: true, broadcastId: result.broadcastId, segmentId: result.segmentId })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
