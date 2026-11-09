import Link from "next/link";
import { sql } from "@/lib/db";
import { Wash } from "@/components/fx/Wash";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { Reveal } from "@/components/fx/Reveal";

type P = { id: string; name: string; category: string; city: string | null; blurb: string | null; offer: string | null; listing: string; url: string | null };

// Trusted vendors. Sponsored & featured partners first; every outbound click is counted.
export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ cat?: string; city?: string }> }) {
  const { cat, city } = await searchParams;
  const rows = (await sql`SELECT id, name, category, city, blurb, offer, listing, url FROM partners WHERE active
    AND (${cat ?? null}::text IS NULL OR category = ${cat ?? null}) AND (${city ?? null}::text IS NULL OR city ILIKE ${city ?? ""})
    ORDER BY CASE listing WHEN 'sponsored' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END, name`) as P[];
  const cats = [...new Set(((await sql`SELECT DISTINCT category FROM partners WHERE active ORDER BY 1`) as { category: string }[]).map((r) => r.category))];
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <SiteNav />
      <Wash />
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 pt-10 md:px-10 md:pt-16">
        <p className="kicker fade-up text-rose">Trusted by our hosts</p>
        <h1 className="t-hero mt-6 max-w-5xl">{["The", "people", "who", "make", "it"].map((w, i) => <span key={w}><span className="wm"><span style={{ ["--i" as string]: i }}>{w}</span></span> </span>)}<span className="wm"><span style={{ ["--i" as string]: 5 }}><em className="text-rose">magic</em></span></span></h1>
        <p className="t-lede fade-up mt-6 max-w-xl" style={{ ["--d" as string]: "400ms" }}>Planners, photographers, florists, bakers and venues — with offers for Festivelle hosts.</p>
        <div className="scroll-hide mt-12 flex gap-1.5 overflow-x-auto border-y border-line-strong py-3 text-[13px]">
          <Link href="/partners" className={`whitespace-nowrap rounded-full px-4 py-1.5 ${!cat ? "bg-wine text-[#fbeee6]" : "text-ink-soft hover:bg-white/70"}`}>Everyone</Link>
          {cats.map((c) => <Link key={c} href={`?cat=${encodeURIComponent(c)}`} className={`whitespace-nowrap rounded-full px-4 py-1.5 capitalize ${cat === c ? "bg-wine text-[#fbeee6]" : "text-ink-soft hover:bg-white/70"}`}>{c}</Link>)}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <a href={`/go/${p.id}`} target="_blank" rel="noopener sponsored" className={`group block h-full rounded-[24px] p-7 transition duration-700 ease-[var(--ease-expo)] hover:-translate-y-1.5 ${p.listing === "free" ? "border border-line-strong bg-white/40" : "bg-white shadow-[0_30px_60px_-40px_rgba(74,20,36,.6)] ring-1 ring-gold/40"}`}>
                <p className="eyebrow text-muted">{p.category}{p.city ? ` · ${p.city}` : ""}{p.listing === "sponsored" ? " · sponsored" : ""}</p>
                <p className="t-h3 mt-3">{p.name}</p>
                {p.blurb && <p className="mt-2 text-sm text-muted">{p.blurb}</p>}
                {p.offer && <p className="mt-4 rounded-2xl bg-blush/40 px-4 py-2 text-sm text-wine">♥ {p.offer}</p>}
                <span className="mt-4 inline-block text-sm text-rose transition group-hover:translate-x-1">Visit →</span>
              </a>
            </Reveal>
          ))}
          {!rows.length && <p className="font-display text-2xl italic text-muted">Our partner circle is being curated.</p>}
        </div>
        <Reveal><p className="t-lede mt-20 text-center">Are you a salon, planner, photographer, florist, bakery or shop? Write to us via the heart ♥ to join.</p></Reveal>
      </div>
      <SiteFooter />
    </main>
  );
}

