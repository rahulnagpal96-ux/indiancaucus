# Indian Caucus of Secaucus

**Stack:** Next.js 14 · Tailwind CSS · Vercel Postgres · Resend · Stripe

## Links

| | URL |
|---|---|
| 🌐 Public site | https://indiancaucus.org |
| 🔒 Dashboard | https://indiancaucus.org/dashboard |
| 🔑 Dashboard login | https://indiancaucus.org/dashboard/login |
| 📋 Subscribers | https://indiancaucus.org/dashboard/subscribers |
| 📣 Campaigns | https://indiancaucus.org/dashboard/campaigns |
| ☁️ Vercel project | https://vercel.com/rahulnagpal96-ux/indiancaucus |
| 🗄️ Vercel Postgres | https://vercel.com/rahulnagpal96-ux/indiancaucus/stores |
| 📧 Resend | https://resend.com |

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your keys.

## Dashboard

Accessible at `/dashboard` — password protected.

- **Login:** `/dashboard/login` — enter `ADMIN_PASSWORD`
- **Overview:** Subscriber stats, new sign-ups, phone numbers collected, campaigns sent
- **Subscribers:** Search, filter, CSV import/export, manage contacts + phone numbers
- **Campaigns:** Compose and send email campaigns to all active subscribers

### First-time setup

1. Add **Vercel Postgres** in your Vercel project → Storage tab (env vars inject automatically)
2. Visit `/dashboard` → click **"Set up database"** to create tables
3. Set `ADMIN_PASSWORD` in Vercel env vars → redeploy

## Environment Variables

See `.env.local.example` for the full reference.

| Variable | Purpose | Required |
|---|---|---|
| `ADMIN_PASSWORD` | Password for `/dashboard/login` | Yes |
| `POSTGRES_URL` | Vercel Postgres (auto-set by Vercel Storage) | Yes |
| `RESEND_API_KEY` | Welcome emails + campaign delivery | Yes |
| `EMAIL_FROM` | Sender address (domain must be verified in Resend) | Yes |
| `STRIPE_SECRET_KEY` | Donation checkout | Yes |
| `MAILCHIMP_API_KEY` | Mailchimp sync (remove when switching to Resend) | No |
| `MAILCHIMP_LIST_ID` | Mailchimp audience ID | No |
| `FRESHDESK_API_KEY` / `FRESHDESK_DOMAIN` | Contact form → support tickets | No |

## Integrations

| Service | Purpose |
|---|---|
| Vercel Postgres (Neon) | Subscriber and campaign database |
| Resend | Welcome emails, newsletter campaigns |
| Mailchimp | Legacy newsletter sync (remove when Resend is live) |
| Stripe | Donation checkout |
| Freshdesk | Contact form → support tickets |
| Outlook / Microsoft 365 | Domain email |
| Vercel Analytics | Site traffic |

## Deployment

Pushes to `main` deploy automatically via Vercel. DNS managed through Vercel nameservers.
