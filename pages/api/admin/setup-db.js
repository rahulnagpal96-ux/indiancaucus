import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id          SERIAL PRIMARY KEY,
        email       VARCHAR(255) UNIQUE NOT NULL,
        first_name  VARCHAR(255),
        last_name   VARCHAR(255),
        phone       VARCHAR(30),
        source      VARCHAR(50)  DEFAULT 'newsletter',
        status      VARCHAR(20)  DEFAULT 'active',
        created_at  TIMESTAMPTZ  DEFAULT NOW()
      )
    `
    await sql`
      ALTER TABLE subscribers
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)
    `

    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id              SERIAL PRIMARY KEY,
        subject         VARCHAR(500) NOT NULL,
        html_content    TEXT         NOT NULL,
        type            VARCHAR(20)  DEFAULT 'email',
        status          VARCHAR(20)  DEFAULT 'draft',
        recipient_count INT          DEFAULT 0,
        sent_at         TIMESTAMPTZ,
        created_at      TIMESTAMPTZ  DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id          SERIAL PRIMARY KEY,
        user_email  VARCHAR(255),
        action      VARCHAR(100),
        page        VARCHAR(255),
        detail      TEXT,
        ip_address  VARCHAR(60),
        user_agent  TEXT,
        isp         VARCHAR(255),
        city        VARCHAR(100),
        country     VARCHAR(100),
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS pos_payments (
        id                SERIAL PRIMARY KEY,
        payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
        amount            INT NOT NULL,
        currency          VARCHAR(10)  DEFAULT 'usd',
        description       TEXT,
        status            VARCHAR(30),
        receipt_email     VARCHAR(255),
        receipt_url       TEXT,
        created_at        TIMESTAMPTZ  DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id          SERIAL PRIMARY KEY,
        endpoint    TEXT UNIQUE NOT NULL,
        p256dh      TEXT NOT NULL,
        auth        TEXT NOT NULL,
        user_email  VARCHAR(255),
        user_agent  TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS user_agent TEXT`

    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key        VARCHAR(100) PRIMARY KEY,
        value      TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        name          VARCHAR(255),
        role          VARCHAR(20)  DEFAULT 'staff',
        active        BOOLEAN      DEFAULT true,
        last_login_at TIMESTAMPTZ,
        created_at    TIMESTAMPTZ  DEFAULT NOW()
      )
    `

    return res.status(200).json({ ok: true, message: 'Tables created (or already exist).' })
  } catch (err) {
    console.error('setup-db error:', err)
    return res.status(500).json({ error: err.message })
  }
}
