import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { isAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";
import { AdminNav } from "./AdminNav";
import { displayNames, OCCASIONS, occasionOf } from "@/lib/occasions";
import { comp } from "./actions";
import { formatDate, type Profile } from "@/lib/profile";
import { themeById } from "@/lib/themes";
import { aiProvider } from "@/lib/ai";
import { PROVIDERS } from "@/lib/payments";
import { emailEnabled } from "@/lib/email";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";

type Row = { id: string; slug: string; owner_id: string; owner_email: string | null; profile: Profile; theme: string; published: boolean; plan: string; tier: string | null; expires_at: string | null; subdomain: string | null; rsvps: number; attending: number; guests: number; updated_at: string };

export default async function Admin() {
  const mailOn = await emailEnabled();
  const ai = await aiProvider();
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/admin");
  if (!isAdmin(user)) notFound();

  const rows = (await sql`
    SELECT w.id, w.slug, w.owner_id, w.profile, w.theme, w.published, w.plan, w.updated_at, w.tier, w.expires_at, w.subdomain,
      (SELECT email FROM neon_auth."user" u WHERE u.id::text = w.owner_id) AS owner_email,
      (SELECT count(*)::int FROM rsvps r WHERE r.wedding_id = w.id) AS rsvps,
      (SELECT coalesce(sum(party_size), 0)::int FROM rsvps r WHERE r.wedding_id = w.id AND r.attending) AS attending,
      (SELECT count(*)::int FROM guests g WHERE g.wedding_id = w.id) AS guests
    FROM weddings w ORDER BY w.updated_at DESC LIMIT 500`.catch(() =>
    sql`SELECT w.*, NULL AS owner_email, 0 AS rsvps, 0 AS attending, 0 AS guests FROM weddings w ORDER BY updated_at DESC LIMIT 500`)) as Row[];
  const users = ((await sql`SELECT count(*)::int AS n FROM neon_auth."user"`.catch(() => [{ n: null }])) as { n: number | null }[])[0].n;

  const stats = [
    ["Customers", users ?? "—"],
    ["Celebrations", rows.length],
    ["Published", rows.filter((r) => r.published).length],
    ["RSVPs", rows.reduce((n, r) => n + r.rsvps, 0)],
    ["Guests attending", rows.reduce((n, r) => n + r.attending, 0)],
  ];

  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <AdminNav active="overview" email={user.email} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8">
        <Reveal><h1 className="display text-5xl">Every love story, <em className="text-rose">at a glance</em></h1></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.06}>
              <div className="glass rounded-3xl p-6">
                <p className="eyebrow text-muted">{k}</p>
                <p className="display mt-2 text-5xl">{v}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-3 py-1 ${ai ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>AI: {ai ?? "not configured — rule engine"}</span>
          {Object.entries(PROVIDERS).filter(([id]) => id !== "test").map(([id, p]) => (
            <span key={id} className={`rounded-full px-3 py-1 ${p.enabled() ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{p.note.split("· ")[1]}: {p.enabled() ? "live" : "no keys"}</span>
          ))}
          <span className={`rounded-full px-3 py-1 ${mailOn ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>Email: {mailOn ? "connected" : "not configured"}</span>
        </div>

        <Reveal delay={0.2}>
          <div className="glass mt-10 overflow-x-auto rounded-[28px]">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-line">{["Celebration", "Owner", "Date", "Style", "Status", "RSVPs", "Guests", ""].map((h) => <th key={h} className="eyebrow px-5 py-4 font-normal">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  return (
                    <tr key={r.id} className="border-b border-line/60 transition hover:bg-white/50">
                      <td className="display px-5 py-4 text-lg">{r.profile.partner1 ? displayNames(r.profile) : <span className="text-muted">Not started</span>}<span className="block font-sans text-[11px] text-muted">{OCCASIONS[occasionOf(r.profile)].name}</span></td>
                      <td className="px-5 py-4 text-muted">{r.owner_email ?? r.owner_id.slice(0, 8)}</td>
                      <td className="px-5 py-4">{formatDate(r.profile.date) || "—"}</td>
                      <td className="px-5 py-4">{themeById(r.theme).name}</td>
                      <td className="px-5 py-4">
                        {r.published ? <span className="text-emerald-700">Live</span> : <span className="text-muted">Draft</span>}
                        <span className="block text-[11px] text-muted">{r.tier ?? "free"}{r.expires_at ? ` · until ${new Date(r.expires_at).toLocaleDateString("en-GB")}` : ""}</span>
                        {!r.tier && (
                          <form action={comp} className="mt-1 flex gap-1">
                            <input type="hidden" name="id" value={r.id} />
                            <select name="tier" className="rounded border border-line bg-white px-1 text-[11px]"><option value="basic">basic</option><option value="premium">premium</option><option value="luxury">luxury</option></select>
                            <button className="text-[11px] text-wine underline">Comp</button>
                          </form>
                        )}
                      </td>
                      <td className="px-5 py-4">{r.rsvps} <span className="text-muted">({r.attending} coming)</span></td>
                      <td className="px-5 py-4">{r.guests}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link href={`/studio/${r.id}`} className="text-wine underline-offset-4 hover:underline">Open</Link>
                        {r.published && <a href={`/w/${r.slug}`} target="_blank" className="ml-4 text-muted underline-offset-4 hover:underline">Site ↗</a>}
                      </td>
                    </tr>
                  );
                })}
                {!rows.length && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted">No weddings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

// Per-request page (auth/DB) — render on demand.
