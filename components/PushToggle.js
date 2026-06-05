import { useEffect, useState } from 'react'

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

const bell = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export default function PushToggle() {
  const [supported, setSupported] = useState(false)
  const [standalone, setStandalone] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const sup = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && !!VAPID
    setSupported(sup)
    setStandalone(
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)
    )
    if (sup) {
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((s) => setSubscribed(!!s))
        .catch(() => {})
    }
  }, [])

  async function enable() {
    setBusy(true); setMsg('')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setMsg('Permission denied'); return }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID),
      })
      const r = await fetch('/api/admin/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      if (!r.ok) throw new Error('Could not save subscription')
      setSubscribed(true); setMsg('Notifications enabled')
    } catch (e) {
      setMsg(e.message || 'Failed to enable')
    } finally {
      setBusy(false)
    }
  }

  async function test() {
    setBusy(true); setMsg('')
    try {
      const r = await fetch('/api/admin/push-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Indian Caucus', body: 'Test notification ✅', url: '/dashboard' }),
      })
      const d = await r.json()
      setMsg(r.ok ? `Sent to ${d.sent} device(s)` : (d.error || 'Send failed'))
    } catch {
      setMsg('Send failed')
    } finally {
      setBusy(false)
    }
  }

  if (!supported) return null

  // iOS only allows web push when the app is installed to the Home Screen.
  if (!standalone) {
    return (
      <p className="text-blue-300/60 text-[11px] leading-snug px-1 mb-2">
        Add to your Home Screen to enable push notifications.
      </p>
    )
  }

  return (
    <div className="mb-1">
      <button
        onClick={subscribed ? test : enable}
        disabled={busy}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-blue-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
      >
        {bell}
        {busy ? 'Working…' : subscribed ? 'Test notification' : 'Enable notifications'}
      </button>
      {msg && <p className="text-blue-300/60 text-[11px] mt-0.5 px-3">{msg}</p>}
    </div>
  )
}
