import Head from 'next/head'
import Link from 'next/link'

const LINKS = [
  {
    label: 'Participation',
    description: 'Sign up to volunteer or participate in our events',
    href: 'https://forms.cloud.microsoft/r/TrUMvCLMTb',
    external: true,
    color: 'from-orange-500 to-red-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Sponsorship',
    description: 'Partner with us to support our community festivals',
    href: '/sponsor',
    external: false,
    color: 'from-purple-500 to-indigo-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    label: 'Newsletter Signup',
    description: 'Stay updated on events, news, and announcements',
    href: '/#subscribe',
    external: false,
    color: 'from-green-500 to-teal-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'Contact',
    description: 'Get in touch with the Indian Caucus of Secaucus',
    href: '/contact',
    external: false,
    color: 'from-blue-500 to-cyan-500',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
]

export default function Links() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 py-12">
      <Head>
        <title>Indian Caucus of Secaucus — Links</title>
        <meta name="description" content="Connect with Indian Caucus of Secaucus — participate, sponsor, subscribe, or contact us." />
      </Head>

      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <Link href="/">
          <span className="text-2xl font-bold text-white tracking-tight">
            Indian Caucus <span className="text-orange-400">of Secaucus</span>
          </span>
        </Link>
        <p className="mt-1 text-sm text-gray-400">Celebrating Indian Culture in NJ</p>
      </div>

      {/* Link Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {LINKS.map(({ label, description, href, external, color, icon }) => {
          const inner = (
            <div className="flex items-center gap-4 w-full">
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
                {icon}
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-base leading-tight">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</div>
              </div>
              <svg className="ml-auto flex-shrink-0 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          )

          return external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-2xl px-4 py-3.5 flex items-center"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="w-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-2xl px-4 py-3.5 flex items-center"
            >
              {inner}
            </Link>
          )
        })}
      </div>

      {/* Social Links */}
      <div className="mt-8 flex gap-4">
        <a
          href="http://www.instagram.com/indiancaucus"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-gray-300"
          aria-label="Instagram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/>
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
            <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor"/>
          </svg>
        </a>
        <a
          href="http://www.facebook.com/indiancaucusofsecaucus"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-gray-300"
          aria-label="Facebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-600">© {new Date().getFullYear()} Indian Caucus of Secaucus · 501(c)(3)</p>
    </div>
  )
}
