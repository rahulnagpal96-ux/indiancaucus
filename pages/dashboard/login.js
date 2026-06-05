import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function DashboardLogin() {
  const [loading, setLoading] = useState(false)

  async function handleMicrosoft() {
    setLoading(true)
    await signIn('azure-ad', { callbackUrl: '/dashboard' })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 60%, #1e3a5f 100%)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #e85d04, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          <div className="px-8 py-7 text-center" style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}>
            <img src="/logo.png" alt="Indian Caucus of Secaucus" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-white font-bold text-xl tracking-tight">Dashboard Login</h1>
            <p className="text-blue-300 text-sm mt-1">Indian Caucus of Secaucus</p>
          </div>

          <div className="px-8 py-7 space-y-4">
            <button
              onClick={handleMicrosoft}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              {loading ? 'Signing in…' : 'Sign in with Microsoft O365'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-blue-300/60 mt-5">
          Authorized access only · Indian Caucus of Secaucus
        </p>
      </div>
    </div>
  )
}
