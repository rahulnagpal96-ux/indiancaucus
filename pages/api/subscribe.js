export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  if(!email) return res.status(400).json({ error: 'Email required' })

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID

  if(apiKey && listId){
    try{
      const dc = apiKey.split('-').pop()
      const resp = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_address: email, status: 'subscribed' })
      })
      const data = await resp.json()

      // Already subscribed is fine — treat as success
      if(resp.ok || data.title === 'Member Exists'){
        return res.status(200).json({ status: 'subscribed' })
      }

      console.error('Mailchimp error:', resp.status, JSON.stringify(data))
      // Fall through to graceful success below
    }catch(err){
      console.error('Mailchimp exception:', err.message)
      // Fall through to graceful success below
    }
  } else {
    console.warn('Mailchimp not configured — skipping subscribe for', email)
  }

  // Always return success to the user so the form doesn't break
  return res.status(200).json({ status: 'ok' })
}
