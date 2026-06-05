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

// Returns the current user with role, or null. The legacy admin_auth cookie is
// the shared master password, so it resolves to an admin.
export async function getCurrentUser(req, res) {
  const cookies = parse(req.headers.cookie || '')
  const secret = process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD
  if (cookies.admin_auth && cookies.admin_auth === secret) {
    return { email: 'admin', role: 'admin' }
  }
  try {
    const session = await getServerSession(req, res, authOptions)
    if (session?.user) {
      return { email: session.user.email, role: session.user.role || 'admin' }
    }
  } catch { /* ignore */ }
  return null
}
