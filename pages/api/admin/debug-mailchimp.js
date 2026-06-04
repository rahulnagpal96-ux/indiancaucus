import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  if (!apiKey || !listId) return res.status(400).json({ error: 'Mailchimp not configured' })

  const dc = apiKey.split('-').pop()
  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`

  // Get first 5 members with ALL fields
  const resp = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members?count=5`,
    { headers: { Authorization: auth } }
  )
  const data = await resp.json()

  // Also get merge fields schema
  const mergeResp = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/merge-fields`,
    { headers: { Authorization: auth } }
  )
  const mergeData = await mergeResp.json()

  return res.status(200).json({
    mergeFields: mergeData.merge_fields?.map(f => ({ tag: f.tag, name: f.name, type: f.type })),
    sampleMembers: data.members?.map(m => ({
      email: m.email_address,
      merge_fields: m.merge_fields,
    })),
  })
}
