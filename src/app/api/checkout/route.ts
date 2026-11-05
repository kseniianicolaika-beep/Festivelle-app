import { cookies } from "next/headers";
import { sql, getWeddingForUser } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { isAdmin } from "@/lib/admin";
import { quote } from "@/lib/commerce";
import { CURRENCIES, type Currency } from "@/lib/pricing";
import { createPayment, providersFor, PROVIDERS, type ProviderId } from "@/lib/payments";
import { appUrl } from "@/lib/guard";

async function context(req: Request, b: Record<string, unknown>) {
  const user = await currentUser();
  if (!user) return { error: Response.json({ error: "Please sign in first." }, { status: 401 }) } as const;
  const currency = (CURRENCIES.includes(b.currency as Currency) ? b.currency : "USD") as Currency;
  const wedding = typeof b.weddingId === "string" && b.weddingId ? await getWeddingForUser(b.weddingId, user) : null;
  if (b.weddingId && !wedding) return { error: Response.json({ error: "Not found" }, { status: 404 }) } as const;
  const ref = (await cookies()).get("fv_ref")?.value ?? null;
  const q = await quote(String(b.product ?? ""), currency, wedding, typeof b.promo === "string" && b.promo ? b.promo : null, ref);
  const admin = isAdmin(user);
  return { user, wedding, currency, q, admin } as const;
}

// Preview a price (with promo) and the payment methods available for that currency.
export async function GET(req: Request) {
  const b = Object.fromEntries(new URL(req.url).searchParams);
  const c = await context(req, b);
  if ("error" in c) return c.error;
  if ("error" in c.q) return Response.json({ error: c.q.error }, { status: 400 });
  const providers = providersFor(c.currency, c.admin).map((id) => ({ id, ...PROVIDERS[id], enabled: undefined, currencies: undefined }));
  return Response.json({ quote: c.q, providers });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const c = await context(req, b);
  if ("error" in c) return c.error;
  if ("error" in c.q) return Response.json({ error: c.q.error }, { status: 400 });
  const provider = b.provider as ProviderId;
  if (!providersFor(c.currency, c.admin).includes(provider)) return Response.json({ error: "That payment method isn’t available for this currency." }, { status: 400 });
  const q = c.q;
  const amountMinor = Math.round(q.amount * 100);
  const commission = Math.round((amountMinor * q.commissionPct) / 100);
  const [order] = (await sql`
    INSERT INTO orders (user_id, email, wedding_id, product, description, currency, amount_minor, list_minor, promo_code, partner_id, commission_minor, provider)
    VALUES (${c.user.id}, ${c.user.email}, ${c.wedding?.id ?? null}, ${q.product}, ${q.description}, ${q.currency}, ${amountMinor}, ${Math.round(q.list * 100)}, ${q.promo ?? null}, ${q.partnerId ?? null}, ${commission}, ${provider})
    RETURNING id`) as { id: string }[];

  // 100% promo codes: nothing to charge.
  if (amountMinor === 0) return Response.json({ url: `/api/payments/return?order=${order.id}&free=1` });
  try {
    const p = await createPayment(provider, { id: order.id, currency: q.currency, amount_minor: amountMinor, description: q.description, email: c.user.email }, appUrl(req));
    await sql`UPDATE orders SET provider_ref = ${p.ref} WHERE id = ${order.id}`;
    return Response.json({ url: p.url });
  } catch (e) {
    await sql`UPDATE orders SET status = 'failed' WHERE id = ${order.id}`;
    console.error("checkout", e);
    return Response.json({ error: "The payment provider didn’t respond. Please try again or choose another method." }, { status: 502 });
  }
}
