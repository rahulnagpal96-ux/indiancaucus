import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CHECK = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#42B97E" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const DIWALI_AD = [
  { name: 'Inside Half Page', price: 150, perks: ['Half-page ad inside the Diwali Mela program book', 'Name on event website', 'Social media thank-you post'] },
  { name: 'Inside Full Page', price: 250, perks: ['Full-page ad inside the Diwali Mela program book', 'Logo on event website', 'Dedicated social media shoutout'] },
  { name: 'Inside Back Cover', price: 350, perks: ['Premium inside back cover placement', 'Logo on event website', 'Dedicated social media shoutout', 'Stage mention at event'] },
  { name: 'Gold Page', price: 500, featured: true, perks: ['Gold-tier full-page ad in program book', 'Premium logo on event website', 'Stage announcement at event', 'Feature in email newsletter'] },
  { name: 'Back Page', price: 500, perks: ['Prime back cover placement in program book', 'Premium logo on event website', 'Stage announcement at event', 'Feature in email newsletter'] },
]

const DIWALI_VENDORS = [
  {
    type: 'Food Vendor',
    emoji: '🍛',
    price: 450,
    color: 'border-yellow-300',
    bg: 'bg-yellow-50',
    accent: '#b45309',
    perks: [
      'Dedicated food vendor booth space',
      'Listed in event program as food vendor',
      'Logo on Diwali Mela website listing',
      'Access to power outlet (limited, first-come)',
      'Setup begins 2 hours before event',
    ],
  },
  {
    type: 'Vendor Table',
    emoji: '🛍️',
    price: 150,
    color: 'border-orange-300',
    bg: 'bg-orange-50',
    accent: '#c2410c',
    perks: [
      '6-foot vendor table with 2 chairs',
      'Listed in event program as vendor',
      'Logo on Diwali Mela website listing',
      'Indoor or outdoor placement (TBD)',
      'Setup begins 2 hours before event',
    ],
  },
]

const DANDIYA_VENDORS = [
  {
    type: 'Food Vendor',
    emoji: '🍽️',
    price: 450,
    color: 'border-purple-300',
    bg: 'bg-purple-50',
    accent: '#7e22ce',
    perks: [
      'Dedicated food vendor booth space',
      'Listed in Dandiya Dhamaka program',
      'Logo on event website listing',
      'Access to power outlet (limited)',
      'Setup begins 2 hours before event',
    ],
  },
  {
    type: 'Vendor Table',
    emoji: '💍',
    price: 150,
    color: 'border-pink-300',
    bg: 'bg-pink-50',
    accent: '#be185d',
    perks: [
      '6-foot vendor table with 2 chairs',
      'Listed in Dandiya Dhamaka program',
      'Logo on event website listing',
      'Great visibility during Garba nights',
      'Setup begins 2 hours before event',
    ],
  },
]

function PerkList({ perks }) {
  return (
    <ul className="space-y-2 mt-4">
      {perks.map((p) => (
        <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
          <CHECK />
          {p}
        </li>
      ))}
    </ul>
  )
}

export default function Sponsor() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Sponsorship Packages — Indian Caucus of Secaucus</title>
        <meta name="description" content="Sponsor Indian Caucus of Secaucus events — Diwali Mela ad program, food vendors, and vendor tables for Diwali Mela and Dandiya Dhamaka in Secaucus, NJ." />
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
            Put your brand in front of thousands of engaged community members. Choose from advertising packages, food vendor spots, and vendor tables across our signature events.
          </p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6">

        {/* Stats */}
        <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { icon: '👥', stat: '1,000s', label: 'Community members per event' },
            { icon: '🎉', stat: '3', label: 'Signature festivals per year' },
            { icon: '🤝', stat: '100%', label: 'Nonprofit — tax deductible' },
            { icon: '🌟', stat: '15+', label: 'Years of community trust' },
          ].map((s) => (
            <div key={s.label} className="card card-hover text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-extrabold gradient-text">{s.stat}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── SECTION 1: Diwali Mela Ad Program ── */}
        <section className="mt-20" id="diwali-ad">
          <div className="mb-10">
            <span className="section-label">Diwali Mela</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">🪔 Diwali Mela Ad Program</h2>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Advertise your business in the official Diwali Mela printed event program — distributed to every attendee. Choose the ad size that fits your budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {DIWALI_AD.map((tier) => (
              <div
                key={tier.name}
                className={`card flex flex-col border-2 relative ${tier.featured ? 'border-brand-orange shadow-cta' : 'border-gray-100'}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-orange text-white text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular</span>
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{tier.name}</div>
                <div className="text-3xl font-extrabold text-gray-900">${tier.price}</div>
                <PerkList perks={tier.perks} />
                <Link
                  href="/contact"
                  className={`mt-6 text-sm py-2.5 text-center ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Reserve Spot →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: Diwali Mela Vendors ── */}
        <section className="mt-20" id="diwali-vendor">
          <div className="mb-10">
            <span className="section-label">Diwali Mela</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">🪔 Diwali Mela Vendor Spots</h2>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Sell your food or products at Diwali Mela — one of our most attended events of the year. Spots are limited and fill quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIWALI_VENDORS.map((v) => (
              <div key={v.type} className={`card border-2 ${v.color}`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{v.emoji}</span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider" style={{color: v.accent}}>Diwali Mela</div>
                    <h3 className="text-xl font-extrabold text-gray-900">{v.type}</h3>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-3xl font-extrabold text-gray-900">${v.price}</div>
                    <div className="text-xs text-gray-400">per event</div>
                  </div>
                </div>
                <PerkList perks={v.perks} />
                <Link href="/contact" className="mt-6 btn-primary text-sm py-2.5 text-center block">
                  Apply for Spot →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Dandiya Dhamaka Vendors ── */}
        <section className="mt-20" id="dandiya-vendor">
          <div className="mb-10">
            <span className="section-label">Dandiya Dhamaka</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">💃 Dandiya Dhamaka Vendor Spots</h2>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Reach a vibrant, festive crowd during our Garba & Dandiya nights. Perfect for food vendors, jewelry, clothing, and cultural goods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DANDIYA_VENDORS.map((v) => (
              <div key={v.type} className={`card border-2 ${v.color}`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{v.emoji}</span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider" style={{color: v.accent}}>Dandiya Dhamaka</div>
                    <h3 className="text-xl font-extrabold text-gray-900">{v.type}</h3>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-3xl font-extrabold text-gray-900">${v.price}</div>
                    <div className="text-xs text-gray-400">per event</div>
                  </div>
                </div>
                <PerkList perks={v.perks} />
                <Link href="/contact" className="mt-6 btn-primary text-sm py-2.5 text-center block">
                  Apply for Spot →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 mb-8 rounded-2xl bg-brand-navy text-white p-10 text-center dot-pattern">
          <div className="text-4xl mb-3">🤝</div>
          <h2 className="text-2xl font-extrabold">Questions or custom packages?</h2>
          <p className="mt-3 text-gray-300 max-w-md mx-auto">
            We're happy to work with you on a package that fits your goals. Reach out and we'll get back to you within 48 hours.
          </p>
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
