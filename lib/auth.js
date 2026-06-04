import { parse } from 'cookie'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'

export async function isAuthenticated(req, res) {
  // 1. Check admin password cookie
  const cookies = parse(req.headers.cookie || '')
  const secret = process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD
  if (cookies.admin_auth && cookies.admin_auth === secret) return true

  // 2. Check Microsoft O365 NextAuth session
  try {
    const session = await getServerSession(req, res, authOptions)
    if (session) return true
  } catch { /* fall through */ }

  return false
}
