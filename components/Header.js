import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/sponsor', label: 'Sponsor' },
  { href: '/contact', label: 'Contact' },
]

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor"/>
  </svg>
)
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z"/>
  </svg>
)
const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29.38 29.38 0 0 0 1 12a29.38 29.38 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.38 29.38 0 0 0 23 12a29.38 29.38 0 0 0-.46-5.58z"/>
    <path d="M10 15l5-3-5-3v6z" fill="white"/>
  </svg>
)

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [router.pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container-max flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Indian Caucus"
              className="w-9 h-9 object-contain rounded-md"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
            />
            <div
              className="w-9 h-9 rounded-md bg-brand-orange items-center justify-center text-white font-bold text-sm hidden"
            >IC</div>
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight text-sm">Indian Caucus of Secaucus</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === href
                  ? 'text-brand-orange bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Social icons */}
          <div className="flex items-center gap-1 mr-1">
            {process.env.NEXT_PUBLIC_INSTAGRAM && (
              <a href={process.env.NEXT_PUBLIC_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1.5 rounded-lg text-gray-500 hover:text-brand-orange hover:bg-orange-50 transition-colors">
                <InstagramIcon />
              </a>
            )}
            {process.env.NEXT_PUBLIC_FACEBOOK && (
              <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <FacebookIcon />
              </a>
            )}
            {process.env.NEXT_PUBLIC_YOUTUBE && (
              <a href={process.env.NEXT_PUBLIC_YOUTUBE} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                <YouTubeIcon />
              </a>
            )}
          </div>
          <Link href="/donate" className="btn-primary text-sm px-5 py-2.5">
            Donate Now
          </Link>
        </div>

        {/* Mobile: donate + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/donate" className="btn-primary text-xs px-3 py-2">
            Donate
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === href
                  ? 'text-brand-orange bg-orange-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
            {process.env.NEXT_PUBLIC_INSTAGRAM && (
              <a href={process.env.NEXT_PUBLIC_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-lg text-gray-500 hover:text-brand-orange transition-colors">
                <InstagramIcon />
              </a>
            )}
            {process.env.NEXT_PUBLIC_FACEBOOK && (
              <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors">
                <FacebookIcon />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
