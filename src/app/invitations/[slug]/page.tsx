import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicCatalog } from "@/lib/template-admin";
import { OCCASIONS } from "@/lib/occasions";
import { getPricing, fmt, TIERS } from "@/lib/pricing";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { TemplateGrid } from "@/components/marketing/TemplateGrid";
import { SEO_PAGES, seoBySlug, siteOrigin } from "@/components/marketing/seo";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = seoBySlug((await params).slug);
  if (!s) return {};
  return { title: s.title, description: s.intro, alternates: { canonical: `/invitations/${s.slug}` }, openGraph: { title: s.title, description: s.intro } };
}

const STEPS = [
  ["Talk", "Tell us names, date, place and the feeling. One gentle question at a time."],
  ["Watch it design itself", "Invitation, website and cards appear as you answer — then tap anything to fine-tune."],
  ["Share your link", "Pay once and it’s live at your own address, with RSVPs arriving in real time."],
];

export default async function SeoLanding({ params }: P) {
  const s = seoBySlug((await params).slug);
  if (!s) notFound();
  const [all, P] = await Promise.all([publicCatalog(), getPricing()]);
  const list = all.filter((t) => t.occasion === s.occasion && (!s.culture || t.culture === s.culture));
  const shown = list.length ? list : all.filter((t) => t.occasion === s.occasion);
  const pk = P.packages[OCCASIONS[s.occasion].group];
  const faq = [
    { q: "Is it really free to design?", a: "Yes. Browse, personalise, preview on phone and desktop and save drafts for free. You pay once only when you publish or download." },
    { q: "How long does my link stay online?", a: `Up to ${P.hosting.maxMonths} months, and until ${P.hosting.afterEventDays} days after your event — extend any time, never auto-renewed.` },
    { q: "Can guests read it in Russian or Hindi?", a: "Yes — English, Русский and हिन्दी, and the AI writes the wording in your guests’ language." },
    { q: "Which payment methods?", a: "Russian cards, МИР and СБП, UPI and Indian cards, international cards, and crypto." },
  ];
  const ld = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "ItemList", name: s.h1, itemListElement: shown.slice(0, 20).map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteOrigin()}/templates/${t.id}`, name: t.name })) },
  ];
  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <SiteNav />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 md:px-6">
        <Reveal>
          <p className="eyebrow text-rose">{OCCASIONS[s.occasion].name}</p>
          <h1 className="display mt-3 max-w-4xl text-5xl leading-[1.05] md:text-7xl">{s.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{s.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={`/studio/new?occasion=${s.occasion}`} className="btn btn-dark">Start designing — free</Link>
            <span className="text-sm text-muted">Publish from {fmt(pk[TIERS[0]].price.USD, "USD")} · {fmt(pk[TIERS[0]].price.INR, "INR")} · {fmt(pk[TIERS[0]].price.RUB, "RUB")}</span>
          </div>
        </Reveal>
        <div className="mt-16"><TemplateGrid list={shown} /></div>
        <section className="mt-24 grid gap-5 md:grid-cols-3">
          {STEPS.map(([h, b], i) => (
            <Reveal key={h} delay={i * 0.08}>
              <div className="glass h-full rounded-[28px] p-7"><p className="script text-4xl text-rose">{i + 1}</p><p className="display mt-2 text-2xl">{h}</p><p className="mt-2 text-sm text-muted">{b}</p></div>
            </Reveal>
          ))}
        </section>
        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className="display text-4xl">Questions, answered</h2>
          <div className="mt-6 divide-y divide-line">
            {faq.map((f) => <details key={f.q} className="group py-4"><summary className="cursor-pointer list-none font-display text-xl">{f.q}<span className="float-right text-rose transition group-open:rotate-45">+</span></summary><p className="mt-2 text-muted">{f.a}</p></details>)}
          </div>
        </section>
        <nav className="mt-20 flex flex-wrap gap-2 text-sm">{SEO_PAGES.filter((p) => p.slug !== s.slug).map((p) => <Link key={p.slug} href={`/invitations/${p.slug}`} className="rounded-full bg-white/60 px-3 py-1 text-muted hover:text-ink">{p.h1}</Link>)}</nav>
      </div>
      <SiteFooter />
    </main>
  );
}

