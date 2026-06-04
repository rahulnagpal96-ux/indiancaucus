import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'

const TRUST = [
  { icon: '✓', title: '501(c)(3) Certified', desc: 'Your donation is fully tax-deductible.' },
  { icon: '✓', title: 'Secure Checkout', desc: 'Powered by Stripe — bank-level encryption.' },
  { icon: '✓', title: 'Instant Receipt', desc: 'Email receipt delivered immediately.' },
  { icon: '✓', title: '100% to Programs', desc: 'Every dollar goes to community events.' },
]

const PRESETS = [25, 50, 100, 250]

export default function Donate() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDonate = async () => {
    const n = parseFloat(amount)
    if (!n || n < 1) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: n }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError('Could not start checkout. Please try again.')
    } catch {
      setError('Could not start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Donate — Indian Caucus of Secaucus</title>
        <meta name="description" content="Support Indian Caucus of Secaucus with a tax-deductible donation. Fund Holi, Dandiya Dhamaka, and Diwali Mela — free events for our entire community." />
      </Head>
      <Header />

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div style={{backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize:'24px 24px'}}>
          <div className="container-max px-4 md:px-6 py-16 md:py-20">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>
              Support Our Work
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 leading-tight">
              Your gift keeps the<br />
              <span style={{background:'linear-gradient(135deg,#FF9933,#F26644)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                celebration alive.
              </span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-xl text-lg leading-relaxed">
              Every donation — big or small — funds free community events, cultural programs, and youth outreach for the Indian-American community in Secaucus, NJ.
            </p>
          </div>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Donate CTA */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Make a donation</h2>
              <p className="text-gray-500 text-sm mb-8">
                Choose your own amount. Every dollar goes directly to community programming — Holi, Dandiya Dhamaka, Diwali Mela, and youth outreach.
              </p>

              {/* Preset amounts */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(String(p))}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      amount === String(p)
                        ? 'border-brand-orange bg-orange-50 text-brand-orange'
                        : 'border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange'
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="flex items-center border-2 border-gray-200 focus-within:border-brand-orange rounded-xl overflow-hidden transition-colors mb-4">
                <span className="pl-4 text-gray-400 font-bold text-lg">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDonate()}
                  className="flex-1 px-2 py-4 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none bg-transparent"
                />
              </div>

              <button
                onClick={handleDonate}
                disabled={!amount || parseFloat(amount) < 1 || loading}
                className="w-full btn-primary text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading…' : `Donate${amount && parseFloat(amount) >= 1 ? ` $${parseFloat(amount).toLocaleString()}` : ''} Now`}
              </button>

              {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}

              <p className="mt-3 text-center text-xs text-gray-400">
                Secure checkout via Stripe. You will receive an email receipt immediately.
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400">
                  Indian Caucus of Secaucus is a registered 501(c)(3) nonprofit. EIN available upon request.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Trust */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Why donate?</h3>
              <div className="space-y-4">
                {TRUST.map((t) => (
                  <div key={t.title} className="flex items-start gap-3">
                    <span className="text-brand-green font-bold flex-shrink-0 mt-0.5">{t.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.title}</div>
                      <div className="text-xs text-gray-500">{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="card" style={{background:'#0F2044'}}>
              <h3 className="font-bold text-white mb-4">Your impact</h3>
              <div className="space-y-3">
                {[
                  { a: '$25', l: 'Participant token of appreciation' },
                  { a: '$100', l: 'Flyers and marketing' },
                  { a: '$100', l: 'Event logistics' },
                  { a: '$250', l: 'Kids activities' },
                ].map((i) => (
                  <div key={i.a} className="flex items-center gap-3">
                    <span className="font-extrabold w-12 flex-shrink-0" style={{background:'linear-gradient(135deg,#FF9933,#F26644)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>{i.a}</span>
                    <span className="text-sm text-gray-300">{i.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsor CTA */}
            <div className="card bg-orange-50 border-orange-100">
              <h3 className="font-bold text-gray-900 mb-1">Business owner?</h3>
              <p className="text-sm text-gray-600 mb-4">Sponsor an event and reach thousands of engaged community members.</p>
              <Link href="/sponsor" className="btn-primary text-sm px-5 py-2.5 block text-center">
                See Sponsorship Packages
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
