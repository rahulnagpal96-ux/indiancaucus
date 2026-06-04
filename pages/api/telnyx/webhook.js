import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const event = req.body?.data

  try {
    if (event?.event_type === 'message.received') {
      const msg = event.payload
      await sql`
        INSERT INTO sms_messages (direction, from_number, to_number, body, status, telnyx_message_id)
        VALUES ('inbound', ${msg.from.phone_number}, ${msg.to[0].phone_number}, ${msg.text}, 'received', ${msg.id})
        ON CONFLICT (telnyx_message_id) DO NOTHING
      `
    }

    if (event?.event_type === 'message.finalized') {
      const msg = event.payload
      await sql`
        UPDATE sms_messages SET status = ${msg.to[0]?.status || 'delivered'}
        WHERE telnyx_message_id = ${msg.id}
      `
    }

    if (event?.event_type === 'call.initiated') {
      const call = event.payload
      await sql`
        INSERT INTO call_logs (direction, from_number, to_number, status, telnyx_call_id)
        VALUES (${call.direction}, ${call.from}, ${call.to}, 'initiated', ${call.call_control_id})
        ON CONFLICT (telnyx_call_id) DO NOTHING
      `
    }

    if (event?.event_type === 'call.answered') {
      const call = event.payload
      await sql`
        UPDATE call_logs SET status = 'answered' WHERE telnyx_call_id = ${call.call_control_id}
      `
    }

    if (event?.event_type === 'call.hangup') {
      const call = event.payload
      const duration = Math.round((call.end_time - call.start_time) / 1000) || 0
      const status = duration === 0 ? 'missed' : 'completed'
      await sql`
        UPDATE call_logs SET status = ${status}, duration_sec = ${duration}
        WHERE telnyx_call_id = ${call.call_control_id}
      `
    }
  } catch (err) {
    console.error('Telnyx webhook error:', err)
  }

  return res.status(200).json({ received: true })
}
