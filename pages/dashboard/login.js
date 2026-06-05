import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'

export default function DashboardLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showBreakGlass, setShowBreakGlass] = useState(false)
  const [password, setPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')

  const accessDenied = router.query.error === 'AccessDenied'

  async function handleMicrosoft() {
    setLoading(true)
    await signIn('azure-ad', { callbackUrl: '/dashboard' })
  }

  async function handlePassword(e) {
    e.preventDefault()
    setPwLoading(true)
    setPwError('')
    const res = await signIn('credentials', { password, redirect: false, callbackUrl: '/dashboard' })
    setPwLoading(false)
    if (res?.error) { setPwError('Incorrect password'); return }
    router.push(res?.url || '/dashboard')
  }

  return (
    <div
      className="login-page min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 60%, #1e3a5f 100%)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #e85d04, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="login-card bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-7 text-center" style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}>
            <img src="/logo.png" alt="Indian Caucus of Secaucus" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-white font-bold text-xl tracking-tight">Dashboard Login</h1>
            <p className="text-blue-300 text-sm mt-1">Indian Caucus of Secaucus</p>
          </div>

          <div className="px-8 py-7 space-y-4">
            {accessDenied && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-xs">
                Your Microsoft account doesn’t have access yet. Ask an admin to add your email.
              </div>
            )}

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

            {showBreakGlass ? (
              <form onSubmit={handlePassword} className="space-y-2 pt-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  autoFocus
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
                />
                {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="w-full text-white text-sm font-bold py-3 rounded-2xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}
                >
                  {pwLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowBreakGlass(true)}
                className="w-full text-center text-gray-400 text-xs hover:text-gray-600 transition-colors"
              >
                Use admin password instead
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-blue-300/60 mt-5">
          Authorized access only · Indian Caucus of Secaucus
        </p>
      </div>
    </div>
  )
}
