"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdminAction } from "@/lib/admin-guard";
import { activate } from "@/lib/commerce";
import { isTier, savePricing } from "@/lib/pricing";

// Gift a package (e.g. for a partner, a friend, or a support case). Logged as a zero-value order.
export async function comp(form: FormData) {
  const admin = await requireAdminAction();
  const id = String(form.get("id"));
  const tier = String(form.get("tier"));
  if (!isTier(tier) || !/^[0-9a-f-]{36}$/i.test(id)) return;
  await sql`INSERT INTO orders (user_id, email, wedding_id, product, description, currency, amount_minor, list_minor, provider, status, paid_at)
    VALUES (${admin.id}, ${admin.email}, ${id}, ${"site_" + tier}, 'Complimentary (admin)', 'USD', 0, 0, 'comp', 'paid', now())`;
  await sql`UPDATE weddings SET tier = ${tier} WHERE id = ${id}`;
  await activate(id);
  revalidatePath("/admin");
}

export async function savePricingAction(json: string) {
  const admin = await requireAdminAction();
  const saved = await savePricing(JSON.parse(json), admin.email);
  revalidatePath("/admin/pricing");
  return saved;
}

export async function upsertPromo(form: FormData) {
  await requireAdminAction();
  const code = String(form.get("code") ?? "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
  if (!code) return;
  const pct = Math.min(Math.max(Number(form.get("percent_off")) || 0, 0), 100);
  const max = Number(form.get("max_uses")) || null;
  const exp = String(form.get("expires_at") ?? "") || null;
  const partner = String(form.get("partner_id") ?? "") || null;
  await sql`INSERT INTO promos (code, percent_off, max_uses, expires_at, partner_id) VALUES (${code}, ${pct}, ${max}, ${exp}, ${partner})
    ON CONFLICT (code) DO UPDATE SET percent_off = EXCLUDED.percent_off, max_uses = EXCLUDED.max_uses, expires_at = EXCLUDED.expires_at, partner_id = EXCLUDED.partner_id, active = true`;
  revalidatePath("/admin/promos");
}

export async function togglePromo(form: FormData) {
  await requireAdminAction();
  await sql`UPDATE promos SET active = NOT active WHERE code = ${String(form.get("code"))}`;
  revalidatePath("/admin/promos");
}

const CATS = ["venue", "planner", "salon", "photographer", "videographer", "florist", "bakery", "party supplies", "gifts", "online store", "other"];
export async function upsertPartner(form: FormData) {
  await requireAdminAction();
  const s = (k: string, n = 300) => String(form.get(k) ?? "").trim().slice(0, n) || null;
  const name = s("name", 120);
  if (!name) return;
  const id = s("id");
  const category = CATS.includes(String(form.get("category"))) ? String(form.get("category")) : "other";
  const listing = ["free", "featured", "sponsored"].includes(String(form.get("listing"))) ? String(form.get("listing")) : "free";
  const url = s("url");
  const safeUrl = url && /^https?:\/\//.test(url) ? url : url ? `https://${url}` : null;
  const ref = (s("ref_code", 32) ?? name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const pct = Math.min(Math.max(Number(form.get("commission_pct")) || 0, 0), 50);
  if (id && /^[0-9a-f-]{36}$/i.test(id))
    await sql`UPDATE partners SET name=${name}, category=${category}, city=${s("city", 80)}, url=${safeUrl}, blurb=${s("blurb", 400)}, offer=${s("offer", 200)},
      listing=${listing}, ref_code=${ref}, commission_pct=${pct}, contact_email=${s("contact_email", 160)}, agreement=${s("agreement", 2000)} WHERE id = ${id}`;
  else
    await sql`INSERT INTO partners (name, category, city, url, blurb, offer, listing, ref_code, commission_pct, contact_email, agreement)
      VALUES (${name}, ${category}, ${s("city", 80)}, ${safeUrl}, ${s("blurb", 400)}, ${s("offer", 200)}, ${listing}, ${ref}, ${pct}, ${s("contact_email", 160)}, ${s("agreement", 2000)})`;
  revalidatePath("/admin/partners");
}

export async function togglePartner(form: FormData) {
  await requireAdminAction();
  await sql`UPDATE partners SET active = NOT active WHERE id = ${String(form.get("id"))}`;
  revalidatePath("/admin/partners");
}

export async function setOrderStatus(form: FormData) {
  await requireAdminAction();
  const st = String(form.get("status"));
  if (st === "refunded") await sql`UPDATE orders SET status = 'refunded' WHERE id = ${String(form.get("id"))} AND status = 'paid'`;
  revalidatePath("/admin/orders");
}

export const PARTNER_CATEGORIES = async () => CATS;
