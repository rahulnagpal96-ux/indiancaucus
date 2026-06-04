export default function handler(req, res) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Welcome to Indian Caucus of Secaucus. Please visit our website at indian caucus dot org for the most up to date information. The fastest way to contact us is through the Contact Us form on our website. Thank you for calling and have a wonderful day.
  </Say>
  <Hangup/>
</Response>`

  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(xml)
}
