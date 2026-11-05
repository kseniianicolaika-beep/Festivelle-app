import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { formatDate, type Profile } from "@/lib/profile";
import { nameParts, OCCASIONS, occasionLine, occasionOf } from "@/lib/occasions";
import { petalColors, themeById, themeVars } from "@/lib/themes";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { Petals } from "@/components/fx/Petals";
import { Motif } from "@/components/Motif";
import { StudioNav } from "./StudioNav";

type Row = { id: string; profile: Profile; theme: string; published: boolean; client_name: string | null; pieces: number; rsvps: number };

export default async function Studio() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio");
  const { current, list } = await activeWorkspace(user);
  const agency = current.kind === "agency";
  const weddings = (await sql`
    SELECT w.id, w.profile, w.theme, w.published, w.client_name,
      (SELECT count(*)::int FROM documents d WHERE d.wedding_id = w.id) AS pieces,
      (SELECT count(*)::int FROM rsvps r WHERE r.wedding_id = w.id) AS rsvps
    FROM weddings w WHERE w.workspace_id = ${current.id} ORDER BY w.updated_at DESC`) as Row[];
  if (weddings.length === 0 && !agency && canEdit(current.role) && list.length === 1 && !isAdmin(user)) redirect("/studio/new");

  const groups = agency
    ? Object.entries(weddings.reduce<Record<string, Row[]>>((g, w) => ((g[w.client_name || "Unassigned"] ??= []).push(w), g), {}))
    : [["", weddings] as [string, Row[]]];

  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <Petals count={10} />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="weddings" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-6 md:px-6">
        <Reveal>
          <p className="eyebrow text-rose">{agency ? "Agency studio" : "Your studio"}</p>
          <h1 className="display mt-3 text-[2.6rem] leading-[1.05] md:text-6xl">{agency ? <>Every client&apos;s <em className="text-rose">love story</em></> : <>Celebrations, <em className="text-rose">in progress</em></>}</h1>
        </Reveal>

        {canEdit(current.role) && (
          <Reveal delay={0.1}>
            <div className="glass mt-8 flex flex-col gap-2 rounded-[28px] p-2 sm:flex-row sm:items-center">
              <p className="flex-1 px-5 py-3 font-display text-lg italic text-muted">Weddings, birthdays, baby showers, anniversaries, greetings — each begins with a conversation.</p>
              <Link href="/studio/new" className="btn btn-dark text-center">+ Begin a new celebration</Link>
            </div>
          </Reveal>
        )}

        {groups.map(([client, rows]) => (
          <section key={client} className="mt-12">
            {agency && <Reveal><h2 className="display mb-5 flex items-center gap-3 text-2xl"><span className="h-px w-8 bg-gold" />{client}<span className="text-sm text-muted">({rows.length})</span></h2></Reveal>}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((w, i) => {
                const th = themeById(w.theme);
                const [a, b] = nameParts(w.profile);
                return (
                  <Reveal key={w.id} delay={i * 0.06}>
                    <Link href={`/studio/${w.id}`} style={themeVars(th)} className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--t-bg)] p-6 text-[var(--t-ink)] shadow-[0_30px_60px_-40px_rgba(74,20,36,.6)] ring-1 ring-[var(--t-gold)]/30 transition duration-700 hover:-translate-y-2 hover:shadow-[0_50px_90px_-40px_rgba(74,20,36,.7)]">
                      <Petals count={6} colors={petalColors(th)} className="absolute opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                      <div className="relative flex h-full flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="eyebrow opacity-60">{th.name}</span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] tracking-widest ${w.published ? "bg-emerald-600/90 text-white" : "bg-black/5"}`}>{w.published ? "LIVE" : "DRAFT"}</span>
                        </div>
                        <div className="text-center">
                          <Motif theme={th} className="mx-auto mb-6 w-28 transition duration-700 group-hover:scale-110" />
                          <p className="display foil text-4xl leading-tight">{w.profile.partner1 ? a : "A new"}</p>
                          {(b || !w.profile.partner1) && <p className="script text-2xl text-[var(--t-accent)]">{w.profile.partner1 ? "&" : ""}</p>}
                          {w.profile.partner1 ? !!b && <p className="display foil text-4xl leading-tight">{b}</p> : <p className="display foil text-4xl leading-tight">{OCCASIONS[occasionOf(w.profile)].name.toLowerCase()}</p>}
                          {w.profile.partner1 && !b && <p className="script mt-1 text-2xl text-[var(--t-accent)]">{occasionLine(w.profile)}</p>}
                        </div>
                        <div className="flex items-center justify-between text-xs opacity-70">
                          <span>{formatDate(w.profile.date) || "A date to dream about"}</span>
                          <span>{w.pieces} pieces · {w.rsvps} RSVPs</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}
        {!weddings.length && <Reveal><p className="mt-16 text-center font-display text-2xl italic text-muted">Nothing here yet — begin the first celebration above.</p></Reveal>}
      </div>
    </main>
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
