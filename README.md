# Vowline — AI wedding builder

> Working name. Change it in `src/lib/brand.ts`.

A chat-first, AI wedding designer for **Russian and Indian couples**, made in Goa. The couple talks, and their
invitation, save-the-date and wedding website (with live RSVPs) design themselves as they answer. Goa is the home
destination, but the product works for weddings anywhere, in English, Russian and Hindi.

This repo is **the app only**. There's no marketing landing page here: the public site is built separately, and `/` goes straight to the studio (or sign-in).

## What's built

| Area | What it does |
|---|---|
| **AI designer** (`src/lib/ai.ts`, `src/lib/designer.ts`) | OpenRouter **free models only** run the whole conversation. It asks one warm question at a time in the couple's language, fills the wedding profile, writes the invitation wording and closing blessing in the guest language, polishes the love story, picks the design world, and carries out free-form edits. If AI is unavailable, a rule-based designer takes over automatically, so the app never breaks. |
| **Five design worlds** (`src/lib/themes.ts`) | Konkan Sunset, Azulejo, Rajwada, Belaya Noch, Mogra. Each has its own palette, gold-foil tones, falling petals (marigold for Rajwada, birch-white for Belaya Noch, and so on) and a line-art motif that draws itself. |
| **Studio** (`/studio/[id]`) | Glass chat panel with replies that fade in word by word, a heart typing indicator and spring-animated suggestion chips. Live canvas with a 3D-tilting invitation, blur cross-fades between design worlds, and Invitation / Save-the-date / Website tabs. |
| **Wedding website** (`/w/[slug]`) | Opens with a **sealed envelope** guests tap to open (wax seal with initials, flap, rising letter). Then a gold-foil hero, countdown, story, an animated events timeline, Goa travel notes, add-to-calendar, and an RSVP form with a heart burst on “yes”. |
| **Sending** | Email invitations (Resend), WhatsApp and Telegram share links, and a tilting printable / save-as-PDF invitation (`/w/[slug]/invite`). |
| **Live RSVPs** | Neon Realtime live SQL query. Replies appear in the studio as guests submit them. |
| **Admin console** (`/admin`) | Every wedding, owner, RSVP and guest count; AI and email status; open any couple's studio. |
| **Custom domains** | Vercel Domains API (`src/lib/vercel.ts`). `proxy.ts` routes a couple's domain to their site. |

Design system: champagne, blush, rose, wine and gold; Cormorant Garamond, Marck Script and Tiro Devanagari (with Cyrillic and Devanagari support). Animations use `motion` plus CSS: aurora, petals, foil shimmer, line drawing, scroll reveals. All animation respects `prefers-reduced-motion`.

## Admin access

- **akshay@lyvena.xyz** is a permanent platform owner, hard-coded in `src/lib/admin.ts`.
- Admin is granted by either:
  1. the Neon Auth **`admin` role** (set with `neon neon-auth user set-role <user-id> --roles admin`); this is already set on akshay@lyvena.xyz's account; or
  2. an owner email that is **verified**, for example through “Continue with Google”.
- An unverified password sign-up using an owner email does *not* get admin, so the address can't be hijacked.
- Add more admins with `ADMIN_EMAILS` (comma-separated, verified emails only) or the Neon role.

## Neon services

Declared in `neon.ts` and provisioned with `neon deploy`:

- **Postgres** stores weddings, messages, guests and RSVPs (`scripts/migrate.mjs`), using the `@neondatabase/serverless` HTTP driver.
- **Auth** (Managed Better Auth) provides email/password and Google sign-in, plus roles.
- **Object Storage** keeps couples' photos in the private `assets` bucket, using presigned PUTs and signed reads.
- **Realtime** powers the live RSVP feed.
- **Functions**: `functions/calendar.ts` returns an `.ics` file of the wedding's events.

## AI (OpenRouter, free models only)

The app uses **only free OpenRouter models**, so there's no per-message cost. This is enforced in code: `OPENROUTER_MODEL` is ignored unless it ends in `:free`.

| Order | Model | Why |
|---|---|---|
| 1 | `nvidia/nemotron-3-ultra-550b-a55b:free` | Best in a side-by-side test (Nov 2026) on a Russian–Punjabi Sikh couple: fluent Russian, correctly named the Anand Karaj ceremony, clean structured output. About 15–20 s per reply. |
| 2 | `nvidia/nemotron-3.5-super-vl:free` | Strong fallback with good Russian. |
| 3 | `openrouter/free` | OpenRouter's free auto-router, the last safety net. |

OpenRouter switches to the next model automatically if one is busy or rate-limited (it allows at most 3 per request). If all three fail, the built-in rule-based designer answers, so the chat never breaks.

Also tested: `google/gemma-4-31b-it:free` and `gemma-4-26b` (rate-limited upstream) and `thinkingmachines/inkling:free` (restricted to agent tools).

Setup: put `OPENROUTER_API_KEY` in Vercel and `.env.local`. `/admin` shows whether AI is connected.

Free-tier limits: OpenRouter caps free-model usage per day (the cap is higher once the account has ever bought credits), and free models can be slower or busy at peak times. For heavy production traffic, consider a small credit top-up or a paid model later.

## Develop

```bash
npm install
neon deploy --env .env.local         # provisions services + pulls env
echo "NEON_AUTH_COOKIE_SECRET=$(openssl rand -base64 32)" >> .env.local
node --env-file=.env.local scripts/migrate.mjs
npm run dev
```

## Deploy (Vercel)

The GitHub repo is connected to the Vercel project `lyvena/wedding-builder` (https://wedding-builder-two.vercel.app). Every push to `main` deploys. Environment variables live in Vercel (Production and Preview). For each new app domain:

```bash
neon neon-auth domain add https://<domain>
neon realtime enable --allowed-origin https://<domain>
```

**Handing over to the client:** in Vercel, go to Project → Settings → *Transfer Project*. In the Neon Console, go to Project settings → *Transfer*. Before transferring, add akshay@lyvena.xyz as a member of the client's Vercel team and Neon org so infrastructure access continues. In-app admin is unaffected, because it lives in the code and the database. Afterwards, rotate `NEON_AUTH_COOKIE_SECRET` and the API keys.

## Business model

1. **Freemium, paid per wedding:** designing is free; publishing costs **Celebration $79 / ₹4,999** or **Heritage $199 / ₹14,999**.
2. **Goa destination referrals**, likely the biggest line: venues, planners, photographers and decorators at 8–15% commission. Russian couples especially value a trusted, Russian-speaking guide to Goa.
3. **Printed invitation suites** through a Goan press.
4. **Planner seats (B2B):** Goa planners pay monthly to run their clients' sites and RSVPs.

## Roadmap

Stripe + Razorpay checkout gating `published`, Resend production domain, streaming AI replies (to hide free-model latency), AI-generated motifs and illustrations, more languages (Konkani, Marathi, Punjabi, Tamil), WhatsApp Business API sending, video invitations, a vendor marketplace, and seating plans.
