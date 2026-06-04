import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const LINKS = [
  {
    label: 'Participation',
    description: 'Sign up to volunteer or participate in our events',
    href: 'https://forms.cloud.microsoft/r/TrUMvCLMTb',
    external: true,
    color: 'from-orange-500 to-red-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Sponsorship',
    description: 'Partner with us to support our community festivals',
    href: '/sponsor',
    external: false,
    color: 'from-purple-500 to-indigo-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
]

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-md bg-gray-900 rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Contact Us</h2>
            <p className="text-xs text-gray-400 mt-0.5">We respond within 48 hours</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-white font-bold text-lg">Message sent!</h3>
            <p className="text-gray-400 text-sm mt-1">We'll get back to you soon.</p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-colors">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Name *</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Subject</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="">Select a topic…</option>
                <option value="general">General Inquiry</option>
                <option value="volunteer">Volunteer Sign-Up</option>
                <option value="sponsorship">Sponsorship Inquiry</option>
                <option value="event">Event Question</option>
                <option value="donation">Donation / Tax Receipt</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Message *</label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                placeholder="How can we help?"
              />
            </div>

            {status === 'error' && <p className="text-xs text-red-400">Failed to send. Please try again.</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
            >
              {status === 'loading' ? 'Sending…' : 'Send Message →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function DonateBox() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDonate = async () => {
    const n = parseFloat(amount)
    if (!n || n < 1) return
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: n }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <div className="flex items-center flex-1 bg-gray-900 border border-gray-700 focus-within:border-orange-400 rounded-xl overflow-hidden transition-colors">
        <span className="pl-3 text-gray-400 font-semibold">$</span>
        <input
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDonate()}
          className="flex-1 bg-transparent px-2 py-2.5 text-white text-sm font-semibold placeholder-gray-600 outline-none"
        />
      </div>
      <button
        onClick={handleDonate}
        disabled={!amount || parseFloat(amount) < 1 || loading}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #FF9933, #F26644)' }}
      >
        {loading ? '…' : 'Donate'}
      </button>
    </div>
  )
}

function NewsletterBox() {
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

  return (
    <div className="w-full max-w-sm bg-gray-800 rounded-2xl px-4 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-white text-base leading-tight">Newsletter Signup</div>
          <div className="text-xs text-gray-400 mt-0.5">Stay updated on events and announcements</div>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-sm text-green-400 py-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          You're subscribed!
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-gray-900 border border-gray-700 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? '…' : 'Join'}
          </button>
        </form>
      )}
      {status === 'error' && <p className="mt-1.5 text-xs text-red-400">Something went wrong. Try again.</p>}
    </div>
  )
}

export default function Links() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 py-12">
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      <Head>
        <title>Indian Caucus of Secaucus — Links</title>
        <meta name="description" content="Connect with Indian Caucus of Secaucus — participate, sponsor, subscribe, or contact us." />
      </Head>

      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <Link href="/">
          <img src="/logo.png" alt="Indian Caucus of Secaucus" className="h-16 w-auto mx-auto mb-3" />
          <span className="text-2xl font-bold text-white tracking-tight">
            Indian Caucus <span className="text-orange-400">of Secaucus</span>
          </span>
        </Link>
        <p className="mt-1 text-sm text-gray-400">Celebrating Indian Culture in NJ</p>
      </div>

      {/* Link Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {LINKS.map(({ label, description, href, external, color, icon }) => {
          const inner = (
            <div className="flex items-center gap-4 w-full">
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
                {icon}
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-base leading-tight">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</div>
              </div>
              <svg className="ml-auto flex-shrink-0 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          )

          return external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-2xl px-4 py-3.5 flex items-center"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="w-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-2xl px-4 py-3.5 flex items-center"
            >
              {inner}
            </Link>
          )
        })}
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-sm mt-4">
        <NewsletterBox />
      </div>

      {/* Contact button */}
      <div className="w-full max-w-sm mt-4">
        <button
          onClick={() => setContactOpen(true)}
          className="w-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-2xl px-4 py-3.5 flex items-center"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-base leading-tight">Contact</div>
              <div className="text-xs text-gray-400 mt-0.5">Get in touch with us directly</div>
            </div>
            <svg className="ml-auto flex-shrink-0 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Donate box */}
      <div className="w-full max-w-sm mt-4 bg-gray-800 rounded-2xl px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-white text-base leading-tight">Donate Now</div>
            <div className="text-xs text-gray-400 mt-0.5">100% goes to community events · 501(c)(3)</div>
          </div>
        </div>
        <DonateBox />
      </div>

      {/* Social Links */}
      <div className="mt-8 flex gap-4">
        <a
          href="http://www.instagram.com/indiancaucus"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-gray-300"
          aria-label="Instagram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/>
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
            <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor"/>
          </svg>
        </a>
        <a
          href="http://www.facebook.com/indiancaucusofsecaucus"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-gray-300"
          aria-label="Facebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-600">© {new Date().getFullYear()} Indian Caucus of Secaucus · 501(c)(3)</p>
    </div>
  )
}
