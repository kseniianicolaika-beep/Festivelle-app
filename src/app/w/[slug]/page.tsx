import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWeddingBySlug } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { WeddingSite } from "@/components/WeddingSite";
import { coupleNames, formatDate } from "@/lib/profile";
import { petalColors, themeById } from "@/lib/themes";
import { t } from "@/lib/i18n";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { RsvpForm } from "./RsvpForm";


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
    if (user?.id !== w.owner_id) notFound();
  }
  const fn = process.env.NEON_FUNCTION_CALENDAR_BASE_URL;
  const theme = themeById(w.theme);
  const [a, b] = coupleNames(w.profile);
  return (
    <>
    <EnvelopeIntro id={w.slug} initials={`${a[0]}${b[0]}`} names={`${a} & ${b}`} label={t(w.profile.language).open} bg={theme.bg} accent={theme.accent} gold={theme.gold} ink={theme.ink} petals={petalColors(theme)} />
    <WeddingSite
      profile={w.profile}
      theme={theme}
      heroUrl={w.profile.heroKey ? `/api/media?key=${encodeURIComponent(w.profile.heroKey)}` : null}
      calendarUrl={fn && w.profile.events?.length ? `${fn.replace(/\/$/, "")}/?slug=${slug}` : null}
    >
      <RsvpForm slug={slug} lang={w.profile.language ?? "en"} />
    </WeddingSite>
    </>
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
