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
          <p className="mt-3 text-gray-400 text-sm">Last updated: June 5, 2026</p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 py-14">
        <div className="max-w-3xl space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who we are</h2>
            <p>Indian Caucus of Secaucus ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>") is a registered 501(c)(3) nonprofit organization based in Secaucus, New Jersey, EIN on file with the IRS. This Privacy Policy describes how we collect, use, disclose, and protect personal information when you visit <strong>indiancaucus.org</strong>, subscribe to our communications, make a donation, attend our events, or otherwise interact with us.</p>
            <p className="mt-3">By using our website or providing your information, you agree to the practices described in this policy. If you do not agree, please do not use our website or services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information we collect</h2>

            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Information you provide directly</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Name and email address</strong> — when you subscribe to our newsletter, contact us, or register for an event.</li>
              <li><strong>Phone number</strong> — when you optionally provide it through our phone collection campaigns or event registration. By providing your phone number, you expressly consent to receive informational text messages (SMS) and phone calls from Indian Caucus of Secaucus. Message and data rates may apply. You may opt out at any time by replying STOP to any text message or contacting us at the address below.</li>
              <li><strong>Payment information</strong> — when you make a donation or pay for an event sponsorship or vendor spot. All payment transactions are processed by <strong>Stripe, Inc.</strong> using PCI DSS-compliant encryption. We do not store, transmit, or have access to your full card number, CVV, or bank account details. In-person card transactions at our events are also processed through Stripe.</li>
              <li><strong>Message content</strong> — when you submit our contact form.</li>
              <li><strong>Event registration details</strong> — name, contact information, and any other information you voluntarily submit when registering for our events.</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Information collected automatically</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Usage data</strong> — pages visited, time on site, referring URL, browser type, device type, and operating system, collected via server logs and analytics tools.</li>
              <li><strong>Cookies and similar technologies</strong> — we use session cookies required for site functionality. We also use <strong>PostHog</strong> and <strong>Vercel Analytics</strong> for aggregate, anonymized usage insights. You can disable cookies in your browser settings; doing so may affect certain site functionality.</li>
              <li><strong>IP address</strong> — collected automatically by our hosting provider (Vercel) for security and performance purposes and is not linked to your identity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How we use your information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To send you our newsletter and event announcements (email subscribers only). Every email includes an unsubscribe link as required by the <strong>CAN-SPAM Act</strong>. You may also unsubscribe at any time at <Link href="/unsubscribe" className="text-brand-orange hover:underline">indiancaucus.org/unsubscribe</Link>.</li>
              <li>To send SMS/text messages and make phone calls to individuals who have provided express written consent to receive such communications from us, as required by the <strong>Telephone Consumer Protection Act (TCPA)</strong>.</li>
              <li>To process donations and issue tax-deductible receipts as required for 501(c)(3) organizations.</li>
              <li>To respond to contact form inquiries and support requests.</li>
              <li>To administer events and communicate event-related information to registered participants.</li>
              <li>To improve our website and understand how visitors use it.</li>
              <li>To comply with legal obligations, including New Jersey data breach notification requirements under the <strong>New Jersey Identity Theft Prevention Act (N.J.S.A. 56:8-163)</strong>.</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell, rent, lease, or share your personal information with third parties for their own marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Legal basis for processing (GDPR)</h2>
            <p>For visitors from the European Economic Area or United Kingdom, our legal bases for processing personal data are:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Consent</strong> — for newsletter subscriptions, SMS communications, and non-essential cookies.</li>
              <li><strong>Contractual necessity</strong> — to process donations and event registrations.</li>
              <li><strong>Legitimate interests</strong> — for website security, fraud prevention, and improving our services, where such interests are not overridden by your rights.</li>
              <li><strong>Legal obligation</strong> — where required by applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. SMS and telephone communications (TCPA)</h2>
            <p>By providing your phone number and expressly opting in, you consent to receive recurring informational text messages (SMS/MMS) and/or phone calls from Indian Caucus of Secaucus regarding community events, announcements, and organizational updates.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Opt-out:</strong> Reply <strong>STOP</strong> to any text message to unsubscribe. You will receive a one-time confirmation and will receive no further messages.</li>
              <li><strong>Help:</strong> Reply <strong>HELP</strong> or contact us at the address below for assistance.</li>
              <li><strong>Message frequency:</strong> Varies. We send messages only when there is relevant community information to share.</li>
              <li><strong>Message and data rates</strong> may apply depending on your carrier plan.</li>
              <li>Phone communications are conducted using <strong>Telnyx</strong> as our telephony provider. Telnyx operates under its own privacy policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-party service providers</h2>
            <p>We share personal information only with service providers necessary to operate our organization:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 border border-gray-200 font-semibold text-gray-800">Provider</th>
                    <th className="text-left px-4 py-2 border border-gray-200 font-semibold text-gray-800">Purpose</th>
                    <th className="text-left px-4 py-2 border border-gray-200 font-semibold text-gray-800">Data shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Stripe', 'Payment processing (online & in-person)', 'Name, email, payment card data (PCI DSS compliant)'],
                    ['Resend', 'Email delivery & newsletter broadcasts', 'Name, email address'],
                    ['Telnyx', 'SMS & phone communications', 'Phone number, call/message content'],
                    ['Vercel', 'Website hosting & infrastructure', 'IP address, usage data'],
                    ['Vercel Postgres (Neon)', 'Subscriber & donation database', 'Name, email, phone (encrypted at rest)'],
                    ['PostHog', 'Anonymized usage analytics', 'Anonymized usage events, no PII'],
                  ].map(([provider, purpose, data]) => (
                    <tr key={provider} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-200 font-medium">{provider}</td>
                      <td className="px-4 py-2 border border-gray-200">{purpose}</td>
                      <td className="px-4 py-2 border border-gray-200 text-gray-500">{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">Each provider operates under its own privacy policy and data processing agreements. We do not authorize any provider to use your data for their own marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data retention</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Newsletter subscribers:</strong> Retained until you unsubscribe, after which your record is marked inactive. You may request complete deletion at any time.</li>
              <li><strong>Donation records:</strong> Retained for a minimum of 7 years as required for nonprofit tax records under IRS guidelines and New Jersey law.</li>
              <li><strong>Contact form submissions:</strong> Retained for up to 2 years.</li>
              <li><strong>Payment processing records:</strong> Stripe retains transaction records per their data retention policy and applicable financial regulations.</li>
              <li><strong>Website analytics:</strong> Anonymized usage data is retained for up to 24 months.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data, subject to our legal retention obligations.</li>
              <li><strong>Opt-out of communications:</strong> Unsubscribe from emails via the link in any email, or from SMS by replying STOP.</li>
              <li><strong>Data portability (GDPR):</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Restriction / objection (GDPR):</strong> Object to or restrict certain processing of your data.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please <Link href="/contact" className="text-brand-orange hover:underline">contact us</Link>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children's privacy (COPPA)</h2>
            <p>Our website and services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it promptly, as required by the <strong>Children's Online Privacy Protection Act (COPPA)</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Data security</h2>
            <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information, including:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>TLS/HTTPS encryption for all data transmitted to and from our website.</li>
              <li>Encrypted-at-rest storage for our database via Vercel Postgres (Neon).</li>
              <li>PCI DSS-compliant payment processing through Stripe — we never transmit or store raw card numbers on our own servers.</li>
              <li>Access controls limiting dashboard access to authenticated, authorized personnel only.</li>
            </ul>
            <p className="mt-3">In the event of a data breach that materially affects your personal information, we will notify affected individuals as required by the <strong>New Jersey Identity Theft Prevention Act (N.J.S.A. 56:8-163)</strong> and other applicable law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Do Not Track</h2>
            <p>Our website does not respond to browser "Do Not Track" signals at this time. We use anonymized analytics only and do not engage in cross-site tracking for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Links to third-party websites</h2>
            <p>Our website may contain links to external sites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. We will post the revised policy on this page with an updated date. Material changes will be communicated to newsletter subscribers by email.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Contact us</h2>
            <p>For questions, requests, or complaints regarding this Privacy Policy or your personal data, please contact:</p>
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-sm">
              <p className="font-semibold text-gray-900">Indian Caucus of Secaucus</p>
              <p className="text-gray-600 mt-1">Secaucus, New Jersey</p>
              <p className="mt-1"><Link href="/contact" className="text-brand-orange hover:underline">indiancaucus.org/contact</Link></p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-400 italic">This Privacy Policy is provided for informational purposes. Indian Caucus of Secaucus recommends consulting with a licensed attorney to ensure full compliance with all applicable federal, state, and local laws relevant to your organization.</p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
