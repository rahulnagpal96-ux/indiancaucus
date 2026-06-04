import { useEffect, useState, useRef } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { buildEventEmail, buildNewsletterEmail, buildDonationEmail, buildPhoneCollectionEmail } from '../../lib/emailTemplates'

// ── Template definitions ─────────────────────────────────────────────────────

const TEMPLATES = {
  event: {
    id: 'event',
    label: 'Event Announcement',
    desc: 'Promote an upcoming event with image, date, and RSVP button',
    color: '#e85d04',
    bg: '#fff7ed',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    fields: [
      { key: 'title', label: 'Event name', placeholder: 'Diwali Mela 2025', type: 'text', required: true },
      { key: 'date', label: 'Date & time', placeholder: 'Saturday, October 4 · 12 PM – 6 PM', type: 'text' },
      { key: 'location', label: 'Location', placeholder: 'Buchmuller Park, Secaucus NJ', type: 'text' },
      { key: 'description', label: 'Description', placeholder: 'Tell people what to expect…', type: 'textarea', required: true },
      { key: 'ctaText', label: 'Button text', placeholder: 'RSVP Now', type: 'text' },
      { key: 'ctaUrl', label: 'Button link', placeholder: 'https://indiancaucus.org/events', type: 'url' },
    ],
  },
  newsletter: {
    id: 'newsletter',
    label: 'Community Update',
    desc: 'Share news, announcements, or a general message with your list',
    color: '#1a2744',
    bg: '#f0f4ff',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    fields: [
      { key: 'headline', label: 'Headline', placeholder: 'Community Update — October 2025', type: 'text', required: true },
      { key: 'body', label: 'Message', placeholder: 'Write your update here…', type: 'textarea', required: true },
      { key: 'ctaText', label: 'Button text (optional)', placeholder: 'Learn More', type: 'text' },
      { key: 'ctaUrl', label: 'Button link (optional)', placeholder: 'https://indiancaucus.org', type: 'url' },
    ],
  },
  donation: {
    id: 'donation',
    label: 'Donation Appeal',
    desc: 'Drive donations with a compelling ask and a big Donate Now button',
    color: '#7c3aed',
    bg: '#faf5ff',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    fields: [
      { key: 'headline', label: 'Headline', placeholder: 'Help us bring the community together', type: 'text', required: true },
      { key: 'body', label: 'Appeal message', placeholder: 'Explain why you need support and what donations will fund…', type: 'textarea', required: true },
      { key: 'ctaText', label: 'Button text', placeholder: 'Donate Now', type: 'text' },
    ],
  },
  phone: {
    id: 'phone',
    label: 'Collect Phone Numbers',
    desc: 'Ask subscribers to add their mobile number for SMS event alerts',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    fields: [],
    noImage: true,
  },
}

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return status === 'sent' ? (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Sent
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Draft
    </span>
  )
}

// ── Image uploader ────────────────────────────────────────────────────────────

function ImageUploader({ value, onChange }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Max 5 MB'); return }
    setUploading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/upload-image?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      })
      const d = await res.json()
      if (d.url) onChange(d.url)
      else setError(d.error || 'Upload failed')
    } catch {
      setError('Upload failed')
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        Image <span className="text-gray-400 font-normal normal-case">(optional, max 5 MB)</span>
      </label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={value} alt="Uploaded" className="w-full max-h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg hover:bg-black/80"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#1a2744] hover:bg-gray-50 transition-all"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading…
            </div>
          ) : (
            <>
              <svg width="28" height="28" className="text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-gray-400 text-sm">Click to upload image</p>
              <p className="text-gray-300 text-xs mt-1">JPG, PNG, WebP</p>
            </>
          )}
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('list') // list | pick | compose
  const [template, setTemplate] = useState(null)
  const [fields, setFields] = useState({})
  const [imageUrl, setImageUrl] = useState('')
  const [subject, setSubject] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)
  const [sendError, setSendError] = useState('')
  const [subCount, setSubCount] = useState(null)
  const [testEmail, setTestEmail] = useState('')
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  function fetchCampaigns() {
    setLoading(true)
    fetch('/api/admin/campaigns')
      .then(r => r.json())
      .then(d => { setCampaigns(d.campaigns ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchCampaigns()
    fetch('/api/admin/stats').then(r => r.json()).then(d => setSubCount(d.total)).catch(() => {})
  }, [])

  function buildHtml() {
    try {
      const data = { ...fields, imageUrl }
      if (template?.id === 'event') return buildEventEmail(data)
      if (template?.id === 'newsletter') return buildNewsletterEmail(data)
      if (template?.id === 'donation') return buildDonationEmail(data)
      if (template?.id === 'phone') return buildPhoneCollectionEmail({ firstName: '{{name}}' })
    } catch { return '' }
    return ''
  }

  function pickTemplate(t) {
    setTemplate(t)
    setFields({})
    setImageUrl('')
    setSubject('')
    setSendResult(null)
    setSendError('')
    setShowPreview(false)
    setStep('compose')
  }

  async function sendTest() {
    if (!testEmail) return
    setTestSending(true)
    setTestResult(null)
    const r = await fetch('/api/admin/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, subject: `[TEST] ${subject}`, html: buildHtml() }),
    })
    const d = await r.json()
    setTestSending(false)
    setTestResult(d.ok ? 'sent' : d.error || 'error')
  }

  async function send(saveOnly = false) {
    setSending(true)
    setSendError('')
    setSendResult(null)
    setShowConfirm(false)
    const htmlContent = buildHtml()
    const r = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, htmlContent, send: !saveOnly }),
    })
    const d = await r.json()
    setSending(false)
    if (d.error) {
      setSendError(d.error)
    } else {
      setSendResult(saveOnly ? 'draft' : `sent:${d.sent}`)
      fetchCampaigns()
      if (!saveOnly) setTimeout(() => setStep('list'), 1500)
    }
  }

  // ── List view ──────────────────────────────────────────────────────────────
  if (step === 'list') return (
    <AdminLayout title="Campaigns">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} total</p>
        <button
          onClick={() => setStep('pick')}
          className="flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-2xl shadow-md hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Campaign
        </button>
      </div>

      {sendResult?.startsWith('sent:') && (
        <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
          <svg width="18" height="18" className="text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
          <p className="text-green-800 font-semibold text-sm">Sent to {sendResult.split(':')[1]} subscribers!</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-300 py-10 justify-center">
          <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading…
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" className="text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">No campaigns yet</p>
          <p className="text-gray-300 text-xs mt-1">Click "New Campaign" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: c.status === 'sent' ? 'linear-gradient(135deg,#e85d04,#f97316)' : 'linear-gradient(135deg,#9ca3af,#d1d5db)' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold text-sm truncate">{c.subject}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {c.sent_at
                    ? `Sent ${new Date(c.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : `Created ${new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {c.recipient_count > 0 && <span className="text-gray-400 text-xs">{c.recipient_count.toLocaleString()} sent</span>}
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )

  // ── Template picker ────────────────────────────────────────────────────────
  if (step === 'pick') return (
    <AdminLayout title="New Campaign">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setStep('list')} className="text-gray-400 hover:text-gray-700 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <p className="text-gray-600 text-sm">Choose a template to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.values(TEMPLATES).map(t => (
          <button
            key={t.id}
            onClick={() => pickTemplate(t)}
            className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-left hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
              style={{ background: t.color }}
            >
              {t.icon}
            </div>
            <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#e85d04] transition-colors">{t.label}</p>
            <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
          </button>
        ))}
      </div>
    </AdminLayout>
  )

  // ── Composer ───────────────────────────────────────────────────────────────
  const html = buildHtml()

  return (
    <AdminLayout title={template.label}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep('pick')} className="text-gray-400 hover:text-gray-700 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
          style={{ background: template.color }}
        >
          {template.icon && <span style={{ transform: 'scale(0.7)' }}>{template.icon}</span>}
        </div>
        <span className="text-gray-700 font-semibold text-sm">{template.label}</span>
      </div>

      {/* Mobile preview toggle */}
      <div className="lg:hidden flex justify-end mb-3">
        <button
          onClick={() => setShowPreview(v => !v)}
          className="text-xs font-semibold border border-gray-200 bg-white px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
        >
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: form ── */}
        <div className={`space-y-5 ${showPreview ? 'hidden lg:block' : ''}`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email subject line <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Diwali Mela 2025 — You're invited!"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
              />
            </div>

            {/* Image upload */}
            <ImageUploader value={imageUrl} onChange={setImageUrl} />

            {/* Template-specific fields */}
            {template.fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {f.label} {f.required && <span className="text-red-400">*</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={fields[f.key] || ''}
                    onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all resize-y"
                  />
                ) : (
                  <input
                    type={f.type}
                    value={fields[f.key] || ''}
                    onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Test send */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Send a test first</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Test emails use transactional sending. The campaign button below sends a Resend broadcast to your audience segment.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] bg-white transition-all"
              />
              <button
                type="button"
                onClick={sendTest}
                disabled={testSending || !testEmail || !subject}
                className="border border-gray-200 bg-white text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {testSending ? 'Sending…' : 'Send test (txn)'}
              </button>
            </div>
            {testResult && (
              <p className={`text-xs font-medium ${testResult === 'sent' ? 'text-green-600' : 'text-red-500'}`}>
                {testResult === 'sent' ? 'Test sent! Check your inbox.' : `Error: ${testResult}`}
              </p>
            )}
          </div>

          {/* Actions */}
          {sendError && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-xs">{sendError}</div>}
          {sendResult === 'draft' && <p className="text-green-600 text-sm font-medium">Draft saved.</p>}

          <div className="flex gap-3">
            <button
              onClick={() => send(true)}
              disabled={sending || !subject}
              className="border border-gray-200 bg-white text-gray-700 text-sm font-semibold px-5 py-3 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={sending || !subject}
              className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Send broadcast to {subCount ? subCount.toLocaleString() : 'all'} contacts
            </button>
          </div>

          {/* Confirm modal */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" className="text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg text-center mb-2">Ready to send?</h3>
                <p className="text-gray-500 text-sm text-center mb-1">
                  <strong>"{subject}"</strong>
                </p>
                <p className="text-gray-400 text-sm text-center mb-6">
                  This will send a Resend broadcast to <strong>{subCount ? subCount.toLocaleString() : 'all'} audience contacts</strong>. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => send(false)}
                    disabled={sending}
                    className="flex-1 text-white text-sm font-bold py-3 rounded-2xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
                  >
                    {sending ? 'Sending…' : 'Send now'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: live preview ── */}
        <div className={`lg:sticky lg:top-24 lg:self-start ${!showPreview ? 'hidden lg:block' : ''}`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-gray-400 text-xs ml-2 font-mono truncate">Live preview</span>
            </div>
            <div
              className="overflow-auto max-h-[70vh]"
              dangerouslySetInnerHTML={{ __html: html || '<div style="padding:40px;text-align:center;color:#9ca3af;font-family:sans-serif;font-size:14px;">Fill in the fields to see a preview</div>' }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
