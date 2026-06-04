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
| 📧 Email preview | https://indiancaucus.org/dashboard/email-preview |
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

Accessible at `/dashboard` — password protected (`ADMIN_PASSWORD`).

| Page | What it does |
|---|---|
| Overview | Subscriber stats, donation revenue from Stripe, Mailchimp sync button |
| Subscribers | Search, filter, CSV import/export, manage contacts + phone numbers |
| Campaigns | Visual email builder — Event, Newsletter, Donation templates. Image upload, live preview, test send, confirm before bulk send |
| Donors | Live donor list from Stripe — amount, type, receipt links, CSV export |
| Analytics | PostHog behavior tracking + Vercel Analytics + quick links to all tools |
| Email Preview | Live preview of welcome email + send test to any address |

### First-time setup

1. Add **Vercel Postgres** → Vercel project → Storage tab (env vars inject automatically)
2. Add **Vercel Blob** → Vercel project → Storage tab (for campaign image uploads)
3. Visit `/dashboard` → click **"Set up database"** to create tables
4. Set required env vars in Vercel → redeploy

## Subscriber flow

Every sign-up (form or contact page) is:
1. Saved to **Postgres** (email, name, phone, source)
2. Synced to **Resend audience**
3. Synced to **Mailchimp** (while migrating)
4. Sent a **welcome email** via Resend

Unsubscribes hit `/unsubscribe?e=EMAIL` → removes from Postgres + Resend + Mailchimp.

Mailchimp → Postgres sync runs automatically every 5 minutes via Vercel Cron.

## Email sending

| From address | Used for |
|---|---|
| `noreply@newsletters.indiancaucus.org` | Welcome emails |
| `events@newsletters.indiancaucus.org` | Event campaigns |
| `donate@newsletters.indiancaucus.org` | Donation / contact emails |

All sent via Resend. Domain `newsletters.indiancaucus.org` must be verified in Resend.

## Environment Variables

See `.env.local.example` for the full reference.

| Variable | Purpose | Required |
|---|---|---|
| `ADMIN_PASSWORD` | Password for `/dashboard/login` | Yes |
| `POSTGRES_URL` | Vercel Postgres (auto-set by Vercel) | Yes |
| `RESEND_API_KEY` | Email delivery | Yes |
| `RESEND_AUDIENCE_ID` | Resend contact list ID | Yes |
| `EMAIL_FROM_NEWSLETTER` | From address for welcome emails | Yes |
| `EMAIL_FROM_EVENTS` | From address for campaigns | Yes |
| `EMAIL_FROM_DONATIONS` | From address for donation/contact emails | Yes |
| `STRIPE_SECRET_KEY` | Donation checkout + donor analytics | Yes |
| `CRON_SECRET` | Secures Vercel cron job endpoint | Yes |
| `NEXTAUTH_SECRET` | Auth session signing (any random string) | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob for image uploads (auto-set) | Yes |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog behavior analytics | No |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: us.i.posthog.com) | No |
| `MAILCHIMP_API_KEY` | Mailchimp sync (remove when fully on Resend) | No |
| `MAILCHIMP_LIST_ID` | Mailchimp audience ID | No |
| `FRESHDESK_API_KEY` / `FRESHDESK_DOMAIN` | Contact form → support tickets | No |

## Integrations

| Service | Purpose |
|---|---|
| Vercel Postgres (Neon) | Subscriber, campaign database |
| Vercel Blob | Campaign image hosting |
| Resend | Welcome emails, campaigns, audience sync |
| Stripe | Donation checkout, donor analytics |
| PostHog | Session recordings, heatmaps, funnels, events |
| Vercel Analytics | Pageview stats, Web Vitals |
| Mailchimp | Legacy sync (transitioning to Resend) |
| Freshdesk | Contact form → support tickets |
| Outlook / Microsoft 365 | Domain email |

## Deployment

Pushes to `main` deploy automatically via Vercel. DNS managed through Vercel nameservers.

Vercel Cron runs `/api/cron/sync-mailchimp` every 5 minutes (requires Pro plan).
