import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { templateById } from "@/lib/catalog";
import { publicCatalog } from "@/lib/template-admin";
import { OCCASIONS } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import { getPricing, fmt } from "@/lib/pricing";
import { Wash } from "@/components/fx/Wash";
import { SmoothScroll } from "@/components/marketing/landing/SmoothScroll";
import { PosterWall } from "@/components/marketing/landing/PosterWall";
import { LiveTemplate } from "@/components/marketing/Live";
import { bespokeFor } from "@/templates/registry";
import { MUSIC_NAMES, musicForOccasion } from "@/templates/_kit/music-meta";
import { KINDS, type Kind } from "@/lib/templates";
import { Reveal } from "@/components/fx/Reveal";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { CULTURES, siteOrigin } from "@/components/marketing/seo";

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = templateById((await params).id);
  if (!t) return {};
  const occ = OCCASIONS[t.occasion].name;
  return {
    title: `${t.name} — ${occ} invitation & website template`,
    description: `${t.blurb} Personalise free by conversation; publish your own link once you love it.`,
    alternates: { canonical: `/templates/${t.id}` },
    openGraph: { title: `${t.name} · ${occ} template`, description: t.blurb, type: "website" },
  };
}

export default async function TemplatePage({ params }: P) {
  const t = templateById((await params).id);
  if (!t) notFound();
  const [P, all] = await Promise.all([getPricing(), publicCatalog()]);
  if (!all.some((x) => x.id === t.id)) notFound();
  const group = OCCASIONS[t.occasion].group;
  const price = P.packages[group][t.tier].price.USD;
  const th = themeById(t.theme);
  const related = all.filter((x) => x.id !== t.id && x.occasion === t.occasion).slice(0, 4);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${t.name} — ${OCCASIONS[t.occasion].name} invitation template`,
    description: t.blurb,
    brand: { "@type": "Brand", name: "Festivelle" },
    url: `${siteOrigin()}/templates/${t.id}`,
    category: `${OCCASIONS[t.occasion].name} invitations`,
    offers: { "@type": "Offer", priceCurrency: "USD", price, availability: "https://schema.org/InStock" },
  };
  const B = bespokeFor(t.id);
  const music = B?.music ?? musicForOccasion(t.occasion);
  const kinds: Kind[] = t.occasion === "greeting" ? ["greeting", "post", "story"] : ["invite", "save", "story", "thankyou", "post", "menu"];
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <SmoothScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <SiteNav />
      <header className="relative -mt-[76px] overflow-hidden pt-[76px]">
        <Wash colors={[th.bg, th.petals[0] ?? th.gold, th.petals[1] ?? th.accent, "#fbe7dc"]} />
        <div className="relative z-10 mx-auto grid max-w-[1320px] gap-12 px-5 pb-16 pt-8 md:px-10 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:pt-16">
          <div>
            <p className="kicker fade-up text-rose"><Link href="/templates" className="link-u">Templates</Link> · <Link href={`/templates?occasion=${t.occasion}`} className="link-u">{OCCASIONS[t.occasion].name}</Link></p>
            <h1 className="t-hero mt-6"><span className="wm"><span>{t.name}</span></span></h1>
            <p className="t-lede fade-up mt-6 max-w-lg" style={{ ["--d" as string]: "400ms" }}>{t.blurb}</p>
            <dl className="fade-up mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-line-strong pt-6 text-sm" style={{ ["--d" as string]: "600ms" }}>
              <div><dt className="text-[10px] uppercase tracking-[.26em] text-muted">Opening</dt><dd className="mt-1 font-display text-lg italic">{B?.opening ?? "Signature reveal"}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-[.26em] text-muted">Music</dt><dd className="mt-1 font-display text-lg italic">♪ {MUSIC_NAMES[music]}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-[.26em] text-muted">Culture</dt><dd className="mt-1">{CULTURES[t.culture]}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-[.26em] text-muted">Publish from</dt><dd className="mt-1">{fmt(price, "USD")} <span className="text-muted">one-time</span></dd></div>
            </dl>
            <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "800ms" }}>
              <Link href={`/studio/new?template=${t.id}`} className="btn btn-dark !px-7 !py-4">Use this template — free<span className="btn-arrow">→</span></Link>
              <a href="#suite" className="btn btn-ghost !px-6 !py-4">See the suite</a>
            </div>
          </div>
          <div className="fade-up relative" style={{ ["--d" as string]: "200ms" }}>
            <div className="relative rounded-[28px] p-5 md:p-8" style={{ background: `radial-gradient(70% 60% at 50% 40%, ${th.gold}33, transparent 70%), ${th.bg}` }}>
              {t.occasion === "greeting" ? (
                <div className="mx-auto max-w-sm"><div className="poster-shadow overflow-hidden rounded-[3px]"><LiveTemplate t={t} play="mount" /></div></div>
              ) : (
                <div className="relative">
                  <LiveTemplate t={t} kind="website" device="browser" play="mount" scroll className="hidden w-[88%] md:block" />
                  <LiveTemplate t={t} kind="website" device="phone" play="mount" scroll className="mx-auto w-[62%] max-w-[300px] md:absolute md:-bottom-10 md:right-0 md:w-[30%]" />
                </div>
              )}
              <p className="mt-6 text-center text-[11px] uppercase tracking-[.24em] text-muted md:mt-14">Live preview — scroll inside the screens</p>
            </div>
          </div>
        </div>
      </header>

      <section id="suite" className="relative z-10 mx-auto max-w-[1320px] scroll-mt-24 px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <Reveal><p className="kicker text-rose">The suite</p><h2 className="t-h1 mt-4">Every piece, <em className="text-rose">in harmony</em></h2></Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-2 text-[15px] text-ink-soft">
              <li>✦ Website, invitation, save-the-date, story & thank-you card — one hand</li>
              <li>✦ Written in your names, in English, Русский or हिन्दी</li>
              <li>✦ Edit by chatting, or tap anything on the preview</li>
              <li>✦ RSVPs, gallery and your own link: names.festivelle.com</li>
            </ul>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 items-start gap-5 rounded-[28px] p-5 sm:grid-cols-3 md:gap-8 md:p-10 lg:grid-cols-6" style={{ background: th.bg }}>
          {kinds.map((k, i) => (
            <Reveal key={k} delay={i * 0.06} className={k === "thankyou" ? "col-span-2 sm:col-span-1" : ""}>
              <div className="poster-shadow overflow-hidden rounded-[2px]"><LiveTemplate t={t} kind={k} /></div>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[.24em]" style={{ color: th.muted }}>{KINDS[k].name}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-1.5">{t.styles.map((s) => <Link key={s} href={`/templates?style=${s}`} className="rounded-full border border-line-strong px-3 py-1 text-xs capitalize text-muted transition hover:border-wine hover:text-wine">{s}</Link>)}</div>
      </section>

      {related.length > 0 && (
        <section className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 md:px-10">
          <Reveal><h2 className="t-h2">More {OCCASIONS[t.occasion].name.toLowerCase()} designs</h2></Reveal>
          <div className="mt-12"><PosterWall list={related} cols="grid" /></div>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}

export const instant = false;
