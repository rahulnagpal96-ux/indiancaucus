import { parse } from 'cookie'

export function isAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '')
  const secret = process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD
  return cookies.admin_auth && cookies.admin_auth === secret
}
