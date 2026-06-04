import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Privacy Policy — Indian Caucus of Secaucus</title>
        <meta name="description" content="Privacy Policy for Indian Caucus of Secaucus." />
      </Head>
      <Header />

      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="container-max px-4 md:px-6 py-14 md:py-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Legal</span>
          <h1 className="text-4xl font-extrabold text-white mt-2">Privacy Policy</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: June 2025</p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 py-14">
        <div className="max-w-3xl space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Who we are</h2>
            <p>Indian Caucus of Secaucus is a registered 501(c)(3) nonprofit organization based in Secaucus, New Jersey. This privacy policy explains how we collect, use, and protect information when you visit our website or interact with our organization.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information we collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Email address</strong> — when you subscribe to our newsletter or contact us via the contact form.</li>
              <li><strong>Name and message</strong> — when you submit the contact form.</li>
              <li><strong>Payment information</strong> — processed securely by Stripe. We do not store your card details.</li>
              <li><strong>Basic usage data</strong> — standard server logs (page visits, browser type). No personally identifiable information is collected through analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How we use your information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To send you event announcements and community news (newsletter subscribers only).</li>
              <li>To respond to your contact form inquiries.</li>
              <li>To process donations and issue tax receipts.</li>
              <li>We do not sell, rent, or share your personal information with third parties for marketing purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Third-party services</h2>
            <p>We use the following services to operate our website:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Stripe</strong> — payment processing for donations and event sponsorships.</li>
              <li><strong>Mailchimp / Resend</strong> — email newsletter delivery.</li>
              <li><strong>Vercel</strong> — website hosting.</li>
            </ul>
            <p className="mt-3">Each service operates under its own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Email communications</h2>
            <p>If you subscribe to our newsletter, you will receive occasional emails about upcoming events and community news. You can unsubscribe at any time by clicking the unsubscribe link at the bottom of any email.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data security</h2>
            <p>We take reasonable measures to protect your information. All payment data is handled by Stripe using bank-level encryption. We do not store payment card details on our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p>If you have questions about this privacy policy, please <Link href="/contact" className="text-brand-orange hover:underline">contact us</Link>.</p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
