import { sql } from "@/lib/db";
import { fulfil } from "@/lib/commerce";
import { isPaid, verifyNowpaymentsSignature } from "@/lib/payments";
import type { Currency } from "@/lib/pricing";

// Crypto IPN: signature check, then the payment is re-fetched from NOWPayments before fulfilment.
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !verifyNowpaymentsSignature(b, req.headers.get("x-nowpayments-sig"))) return new Response("bad signature", { status: 400 });
  const orderId = String(b.order_id ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return Response.json({ ok: true });
  const [o] = (await sql`SELECT id, provider_ref, currency, amount_minor, description FROM orders WHERE id = ${orderId} AND provider = 'nowpayments' AND status = 'pending'`) as { id: string; provider_ref: string; currency: Currency; amount_minor: number; description: string }[];
  if (o && (await isPaid("nowpayments", o, String(b.payment_id ?? "")))) await fulfil(o.id);
  return Response.json({ ok: true });
}
