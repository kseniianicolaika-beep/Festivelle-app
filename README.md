# Festivelle — AI-native invitations, websites, videos & greetings

> The name lives in one place: `src/lib/brand.ts`. (Client brief name: FestiVites → now **Festivelle**.)

| | |
|---|---|
| **Live app** | https://wedding-builder-two.vercel.app |
| **Repository** | https://github.com/Akshay115/Festivelle-app |
| **Hosting** | Vercel project `lyvena/wedding-builder`, auto-deploys from `main` |
| **Backend** | Neon project `raspy-union-09496702`, branch `production` (Postgres, Auth, Object Storage, Realtime, Functions) |
| **AI** | Experiential Labs free models (GPT-6 Luna → DeepSeek V4.1 Flash) → OpenRouter free → rule engine |
| **Payments** | YooKassa (Russia, RUB) · Razorpay (India INR + international USD) · NOWPayments (crypto, worldwide) |
| **Support** | Heart concierge → WhatsApp +91 72186 78536 |
| **Platform owner** | akshay@lyvena.xyz (permanent admin) |

A conversation-first, romantic platform for ready-made invitation websites, video invitations and digital greetings —
weddings, engagements, anniversaries, birthdays, children's parties, baby showers and greetings. You talk; the design
writes itself. **Designing is free**; you pay once only to publish (get your own link) or download.

## The customer journey

1. **Choose** an occasion and a template at `/studio/new` (live previews in your own names), or just start talking.
2. **Personalise for free** — by chat (“move the gallery up”, “make it more royal”, “write it in Russian”) or by hand:
   names, texts, photos & gallery, dates, venue, colours/themes, fonts/layouts, motifs, and sections
   (intro, invitation, details, schedule, venue, gallery, RSVP, additional info — add, hide, reorder). Preview on
   desktop and mobile, drafts save automatically. **No public link exists before payment.**
3. **Pay once** (Share → choose a package). The site goes live immediately at **`names.festivelle.com`**
   (Cyrillic names are transliterated: Анна & Марк → `anna-mark`). Upgrades are charged only the difference.
4. **Hosting window:** up to 12 months from activation, but no later than 30 days after the event — whichever comes
   first (both numbers are admin-configurable). Optional one-time extensions (3/6/12 months, or Keepsake forever);
   never auto-renewed. Expired sites show a gentle “this celebration has become a memory” page.
5. **Video invitations & greetings** (`/studio/[id]/video`): three canvas-rendered templates (Whisper, Golden Hour,
   Sealed with Love), 9:16 and 16:9, recorded in the browser (MP4/WebM). Watermarked until purchased.
6. **Digital greetings:** greeting cards with names, photo and message; PNG export is watermarked until purchased.

## Pricing (defaults — every number is editable at `/admin/pricing`)

| Websites | Basic | Premium | Luxury |
|---|---|---|---|
| Weddings & engagements | Essential $19 · ₹999 · 1 490 ₽ | Signature $39 · ₹1 999 · 2 990 ₽ | Heirloom $79 · ₹3 999 · 5 990 ₽ |
| Birthdays, kids, baby showers, anniversaries | Simple $7 · ₹399 · 590 ₽ | Signature $15 · ₹799 · 1 190 ₽ | Grand $29 · ₹1 499 · 2 290 ₽ |
| Digital greetings | Card $3 | Keepsake $5 | Luxe $9 |
| Video invitations / greetings | Classic $12 | Cinematic $24 | Heirloom film $39 |

Hosting extensions: 3 mo $9 · 6 mo $15 · 12 mo $25 · Keepsake (forever) $29. AI: 80 free messages/day + 3 free
illustrations, then credit packs (20 credits $5, 60 credits $12). Why not $3/$5/$7: a once-in-a-lifetime, emotional
purchase priced like a template signals “cheap” and leaves no margin after payment fees; the low-ticket occasions keep
an accessible entry point, and regional INR/RUB prices keep it affordable.

## Payments (Russia supported)

Stripe and PayPal don't serve Russian cards, so checkout offers the right acquirer per currency
(`src/lib/payments.ts`). Every payment is re-verified **server-to-server** before anything unlocks
(`/api/payments/return`, plus webhooks), and fulfilment is idempotent (`src/lib/commerce.ts`).

| Provider | Currency | Who it's for | Env vars | Webhook URL |
|---|---|---|---|---|
| **YooKassa** | RUB | Russian cards, МИР, СБП, SberPay, YooMoney. Requires a Russian ИП/ООО or самозанятый. | `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` (opt. `YOOKASSA_RECEIPTS=1`, `YOOKASSA_VAT_CODE` for 54-ФЗ receipts) | `/api/payments/yookassa` (event `payment.succeeded`) |
| **Razorpay** | INR, USD | UPI, Indian cards, netbanking, international cards | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | `/api/payments/razorpay` (event `payment_link.paid`) |
| **NOWPayments** | USD (paid in crypto) | Anyone, incl. Russians abroad | `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET` | `/api/payments/nowpayments` |
| Test | any | Local development only (`PAYMENTS_TEST_MODE=1`, or admins in dev) | — | — |

Until a provider's keys are set, checkout says payments in that currency open soon. Admins can **comp** a package
from `/admin`. Alternatives if YooKassa isn't possible: Robokassa or CloudPayments (same adapter shape).

## Admin dashboard (`/admin`)

- **Celebrations** — every site, owner, occasion, package, expiry, RSVPs; comp a package.
- **Orders & revenue** — per-currency revenue, product mix, partner commission owed, refunds.
- **Pricing & packages** — every price (USD/INR/RUB), package features & limits, hosting rules and extensions, video
  tiers, AI allowances/credit costs, partner listing fees. Saved to `settings.pricing`; no deploys needed.
- **Promo codes** — % off, max uses, expiry, optionally tied to a partner.
- **Partners** — salons, planners, photographers, videographers, florists, bakeries, shops, online stores: free /
  featured / sponsored listings (shown at `/partners`), offers, referral link `/r/<code>` (60-day cookie), commission %,
  agreement notes, clicks and attributed orders.

## Subdomains & SSL

Set `ROOT_DOMAIN=festivelle.com` and `NEXT_PUBLIC_ROOT_DOMAIN=festivelle.com` in Vercel, add the apex and the
wildcard `*.festivelle.com` to the Vercel project (wildcards need the domain's nameservers on Vercel — Vercel then
issues SSL for every subdomain automatically). `src/proxy.ts` sends `<sub>.festivelle.com` to the site; Luxury
customers can also connect their own domain (Vercel Domains API).

## AI (free models)

`src/lib/ai.ts` calls **Experiential Labs** (`EXPLABS_API_KEY`; OpenAI-compatible at `https://api.experientiallabs.ai/v1`)
with `gpt-6-luna`, then `deepseek-v4.1-flash` — both $0 within the Free plan's shared pool (10 req/min, 250K tokens/min,
1M tokens/day, resets 00:00 UTC; a refunded $1 card verification unlocks it). On a 429 or outage it falls back to
OpenRouter free models, then to the rule-based designer, so the chat never breaks. Per-user metering
(`ai_usage`, `credits`) keeps one user from draining the shared pool. `/api/ai/write` writes invitation texts, wishes
and greetings (3 options). `/api/ai/visual` generates illustrations when `IMAGE_MODEL` is set (image models are not in
the free plan). Upgrade to Experiential Labs Pro ($20/mo, 10×) when traffic grows.

## Templates (62 complete suites)

`src/lib/catalog.ts` — every template is a matching suite (website, invitation, save-the-date/event card, story,
thank-you, video variant), structurally distinct rather than recoloured:

| Occasion | Count | Cultures / themes |
|---|---|---|
| Wedding | 16 | Indian, Russian, Goan Catholic, Muslim, fusion, Western |
| Engagement | 8 | |
| Anniversary | 6 | |
| Birthday | 8 | incl. 30 / 40 / 50 / 60 milestones |
| Children's party | 8 | |
| Baby shower | 6 | |
| Greetings | 10 | Diwali, Eid, Christmas, Russian New Year, Maslenitsa… |

Built from **15 card layouts** (classic, arch, editorial, monogram, botanical, photo, deco, jharokha, lace, polaroid,
confetti, watercolour, split, full-bleed, letterpress — `src/components/designs/layouts/cards.tsx`), **10 website
layouts** with signature reveals (romance, editorial, arch, cinematic, magazine, letter, timeline, gallery, deco curtain,
playful balloons — `src/components/site/heroes.tsx`), 19 colour worlds, ~29 hand-drawn SVG motifs and font pairings
that cover Cyrillic and Devanagari (`src/lib/fonts.ts`). No paid stock art: everything is SVG/CSS.
Admins feature, hide, reorder and group templates into seasonal collections at `/admin/templates`.

## Visual editor (in sync with the conversation)

Conversation stays first, but the preview is directly editable (“✎ Edit on preview”):
click any text to edit inline, click a photo to swap it, select a section to move/hide it; a floating toolbar sets
font pairing, size, alignment and a curated accent palette (free colour picker on Luxury). Undo/redo (⌘Z) and version
history (`doc_versions`). Chat and editor write the same design — one source of truth — and each visual edit is logged
as a quiet chat line (`messages.kind = 'edit'`) so the AI knows the context. **Point and ask:** select an element and
say “make this warmer” or “translate this to Russian”; the AI receives the selected element.

## Guests

- Guest list `/studio/[id]/guests`: households, per-event invitations, plus-ones, meal & dietary answers, CSV
  import/export, reminders to non-responders, per-guest WhatsApp/Telegram/email links.
- Personal links `?g=<token>` greet each guest by name, show only their events and pre-fill the RSVP.
- Guest photo uploads (Premium+) into a host-moderated gallery; a guest Q&A assistant on the live site answers only
  from the hosts' details (free models, metered on the host's allowance).

## Marketing & SEO

Public landing page at `/` (EN/RU/HI, live “talk → it designs itself” demo), `/templates` with filters,
`/templates/<id>` SEO pages (JSON-LD, Open Graph), `/invitations/<slug>` occasion/culture landing pages,
`sitemap.xml` and `robots.txt`. Signed-in users get a “Your studio” button.

## Workspaces & agencies (earlier pieces)

- **12 wedding pieces**, each designed and editable by chat: wedding website, invitation, save-the-date, event cards (haldi, mehendi, sangeet, ZAGS…), Instagram story / WhatsApp status, square post, welcome sign, order of ceremony, menu, table numbers, photo & hashtag sign, and thank-you card.
- **Template gallery:** 12 named templates per piece (Ashwem Dusk, Lisbon Letter, Maharani, Neva Monogram, Mogra Bloom, Haldi Sun, Noor Lantern, Starlit Sangeet, Assagao Portrait, Moscow Folk, Mehendi Ambi, Lotus Vows), plus 6 website templates. Every preview uses the couple's own names and date.
- **6 paper layouts** (classic frame, palace arch, editorial, monogram wreath, botanical border, photograph) and **3 website layouts** (romance, editorial, palace arch).
- **8 design worlds:** Konkan Sunset, Azulejo, Rajwada, Belaya Noch, Mogra, Gulmohar, Noor, Sangeet Night.
- **14 hand-drawn motifs**, with no AI images: Goan palms, azulejo, Mughal arch, silver birch, jasmine, marigold garland, jaali lattice, starlight, paisley, lotus, entwined rings, doves, Khokhloma berries, mandala.
- **Optional sacred invocations** (Shri Ganesh, Om, Ik Onkar, Bismillah, cross, Orthodox cross) are only ever added when the couple asks.
- **AI-first editing:** the chat knows which piece is open. “Make a menu”, “use the lotus motif”, “palace arch layout”, “write the menu in Russian”, “bigger names” and “table 7” all change that piece directly. The AI can only adjust whitelisted design fields, so the result always stays elegant.
- **Asset library:** each workspace gets a shared library of photographs, logos and monograms (Neon Object Storage, drag-and-drop) and the motif collection.
- **Multi-tenant workspaces:** one email can belong to many workspaces (personal or agency). Roles are owner, admin, designer (can edit), client and family (view only). Invitations are private join links, and a workspace switcher sits in the header.
- **Agencies:** weddings grouped by client, a brand kit (agency name, logo, signature on guest sites: “Designed by us”, “ours + yours” or none), and team management.
- **Export:** PNG at 3× resolution, and a print / save-as-PDF page for every piece.
- **Mobile-first studio:** chat is the main screen, and the design opens as a swipe-up sheet.
- **Support concierge:** a beating heart opens a romantic help card that continues privately on WhatsApp (+91 72186 78536) without looking like WhatsApp.

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

## Develop

```bash
npm install
neon deploy --env .env.local         # provisions services + pulls env
echo "NEON_AUTH_COOKIE_SECRET=$(openssl rand -base64 32)" >> .env.local
node --env-file=.env.local scripts/migrate.mjs
npm run dev
```

## Deploy (Vercel)

The GitHub repo `Akshay115/Festivelle-app` is connected to the Vercel project `lyvena/wedding-builder` (https://wedding-builder-two.vercel.app). Every push to `main` deploys. Environment variables live in Vercel (Production and Preview). For each new app domain:

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

## Data model

`settings` (pricing + template curation JSON), `doc_versions`, `guest_photos`, guests (+ household, events, token, plus-ones), `orders`, `promos`, `partners`, `credits`, `ai_usage`, `weddings` (+ `tier`, `video_tier`, `activated_at`, `expires_at`, `subdomain`; occasion in `profile.occasion`), `workspaces`, `members` (workspace × user × role), `invites`, `weddings` (belong to a workspace, with an optional client name), `documents` (one per piece: kind, layout, design JSON), `assets` (workspace library), `messages`, `guests`, `rsvps`. Run `node --env-file=.env.local scripts/migrate.mjs`. It's idempotent and backfills workspaces and starter pieces for older data.

## Roadmap

- **Next:** guest management by household and by event (who's invited to which event), and comments and approvals for clients.

Resend production domain, streaming AI replies (to hide free-model latency), AI-generated motifs and illustrations, more languages (Konkani, Marathi, Punjabi, Tamil), WhatsApp Business API sending, server-side MP4 rendering for videos, and seating plans.
