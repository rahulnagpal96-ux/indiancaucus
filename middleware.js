import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  if (pathname === '/dashboard/login') return NextResponse.next()

  // 1. Check admin password cookie
  const cookie = req.cookies.get('admin_auth')
  const secret = process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD
  if (cookie && cookie.value === secret) return NextResponse.next()

  // 2. Check Microsoft O365 NextAuth session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (token) return NextResponse.next()

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/dashboard/login'
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
