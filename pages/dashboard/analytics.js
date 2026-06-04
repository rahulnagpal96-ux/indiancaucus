import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'

const TOOLS = [
  {
    name: 'PostHog',
    desc: 'Full behavior analytics — session recordings, heatmaps, funnels, user paths, event tracking',
    url: 'https://us.posthog.com',
    color: 'linear-gradient(135deg,#f97316,#fb923c)',
    badge: 'Installed',
    badgeColor: 'bg-green-100 text-green-700',
    features: ['Session replay', 'Heatmaps', 'Funnels', 'Event tracking', 'User cohorts'],
    setup: 'Add NEXT_PUBLIC_POSTHOG_KEY to Vercel env vars → data flows automatically',
  },
  {
    name: 'Vercel Analytics',
    desc: 'Real-time pageview stats, top pages, traffic sources, Core Web Vitals',
    url: 'https://vercel.com/analytics',
    color: 'linear-gradient(135deg,#000,#333)',
    badge: 'Active',
    badgeColor: 'bg-green-100 text-green-700',
    features: ['Pageviews', 'Top pages', 'Traffic sources', 'Web Vitals', 'Real-time'],
    setup: 'Already active — view in your Vercel project dashboard',
  },
]

const QUICK_LINKS = [
  { label: 'Stripe', desc: 'Payments, donors, subscriptions', url: 'https://dashboard.stripe.com', color: '#635bff', icon: '$' },
  { label: 'Resend', desc: 'Email delivery, logs, domains', url: 'https://resend.com', color: '#1a2744', icon: '✉' },
  { label: 'Vercel', desc: 'Deployments, env vars, logs', url: 'https://vercel.com', color: '#000', icon: '▲' },
  { label: 'Outlook / O365', desc: 'Email, calendar, teams', url: 'https://outlook.office.com', color: '#0078d4', icon: 'M' },
  { label: 'PostHog', desc: 'Behavior analytics dashboard', url: 'https://us.posthog.com', color: '#f97316', icon: 'P' },
  { label: 'Mailchimp', desc: 'Legacy email list (while migrating)', url: 'https://mailchimp.com', color: '#ffe01b', icon: '🐒', dark: true },
]

export default function AnalyticsPage() {
  return (
    <AdminLayout title="Analytics & Tools">

      {/* Analytics tools */}
      <div className="mb-8">
        <h2 className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-4">Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1.5 w-full" style={{ background: t.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{t.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.features.map(f => (
                    <span key={f} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">{t.setup}</p>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 ml-3 text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all"
                    style={{ background: t.color }}
                  >
                    Open →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-4">Quick links — all your tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(l => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-all group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: l.color, color: l.dark ? '#000' : '#fff' }}
              >
                {l.icon}
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 font-semibold text-sm group-hover:text-[#e85d04] transition-colors">{l.label}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-snug">{l.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* PostHog setup guide */}
      {!process.env.NEXT_PUBLIC_POSTHOG_KEY && (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <h3 className="font-bold text-orange-800 text-sm mb-2">Set up PostHog behavior tracking</h3>
          <ol className="text-orange-700 text-sm space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://posthog.com" target="_blank" rel="noopener noreferrer" className="underline">posthog.com</a> → create a free account</li>
            <li>Create a new project → copy your <strong>Project API Key</strong></li>
            <li>Add to Vercel env vars: <code className="bg-orange-100 px-1 rounded">NEXT_PUBLIC_POSTHOG_KEY=phc_xxx</code></li>
            <li>Redeploy — session recordings, heatmaps, and funnels start automatically</li>
          </ol>
        </div>
      )}

    </AdminLayout>
  )
}
