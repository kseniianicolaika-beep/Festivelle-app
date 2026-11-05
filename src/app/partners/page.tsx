import Link from "next/link";
import { sql } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
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
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <Link href="/" className="display text-2xl">{BRAND.name}</Link>
        <Link href="/pricing" className="text-sm text-muted underline-offset-4 hover:underline">Pricing</Link>
      </nav>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <p className="eyebrow text-rose">Trusted by our hosts</p>
          <h1 className="display mt-3 text-5xl md:text-7xl">The people who make it <em className="text-rose">magic</em></h1>
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href="/partners" className={`rounded-full px-4 py-1.5 ${!cat ? "bg-wine text-[#fbeee6]" : "bg-white/60 text-muted"}`}>Everyone</Link>
          {cats.map((c) => <Link key={c} href={`?cat=${encodeURIComponent(c)}`} className={`rounded-full px-4 py-1.5 capitalize ${cat === c ? "bg-wine text-[#fbeee6]" : "bg-white/60 text-muted"}`}>{c}</Link>)}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <a href={`/go/${p.id}`} target="_blank" rel="noopener sponsored" className={`group block h-full rounded-[28px] p-6 transition duration-500 hover:-translate-y-1 ${p.listing === "free" ? "glass" : "bg-white shadow-[0_30px_60px_-40px_rgba(74,20,36,.6)] ring-1 ring-gold/40"}`}>
                <p className="eyebrow text-muted">{p.category}{p.city ? ` · ${p.city}` : ""}{p.listing === "sponsored" ? " · sponsored" : ""}</p>
                <p className="display mt-2 text-3xl">{p.name}</p>
                {p.blurb && <p className="mt-2 text-sm text-muted">{p.blurb}</p>}
                {p.offer && <p className="mt-4 rounded-2xl bg-blush/40 px-4 py-2 text-sm text-wine">♥ {p.offer}</p>}
                <span className="mt-4 inline-block text-sm text-rose transition group-hover:translate-x-1">Visit →</span>
              </a>
            </Reveal>
          ))}
          {!rows.length && <p className="font-display text-2xl italic text-muted">Our partner circle is being curated.</p>}
        </div>
        <Reveal><p className="mt-16 text-center text-sm text-muted">Are you a salon, planner, photographer, florist, bakery or shop? Write to us via the heart ♥ to join.</p></Reveal>
      </div>
    </main>
  );
}

export const instant = false;
