# Indian Caucus of Secaucus

**Stack:** Next.js 14 · Tailwind CSS · Vercel Postgres · Vercel Blob · Resend · Stripe · Telnyx · PostHog

## Links

| | URL |
|---|---|
| 🌐 Public site | https://indiancaucus.org |
| 🔒 Dashboard | https://indiancaucus.org/dashboard |
| 🔑 Dashboard login | https://indiancaucus.org/dashboard/login |
| ☁️ Vercel project | https://vercel.com/rahulnagpal96-ux/indiancaucus |
| 🗄️ Vercel Postgres | https://vercel.com/rahulnagpal96-ux/indiancaucus/stores |
| 📨 Resend | https://resend.com |
| 💳 Stripe | https://dashboard.stripe.com |
| 📞 Telnyx | https://portal.telnyx.com |
| 📈 PostHog | https://us.posthog.com |

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your keys.

## Dashboard

Login at `/dashboard/login` via **Microsoft O365 SSO** (Azure AD) or fallback admin password.

### Pages

| Page | What it does |
|---|---|
| Overview | YTD donation stats, subscriber counts, quick-action sync buttons |
| Terminal | In-person POS — collect card payments via Stripe, iOS "Scan Credit Card" support, receipt emails |
| Payments | Full Stripe payment history with search |
| Subscribers | Search, filter, add, edit, CSV import/export, manage contacts + phone numbers |
| Campaigns | Visual email builder (Event, Newsletter, Donation, Phone Collection templates). Image upload, live preview, test send, Resend broadcast with open/click analytics |
| Communications | Telnyx softphone (WebRTC calls), SMS messaging, call + SMS history |
| Donors | YTD donor list from Stripe — name, email, amount, type, receipt links, CSV export |
| Activity Log | Audit trail of all dashboard actions |
| Analytics | PostHog + Vercel Analytics + quick links to all external tools |
| Notifications | Push notification management — send test pushes, manage devices |
| Users | Manage dashboard user accounts and roles (admin only) |

### Roles

| Role | Access |
|---|---|
| `admin` | Full access — all pages, all action buttons |
| `staff` | View-only except Terminal (collect payments) and Communications (calls/SMS) |

### First-time setup

1. Add **Vercel Postgres** → Vercel project → Storage tab (env vars inject automatically)
2. Add **Vercel Blob** → Vercel project → Storage tab (for campaign image uploads)
3. Set all required env vars in Vercel → redeploy
4. Visit `/dashboard` → click **"Set up database"** to create tables

## Authentication

Dashboard uses **Microsoft O365 SSO** (Azure AD) via NextAuth. Unauthenticated requests are redirected to `/dashboard/login`. All API routes under `/api/admin/` require a valid session.

**Azure AD setup:**
1. Azure Portal → App registrations → New registration
2. Name: `Indian Caucus Dashboard`
3. Redirect URI: `https://indiancaucus.org/api/auth/callback/azure-ad`
4. Certificates & Secrets → New client secret → copy the **Value** (not the ID)
5. Add `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` to Vercel

## Subscriber flow

Every sign-up (newsletter form or contact page) is automatically:
1. Saved to **Postgres** (email, name, phone, source)
2. Synced to **Resend audience**
3. Sent a **welcome email** via Resend

Unsubscribes → `/unsubscribe?e=EMAIL` — marks record as `status = unsubscribed` in Postgres and removes from Resend audience.

Mailchimp → Postgres sync runs automatically **every hour** via Vercel Cron (Pro plan required).

## Email sending

| Variable | From address | Used for |
|---|---|---|
| `EMAIL_FROM_NEWSLETTER` | `noreply@newsletters.indiancaucus.org` | Welcome emails |
| `EMAIL_FROM_EVENTS` | `noreply@newsletters.indiancaucus.org` | Event campaigns |
| `EMAIL_FROM_DONATIONS` | `noreply@indiancaucus.org` | Donation / contact emails |

Domain `newsletters.indiancaucus.org` must be verified in Resend → Domains.

## Email templates

Four campaign templates in `lib/emailTemplates.js`:
- **Event Announcement** — image, title, date, location, CTA button
- **Community Update** — headline, body, optional CTA
- **Donation Appeal** — headline, appeal text, Donate Now button + sponsor link
- **Phone Collection** — collects subscriber phone numbers

Welcome email template in `lib/welcomeEmail.js` — sent automatically on every sign-up.

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `POSTGRES_URL` | Vercel Postgres (auto-set by Vercel) | Yes |
| `NEXTAUTH_SECRET` | NextAuth session signing key | Yes |
| `NEXTAUTH_URL` | `https://indiancaucus.org` | Yes |
| `AZURE_AD_CLIENT_ID` | Microsoft O365 login | Yes |
| `AZURE_AD_CLIENT_SECRET` | Microsoft O365 login | Yes |
| `AZURE_AD_TENANT_ID` | Microsoft O365 login | Yes |
| `RESEND_API_KEY` | Email delivery + campaign broadcasts | Yes |
| `RESEND_AUDIENCE_ID` | Resend audience ID for broadcasts | Yes |
| `EMAIL_FROM_NEWSLETTER` | Welcome email sender | Yes |
| `EMAIL_FROM_EVENTS` | Campaign sender | Yes |
| `EMAIL_FROM_DONATIONS` | Contact/donation email sender | Yes |
| `STRIPE_SECRET_KEY` | Donation checkout + donor analytics + Terminal POS | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side (Terminal) | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob image uploads (auto-set) | Yes |
| `TELNYX_API_KEY` | Telnyx SMS + call history | Yes |
| `TELNYX_WEBRTC_CREDENTIAL_ID` | Telnyx WebRTC softphone auth | Yes |
| `NEXT_PUBLIC_TELNYX_SIP_USERNAME` | Telnyx SIP fallback | No |
| `NEXT_PUBLIC_TELNYX_SIP_PASSWORD` | Telnyx SIP fallback | No |
| `NEXT_PUBLIC_TELNYX_PHONE_NUMBER` | Outbound caller ID | No |
| `CRON_SECRET` | Secures Vercel cron job endpoint | Yes |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog behavior analytics | No |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: us.i.posthog.com) | No |
| `MAILCHIMP_API_KEY` | Mailchimp legacy sync | No |
| `MAILCHIMP_LIST_ID` | Mailchimp audience ID | No |
| `ADMIN_PASSWORD` | Fallback password login (emergency use) | No |

## Integrations

| Service | Purpose |
|---|---|
| Vercel Postgres (Neon) | Subscriber, campaign, donor, and POS database |
| Vercel Blob | Campaign image hosting |
| Resend | Welcome emails, broadcast campaigns, audience sync, analytics |
| Stripe | Donation checkout, Terminal POS, donor analytics |
| Telnyx | Softphone (WebRTC), SMS, call history |
| PostHog | Session recordings, heatmaps, funnels, event tracking |
| Vercel Analytics | Pageview stats, Core Web Vitals |
| Mailchimp | Legacy list (hourly sync to Postgres, phasing out) |
| Microsoft O365 / Azure AD | Dashboard SSO login |

## Deployment

Pushes to `main` deploy automatically via Vercel. DNS managed through Vercel nameservers.

Vercel Cron runs `/api/cron/sync-mailchimp` every hour (requires Vercel Pro plan).
