"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdminAction } from "@/lib/admin-guard";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { activate } from "@/lib/commerce";
import { createPayment, refundRazorpay } from "@/lib/payments";
import type { Currency } from "@/lib/pricing";
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

type RefundRow = { id: string; provider: string; provider_ref: string | null; currency: Currency; amount_minor: number; description: string; status: string };

// Real refund for Razorpay orders: refunds the captured payment in full, then marks the order refunded.
// (The package itself stays active; take it back by hand if needed.) Other providers: refund in their dashboard.
export async function refundOrder(form: FormData) {
  await requireAdminAction();
  const id = String(form.get("id"));
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const [o] = (await sql`SELECT id, provider, provider_ref, currency, amount_minor, description, status FROM orders WHERE id = ${id}`) as RefundRow[];
  let note = "";
  if (!o || o.status !== "paid" || o.provider !== "razorpay") note = "Only paid Razorpay orders can be refunded from here.";
  else {
    try {
      const ref = await refundRazorpay(o);
      await sql`UPDATE orders SET status = 'refunded', refund_ref = ${ref} WHERE id = ${id} AND status = 'paid'`;
    } catch (e) {
      note = e instanceof Error ? e.message : "Refund failed.";
    }
  }
  revalidatePath("/admin/orders");
  redirect(note ? `/admin/orders?error=${encodeURIComponent(note)}` : "/admin/orders?refunded=1");
}

// ₹1 live payment check: a real Razorpay payment that unlocks nothing, to prove checkout → payment → webhook end to end.
// Refund it afterwards with the Refund button.
export async function paymentCheck() {
  const admin = await requireAdminAction();
  const h = await headers();
  const base = process.env.APP_URL || `https://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const [order] = (await sql`INSERT INTO orders (user_id, email, product, description, currency, amount_minor, list_minor, provider)
    VALUES (${admin.id}, ${admin.email}, 'check_inr', 'Payment check (₹1, refund after)', 'INR', 100, 100, 'razorpay') RETURNING id`) as { id: string }[];
  let url = "";
  try {
    const p = await createPayment("razorpay", { id: order.id, currency: "INR", amount_minor: 100, description: "Festivelle payment check — ₹1, refunded after", email: admin.email, name: admin.name || null }, base);
    await sql`UPDATE orders SET provider_ref = ${p.ref} WHERE id = ${order.id}`;
    url = p.url;
  } catch (e) {
    await sql`UPDATE orders SET status = 'failed' WHERE id = ${order.id}`;
    redirect(`/admin/orders?error=${encodeURIComponent(e instanceof Error ? e.message : "Razorpay didn't respond.")}`);
  }
  redirect(url);
}

export const PARTNER_CATEGORIES = async () => CATS;
