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

// Adds the broadcast-id column and the per-recipient email-events table used
// for open/click tracking. The UNIQUE constraint makes opens/clicks "unique"
// (one row per recipient per event type).
let campaignStatsSchemaPromise
async function ensureCampaignStatsSchema() {
  if (!campaignStatsSchemaPromise) {
    campaignStatsSchemaPromise = (async () => {
      await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_broadcast_id TEXT`
      await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_opens  INT DEFAULT 0`
      await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS resend_clicks INT DEFAULT 0`
      await sql`
        CREATE TABLE IF NOT EXISTS campaign_email_events (
          id           SERIAL PRIMARY KEY,
          broadcast_id TEXT NOT NULL,
          email        TEXT,
          event_type   VARCHAR(40) NOT NULL,
          created_at   TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (broadcast_id, email, event_type)
        )
      `
    })()
  }
  await campaignStatsSchemaPromise
}

export async function markCampaignSent(id, recipientCount, broadcastId = null) {
  await ensureCampaignStatsSchema()
  return sql`
    UPDATE campaigns
    SET status = 'sent', sent_at = NOW(), recipient_count = ${recipientCount}, resend_broadcast_id = ${broadcastId}
    WHERE id = ${id}
    RETURNING *
  `
}

export async function recordCampaignEvent(broadcastId, email, eventType) {
  await ensureCampaignStatsSchema()
  return sql`
    INSERT INTO campaign_email_events (broadcast_id, email, event_type)
    VALUES (${broadcastId}, ${email || null}, ${eventType})
    ON CONFLICT (broadcast_id, email, event_type) DO NOTHING
  `
}

export async function getCampaigns() {
  await ensureCampaignStatsSchema()
  return sql`
    SELECT c.id, c.subject, c.type, c.status, c.recipient_count, c.sent_at, c.created_at,
      c.resend_broadcast_id,
      COALESCE(e.delivered, 0) AS delivered,
      GREATEST(COALESCE(c.resend_opens,  0), COALESCE(e.opened,  0)) AS opened,
      GREATEST(COALESCE(c.resend_clicks, 0), COALESCE(e.clicked, 0)) AS clicked
    FROM campaigns c
    LEFT JOIN (
      SELECT broadcast_id,
        COUNT(*) FILTER (WHERE event_type = 'delivered') AS delivered,
        COUNT(*) FILTER (WHERE event_type = 'opened')    AS opened,
        COUNT(*) FILTER (WHERE event_type = 'clicked')   AS clicked
      FROM campaign_email_events
      GROUP BY broadcast_id
    ) e ON e.broadcast_id = c.resend_broadcast_id
    ORDER BY c.created_at DESC
  `
}

// ── POS / Terminal payments ──
// A local mirror of in-person Stripe charges so they're visible in our own
// dashboard. Stripe remains the source of truth; rows are only written after
// verifying the PaymentIntent succeeded.
let posSchemaPromise
async function ensurePosSchema() {
  if (!posSchemaPromise) {
    posSchemaPromise = sql`
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
  }
  await posSchemaPromise
}

export async function recordPosPayment({ paymentIntentId, amount, currency = 'usd', description, status, receiptEmail, receiptUrl }) {
  await ensurePosSchema()
  return sql`
    INSERT INTO pos_payments (payment_intent_id, amount, currency, description, status, receipt_email, receipt_url)
    VALUES (${paymentIntentId}, ${amount}, ${currency}, ${description || null}, ${status || null}, ${receiptEmail || null}, ${receiptUrl || null})
    ON CONFLICT (payment_intent_id) DO UPDATE SET
      status = EXCLUDED.status,
      receipt_email = COALESCE(EXCLUDED.receipt_email, pos_payments.receipt_email),
      receipt_url = COALESCE(EXCLUDED.receipt_url, pos_payments.receipt_url)
    RETURNING *, (xmax = 0) AS inserted
  `
}

export async function getPosRecent(limit = 20) {
  await ensurePosSchema()
  return sql`
    SELECT id, payment_intent_id, amount, currency, description, status, receipt_email, receipt_url, created_at
    FROM pos_payments
    WHERE status IN ('succeeded', 'processing')
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
}

export async function getPosSummary() {
  await ensurePosSchema()
  const r = await sql`
    SELECT COALESCE(SUM(amount), 0) AS today_total, COUNT(*) AS today_count
    FROM pos_payments
    WHERE status IN ('succeeded', 'processing')
      AND (created_at AT TIME ZONE 'America/New_York')::date = (NOW() AT TIME ZONE 'America/New_York')::date
  `
  return { todayTotal: parseInt(r.rows[0].today_total), todayCount: parseInt(r.rows[0].today_count) }
}

// Payment history with optional date range (YYYY-MM-DD, inclusive) and status.
// Dates are evaluated in US/Eastern so a range matches the local business day.
export async function getPayments({ from = null, to = null, status = null, limit = 2000 } = {}) {
  await ensurePosSchema()
  return sql`
    SELECT id, payment_intent_id, amount, currency, description, status, receipt_email, receipt_url, created_at
    FROM pos_payments
    WHERE (${from}::date IS NULL OR (created_at AT TIME ZONE 'America/New_York')::date >= ${from}::date)
      AND (${to}::date IS NULL OR (created_at AT TIME ZONE 'America/New_York')::date <= ${to}::date)
      AND (${status}::text IS NULL OR status = ${status})
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
}

export async function getPaymentsSummary({ from = null, to = null, status = null } = {}) {
  await ensurePosSchema()
  const r = await sql`
    SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
    FROM pos_payments
    WHERE (${from}::date IS NULL OR (created_at AT TIME ZONE 'America/New_York')::date >= ${from}::date)
      AND (${to}::date IS NULL OR (created_at AT TIME ZONE 'America/New_York')::date <= ${to}::date)
      AND (${status}::text IS NULL OR status = ${status})
  `
  return { total: parseInt(r.rows[0].total), count: parseInt(r.rows[0].count) }
}

// POS revenue rollups (US/Eastern) for Overview and Analytics.
export async function getPosRevenueStats() {
  await ensurePosSchema()
  const r = await sql`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE (created_at AT TIME ZONE 'America/New_York')::date = (NOW() AT TIME ZONE 'America/New_York')::date), 0) AS today,
      COALESCE(SUM(amount) FILTER (WHERE date_trunc('month', created_at AT TIME ZONE 'America/New_York') = date_trunc('month', NOW() AT TIME ZONE 'America/New_York')), 0) AS month,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS count
    FROM pos_payments
    WHERE status IN ('succeeded', 'processing')
  `
  const row = r.rows[0]
  return { today: parseInt(row.today), month: parseInt(row.month), total: parseInt(row.total), count: parseInt(row.count) }
}

export async function getPosDailyTotals(days = 30) {
  await ensurePosSchema()
  const r = await sql`
    SELECT (created_at AT TIME ZONE 'America/New_York')::date::text AS day, COALESCE(SUM(amount), 0) AS total
    FROM pos_payments
    WHERE status IN ('succeeded', 'processing')
      AND created_at >= NOW() - make_interval(days => ${days})
    GROUP BY day
    ORDER BY day
  `
  return r.rows.map((x) => ({ day: x.day, total: parseInt(x.total) }))
}

// ── Web push subscriptions ──
let pushSchemaPromise
async function ensurePushSchema() {
  if (!pushSchemaPromise) {
    pushSchemaPromise = (async () => {
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
    })()
  }
  await pushSchemaPromise
}

export async function savePushSubscription({ endpoint, p256dh, auth, userEmail, userAgent }) {
  await ensurePushSchema()
  return sql`
    INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_email, user_agent)
    VALUES (${endpoint}, ${p256dh}, ${auth}, ${userEmail || null}, ${userAgent || null})
    ON CONFLICT (endpoint) DO UPDATE SET
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      user_email = COALESCE(EXCLUDED.user_email, push_subscriptions.user_email),
      user_agent = COALESCE(EXCLUDED.user_agent, push_subscriptions.user_agent)
    RETURNING *
  `
}

export async function deletePushSubscription(endpoint) {
  await ensurePushSchema()
  return sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`
}

export async function deletePushSubscriptionById(id) {
  await ensurePushSchema()
  return sql`DELETE FROM push_subscriptions WHERE id = ${id}`
}

export async function getPushSubscriptions() {
  await ensurePushSchema()
  return sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`
}

export async function listPushSubscriptions() {
  await ensurePushSchema()
  return sql`SELECT id, endpoint, user_agent, user_email, created_at FROM push_subscriptions ORDER BY created_at DESC`
}

// ── App settings (key/value) — used for notification preferences ──
let settingsSchemaPromise
async function ensureSettingsSchema() {
  if (!settingsSchemaPromise) {
    settingsSchemaPromise = sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key        VARCHAR(100) PRIMARY KEY,
        value      TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
  }
  await settingsSchemaPromise
}

async function setSetting(key, value) {
  await ensureSettingsSchema()
  return sql`
    INSERT INTO app_settings (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `
}

// Notification preferences default to ON when unset, preserving prior behavior.
export async function getNotificationPrefs() {
  await ensureSettingsSchema()
  const r = await sql`SELECT key, value FROM app_settings WHERE key IN ('notify_sale', 'notify_subscriber')`
  const map = {}
  for (const row of r.rows) map[row.key] = row.value
  return {
    sale: map.notify_sale !== 'false',
    subscriber: map.notify_subscriber !== 'false',
  }
}

export async function setNotificationPref(kind, on) {
  const key = kind === 'sale' ? 'notify_sale' : 'notify_subscriber'
  return setSetting(key, on ? 'true' : 'false')
}

// ── Dashboard users (Azure AD access list) ──
// Identity comes from Microsoft/Azure AD — this table is the allow-list that
// decides who may sign in and what role they get. No passwords are stored.
let usersSchemaPromise
async function ensureUsersSchema() {
  if (!usersSchemaPromise) {
    usersSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id                SERIAL PRIMARY KEY,
          email             VARCHAR(255) UNIQUE NOT NULL,
          name              VARCHAR(255),
          role              VARCHAR(20)  DEFAULT 'staff',
          active            BOOLEAN      DEFAULT true,
          notify_sale       BOOLEAN      DEFAULT true,
          notify_subscriber BOOLEAN      DEFAULT true,
          last_login_at     TIMESTAMPTZ,
          created_at        TIMESTAMPTZ  DEFAULT NOW()
        )
      `
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_sale BOOLEAN DEFAULT true`
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_subscriber BOOLEAN DEFAULT true`
    })()
  }
  await usersSchemaPromise
}

export async function getUserByEmail(email) {
  await ensureUsersSchema()
  const r = await sql`SELECT * FROM users WHERE email = ${String(email).toLowerCase()} LIMIT 1`
  return r.rows[0] || null
}

export async function getUserCount() {
  await ensureUsersSchema()
  const r = await sql`SELECT COUNT(*) FROM users`
  return parseInt(r.rows[0].count)
}

export async function listUsers() {
  await ensureUsersSchema()
  return sql`SELECT id, email, name, role, active, last_login_at, created_at FROM users ORDER BY created_at DESC`
}

export async function createUser({ email, name, role = 'staff' }) {
  await ensureUsersSchema()
  return sql`
    INSERT INTO users (email, name, role)
    VALUES (${String(email).toLowerCase()}, ${name || null}, ${role})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, name, role, active, created_at
  `
}

export async function deleteUserById(id) {
  await ensureUsersSchema()
  return sql`DELETE FROM users WHERE id = ${id}`
}

export async function updateUserFields(id, { name, role, active }) {
  await ensureUsersSchema()
  return sql`
    UPDATE users SET
      name   = COALESCE(${name ?? null}, name),
      role   = COALESCE(${role ?? null}, role),
      active = COALESCE(${typeof active === 'boolean' ? active : null}, active)
    WHERE id = ${id}
    RETURNING id, email, name, role, active, last_login_at, created_at
  `
}

export async function touchUserLogin(id) {
  await ensureUsersSchema()
  return sql`UPDATE users SET last_login_at = NOW() WHERE id = ${id}`
}

// Per-user notification preferences (default ON when the user row is absent).
export async function getUserPrefs(email) {
  await ensureUsersSchema()
  const r = await sql`SELECT notify_sale, notify_subscriber FROM users WHERE email = ${String(email).toLowerCase()} LIMIT 1`
  const row = r.rows[0]
  return {
    sale: row ? row.notify_sale !== false : true,
    subscriber: row ? row.notify_subscriber !== false : true,
  }
}

export async function setUserPref(email, kind, on) {
  await ensureUsersSchema()
  const e = String(email).toLowerCase()
  if (kind === 'sale') return sql`UPDATE users SET notify_sale = ${!!on} WHERE email = ${e}`
  return sql`UPDATE users SET notify_subscriber = ${!!on} WHERE email = ${e}`
}

// Devices whose owner wants this event kind. Unowned devices (no matching user
// row) default to receiving, so notifications are never silently dropped.
export async function getPushSubscriptionsForEvent(kind) {
  await ensurePushSchema()
  await ensureUsersSchema()
  if (kind === 'sale') {
    return sql`
      SELECT ps.endpoint, ps.p256dh, ps.auth
      FROM push_subscriptions ps
      LEFT JOIN users u ON u.email = ps.user_email
      WHERE COALESCE(u.notify_sale, true) = true
    `
  }
  return sql`
    SELECT ps.endpoint, ps.p256dh, ps.auth
    FROM push_subscriptions ps
    LEFT JOIN users u ON u.email = ps.user_email
    WHERE COALESCE(u.notify_subscriber, true) = true
  `
}

export async function listPushSubscriptionsForUser(email) {
  await ensurePushSchema()
  return sql`
    SELECT id, endpoint, user_agent, user_email, created_at
    FROM push_subscriptions
    WHERE user_email = ${String(email).toLowerCase()}
    ORDER BY created_at DESC
  `
}

export async function getPushRowsForUser(email) {
  await ensurePushSchema()
  return sql`SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_email = ${String(email).toLowerCase()}`
}
