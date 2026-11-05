import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@/lib/auth/server";
import { getPricing, fmt, currencyFor, TIERS } from "@/lib/pricing";
import { OCCASIONS, OCCASION_IDS } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import { featuredTemplates, activeCollections } from "@/lib/template-admin";
import { sql } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import { Paper } from "@/components/designs/Paper";
import { Aurora } from "@/components/fx/Aurora";
import { Petals } from "@/components/fx/Petals";
import { Reveal } from "@/components/fx/Reveal";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { TemplateGrid } from "@/components/marketing/TemplateGrid";
import { TalkDemo } from "@/components/marketing/TalkDemo";
import { COPY, DEMO, type Lang } from "@/components/marketing/copy";

export const metadata: Metadata = {
  title: `${BRAND.name} — invitations & celebration websites, designed by conversation`,
  description: "Romantic, AI-native invitations, wedding websites, video invitations and digital greetings. Talk, and it designs itself. Free to design — pay once to publish.",
  alternates: { canonical: "/" },
};

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const q = await searchParams;
  const lang: Lang = q.lang === "ru" || q.lang === "hi" ? q.lang : "en";
  const L = COPY[lang];
  const [user, P, featured, collections, partners] = await Promise.all([
    currentUser().catch(() => null),
    getPricing(),
    featuredTemplates(8),
    activeCollections(),
    sql`SELECT name, category, city FROM partners WHERE active ORDER BY CASE listing WHEN 'sponsored' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END, name LIMIT 8`.catch(() => []) as Promise<{ name: string; category: string; city: string | null }[]>,
  ]);
  const cur = lang === "ru" ? "RUB" : lang === "hi" ? "INR" : currencyFor(null);
  const hero = themeById("konkan-sunset");

  return (
    <main lang={lang} className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <Petals count={12} />
      <SiteNav signedIn={!!user} cta={L.cta} />
      <div className="relative z-10 mx-auto -mt-2 flex max-w-6xl justify-end gap-1 px-5 text-xs md:px-6">
        {(["en", "ru", "hi"] as Lang[]).map((l) => <Link key={l} href={l === "en" ? "/" : `/?lang=${l}`} className={`rounded-full px-2.5 py-1 ${l === lang ? "bg-wine text-[#fbeee6]" : "text-muted hover:text-ink"}`}>{l === "en" ? "EN" : l === "ru" ? "RU" : "हि"}</Link>)}
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-8 md:grid-cols-[1.15fr_1fr] md:px-6 md:pt-14">
        <Reveal>
          <p className="eyebrow text-rose">{L.eyebrow}</p>
          <h1 className="display mt-4 text-[3.2rem] leading-[0.98] md:text-[5.6rem]">{L.h1a} <em className="text-rose">{L.h1b}</em></h1>
          <p className="mt-6 max-w-lg text-lg text-muted">{L.sub}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={user ? "/studio/new" : "/studio/new"} className="btn btn-dark">{L.cta}</Link>
            <Link href="/templates" className="btn btn-ghost">{L.browse}</Link>
          </div>
          <p className="mt-5 text-xs text-muted">{L.trust}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mx-auto w-full max-w-[380px] [perspective:1400px]">
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(233,186,160,.55),transparent)] blur-2xl" />
            <div className="relative rotate-[-3deg] transition duration-700 hover:rotate-0">
              <Paper kind="invite" layout="arch" design={{ motif: "palms" }} profile={{ occasion: "wedding", partner1: lang === "ru" ? "Анна" : "Anya", partner2: lang === "ru" ? "Рохан" : "Rohan", date: "2027-02-14", venue: "Ashwem Beach", city: "Goa", language: lang }} theme={hero} className="shadow-[0_60px_100px_-40px_rgba(74,20,36,.75)]" />
            </div>
            <div className="absolute -bottom-6 -left-8 hidden w-36 rotate-[8deg] md:block">
              <Paper kind="save" layout="monogram" design={{ motif: "rings" }} profile={{ occasion: "wedding", partner1: "Anya", partner2: "Rohan", date: "2027-02-14", city: "Goa", language: lang }} theme={themeById("belaya-noch")} animate={false} className="shadow-xl" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Talk demo */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 md:px-6">
        <Reveal><p className="eyebrow text-rose">{L.demoEyebrow}</p><h2 className="display mt-3 max-w-2xl text-4xl md:text-6xl">{L.demoH}</h2></Reveal>
        <div className="mt-10"><TalkDemo script={DEMO[lang]} labels={{ you: L.you, ai: BRAND.name }} /></div>
      </section>

      {/* Occasions */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 md:px-6">
        <Reveal><h2 className="display text-4xl md:text-6xl">{L.occH}</h2></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {OCCASION_IDS.map((o, i) => {
            const occ = OCCASIONS[o];
            const th = themeById(occ.theme);
            return (
              <Reveal key={o} delay={i * 0.05}>
                <Link href={`/templates?occasion=${o}`} className="group block h-full overflow-hidden rounded-[24px] p-5 transition duration-700 hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-40px_rgba(74,20,36,.7)]" style={{ background: th.bg, color: th.ink }}>
                  <p className="display text-2xl">{L.occ[o] ?? occ.name}</p>
                  <p className="mt-2 text-xs opacity-70">{occ.blurb}</p>
                  <span className="mt-4 inline-block text-sm transition group-hover:translate-x-1" style={{ color: th.accent }}>→</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Featured templates & collections */}
      {collections.map((c) => (
        <section key={c.id} className="relative z-10 mx-auto max-w-6xl px-5 py-14 md:px-6">
          <Reveal><p className="eyebrow text-rose">{L.collection}</p><h2 className="display mt-2 text-4xl">{c.name}</h2>{c.blurb && <p className="mt-2 text-muted">{c.blurb}</p>}</Reveal>
          <div className="mt-8"><TemplateGrid list={c.templates.slice(0, 8)} /></div>
        </section>
      ))}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <Reveal><h2 className="display text-4xl md:text-6xl">{L.featH}</h2></Reveal>
          <Link href="/templates" className="whitespace-nowrap text-sm text-rose">{L.all} →</Link>
        </div>
        <div className="mt-10"><TemplateGrid list={featured} /></div>
      </section>

      {/* Pricing teaser */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 md:px-6">
        <Reveal><p className="eyebrow text-rose">{L.priceEyebrow}</p><h2 className="display mt-3 text-4xl md:text-6xl">{L.priceH}</h2><p className="mt-4 max-w-xl text-muted">{L.priceSub}</p></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TIERS.map((t, i) => {
            const pk = P.packages.wedding[t];
            return (
              <Reveal key={t} delay={i * 0.07}>
                <div className={`h-full rounded-[28px] p-7 ${t === "premium" ? "bg-wine text-[#fbeee6] shadow-[0_40px_80px_-40px_rgba(74,20,36,.8)]" : "glass"}`}>
                  <p className="display text-3xl">{pk.name}</p>
                  <p className="display mt-3 text-5xl">{fmt(pk.price[cur], cur)}</p>
                  <ul className="mt-5 space-y-1.5 text-sm opacity-90">{pk.features.slice(0, 3).map((f) => <li key={f}>♡ {f}</li>)}</ul>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted">{L.priceMore} <Link href="/pricing" className="text-rose underline-offset-4 hover:underline">{L.seePricing}</Link> · {L.from} {fmt(P.packages.celebration.basic.price[cur], cur)}</p>
      </section>

      {/* Partners */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 md:px-6">
        <div className="glass rounded-[32px] p-8 md:p-12">
          <Reveal><p className="eyebrow text-rose">{L.partnersEyebrow}</p><h2 className="display mt-3 text-4xl md:text-5xl">{L.partnersH}</h2><p className="mt-3 max-w-xl text-muted">{L.partnersSub}</p></Reveal>
          {partners.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{partners.map((p) => <span key={p.name} className="rounded-full bg-white/70 px-4 py-2 text-sm"><span className="font-display text-lg">{p.name}</span> <span className="text-muted">· {p.category}{p.city ? `, ${p.city}` : ""}</span></span>)}</div>}
          <Link href="/partners" className="btn btn-ghost mt-8">{L.partnersCta}</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-20 md:px-6">
        <Reveal><h2 className="display text-4xl md:text-5xl">{L.faqH}</h2></Reveal>
        <div className="mt-8 divide-y divide-line">
          {L.faq(P.hosting.maxMonths, P.hosting.afterEventDays).map(([qq, a]) => (
            <details key={qq} className="group py-5"><summary className="cursor-pointer list-none font-display text-xl md:text-2xl">{qq}<span className="float-right text-rose transition group-open:rotate-45">+</span></summary><p className="mt-3 text-muted">{a}</p></details>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 text-center">
        <Reveal><p className="script text-4xl text-rose">{L.endScript}</p><h2 className="display mx-auto mt-3 max-w-3xl text-5xl md:text-7xl">{L.endH}</h2><Link href="/studio/new" className="btn btn-dark mt-10">{L.cta}</Link></Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}

export const instant = false;
