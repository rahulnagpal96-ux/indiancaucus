import { useState } from 'react'

export default function SubscribeForm({ dark = false }) {
  const [fields, setFields] = useState({ email: '', firstName: '', phone: '' })
  const [status, setStatus] = useState('')
  const [expanded, setExpanded] = useState(false)

  function change(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fields.email,
          firstName: fields.firstName || undefined,
          phone: fields.phone || undefined,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setFields({ email: '', firstName: '', phone: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
    dark
      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-brand-green'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-brand-green focus:border-transparent'
  }`

  const labelClass = `block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 text-sm ${dark ? 'text-green-300' : 'text-green-600'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        You're subscribed! Check your inbox for a confirmation email.
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-2">

      {/* Email + subscribe — stacked on mobile, inline on sm+ */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={change}
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
          className="btn-primary text-sm px-6 py-3 whitespace-nowrap disabled:opacity-60 w-full sm:w-auto"
        >
          {status === 'loading' ? '…' : 'Subscribe'}
        </button>
      </div>

      {/* Optional fields toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`text-xs underline-offset-2 hover:underline transition-all ${
          dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {expanded ? '− Less options' : '+ Add name & phone (optional)'}
      </button>

      {/* Optional fields */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div>
            <label className={labelClass}>First name</label>
            <input
              type="text"
              name="firstName"
              value={fields.firstName}
              onChange={change}
              placeholder="Jane"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone for SMS updates</label>
            <input
              type="tel"
              name="phone"
              value={fields.phone}
              onChange={change}
              placeholder="+1 (201) 555-0100"
              className={inputClass}
            />
          </div>
        </div>
      )}

      {status === 'error' && (
        <p className={`text-xs ${dark ? 'text-red-300' : 'text-red-600'}`}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
