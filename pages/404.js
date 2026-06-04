import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Head>
        <title>Page Not Found — Indian Caucus of Secaucus</title>
      </Head>
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">

      {/* 404 */}
      <p className="text-8xl font-extrabold text-gray-200 dark:text-gray-700 leading-none select-none">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm max-w-xs">
        That page doesn't exist, but you can still make a difference while you're here.
      </p>

      {/* Donation box */}
      <div className="mt-10 w-full max-w-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
        <p className="text-sm font-semibold text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1">Support Our Community</p>
        <p className="text-gray-900 dark:text-white font-bold text-lg leading-tight mb-4">
          Donate any amount to keep our festivals free
        </p>

        <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-500 focus-within:border-orange-400 transition-colors">
          <span className="pl-4 text-gray-400 dark:text-gray-300 font-semibold text-lg">$</span>
          <input
            type="number"
            min="1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDonate()}
            className="flex-1 bg-transparent px-2 py-3.5 text-gray-900 dark:text-white text-lg font-semibold placeholder-gray-400 dark:placeholder-gray-500 outline-none"
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

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">501(c)(3) · Tax-deductible · Powered by Stripe</p>
      </div>

      {/* Nav links */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
        <Link href="/events" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Events</Link>
        <Link href="/sponsor" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Sponsor</Link>
        <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
      </div>

      </div>
      <Footer />
    </div>
  )
}
