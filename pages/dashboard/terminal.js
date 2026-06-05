import { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Load Stripe.js from Stripe's CDN (required — Stripe.js must be served from
// js.stripe.com) and resolve the global Stripe constructor.
function loadStripe() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    if (window.Stripe) return resolve(window.Stripe)
    const existing = document.querySelector('script[data-stripe-js]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Stripe))
      existing.addEventListener('error', reject)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://js.stripe.com/v3'
    s.setAttribute('data-stripe-js', 'true')
    s.onload = () => resolve(window.Stripe)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function TerminalPage() {
  const [step, setStep] = useState('amount') // amount | pay | success
  const [amountCents, setAmountCents] = useState('') // digits, interpreted as cents
  const [note, setNote] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [paidCents, setPaidCents] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [cardReady, setCardReady] = useState(false)

  // Receipt state
  const [rEmail, setREmail] = useState('')
  const [rPhone, setRPhone] = useState('')
  const [receiptMsg, setReceiptMsg] = useState('')
  const [sending, setSending] = useState(false)

  const stripeRef = useRef(null)
  const elementsRef = useRef(null)
  const mountRef = useRef(null)

  const cents = parseInt(amountCents || '0', 10)
  const canCharge = cents >= 50

  function pressDigit(d) {
    setAmountCents((c) => {
      const next = (c === '' && d === '0') ? '' : c + d
      return next.slice(0, 7) // cap at $99,999.99
    })
  }
  function backspace() { setAmountCents((c) => c.slice(0, -1)) }
  function clearAmount() { setAmountCents('') }

  async function startPayment() {
    if (!canCharge) return
    setError('')
    setBusy(true)
    try {
      const r = await fetch('/api/admin/terminal-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cents, description: note }),
      })
      const d = await r.json()
      if (!r.ok || d.error) throw new Error(d.error || 'Could not start payment')
      setClientSecret(d.clientSecret)
      setPaymentIntentId(d.paymentIntentId)
      setPaidCents(cents)
      setStep('pay')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  // Mount the Stripe Payment Element once we have a client secret.
  useEffect(() => {
    if (step !== 'pay' || !clientSecret || !PK) return
    let cancelled = false
    let paymentEl
    setCardReady(false)
    ;(async () => {
      try {
        const StripeCtor = await loadStripe()
        if (cancelled) return
        const stripe = StripeCtor(PK)
        stripeRef.current = stripe
        const dark = typeof window !== 'undefined' && window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: dark ? 'night' : 'stripe',
            variables: { colorPrimary: '#e85d04', borderRadius: '12px' },
          },
        })
        elementsRef.current = elements
        paymentEl = elements.create('payment', { layout: 'tabs' })
        paymentEl.on('ready', () => { if (!cancelled) setCardReady(true) })
        paymentEl.mount(mountRef.current)
      } catch (e) {
        if (!cancelled) setError('Could not load the card form. Check your connection.')
      }
    })()
    return () => { cancelled = true; try { paymentEl && paymentEl.unmount() } catch {} }
  }, [step, clientSecret])

  async function confirmPayment() {
    if (!stripeRef.current || !elementsRef.current) return
    setError('')
    setBusy(true)
    try {
      const { error: err, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        redirect: 'if_required',
        confirmParams: { return_url: window.location.href },
      })
      if (err) { setError(err.message); return }
      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        setStep('success')
      } else {
        setError('Payment was not completed. Please try again.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function sendReceipt() {
    if (!rEmail && !rPhone) { setReceiptMsg('Enter an email or phone number first.'); return }
    setSending(true)
    setReceiptMsg('')
    try {
      const r = await fetch('/api/admin/terminal-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, email: rEmail || undefined, phone: rPhone || undefined }),
      })
      const d = await r.json()
      if (!r.ok || !d.ok) {
        const detail = d.email?.error || d.sms?.error || d.error || 'Could not send receipt'
        throw new Error(detail)
      }
      const parts = []
      if (d.email?.ok) parts.push('email')
      if (d.sms?.ok) parts.push('text')
      setReceiptMsg(`Receipt sent by ${parts.join(' & ')}.`)
    } catch (e) {
      setReceiptMsg(e.message)
    } finally {
      setSending(false)
    }
  }

  function newSale() {
    setStep('amount')
    setAmountCents('')
    setNote('')
    setClientSecret('')
    setPaymentIntentId('')
    setError('')
    setREmail('')
    setRPhone('')
    setReceiptMsg('')
    setCardReady(false)
  }

  // ── Not configured ──
  if (!PK) {
    return (
      <AdminLayout title="Terminal">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-gray-900 font-bold mb-1">Terminal not configured</p>
          <p className="text-gray-500 text-sm">
            Add <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your
            environment variables (Stripe → Developers → API keys), then redeploy.
          </p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Terminal">
      <div className="max-w-md mx-auto">

        {/* ── AMOUNT ── */}
        {step === 'amount' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-8 pb-6 text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Amount</p>
              <div className={`font-black tracking-tight ${cents > 0 ? 'text-gray-900' : 'text-gray-300'}`} style={{ fontSize: '3rem', lineHeight: 1 }}>
                {fmt(cents)}
              </div>
            </div>

            <div className="px-6">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for? (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
              />
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-px bg-gray-100 mt-5 border-t border-gray-100">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((k) => (
                <button
                  key={k}
                  onClick={() => k === 'back' ? backspace() : k === 'clear' ? clearAmount() : pressDigit(k)}
                  className="bg-white py-5 text-2xl font-semibold text-gray-900 active:bg-gray-100 transition-colors select-none"
                >
                  {k === 'back' ? '⌫' : k === 'clear' ? <span className="text-base text-gray-400 font-bold">C</span> : k}
                </button>
              ))}
            </div>

            <div className="p-5">
              {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}
              <button
                onClick={startPayment}
                disabled={!canCharge || busy}
                className="w-full text-white font-bold text-base py-4 rounded-2xl shadow-md transition-all disabled:opacity-40 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
              >
                {busy ? 'Starting…' : canCharge ? `Charge ${fmt(cents)}` : 'Enter an amount'}
              </button>
              <p className="text-gray-400 text-[11px] text-center mt-2">Minimum $0.50 · Card payments via Stripe</p>
            </div>
          </div>
        )}

        {/* ── PAY ── */}
        {step === 'pay' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="text-center mb-5">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Charging</p>
              <p className="text-gray-900 font-black text-3xl mt-1">{fmt(paidCents)}</p>
              {note && <p className="text-gray-400 text-sm mt-1">{note}</p>}
            </div>

            <div className="border border-gray-200 text-gray-600 text-xs rounded-xl px-3 py-2.5 mb-4 flex items-start gap-2">
              <svg width="15" height="15" className="shrink-0 mt-0.5 text-[#e85d04]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>Tap the card number field — on iPhone choose <strong>Scan Credit Card</strong> to capture it with your camera, or type it in.</span>
            </div>

            <div ref={mountRef} className="min-h-[180px]" />
            {!cardReady && <p className="text-gray-400 text-xs text-center py-3">Loading secure card form…</p>}

            {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}

            <button
              onClick={confirmPayment}
              disabled={busy || !cardReady}
              className="w-full text-white font-bold text-base py-4 rounded-2xl shadow-md transition-all disabled:opacity-40 hover:opacity-90 mt-4"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              {busy ? 'Processing…' : `Pay ${fmt(paidCents)}`}
            </button>
            <button
              onClick={newSale}
              disabled={busy}
              className="w-full text-gray-500 text-sm font-semibold py-3 mt-1 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="30" height="30" className="text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gray-900 font-black text-2xl">{fmt(paidCents)} paid</p>
              <p className="text-gray-400 text-sm mt-1">Payment successful</p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Send a receipt</p>
              <div className="space-y-2">
                <input
                  type="email"
                  value={rEmail}
                  onChange={(e) => setREmail(e.target.value)}
                  placeholder="Customer email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
                />
                <input
                  type="tel"
                  value={rPhone}
                  onChange={(e) => setRPhone(e.target.value)}
                  placeholder="Customer phone (+1…) for text"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
                />
              </div>
              {receiptMsg && <p className="text-xs mt-2 text-center text-gray-600">{receiptMsg}</p>}
              <button
                onClick={sendReceipt}
                disabled={sending}
                className="w-full text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all disabled:opacity-50 hover:opacity-90 mt-3"
                style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}
              >
                {sending ? 'Sending…' : 'Send receipt'}
              </button>
            </div>

            <button
              onClick={newSale}
              className="w-full font-bold text-base py-4 rounded-2xl mt-3 transition-all hover:opacity-90 text-white"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >
              New sale
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
