import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const NAV = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/dashboard/subscribers',
    label: 'Subscribers',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f8' }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (desktop always visible, mobile slide-in) ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 flex flex-col shadow-xl transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #1a2744 0%, #111d35 100%)' }}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <img src="/logo.png" alt="Indian Caucus of Secaucus" className="h-9 w-auto shrink-0" />
          </Link>
          {/* Close on mobile */}
          <button
            className="md:hidden text-blue-300 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 mb-2">
          <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Dashboard</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'text-white' : 'text-blue-300/80 hover:text-white hover:bg-white/10'
                }`}
                style={active ? { background: 'rgba(255,255,255,0.12)' } : {}}
              >
                <span className={active ? 'text-orange-400' : 'text-blue-400'}>{icon}</span>
                {label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />}
              </Link>
            )
          })}
        </nav>

        <div className="mx-4 my-4 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #e85d04, #f97316)' }}
            >A</div>
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

      {/* ── Main content area ── */}
      <div className="md:pl-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-800 p-1 -ml-1"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-gray-900 font-bold text-base md:text-lg">{title}</h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            View site
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          {/* Mobile sign out */}
          <button
            onClick={() => logout(router)}
            className="sm:hidden text-gray-400 hover:text-gray-700 p-1"
            title="Sign out"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 px-4 md:px-8 py-5 md:py-7 pb-24 md:pb-7">
          {children}
        </div>
      </div>

      {/* ── Bottom tab bar — mobile only ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 flex shadow-lg">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                active ? 'text-[#e85d04]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={active ? 'text-[#e85d04]' : 'text-gray-400'}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
