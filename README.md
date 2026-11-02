# Vowline — AI wedding builder

> Working name. Change it in `src/lib/brand.ts`.

A chat-first wedding designer for **Russian and Indian couples**, made in Goa. The couple talks, and the
invitation, save-the-date and wedding website (with live RSVPs) design themselves as they answer. Goa is the home
destination, but the product works for weddings anywhere, in English, Russian and Hindi.

## What's built

| Area | What it does |
|---|---|
| **Conversation designer** (`src/lib/designer.ts`) | A guided interview covering names, tradition, date, place, events, vibe, language and story, with tappable chips. Each answer updates the design live. After that, free-form edits like “make it Azulejo”, “move the Sangeet to 13 Feb 2027 at 7pm” or “switch to Russian”. It uses an LLM when one is configured (`src/lib/ai.ts`) and a rule-based editor otherwise. |
| **Five design worlds** (`src/lib/themes.ts`) | Konkan Sunset, Azulejo, Rajwada, Belaya Noch, Mogra. Each has its own palette and line-art motif. Typography: Cormorant Garamond, Marck Script and Tiro Devanagari, with Cyrillic and Devanagari supported. |
| **Studio** (`/studio/[id]`) | Chat on the left, live canvas on the right (Invitation / Save the date / Website). Theme swatches, photo upload, and a mobile toggle. |
| **Wedding website** (`/w/[slug]`) | Hero, countdown, story, events, Goa travel notes, RSVP form, add-to-calendar. Published or unpublished. |
| **Sending** | Email invitations (Resend), WhatsApp and Telegram share links, a printable / save-as-PDF invitation (`/w/[slug]/invite`), and a saved guest list. |
| **Live RSVPs** | Neon Realtime live SQL query. Replies appear in the studio as guests submit them. |
| **Custom domains** | Vercel Domains API (`src/lib/vercel.ts`). `proxy.ts` routes a couple's domain to their site. |

## Neon services

Declared in `neon.ts` and provisioned with `neon deploy`:

- **Postgres** stores weddings, messages, guests and RSVPs. Schema is in `scripts/migrate.mjs`; the app uses the `@neondatabase/serverless` HTTP driver.
- **Auth** (Managed Better Auth) handles email/password sign-in, through `src/lib/auth/*` and the `/api/auth/[...path]` proxy.
- **Object Storage** keeps couples' photos in the private `assets` bucket. Uploads go through presigned PUTs, and `/api/media` serves files through signed redirects.
- **Realtime** powers the live RSVP feed (`src/lib/realtime.ts`, `LiveRsvps.tsx`).
- **Functions**: `functions/calendar.ts` returns an `.ics` file of the wedding's events, running next to the database.
- **AI Gateway** is turned off for now because it needs a paid Neon plan. Uncomment `aiGateway` in `neon.ts` after upgrading; `src/lib/ai.ts` picks it up automatically.

## Develop

```bash
npm install
neon deploy --env .env.local         # provisions services + pulls env
echo "NEON_AUTH_COOKIE_SECRET=$(openssl rand -base64 32)" >> .env.local
node --env-file=.env.local scripts/migrate.mjs
npm run dev
```

See `.env.example` for the optional settings: AI, Resend email, Vercel domains.

## Deploy (Vercel)

The GitHub repo is connected to a Vercel project, so every push to `main` deploys. Copy every variable from `.env.local` into the Vercel project (Production and Preview). Set `APP_URL` and `APP_HOSTS`, and run `neon realtime enable --allowed-origin https://<your-domain>` for each app origin. Neon Auth also needs that domain added as a trusted domain.

**Handing over to the client:** in Vercel, go to Project → Settings → General → *Transfer Project* to move it to the client's team. Domains, env vars and deployments move with it. Transfer the Neon project the same way (Neon Console → Project settings → *Transfer*). Then rotate `NEON_AUTH_COOKIE_SECRET` and the API keys.

## Business model

1. **Freemium, paid per wedding.** Designing is free. Publishing costs **Celebration $79 / ₹4,999** or **Heritage $199 / ₹14,999** (custom domain, print-ready suite, concierge). A one-time price suits a once-in-a-lifetime purchase better than a subscription.
2. **Goa destination referrals.** This is the bigger revenue line. Couples who say “Goa” are qualified leads for partner venues, planners, photographers and decorators, typically on an 8–15% commission or a fixed lead fee. Russian couples especially value a trusted, Russian-speaking guide to Goa.
3. **Physical goods:** printed invitation suites through a Goan press, plus welcome bags.
4. **Planner seats (B2B):** Goa wedding planners pay monthly to run their clients' websites and RSVPs in this product.

## Roadmap

Stripe + Razorpay checkout gating `published`, Resend production domain, more languages (Konkani, Marathi, Punjabi, Tamil), WhatsApp Business API sending, video invitations (Remotion), a vendor marketplace, and seating plans.
