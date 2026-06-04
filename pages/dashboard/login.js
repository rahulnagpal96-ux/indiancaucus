import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (session) return { redirect: { destination: '/dashboard', permanent: false } }
  return { props: {} }
}

export default function DashboardLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handlePassword(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { password, redirect: false })
    setLoading(false)
    if (result?.ok) {
      router.push('/dashboard')
    } else {
      setError('Incorrect password. Try again.')
    }
  }

  async function handleMicrosoft() {
    setLoading(true)
    await signIn('azure-ad', { callbackUrl: '/dashboard' })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 60%, #1e3a5f 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #e85d04, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div
            className="px-8 py-7 text-center"
            style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >
              <span className="text-white font-black text-xl">IC</span>
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight">Dashboard Login</h1>
            <p className="text-blue-300 text-sm mt-1">Indian Caucus of Secaucus</p>
          </div>

          <div className="px-8 py-7 space-y-5">
            {/* Microsoft O365 */}
            <button
              onClick={handleMicrosoft}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Sign in with Microsoft O365
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Password */}
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Admin password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm"
                  style={{ focusRingColor: '#1a2744' }}
                  onFocus={(e) => { e.target.style.borderColor = '#1a2744'; e.target.style.boxShadow = '0 0 0 3px rgba(26,39,68,0.1)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <svg width="14" height="14" className="text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white rounded-2xl px-4 py-3.5 text-sm font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                style={{ background: loading ? '#374151' : 'linear-gradient(135deg, #1a2744, #243660)' }}
              >
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-blue-300/60 mt-5">
          Authorized access only · Indian Caucus of Secaucus
        </p>
      </div>
    </div>
  )
}
