import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubscribeForm from '../components/SubscribeForm'

const EVENTS = [
  {
    id: 'diwali',
    title: 'Diwali Mela',
    month: 'October 4, 2026',
    color: 'from-yellow-500 to-orange-500',
    accent: '#F5C518',
    confirmed: true,
    description: 'The Festival of Lights at Buchmuller Park, 150 Plaza Center — cultural exhibits, live performances, and a community marketplace. 12–6 PM.',
  },
  {
    id: 'garba',
    title: 'Dandiya Dhamaka',
    month: 'October 24, 2026',
    color: 'from-purple-600 to-pink-500',
    accent: '#9333ea',
    confirmed: true,
    description: 'An electrifying night of Dandiya at Secaucus Recreation Center — traditional Gujarati folk dance, local vendors, cultural performances, and non-stop energy.',
  },
  {
    id: 'holi',
    title: 'Holi — Festival of Colors',
    month: 'Spring — Date TBA',
    color: 'from-pink-500 to-orange-400',
    accent: '#F26644',
    confirmed: false,
    description: 'Celebrate the arrival of spring with vibrant colors, music, and family-friendly fun. One of our most beloved events of the year.',
  },
]

const STATS = [
  { value: '15+', label: 'Years serving the community' },
  { value: '3', label: 'Major festivals per year' },
  { value: '501(c)(3)', label: 'Tax-exempt nonprofit' },
  { value: 'Open', label: 'Community programming' },
]

const IMPACT = [
  { amount: '$25', label: 'Participant token of appreciation' },
  { amount: '$100', label: 'Flyers and marketing' },
  { amount: '$100', label: 'Event logistics' },
  { amount: '$250', label: 'Kids activities' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Indian Caucus of Secaucus — Celebrating Indian Culture in NJ</title>
        <meta name="description" content="Indian Caucus of Secaucus is a 501(c)(3) nonprofit celebrating Indian culture through Holi, Dandiya, and Diwali Mela in Secaucus, NJ. Donate and support our community events." />
      </Head>
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize:'24px 24px'}} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{background:'rgba(242,102,68,0.12)'}} />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{background:'rgba(66,185,126,0.12)'}} />
        </div>

        <div className="container-max px-4 md:px-6 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg md:text-xl font-bold text-white/90 tracking-wide mb-2">
                Indian Caucus of Secaucus
              </p>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>
                 501(c)(3) Nonprofit · Secaucus, NJ · Est. 2010
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Celebrate Culture.<br />
                <span className="gradient-text">Build Community.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-xl">
                We bring thousands together each year for Holi, Dandiya Dhamaka, and Diwali Mela — joyful celebrations of India's rich heritage in the heart of New Jersey.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Your generosity funds every lantern, every performance, every smile.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/donate" className="btn-primary text-base px-8 py-3.5">
                  Donate Today
                </Link>
                <Link href="/events" className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-3.5">
                  See Our Events
                </Link>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="badge-tax" style={{background:'rgba(66,185,126,0.2)', color:'#5eefaa'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  501(c)(3) — Donations are tax deductible
                </span>
              </div>
            </div>

            {/* Subscribe card */}
            <div className="rounded-2xl p-6 border border-white/10" style={{background:'rgba(15,32,68,0.75)'}}>
              <h3 className="font-bold text-white text-lg mb-1">Stay in the loop</h3>
              <p className="text-sm text-gray-300 mb-5">
                Get event announcements, volunteer opportunities, and community news — straight to your inbox.
              </p>
              <SubscribeForm dark />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-max px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map((s) => (
              <div key={s.label} className="py-7 px-6 text-center">
                <div className="text-2xl md:text-3xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="container-max px-4 md:px-6">

        {/* ── EVENTS ── */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <span className="section-label">Our Festivals</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Three Celebrations. One Community.</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Every event is open to all — because culture belongs to everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EVENTS.map((ev) => (
              <article key={ev.id} id={ev.id} className="card card-hover flex flex-col overflow-hidden p-0">
                <div className={`h-2 bg-gradient-to-r ${ev.color}`} />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-3xl mb-3">{ev.emoji}</span>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color: ev.accent}}>{ev.month}</div>
                  <h3 className="font-bold text-lg text-gray-900">{ev.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{ev.description}</p>
                  <div className="mt-5 flex gap-2">
                    <Link href="/donate" className="btn-primary text-xs px-4 py-2">Donate</Link>
                    <Link href={`/events#${ev.id}`} className="btn-outline border-gray-200 text-gray-700 hover:bg-gray-50 text-xs px-4 py-2">Details →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── PARTICIPATE ── */}
        <section className="mt-16">
          <div className="rounded-3xl overflow-hidden" style={{background:'linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)'}}>
            <div className="relative px-8 py-12 md:px-14 md:py-14" style={{backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize:'24px 24px'}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(255,255,255,0.2)', color:'#fef3c7'}}>
                     Diwali Mela 2026
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Perform at<br />Diwali Mela!
                  </h2>
                  <p className="mt-4 text-amber-100 leading-relaxed max-w-md">
                    Are you a dancer, singer, musician, or artist? We'd love to have you perform at our Diwali Mela. Fill out the performer sign-up form and we'll be in touch.
                  </p>
                  <a
                    href="https://forms.cloud.microsoft/r/TrUMvCLMTb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all"
                    style={{background:'#fff', color:'#b45309', boxShadow:'0 4px 24px rgba(0,0,0,0.2)'}}
                  >
                    Performer Sign-Up Form →
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: '', label: 'Singers & Vocalists' },
                    { icon: '', label: 'Dancers & Dance Groups' },
                    { icon: '', label: 'Musicians & Bands' },
                    { icon: '', label: 'Cultural Performers' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
                      style={{background:'rgba(255,255,255,0.15)'}}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
              Preserving heritage.<br />Building bridges.
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Founded in 2010, the Indian Caucus of Secaucus exists to preserve and promote India's multicultural heritage — its languages, traditions, ceremonies, and art — for generations growing up in New Jersey.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We create a space where Indian-American families feel seen, celebrated, and connected — while welcoming everyone who wants to learn and share in the joy of Indian culture.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/about" className="btn-secondary text-sm px-6 py-3">Our Story</Link>
              <Link href="/contact" className="btn-outline border-gray-200 text-gray-700 hover:bg-gray-50 text-sm px-6 py-3">Volunteer →</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26644" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                title: 'Cultural Heritage',
                desc: 'Honoring the languages, dress, and ceremonies of India across all regions.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26644" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                title: 'Family-Centered',
                desc: 'Events designed to connect generations and create lasting memories.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26644" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                title: 'Inclusive Community',
                desc: 'All backgrounds welcome — our festivals belong to all of Secaucus.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26644" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
                title: 'Youth Outreach',
                desc: 'Investing in the next generation through cultural education and programs.',
              },
            ].map((v) => (
              <div key={v.title} className="card card-hover">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:'rgba(242,102,68,0.08)'}}>
                  {v.icon}
                </div>
                <h4 className="font-bold text-sm text-gray-900">{v.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DONATE CTA ── */}
        <section className="mt-24 rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, #0F2044 0%, #1a3a6e 50%, #2e5d4b 100%)'}}>
          <div className="relative dot-pattern px-8 py-14 md:px-14 md:py-16">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start relative">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>
                  Make an Impact
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Every dollar keeps the celebration alive.
                </h2>
                <p className="mt-4 text-gray-300 leading-relaxed max-w-md">
                  Our events are made possible by donors like you. As a 501(c)(3) nonprofit, your gift is tax-deductible — and 100% goes to community programming.
                </p>
                <Link href="/donate" className="mt-7 btn-primary inline-block text-base px-8 py-3.5">
                  Donate Now →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {IMPACT.map((item) => (
                  <div key={item.amount} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
                    <div className="font-extrabold text-xl gradient-text flex-shrink-0 w-14">{item.amount}</div>
                    <p className="text-sm text-gray-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SPONSOR ── */}
        <section className="mt-24 mb-8 text-center">
          <span className="section-label">For Businesses</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Become a Community Sponsor</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Put your brand in front of thousands of engaged community members. Sponsorship packages include logo placement, event shoutouts, and complimentary passes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/sponsor" className="btn-secondary text-base px-8 py-3.5">See Sponsorship Tiers</Link>
            <Link href="/contact" className="btn-outline border-gray-200 text-gray-700 hover:bg-gray-50 text-base px-8 py-3.5">Contact Us</Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
