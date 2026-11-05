import { sql } from "@/lib/db";
import { fulfil } from "@/lib/commerce";
import { isPaid, verifyRazorpaySignature } from "@/lib/payments";
import type { Currency } from "@/lib/pricing";

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyRazorpaySignature(raw, req.headers.get("x-razorpay-signature"))) return new Response("bad signature", { status: 400 });
  const b = JSON.parse(raw);
  const orderId = b?.payload?.payment_link?.entity?.reference_id;
  if (b.event !== "payment_link.paid" || typeof orderId !== "string" || !/^[0-9a-f-]{36}$/i.test(orderId)) return Response.json({ ok: true });
  const [o] = (await sql`SELECT id, provider_ref, currency, amount_minor, description FROM orders WHERE id = ${orderId} AND provider = 'razorpay' AND status = 'pending'`) as { id: string; provider_ref: string; currency: Currency; amount_minor: number; description: string }[];
  if (o && (await isPaid("razorpay", o))) await fulfil(o.id);
  return Response.json({ ok: true });
}
