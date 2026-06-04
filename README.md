# Indian Caucus of Secaucus

**Stack:** Next.js 14 · Tailwind CSS · Vercel Postgres · Vercel Blob · Resend · Stripe · PostHog

## Links

| | URL |
|---|---|
| 🌐 Public site | https://indiancaucus.org |
| 🔒 Dashboard | https://indiancaucus.org/dashboard |
| 🔑 Dashboard login | https://indiancaucus.org/dashboard/login |
| 📋 Subscribers | https://indiancaucus.org/dashboard/subscribers |
| 📣 Campaigns | https://indiancaucus.org/dashboard/campaigns |
| 💝 Donors | https://indiancaucus.org/dashboard/donors |
| 📊 Analytics | https://indiancaucus.org/dashboard/analytics |
| ☁️ Vercel project | https://vercel.com/rahulnagpal96-ux/indiancaucus |
| 🗄️ Vercel Postgres | https://vercel.com/rahulnagpal96-ux/indiancaucus/stores |
| 📨 Resend | https://resend.com |
| 💳 Stripe | https://dashboard.stripe.com |
| 📈 PostHog | https://us.posthog.com |

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your keys.

## Dashboard

Login at `/dashboard/login` via **Microsoft O365 SSO** (Azure AD). One shared database for all authorized users.

| Page | What it does |
|---|---|
| Overview | Subscriber stats, Stripe donation revenue cards, Mailchimp sync button |
| Subscribers | Search, filter, edit, CSV import/export, manage contacts + phone numbers |
| Campaigns | Visual email builder — Event, Newsletter, Donation templates. Image upload via Vercel Blob, live preview, test send to any email, confirm before bulk send |
| Donors | Live donor list from Stripe — name, email, amount, one-time vs monthly, receipt links, CSV export |
| Analytics | PostHog + Vercel Analytics + quick links to all external tools |

### First-time setup

1. Add **Vercel Postgres** → Vercel project → Storage tab (env vars inject automatically)
2. Add **Vercel Blob** → Vercel project → Storage tab (for campaign image uploads)
3. Visit `/dashboard` → click **"Set up database"** to create tables
4. Set required env vars in Vercel → redeploy

## Authentication

Dashboard uses **Microsoft O365 SSO** (Azure AD) via NextAuth.

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
3. Synced to **Mailchimp** (while migrating)
4. Sent a **welcome email** via Resend

Unsubscribes → `/unsubscribe?e=EMAIL` — removes from Postgres + Resend + Mailchimp simultaneously. Record is kept in Postgres with `status = unsubscribed`.

Mailchimp → Postgres sync runs automatically **every 5 minutes** via Vercel Cron (Pro plan required).

## Email sending

| Variable | From address | Used for |
|---|---|---|
| `EMAIL_FROM_NEWSLETTER` | `noreply@newsletters.indiancaucus.org` | Welcome emails |
| `EMAIL_FROM_EVENTS` | `noreply@newsletters.indiancaucus.org` | Event campaigns |
| `EMAIL_FROM_DONATIONS` | `noreply@indiancaucus.org` | Donation / contact emails |

Domain `newsletters.indiancaucus.org` must be verified in Resend → Domains.

## Email templates

Three campaign templates in `lib/emailTemplates.js`:
- **Event Announcement** — image, title, date, location, CTA button
- **Community Update** — headline, body, optional CTA
- **Donation Appeal** — headline, appeal text, Donate Now button + sponsor link

Welcome email template in `lib/welcomeEmail.js` — sent automatically on every sign-up.

## Environment Variables

See `.env.local.example` for the full reference.

| Variable | Purpose | Required |
|---|---|---|
| `POSTGRES_URL` | Vercel Postgres (auto-set by Vercel) | Yes |
| `NEXTAUTH_SECRET` | NextAuth session signing key | Yes |
| `NEXTAUTH_URL` | `https://indiancaucus.org` | Yes |
| `AZURE_AD_CLIENT_ID` | Microsoft O365 login | Yes |
| `AZURE_AD_CLIENT_SECRET` | Microsoft O365 login | Yes |
| `AZURE_AD_TENANT_ID` | Microsoft O365 login | Yes |
| `RESEND_API_KEY` | Email delivery | Yes |
| `RESEND_AUDIENCE_ID` | Resend audience/segment ID for broadcasts | Yes |
| `EMAIL_FROM_NEWSLETTER` | Welcome email sender | Yes |
| `EMAIL_FROM_EVENTS` | Campaign sender | Yes |
| `EMAIL_FROM_DONATIONS` | Contact/donation email sender | Yes |
| `STRIPE_SECRET_KEY` | Donation checkout + donor analytics | Yes |
| `CRON_SECRET` | Secures Vercel cron job endpoint | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob image uploads (auto-set) | Yes |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog behavior analytics | No |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: us.i.posthog.com) | No |
| `MAILCHIMP_API_KEY` | Mailchimp sync (remove when fully on Resend) | No |
| `MAILCHIMP_LIST_ID` | Mailchimp audience ID | No |
| `FRESHDESK_API_KEY` / `FRESHDESK_DOMAIN` | Contact form → Freshdesk tickets | No |
| `ADMIN_PASSWORD` | Fallback password login (kept for emergencies) | No |

## Integrations

| Service | Purpose |
|---|---|
| Vercel Postgres (Neon) | Subscriber and campaign database |
| Vercel Blob | Campaign image hosting |
| Resend | Welcome emails, campaigns, audience sync |
| Stripe | Donation checkout, donor list + analytics |
| PostHog | Session recordings, heatmaps, funnels, event tracking |
| Vercel Analytics | Pageview stats, Core Web Vitals |
| Mailchimp | Legacy list sync (transitioning to Resend) |
| Freshdesk | Contact form → support tickets |
| Microsoft O365 / Azure AD | Dashboard SSO login |
| Outlook / Microsoft 365 | Domain email |

## Deployment

Pushes to `main` deploy automatically via Vercel. DNS managed through Vercel nameservers.

Vercel Cron runs `/api/cron/sync-mailchimp` every 5 minutes (requires Vercel Pro plan).
