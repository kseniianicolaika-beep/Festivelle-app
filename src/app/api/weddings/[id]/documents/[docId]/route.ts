import { sql } from "@/lib/db";
import { requireWedding } from "@/lib/guard";
import { getDoc, patchDoc } from "@/lib/docs";
import { cleanDesign } from "@/lib/ai";
import { cleanSections } from "@/lib/templates";

type P = { params: Promise<{ id: string; docId: string }> };

export async function PATCH(req: Request, { params }: P) {
  const { id, docId } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const doc = await getDoc(id, docId);
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  const b = await req.json();
  const design = cleanDesign(b, doc.kind) ?? {};
  if (typeof b.photoKey === "string" && b.photoKey.startsWith(`workspaces/${g.wedding.workspace_id}/`)) design.photoKey = b.photoKey;
  if (b.photoKey === null) (design as Record<string, unknown>).photoKey = null;
  if (doc.kind === "website") {
    const sections = cleanSections(b.sections);
    if (sections) design.sections = sections;
    if (Array.isArray(b.gallery)) design.gallery = b.gallery.filter((k: unknown) => typeof k === "string" && k.startsWith(`workspaces/${g.wedding.workspace_id}/`)).slice(0, 60);
  }
  return Response.json({ doc: await patchDoc(doc, design) });
}

export async function DELETE(_req: Request, { params }: P) {
  const { id, docId } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const n = (await sql`SELECT count(*)::int AS n FROM documents WHERE wedding_id = ${id}`) as { n: number }[];
  if (n[0].n <= 1) return Response.json({ error: "Keep at least one piece." }, { status: 400 });
  await sql`DELETE FROM documents WHERE id = ${docId} AND wedding_id = ${id}`;
  return Response.json({ ok: true });
}
