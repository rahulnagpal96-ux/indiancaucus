import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

function fmtTime(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function parseDevice(ua) {
  if (!ua) return 'Unknown'
  if (/iPhone|iPad/i.test(ua)) return 'iOS'
  if (/Android/i.test(ua)) return 'Android'
  if (/Mac/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows'
  return 'Other'
}

function parseBrowser(ua) {
  if (!ua) return ''
  if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) return 'Chrome'
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  if (/Firefox/i.test(ua)) return 'Firefox'
  if (/Edge|Edg/i.test(ua)) return 'Edge'
  return ''
}

export default function ActivityPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/activity-log')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setLogs(d.logs ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = logs.filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (l.user_email || '').toLowerCase().includes(q) ||
      (l.page || '').toLowerCase().includes(q) ||
      (l.ip_address || '').includes(q) ||
      (l.isp || '').toLowerCase().includes(q) ||
      (l.city || '').toLowerCase().includes(q)
    )
  })

  return (
    <AdminLayout title="Activity Log">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex-1 min-w-0 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by user, page, IP, ISP, city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all shadow-sm"
          />
        </div>
        <span className="text-gray-400 text-xs">{filtered.length} events</span>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4 text-amber-800 text-sm">
          Table not set up yet — click "Set up database" on the Overview page first.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-300 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-300 text-sm">No activity logged yet</div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Time', 'User', 'Action / Page', 'Device', 'IP · ISP · Location'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id} className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{fmtTime(l.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-800 text-sm font-medium truncate max-w-[160px]">{l.user_email || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${
                      l.action === 'page_view' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>{l.action}</span>
                    <span className="text-gray-500 text-xs">{l.page}</span>
                    {l.detail && <p className="text-gray-400 text-xs mt-0.5">{l.detail}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    <p>{parseDevice(l.user_agent)}</p>
                    <p className="text-gray-400">{parseBrowser(l.user_agent)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-600 text-xs font-mono">{l.ip_address}</p>
                    <p className="text-gray-400 text-xs">{[l.isp, l.city, l.country].filter(Boolean).join(' · ')}</p>
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
