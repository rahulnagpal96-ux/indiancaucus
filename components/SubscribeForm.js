import { useState } from 'react'

export default function SubscribeForm({ dark = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) { setStatus('success'); setEmail('') }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 text-sm ${dark ? 'text-green-300' : 'text-green-600'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        You're subscribed! Check your inbox for a confirmation.
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
            dark
              ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-brand-green'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-brand-green focus:border-transparent'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary text-sm px-5 py-3 whitespace-nowrap disabled:opacity-60"
        >
          {status === 'loading' ? '…' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p className={`text-xs ${dark ? 'text-red-300' : 'text-red-600'}`}>Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
