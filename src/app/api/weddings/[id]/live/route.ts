import { requireWedding } from "@/lib/guard";
import { realtime, rsvpQuery } from "@/lib/realtime";

// Seals the live RSVP query for the wedding's owner only.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  return Response.json(await realtime.seal({ query: rsvpQuery(id) }), { headers: { "cache-control": "no-store" } });
}
