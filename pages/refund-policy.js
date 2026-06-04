import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Refund Policy — Indian Caucus of Secaucus</title>
        <meta name="description" content="Refund and event policy for Indian Caucus of Secaucus." />
      </Head>
      <Header />

      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="container-max px-4 md:px-6 py-14 md:py-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Legal</span>
          <h1 className="text-4xl font-extrabold text-white mt-2">Refund Policy</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: June 2025</p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 py-14">
        <div className="max-w-3xl space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">No refunds</h2>
            <p>All payments made to Indian Caucus of Secaucus — including donations, vendor spot fees, sponsorship packages, and event program advertising — are <strong>final and non-refundable</strong>.</p>
            <p className="mt-3">As a registered 501(c)(3) nonprofit, all funds go directly toward community programming and event operations. We are unable to issue refunds once payment has been processed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Rain or shine</h2>
            <p>All Indian Caucus of Secaucus events are held <strong>rain or shine</strong>. Events will not be cancelled or postponed due to weather. Vendor fees and sponsorship payments are not refundable in the event of inclement weather.</p>
            <p className="mt-3">In the rare case that an event must be cancelled entirely by the organization (not due to weather), we will make reasonable efforts to credit or roll over vendor and sponsorship payments to the next event.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Donations</h2>
            <p>Charitable donations are non-refundable. All donations are tax-deductible to the extent permitted by law. You will receive an email receipt upon completing your donation that serves as your tax record.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Vendor and sponsorship spots</h2>
            <p>Vendor table, food vendor, and program advertising payments are non-refundable once submitted. If you need to transfer your spot to another individual or business, please <Link href="/contact" className="text-brand-orange hover:underline">contact us</Link> at least 7 days before the event and we will do our best to accommodate the request.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Questions</h2>
            <p>If you have a question about a specific payment, please <Link href="/contact" className="text-brand-orange hover:underline">contact us</Link> and we will respond within 48 hours.</p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
