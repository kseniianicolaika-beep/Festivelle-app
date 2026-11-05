import { sql } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin-guard";
import { AdminNav } from "../AdminNav";
import { togglePromo, upsertPromo } from "../actions";

type P = { code: string; percent_off: number; max_uses: number | null; uses: number; expires_at: string | null; active: boolean; partner: string | null };

export default async function Promos() {
  const user = await requireAdminPage("/admin/promos");
  const promos = (await sql`SELECT p.*, pa.name AS partner FROM promos p LEFT JOIN partners pa ON pa.id = p.partner_id ORDER BY p.created_at DESC`) as P[];
  const partners = (await sql`SELECT id, name FROM partners WHERE active ORDER BY name`) as { id: string; name: string }[];
  return (
    <main className="grain relative min-h-dvh">
      <AdminNav active="promos" email={user.email} />
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        <h1 className="display text-5xl">Promo <em className="text-rose">codes</em></h1>
        <form action={upsertPromo} className="glass mt-8 grid gap-3 rounded-3xl p-5 md:grid-cols-6">
          <input name="code" required placeholder="CODE" className="field !py-2 uppercase md:col-span-2" />
          <input name="percent_off" type="number" min={0} max={100} required placeholder="% off" className="field !py-2" />
          <input name="max_uses" type="number" min={1} placeholder="Max uses" className="field !py-2" />
          <input name="expires_at" type="date" className="field !py-2" />
          <select name="partner_id" className="field !py-2"><option value="">No partner</option>{partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <button className="btn btn-dark md:col-span-6">Save code</button>
        </form>
        <div className="glass mt-6 overflow-x-auto rounded-[28px]">
          <table className="w-full text-left text-sm">
            <thead className="text-muted"><tr className="border-b border-line">{["Code", "Discount", "Used", "Expires", "Partner", ""].map((h) => <th key={h} className="eyebrow px-4 py-3 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.code} className={`border-b border-line/60 ${p.active ? "" : "opacity-50"}`}>
                  <td className="px-4 py-3 font-mono">{p.code}</td>
                  <td className="px-4 py-3">{p.percent_off}%</td>
                  <td className="px-4 py-3">{p.uses}{p.max_uses ? ` / ${p.max_uses}` : ""}</td>
                  <td className="px-4 py-3">{p.expires_at ? new Date(p.expires_at).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="px-4 py-3">{p.partner ?? "—"}</td>
                  <td className="px-4 py-3 text-right"><form action={togglePromo}><input type="hidden" name="code" value={p.code} /><button className="text-wine underline">{p.active ? "Pause" : "Resume"}</button></form></td>
                </tr>
              ))}
              {!promos.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No codes yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export const instant = false;
