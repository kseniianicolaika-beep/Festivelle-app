import Link from "next/link";
import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { opening } from "@/lib/designer";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { isOccasion, OCCASION_IDS, OCCASIONS, starterFor, type OccasionId } from "@/lib/occasions";
import { defaultDesign, templatesFor, type Kind } from "@/lib/templates";
import { isMotif } from "@/lib/motifs";
import { themeById, THEMES } from "@/lib/themes";
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
  const o = String(form.get("occasion"));
  const occasion: OccasionId = isOccasion(o) ? o : "wedding";
  const themeIn = String(form.get("theme") ?? "");
  const theme = THEMES.some((t) => t.id === themeIn) ? themeIn : OCCASIONS[occasion].theme;
  const layoutIn = String(form.get("layout") ?? "");
  const motifIn = form.get("motif");
  const client = String(form.get("client") ?? "").trim().slice(0, 120) || null;
  const profile: Profile = { occasion };
  const first = opening(occasion);
  const [w] = (await sql`
    INSERT INTO weddings (owner_id, workspace_id, client_name, slug, profile, theme)
    VALUES (${user.id}, ${current.id}, ${client}, ${slugId()}, ${JSON.stringify(profile)}::jsonb, ${theme}) RETURNING id`) as { id: string }[];
  const starter = starterFor(occasion);
  await sql.transaction([
    sql`INSERT INTO messages (wedding_id, role, content, chips) VALUES (${w.id}, 'assistant', ${first.reply}, ${JSON.stringify(first.chips)}::jsonb)`,
    ...starter.map((s, i) => {
      const pickLayout = i === 0 && layoutIn && s.kind !== "website" ? layoutIn : s.layout;
      const design = { ...defaultDesign(s.kind, profile), ...(i === 0 && isMotif(motifIn) ? { motif: motifIn } : {}) };
      return sql`INSERT INTO documents (wedding_id, kind, layout, design, position) VALUES (${w.id}, ${s.kind}, ${pickLayout}, ${JSON.stringify(design)}::jsonb, ${i})`;
    }),
  ]);
  redirect(`/studio/${w.id}`);
}

const sampleProfile = (o: OccasionId): Profile => ({ ...OCCASIONS[o].sample, occasion: o, language: "en" }) as Profile;
const previewKind = (o: OccasionId): Kind => (o === "greeting" ? "greeting" : "invite");

export default async function NewCelebration({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/new");
  const { current, list } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  const { o } = await searchParams;
  const occasion = isOccasion(o) ? o : null;
  const agency = current.kind === "agency";

  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <Petals count={10} />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="weddings" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-6 md:px-6">
        {!occasion ? (
          <>
            <Reveal>
              <p className="eyebrow text-rose">Begin something beautiful</p>
              <h1 className="display mt-3 text-[2.6rem] leading-[1.05] md:text-6xl">What are we <em className="text-rose">celebrating?</em></h1>
              <p className="mt-4 max-w-xl font-display text-xl italic text-muted">Choose an occasion. Then simply talk — the invitation, website and every detail design themselves as you answer. Free until you publish.</p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {OCCASION_IDS.map((id, i) => {
                const occ = OCCASIONS[id];
                const th = themeById(occ.theme);
                const kind = previewKind(id);
                const p = sampleProfile(id);
                return (
                  <Reveal key={id} delay={i * 0.05}>
                    <Link href={`/studio/new?o=${id}`} className="group block">
                      <div className="relative overflow-hidden rounded-[28px] p-6 ring-1 ring-black/5 transition duration-700 group-hover:-translate-y-2" style={{ background: `radial-gradient(80% 70% at 50% 30%, ${th.gold}33, transparent), ${th.bg}` }}>
                        <div className="mx-auto w-[62%] transition duration-700 group-hover:rotate-[-1.5deg] group-hover:scale-[1.03] motion-reduce:transform-none">
                          <Paper kind={kind} layout="classic" design={{ ...defaultDesign(kind, p), motif: occ.motif }} profile={p} theme={th} animate={false} />
                        </div>
                      </div>
                      <p className="display mt-4 text-3xl">{occ.name}</p>
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
              <p className="mt-4 max-w-xl font-display text-xl italic text-muted">Every design is a starting point — the conversation will make it yours. Or skip and let the conversation choose.</p>
            </Reveal>
            <Reveal delay={0.08}>
              <form action={create} className="glass mt-8 flex flex-col gap-2 rounded-[28px] p-2 sm:flex-row sm:items-center">
                <input type="hidden" name="occasion" value={occasion} />
                {agency ? <input name="client" placeholder="Client (e.g. Anya & Rohan, Feb 2027)" className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-[15px] outline-none placeholder:text-muted/70" /> : <p className="flex-1 px-5 py-3 font-display text-lg italic text-muted">Not sure yet? Start talking — I’ll suggest a design.</p>}
                <button className="btn btn-dark">Start the conversation →</button>
              </form>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {templatesFor(previewKind(occasion), occasion).map((tpl, i) => {
                const p = sampleProfile(occasion);
                const th = themeById(tpl.theme);
                return (
                  <Reveal key={tpl.id} delay={i * 0.04}>
                    <form action={create} className="group">
                      <input type="hidden" name="occasion" value={occasion} />
                      <input type="hidden" name="theme" value={tpl.theme} />
                      <input type="hidden" name="layout" value={tpl.layout} />
                      {tpl.motif && <input type="hidden" name="motif" value={tpl.motif} />}
                      <button className="block w-full text-left">
                        <div className="transition duration-500 group-hover:-translate-y-1.5 group-hover:drop-shadow-2xl motion-reduce:transform-none">
                          <Paper kind={tpl.kind} layout={tpl.layout} design={{ ...defaultDesign(tpl.kind, p), motif: tpl.motif }} profile={p} theme={th} animate={false} />
                        </div>
                        <p className="display mt-3 text-xl">{tpl.name}</p>
                        <p className="text-xs text-muted">{th.name} · {th.mood}</p>
                      </button>
                    </form>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export const instant = false;
