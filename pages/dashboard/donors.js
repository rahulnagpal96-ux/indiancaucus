import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Badge({ type }) {
  return type === 'monthly' ? (
    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">Monthly</span>
  ) : (
    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">One-time</span>
  )
}

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/donors').then(r => r.json()),
      fetch('/api/admin/stripe-stats').then(r => r.json()),
    ]).then(([d, s]) => {
      if (d.error && !d.donors) setError(d.error)
      setDonors(d.donors ?? [])
      setStats(s)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = donors.filter(d => {
    if (!search) return true
    const q = search.toLowerCase()
    return (d.email || '').toLowerCase().includes(q) || (d.name || '').toLowerCase().includes(q)
  })

  function exportCSV() {
    const headers = ['date', 'name', 'email', 'amount', 'type']
    const rows = filtered.map(d => [
      new Date(d.date * 1000).toLocaleDateString(),
      `"${d.name || ''}"`,
      d.email || '',
      (d.amount / 100).toFixed(2),
      d.type,
    ].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donors-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout title="Donors">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total raised', value: stats ? fmt(stats.totalRaised) : '—', sub: 'Last 100 donations', color: 'linear-gradient(135deg,#059669,#10b981)' },
          { label: 'This month', value: stats ? fmt(stats.thisMonth) : '—', sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), color: 'linear-gradient(135deg,#1a2744,#2d4a8a)' },
          { label: 'Avg donation', value: stats ? fmt(stats.avgDonation) : '—', sub: `${stats?.count ?? 0} donations`, color: 'linear-gradient(135deg,#e85d04,#f97316)' },
          { label: 'Recurring donors', value: stats?.recurring ?? '—', sub: 'Monthly supporters', color: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm">
            <div className="w-8 h-8 rounded-lg mb-3" style={{ background: color }} />
            <p className="text-2xl font-black text-gray-900">{loading ? <span className="text-gray-200">—</span> : value}</p>
            <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
            <p className="text-gray-400 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex-1 min-w-0 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all shadow-sm"
          />
        </div>
        <button
          onClick={exportCSV}
          disabled={!filtered.length}
          className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
        <a
          href="https://dashboard.stripe.com/payments"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#635bff,#7c74ff)' }}
        >
          Open Stripe →
        </a>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4 text-amber-800 text-sm">
          {error === 'Stripe not configured'
            ? 'Add STRIPE_SECRET_KEY to your Vercel environment variables to see donor data.'
            : `Error: ${error}`}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-300 py-16">
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-gray-400 text-sm font-medium">No donations found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Donor', 'Amount', 'Type', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: `hsl(${((d.email || d.id).charCodeAt(0) * 37) % 360},55%,45%)` }}
                      >
                        {(d.name?.[0] || d.email?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        {d.name && <p className="text-gray-900 text-sm font-medium">{d.name}</p>}
                        <p className={`text-sm ${d.name ? 'text-gray-400' : 'text-gray-700 font-medium'}`}>{d.email || 'Anonymous'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-900 font-bold text-sm">{fmt(d.amount)}</span>
                  </td>
                  <td className="px-5 py-4"><Badge type={d.type} /></td>
                  <td className="px-5 py-4 text-gray-400 text-sm">
                    {new Date(d.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    {d.receiptUrl && (
                      <a href={d.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#635bff] transition-colors text-xs">
                        Receipt →
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
