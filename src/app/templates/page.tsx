import type { Metadata } from "next";
import Link from "next/link";
import { publicCatalog } from "@/lib/template-admin";
import { OCCASIONS, OCCASION_IDS, isOccasion } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import type { Culture, Style, TemplateDef } from "@/lib/catalog";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { TemplateGrid } from "@/components/marketing/TemplateGrid";
import { CULTURES, LANGS } from "@/components/marketing/seo";

export const metadata: Metadata = {
  title: "Invitation & website templates — weddings, birthdays, baby showers",
  description: "Beautiful invitation and celebration website templates you personalise by conversation. Weddings, engagements, birthdays, kids' parties, baby showers, anniversaries and greetings.",
  alternates: { canonical: "/templates" },
};

type Q = { occasion?: string; culture?: string; style?: string; colour?: string; lang?: string };

function Chips({ name, value, options, q }: { name: keyof Q; value?: string; options: [string, string][]; q: Q }) {
  const href = (v?: string) => {
    const p = new URLSearchParams(Object.entries({ ...q, [name]: v }).filter(([, x]) => x) as [string, string][]);
    const s = p.toString();
    return s ? `/templates?${s}` : "/templates";
  };
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      <Link href={href(undefined)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${!value ? "bg-wine text-[#fbeee6]" : "bg-white/60 text-muted hover:text-ink"}`}>All</Link>
      {options.map(([v, l]) => (
        <Link key={v} href={href(v)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${value === v ? "bg-wine text-[#fbeee6]" : "bg-white/60 text-muted hover:text-ink"}`}>{l}</Link>
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
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <SiteNav />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 md:px-6">
        <Reveal>
          <p className="eyebrow text-rose">{all.length ? `${all.length} hand-finished designs` : "The collection"}</p>
          <h1 className="display mt-3 text-5xl leading-[1.05] md:text-7xl">{occ ? <>{occ} <em className="text-rose">templates</em></> : <>Find the one that <em className="text-rose">feels like you</em></>}</h1>
          <p className="mt-4 max-w-xl text-muted">Every design is a complete suite — website, invitation, save-the-date, story and thank-you card — and arrives already written in your names. Personalise it free, by talking or by tapping.</p>
        </Reveal>
        <div className="glass mt-10 space-y-3 rounded-[28px] p-4">
          <Chips name="occasion" value={q.occasion} q={q} options={OCCASION_IDS.map((o) => [o, OCCASIONS[o].name])} />
          {cultures.length > 1 && <Chips name="culture" value={q.culture} q={q} options={cultures.map((c) => [c, CULTURES[c] ?? c])} />}
          {styles.length > 1 && <Chips name="style" value={q.style} q={q} options={styles.map((s) => [s, s[0].toUpperCase() + s.slice(1)])} />}
          {themes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="eyebrow text-muted">Colour</span>
              {themes.map((id) => {
                const th = themeById(id);
                const p = new URLSearchParams(Object.entries({ ...q, colour: q.colour === id ? undefined : id }).filter(([, x]) => x) as [string, string][]).toString();
                return <Link key={id} href={p ? `/templates?${p}` : "/templates"} title={th.name} aria-label={th.name} className={`h-7 w-7 rounded-full ring-offset-2 transition hover:scale-110 ${q.colour === id ? "ring-2 ring-wine" : "ring-1 ring-line"}`} style={{ background: `linear-gradient(135deg, ${th.bg} 45%, ${th.accent} 46%, ${th.gold})` }} />;
              })}
            </div>
          )}
          {langs.length > 1 && <Chips name="lang" value={q.lang} q={q} options={langs.map((l) => [l, LANGS[l]])} />}
        </div>
        <div className="mt-12"><TemplateGrid list={list} empty={all.length ? "Nothing matches — try fewer filters." : undefined} /></div>
      </div>
      <SiteFooter />
    </main>
  );
}

export const instant = false;
