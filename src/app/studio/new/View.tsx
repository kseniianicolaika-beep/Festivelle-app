import Link from "next/link";
import type { Workspace } from "@/lib/workspace";
import { isOccasion, OCCASION_IDS, OCCASIONS } from "@/lib/occasions";
import type { Kind } from "@/lib/templates";
import { CATALOG, templateById, type Culture, type Style, type TemplateDef } from "@/lib/catalog";
import { themeById } from "@/lib/themes";
import { Wash } from "@/components/fx/Wash";
import { LiveTemplate } from "@/components/marketing/Live";
import { PosterWall } from "@/components/marketing/landing/PosterWall";
import { bespokeFor } from "@/templates/registry";
import { Reveal } from "@/components/fx/Reveal";
import { StudioNav } from "../StudioNav";

export type NewQuery = { o?: string; occasion?: string; template?: string; culture?: string; style?: string };

const CULTURES: Record<Culture, string> = { indian: "Indian", russian: "Russian", goan: "Goan", muslim: "Muslim", fusion: "Russian–Indian", western: "Western", universal: "Universal" };

// Live previews: bespoke modules render because design.template = catalog id (see LiveTemplate).
function Preview({ t, kind = "invite", play = "inview" }: { t: TemplateDef; kind?: Kind; play?: "inview" | "mount" }) {
  if (kind === "website") return <LiveTemplate t={t} kind="website" device="phone" play={play} scroll />;
  return <div className="poster-shadow overflow-hidden rounded-[2px]"><LiveTemplate t={t} kind={kind} play={play} /></div>;
}

// The "begin a celebration" experience: occasions → poster wall → a chosen suite. Auth lives in page.tsx.
export function NewCelebrationView({ q, current, list, email, admin, create }: { q: NewQuery; current: Workspace; list: Workspace[]; email: string; admin: boolean; create: (form: FormData) => Promise<void> }) {
  const chosen = q.template ? templateById(q.template) : null;
  const oq = q.o ?? q.occasion;
  const occasion = chosen?.occasion ?? (isOccasion(oq) ? oq : null);
  const agency = current.kind === "agency";
  const inOcc = occasion ? CATALOG.filter((t) => t.occasion === occasion) : [];
  const cultures = [...new Set(inOcc.map((t) => t.culture))];
  const styles = [...new Set(inOcc.flatMap((t) => t.styles))];
  const shown = inOcc.filter((t) => (!q.culture || t.culture === q.culture) && (!q.style || t.styles.includes(q.style as Style)));
  const href = (extra: Record<string, string | undefined>) => `/studio/new?${new URLSearchParams(Object.entries({ o: occasion ?? undefined, culture: q.culture, style: q.style, ...extra }).filter(([, v]) => v) as [string, string][])}`;
  const chip = (on: boolean) => `whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] capitalize transition ${on ? "bg-wine text-[#fbeee6] shadow" : "text-ink-soft hover:bg-white/70"}`;
  const clientField = agency ? <input name="client" placeholder="Client (e.g. Anya & Rohan, Feb 2027)" className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-[15px] outline-none placeholder:text-muted/70" /> : null;

  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <Wash />
      <StudioNav current={current} list={list} email={email} admin={admin} active="weddings" />
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 pt-8 md:px-10">
        {chosen ? (
          <>
            <Link href={href({ template: undefined })} className="kicker link-u text-muted">All {OCCASIONS[chosen.occasion].name.toLowerCase()} templates</Link>
            <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <p className="kicker fade-up text-rose">{OCCASIONS[chosen.occasion].name} · {CULTURES[chosen.culture]}</p>
                <h1 className="t-hero mt-5"><span className="wm"><span>{chosen.name}</span></span></h1>
                <p className="t-lede fade-up mt-5 max-w-lg" style={{ ["--d" as string]: "300ms" }}>{chosen.blurb}</p>
                <p className="fade-up mt-5 text-sm text-muted" style={{ ["--d" as string]: "450ms" }}>{bespokeFor(chosen.id)?.opening ? <>Opens with <em className="font-display text-base">{bespokeFor(chosen.id)!.opening}</em> · </> : null}{themeById(chosen.theme).name} · suggested {chosen.tier}</p>
                <form action={create} className="fade-up mt-9 flex flex-col gap-2 rounded-[30px] border border-white/70 bg-white/60 p-2 shadow-[0_24px_60px_-40px_rgba(74,20,36,.6)] backdrop-blur-xl sm:flex-row sm:items-center" style={{ ["--d" as string]: "600ms" }}>
                  <input type="hidden" name="template" value={chosen.id} />
                  {clientField ?? <p className="flex-1 px-5 py-3 font-display text-lg italic text-muted">Your names go in next — just say them.</p>}
                  <button className="btn btn-dark !px-7 !py-4">Begin with {chosen.name}<span className="btn-arrow">→</span></button>
                </form>
                <p className="mt-3 pl-2 text-xs text-muted">Free to personalise — names, words, photos, colours and fonts. Pay only to publish.</p>
              </div>
              <div className="relative rounded-[30px] p-6 md:p-10" style={{ background: `radial-gradient(70% 60% at 50% 40%, ${themeById(chosen.theme).gold}33, transparent 70%), ${themeById(chosen.theme).bg}` }}>
                <div className="grid grid-cols-[1fr_1.05fr] items-center gap-5 md:gap-8">
                  <div className="space-y-5">
                    <div className="rotate-[-2deg]"><Preview t={chosen} play="mount" /></div>
                    {chosen.occasion !== "greeting" && <div className="ml-[18%] rotate-[2deg]"><Preview t={chosen} kind="thankyou" /></div>}
                  </div>
                  {chosen.occasion !== "greeting" ? <Preview t={chosen} kind="website" play="mount" /> : <Preview t={chosen} kind="story" />}
                </div>
              </div>
            </div>
          </>
        ) : !occasion ? (
          <>
            <p className="kicker fade-up text-rose">Begin something beautiful</p>
            <h1 className="t-hero mt-5">{["What", "are", "we"].map((w, i) => <span key={w}><span className="wm"><span style={{ ["--i" as string]: i }}>{w}</span></span> </span>)}<span className="wm"><span style={{ ["--i" as string]: 3 }}><em className="text-rose">celebrating?</em></span></span></h1>
            <p className="t-lede fade-up mt-6 max-w-xl" style={{ ["--d" as string]: "400ms" }}>{CATALOG.length} complete suites. Choose an occasion, then simply talk — or edit right on the design. Free until you publish.</p>
            <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
              {OCCASION_IDS.map((id, i) => {
                const occ = OCCASIONS[id];
                const inOccasion = CATALOG.filter((x) => x.occasion === id);
                const t = inOccasion.find((x) => bespokeFor(x.id)) ?? inOccasion[0];
                const th = themeById(t.theme);
                return (
                  <Reveal key={id} delay={(i % 4) * 0.06}>
                    <Link href={`/studio/new?o=${id}`} className="group block">
                      <div className="relative overflow-hidden rounded-[6px] px-[13%] py-[13%]" style={{ background: `radial-gradient(80% 70% at 50% 35%, ${th.gold}30, transparent 70%), ${th.bg}` }}>
                        <div className="poster-lift poster"><Preview t={t} /></div>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-3">
                        <p className="t-h3">{occ.name}</p>
                        <span className="num shrink-0 text-sm text-muted">{inOccasion.length}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{occ.blurb}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <Link href="/studio/new" className="kicker link-u text-muted">All occasions</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div>
                <p className="kicker fade-up text-rose">{OCCASIONS[occasion].name}</p>
                <h1 className="t-hero mt-5">{["Choose", "a"].map((w, i) => <span key={w}><span className="wm"><span style={{ ["--i" as string]: i }}>{w}</span></span> </span>)}<span className="wm"><span style={{ ["--i" as string]: 2 }}><em className="text-rose">beginning</em></span></span></h1>
                <p className="t-lede fade-up mt-5 max-w-xl" style={{ ["--d" as string]: "400ms" }}>Every suite includes the invitation, website, story and thank-you card. Or skip, and let the conversation choose.</p>
              </div>
              <form action={create} className="fade-up flex flex-col gap-2 rounded-[30px] border border-white/70 bg-white/60 p-2 shadow-[0_24px_60px_-40px_rgba(74,20,36,.6)] backdrop-blur-xl sm:flex-row sm:items-center" style={{ ["--d" as string]: "600ms" }}>
                <input type="hidden" name="occasion" value={occasion} />
                {agency ? clientField : <p className="flex-1 px-5 py-3 font-display text-lg italic text-muted">Not sure yet? Just start talking.</p>}
                <button className="btn btn-dark !px-6 !py-3.5">Start the conversation<span className="btn-arrow">→</span></button>
              </form>
            </div>
            {(cultures.length > 1 || styles.length > 1) && (
              <div className="scroll-hide mt-10 flex gap-1.5 overflow-x-auto border-y border-line py-3">
                <Link href={href({ culture: undefined, style: undefined })} scroll={false} className={chip(!q.culture && !q.style)}>All</Link>
                {cultures.length > 1 && cultures.map((c) => <Link key={c} scroll={false} href={href({ culture: q.culture === c ? undefined : c })} className={chip(q.culture === c)}>{CULTURES[c]}</Link>)}
                <span className="mx-1 w-px shrink-0 bg-line" />
                {styles.map((st) => <Link key={st} scroll={false} href={href({ style: q.style === st ? undefined : st })} className={chip(q.style === st)}>{st}</Link>)}
              </div>
            )}
            <div className="mt-12">
              <PosterWall list={shown} cols="three" hrefs={Object.fromEntries(shown.map((t) => [t.id, href({ template: t.id })]))} empty="No templates match — try another filter." />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

