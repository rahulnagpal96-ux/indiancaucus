import { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatCardNumber(val) {
  const digits = val.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function TerminalPage() {
  const [step, setStep] = useState('amount') // amount | pay | success
  const [amountCents, setAmountCents] = useState('')
  const [note, setNote] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [paidCents, setPaidCents] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Card fields
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  // Receipt state
  const [rEmail, setREmail] = useState('')
  const [rPhone, setRPhone] = useState('')
  const [receiptMsg, setReceiptMsg] = useState('')
  const [sending, setSending] = useState(false)

  // Sales log
  const [summary, setSummary] = useState({ todayTotal: 0, todayCount: 0 })
  const [recent, setRecent] = useState([])

  const expiryRef = useRef(null)
  const cvcRef = useRef(null)

  const cents = parseInt(amountCents || '0', 10)
  const canCharge = cents >= 50

  async function fetchSales() {
    try {
      const r = await fetch('/api/admin/pos')
      const d = await r.json()
      if (!d.error) {
        setSummary({ todayTotal: d.todayTotal || 0, todayCount: d.todayCount || 0 })
        setRecent(d.recent || [])
      }
    } catch {}
  }

  async function recordSale(piId) {
    try {
      await fetch('/api/admin/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: piId }),
      })
    } catch {}
    fetchSales()
  }

  useEffect(() => { fetchSales() }, [])

  function setPreset(dollars) { setAmountCents(String(dollars * 100)) }
  function pressDigit(d) {
    setAmountCents((c) => {
      const next = (c === '' && d === '0') ? '' : c + d
      return next.slice(0, 7)
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
      setPaymentIntentId(d.paymentIntentId)
      setPaidCents(cents)
      setStep('pay')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function confirmPayment() {
    const rawCard = cardNumber.replace(/\s/g, '')
    const [expM, expY] = expiry.split('/')
    if (rawCard.length < 13 || !expM || !expY || cvc.length < 3) {
      setError('Please fill in all card details.')
      return
    }
    setError('')
    setBusy(true)
    try {
      const r = await fetch('/api/admin/terminal-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          number: rawCard,
          exp_month: parseInt(expM, 10),
          exp_year: parseInt('20' + expY.trim(), 10),
          cvc,
        }),
      })
      const d = await r.json()
      if (!r.ok || d.error) throw new Error(d.error || 'Payment failed')
      if (d.status === 'succeeded' || d.status === 'processing') {
        setStep('success')
        recordSale(d.id)
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
    setPaymentIntentId('')
    setError('')
    setCardNumber('')
    setExpiry('')
    setCvc('')
    setREmail('')
    setRPhone('')
    setReceiptMsg('')
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04] transition-all bg-white'

  return (
    <AdminLayout title="Terminal">
      <div className="max-w-md mx-auto">

        {/* Today summary */}
        {step === 'amount' && (
          <div className="mb-3 flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5">
            <div>
              <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Today</p>
              <p className="text-gray-900 font-black text-xl leading-tight">{fmt(summary.todayTotal)}</p>
            </div>
            <p className="text-gray-400 text-xs">{summary.todayCount} sale{summary.todayCount !== 1 ? 's' : ''}</p>
          </div>
        )}

        {/* AMOUNT */}
        {step === 'amount' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-8 pb-6 text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Amount</p>
              <div className={`font-black tracking-tight ${cents > 0 ? 'text-gray-900' : 'text-gray-300'}`} style={{ fontSize: '3rem', lineHeight: 1 }}>
                {fmt(cents)}
              </div>
            </div>

            <div className="px-6 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 100].map((d) => (
                  <button
                    key={d}
                    onClick={() => setPreset(d)}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      cents === d * 100
                        ? 'border-[#e85d04] text-[#e85d04] bg-[#e85d04]/5'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ${d}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for? (optional)"
                autoComplete="off"
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

        {/* Recent sales */}
        {step === 'amount' && recent.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <p className="px-5 pt-3.5 pb-2 text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Recent sales</p>
            <div className="divide-y divide-gray-50">
              {recent.slice(0, 8).map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-2.5">
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-bold">{fmt(s.amount)}</p>
                    <p className="text-gray-400 text-xs truncate">{s.description || 'Payment'}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-gray-400 text-xs">
                      {new Date(s.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    {s.receipt_url && (
                      <a href={s.receipt_url} target="_blank" rel="noreferrer" className="text-[#e85d04] text-xs font-semibold">
                        Receipt
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAY */}
        {step === 'pay' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Charging</p>
              <p className="text-gray-900 font-black text-3xl mt-1">{fmt(paidCents)}</p>
              {note && <p className="text-gray-400 text-sm mt-1">{note}</p>}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Card number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setCardNumber(formatted)
                    if (formatted.replace(/\s/g, '').length === 16) expiryRef.current?.focus()
                  }}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Expiry</label>
                  <input
                    ref={expiryRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => {
                      const formatted = formatExpiry(e.target.value)
                      setExpiry(formatted)
                      if (formatted.length === 5) cvcRef.current?.focus()
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">CVC</label>
                  <input
                    ref={cvcRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center mt-4">{error}</p>}

            <button
              onClick={confirmPayment}
              disabled={busy}
              className="w-full text-white font-bold text-base py-4 rounded-2xl shadow-md transition-all disabled:opacity-40 hover:opacity-90 mt-5"
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

        {/* SUCCESS */}
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
                  autoComplete="off"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
                />
                <input
                  type="tel"
                  value={rPhone}
                  onChange={(e) => setRPhone(e.target.value)}
                  placeholder="Customer phone (+1…) for text"
                  autoComplete="off"
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
