import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const providers = [
  CredentialsProvider({
    name: 'Admin Password',
    credentials: {
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const adminPassword = process.env.ADMIN_PASSWORD
      if (adminPassword && credentials?.password === adminPassword) {
        return { id: '1', name: 'Admin', email: 'admin@indiancaucusofsecaucus.org' }
      }
      return null
    },
  }),
]

// Add Azure AD only when fully configured
if (
  process.env.AZURE_AD_CLIENT_ID &&
  process.env.AZURE_AD_CLIENT_SECRET &&
  process.env.AZURE_AD_TENANT_ID
) {
  const { default: AzureADProvider } = require('next-auth/providers/azure-ad')
  providers.unshift(
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    })
  )
}

export const authOptions = {
  providers,
  pages: {
    signIn: '/dashboard/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
