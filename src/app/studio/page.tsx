import Link from "next/link";
import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import { opening } from "@/lib/designer";
import { coupleNames, formatDate, type Profile } from "@/lib/profile";
import { petalColors, themeById, themeVars } from "@/lib/themes";
import { isAdmin } from "@/lib/admin";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { Petals } from "@/components/fx/Petals";
import { Motif } from "@/components/Motif";
import { Heart } from "@/components/fx/Heart";
import { SignOut } from "./SignOut";

const slugId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);

async function createWedding() {
  "use server";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio");
  const o = opening();
  const [w] = (await sql`
    WITH w AS (INSERT INTO weddings (owner_id, slug) VALUES (${user.id}, ${slugId()}) RETURNING id)
    INSERT INTO messages (wedding_id, role, content, chips) SELECT id, 'assistant', ${o.reply}, ${JSON.stringify(o.chips)}::jsonb FROM w RETURNING wedding_id`) as { wedding_id: string }[];
  redirect(`/studio/${w.wedding_id}`);
}

export default async function Studio() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio");
  const admin = isAdmin(user);
  const weddings = (await sql`SELECT id, profile, theme, published FROM weddings WHERE owner_id = ${user.id} ORDER BY updated_at DESC`) as { id: string; profile: Profile; theme: string; published: boolean }[];
  if (weddings.length === 0 && !admin) await createWedding();

  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <Petals count={12} />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <span className="display flex items-center gap-2 text-2xl"><Heart className="heartbeat h-3.5 w-3.5" color="var(--rose)" />{BRAND.name}</span>
        <div className="flex items-center gap-4 text-sm text-muted">
          {admin && <Link href="/admin" className="rounded-full bg-wine px-3.5 py-1.5 text-xs tracking-widest text-[#fbeee6]">ADMIN</Link>}
          <span className="hidden sm:inline">{user.email}</span>
          <SignOut />
        </div>
      </nav>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8">
        <Reveal>
          <p className="eyebrow text-rose">Your studio</p>
          <h1 className="display mt-3 text-5xl md:text-6xl">Love stories, <em className="text-rose">in progress</em></h1>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {weddings.map((w, i) => {
            const th = themeById(w.theme);
            const [a, b] = coupleNames(w.profile);
            return (
              <Reveal key={w.id} delay={i * 0.07}>
                <Link href={`/studio/${w.id}`} style={themeVars(th)} className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--t-bg)] p-7 text-[var(--t-ink)] shadow-[0_30px_60px_-40px_rgba(74,20,36,.6)] ring-1 ring-[var(--t-gold)]/30 transition duration-700 hover:-translate-y-2 hover:shadow-[0_50px_90px_-40px_rgba(74,20,36,.7)]">
                  <Petals count={6} colors={petalColors(th)} className="absolute opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow opacity-60">{th.name}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] tracking-widest ${w.published ? "bg-emerald-600/90 text-white" : "bg-black/5"}`}>{w.published ? "LIVE" : "DRAFT"}</span>
                    </div>
                    <div className="text-center">
                      <Motif theme={th} className="mx-auto mb-6 w-28 transition duration-700 group-hover:scale-110" />
                      <p className="display foil text-4xl leading-tight">{a}</p>
                      <p className="script text-2xl text-[var(--t-accent)]">&amp;</p>
                      <p className="display foil text-4xl leading-tight">{b}</p>
                    </div>
                    <p className="text-center text-sm opacity-70">{formatDate(w.profile.date) || "A date to dream about"}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
          <Reveal delay={weddings.length * 0.07}>
            <form action={createWedding} className="h-full">
              <button className="group flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-rose/40 bg-white/40 text-muted backdrop-blur transition duration-500 hover:border-rose hover:bg-white/70 hover:text-wine">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blush text-3xl text-rose transition duration-500 group-hover:scale-110 group-hover:rotate-90">+</span>
                <span className="display text-2xl">Begin a new love story</span>
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
