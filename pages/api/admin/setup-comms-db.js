import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS sms_messages (
        id                SERIAL PRIMARY KEY,
        direction         VARCHAR(10)  NOT NULL, -- inbound / outbound
        from_number       VARCHAR(30)  NOT NULL,
        to_number         VARCHAR(30)  NOT NULL,
        body              TEXT         NOT NULL,
        status            VARCHAR(30)  DEFAULT 'delivered',
        telnyx_message_id VARCHAR(100),
        created_at        TIMESTAMPTZ  DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS call_logs (
        id               SERIAL PRIMARY KEY,
        direction        VARCHAR(10)  NOT NULL, -- inbound / outbound
        from_number      VARCHAR(30)  NOT NULL,
        to_number        VARCHAR(30)  NOT NULL,
        status           VARCHAR(30)  DEFAULT 'completed', -- completed, missed, voicemail
        duration_sec     INTEGER      DEFAULT 0,
        telnyx_call_id   VARCHAR(100),
        created_at       TIMESTAMPTZ  DEFAULT NOW()
      )
    `

    return res.status(200).json({ ok: true, message: 'Communications tables created.' })
  } catch (err) {
    console.error('setup-comms-db error:', err)
    return res.status(500).json({ error: err.message })
  }
}
