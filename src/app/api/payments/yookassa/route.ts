import { sql } from "@/lib/db";
import { fulfil } from "@/lib/commerce";
import { isPaid } from "@/lib/payments";
import type { Currency } from "@/lib/pricing";

// YooKassa notification. We never trust the body: the payment is re-fetched from YooKassa before fulfilment.
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const orderId = b?.object?.metadata?.order_id;
  if (b?.event !== "payment.succeeded" || typeof orderId !== "string" || !/^[0-9a-f-]{36}$/i.test(orderId)) return Response.json({ ok: true });
  const [o] = (await sql`SELECT id, provider_ref, currency, amount_minor, description FROM orders WHERE id = ${orderId} AND provider = 'yookassa' AND status = 'pending'`) as { id: string; provider_ref: string; currency: Currency; amount_minor: number; description: string }[];
  if (o && (await isPaid("yookassa", o))) await fulfil(o.id);
  return Response.json({ ok: true });
}
