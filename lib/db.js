import { sql } from '@vercel/postgres'

export { sql }

export async function getSubscribers({ status = 'active', search = '' } = {}) {
  if (search) {
    return sql`
      SELECT id, email, first_name, phone, source, status, created_at
      FROM subscribers
      WHERE status = ${status}
        AND (email ILIKE ${'%' + search + '%'} OR first_name ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})
      ORDER BY created_at DESC
    `
  }
  if (status === 'all') {
    return sql`SELECT id, email, first_name, phone, source, status, created_at FROM subscribers ORDER BY created_at DESC`
  }
  return sql`
    SELECT id, email, first_name, phone, source, status, created_at
    FROM subscribers
    WHERE status = ${status}
    ORDER BY created_at DESC
  `
}

export async function upsertSubscriber({ email, firstName, phone, source = 'newsletter' }) {
  return sql`
    INSERT INTO subscribers (email, first_name, phone, source)
    VALUES (${email}, ${firstName || null}, ${phone || null}, ${source})
    ON CONFLICT (email) DO UPDATE SET
      first_name = COALESCE(EXCLUDED.first_name, subscribers.first_name),
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
