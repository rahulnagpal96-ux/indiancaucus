import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const credentialId = process.env.TELNYX_WEBRTC_CREDENTIAL_ID
  const apiKey = process.env.TELNYX_API_KEY

  if (!credentialId || !apiKey) {
    return res.status(400).json({ error: 'TELNYX_WEBRTC_CREDENTIAL_ID or TELNYX_API_KEY not set' })
  }

  try {
    const resp = await fetch(
      `https://api.telnyx.com/v2/telephony_credentials/${credentialId}/token`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    )

    if (!resp.ok) {
      const err = await resp.text()
      return res.status(500).json({ error: err })
    }

    const token = await resp.text()
    return res.status(200).json({ token: token.replace(/"/g, '') })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
