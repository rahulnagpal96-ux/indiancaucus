import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

function deviceLabel(ua = '') {
  let device = 'Device'
  if (/iPhone/i.test(ua)) device = 'iPhone'
  else if (/iPad/i.test(ua)) device = 'iPad'
  else if (/Android/i.test(ua)) device = 'Android'
  else if (/Macintosh|Mac OS X/i.test(ua)) device = 'Mac'
  else if (/Windows/i.test(ua)) device = 'Windows PC'
  let browser = ''
  if (/CriOS|Chrome/i.test(ua)) browser = 'Chrome'
  else if (/Safari/i.test(ua)) browser = 'Safari'
  else if (/Firefox/i.test(ua)) browser = 'Firefox'
  else if (/Edg/i.test(ua)) browser = 'Edge'
  return browser ? `${device} · ${browser}` : device
}

function Toggle({ on, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${on ? 'bg-[#e85d04]' : 'bg-gray-300'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({ sale: true, subscriber: true })
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testMsg, setTestMsg] = useState('')
  const [testing, setTesting] = useState(false)

  async function load() {
    try {
      const r = await fetch('/api/admin/notifications')
      const d = await r.json()
      if (!d.error) {
        setPrefs(d.prefs || { sale: true, subscriber: true })
        setDevices(d.devices || [])
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updatePref(kind, value) {
    setPrefs((p) => ({ ...p, [kind]: value })) // optimistic
    setSaving(true)
    try {
      await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [kind]: value }),
      })
    } catch {} finally { setSaving(false) }
  }

  async function removeDevice(id) {
    setDevices((list) => list.filter((d) => d.id !== id)) // optimistic
    try {
      await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' })
    } catch {}
  }

  async function sendTest() {
    setTesting(true); setTestMsg('')
    try {
      const r = await fetch('/api/admin/push-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Indian Caucus', body: 'Test notification ✅', url: '/dashboard' }),
      })
      const d = await r.json()
      setTestMsg(r.ok ? `Sent to ${d.sent} of ${d.total} device(s)` : (d.error || 'Send failed'))
    } catch {
      setTestMsg('Send failed')
    } finally { setTesting(false) }
  }

  return (
    <AdminLayout title="Notifications">
      <div className="max-w-xl space-y-5">

        {/* Alert preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-gray-900 font-bold text-sm">Alerts</h2>
            <p className="text-gray-400 text-xs mt-0.5">Choose which events send a push notification to all devices.</p>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="pr-4">
                <p className="text-gray-900 text-sm font-semibold">New sale</p>
                <p className="text-gray-400 text-xs mt-0.5">When a Terminal payment succeeds</p>
              </div>
              <Toggle on={prefs.sale} onChange={(v) => updatePref('sale', v)} disabled={loading || saving} />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="pr-4">
                <p className="text-gray-900 text-sm font-semibold">New subscriber</p>
                <p className="text-gray-400 text-xs mt-0.5">When someone signs up from the website</p>
              </div>
              <Toggle on={prefs.subscriber} onChange={(v) => updatePref('subscriber', v)} disabled={loading || saving} />
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 font-bold text-sm">Devices</h2>
              <p className="text-gray-400 text-xs mt-0.5">{devices.length} device{devices.length !== 1 ? 's' : ''} receiving notifications</p>
            </div>
            <button
              onClick={sendTest}
              disabled={testing || devices.length === 0}
              className="text-xs font-semibold border border-gray-200 bg-white px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {testing ? 'Sending…' : 'Send test'}
            </button>
          </div>

          {testMsg && <p className="px-5 pt-3 text-xs text-gray-500">{testMsg}</p>}

          {loading ? (
            <p className="text-gray-400 text-sm text-center py-10">Loading…</p>
          ) : devices.length === 0 ? (
            <div className="text-center py-10 px-5">
              <p className="text-gray-400 text-sm font-medium">No devices yet</p>
              <p className="text-gray-300 text-xs mt-1">
                Add this app to your Home Screen, open it, then tap “Enable notifications” in the sidebar.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {devices.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-semibold">{deviceLabel(d.user_agent)}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Added {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => removeDevice(d.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-3"
                    title="Remove device"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}
