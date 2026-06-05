import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '../../components/AdminLayout'

function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function ymd(d) {
  return new Date(d).toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

const PRESETS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: 'all', label: 'All' },
]

export default function PaymentsPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [preset, setPreset] = useState('30d')
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState({ total: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  // Initialize to the last 30 days on first render.
  useEffect(() => {
    const today = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 29)
    setFrom(ymd(start)); setTo(ymd(today))
  }, [])

  const fetchPayments = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    fetch(`/api/admin/payments?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) { setPayments(d.payments || []); setSummary({ total: d.total || 0, count: d.count || 0 }) }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [from, to])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  function applyPreset(key) {
    setPreset(key)
    const today = new Date()
    if (key === 'all') { setFrom(''); setTo(''); return }
    const start = new Date()
    if (key === '7d') start.setDate(start.getDate() - 6)
    else if (key === '30d') start.setDate(start.getDate() - 29)
    setFrom(ymd(start)); setTo(ymd(today))
  }

  function onDateChange(which, value) {
    setPreset('custom')
    if (which === 'from') setFrom(value)
    else setTo(value)
  }

  function exportCSV() {
    const headers = ['date', 'time', 'amount_usd', 'description', 'status', 'receipt_email', 'payment_id']
    const rows = payments.map((p) => {
      const d = new Date(p.created_at)
      return [
        d.toLocaleDateString('en-US'),
        d.toLocaleTimeString('en-US'),
        (p.amount / 100).toFixed(2),
        p.description || '',
        p.status || '',
        p.receipt_email || '',
        p.payment_intent_id,
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    })
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${from || 'all'}_${to || 'now'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout title="Payments">
      <div className="space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Total collected</p>
            <p className="text-gray-900 font-black text-2xl md:text-3xl mt-1">{fmt(summary.total)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Payments</p>
            <p className="text-gray-900 font-black text-2xl md:text-3xl mt-1">{summary.count.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={`px-3.5 py-2.5 text-xs font-semibold transition-all ${preset === p.key ? 'bg-[#1a2744] text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date" value={from} onChange={(e) => onDateChange('from', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date" value={to} onChange={(e) => onDateChange('to', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20"
            />
          </div>

          <button
            onClick={exportCSV}
            disabled={!payments.length}
            className="ml-auto flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-16">Loading…</p>
          ) : payments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm font-medium">No payments in this range</p>
              <p className="text-gray-300 text-xs mt-1">Take a payment from the Terminal tab</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Date', 'Amount', 'Description', 'Status', 'Receipt'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <span className="text-gray-300"> · {new Date(p.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-900 text-sm font-bold whitespace-nowrap">{fmt(p.amount)}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm max-w-[16rem] truncate">{p.description || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'succeeded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.receipt_url ? (
                        <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-[#e85d04] text-xs font-semibold">View</a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {payments.length >= 2000 && (
          <p className="text-gray-400 text-xs">Showing the most recent 2,000 payments. Narrow the date range to see older ones.</p>
        )}
      </div>
    </AdminLayout>
  )
}
