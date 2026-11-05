import { sql } from "@/lib/db";
import { requireWedding } from "@/lib/guard";
import { realtime, signalQuery, presenceQuery } from "@/lib/realtime";

const COLORS = ["#c06c78", "#6b7f5e", "#1f4e9c", "#d2452b", "#7a4f9a", "#b8862a", "#2a8a8a"];
const colorFor = (id: string) => COLORS[[...id].reduce((n, c) => n + c.charCodeAt(0), 0) % COLORS.length];

// Seal the two live queries (change signal + presence) for members of this celebration.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  await sql`INSERT INTO collab_signal (wedding_id) VALUES (${id}) ON CONFLICT DO NOTHING`;
  const [signal, presence] = await Promise.all([realtime.seal({ query: signalQuery(id) }), realtime.seal({ query: presenceQuery(id) })]);
  return Response.json({ signal, presence, me: { id: g.user.id, color: colorFor(g.user.id) } }, { headers: { "cache-control": "no-store" } });
}

// Heartbeat: who is here and what they're editing. DELETE = leaving.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const path = typeof b.path === "string" ? b.path.slice(0, 80) : null;
  const docId = typeof b.docId === "string" && /^[0-9a-f-]{36}$/i.test(b.docId) ? b.docId : null;
  const name = (g.user.name || g.user.email.split("@")[0]).slice(0, 40);
  await sql`INSERT INTO collab_presence (wedding_id, user_id, name, color, path, doc_id, seen_at)
    VALUES (${id}, ${g.user.id}, ${name}, ${colorFor(g.user.id)}, ${path}, ${docId}, now())
    ON CONFLICT (wedding_id, user_id) DO UPDATE SET path = EXCLUDED.path, doc_id = EXCLUDED.doc_id, name = EXCLUDED.name, seen_at = now()`;
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  await sql`DELETE FROM collab_presence WHERE wedding_id = ${id} AND user_id = ${g.user.id}`;
  return Response.json({ ok: true });
}
