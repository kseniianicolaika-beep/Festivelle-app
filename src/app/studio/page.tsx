import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { formatDate, type Profile } from "@/lib/profile";
import { nameParts, OCCASIONS, occasionLine, occasionOf } from "@/lib/occasions";
import { petalColors, themeById, themeVars } from "@/lib/themes";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { Wash } from "@/components/fx/Wash";
import { Reveal } from "@/components/fx/Reveal";
import { Petals } from "@/components/fx/Petals";
import { Motif } from "@/components/Motif";
import { StudioNav } from "./StudioNav";

type Row = { id: string; profile: Profile; theme: string; published: boolean; client_name: string | null; pieces: number; rsvps: number; video_tier: string | null };

// "My Invitations / My Event Websites / My Video Invitations": one celebration holds all three, so the
// views filter and open the matching editor.
const VIEWS = [
  { id: "all", label: "All celebrations" },
  { id: "invitations", label: "My invitations" },
  { id: "websites", label: "My event websites" },
  { id: "videos", label: "My video invitations" },
] as const;
type View = (typeof VIEWS)[number]["id"];

export default async function Studio({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const vq = (await searchParams).view;
  const view: View = VIEWS.some((v) => v.id === vq) ? (vq as View) : "all";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio");
  const { current, list } = await activeWorkspace(user);
  const agency = current.kind === "agency";
  const weddings = (await sql`
    SELECT w.id, w.profile, w.theme, w.published, w.client_name, w.video_tier,
      (SELECT count(*)::int FROM documents d WHERE d.wedding_id = w.id) AS pieces,
      (SELECT count(*)::int FROM rsvps r WHERE r.wedding_id = w.id) AS rsvps
    FROM weddings w WHERE w.workspace_id = ${current.id} ORDER BY w.updated_at DESC`) as Row[];
  const visible = view === "videos" ? weddings.filter((w) => w.video_tier) : view === "websites" ? weddings.filter((w) => occasionOf(w.profile) !== "greeting") : weddings;
  const open = (id: string) => (view === "videos" ? `/studio/${id}/video` : view === "websites" ? `/studio/${id}?piece=website` : view === "invitations" ? `/studio/${id}?piece=invite` : `/studio/${id}`);
  if (weddings.length === 0 && !agency && canEdit(current.role) && list.length === 1 && !isAdmin(user)) redirect("/studio/new");

  const groups = agency
    ? Object.entries(visible.reduce<Record<string, Row[]>>((g, w) => ((g[w.client_name || "Unassigned"] ??= []).push(w), g), {}))
    : [["", visible] as [string, Row[]]];

  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <Wash />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="weddings" />
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 pt-10 md:px-10">
        <Reveal>
          <p className="kicker text-rose">{agency ? "Agency studio" : "Your studio"}</p>
          <h1 className="t-h1 mt-5">{agency ? <>Every client&apos;s <em className="text-rose">love story</em></> : <>Celebrations, <em className="text-rose">in progress</em></>}</h1>
        </Reveal>

        {canEdit(current.role) && (
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col gap-2 rounded-[30px] border border-white/70 bg-white/55 p-2 shadow-[0_24px_60px_-40px_rgba(74,20,36,.6)] backdrop-blur-xl sm:flex-row sm:items-center">
              <p className="flex-1 px-5 py-3 font-display text-lg italic text-muted">Weddings, birthdays, baby showers, anniversaries, greetings — each begins with a conversation.</p>
              <Link href="/studio/new" className="btn btn-dark !px-6 !py-3.5 text-center">Begin a new celebration<span className="btn-arrow">→</span></Link>
            </div>
          </Reveal>
        )}

        <nav aria-label="Filter" className="scroll-hide mt-10 flex gap-1.5 overflow-x-auto">
          {VIEWS.map((v) => <Link key={v.id} href={v.id === "all" ? "/studio" : `/studio?view=${v.id}`} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] transition ${view === v.id ? "bg-wine text-[#fbeee6] shadow" : "text-ink-soft hover:bg-white/70"}`}>{v.label}</Link>)}
          <Link href="/studio/saved" className="whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] text-ink-soft transition hover:bg-white/70">My saved templates</Link>
        </nav>

        {groups.map(([client, rows]) => (
          <section key={client} className="mt-12">
            {agency && <Reveal><h2 className="display mb-5 flex items-center gap-3 text-2xl"><span className="h-px w-8 bg-gold" />{client}<span className="text-sm text-muted">({rows.length})</span></h2></Reveal>}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rows.map((w, i) => {
                const th = themeById(w.theme);
                const [a, b] = nameParts(w.profile);
                return (
                  <Reveal key={w.id} delay={i * 0.06}>
                    <Link href={open(w.id)} style={themeVars(th)} className="paper-tex group relative block aspect-[4/5] overflow-hidden rounded-[6px] bg-[var(--t-bg)] p-6 text-[var(--t-ink)] shadow-[0_30px_60px_-40px_rgba(74,20,36,.6)] ring-1 ring-[var(--t-gold)]/30 transition duration-1000 ease-[var(--ease-expo)] hover:-translate-y-2 hover:shadow-[0_50px_90px_-40px_rgba(74,20,36,.7)]">
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
        {!!weddings.length && !visible.length && <Reveal><p className="mt-16 text-center font-display text-2xl italic text-muted">{view === "videos" ? "No video invitations yet — open any celebration and choose “Video”." : "Nothing here yet."}</p></Reveal>}
        {!weddings.length && <Reveal><p className="mt-16 text-center font-display text-2xl italic text-muted">Nothing here yet — begin the first celebration above.</p></Reveal>}
      </div>
    </main>
  );
}

// Per-request page (auth/DB) — render on demand.
