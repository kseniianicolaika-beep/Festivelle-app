import { notFound } from "next/navigation";
import { getWeddingBySlug, sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser } from "@/lib/db";
import { WeddingSite } from "@/components/WeddingSite";
import { coupleNames, formatDate } from "@/lib/profile";
import { petalColors, themeById } from "@/lib/themes";
import { t } from "@/lib/i18n";
import { BRAND, SITE_URL } from "@/lib/brand";
import type { Brand } from "@/lib/workspace";
import type { Design } from "@/lib/templates";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { RsvpForm } from "./RsvpForm";
import { GuestGallery } from "./GuestGallery";
import { GuestAssistant } from "./GuestAssistant";
import { isExpired } from "@/lib/commerce";
import { displayNames, occasionOf, OCCASIONS } from "@/lib/occasions";
import { bespokeFor } from "@/templates/registry";
import { Music } from "@/templates/_kit/Music";
import { musicForOccasion } from "@/templates/_kit/music-meta";

function Expired({ names }: { names: string }) {
  return (
    <main className="grain flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="eyebrow text-rose">{names}</p>
      <h1 className="display mt-4 max-w-xl text-5xl leading-tight">This celebration has become <em className="text-rose">a memory</em></h1>
      <p className="mt-5 max-w-md text-muted">The hosts’ page is resting now. If you’re one of them, sign in to bring it back with a hosting extension.</p>
      <p className="script mt-8 text-3xl text-rose">with love</p>
      <a href={SITE_URL} className="mt-10 text-xs uppercase tracking-[0.25em] text-muted hover:text-rose">Made with Festivelle — create your own</a>
    </main>
  );
}

const media = (k?: string | null) => (k ? `/api/media?key=${encodeURIComponent(k)}` : null);

// Shared by /w/[slug], personal subdomains (anna-mark.festivelle.com) and custom domains.
export async function SiteBySlug({ slug, g }: { slug: string; g?: string | null }) {
  const w = await getWeddingBySlug(slug);
  if (!w) notFound();
  // No public link before payment: unpublished drafts are visible to their own team only (as a preview).
  const member = !w.published || isExpired(w) ? await currentUser().then((u) => (u ? getWeddingForUser(w.id, u) : null)) : null;
  if (!w.published && !member) notFound();
  if (isExpired(w) && !member) return <Expired names={displayNames(w.profile)} />;
  const [site] = (await sql`SELECT layout, design FROM documents WHERE wedding_id = ${w.id} AND kind = 'website' ORDER BY position LIMIT 1`) as { layout: string; design: Design }[];
  const [ws] = (await sql`SELECT kind, brand FROM workspaces WHERE id = ${w.workspace_id}`) as { kind: string; brand: Brand }[];
  const fn = process.env.NEON_FUNCTION_CALENDAR_BASE_URL;
  const theme = themeById(site?.design.theme ?? w.theme);
  const [a, b] = coupleNames(w.profile);

  // Personal link (?g=token): greet the guest, show only their events, pre-fill the RSVP.
  const guest = g && /^[a-z0-9]{8,20}$/.test(g)
    ? ((await sql`UPDATE guests SET opened_at = COALESCE(opened_at, now()) WHERE wedding_id = ${w.id} AND token = ${g}
        RETURNING token, name, email, plus_ones, events`) as { token: string; name: string; email: string | null; plus_ones: number; events: string[] | null }[])[0]
    : undefined;
  const allEvents = w.profile.events ?? [];
  const visibleEvents = guest?.events?.length ? allEvents.filter((e) => guest.events!.includes(e.name)) : allEvents;
  const profile = { ...w.profile, events: visibleEvents };
  const lang = w.profile.language ?? "en";
  const guestUploads = (w.tier === "premium" || w.tier === "luxury") && occasionOf(w.profile) !== "greeting";

  // Agency white-label signature (brand kit) or a gentle credit for personal weddings.
  const brand = ws?.brand ?? {};
  const agency = ws?.kind === "agency" && brand.name;
  const credit =
    agency && brand.credit === "hidden" ? null : agency ? (
      <span className="inline-flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {brand.logoKey && <img src={media(brand.logoKey)!} alt="" className="h-6 w-auto" />}
        Designed with love by {brand.name}{brand.credit === "show" ? ` · made with ${BRAND.name}` : ""}
      </span>
    ) : (
      <span>made with ♥ on {BRAND.name}</span>
    );

  return (
    <>
      <EnvelopeIntro id={w.slug} initials={OCCASIONS[occasionOf(w.profile)].pair && w.profile.partner2 ? `${a[0]}${b[0]}` : a[0]} names={displayNames(w.profile)} label={t(w.profile.language).open} bg={theme.bg} accent={theme.accent} gold={theme.gold} ink={theme.ink} petals={petalColors(theme)} />
      <WeddingSite
        profile={profile}
        theme={theme}
        layout={site?.layout}
        design={site?.design}
        motif={site?.design.motif}
        credit={credit}
        heroUrl={media(w.profile.heroKey)}
        calendarUrl={fn && w.profile.events?.length ? `${fn.replace(/\/$/, "")}/?slug=${slug}` : null}
      >
        <RsvpForm slug={slug} lang={lang} guest={guest ? { token: guest.token, name: guest.name, email: guest.email, plusOnes: guest.plus_ones } : null} events={visibleEvents.map((e) => e.name)} audience={OCCASIONS[occasionOf(w.profile)].group === "business" ? "business" : OCCASIONS[occasionOf(w.profile)].pair ? "couple" : "hosts"} />
      </WeddingSite>
      {w.published && <GuestGallery slug={slug} canUpload={guestUploads} lang={lang} guestName={guest?.name} />}
      {/* Generative ambient score — off until a guest taps "♪ Play our song". */}
      <Music id={bespokeFor(site?.design.template)?.music ?? musicForOccasion(occasionOf(w.profile))} lang={lang} accent={site?.design.palette?.accent ?? theme.accent} ink={site?.design.palette?.ink ?? theme.ink} bg={theme.dark ? "rgba(18,10,12,.55)" : undefined} />
      {w.published && occasionOf(w.profile) !== "greeting" && <GuestAssistant slug={slug} g={guest?.token} lang={lang} />}
    </>
  );
}

