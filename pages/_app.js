import '../styles/globals.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F26644" />
        <meta property="og:site_name" content="Indian Caucus of Secaucus" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Indian Caucus of Secaucus — Celebrating Indian Culture in NJ" />
        <meta property="og:description" content="A 501(c)(3) nonprofit hosting Holi, Dandiya Dhamaka, and Diwali Mela for the Secaucus, NJ community. Donate today." />
        <meta property="og:image" content="/social-card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Indian Caucus of Secaucus" />
        <meta name="twitter:description" content="Celebrating Indian culture in Secaucus, NJ — Holi, Dandiya, Diwali Mela. 501(c)(3) nonprofit." />
        <meta name="twitter:image" content="/social-card.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
