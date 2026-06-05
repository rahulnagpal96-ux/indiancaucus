import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserByEmail, getUserCount, createUser, touchUserLogin } from '../../../lib/db'

export const authOptions = {
  providers: [
    ...(process.env.AZURE_AD_CLIENT_ID ? [
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
      }),
    ] : []),
    // Break-glass admin login (shared password). Not shown by default; lets the
    // owner in if Azure is misconfigured or everyone is locked out.
    CredentialsProvider({
      name: 'Admin password',
      credentials: { password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD
        if (adminPassword && credentials?.password === adminPassword) {
          return { id: 'admin', name: 'Admin', email: 'admin@indiancaucusofsecaucus.org', role: 'admin' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/dashboard/login',
  },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 }, // 30 days
  callbacks: {
    // Enforce the Azure access list. The very first Azure user is seeded as an
    // admin so the dashboard can be bootstrapped without manual DB edits.
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true
      const email = user?.email?.toLowerCase()
      if (!email) return false
      try {
        const existing = await getUserByEmail(email)
        if (existing) {
          if (existing.active === false) return false
          touchUserLogin(existing.id).catch(() => {})
          return true
        }
        if (await getUserCount() === 0) {
          await createUser({ email, name: user.name, role: 'admin' })
          return true
        }
      } catch (e) {
        console.error('signIn allowlist error:', e)
        return false
      }
      return '/dashboard/login?error=AccessDenied'
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'credentials') {
          token.role = 'admin'
        } else {
          try {
            const u = await getUserByEmail(user.email)
            token.role = u?.role || 'staff'
            token.uid = u?.id
          } catch { token.role = 'staff' }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'staff'
        session.user.id = token.uid
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
