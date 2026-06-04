# Indian Caucus of Secaucus — indiancaucus.org

Production website for the Indian Caucus of Secaucus, a 501(c)(3) nonprofit hosting free cultural events (Holi, Dandiya Dhamaka, Diwali Mela) for the Secaucus, NJ community.

**Stack:** Next.js 14 · Tailwind CSS · Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_BASE_URL=https://indiancaucus.org
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
FRESHDESK_API_KEY=...
FRESHDESK_DOMAIN=indiancaucus.freshdesk.com
```

## Integrations

| Service | Purpose |
|---|---|
| Stripe | Donation checkout |
| Mailchimp | Newsletter subscribe |
| Freshdesk | Support (`support.indiancaucus.org`) |
| Salesforce | CRM |
| Outlook / Microsoft 365 | Domain email |
| Vercel Analytics | Site traffic |

## Deployment

Pushes to `main` deploy automatically via Vercel. DNS is managed through Vercel nameservers.
