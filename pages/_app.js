import '../styles/globals.css'
import Head from 'next/head'
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()

  // Register the service worker (offline shell, installability, web push)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      })
    }
  }, [])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return

    posthog.init(key, {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
      loaded: (ph) => ph.capture('$pageview'),
    })

    function onRouteChange() { posthog.capture('$pageview') }
    router.events.on('routeChangeComplete', onRouteChange)
    return () => router.events.off('routeChangeComplete', onRouteChange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SessionProvider session={session}>
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link key="manifest" rel="manifest" href="/manifest.json" />
          <meta key="theme-color" name="theme-color" content="#F26644" />
          {/* PWA / Add to Home Screen (iOS) */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta key="apple-title" name="apple-mobile-web-app-title" content="Indian Caucus" />
          <meta name="keywords" content="Indian Caucus Secaucus, Diwali Mela NJ, Dandiya Dhamaka Secaucus, Holi Festival NJ, Indian culture New Jersey, 501c3 nonprofit Secaucus, Indian events Hudson County" />
          <meta name="author" content="Indian Caucus of Secaucus" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://indiancaucus.org" />
          <meta property="og:site_name" content="Indian Caucus of Secaucus" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://indiancaucus.org" />
          <meta property="og:title" content="Indian Caucus of Secaucus — Celebrating Indian Culture in NJ" />
          <meta property="og:description" content="A 501(c)(3) nonprofit hosting Holi, Dandiya Dhamaka, and Diwali Mela for the Secaucus, NJ community. Free events open to all. Donate today." />
          <meta property="og:image" content="https://indiancaucus.org/social-card.png" />
          <meta property="og:locale" content="en_US" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@IndianCaucusSEC" />
          <meta name="twitter:title" content="Indian Caucus of Secaucus" />
          <meta name="twitter:description" content="Free community festivals celebrating Indian culture in Secaucus, NJ — Holi, Dandiya Dhamaka, Diwali Mela. 501(c)(3) nonprofit." />
          <meta name="twitter:image" content="https://indiancaucus.org/social-card.png" />
        </Head>
        <Component {...pageProps} />
        <Analytics />
      </>
    </SessionProvider>
  )
}
