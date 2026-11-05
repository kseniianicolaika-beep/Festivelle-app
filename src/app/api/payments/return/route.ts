import { sql } from "@/lib/db";
import { fulfil } from "@/lib/commerce";
import { isPaid, type ProviderId } from "@/lib/payments";
import type { Currency } from "@/lib/pricing";

type O = { id: string; wedding_id: string | null; provider: ProviderId; provider_ref: string | null; currency: Currency; amount_minor: number; description: string; status: string; product: string };

// The shopper lands here after paying. We confirm with the provider server-to-server, then fulfil.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("order") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Unknown order", { status: 404 });
  const [o] = (await sql`SELECT * FROM orders WHERE id = ${id}`) as O[];
  if (!o) return new Response("Unknown order", { status: 404 });
  let ok = o.status === "paid";
  if (!ok && o.status === "pending") {
    const paid = o.amount_minor === 0 || (await isPaid(o.provider, o).catch(() => false));
    if (paid) ok = await fulfil(o.id) || true;
  }
  const dest = o.wedding_id ? `/studio/${o.wedding_id}` : "/studio/billing";
  return Response.redirect(new URL(`${dest}?${ok ? "paid" : "pending"}=${encodeURIComponent(o.product)}`, u.origin), 303);
}
