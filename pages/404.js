import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function NotFound() {
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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 py-16 text-center">
      <Head>
        <title>Page Not Found — Indian Caucus of Secaucus</title>
      </Head>

      {/* Brand */}
      <Link href="/" className="text-xl font-bold text-white tracking-tight mb-10 block">
        Indian Caucus <span className="text-orange-400">of Secaucus</span>
      </Link>

      {/* 404 */}
      <p className="text-8xl font-extrabold text-gray-800 leading-none select-none">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-gray-400 text-sm max-w-xs">
        That page doesn't exist, but you can still make a difference while you're here.
      </p>

      {/* Donation box */}
      <div className="mt-10 w-full max-w-xs bg-gray-800 rounded-2xl p-6">
        <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-1">Support Our Community</p>
        <p className="text-white font-bold text-lg leading-tight mb-4">
          Donate any amount to keep our festivals free
        </p>

        <div className="flex items-center bg-gray-900 rounded-xl overflow-hidden border border-gray-700 focus-within:border-orange-400 transition-colors">
          <span className="pl-4 text-gray-400 font-semibold text-lg">$</span>
          <input
            type="number"
            min="1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDonate()}
            className="flex-1 bg-transparent px-2 py-3.5 text-white text-lg font-semibold placeholder-gray-600 outline-none"
          />
        </div>

        <button
          onClick={handleDonate}
          disabled={!amount || parseFloat(amount) < 1 || loading}
          className="mt-3 w-full py-3.5 rounded-xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #FF9933, #F26644)' }}
        >
          {loading ? 'Loading…' : 'Donate Now'}
        </button>

        <p className="mt-3 text-xs text-gray-500">501(c)(3) · Tax-deductible · Powered by Stripe</p>
      </div>

      {/* Nav links */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
        <Link href="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link>
        <Link href="/sponsor" className="text-gray-400 hover:text-white transition-colors">Sponsor</Link>
        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
      </div>

      {/* Footer */}
      <div className="mt-12 w-full border-t border-gray-800 pt-6 flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <a href="http://www.instagram.com/indiancaucus" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/><circle cx="17.5" cy="6.5" r="0.75" fill="currentColor"/></svg>
          </a>
          <a href="http://www.facebook.com/indiancaucusofsecaucus" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z"/></svg>
          </a>
        </div>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} Indian Caucus of Secaucus · 501(c)(3) Nonprofit</p>
        <div className="flex gap-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
        </div>
      </div>
    </div>
  )
}
