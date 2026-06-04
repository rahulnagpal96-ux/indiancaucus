import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'

function EditModal({ sub, onClose, onSave }) {
  const [form, setForm] = useState({
    email: sub.email || '',
    firstName: sub.first_name || '',
    lastName: sub.last_name || '',
    phone: sub.phone || '',
    status: sub.status || 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function change(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const r = await fetch(`/api/admin/subscribers?id=${sub.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const d = await r.json()
    setSaving(false)
    if (d.error) { setError(d.error); return }
    onSave(d.subscriber)
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all'
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Edit subscriber</h2>
            <p className="text-gray-400 text-xs mt-0.5">{sub.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-lg leading-none">×</button>
        </div>
        <form onSubmit={save} className="px-7 py-6 space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={form.email} onChange={change} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>First name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={change} placeholder="Optional" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={change} placeholder="Optional" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={change} placeholder="+1 (201) 555-0100" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={change} className={inputClass}>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 text-white text-sm font-bold py-3 rounded-2xl shadow-md hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Badge({ children, color }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-500',
    blue: 'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  )
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, '_'))
  return lines.slice(1).map((line) => {
    const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  }).filter((r) => r.email)
}

function ImportModal({ onClose, onImport }) {
  const [rows, setRows] = useState([])
  const [preview, setPreview] = useState([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result)
      setRows(parsed)
      setPreview(parsed.slice(0, 5))
      setError('')
    }
    reader.readAsText(file)
  }

  async function doImport() {
    if (!rows.length) return
    setImporting(true)
    setError('')
    const r = await fetch('/api/admin/import-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, source: 'csv-import' }),
    })
    const d = await r.json()
    setImporting(false)
    if (d.error) {
      setError(d.error)
    } else {
      setResult(d)
      onImport()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Import Contacts</h2>
            <p className="text-gray-400 text-xs mt-0.5">Upload a CSV with email, name, and phone columns</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            ×
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {result ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" className="text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-lg">{result.imported} contacts imported</p>
              {result.skipped > 0 && <p className="text-gray-400 text-sm mt-1">{result.skipped} rows skipped (invalid email or duplicate)</p>}
              <button onClick={onClose} className="mt-5 bg-[#1a2744] text-white text-sm font-bold px-6 py-2.5 rounded-2xl hover:bg-[#243660] transition-all">
                Done
              </button>
            </div>
          ) : (
            <>
              {/* File drop zone */}
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1a2744] hover:bg-gray-50 transition-all"
              >
                <svg width="32" height="32" className="text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-gray-500 text-sm font-medium">Click to upload CSV</p>
                <p className="text-gray-400 text-xs mt-1">or drag and drop</p>
                <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
              </div>

              {/* Column hint */}
              <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-700">
                <span className="font-semibold">Expected columns:</span>{' '}
                <code className="bg-blue-100 px-1 rounded">email</code>{' '}
                <span className="text-blue-400">(required)</span>,{' '}
                <code className="bg-blue-100 px-1 rounded">first_name</code>,{' '}
                <code className="bg-blue-100 px-1 rounded">phone</code>{' '}
                — header row required.
              </div>

              {/* Preview table */}
              {preview.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Preview — {rows.length} row{rows.length !== 1 ? 's' : ''} detected
                  </p>
                  <div className="overflow-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          {['email', 'first_name', 'phone'].map((h) => (
                            <th key={h} className="px-3 py-2 text-left text-gray-500 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr key={i} className="border-t border-gray-50">
                            <td className="px-3 py-2 text-gray-700">{row.email}</td>
                            <td className="px-3 py-2 text-gray-500">{row.first_name || row.firstName || row.name || '—'}</td>
                            <td className="px-3 py-2 text-gray-500">{row.phone || row.mobile || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rows.length > 5 && (
                    <p className="text-gray-400 text-xs mt-1">+{rows.length - 5} more rows</p>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 text-xs">{error}</p>}

              {rows.length > 0 && (
                <button
                  onClick={doImport}
                  disabled={importing}
                  className="w-full text-white font-bold text-sm py-3.5 rounded-2xl transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}
                >
                  {importing ? 'Importing…' : `Import ${rows.length} contacts`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ email: '', firstName: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const r = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, firstName: form.firstName, phone: form.phone, source: 'manual' }),
    })
    setSaving(false)
    if (r.ok) { onAdd(); onClose() }
    else setError('Could not add subscriber. Check the email address.')
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all'
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Add subscriber</h2>
            <p className="text-gray-400 text-xs mt-0.5">They will receive a confirmation email</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-lg leading-none">×</button>
        </div>
        <form onSubmit={save} className="px-7 py-6 space-y-4">
          <div>
            <label className={labelClass}>Email <span className="text-red-400">*</span></label>
            <input type="email" name="email" value={form.email} onChange={change} required autoFocus className={inputClass} placeholder="jane@example.com" />
          </div>
          <div>
            <label className={labelClass}>First name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={change} placeholder="Jane" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={change} placeholder="+1 (201) 555-0100" className={inputClass} />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 text-white text-sm font-bold py-3 rounded-2xl shadow-md hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}>
              {saving ? 'Adding…' : 'Add subscriber'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SubscribersPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('active')
  const [showImport, setShowImport] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const fetchSubs = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ status: filter, search })
    fetch(`/api/admin/subscribers?${params}`)
      .then((r) => r.json())
      .then((d) => { setSubscribers(d.subscribers ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filter, search])

  useEffect(() => { fetchSubs() }, [fetchSubs])

  // Auto-open import modal from query param
  useEffect(() => {
    if (router.query.import === '1') setShowImport(true)
  }, [router.query])

  async function handleDelete(id) {
    if (!confirm('Unsubscribe this contact?')) return
    setDeleting(id)
    await fetch(`/api/admin/subscribers?id=${id}`, { method: 'DELETE' })
    setDeleting(null)
    fetchSubs()
  }

  function exportCSV() {
    const headers = ['id', 'email', 'first_name', 'phone', 'source', 'status', 'created_at']
    const rows = subscribers.map((s) =>
      headers.map((h) => `"${(s[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const phoneSubs = subscribers.filter((s) => s.phone)

  return (
    <AdminLayout title="Subscribers">
      {showImport && (
        <ImportModal
          onClose={() => { setShowImport(false); router.replace('/dashboard/subscribers', undefined, { shallow: true }) }}
          onImport={fetchSubs}
        />
      )}

      {adding && (
        <AddModal
          onClose={() => setAdding(false)}
          onAdd={fetchSubs}
        />
      )}

      {editing && (
        <EditModal
          sub={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setSubscribers(subs => subs.map(s => s.id === updated.id ? { ...s, ...updated } : s))
            setEditing(null)
          }}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {/* Search */}
        <div className="flex-1 min-w-0 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by email, name, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all shadow-sm"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {['active', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-xs font-semibold capitalize transition-all ${
                filter === f ? 'bg-[#1a2744] text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2.5 rounded-xl shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={exportCSV}
            disabled={!subscribers.length}
            className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2.5 rounded-xl shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>
      </div>

      {/* Summary pills */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="bg-[#1a2744]/10 text-[#1a2744] font-semibold px-3 py-1 rounded-full">
            {subscribers.length} shown
          </span>
          {phoneSubs.length > 0 && (
            <span className="bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
              {phoneSubs.length} with phone numbers
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-300">
            <svg className="animate-spin mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" className="text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No subscribers yet</p>
            <p className="text-gray-300 text-xs mt-1">Import a CSV or wait for sign-ups from your site</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name & Email', 'Phone', 'Source', 'Joined', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, i) => (
                <tr
                  key={sub.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${i === subscribers.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: `hsl(${(sub.email.charCodeAt(0) * 37) % 360}, 60%, 45%)` }}
                      >
                        {(sub.first_name?.[0] ?? sub.last_name?.[0] ?? sub.email[0]).toUpperCase()}
                      </div>
                      <div>
                        {(sub.first_name || sub.last_name) && (
                          <p className="text-gray-900 text-sm font-medium">
                            {[sub.first_name, sub.last_name].filter(Boolean).join(' ')}
                          </p>
                        )}
                        <p className={`text-sm ${(sub.first_name || sub.last_name) ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                          {sub.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {sub.phone ? (
                      <span className="text-sm text-gray-700 font-mono">{sub.phone}</span>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={sub.source === 'csv-import' ? 'blue' : sub.source === 'event' ? 'purple' : 'green'}>
                      {sub.source}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">
                    {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditing(sub)}
                        className="text-gray-300 hover:text-[#1a2744] transition-colors"
                        title="Edit"
                      >
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleting === sub.id}
                        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Unsubscribe"
                      >
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
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
