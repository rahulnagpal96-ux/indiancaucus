import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  // Honeypot field — bots fill it, real users never see it. Kept out of `form`
  // so a normal reset doesn't touch it.
  const [website, setWebsite] = useState('')
  // Timestamp the form was rendered, used as a timing trap against bots that
  // submit instantly. Set once on first render.
  const [loadedAt] = useState(() => Date.now())

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website, elapsed: Date.now() - loadedAt }),
      })
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Contact — Indian Caucus of Secaucus</title>
        <meta name="description" content="Get in touch with Indian Caucus of Secaucus — for event inquiries, sponsorships, volunteering, or general questions." />
      </Head>
      <Header />

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <span className="section-label" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
            We'd love to hear from you.
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl text-lg">
            Sponsorship inquiries, volunteer sign-ups, event questions — we're here and happy to help.
          </p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#42B97E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Message sent!</h3>
                  <p className="text-gray-500 mt-2">We'll get back to you as soon as we can. Thank you for reaching out.</p>
                  <button onClick={() => setStatus('')} className="mt-5 btn-secondary text-sm px-6 py-2.5">Send another message</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  {/* Honeypot — hidden from real users; bots that auto-fill
                      every field will populate this and get silently dropped. */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Name *</label>
                      <input
                        className="input-field"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email *</label>
                      <input
                        type="email"
                        className="input-field"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Subject</label>
                    <select
                      className="input-field bg-white"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a topic…</option>
                      <option value="general">General Inquiry</option>
                      <option value="volunteer">Volunteer Sign-Up</option>
                      <option value="sponsorship">Sponsorship Inquiry</option>
                      <option value="event">Event Question</option>
                      <option value="donation">Donation / Tax Receipt</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Message *</label>
                    <textarea
                      className="input-field resize-none"
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary text-sm px-8 py-3 disabled:opacity-60"
                    >
                      {status === 'loading' ? 'Sending…' : 'Send Message →'}
                    </button>
                    {status === 'error' && (
                      <span className="text-sm text-red-600">Failed to send. Please try again.</span>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Contact info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26644" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</div>
                    <div className="text-sm text-gray-700 mt-0.5">Secaucus, NJ & surrounding communities</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#42B97E" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</div>
                    <div className="text-sm text-gray-700 mt-0.5">Use the form — we respond within 48 hours.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z"/></svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facebook</div>
                    <a href="http://www.facebook.com/indiancaucusofsecaucus" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-green hover:text-brand-green-dark mt-0.5 block">@IndianCaucusofSecaucus →</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26644" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Instagram</div>
                    <a href="http://www.instagram.com/indiancaucus" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-green hover:text-brand-green-dark mt-0.5 block">@indiancaucus →</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card overflow-hidden p-0">
              <iframe
                title="Secaucus NJ map"
                src="https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1sSECAUCUS+NJ!5e0!6i12"
                className="w-full h-48 border-0"
                loading="lazy"
                allowFullScreen
              />
              <div className="px-5 py-3 text-xs text-gray-500">Secaucus, New Jersey</div>
            </div>

            {/* Quick links */}
            <div className="card bg-orange-50 border-orange-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Helpful links</h3>
              <div className="space-y-2">
                {[
                  { href: '/donate', label: '→ Make a donation' },
                  { href: '/sponsor', label: '→ Sponsorship packages' },
                  { href: '/events', label: '→ Upcoming events' },
                  { href: '/about', label: '→ Learn about us' },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="block text-sm text-brand-orange hover:text-brand-orange-dark transition-colors font-medium">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
