import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TIERS = [
  {
    name: 'Community Supporter',
    amount: 100,
    color: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
    badgeLabel: 'Supporter',
    perks: [
      'Name listed in event program',
      'Thank-you shoutout on social media',
      '2 complimentary event passes',
      'Certificate of recognition',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Event Sponsor',
    amount: 500,
    color: 'border-brand-orange',
    badge: 'bg-orange-100 text-brand-orange',
    badgeLabel: 'Most Popular',
    perks: [
      'Logo on event banners & signage',
      'Logo on website and social posts',
      'Dedicated shoutout at the event',
      '6 complimentary event passes',
      'Mention in email newsletter',
      'Certificate of recognition',
    ],
    cta: 'Become a Sponsor',
    featured: true,
  },
  {
    name: 'Title Sponsor',
    amount: 2000,
    color: 'border-brand-gold',
    badge: 'bg-yellow-100 text-yellow-700',
    badgeLabel: 'Premium',
    perks: [
      'Name/logo in event title',
      'Premium banner & stage placement',
      'Full-page listing in program',
      'Social media campaign inclusion',
      '15 complimentary event passes',
      'Dedicated feature in newsletter',
      'Premium recognition certificate',
      'Custom sponsorship package available',
    ],
    cta: 'Contact Us',
    featured: false,
  },
]

export default function Sponsor() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Sponsor — Indian Caucus of Secaucus</title>
        <meta name="description" content="Sponsor Indian Caucus events and connect your business with thousands of community members at Holi, Dandiya, and Diwali Mela in Secaucus, NJ." />
      </Head>
      <Header />

      {/* Hero */}
      <section className="hero-bg dot-pattern">
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <span className="section-label" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>For Businesses</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
            Sponsor a festival.<br />
            <span className="gradient-text">Own the spotlight.</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl text-lg leading-relaxed">
            Put your brand in front of thousands of engaged, loyal community members across our three signature festivals. A sponsorship is more than a logo — it's a partnership.
          </p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6">

        {/* Why sponsor */}
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { icon: '👥', stat: '1,000s', label: 'Community members at each event' },
            { icon: '📲', stat: '3x', label: 'Annual events with high attendance' },
            { icon: '🤝', stat: '100%', label: 'Nonprofit — sponsorship is deductible' },
            { icon: '🌟', stat: '15+', label: 'Years building community trust' },
          ].map((s) => (
            <div key={s.label} className="card card-hover text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-extrabold gradient-text">{s.stat}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Tiers */}
        <section className="mt-16">
          <div className="text-center mb-10">
            <span className="section-label">Sponsorship Packages</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Choose your tier</h2>
            <p className="mt-2 text-gray-500 max-w-lg mx-auto">All sponsors receive public recognition and our sincere gratitude. Contact us to build a custom package.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`card card-hover flex flex-col border-2 ${tier.color} relative ${tier.featured ? 'shadow-cta' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-orange text-white text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular</span>
                  </div>
                )}
                <div className="mb-5">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${tier.badge}`}>{tier.badgeLabel}</span>
                  <h3 className="font-extrabold text-xl text-gray-900">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-extrabold text-gray-900">${tier.amount.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm ml-1">/ event</span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#42B97E" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {p}
                    </li>
                  ))}
                </ul>

                {tier.amount <= 500 ? (
                  <Link href="/donate" className={`${tier.featured ? 'btn-primary' : 'btn-secondary'} text-sm py-3 text-center`}>
                    {tier.cta}
                  </Link>
                ) : (
                  <Link href="/contact" className="btn-outline border-gray-200 text-gray-700 hover:bg-gray-50 text-sm py-3 text-center">
                    {tier.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Custom package CTA */}
        <section className="mt-16 mb-8 rounded-2xl bg-brand-navy text-white p-10 text-center dot-pattern">
          <div className="text-4xl mb-3">🤝</div>
          <h2 className="text-2xl font-extrabold">Need a custom package?</h2>
          <p className="mt-3 text-gray-300 max-w-md mx-auto">We're happy to build a sponsorship package that fits your brand, budget, and goals. Reach out and let's talk.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base px-8 py-3.5">Contact Us</Link>
            <Link href="/donate" className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-3.5">Donate Instead</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
