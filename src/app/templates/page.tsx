import type { Metadata } from "next";
import Link from "next/link";
import { publicCatalog } from "@/lib/template-admin";
import { OCCASIONS, OCCASION_IDS, isOccasion } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import type { Culture, Style, TemplateDef } from "@/lib/catalog";
import { Wash } from "@/components/fx/Wash";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { PosterWall } from "@/components/marketing/landing/PosterWall";
import { SmoothScroll } from "@/components/marketing/landing/SmoothScroll";
import { CULTURES, LANGS } from "@/components/marketing/seo";

export const metadata: Metadata = {
  title: "Invitation & website templates — weddings, birthdays, baby showers",
  description: "Beautiful invitation and celebration website templates you personalise by conversation. Weddings, engagements, birthdays, kids' parties, baby showers, anniversaries and greetings.",
  alternates: { canonical: "/templates" },
};

type Q = { occasion?: string; culture?: string; style?: string; colour?: string; lang?: string };

function Chips({ name, value, options, q, label }: { name: keyof Q; value?: string; options: [string, string][]; q: Q; label: string }) {
  const href = (v?: string) => {
    const p = new URLSearchParams(Object.entries({ ...q, [name]: v }).filter(([, x]) => x) as [string, string][]);
    const s = p.toString();
    return s ? `/templates?${s}` : "/templates";
  };
  return (
    <div className="scroll-hide flex items-center gap-1 overflow-x-auto">
      <span className="w-20 shrink-0 text-[10px] uppercase tracking-[.26em] text-muted">{label}</span>
      <Link href={href(undefined)} scroll={false} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition ${!value ? "bg-wine text-[#fbeee6]" : "text-ink-soft hover:bg-white/70"}`}>All</Link>
      {options.map(([v, l]) => (
        <Link key={v} href={href(v)} scroll={false} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] capitalize transition ${value === v ? "bg-wine text-[#fbeee6]" : "text-ink-soft hover:bg-white/70"}`}>{l}</Link>
      ))}
    </div>
  );
}

function filterCatalog(list: TemplateDef[], q: Q) {
  return list.filter(
    (t) =>
      (!q.occasion || t.occasion === q.occasion) &&
      (!q.culture || t.culture === q.culture) &&
      (!q.style || t.styles.includes(q.style as Style)) &&
      (!q.colour || t.theme === q.colour) &&
      (!q.lang || (t.sample.language ?? "en") === q.lang),
  );
}

export default async function Templates({ searchParams }: { searchParams: Promise<Q> }) {
  const q = await searchParams;
  const all = await publicCatalog();
  const list = filterCatalog(all, q);
  const uniq = <T,>(xs: T[]) => [...new Set(xs)];
  const cultures = uniq(all.map((t) => t.culture)) as Culture[];
  const styles = uniq(all.flatMap((t) => t.styles));
  const themes = uniq(all.map((t) => t.theme));
  const langs = uniq(all.map((t) => t.sample.language ?? "en"));
  const occ = isOccasion(q.occasion) ? OCCASIONS[q.occasion].name : null;
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <SmoothScroll />
      <SiteNav />
      <header className="relative -mt-[76px] overflow-hidden pt-[76px]">
        <Wash />
        <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-20">
          <p className="kicker fade-up text-rose">{all.length ? `${all.length} hand-finished suites` : "The collection"}</p>
          <h1 className="t-hero mt-6 max-w-5xl">
            {occ ? <><span className="wm"><span>{occ}</span></span> <span className="wm"><span style={{ ["--i" as string]: 1 }}><em className="text-rose">templates</em></span></span></> : (
              <>{["Find", "the", "one", "that"].map((w, i) => <span key={w}><span className="wm"><span style={{ ["--i" as string]: i }}>{w}</span></span> </span>)}<span className="wm"><span style={{ ["--i" as string]: 4 }}><em className="text-rose">feels like you</em></span></span></>
            )}
          </h1>
          <p className="t-lede fade-up mt-7 max-w-2xl" style={{ ["--d" as string]: "500ms" }}>Every design is a complete suite — website, invitation, save-the-date, story and thank-you card — with its own opening and its own music, already written in your names. Personalise it free, by talking or by tapping.</p>
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 md:px-10">
        <div className="sticky top-[68px] z-30 -mx-2 space-y-1.5 rounded-[26px] border border-white/70 bg-[rgba(251,246,241,.82)] p-3 shadow-[0_20px_50px_-36px_rgba(74,20,36,.5)] backdrop-blur-xl md:top-[76px]">
          <Chips name="occasion" label="Occasion" value={q.occasion} q={q} options={OCCASION_IDS.map((o) => [o, OCCASIONS[o].name])} />
          <details className="group md:open:pb-1">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-1 pt-1 text-[11px] uppercase tracking-[.24em] text-muted [&::-webkit-details-marker]:hidden"><span className="grid h-5 w-5 place-items-center rounded-full border border-line-strong text-[10px] transition group-open:rotate-45">+</span>Refine — culture, style, colour, language{(q.culture || q.style || q.colour || q.lang) && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-rose" />}</summary>
            <div className="mt-2 space-y-1.5">
              {cultures.length > 1 && <Chips name="culture" label="Culture" value={q.culture} q={q} options={cultures.map((c) => [c, CULTURES[c] ?? c])} />}
              {styles.length > 1 && <Chips name="style" label="Style" value={q.style} q={q} options={styles.map((s) => [s, s])} />}
              {themes.length > 1 && (
                <div className="scroll-hide flex items-center gap-2 overflow-x-auto py-1">
                  <span className="w-20 shrink-0 text-[10px] uppercase tracking-[.26em] text-muted">Colour</span>
                  {themes.map((id) => {
                    const th = themeById(id);
                    const p = new URLSearchParams(Object.entries({ ...q, colour: q.colour === id ? undefined : id }).filter(([, x]) => x) as [string, string][]).toString();
                    return <Link key={id} scroll={false} href={p ? `/templates?${p}` : "/templates"} title={th.name} aria-label={th.name} className={`h-7 w-7 shrink-0 rounded-full ring-offset-2 ring-offset-ivory transition hover:scale-110 ${q.colour === id ? "ring-2 ring-wine" : "ring-1 ring-line"}`} style={{ background: `conic-gradient(from 210deg, ${th.bg}, ${th.accent}, ${th.gold}, ${th.bg})` }} />;
                  })}
                </div>
              )}
              {langs.length > 1 && <Chips name="lang" label="Language" value={q.lang} q={q} options={langs.map((l) => [l, LANGS[l]])} />}
            </div>
          </details>
        </div>
        <p className="mt-10 text-sm text-muted"><span className="num text-lg text-ink">{list.length}</span> {list.length === 1 ? "design" : "designs"}{occ ? ` for ${occ.toLowerCase()}` : ""}</p>
        <div className="mt-10"><PosterWall list={list} cols="three" empty={all.length ? "Nothing matches — try fewer filters." : undefined} /></div>
      </div>
      <SiteFooter />
    </main>
  );
}

export const instant = false;
