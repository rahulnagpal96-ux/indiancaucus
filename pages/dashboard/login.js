import { useRouter } from 'next/router'
import { useState } from 'react'

export default function DashboardLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError('Incorrect password. Try again.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-7 text-center" style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >
              <span className="text-white font-black text-xl">IC</span>
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight">Dashboard Login</h1>
            <p className="text-blue-300 text-sm mt-1">Indian Caucus of Secaucus</p>
          </div>

          <div className="px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoFocus
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none transition-all shadow-sm"
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
