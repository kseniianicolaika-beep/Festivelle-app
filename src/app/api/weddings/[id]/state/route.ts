import { sql } from "@/lib/db";
import { requireWedding } from "@/lib/guard";
import { listDocs } from "@/lib/docs";

// Fresh snapshot for collaborators after a remote change.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  const [w] = (await sql`SELECT profile, theme, published, step FROM weddings WHERE id = ${id}`) as { profile: unknown; theme: string; published: boolean; step: number }[];
  const [docs, messages] = await Promise.all([
    listDocs(id),
    sql`SELECT id, role, content, chips, kind FROM messages WHERE wedding_id = ${id} ORDER BY created_at`,
  ]);
  return Response.json({ ...w, docs, messages }, { headers: { "cache-control": "no-store" } });
}
