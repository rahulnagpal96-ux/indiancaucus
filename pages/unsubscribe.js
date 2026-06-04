import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Unsubscribe() {
  const { query } = useRouter()
  const email = query.e || ''
  const [status, setStatus] = useState('idle')

  async function confirm() {
    setStatus('loading')
    const res = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      setStatus('done')
      setTimeout(() => router.push('/'), 3000)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Unsubscribe — Indian Caucus of Secaucus</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />

      <main className="container-max px-4 md:px-6 py-24 flex flex-col items-center text-center">
        {status === 'done' ? (
          <>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" className="text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">You've been unsubscribed</h1>
            <p className="text-gray-500 text-sm max-w-sm">
              <strong>{email}</strong> has been removed from our mailing list. You won't receive any further emails from us.
            </p>
            <p className="text-gray-400 text-xs mt-4">Redirecting you to our homepage in a moment…</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <svg width="22" height="22" className="text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Unsubscribe</h1>
            {email ? (
              <>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">
                  Click below to remove <strong>{email}</strong> from the Indian Caucus of Secaucus mailing list.
                </p>
                {status === 'error' && (
                  <p className="text-red-500 text-sm mb-4">Something went wrong. Please try again or email <a href="mailto:info@indiancaucus.org" className="underline">info@indiancaucus.org</a>.</p>
                )}
                <button
                  onClick={confirm}
                  disabled={status === 'loading'}
                  className="bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Unsubscribing…' : 'Confirm unsubscribe'}
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-sm max-w-sm">
                Invalid unsubscribe link. To be removed from our list, email us at <a href="mailto:info@indiancaucus.org" className="text-brand-green underline">info@indiancaucus.org</a>.
              </p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
