import { useState } from 'react'
import { buildWelcomeEmail } from '../../lib/welcomeEmail'
import AdminLayout from '../../components/AdminLayout'

export async function getServerSideProps() {
  return { props: { html: buildWelcomeEmail('Jane') } }
}

export default function EmailPreview({ html }) {
  const [testEmail, setTestEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  async function sendTest(e) {
    e.preventDefault()
    setSending(true)
    setResult(null)
    const r = await fetch('/api/admin/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    })
    const d = await r.json()
    setSending(false)
    setResult(d.ok ? 'sent' : d.error || 'error')
  }

  return (
    <AdminLayout title="Welcome Email Preview">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-500 text-sm">This is exactly what new subscribers receive.</p>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Live template</span>
      </div>

      {/* Send test */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Send a test email</p>
        <form onSubmit={sendTest} className="flex gap-2 items-center">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
          />
          <button
            type="submit"
            disabled={sending}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a2744, #243660)' }}
          >
            {sending ? 'Sending…' : 'Send test'}
          </button>
        </form>
        {result && (
          <p className={`text-xs mt-2 font-medium ${result === 'sent' ? 'text-green-600' : 'text-red-500'}`}>
            {result === 'sent' ? 'Test email sent! Check your inbox.' : `Error: ${result}`}
          </p>
        )}
      </div>

      {/* Subject */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 mb-4 flex items-center gap-3">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide shrink-0">Subject</span>
        <span className="text-gray-800 text-sm font-medium">Welcome to Indian Caucus of Secaucus</span>
      </div>

      {/* Email render */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-gray-400 text-xs ml-2 font-mono">from: newsletter@newsletters.indiancaucus.org</span>
        </div>
        <div className="w-full overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </AdminLayout>
  )
}
