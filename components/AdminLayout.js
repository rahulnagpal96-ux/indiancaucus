import { useRouter } from 'next/router'
import Link from 'next/link'

const NAV = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/dashboard/subscribers',
    label: 'Subscribers',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/dashboard/campaigns',
    label: 'Campaigns',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
]

async function logout(router) {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/dashboard/login')
}

export default function AdminLayout({ children, title }) {
  const router = useRouter()
  const { pathname } = router

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f2f8' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shrink-0 shadow-xl"
        style={{ background: 'linear-gradient(180deg, #1a2744 0%, #111d35 100%)' }}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >
              IC
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Indian Caucus</p>
              <p className="text-blue-400 text-xs">of Secaucus</p>
            </div>
          </Link>
        </div>

        {/* Section label */}
        <div className="px-6 mb-2">
          <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'text-white shadow-sm'
                    : 'text-blue-300/80 hover:text-white hover:bg-white/8'
                }`}
                style={active ? { background: 'rgba(255,255,255,0.12)' } : {}}
              >
                <span
                  className={`transition-colors ${active ? 'text-orange-400' : 'text-blue-400'}`}
                >
                  {icon}
                </span>
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-4 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* User */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium">Admin</p>
              <p className="text-blue-400 text-xs">Indian Caucus</p>
            </div>
          </div>
          <button
            onClick={() => logout(router)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-blue-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h1 className="text-gray-900 font-bold text-lg">{title}</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              View public site
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </header>

        <div className="flex-1 px-8 py-7">{children}</div>
      </main>
    </div>
  )
}
