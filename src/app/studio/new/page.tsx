import Link from "next/link";
import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { opening } from "@/lib/designer";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { isOccasion, OCCASION_IDS, OCCASIONS, starterFor, type OccasionId } from "@/lib/occasions";
import { defaultDesign, PAPER_LAYOUTS, SITE_LAYOUTS, type Kind } from "@/lib/templates";
import { CATALOG, templateById, type Culture, type Style, type TemplateDef } from "@/lib/catalog";
import { WeddingSite } from "@/components/WeddingSite";
import { themeById } from "@/lib/themes";
import type { Profile } from "@/lib/profile";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { Petals } from "@/components/fx/Petals";
import { Paper } from "@/components/designs/Paper";
import { StudioNav } from "../StudioNav";

const slugId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);

// Create a celebration from the catalog: occasion + (optional) template, then straight into the conversation.
async function create(form: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/new");
  const { current } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  const tpl = templateById(String(form.get("template") ?? ""));
  const o = String(form.get("occasion"));
  const occasion: OccasionId = tpl?.occasion ?? (isOccasion(o) ? o : "wedding");
  const theme = tpl?.theme ?? OCCASIONS[occasion].theme;
  const client = String(form.get("client") ?? "").trim().slice(0, 120) || null;
  const profile: Profile = { occasion };
  const first = opening(occasion);
  const [w] = (await sql`
    INSERT INTO weddings (owner_id, workspace_id, client_name, slug, profile, theme)
    VALUES (${user.id}, ${current.id}, ${client}, ${slugId()}, ${JSON.stringify(profile)}::jsonb, ${theme}) RETURNING id`) as { id: string }[];
  const starter = starterFor(occasion);
  await sql.transaction([
    sql`INSERT INTO messages (wedding_id, role, content, chips) VALUES (${w.id}, 'assistant', ${(tpl ? `Lovely choice — “${tpl.name}”. ` : "") + first.reply}, ${JSON.stringify(first.chips)}::jsonb)`,
    ...starter.map((s, i) => {
      // A catalog template styles the WHOLE suite: same theme, motif and fonts; card vs website layouts.
      const layout = tpl ? (s.kind === "website" ? tpl.siteLayout : tpl.paperLayout) : s.layout;
      const design = { ...defaultDesign(s.kind, profile), ...(tpl ? { motif: tpl.motif, fonts: tpl.fonts, template: tpl.id, ...(tpl.reveal ? { reveal: tpl.reveal } : {}) } : {}) };
      return sql`INSERT INTO documents (wedding_id, kind, layout, design, position) VALUES (${w.id}, ${s.kind}, ${layout}, ${JSON.stringify(design)}::jsonb, ${i})`;
    }),
  ]);
  redirect(`/studio/${w.id}`);
}


const tplProfile = (t: TemplateDef): Profile => ({ ...t.sample, occasion: t.occasion, partner2: t.sample.partner2 ?? undefined } as Profile);
const CULTURES: Record<Culture, string> = { indian: "Indian", russian: "Russian", goan: "Goan", muslim: "Muslim", fusion: "Russian–Indian", western: "Western", universal: "Universal" };

function Preview({ t, kind = "invite" }: { t: TemplateDef; kind?: Kind | "website" }) {
  const p = tplProfile(t);
  const th = themeById(t.theme);
  const k: Kind = t.occasion === "greeting" && kind === "invite" ? "greeting" : (kind as Kind);
  if (k === "website")
    return (
      <div className="pointer-events-none relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/5">
        <div className="origin-top-left scale-[0.5]" style={{ width: "200%" }}>
          <WeddingSite profile={p} theme={th} layout={t.siteLayout} motif={t.motif} design={{ fonts: t.fonts }} compact />
        </div>
      </div>
    );
  return <Paper kind={k} layout={t.paperLayout} design={{ ...defaultDesign(k, p), motif: t.motif, fonts: t.fonts }} profile={p} theme={th} animate={false} />;
}

export default async function NewCelebration({ searchParams }: { searchParams: Promise<{ o?: string; occasion?: string; template?: string; culture?: string; style?: string }> }) {
  const q = await searchParams;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=${encodeURIComponent(`/studio/new?${new URLSearchParams(Object.entries(q).filter(([, v]) => typeof v === "string") as [string, string][])}`)}`);
  const { current, list } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  const chosen = q.template ? templateById(q.template) : null;
  const oq = q.o ?? q.occasion;
  const occasion = chosen?.occasion ?? (isOccasion(oq) ? oq : null);
  const agency = current.kind === "agency";
  const inOcc = occasion ? CATALOG.filter((t) => t.occasion === occasion) : [];
  const cultures = [...new Set(inOcc.map((t) => t.culture))];
  const styles = [...new Set(inOcc.flatMap((t) => t.styles))];
  const shown = inOcc.filter((t) => (!q.culture || t.culture === q.culture) && (!q.style || t.styles.includes(q.style as Style)));
  const href = (extra: Record<string, string | undefined>) => `/studio/new?${new URLSearchParams(Object.entries({ o: occasion ?? undefined, culture: q.culture, style: q.style, ...extra }).filter(([, v]) => v) as [string, string][])}`;
  const chip = (on: boolean) => `whitespace-nowrap rounded-full px-4 py-1.5 text-sm capitalize transition ${on ? "bg-wine text-[#fbeee6] shadow" : "bg-white/70 text-muted hover:bg-blush"}`;
  const clientField = agency ? <input name="client" placeholder="Client (e.g. Anya & Rohan, Feb 2027)" className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-[15px] outline-none placeholder:text-muted/70" /> : null;

  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <Petals count={10} />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="weddings" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-6 md:px-6">
        {chosen ? (
          <>
            <Reveal><Link href={href({ template: undefined })} className="text-sm text-muted underline-offset-4 hover:underline">← All {OCCASIONS[chosen.occasion].name.toLowerCase()} templates</Link></Reveal>
            <div className="mt-6 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
              <Reveal>
                <p className="eyebrow text-rose">{OCCASIONS[chosen.occasion].name} · {CULTURES[chosen.culture]}</p>
                <h1 className="display mt-3 text-5xl leading-[1.02] md:text-7xl">{chosen.name}</h1>
                <p className="mt-4 font-display text-xl italic text-muted">{chosen.blurb}</p>
                <p className="mt-4 text-sm text-muted">{themeById(chosen.theme).name} · {PAPER_LAYOUTS[chosen.paperLayout as keyof typeof PAPER_LAYOUTS] ?? chosen.paperLayout} card · {SITE_LAYOUTS[chosen.siteLayout as keyof typeof SITE_LAYOUTS] ?? chosen.siteLayout} website · suggested {chosen.tier}</p>
                <form action={create} className="glass mt-8 flex flex-col gap-2 rounded-[28px] p-2 sm:flex-row sm:items-center">
                  <input type="hidden" name="template" value={chosen.id} />
                  {clientField}
                  <button className="btn btn-dark flex-1 sm:flex-none">Use this template →</button>
                </form>
                <p className="mt-3 text-xs text-muted">Free to personalise — names, words, photos, colours and fonts. Pay only to publish.</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1"><Preview t={chosen} /></div>
                  <div className="col-span-1"><Preview t={chosen} kind="website" /></div>
                  {chosen.occasion !== "greeting" && <div className="col-span-1"><Preview t={chosen} kind="story" /></div>}
                  {chosen.occasion !== "greeting" && <div className="col-span-1 self-center"><Preview t={chosen} kind="thankyou" /></div>}
                </div>
              </Reveal>
            </div>
          </>
        ) : !occasion ? (
          <>
            <Reveal>
              <p className="eyebrow text-rose">Begin something beautiful</p>
              <h1 className="display mt-3 text-[2.6rem] leading-[1.05] md:text-6xl">What are we <em className="text-rose">celebrating?</em></h1>
              <p className="mt-4 max-w-xl font-display text-xl italic text-muted">{CATALOG.length} complete template suites. Choose an occasion, then simply talk — or edit right on the design. Free until you publish.</p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {OCCASION_IDS.map((id, i) => {
                const occ = OCCASIONS[id];
                const t = CATALOG.find((x) => x.occasion === id)!;
                const n = CATALOG.filter((x) => x.occasion === id).length;
                const th = themeById(t.theme);
                return (
                  <Reveal key={id} delay={i * 0.05}>
                    <Link href={`/studio/new?o=${id}`} className="group block">
                      <div className="relative overflow-hidden rounded-[28px] p-6 ring-1 ring-black/5 transition duration-700 group-hover:-translate-y-2" style={{ background: `radial-gradient(80% 70% at 50% 30%, ${th.gold}33, transparent), ${th.bg}` }}>
                        <div className="mx-auto w-[62%] transition duration-700 group-hover:rotate-[-1.5deg] group-hover:scale-[1.03] motion-reduce:transform-none"><Preview t={t} /></div>
                      </div>
                      <p className="display mt-4 text-3xl">{occ.name} <span className="text-base text-muted">· {n} templates</span></p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{occ.blurb}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <Reveal>
              <Link href="/studio/new" className="text-sm text-muted underline-offset-4 hover:underline">← All occasions</Link>
              <p className="eyebrow mt-6 text-rose">{OCCASIONS[occasion].name}</p>
              <h1 className="display mt-3 text-[2.4rem] leading-[1.05] md:text-6xl">Choose a <em className="text-rose">beginning</em></h1>
              <p className="mt-4 max-w-xl font-display text-xl italic text-muted">Every suite includes the invitation, website, story and thank-you card. Or skip and let the conversation choose.</p>
            </Reveal>
            <Reveal delay={0.08}>
              <form action={create} className="glass mt-8 flex flex-col gap-2 rounded-[28px] p-2 sm:flex-row sm:items-center">
                <input type="hidden" name="occasion" value={occasion} />
                {agency ? clientField : <p className="flex-1 px-5 py-3 font-display text-lg italic text-muted">Not sure yet? Start talking — I’ll suggest a design.</p>}
                <button className="btn btn-dark">Start the conversation →</button>
              </form>
            </Reveal>
            {(cultures.length > 1 || styles.length > 1) && (
              <div className="scroll-soft mt-8 flex gap-2 overflow-x-auto pb-2">
                <Link href={href({ culture: undefined, style: undefined })} className={chip(!q.culture && !q.style)}>All</Link>
                {cultures.length > 1 && cultures.map((c) => <Link key={c} href={href({ culture: q.culture === c ? undefined : c })} className={chip(q.culture === c)}>{CULTURES[c]}</Link>)}
                <span className="mx-1 w-px shrink-0 bg-line" />
                {styles.map((st) => <Link key={st} href={href({ style: q.style === st ? undefined : st })} className={chip(q.style === st)}>{st}</Link>)}
              </div>
            )}
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {shown.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.04}>
                  <Link href={href({ template: t.id })} className="group block">
                    <div className="transition duration-500 group-hover:-translate-y-1.5 group-hover:drop-shadow-2xl motion-reduce:transform-none"><Preview t={t} /></div>
                    <p className="display mt-3 text-xl">{t.name}</p>
                    <p className="line-clamp-2 text-xs text-muted">{t.blurb}</p>
                  </Link>
                </Reveal>
              ))}
              {!shown.length && <p className="col-span-full font-display text-xl italic text-muted">No templates match — try another filter.</p>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export const instant = false;
