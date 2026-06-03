# Indian Caucus — Redesign scaffold

This repository contains a scaffold for a redesigned `indiancaucus.org` site using Next.js + Tailwind CSS and a Stripe donation flow.

Getting started

1. Install dependencies

```bash
npm install
```

2. Set environment variables (create a `.env.local`)

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
FRESHDESK_API_KEY=...
FRESHDESK_DOMAIN=yourdomain.freshdesk.com
GOOGLE_FORMS_URL=https://docs.google.com/forms/...
```

3. Run locally

```bash
npm run dev
```

What I scaffolded

- Next.js app with Tailwind CSS
- Landing page and `/donate` flow
- `pages/api/create-checkout-session` — creates a Stripe Checkout session
- Placeholder components in `components/`
- Placeholder icons in `public/`

Next steps I need from you

- Place your logo at `public/logo.svg` (recommended) or `public/logo.png`.
- Once you add the logo I will generate proper favicons (favicon.ico, apple-touch-icon.png, android icons) and optimized social share images. You can also generate them locally using ImageMagick:
 - Place your logo at `public/logo.svg` (recommended) or `public/logo.png`.
 - Add event photos to `public/gallery/` — they will automatically appear on `/gallery` after a rebuild.
 - Once you add the logo I will generate proper favicons (favicon.ico, apple-touch-icon.png, android icons) and optimized social share images. You can also generate them locally using ImageMagick:

Social links

- Set the following environment variables in your `.env.local` to enable social links across the site:

```
NEXT_PUBLIC_FACEBOOK=https://facebook.com/yourpage
NEXT_PUBLIC_INSTAGRAM=https://instagram.com/yourpage
NEXT_PUBLIC_YOUTUBE=https://youtube.com/yourchannel
NEXT_PUBLIC_TIKTOK=https://tiktok.com/@yourhandle
```

Once set, icons and links will appear in the header and footer.


```bash
# generate 192 and 512 PNGs
convert public/logo.svg -resize 192x192 public/android-chrome-192.png
convert public/logo.svg -resize 512x512 public/android-chrome-512.png

# apple touch icon
convert public/logo.svg -resize 180x180 public/apple-touch-icon.png

# social card (1200x630)
convert -background '#42B97E' -resize 1200x630 public/logo.svg public/social-card.png
```

Integrations and security

- Mailchimp, Freshdesk, and Google Forms placeholders are ready to be wired; provide API credentials and preferred list/forms.
- Stripe requires a webhook secret if you want to record receipts server-side; we can add webhook handlers after you provide access.

If you want, I can now:

- Import content from indiancaucus.org and populate pages (I will need permission/URLs to scrape),
- Generate final icons once you upload your logo to `public/logo.svg`,
- Start implementing Mailchimp/Freshdesk integration endpoints.
