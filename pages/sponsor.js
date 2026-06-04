import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CHECK = ({ color = '#42B97E' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const DIWALI_AD = [
  { name: 'Inside Half Page', price: 150, stripeUrl: 'https://donate.stripe.com/5kAbJO4V9bkJ9wIeV0', soldOut: false, perks: ['Half-page ad in Diwali Mela program book', 'Name listed on event website', 'Social media thank-you post'] },
  { name: 'Inside Full Page', price: 250, stripeUrl: 'https://donate.stripe.com/3cs15a87lfAZ5gs6ot', soldOut: false, perks: ['Full-page ad in Diwali Mela program book', 'Logo on event website', 'Dedicated social media shoutout'] },
  { name: 'Inside Back Cover', price: 350, stripeUrl: 'https://donate.stripe.com/fZe29eevJagFbEQ148', soldOut: false, perks: ['Premium inside back cover placement', 'Logo on event website', 'Dedicated social media shoutout', 'Stage mention at event'] },
  { name: 'Silver Page', price: 300, stripeUrl: 'https://donate.stripe.com/8wMcNSevJ88xeR26or', soldOut: false, perks: ['Silver-tier full-page ad in program', 'Logo on event website', 'Dedicated social media shoutout', 'Stage mention at event'] },
  { name: 'Gold Page', price: 500, stripeUrl: 'https://donate.stripe.com/14kaFKevJ4WlbEQ8wy', soldOut: false, featured: true, perks: ['Gold-tier full-page ad in program', 'Premium logo on event website', 'Stage announcement at event', 'Feature in email newsletter'] },
  { name: 'Back Page', price: 500, stripeUrl: null, soldOut: true, perks: ['Prime back cover of program book', 'Premium logo on event website', 'Stage announcement at event', 'Feature in email newsletter'] },
  { name: 'Logo in Diwali Flyer', price: null, displayPrice: 'Donation', stripeUrl: 'https://buy.stripe.com/5kQ4gzfHC3XQaOa3zI8bS0n', soldOut: false, perks: ['Your logo featured on the official Diwali Mela event flyer', 'Distributed digitally and in print', 'Community-wide visibility before the event', 'Tax-deductible donation'] },
]

const DIWALI_VENDORS = [
  {
    type: 'Food Vendor',
    emoji: '',
    price: 450,
    stripeUrl: 'https://donate.stripe.com/28o3dievJ2Od4co9AL',
    perks: [
      'Dedicated food vendor booth space',
      'Access to power outlet (limited, first-come)',
      'Setup begins 2 hours before event',
    ],
  },
  {
    type: 'Vendor Table',
    emoji: '️',
    price: 150,
    stripeUrl: 'https://donate.stripe.com/14AdR93YUgKC9K6fiq8bS0p',
    perks: [
      '6-foot vendor table with 2 chairs',
      'Indoor or outdoor placement (TBD)',
      'Setup begins 2 hours before event',
    ],
  },
  {
    type: 'Nonprofit Vendor Table',
    emoji: '️',
    price: null,
    stripeUrl: 'https://donate.stripe.com/7sI7ty3R588xdMYcMZ',
    perks: [
      'Special rate for registered nonprofits',
      '6-foot vendor table with 2 chairs',
      'Contact us to confirm eligibility',
    ],
  },
]

const DANDIYA_VENDORS = [
  {
    type: 'Food Vendor',
    emoji: '️',
    price: 450,
    stripeUrl: 'https://donate.stripe.com/cN215afzN4Wl7oAaEX',
    perks: [
      'Dedicated food vendor booth space',
      'Access to power outlet (limited)',
      'Setup begins 2 hours before event',
    ],
  },
  {
    type: 'Vendor Table',
    emoji: '',
    price: 150,
    stripeUrl: 'https://donate.stripe.com/14k4hm3R53ShgZafZg',
    perks: [
      '6-foot vendor table with 2 chairs',
      'Great visibility during Dandiya Dhamaka night',
      'Setup begins 2 hours before event',
    ],
  },
]

export default function Sponsor() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Sponsorship Packages — Indian Caucus of Secaucus</title>
        <meta name="description" content="Sponsor Indian Caucus of Secaucus events — Diwali Mela ad program, food vendors, and vendor tables for Diwali Mela and Dandiya Dhamaka in Secaucus, NJ." />
      </Head>
      <Header />

      {/* ── HERO ── */}
      <section style={{background: 'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
          <div className="container-max px-4 md:px-6 py-16 md:py-24">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(242,102,68,0.25)', color:'#FF9933'}}>
              For Businesses
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 leading-tight">
              Sponsor a festival.<br />
              <span style={{background:'linear-gradient(135deg,#FF9933,#F26644)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                Own the spotlight.
              </span>
            </h1>
            <p className="mt-5 text-gray-300 max-w-2xl text-lg leading-relaxed">
              Put your brand in front of thousands of engaged community members at Diwali Mela and Dandiya Dhamaka. Choose from program ads, food vendor spots, and vendor tables.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#diwali-ad" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all" style={{background:'linear-gradient(135deg,#F26644,#d94e2e)', boxShadow:'0 4px 24px rgba(242,102,68,0.35)'}}>
                 Diwali Mela Ad Program
              </a>
              <a href="#diwali-vendor" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm border border-white/20 hover:bg-white/10 transition-all">
                ️ Vendor Spots
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-max px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: '', stat: '1,000s', label: 'Community members per event' },
              { icon: '', stat: '3', label: 'Signature festivals per year' },
              { icon: '', stat: '100%', label: 'Nonprofit — tax deductible' },
              { icon: '', stat: '15+', label: 'Years of community trust' },
            ].map((s) => (
              <div key={s.label} className="py-7 px-6 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-extrabold" style={{background:'linear-gradient(135deg,#FF9933,#F26644)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>{s.stat}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIWALI MELA AD PROGRAM ── */}
      <section id="diwali-ad" style={{background: 'linear-gradient(180deg, #fffbeb 0%, #fff8e1 100%)'}}>
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl"></span>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{background:'rgba(245,197,24,0.2)', color:'#b45309'}}>Diwali Mela</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Diwali Mela Ad Program</h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Advertise in the official Diwali Mela printed program book — distributed to every attendee. Pick the placement that fits your budget.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIWALI_AD.map((tier) => (
              <div
                key={tier.name}
                className="relative bg-white rounded-2xl p-6 flex flex-col"
                style={{
                  border: tier.featured ? '2px solid #F26644' : tier.soldOut ? '1px solid #e5e7eb' : '1px solid #e5e7eb',
                  boxShadow: tier.featured ? '0 8px 32px rgba(242,102,68,0.18)' : '0 1px 4px rgba(0,0,0,0.07)',
                  opacity: tier.soldOut ? 0.7 : 1,
                }}
              >
                {tier.featured && !tier.soldOut && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-white text-xs font-bold px-4 py-1 rounded-full shadow" style={{background:'linear-gradient(135deg,#F26644,#d94e2e)'}}>
                      Most Popular
                    </span>
                  </div>
                )}
                {tier.soldOut && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-white text-xs font-bold px-4 py-1 rounded-full shadow" style={{background:'#6b7280'}}>
                      Sold Out
                    </span>
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">{tier.name}</div>
                <div className="text-4xl font-extrabold text-gray-900">{tier.displayPrice ? tier.displayPrice : `$${tier.price}`}</div>
                <ul className="mt-4 space-y-2.5 flex-1">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                      <CHECK color={tier.soldOut ? '#9ca3af' : '#d97706'} />
                      {p}
                    </li>
                  ))}
                </ul>
                {tier.soldOut ? (
                  <div className="mt-6 block text-center text-sm font-semibold py-3 rounded-xl bg-gray-100 text-gray-400">
                    Sold Out
                  </div>
                ) : tier.stripeUrl ? (
                  <a
                    href={tier.stripeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block text-center text-sm font-semibold py-3 rounded-xl transition-all"
                    style={tier.featured
                      ? {background:'linear-gradient(135deg,#F26644,#d94e2e)', color:'#fff', boxShadow:'0 4px 16px rgba(242,102,68,0.3)'}
                      : {background:'#fffbeb', color:'#b45309', border:'1px solid #fcd34d'}
                    }
                  >
                    Reserve & Pay Now →
                  </a>
                ) : (
                  <Link href="/contact" className="mt-6 block text-center text-sm font-semibold py-3 rounded-xl" style={{background:'#fffbeb', color:'#b45309', border:'1px solid #fcd34d'}}>
                    Contact Us →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIWALI MELA VENDOR SPOTS ── */}
      <section id="diwali-vendor" style={{background: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)'}}>
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl"></span>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{background:'rgba(242,102,68,0.15)', color:'#c2410c'}}>Diwali Mela</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Diwali Mela Vendor Spots</h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Sell your food or products at Diwali Mela — one of our most attended events. Spots are limited and fill quickly.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIWALI_VENDORS.map((v) => (
              <div key={v.type} className="bg-white rounded-2xl p-7 flex flex-col" style={{border:'1px solid #fed7aa', boxShadow:'0 2px 16px rgba(194,65,12,0.08)'}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{background:'#fff7ed'}}>
                      {v.emoji}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-orange-600">Diwali Mela</div>
                      <h3 className="text-xl font-extrabold text-gray-900">{v.type}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    {v.price ? (
                      <>
                        <div className="text-4xl font-extrabold text-gray-900">${v.price}</div>
                        <div className="text-xs text-gray-400">per event</div>
                      </>
                    ) : (
                      <div className="text-sm font-bold text-orange-600">Contact for rate</div>
                    )}
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {v.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                      <CHECK color="#ea580c" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a href={v.stripeUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block text-center text-sm font-semibold py-3 rounded-xl text-white transition-all" style={{background:'linear-gradient(135deg,#F26644,#d94e2e)', boxShadow:'0 4px 16px rgba(242,102,68,0.3)'}}>
                  Reserve & Pay Now →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DANDIYA DHAMAKA VENDOR SPOTS ── */}
      <section id="dandiya-vendor" style={{background: 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)'}}>
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl"></span>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{background:'rgba(147,51,234,0.12)', color:'#7e22ce'}}>Dandiya Dhamaka</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Dandiya Dhamaka Vendor Spots</h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Reach a vibrant, festive crowd during our Dandiya Dhamaka night. Perfect for food vendors, jewelry, clothing, and cultural goods.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {DANDIYA_VENDORS.map((v) => (
              <div key={v.type} className="bg-white rounded-2xl p-7 flex flex-col" style={{border:'1px solid #e9d5ff', boxShadow:'0 2px 16px rgba(126,34,206,0.08)'}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{background:'#faf5ff'}}>
                      {v.emoji}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-700">Dandiya Dhamaka</div>
                      <h3 className="text-xl font-extrabold text-gray-900">{v.type}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-extrabold text-gray-900">${v.price}</div>
                    <div className="text-xs text-gray-400">per event</div>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {v.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                      <CHECK color="#9333ea" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a href={v.stripeUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block text-center text-sm font-semibold py-3 rounded-xl text-white transition-all" style={{background:'linear-gradient(135deg,#9333ea,#7e22ce)', boxShadow:'0 4px 16px rgba(147,51,234,0.3)'}}>
                  Reserve & Pay Now →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white">
        <div className="container-max px-4 md:px-6 py-16">
          <div className="rounded-3xl p-10 md:p-14 text-center" style={{background:'linear-gradient(135deg,#0F2044 0%,#1a3a6e 50%,#2e5d4b 100%)', backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize:'24px 24px'}}>
            <div className="text-4xl mb-4"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Questions or custom packages?</h2>
            <p className="mt-3 text-gray-300 max-w-md mx-auto">
              We're happy to work with you on a package that fits your goals. We'll get back to you within 48 hours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all" style={{background:'linear-gradient(135deg,#F26644,#d94e2e)', boxShadow:'0 4px 24px rgba(242,102,68,0.35)'}}>
                Contact Us
              </Link>
              <Link href="/donate" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-white text-base border border-white/30 hover:bg-white/10 transition-all">
                Donate Instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
