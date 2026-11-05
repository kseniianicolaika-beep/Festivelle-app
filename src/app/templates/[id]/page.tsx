import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { templateById } from "@/lib/catalog";
import { publicCatalog } from "@/lib/template-admin";
import { OCCASIONS } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import { getPricing, fmt } from "@/lib/pricing";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { TemplatePreview } from "@/components/marketing/TemplatePreview";
import { TemplateGrid } from "@/components/marketing/TemplateGrid";
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
  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora colors={[th.bg, th.petals[0] ?? th.gold, th.petals[1] ?? th.accent, "#fbe7dc"]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <SiteNav />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 md:px-6">
        <p className="text-sm text-muted"><Link href="/templates" className="hover:text-ink">Templates</Link> / <Link href={`/templates?occasion=${t.occasion}`} className="hover:text-ink">{OCCASIONS[t.occasion].name}</Link></p>
        <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <div className="relative rounded-[32px] p-6 md:p-10" style={{ background: th.bg }}>
              <TemplatePreview t={t} animate className="mx-auto max-w-sm shadow-[0_50px_90px_-40px_rgba(74,20,36,.7)]" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                {(["save", "story", "thankyou"] as const).map((k) => <TemplatePreview key={k} t={t} kind={k} className="shadow-md" />)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-rose">{OCCASIONS[t.occasion].name} · {CULTURES[t.culture]}</p>
            <h1 className="display mt-3 text-5xl leading-[1.05] md:text-6xl">{t.name}</h1>
            <p className="mt-4 font-display text-2xl italic text-muted">{t.blurb}</p>
            <ul className="mt-6 space-y-1.5 text-sm">
              <li>♡ A matching suite: website, invitation, save-the-date, story & thank-you card</li>
              <li>♡ Written in your names, in English, Русский or हिन्दी</li>
              <li>♡ Edit by chatting or tap anything in the preview</li>
              <li>♡ RSVPs, gallery and your own link: names.festivelle.com</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-1.5">{t.styles.map((s) => <Link key={s} href={`/templates?style=${s}`} className="rounded-full bg-white/60 px-3 py-1 text-xs capitalize text-muted">{s}</Link>)}</div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`/studio/new?template=${t.id}`} className="btn btn-dark">Use this template — free</Link>
              <span className="text-sm text-muted">Publish from {fmt(price, "USD")}, one-time</span>
            </div>
          </Reveal>
        </div>
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="display text-3xl">More {OCCASIONS[t.occasion].name.toLowerCase()} designs</h2>
            <div className="mt-6"><TemplateGrid list={related} /></div>
          </section>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}

export const instant = false;
