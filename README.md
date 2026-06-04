# Indian Caucus of Secaucus — indiancaucus.org

Production website for the Indian Caucus of Secaucus, a 501(c)(3) nonprofit hosting free cultural events (Holi, Dandiya Dhamaka, Diwali Mela) for the Secaucus, NJ community.

**Stack:** Next.js 14 · Tailwind CSS · Vercel Postgres · Resend · NextAuth · Stripe

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your keys.

## Admin Dashboard

The dashboard lives at `/dashboard` and requires authentication.

- **Login:** `/dashboard/login` — Microsoft O365 (Azure AD) or admin password
- **Overview:** Stats for subscribers, new sign-ups, phone numbers, campaigns sent
- **Subscribers:** Search, filter, import CSV, export CSV, manage contacts
- **Campaigns:** Compose and send email campaigns to all active subscribers

### First-time setup

1. Add a **Vercel Postgres** database in your Vercel project (Storage tab) — env vars are injected automatically
2. Visit `/dashboard` and click **"Set up database"** to create the tables
3. Set the required env vars below and redeploy

## Environment Variables

See `.env.local.example` for the full reference. Key variables:

| Variable | Purpose | Required |
|---|---|---|
| `POSTGRES_URL` | Vercel Postgres connection (auto-set by Vercel) | Yes |
| `RESEND_API_KEY` | Email delivery for welcome emails and campaigns | Yes |
| `EMAIL_FROM` | Sender address (domain must be verified in Resend) | Yes |
| `NEXTAUTH_SECRET` | Auth session signing key — `openssl rand -base64 32` | Yes |
| `NEXTAUTH_URL` | Your deployed URL | Yes |
| `ADMIN_PASSWORD` | Password for dashboard login | Yes |
| `STRIPE_SECRET_KEY` | Donation checkout | Yes |
| `AZURE_AD_CLIENT_ID/SECRET/TENANT_ID` | Microsoft O365 SSO (optional) | No |
| `FRESHDESK_API_KEY` / `FRESHDESK_DOMAIN` | Contact form tickets (optional) | No |

## Integrations

| Service | Purpose |
|---|---|
| Vercel Postgres (Neon) | Subscriber and campaign database |
| Resend | Welcome emails, newsletter campaigns |
| NextAuth v4 | Dashboard authentication (O365 + password) |
| Stripe | Donation checkout |
| Freshdesk | Contact form → support tickets |
| Outlook / Microsoft 365 | Domain email |
| Vercel Analytics | Site traffic |

## Deployment

Pushes to `main` deploy automatically via Vercel. DNS is managed through Vercel nameservers.
