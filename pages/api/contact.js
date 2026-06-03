export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, subject, message } = req.body
  if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  const apiKey = process.env.FRESHDESK_API_KEY
  const domain = process.env.FRESHDESK_DOMAIN
  if(!apiKey || !domain){
    console.warn('Freshdesk not configured; logging message:', {name, email, subject, message})
    return res.status(200).json({ status: 'logged' })
  }

  const ticketSubject = subject
    ? `[${subject}] Message from ${name}`
    : `Website message from ${name}`

  try{
    const auth = Buffer.from(`${apiKey}:X`).toString('base64')
    const resp = await fetch(`https://${domain}/api/v2/tickets`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: ticketSubject,
        description: `From: ${email}\n\n${message}`,
        email: email,
        priority: 1,
        status: 2
      })
    })
    if(resp.status >= 400) return res.status(500).json({ error: 'Freshdesk error' })
    return res.status(200).json({ status: 'created' })
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
