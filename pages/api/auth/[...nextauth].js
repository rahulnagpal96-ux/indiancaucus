import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    // Microsoft O365 — requires AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID
    ...(process.env.AZURE_AD_CLIENT_ID ? [
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
        authorization: { params: { scope: 'openid profile email' } },
      }),
    ] : []),

    // Fallback: single admin password
    CredentialsProvider({
      name: 'Admin Password',
      credentials: {
        password: { label: 'Password', type: 'password', placeholder: 'Admin password' },
      },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminPassword) return null
        if (credentials?.password === adminPassword) {
          return { id: '1', name: 'Admin', email: 'admin@indiancaucusofsecaucus.org' }
        }
        return null
      },
    }),
  ],

  pages: {
    signIn: '/dashboard/login',
    error: '/dashboard/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      // For Azure AD, optionally restrict to specific domain
      if (account?.provider === 'azure-ad') {
        const allowedDomain = process.env.AZURE_AD_ALLOWED_DOMAIN
        if (allowedDomain && user.email && !user.email.endsWith(`@${allowedDomain}`)) {
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
