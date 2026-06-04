import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

function StatusBadge({ status }) {
  return status === 'sent' ? (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      Sent
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Draft
    </span>
  )
}

const TEMPLATES = [
  {
    label: 'Event announcement',
    subject: '🎉 Join us for [Event Name] — [Date]',
    body: `<p>Hi {{name}},</p>

<p>We're excited to invite you to <strong>[Event Name]</strong>, happening on <strong>[Date]</strong> at <strong>[Location]</strong>!</p>

<p>Join us for a wonderful evening of celebration with the Secaucus Indian community. This event is <strong>free and open to all</strong>.</p>

<p><strong>Event details:</strong></p>
<ul>
  <li>📅 Date: [Date]</li>
  <li>🕕 Time: [Time]</li>
  <li>📍 Location: [Location]</li>
</ul>

<p>We hope to see you there! Feel free to share with family and friends.</p>

<p>Warm regards,<br>Indian Caucus of Secaucus</p>`,
  },
  {
    label: 'Newsletter update',
    subject: 'Community Update from Indian Caucus of Secaucus',
    body: `<p>Hi {{name}},</p>

<p>Here's what's been happening in our community:</p>

<p>[Your update here]</p>

<p>Thank you for being part of the Indian Caucus of Secaucus family!</p>

<p>Warm regards,<br>Indian Caucus of Secaucus</p>`,
  },
  {
    label: 'Donation ask',
    subject: 'Help us bring the community together 🙏',
    body: `<p>Hi {{name}},</p>

<p>Your support makes our free community events possible. This year, we're raising funds to bring you even bigger and better celebrations.</p>

<p>A small donation goes a long way — <a href="https://www.indiancaucusofsecaucus.org/donate">donate today</a> to help us celebrate Holi, Dandiya Dhamaka, and Diwali together.</p>

<p>With gratitude,<br>Indian Caucus of Secaucus</p>`,
  },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)
  const [sendError, setSendError] = useState('')
  const [preview, setPreview] = useState(false)
  const [subCount, setSubCount] = useState(null)

  function fetchCampaigns() {
    setLoading(true)
    fetch('/api/admin/campaigns')
      .then((r) => r.json())
      .then((d) => { setCampaigns(d.campaigns ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchCampaigns()
    // Get subscriber count for send confirmation
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setSubCount(d.total))
      .catch(() => {})
  }, [])

  function applyTemplate(t) {
    setSubject(t.subject)
    setBody(t.body)
    setPreview(false)
    setSendResult(null)
    setSendError('')
  }

  async function saveDraft() {
    if (!subject.trim() || !body.trim()) return
    setSending(true)
    const r = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, htmlContent: body, send: false }),
    })
    setSending(false)
    if (r.ok) {
      fetchCampaigns()
      setSendResult({ type: 'draft', message: 'Draft saved successfully.' })
    }
  }

  async function sendCampaign() {
    if (!subject.trim() || !body.trim()) return
    const confirmed = confirm(
      `Send "${subject}" to ${subCount ?? 'all'} active subscriber${subCount !== 1 ? 's' : ''}?\n\nThis cannot be undone.`
    )
    if (!confirmed) return

    setSending(true)
    setSendError('')
    setSendResult(null)

    const r = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, htmlContent: body, send: true }),
    })
    const d = await r.json()
    setSending(false)

    if (d.error) {
      setSendError(d.error)
    } else {
      setSendResult({ type: 'sent', message: `Sent to ${d.sent} subscriber${d.sent !== 1 ? 's' : ''}!` })
      setSubject('')
      setBody('')
      setComposing(false)
      fetchCampaigns()
    }
  }

  return (
    <AdminLayout title="Campaigns">
      {/* Compose button */}
      {!composing && (
        <div className="mb-6">
          <button
            onClick={() => { setComposing(true); setSendResult(null); setSendError(''); setSubject(''); setBody('') }}
            className="flex items-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Campaign
          </button>
        </div>
      )}

      {/* Composer */}
      {composing && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          {/* Composer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">New Campaign</h2>
            <button
              onClick={() => setComposing(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              ✕ Cancel
            </button>
          </div>

          {/* Templates */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick templates</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => applyTemplate(t)}
                  className="text-xs border border-gray-200 bg-white text-gray-600 font-medium px-3 py-1.5 rounded-lg hover:border-[#e85d04] hover:text-[#e85d04] transition-all"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Subject line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Join us for Diwali Mela 2025 🪔"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email body (HTML)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Use <code className="bg-gray-100 px-1 rounded">{'{{name}}'}</code> to personalize</span>
                  <button
                    onClick={() => setPreview((v) => !v)}
                    className="text-xs font-medium text-[#1a2744] hover:underline"
                  >
                    {preview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
              {preview ? (
                <div
                  className="border border-gray-200 rounded-xl p-5 min-h-64 prose prose-sm max-w-none text-sm text-gray-700 bg-white"
                  dangerouslySetInnerHTML={{ __html: body.replace(/\{\{name\}\}/g, 'Friend') }}
                />
              ) : (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  placeholder="<p>Hi {{name}},</p><p>Your message here…</p>"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all resize-y"
                />
              )}
            </div>

            {sendError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <svg width="15" height="15" className="text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-red-600 text-xs">{sendError}</p>
              </div>
            )}

            {sendResult?.type === 'draft' && (
              <p className="text-green-600 text-sm font-medium">{sendResult.message}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={saveDraft}
                disabled={sending || !subject || !body}
                className="border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Save draft
              </button>
              <button
                onClick={sendCampaign}
                disabled={sending || !subject || !body}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send now {subCount ? `(${subCount})` : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send success toast */}
      {sendResult?.type === 'sent' && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="15" height="15" className="text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-green-800 font-semibold text-sm">{sendResult.message}</p>
        </div>
      )}

      {/* Campaign history */}
      <div>
        <h2 className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-4">Campaign history</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-300 py-8">
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-14">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" className="text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No campaigns yet</p>
            <p className="text-gray-300 text-xs mt-1">Create your first campaign above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{
                    background: c.status === 'sent'
                      ? 'linear-gradient(135deg, #e85d04, #f97316)'
                      : 'linear-gradient(135deg, #9ca3af, #d1d5db)',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-semibold text-sm truncate">{c.subject}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {c.sent_at
                      ? `Sent ${new Date(c.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                      : `Created ${new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {c.recipient_count > 0 && (
                    <span className="text-gray-400 text-xs font-medium">
                      {c.recipient_count.toLocaleString()} recipients
                    </span>
                  )}
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
