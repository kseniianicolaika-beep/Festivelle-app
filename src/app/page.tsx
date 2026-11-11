import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getPricing, fmt, currencyFor, TIERS } from "@/lib/pricing";
import { OCCASIONS, OCCASION_IDS } from "@/lib/occasions";
import { featuredTemplates, activeCollections, publicCatalog } from "@/lib/template-admin";
import { templateById, type TemplateDef } from "@/lib/catalog";
import { bespokeFor } from "@/templates/registry";
import { sql } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
import { Wash } from "@/components/fx/Wash";
import { Petals } from "@/components/fx/Petals";
import { Reveal } from "@/components/fx/Reveal";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { COPY, DEMO, type Lang } from "@/components/marketing/copy";
import { SmoothScroll } from "@/components/marketing/landing/SmoothScroll";
import { HeroStage } from "@/components/marketing/landing/HeroStage";
import { ScrollStory } from "@/components/marketing/landing/ScrollStory";
import { PosterWall } from "@/components/marketing/landing/PosterWall";
import { OccasionIndex } from "@/components/marketing/landing/OccasionIndex";

export const metadata: Metadata = {
  title: `${BRAND.name} — invitations & celebration websites, designed by conversation`,
  description: "Romantic, AI-native invitations, wedding websites, video invitations and digital greetings. Talk, and it designs itself. Free to design — pay once to publish.",
  alternates: { canonical: "/" },
};

const HERO = ["maharani", "neva-monogram", "ashwem-dusk", "lotus-vows", "noor-nikah", "gatsby-vows"];
const MARQUEE = ["Wedding", "Свадьба", "विवाह", "Engagement", "Помолвка", "सगाई", "Anniversary", "Годовщина", "Birthday", "День рождения", "जन्मदिन", "Baby shower", "गोदभराई", "Greetings", "Открытки"];

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string; preview?: string }> }) {
  const q = await searchParams;
  // The public homepage lives on festivelle.love. Signed-in people go to their studio; ?preview=1 keeps
  // this legacy landing reachable for the team.
  if (q.preview !== "1") {
    const me = await currentUser().catch(() => null);
    redirect(me ? "/studio" : (process.env.SITE_URL || "https://festivelle.love") + (q.lang === "ru" ? "/ru/" : "/"));
  }
  const lang: Lang = q.lang === "ru" || q.lang === "hi" ? q.lang : "en";
  const L = COPY[lang];
  const [user, P, featured, collections, all, partners] = await Promise.all([
    currentUser().catch(() => null),
    getPricing(),
    featuredTemplates(8),
    activeCollections(),
    publicCatalog(),
    sql`SELECT name, category, city FROM partners WHERE active ORDER BY CASE listing WHEN 'sponsored' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END, name LIMIT 12`.catch(() => []) as Promise<{ name: string; category: string; city: string | null }[]>,
  ]);
  const cur = lang === "ru" ? "RUB" : lang === "hi" ? "INR" : currencyFor(null);
  // Prefer hand-composed (bespoke) templates on the stage; fall back gracefully while they're being finished.
  const heroAll = HERO.map(templateById).filter((t): t is TemplateDef => !!t);
  const heroBespoke = heroAll.filter((t) => bespokeFor(t.id));
  const hero = (heroBespoke.length >= 2 ? heroBespoke : heroAll).slice(0, 4);
  const occRows = OCCASION_IDS.map((o) => {
    const list = all.filter((t) => t.occasion === o);
    const t = list.find((x) => bespokeFor(x.id)) ?? list[0];
    return t ? { id: o, name: L.occ[o] ?? OCCASIONS[o].name, blurb: OCCASIONS[o].blurb, count: list.length, t } : null;
  }).filter((r): r is NonNullable<typeof r> => !!r);
  const words = L.h1a.split(/\s+/);

  return (
    <main lang={lang} className="relative min-h-dvh overflow-x-clip">
      <SmoothScroll />
      <SiteNav signedIn={!!user} cta={L.cta} lang={lang} />

      {/* ── Hero ── */}
      <section className="relative -mt-[76px] min-h-[100svh] overflow-hidden pt-[96px]">
        <Wash />
        <Petals count={9} className="absolute" />
        <div className="relative z-10 mx-auto grid max-w-[1320px] items-center gap-10 px-5 pb-16 md:px-10 lg:min-h-[calc(100svh-96px)] lg:grid-cols-[1.12fr_1fr] lg:gap-6">
          <div>
            <p className="kicker fade-up text-rose" style={{ ["--d" as string]: "100ms" }}>{L.eyebrow}</p>
            <h1 className="t-hero mt-7">
              {words.map((w, i) => <span key={i}><span className="wm"><span style={{ ["--i" as string]: i }}>{w}</span></span> </span>)}
              <span className="wm"><span style={{ ["--i" as string]: words.length }}><em className="text-rose">{L.h1b}</em></span></span>
            </h1>
            <p className="t-lede fade-up mt-8 max-w-[34rem]" style={{ ["--d" as string]: "700ms" }}>{L.sub}</p>
            <div className="fade-up mt-10 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "900ms" }}>
              <Link href="/studio/new" className="btn btn-dark !px-7 !py-4">{L.cta}<span className="btn-arrow">→</span></Link>
              <Link href="/templates" className="btn btn-ghost !px-7 !py-4">{L.browse}</Link>
            </div>
            <p className="fade-up mt-6 text-xs tracking-wide text-muted" style={{ ["--d" as string]: "1100ms" }}>{L.trust}</p>
          </div>
          <div className="fade-up" style={{ ["--d" as string]: "300ms" }}>
            <HeroStage list={hero} label={L.nowPlaying} />
          </div>
        </div>
        <div aria-hidden className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[.3em] text-muted lg:flex">
          {L.scroll}<span className="h-10 w-px overflow-hidden bg-line"><span className="block h-1/2 w-px animate-[drift_2.4s_ease-in-out_infinite] bg-wine/60" /></span>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-wrap relative z-10 overflow-hidden border-y border-line-strong bg-cream/60 py-5">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {MARQUEE.map((w, i) => <span key={i} className="flex items-center whitespace-nowrap px-6 font-display text-3xl italic text-ink/80 md:text-4xl">{w}<span className="ml-12 text-base not-italic text-gold">✦</span></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Talk → it designs itself ── */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-5 pt-24 md:px-10 md:pt-36">
        <Reveal>
          <p className="kicker text-rose">{L.demoEyebrow}</p>
          <h2 className="t-h1 mt-5 max-w-4xl">{L.demoH}</h2>
        </Reveal>
        <ScrollStory script={DEMO[lang]} chapters={L.chapters} labels={{ you: L.you, ai: BRAND.name, blank: L.blank }} />
      </section>

      {/* ── The wall ── */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="kicker text-rose">{L.featH}</p>
            <h2 className="t-h1 mt-5">{L.wallH}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lede">{L.wallSub}</p>
            <Link href="/templates" className="link-u mt-5 inline-block text-sm text-wine">{L.all} →</Link>
          </Reveal>
        </div>
        <div className="mt-16 md:mt-24"><PosterWall list={featured} /></div>
      </section>

      {collections.map((c) => (
        <section key={c.id} className="relative z-10 mx-auto max-w-[1320px] px-5 pb-24 md:px-10">
          <Reveal><p className="kicker text-rose">{L.collection}</p><h2 className="t-h2 mt-4">{c.name}</h2>{c.blurb && <p className="t-lede mt-3 max-w-xl">{c.blurb}</p>}</Reveal>
          <div className="mt-12"><PosterWall list={c.templates.slice(0, 8)} cols="grid" /></div>
        </section>
      ))}

      {/* ── Occasions ── */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-5 pb-24 md:px-10 md:pb-36">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-h1">{L.occH}</h2>
            <p className="t-lede max-w-sm">{L.occSub}</p>
          </div>
        </Reveal>
        <OccasionIndex rows={occRows} designs={L.designs} />
      </section>

      {/* ── Pricing (noir chapter) ── */}
      <section className="noir relative z-10 overflow-hidden px-5 py-28 md:px-10 md:py-40">
        <Petals count={8} colors={["#c5a06a", "#e8a3ab", "#f1dcb3"]} className="absolute opacity-60" />
        <div className="relative mx-auto max-w-[1320px]">
          <Reveal>
            <p className="kicker text-[#c5a06a]">{L.priceEyebrow}</p>
            <h2 className="t-h1 mt-5 max-w-3xl">{L.priceH}</h2>
            <p className="t-lede mt-6 max-w-xl !text-[#f6ece2]/70">{L.priceSub}</p>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-white/10 md:grid-cols-3">
            {TIERS.map((t, i) => {
              const pk = P.packages.wedding[t];
              return (
                <Reveal key={t} delay={i * 0.08} className="h-full">
                  <div className={`flex h-full flex-col p-8 md:p-10 ${t === "premium" ? "bg-[#2e1520]" : "bg-[#1f0f16]"}`}>
                    <p className="flex items-center justify-between"><span className="num text-lg text-[#c5a06a]">0{i + 1}</span>{t === "premium" && <span className="text-[10px] uppercase tracking-[.3em] text-[#e8a3ab]">most loved</span>}</p>
                    <p className="t-h3 mt-8">{pk.name}</p>
                    <p className="display foil mt-3 text-6xl" style={{ ["--foil-a" as string]: "#b88c4f", ["--foil-b" as string]: "#f6dfae" }}>{fmt(pk.price[cur], cur)}</p>
                    <ul className="mt-8 space-y-2.5 text-sm text-[#f6ece2]/75">{pk.features.slice(0, 4).map((f) => <li key={f} className="flex gap-3"><span className="text-[#c5a06a]">✦</span>{f}</li>)}</ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-8 text-sm text-[#f6ece2]/60">{L.priceMore} <Link href="/pricing" className="link-u text-[#f1dcb3]">{L.seePricing}</Link> · {L.from} {fmt(P.packages.celebration.basic.price[cur], cur)}</p>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
          <Reveal><p className="kicker text-rose">{L.partnersEyebrow}</p><h2 className="t-h2 mt-5">{L.partnersH}</h2></Reveal>
          <Reveal delay={0.1}><p className="t-lede">{L.partnersSub}</p><Link href="/partners" className="btn btn-ghost mt-6">{L.partnersCta}<span className="btn-arrow">→</span></Link></Reveal>
        </div>
        {partners.length > 0 && (
          <div className="marquee-wrap mt-14 overflow-hidden border-y border-line py-6 [--marquee-dur:60s]">
            <div className="marquee">
              {[0, 1].map((k) => <div key={k} className="flex shrink-0" aria-hidden={k === 1}>{partners.map((p) => <span key={p.name} className="whitespace-nowrap px-8"><span className="font-display text-2xl">{p.name}</span> <span className="text-sm text-muted">· {p.category}{p.city ? `, ${p.city}` : ""}</span></span>)}</div>)}
            </div>
          </div>
        )}
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 mx-auto grid max-w-[1320px] gap-10 px-5 pb-28 md:grid-cols-[1fr_1.5fr] md:px-10 md:pb-40">
        <Reveal><h2 className="t-h1 md:sticky md:top-28">{L.faqH}</h2></Reveal>
        <div className="border-t border-line-strong">
          {L.faq(P.hosting.maxMonths, P.hosting.afterEventDays).map(([qq, a], i) => (
            <details key={qq} className="group border-b border-line-strong py-7">
              <summary className="flex cursor-pointer list-none items-baseline gap-5 [&::-webkit-details-marker]:hidden">
                <span className="num text-base text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-h3 flex-1 !text-[clamp(1.35rem,1.1rem+1vw,2rem)]">{qq}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong text-rose transition duration-500 group-open:rotate-45 group-open:bg-wine group-open:text-white">+</span>
              </summary>
              <p className="mt-4 max-w-xl pl-10 leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final ── */}
      <section className="relative z-10 overflow-hidden px-5 pb-32 pt-10 text-center md:pb-44">
        <Aurora colors={["#f3c9cf", "#f6dfc4", "#efd3e2", "#fbe7dc"]} />
        <Reveal>
          <p className="script text-5xl text-rose md:text-6xl">{L.endScript}</p>
          <h2 className="t-h1 mx-auto mt-6 max-w-4xl">{L.endH}</h2>
          <Link href="/studio/new" className="btn btn-dark mt-12 !px-8 !py-4">{L.cta}<span className="btn-arrow">→</span></Link>
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}

