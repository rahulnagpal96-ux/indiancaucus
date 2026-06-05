import { sql } from '@vercel/postgres'

export { sql }

let subscriberSchemaPromise

async function ensureSubscriberSchema() {
  if (!subscriberSchemaPromise) {
    // Create the table if it's missing and backfill newer columns. Memoized so
    // it runs at most once per server instance. This makes writes self-healing
    // so a sign-up never silently fails just because setup-db wasn't run yet.
    subscriberSchemaPromise = (async () => {
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
      await sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)`
    })()
  }

  await subscriberSchemaPromise
}

export async function getSubscribers({ status = 'active', search = '' } = {}) {
  // Make sure the table exists so a fresh database returns an empty list
  // instead of erroring out.
  await ensureSubscriberSchema()
  if (search) {
    return sql`
      SELECT id, email, first_name, last_name, phone, source, status, created_at
      FROM subscribers
      WHERE status = ${status}
        AND (
          email ILIKE ${'%' + search + '%'}
          OR first_name ILIKE ${'%' + search + '%'}
          OR last_name ILIKE ${'%' + search + '%'}
          OR phone ILIKE ${'%' + search + '%'}
        )
      ORDER BY created_at DESC
    `
  }
  if (status === 'all') {
    return sql`SELECT id, email, first_name, last_name, phone, source, status, created_at FROM subscribers ORDER BY created_at DESC`
  }
  return sql`
    SELECT id, email, first_name, last_name, phone, source, status, created_at
    FROM subscribers
    WHERE status = ${status}
    ORDER BY created_at DESC
  `
}

export async function upsertSubscriber({ email, firstName, lastName, phone, source = 'newsletter' }) {
  await ensureSubscriberSchema()
  return sql`
    INSERT INTO subscribers (email, first_name, last_name, phone, source)
    VALUES (${email}, ${firstName || null}, ${lastName || null}, ${phone || null}, ${source})
    ON CONFLICT (email) DO UPDATE SET
      first_name = COALESCE(EXCLUDED.first_name, subscribers.first_name),
      last_name = COALESCE(EXCLUDED.last_name, subscribers.last_name),
      phone = COALESCE(EXCLUDED.phone, subscribers.phone),
      status = 'active'
    RETURNING *, (xmax = 0) AS inserted
  `
}

export async function deleteSubscriber(id) {
  return sql`UPDATE subscribers SET status = 'unsubscribed' WHERE id = ${id}`
}

export async function getStats() {
  const [total, thisMonth, phones, campaigns] = await Promise.all([
    sql`SELECT COUNT(*) FROM subscribers WHERE status = 'active'`,
    sql`SELECT COUNT(*) FROM subscribers WHERE status = 'active' AND created_at >= date_trunc('month', NOW())`,
    sql`SELECT COUNT(*) FROM subscribers WHERE status = 'active' AND phone IS NOT NULL AND phone != ''`,
    sql`SELECT COUNT(*) FROM campaigns WHERE status = 'sent'`,
  ])
  return {
    total: parseInt(total.rows[0].count),
    thisMonth: parseInt(thisMonth.rows[0].count),
    phones: parseInt(phones.rows[0].count),
    campaigns: parseInt(campaigns.rows[0].count),
  }
}

export async function createCampaign({ subject, htmlContent, type = 'email' }) {
  return sql`
    INSERT INTO campaigns (subject, html_content, type)
    VALUES (${subject}, ${htmlContent}, ${type})
    RETURNING *
  `
}

export async function markCampaignSent(id, recipientCount) {
  return sql`
    UPDATE campaigns SET status = 'sent', sent_at = NOW(), recipient_count = ${recipientCount}
    WHERE id = ${id}
    RETURNING *
  `
}

export async function getCampaigns() {
  return sql`SELECT id, subject, type, status, recipient_count, sent_at, created_at FROM campaigns ORDER BY created_at DESC`
}
