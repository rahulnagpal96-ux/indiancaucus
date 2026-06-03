export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  if(!email) return res.status(400).json({ error: 'Email required' })

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  if(!apiKey || !listId){
    // Accept but don't fail in dev; log and respond success for now
    console.warn('Mailchimp keys not set; skipping subscribe for', email)
    return res.status(200).json({ status: 'skipped' })
  }

  try{
    const dc = apiKey.split('-')[1]
    const resp = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: { 'Authorization': `apikey ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email, status: 'subscribed' })
    })
    if(resp.status >= 400) return res.status(500).json({ error: 'Mailchimp error' })
    return res.status(200).json({ status: 'subscribed' })
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
