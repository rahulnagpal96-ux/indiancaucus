import Link from 'next/link'

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" stroke="currentColor" strokeWidth="1.5"/>
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
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-brand-navy text-white mt-20">
      <div className="container-max px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Indian Caucus" className="w-10 h-10 object-contain rounded-md bg-white/10 p-1" onError={(e)=>{e.currentTarget.style.display='none'}} />
              <div>
                <div className="font-bold text-white leading-tight">Indian Caucus</div>
                <div className="text-xs text-gray-400 leading-tight">of Secaucus</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Preserving and celebrating Indian culture in Secaucus, NJ since 2010. 501(c)(3) nonprofit — donations are tax-deductible.
            </p>
            <div className="flex items-center gap-2">
              {process.env.NEXT_PUBLIC_INSTAGRAM && (
                <a href={process.env.NEXT_PUBLIC_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-orange hover:text-white transition-all">
                  <InstagramIcon />
                </a>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK && (
                <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition-all">
                  <FacebookIcon />
                </a>
              )}
              {process.env.NEXT_PUBLIC_YOUTUBE && (
                <a href={process.env.NEXT_PUBLIC_YOUTUBE} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-red-600 hover:text-white transition-all">
                  <YouTubeIcon />
                </a>
              )}
              {process.env.NEXT_PUBLIC_TIKTOK && (
                <a href={process.env.NEXT_PUBLIC_TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-black hover:text-white transition-all">
                  <TikTokIcon />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Organization</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/events', label: 'Events' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Support Us</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/donate', label: 'Donate' },
                { href: '/sponsor', label: 'Become a Sponsor' },
                { href: '/contact', label: 'Volunteer' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{background:'rgba(66,185,126,0.2)',color:'#5eefaa'}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                501(c)(3) — Tax deductible
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0 text-gray-500">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Secaucus, NJ &amp; surrounding communities</span>
              </div>
              <div>
                <Link href="/contact" className="text-brand-green hover:text-white transition-colors font-medium">Send us a message →</Link>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/donate" className="btn-primary text-sm px-5 py-2.5 w-full text-center block">
                Donate Now
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {year} Indian Caucus of Secaucus. All rights reserved.</span>
          <span>Built with ❤️ for the community</span>
        </div>
      </div>
    </footer>
  )
}
