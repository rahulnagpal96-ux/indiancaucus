import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'

const PRESETS = [
  { amount: 10, label: 'Supporter', impact: 'Supplies for youth activities' },
  { amount: 25, label: 'Friend', impact: 'Community refreshments for families' },
  { amount: 50, label: 'Patron', impact: 'Cultural workshop supplies' },
  { amount: 100, label: 'Champion', impact: 'Event logistics & safety' },
  { amount: 250, label: 'Sustainer', impact: 'Full cultural performance' },
  { amount: 500, label: 'Benefactor', impact: 'Sponsors an entire event segment' },
]

const TRUST = [
  { icon: '✅', title: '501(c)(3) Certified', desc: 'Your donation is fully tax-deductible.' },
  { icon: '🔒', title: 'Secure Checkout', desc: 'Powered by Stripe — bank-level encryption.' },
  { icon: '📧', title: 'Instant Receipt', desc: 'Email receipt delivered immediately.' },
  { icon: '💯', title: '100% to Programs', desc: 'Every dollar goes to community events.' },
]

export default function Donate() {
  const [loading, setLoading] = useState(false)
  const [recurring, setRecurring] = useState(false)
  const [selected, setSelected] = useState(25)

  async function handleDonate(amount) {
    if (!amount || amount < 1) return
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recurring }),
      })
      const data = await res.json()
      if (data.url) window.location = data.url
      else setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Donate — Indian Caucus of Secaucus</title>
        <meta name="description" content="Support Indian Caucus of Secaucus with a tax-deductible donation. Fund Holi, Dandiya, and Diwali Mela — free events for our entire community." />
      </Head>
      <Header />

      {/* Hero */}
      <section className="hero-bg dot-pattern">
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <span className="section-label" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Support Our Work</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
            Your gift keeps the<br />
            <span className="gradient-text">celebration alive.</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl text-lg leading-relaxed">
            Every donation — big or small — funds free community events, cultural programs, and youth outreach for the Indian-American community in Secaucus, NJ.
          </p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Donation form */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Recurring toggle */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Choose your gift</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRecurring(!recurring)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${recurring ? 'bg-brand-green' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${recurring ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Monthly giving</span>
                </label>
              </div>

              {recurring && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Monthly donors help us plan events with confidence. Thank you!
                </div>
              )}

              {/* Preset amounts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {PRESETS.map((p) => (
                  <button
                    key={p.amount}
                    onClick={() => setSelected(p.amount)}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selected === p.amount
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl font-extrabold text-gray-900">${p.amount}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5">{p.label}</div>
                    <div className="text-xs text-gray-400 mt-1 leading-tight">{p.impact}</div>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <CustomDonate
                onDonate={(amt) => { setSelected(amt); handleDonate(amt) }}
                disabled={loading}
              />

              <button
                onClick={() => handleDonate(selected)}
                disabled={loading || !selected}
                className="w-full mt-5 btn-primary text-base py-4 disabled:opacity-60"
              >
                {loading ? 'Redirecting to checkout…' : `Donate $${selected}${recurring ? '/month' : ''} →`}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Secure checkout via Stripe. You'll receive an email receipt immediately.
              </p>
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
                    <span className="text-xl flex-shrink-0">{t.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.title}</div>
                      <div className="text-xs text-gray-500">{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="card bg-brand-navy text-white">
              <h3 className="font-bold mb-4">Your impact</h3>
              <div className="space-y-3">
                {[
                  { a: '$10', l: 'Supplies for youth activities' },
                  { a: '$25', l: 'Refreshments for 10 families' },
                  { a: '$100', l: 'Event logistics & safety' },
                  { a: '$250', l: 'Full cultural performance' },
                ].map((i) => (
                  <div key={i.a} className="flex items-center gap-3">
                    <span className="font-extrabold gradient-text w-12 flex-shrink-0">{i.a}</span>
                    <span className="text-sm text-gray-300">{i.l}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-white/10 pt-4 text-xs text-gray-400">
                Indian Caucus of Secaucus is a registered 501(c)(3) nonprofit. EIN available upon request.
              </div>
            </div>

            {/* Sponsor CTA */}
            <div className="card bg-orange-50 border-orange-100">
              <h3 className="font-bold text-gray-900 mb-1">Business owner?</h3>
              <p className="text-sm text-gray-600 mb-4">Sponsor an event and reach thousands of engaged community members.</p>
              <Link href="/sponsor" className="btn-primary text-sm px-5 py-2.5 block text-center">See Sponsorship Tiers</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function CustomDonate({ onDonate, disabled }) {
  const [val, setVal] = useState('')
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Or enter a custom amount</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            type="number"
            min="1"
            placeholder="Other amount"
            className="input-field pl-7"
          />
        </div>
        <button
          onClick={() => onDonate(Number(val))}
          disabled={disabled || !val || Number(val) < 1}
          className="btn-secondary text-sm px-5 py-2.5 disabled:opacity-60"
        >
          Give
        </button>
      </div>
    </div>
  )
}
