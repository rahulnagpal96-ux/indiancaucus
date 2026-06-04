import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function UpdateContact() {
  const { query } = useRouter()
  const email = query.e || ''
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle')

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/update-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    })
    setStatus(res.ok ? 'done' : 'error')
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Stay Connected — Indian Caucus of Secaucus</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />

      <main className="container-max px-4 md:px-6 py-20 flex flex-col items-center text-center">
        {status === 'done' ? (
          <div className="max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" className="text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">You're all set!</h1>
            <p className="text-gray-500 text-sm">
              We've saved your phone number. You'll receive SMS updates about upcoming events from Indian Caucus of Secaucus.
            </p>
          </div>
        ) : (
          <div className="max-w-md w-full">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}
            >
              <svg width="28" height="28" className="text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Get SMS updates</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Add your phone number to receive text alerts about event dates, ticket releases, and last-minute announcements from Indian Caucus of Secaucus.
            </p>

            {!email ? (
              <p className="text-red-500 text-sm">Invalid link. Please use the link from your email.</p>
            ) : (
              <form onSubmit={submit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mobile number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (201) 555-0100"
                    required
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-xs">Something went wrong. Please try again or email <a href="mailto:info@indiancaucus.org" className="underline">info@indiancaucus.org</a>.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full text-white font-bold py-3.5 rounded-2xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}
                >
                  {status === 'loading' ? 'Saving…' : 'Save my number'}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  We will never share your number. Text INFO to opt out at any time.
                </p>
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
