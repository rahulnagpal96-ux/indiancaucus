/** @type {import('next').NextConfig} */

// Security HTTP headers applied to every route.
//
// Notes:
// - This site loads several third-party scripts (Stripe, Telnyx WebRTC,
//   PostHog, Vercel Analytics). A strict `script-src`/`connect-src` CSP can
//   silently break the softphone or card payments, so the CSP below only sets
//   directives that are safe regardless of which third parties are used:
//     * frame-ancestors 'self'  -> clickjacking protection
//     * object-src 'none'       -> blocks legacy <object>/<embed> plugins
//     * base-uri 'self'         -> blocks <base> tag injection
//   `default-src` is intentionally NOT set, so scripts/styles/connections are
//   left unrestricted and no third party is affected.
//
//   To tighten further, test the fuller policy in report-only mode first
//   (see RECOMMENDED_CSP_REPORT_ONLY below), watch the browser console for
//   violations across the dashboard (Terminal, Communications, Campaigns) and
//   the public site, then promote it to `Content-Security-Policy`.
const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains, and allow preload listing.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Stop browsers from MIME-sniffing responses away from the declared type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Clickjacking protection for browsers that predate CSP frame-ancestors.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Don't leak full URLs (with query strings) to other origins.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable powerful features the site does not use. Camera/microphone/payment
  // are intentionally left out so Telnyx (mic) and Stripe (payment) keep working
  // — unlisted features keep their browser default (allowed for same-origin).
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  // Minimal, non-breaking CSP. See the note above before tightening.
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
  },
]

const nextConfig = {
  reactStrictMode: true,

  // Don't advertise the framework ("X-Powered-By: Next.js").
  poweredByHeader: false,

  // Never ship browser source maps in production — they would let anyone map
  // the minified bundle back to readable source. (This is Next.js's default;
  // set explicitly so it can't be turned on by accident.)
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig

// --- Reference: stricter CSP to adopt after testing in report-only mode ---
// Swap the header key to 'Content-Security-Policy-Report-Only' first, verify no
// breakage in the console across the whole site, then rename it back.
//
// const RECOMMENDED_CSP_REPORT_ONLY =
//   "default-src 'self'; " +
//   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.posthog.com https://va.vercel-scripts.com https://*.telnyx.com; " +
//   "connect-src 'self' https://*.posthog.com https://api.stripe.com https://*.telnyx.com wss://*.telnyx.com https://*.vercel-insights.com https://*.public.blob.vercel-storage.com; " +
//   "img-src 'self' data: blob: https:; " +
//   "style-src 'self' 'unsafe-inline'; " +
//   "font-src 'self' data:; " +
//   "frame-src https://js.stripe.com https://hooks.stripe.com; " +
//   "worker-src 'self' blob:; " +
//   "media-src 'self' blob:; " +
//   "object-src 'none'; base-uri 'self'; frame-ancestors 'self'"
