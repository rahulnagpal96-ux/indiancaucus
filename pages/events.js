import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const EVENTS = [
  {
    id: 'diwali',
    title: 'Diwali Mela',
    month: 'October',
    date: 'October 4, 2025',
    time: '12:00 PM – 6:00 PM',
    location: 'Buchmuller Park, 150 Plaza Center, Secaucus, NJ 07094',
    colorClass: 'from-yellow-400 to-orange-500',
    accentColor: '#F5C518',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-100',
    confirmed: true,
    description: 'The Festival of Lights celebrated in grand style. Our Diwali Mela features cultural exhibits, live performances, a vibrant marketplace, rangoli competitions, and more — a true celebration of India\'s most beloved festival.',
    highlights: ['Live performances & shows', 'Community marketplace', 'Rangoli competition'],
  },
  {
    id: 'garba',
    title: 'Dandiya Dhamaka',
    month: 'October',
    date: 'October 24, 2025',
    time: null,
    location: 'Secaucus Recreation Center, 1200 Koelle Blvd, Secaucus, NJ 07094',
    colorClass: 'from-purple-600 to-pink-500',
    accentColor: '#9333ea',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-100',
    confirmed: true,
    admission: 'Ticketed Event',
    description: 'An electrifying night of Dandiya — traditional Gujarati folk dance performed during the Navratri festival. Come dressed in traditional attire, bring your dandiya sticks, and dance the night away.',
    highlights: ['Live Dandiya Night', 'Local vendors & artisans', 'Cultural performances', 'Traditional food stalls'],
  },
  {
    id: 'holi',
    title: 'Holi — Festival of Colors',
    month: 'Spring',
    date: null,
    time: null,
    location: 'Secaucus, NJ',
    colorClass: 'from-pink-500 to-orange-400',
    accentColor: '#F26644',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
    confirmed: false,
    description: 'One of India\'s most joyful celebrations, Holi marks the arrival of spring with vibrant colored powders, music, dancing, and delicious food. Our annual Holi event is family-friendly and open to all.',
    highlights: ['Color powder play area', 'Live music & DJ', 'Traditional food & sweets', 'Games for kids'],
  },
]

export default function Events() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Events — Indian Caucus of Secaucus</title>
        <meta name="description" content="Join Indian Caucus of Secaucus for Holi, Dandiya Dhamaka, and Diwali Mela — community festivals celebrating Indian culture in NJ." />
      </Head>
      <Header />

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <span className="section-label" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Events Calendar</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
            Three festivals.<br />Infinite memories.
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl text-lg leading-relaxed">
            Every year we host three signature events that bring the Secaucus community together.
          </p>
          <div className="mt-5">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{background:'rgba(66,185,126,0.2)', color:'#5eefaa'}}>
               Stay tuned for 2026 event dates!
            </span>
          </div>
        </div>
      </section>

      <main className="container-max px-4 md:px-6">
        <div className="mt-16 space-y-10">
          {EVENTS.map((ev, i) => (
            <article id={ev.id} key={ev.id} className={`card overflow-hidden p-0 border ${ev.borderClass}`}>
              <div className={`h-1.5 bg-gradient-to-r ${ev.colorClass}`} />
              <div className="p-7 md:p-9">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {/* Main info */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{ev.emoji}</span>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{color: ev.accentColor}}>{ev.month}</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">{ev.title}</h2>
                    <p className="mt-3 text-gray-600 leading-relaxed">{ev.description}</p>

                    <div className="mt-5">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">What to expect:</h4>
                      <ul className="grid grid-cols-2 gap-1.5">
                        {ev.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#42B97E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={ev.id === 'diwali' ? '/sponsor#diwali-ad' : ev.id === 'garba' ? '/sponsor#dandiya-vendor' : '/donate'}
                        className="btn-primary text-sm px-6 py-2.5"
                      >
                        Support this event
                      </Link>
                      <a href={process.env.NEXT_PUBLIC_RSVP_FORM || '/contact'} target="_blank" rel="noopener noreferrer" className="btn-outline border-gray-200 text-gray-700 hover:bg-gray-50 text-sm px-6 py-2.5">
                        RSVP / Volunteer
                      </a>
                    </div>
                  </div>

                  {/* Side info */}
                  <div className={`rounded-xl p-5 ${ev.bgClass} border ${ev.borderClass}`}>
                    <h4 className="font-bold text-gray-900 text-sm mb-3">Event details</h4>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-gray-500 text-xs uppercase tracking-wide">Date</dt>
                        <dd className="font-semibold text-gray-900 mt-0.5">
                          {ev.date ? ev.date : <span className="text-gray-400">Date coming soon</span>}
                        </dd>
                      </div>
                      {ev.time && (
                        <div>
                          <dt className="text-gray-500 text-xs uppercase tracking-wide">Time</dt>
                          <dd className="font-medium text-gray-900 mt-0.5">{ev.time}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-gray-500 text-xs uppercase tracking-wide">Location</dt>
                        <dd className="font-medium text-gray-900 mt-0.5">{ev.location}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 text-xs uppercase tracking-wide">Admission</dt>
                        <dd className="font-semibold mt-0.5" style={{color: ev.admission ? '#e85d04' : '#42B97E'}}>
                          {ev.admission ?? 'Open to All'}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      {ev.confirmed
                        ? <p className="text-xs font-semibold" style={{color:'#42B97E'}}>Date confirmed — mark your calendar!</p>
                        : <p className="text-xs text-gray-500">Follow us on social media for date announcements.</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Past events note */}
        <div className="mt-14 mb-8 rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center">
          <div className="text-3xl mb-3"></div>
          <h3 className="font-bold text-gray-900 text-lg">See past event photos</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">Relive the colors and joy from our previous celebrations in our gallery and on Facebook.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/gallery" className="btn-secondary text-sm px-6 py-2.5">View Gallery</Link>
            {process.env.NEXT_PUBLIC_FACEBOOK && (
              <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" rel="noopener noreferrer" className="btn-outline border-gray-200 text-gray-700 hover:bg-white text-sm px-6 py-2.5">
                Facebook Albums →
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
