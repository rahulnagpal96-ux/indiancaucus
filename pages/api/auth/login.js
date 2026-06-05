import { serialize } from 'cookie'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return res.status(401).json({ error: 'Incorrect password' })
  }

  const cookie = serialize('admin_auth', process.env.NEXTAUTH_SECRET || adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days — keeps the home-screen app signed in
  })

  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ ok: true })
}
