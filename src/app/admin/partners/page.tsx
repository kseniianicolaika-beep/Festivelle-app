import { sql } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin-guard";
import { AdminNav } from "../AdminNav";
import { togglePartner, upsertPartner, PARTNER_CATEGORIES } from "../actions";

type P = { id: string; name: string; category: string; city: string | null; url: string | null; blurb: string | null; offer: string | null; listing: string; ref_code: string; commission_pct: string; contact_email: string | null; agreement: string | null; active: boolean; clicks: number; orders: number; commission: number };

function PartnerForm({ p, cats }: { p?: P; cats: string[] }) {
  return (
    <form action={upsertPartner} className="grid gap-2 md:grid-cols-4">
      {p && <input type="hidden" name="id" value={p.id} />}
      <input name="name" required defaultValue={p?.name} placeholder="Business name" className="field !py-2 md:col-span-2" />
      <select name="category" defaultValue={p?.category ?? "planner"} className="field !py-2">{cats.map((c) => <option key={c}>{c}</option>)}</select>
      <input name="city" defaultValue={p?.city ?? ""} placeholder="City" className="field !py-2" />
      <input name="url" defaultValue={p?.url ?? ""} placeholder="Website / Instagram URL" className="field !py-2 md:col-span-2" />
      <input name="contact_email" defaultValue={p?.contact_email ?? ""} placeholder="Contact email" className="field !py-2" />
      <select name="listing" defaultValue={p?.listing ?? "free"} className="field !py-2"><option value="free">Free listing</option><option value="featured">Featured (paid)</option><option value="sponsored">Sponsored placement</option></select>
      <input name="blurb" defaultValue={p?.blurb ?? ""} placeholder="One-line description" className="field !py-2 md:col-span-2" />
      <input name="offer" defaultValue={p?.offer ?? ""} placeholder="Offer for Festivelle customers" className="field !py-2 md:col-span-2" />
      <input name="ref_code" defaultValue={p?.ref_code ?? ""} placeholder="Referral code (auto)" className="field !py-2" />
      <input name="commission_pct" type="number" step="0.5" defaultValue={p?.commission_pct ?? 12} placeholder="Commission %" className="field !py-2" />
      <textarea name="agreement" defaultValue={p?.agreement ?? ""} placeholder="Commercial agreement notes (fees, term, payout details)" rows={2} className="field !py-2 md:col-span-2" />
      <button className="btn btn-dark md:col-span-4">{p ? "Save partner" : "Add partner"}</button>
    </form>
  );
}

export default async function Partners() {
  const user = await requireAdminPage("/admin/partners");
  const cats = await PARTNER_CATEGORIES();
  const partners = (await sql`SELECT p.*,
      (SELECT count(*)::int FROM orders o WHERE o.partner_id = p.id AND o.status = 'paid') AS orders,
      (SELECT coalesce(sum(commission_minor),0)::int FROM orders o WHERE o.partner_id = p.id AND o.status = 'paid') AS commission
    FROM partners p ORDER BY p.active DESC, p.listing DESC, p.name`) as P[];
  return (
    <main className="grain relative min-h-dvh">
      <AdminNav active="partners" email={user.email} />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <h1 className="display text-5xl">Partner <em className="text-rose">programme</em></h1>
        <p className="mt-3 max-w-2xl text-muted">Salons, planners, photographers, florists, bakeries and shops. Free or paid listings appear on <a href="/partners" className="underline">/partners</a>; each partner gets a referral link <code>/r/&lt;code&gt;</code> and can be tied to promo codes. Commission is tracked on every paid order they bring.</p>
        <div className="glass mt-8 rounded-3xl p-5"><p className="display mb-3 text-2xl">New partner</p><PartnerForm cats={cats} /></div>
        <div className="mt-8 space-y-4">
          {partners.map((p) => (
            <details key={p.id} className={`glass rounded-3xl p-5 ${p.active ? "" : "opacity-60"}`}>
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
                <span><span className="display text-2xl">{p.name}</span> <span className="text-sm text-muted">{p.category}{p.city ? ` · ${p.city}` : ""} · {p.listing}</span></span>
                <span className="text-sm text-muted">/r/{p.ref_code} · {p.clicks} clicks · {p.orders} orders · {p.commission_pct}%</span>
              </summary>
              <div className="mt-4"><PartnerForm p={p} cats={cats} /></div>
              <form action={togglePartner} className="mt-2"><input type="hidden" name="id" value={p.id} /><button className="text-sm text-wine underline">{p.active ? "Deactivate" : "Reactivate"}</button></form>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}

export const instant = false;
