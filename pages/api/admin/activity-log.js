import { sql } from '@vercel/postgres'
import { isAuthenticated } from '../../../lib/auth'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

async function getIspInfo(ip) {
  try {
    if (!ip || ip === '::1' || ip === '127.0.0.1') return { isp: 'localhost', city: 'local', country: 'local' }
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=isp,city,country,regionName`)
    if (!r.ok) return {}
    return await r.json()
  } catch { return {} }
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const { action, page, detail } = req.body

    const session = await getServerSession(req, res, authOptions)
    const userEmail = session?.user?.email || 'password-login'

    const ip = (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      'unknown'
    ).trim()

    const userAgent = req.headers['user-agent'] || ''
    const ispInfo = await getIspInfo(ip)

    try {
      await sql`
        INSERT INTO activity_logs
          (user_email, action, page, detail, ip_address, user_agent, isp, city, country)
        VALUES
          (${userEmail}, ${action}, ${page || ''}, ${detail || ''}, ${ip}, ${userAgent},
           ${ispInfo.isp || ''}, ${ispInfo.city || ''}, ${ispInfo.country || ''})
      `
    } catch { /* table may not exist yet */ }

    return res.status(200).json({ ok: true })
  }

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 200
      `
      return res.status(200).json({ logs: result.rows })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
