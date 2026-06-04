import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const VALUES = [
  { icon: '', title: 'Multicultural Pride', desc: 'India is a mosaic of languages, traditions, and peoples. We celebrate all of it.' },
  { icon: '', title: 'Community First', desc: 'Every decision we make puts families and neighbors at the center.' },
  { icon: '', title: 'Generational Impact', desc: 'We invest in children growing up in NJ so they never lose their roots.' },
  { icon: '', title: 'Open Doors', desc: 'Our events welcome everyone — Indian-American families, neighbors, and anyone curious about our culture.' },
  { icon: '', title: 'Living Culture', desc: 'Language, dress, ceremony, art — we keep Indian traditions alive and vibrant.' },
  { icon: '', title: 'Awareness & Education', desc: 'We run awareness camps and cultural programs to foster understanding in the wider community.' },
]

export default function About() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>About — Indian Caucus of Secaucus</title>
        <meta name="description" content="Founded in 2010, the Indian Caucus of Secaucus is a 501(c)(3) nonprofit promoting and preserving Indian culture in New Jersey." />
      </Head>
      <Header />

      {/* Page hero */}
      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <span className="section-label" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Our Story</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
            Rooted in culture.<br />Growing in community.
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl text-lg leading-relaxed">
            Since 2010, we've worked to preserve India's rich heritage for Indian-Americans in Secaucus, NJ — and to share that heritage with everyone around us.
          </p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6">

        {/* Mission */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="section-label">Our Mission</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 leading-tight">Why we exist</h2>
            <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
              <p>
                The Indian Caucus of Secaucus was founded in July 2010 to promote and encourage Indian culture. We exist to preserve, promote, and enhance an understanding of Indian culture, traditions, and values among our children and the broader community.
              </p>
              <p>
                India is a multi-cultural, multi-linguistic society. We recognize the importance of preserving cultural identity — speaking one's own language, wearing traditional dress, and honoring ceremonial traditions for life's special occasions.
              </p>
              <p>
                Our mission is to provide a platform that showcases India's unique cultural heritage through events and awareness programs — fostering a better relationship between people of Indian origin and their neighbors.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card bg-orange-50 border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-xl flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-gray-900">Founded July 2010</h3>
                  <p className="text-sm text-gray-600 mt-1">Over 15 years of serving the Indian-American community in Secaucus and surrounding towns.</p>
                </div>
              </div>
            </div>
            <div className="card bg-green-50 border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-xl flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-gray-900">501(c)(3) Nonprofit</h3>
                  <p className="text-sm text-gray-600 mt-1">We are a registered nonprofit. Your donations are fully tax-deductible and go directly to community programming.</p>
                </div>
              </div>
            </div>
            <div className="card bg-blue-50 border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-gray-900">3 Annual Festivals</h3>
                  <p className="text-sm text-gray-600 mt-1">Holi, Dandiya Dhamaka, and Diwali Mela — all free and open to the full community.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mt-20">
          <div className="text-center mb-10">
            <span className="section-label">What We Stand For</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Our values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="card card-hover">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-900">{v.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 mb-8 rounded-2xl bg-brand-navy text-white p-10 text-center dot-pattern">
          <h2 className="text-3xl font-extrabold">Be part of something meaningful.</h2>
          <p className="mt-3 text-gray-300 max-w-lg mx-auto">Donate to support our events, sponsor a festival, or volunteer your time. Every contribution helps keep Indian culture alive in New Jersey.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary text-base px-8 py-3.5">Donate Now</Link>
            <Link href="/contact" className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-3.5">Get Involved</Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
