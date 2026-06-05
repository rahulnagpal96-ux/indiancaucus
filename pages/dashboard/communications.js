import { useEffect, useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import AdminLayout from '../../components/AdminLayout'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPhone(n) {
  const d = (n || '').replace(/\D/g, '').slice(-10)
  return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : n
}

function fmtTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function fmtDuration(sec) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m ? `${m}m ${s}s` : `${s}s`
}

// ── Softphone ─────────────────────────────────────────────────────────────────

function Softphone() {
  const [status, setStatus] = useState('idle') // idle | connecting | ready | calling | ringing | active
  const [dialInput, setDialInput] = useState('')
  const [callDuration, setCallDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const clientRef = useRef(null)
  const callRef = useRef(null)
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  const sipUser = process.env.NEXT_PUBLIC_TELNYX_SIP_USERNAME
  const sipPass = process.env.NEXT_PUBLIC_TELNYX_SIP_PASSWORD
  const fromNumber = process.env.NEXT_PUBLIC_TELNYX_PHONE_NUMBER

  useEffect(() => {
    setStatus('connecting')

    async function init() {
      let loginConfig = {}

      // Always try token auth first (server-side credential)
      try {
        const r = await fetch('/api/admin/telnyx-token', { method: 'POST' })
        const d = await r.json()
        if (d.token) loginConfig = { login_token: d.token }
      } catch {}

      // Fall back to SIP credentials
      if (!loginConfig.login_token && sipUser && sipPass) {
        loginConfig = { login: sipUser, password: sipPass }
      }

      if (!loginConfig.login_token && !loginConfig.login) {
        setStatus('idle'); return
      }

      // Request mic permission before connecting so WebRTC has audio
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(t => t.stop())
      } catch (e) {
        console.error('[Telnyx] Microphone permission denied:', e)
        setStatus('idle')
        return
      }

      const { TelnyxRTC } = await import('@telnyx/webrtc')
      const client = new TelnyxRTC({
        ...loginConfig,
        ringtoneFile: null,
        ringbackFile: null,
        remoteElement: audioRef.current,
        iceServers: [
          { urls: 'stun:stun.telnyx.com:3478' },
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      })

      client.on('telnyx.ready', () => { console.log('[Telnyx] Ready'); setStatus('ready') })
      client.on('telnyx.error', (err) => { console.error('[Telnyx] Error:', JSON.stringify(err)); setStatus('idle') })

      client.on('telnyx.notification', (notification) => {
        const call = notification.call
        console.log('[Telnyx]', notification.type, call?.state, call?.direction, call?.cause)
        if (!call) return
        callRef.current = call

        if (notification.type === 'callUpdate') {
          const state = call.state
          const isInbound = call.direction === 'inbound'

          // Only show incoming UI for inbound calls that are ringing
          if (state === 'ringing' && isInbound) setStatus('ringing')

          // Outbound call placed — show calling status
          if ((state === 'trying' || state === 'requesting' || state === 'early') && !isInbound) setStatus('calling')

          // Call connected
          if (state === 'active') {
            setStatus('active')
            setCallDuration(0)
            timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
          }

          // Call ended
          if (state === 'destroy' || state === 'hangup' || state === 'done') {
            setStatus('ready')
            setCallDuration(0)
            clearInterval(timerRef.current)
            callRef.current = null
          }
        }
      })

      client.connect()
      clientRef.current = client
    }

    init().catch(err => { console.error('[Telnyx] Init error:', err); setStatus('idle') })

    return () => {
      clearInterval(timerRef.current)
      clientRef.current?.disconnect()
    }
  }, [])

  function dial(digit) { setDialInput(v => v + digit) }

  function toE164(num) {
    const digits = num.replace(/\D/g, '')
    if (digits.length === 10) return `+1${digits}`
    if (digits.length === 11 && digits[0] === '1') return `+${digits}`
    return num.startsWith('+') ? num : `+${digits}`
  }

  function makeCall() {
    if (!clientRef.current || !dialInput) return
    setStatus('calling')
    const destination = toE164(dialInput)
    clientRef.current.newCall({
      destinationNumber: destination,
      callerIdNumber: fromNumber || undefined,
      audio: true,
      video: false,
    })
  }

  function hangup() {
    callRef.current?.hangup()
    clearInterval(timerRef.current)
    setStatus('ready')
    setCallDuration(0)
  }

  function answer() { callRef.current?.answer() }

  function toggleMute() {
    if (muted) callRef.current?.unmute()
    else callRef.current?.mute()
    setMuted(m => !m)
  }

  const KEYPAD = ['1','2','3','4','5','6','7','8','9','*','0','#']

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Hidden audio element for remote stream */}
      <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" className="text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="font-semibold text-gray-800 text-sm">Softphone</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          status === 'ready' ? 'bg-green-100 text-green-700' :
          status === 'active' ? 'bg-blue-100 text-blue-700' :
          status === 'ringing' ? 'bg-amber-100 text-amber-700' :
          status === 'connecting' ? 'bg-gray-100 text-gray-500' :
          'bg-gray-100 text-gray-400'
        }`}>
          {status === 'ready' ? 'Ready' :
           status === 'active' ? `Active ${fmtDuration(callDuration)}` :
           status === 'ringing' ? 'Incoming call…' :
           status === 'calling' ? 'Calling…' :
           status === 'connecting' ? 'Connecting…' : 'Not connected'}
        </span>
      </div>

      <div className="p-5">
        {status === 'idle' ? (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">Telnyx not configured. Set <code className="bg-gray-100 px-1 rounded text-xs">TELNYX_WEBRTC_CREDENTIAL_ID</code> or <code className="bg-gray-100 px-1 rounded text-xs">NEXT_PUBLIC_TELNYX_SIP_USERNAME</code> to enable calling.</p>
          </div>
        ) : (
          <>
            {/* Incoming call — only shown for inbound */}
            {status === 'ringing' && callRef.current?.direction === 'inbound' && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-800 text-sm">Incoming call</p>
                  <p className="text-green-600 text-xs">{fmtPhone(callRef.current?.remoteCallerNumber)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={answer} className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-green-600 transition-all">Answer</button>
                  <button onClick={hangup} className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition-all">Decline</button>
                </div>
              </div>
            )}

            {/* Display */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-gray-800 font-mono text-lg tracking-widest">{dialInput || <span className="text-gray-300">Enter number</span>}</span>
              {dialInput && (
                <button onClick={() => setDialInput(v => v.slice(0, -1))} className="text-gray-400 hover:text-gray-700">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                </button>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {KEYPAD.map(k => (
                <button key={k} onClick={() => dial(k)} className="bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl text-sm transition-all active:scale-95">
                  {k}
                </button>
              ))}
            </div>

            {/* Call controls */}
            <div className="flex items-center justify-center gap-3">
              {status === 'active' && (
                <button onClick={toggleMute} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {muted ? <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></> : <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>}
                  </svg>
                </button>
              )}
              {(status === 'active' || status === 'calling') ? (
                <button onClick={hangup} className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-all active:scale-95">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </button>
              ) : (
                <button onClick={makeCall} disabled={!dialInput || status !== 'ready'} className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg transition-all active:scale-95 disabled:opacity-40">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── SMS Inbox ─────────────────────────────────────────────────────────────────

function SMSInbox() {
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [newTo, setNewTo] = useState('')
  const [composing, setComposing] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/admin/conversations')
      .then(r => r.json())
      .then(d => setThreads(d.threads ?? []))
      .catch(() => {})
  }, [])

  async function openThread(number) {
    setActiveThread(number)
    setComposing(false)
    const r = await fetch(`/api/admin/conversations?thread=${encodeURIComponent(number)}`)
    const d = await r.json()
    setMessages(d.messages ?? [])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  async function sendReply(e) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    const to = composing ? newTo : activeThread
    await fetch('/api/admin/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body: reply }),
    })
    setReply('')
    setSending(false)
    if (!composing) openThread(activeThread)
    else { setComposing(false); setNewTo('') }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 480 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" className="text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="font-semibold text-gray-800 text-sm">SMS Conversations</span>
        </div>
        <button
          onClick={() => { setComposing(true); setActiveThread(null); setMessages([]) }}
          className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
          style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New
        </button>
      </div>

      <div className="flex flex-1 min-h-0" style={{ minHeight: 400 }}>
        {/* Thread list */}
        <div className="w-48 border-r border-gray-100 overflow-y-auto shrink-0">
          {threads.length === 0 ? (
            <p className="text-gray-300 text-xs text-center py-8 px-3">No messages yet</p>
          ) : threads.map(t => (
            <button
              key={t.contact_number}
              onClick={() => openThread(t.contact_number)}
              className={`w-full text-left px-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeThread === t.contact_number ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(t.contact_number || '?')[1]}
                </div>
                <p className="text-gray-800 text-xs font-semibold truncate">{fmtPhone(t.contact_number)}</p>
              </div>
              <p className="text-gray-400 text-xs truncate pl-9">{t.body}</p>
              <p className="text-gray-300 text-xs pl-9">{fmtTime(t.created_at)}</p>
            </button>
          ))}
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {composing ? (
            <div className="flex-1 p-4 flex flex-col justify-end gap-3">
              <input
                type="tel"
                value={newTo}
                onChange={e => setNewTo(e.target.value)}
                placeholder="Phone number (+1...)"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20"
              />
              <form onSubmit={sendReply} className="flex gap-2">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20"
                />
                <button type="submit" disabled={sending || !reply || !newTo} className="bg-[#1a2744] text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
                  Send
                </button>
              </form>
            </div>
          ) : activeThread ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="font-semibold text-gray-800 text-sm">{fmtPhone(activeThread)}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      m.direction === 'outbound'
                        ? 'bg-[#1a2744] text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      <p>{m.body}</p>
                      <p className={`text-xs mt-1 ${m.direction === 'outbound' ? 'text-blue-300' : 'text-gray-400'}`}>
                        {fmtTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendReply} className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Reply…"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20"
                />
                <button type="submit" disabled={sending || !reply} className="bg-[#1a2744] text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-300">
              <p className="text-sm">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Call Log ──────────────────────────────────────────────────────────────────

function CallLog() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/calls')
      .then(r => r.json())
      .then(d => { setCalls(d.calls ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const icons = {
    missed: { icon: '↙', color: 'text-red-500', bg: 'bg-red-50' },
    completed: { icon: '↙', color: 'text-green-600', bg: 'bg-green-50' },
    outbound: { icon: '↗', color: 'text-blue-600', bg: 'bg-blue-50' },
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <svg width="16" height="16" className="text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span className="font-semibold text-gray-800 text-sm">Call Log</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-300 text-sm">Loading…</div>
      ) : calls.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-gray-300 text-sm">No calls yet</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {calls.map(c => {
            const style = c.status === 'missed' ? icons.missed : c.direction === 'outbound' ? icons.outbound : icons.completed
            const contact = c.direction === 'inbound' ? c.from_number : c.to_number
            return (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${style.bg} ${style.color}`}>
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium">{fmtPhone(contact)}</p>
                  <p className={`text-xs capitalize ${c.status === 'missed' ? 'text-red-500' : 'text-gray-400'}`}>
                    {c.status} · {c.direction}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-gray-400 text-xs">{fmtTime(c.created_at)}</p>
                  <p className="text-gray-400 text-xs">{fmtDuration(c.duration_sec)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── SMS Campaign ──────────────────────────────────────────────────────────────

function SMSCampaign() {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [confirm, setConfirm] = useState(false)

  async function send() {
    setSending(true)
    setConfirm(false)
    const r = await fetch('/api/admin/sms-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    const d = await r.json()
    setSending(false)
    setResult(d)
    if (d.ok) setBody('')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <svg width="16" height="16" className="text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        <span className="font-semibold text-gray-800 text-sm">Send SMS Campaign</span>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</label>
            <span className="text-gray-400 text-xs">{body.length}/160 · Use {'{{name}}'} to personalise</span>
          </div>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            maxLength={160}
            rows={4}
            placeholder="Hi {{name}}, join us for Diwali Mela on Oct 4! Buchmuller Park, Secaucus. Free entry. See you there!"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all resize-none"
          />
        </div>

        {result && (
          <div className={`text-sm font-medium px-4 py-3 rounded-xl ${result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {result.ok ? `✓ Sent to ${result.sent} subscribers (${result.failed} failed)` : `Error: ${result.error}`}
          </div>
        )}

        {confirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Send SMS campaign?</h3>
              <p className="text-gray-500 text-sm mb-6">This will send to all active subscribers with a phone number. Cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-2xl">Cancel</button>
                <button onClick={send} disabled={sending} className="flex-1 text-white text-sm font-bold py-3 rounded-2xl" style={{ background: 'linear-gradient(135deg,#e85d04,#f97316)' }}>
                  {sending ? 'Sending…' : 'Send now'}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setConfirm(true)}
          disabled={!body.trim() || sending}
          className="w-full text-white text-sm font-bold py-3 rounded-2xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#e85d04,#f97316)' }}
        >
          {sending ? 'Sending…' : 'Send to all subscribers with phone'}
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CommunicationsPage() {
  return (
    <AdminLayout title="Communications">
      <div className="mb-5">
        <p className="text-gray-500 text-sm">Softphone, SMS inbox, call log, and bulk SMS campaigns via Telnyx.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — softphone + call log */}
        <div className="space-y-5">
          <Softphone />
          <CallLog />
        </div>

        {/* Middle + right — SMS */}
        <div className="lg:col-span-2 space-y-5">
          <SMSInbox />
          <SMSCampaign />
        </div>
      </div>
    </AdminLayout>
  )
}
