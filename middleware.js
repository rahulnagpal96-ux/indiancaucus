import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Allow login page through
  if (pathname === '/dashboard/login') return NextResponse.next()

  const cookie = req.cookies.get('admin_auth')
  const secret = process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD

  if (!cookie || cookie.value !== secret) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/dashboard/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
