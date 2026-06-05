import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Terms of Service — Indian Caucus of Secaucus</title>
        <meta name="description" content="Terms of Service for Indian Caucus of Secaucus." />
      </Head>
      <Header />

      <section style={{background:'linear-gradient(135deg, #0F2044 0%, #1a3a6e 45%, #1e5c40 100%)'}}>
        <div className="container-max px-4 md:px-6 py-14 md:py-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Legal</span>
          <h1 className="text-4xl font-extrabold text-white mt-2">Terms of Service</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: June 5, 2026</p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 py-14">
        <div className="max-w-3xl space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to terms</h2>
            <p>By accessing or using the website <strong>indiancaucus.org</strong> (the "Site"), you agree to be bound by these Terms of Service ("Terms") and our <Link href="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>. If you do not agree to these Terms, please do not use the Site.</p>
            <p className="mt-3">These Terms apply to all visitors, subscribers, donors, event participants, volunteers, and any other person who accesses or uses the Site or interacts with Indian Caucus of Secaucus ("we," "us," or "our"), a registered 501(c)(3) nonprofit organization based in Secaucus, New Jersey.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of the website</h2>
            <p>You agree to use the Site only for lawful purposes and in a manner consistent with all applicable federal, state, and local laws and regulations. You agree not to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Use the Site in any way that violates applicable laws or regulations, including New Jersey law.</li>
              <li>Attempt to gain unauthorized access to any part of the Site, our servers, or any database connected to the Site.</li>
              <li>Submit false, misleading, or fraudulent information through any form on the Site.</li>
              <li>Use automated tools, bots, or scrapers to access or collect data from the Site without our prior written consent.</li>
              <li>Upload or transmit viruses, malware, or any other harmful code.</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
              <li>Engage in any conduct that restricts or inhibits any other person's use or enjoyment of the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Donations</h2>
            <p>Indian Caucus of Secaucus is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. Donations may be tax-deductible to the full extent permitted by law.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Non-refundable:</strong> All donations are final and non-refundable, consistent with IRS rules governing charitable contributions. If you believe a donation was made in error, please <Link href="/contact" className="text-brand-orange hover:underline">contact us</Link> within 7 days and we will review the request at our sole discretion.</li>
              <li><strong>Tax receipts:</strong> You will receive an email receipt upon completing your donation that serves as your official tax record. Donations of $250 or more will receive a written acknowledgment as required by IRS Publication 1771.</li>
              <li><strong>No goods or services:</strong> Unless otherwise stated, no goods or services are provided in exchange for donations, making the full amount potentially deductible.</li>
              <li><strong>Use of funds:</strong> All donations are used solely to support the charitable purposes of Indian Caucus of Secaucus. We cannot guarantee that a donation will be applied to any specific program or expense.</li>
              <li><strong>Payment processing:</strong> Donations are processed by Stripe, Inc. By donating, you also agree to Stripe's terms of service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Events, vendor spots, and sponsorships</h2>
            <p>All fees paid for event vendor spots, sponsorship packages, and program advertising are governed by our <Link href="/refund-policy" className="text-brand-orange hover:underline">Refund Policy</Link>, which is incorporated into these Terms by reference.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>All event fees are <strong>non-refundable</strong> and non-transferable except as expressly permitted in the Refund Policy.</li>
              <li>All events are held <strong>rain or shine</strong>. We are not liable for weather conditions.</li>
              <li>We reserve the right to refuse service or remove any individual from an event for conduct that is unlawful, disruptive, or in violation of our community standards.</li>
              <li>Event participants are responsible for their own conduct and safety at all events. Indian Caucus of Secaucus is not liable for personal injury or property damage at events except to the extent required by applicable New Jersey law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Communications</h2>
            <p>By subscribing to our newsletter or providing your contact information, you consent to receive communications from us as described in our <Link href="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Email:</strong> You may unsubscribe from marketing emails at any time using the unsubscribe link in any email or at <Link href="/unsubscribe" className="text-brand-orange hover:underline">indiancaucus.org/unsubscribe</Link>. Transactional emails (donation receipts, event confirmations) are not subject to unsubscribe.</li>
              <li><strong>SMS/Text messages:</strong> By providing your phone number, you expressly consent to receive text messages from us. You may opt out at any time by replying STOP. Message and data rates may apply. See our Privacy Policy for full TCPA disclosure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual property</h2>
            <p>All content on the Site — including text, images, logos, graphics, audio, video, and software — is the property of Indian Caucus of Secaucus or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
            <p className="mt-3">You may not reproduce, distribute, modify, transmit, display, or create derivative works from any content on the Site without our prior written consent, except for personal, non-commercial use or as expressly permitted by law.</p>
            <p className="mt-3">The Indian Caucus of Secaucus name and logo are trademarks of the organization. Use of these marks without our written permission is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. User accounts and dashboard access</h2>
            <p>Access to the administrative dashboard at <strong>indiancaucus.org/dashboard</strong> is restricted to authorized personnel of Indian Caucus of Secaucus.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to terminate or suspend access at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, the organization, or third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Privacy</h2>
            <p>Your use of the Site is subject to our <Link href="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference. Our Privacy Policy describes how we collect, use, and protect your personal information, and your rights regarding that information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of warranties</h2>
            <p>THE SITE AND ALL CONTENT, SERVICES, AND INFORMATION PROVIDED THROUGH THE SITE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
            <p className="mt-3">We do not warrant that the Site will be uninterrupted, error-free, secure, or free of viruses or other harmful components. We do not warrant the accuracy, completeness, or timeliness of any content on the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of liability</h2>
            <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, INDIAN CAUCUS OF SECAUCUS, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND VOLUNTEERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL — ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            <p className="mt-3">OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE SITE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU DONATED OR PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).</p>
            <p className="mt-3">Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities, so the above limitations may not apply to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Indian Caucus of Secaucus and its officers, directors, employees, and volunteers from and against any claims, liabilities, damages, judgments, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Third-party links</h2>
            <p>The Site may contain links to third-party websites. These links are provided for convenience only. We do not endorse, control, or take responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and privacy policies of any site you visit.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Governing law and dispute resolution</h2>
            <p>These Terms are governed by the laws of the <strong>State of New Jersey</strong>, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of the Site shall be resolved exclusively in the state or federal courts located in <strong>Hudson County, New Jersey</strong>, and you consent to the personal jurisdiction of those courts.</p>
            <p className="mt-3">Before initiating any formal legal proceeding, you agree to first contact us in writing and give us 30 days to attempt to resolve the dispute informally.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Accessibility</h2>
            <p>Indian Caucus of Secaucus is committed to ensuring our website is accessible to all individuals, including those with disabilities. We strive to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. If you encounter an accessibility barrier or need assistance, please <Link href="/contact" className="text-brand-orange hover:underline">contact us</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">15. Changes to these terms</h2>
            <p>We reserve the right to modify these Terms at any time. Updated Terms will be posted to this page with a revised date. Your continued use of the Site after any changes constitutes acceptance of the revised Terms. For material changes, we will make reasonable efforts to notify you by email or a notice on the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">16. Entire agreement and severability</h2>
            <p>These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Indian Caucus of Secaucus regarding your use of the Site. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">17. Contact us</h2>
            <p>If you have questions about these Terms, please contact:</p>
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-sm">
              <p className="font-semibold text-gray-900">Indian Caucus of Secaucus</p>
              <p className="text-gray-600 mt-1">Secaucus, New Jersey</p>
              <p className="mt-1"><Link href="/contact" className="text-brand-orange hover:underline">indiancaucus.org/contact</Link></p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-400 italic">These Terms of Service are provided for informational purposes. Indian Caucus of Secaucus recommends consulting with a licensed attorney to ensure these terms are appropriate for your organization's specific circumstances and compliant with all applicable laws.</p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
