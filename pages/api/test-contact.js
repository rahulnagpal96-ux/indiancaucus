export default async function handler(req, res){
  if(req.method !== 'GET') return res.status(405).end()

  const apiKey = process.env.FRESHDESK_API_KEY
  const domain = process.env.FRESHDESK_DOMAIN

  if(!apiKey || !domain){
    return res.status(200).json({ error: 'Env vars not set', apiKey: !!apiKey, domain: !!domain })
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')

  try{
    const auth = Buffer.from(`${apiKey}:X`).toString('base64')
    const resp = await fetch(`https://${cleanDomain}/api/v2/tickets`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Test ticket from website',
        description: 'This is a test.',
        email: 'test@test.com',
        priority: 1,
        status: 2
      })
    })
    const text = await resp.text()
    return res.status(200).json({ freshdesk_status: resp.status, freshdesk_response: text, domain_used: cleanDomain })
  }catch(err){
    return res.status(200).json({ error: err.message, domain_used: cleanDomain })
  }
}
