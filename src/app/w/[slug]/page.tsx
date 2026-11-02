import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWeddingBySlug, sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser } from "@/lib/db";
import { WeddingSite } from "@/components/WeddingSite";
import { coupleNames, formatDate } from "@/lib/profile";
import { petalColors, themeById } from "@/lib/themes";
import { t } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";
import type { Brand } from "@/lib/workspace";
import type { Design } from "@/lib/templates";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { RsvpForm } from "./RsvpForm";

const media = (k?: string | null) => (k ? `/api/media?key=${encodeURIComponent(k)}` : null);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = await getWeddingBySlug((await params).slug);
  if (!w) return {};
  const [a, b] = coupleNames(w.profile);
  return { title: `${a} & ${b}`, description: [formatDate(w.profile.date, w.profile.language), w.profile.venue || w.profile.city].filter(Boolean).join(" · "), robots: { index: false } };
}

export default async function Site({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = await getWeddingBySlug(slug);
  if (!w) notFound();
  if (!w.published) {
    const user = await currentUser();
    if (!user || !(await getWeddingForUser(w.id, user))) notFound();
  }
  const [site] = (await sql`SELECT layout, design FROM documents WHERE wedding_id = ${w.id} AND kind = 'website' ORDER BY position LIMIT 1`) as { layout: string; design: Design }[];
  const [ws] = (await sql`SELECT kind, brand FROM workspaces WHERE id = ${w.workspace_id}`) as { kind: string; brand: Brand }[];
  const fn = process.env.NEON_FUNCTION_CALENDAR_BASE_URL;
  const theme = themeById(site?.design.theme ?? w.theme);
  const [a, b] = coupleNames(w.profile);

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
      <EnvelopeIntro id={w.slug} initials={`${a[0]}${b[0]}`} names={`${a} & ${b}`} label={t(w.profile.language).open} bg={theme.bg} accent={theme.accent} gold={theme.gold} ink={theme.ink} petals={petalColors(theme)} />
      <WeddingSite
        profile={w.profile}
        theme={theme}
        layout={site?.layout}
        motif={site?.design.motif}
        credit={credit}
        heroUrl={media(w.profile.heroKey)}
        calendarUrl={fn && w.profile.events?.length ? `${fn.replace(/\/$/, "")}/?slug=${slug}` : null}
      >
        <RsvpForm slug={slug} lang={w.profile.language ?? "en"} />
      </WeddingSite>
    </>
  );
}

export const instant = false;
