import Link from "next/link";
import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import { opening } from "@/lib/designer";
import { coupleNames, formatDate, type Profile } from "@/lib/profile";
import { themeById } from "@/lib/themes";

const slugId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);

async function createWedding() {
  "use server";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio");
  const o = opening();
  const [w] = (await sql`
    WITH w AS (INSERT INTO weddings (owner_id, slug) VALUES (${user.id}, ${slugId()}) RETURNING id)
    INSERT INTO messages (wedding_id, role, content) SELECT id, 'assistant', ${o.reply} FROM w RETURNING wedding_id`) as { wedding_id: string }[];
  redirect(`/studio/${w.wedding_id}`);
}

export default async function Studio() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio");
  const weddings = (await sql`SELECT id, profile, theme, published FROM weddings WHERE owner_id = ${user.id} ORDER BY updated_at DESC`) as { id: string; profile: Profile; theme: string; published: boolean }[];
  if (weddings.length === 0) await createWedding();

  return (
    <main className="grain min-h-dvh">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="display text-2xl">{BRAND.name}</Link>
        <span className="text-sm text-muted">{user.email}</span>
      </nav>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="display text-4xl">Your weddings</h1>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {weddings.map((w) => {
            const th = themeById(w.theme);
            const [a, b] = coupleNames(w.profile);
            return (
              <Link key={w.id} href={`/studio/${w.id}`} className="group rounded-3xl p-6 transition hover:-translate-y-1" style={{ background: th.bg, color: th.ink, border: `1px solid ${th.gold}66` }}>
                <p className="eyebrow opacity-60">{w.published ? "Published" : "Draft"}</p>
                <p className="display mt-12 text-3xl">{a} &amp; {b}</p>
                <p className="mt-1 text-sm opacity-70">{formatDate(w.profile.date) || "Date to come"}</p>
              </Link>
            );
          })}
          <form action={createWedding}>
            <button className="flex h-full min-h-44 w-full items-center justify-center rounded-3xl border border-dashed border-line text-muted transition hover:border-gold hover:text-ink">+ New wedding</button>
          </form>
        </div>
      </div>
    </main>
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
