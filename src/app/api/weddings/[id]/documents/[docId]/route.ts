import { sql } from "@/lib/db";
import { requireWedding } from "@/lib/guard";
import { getDoc, logEdit, patchDoc, snapshot } from "@/lib/docs";
import { isAdmin } from "@/lib/admin";
import { CURATED_ACCENTS, isFontPair, isHex } from "@/lib/editor-options";
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
  // Visual-editor fields: font pairing + colours (curated unless Luxury).
  if (isFontPair(b.fonts)) design.fonts = b.fonts;
  if (b.fonts === null) (design as Record<string, unknown>).fonts = null;
  if (b.palette === null) (design as Record<string, unknown>).palette = null;
  else if (b.palette && typeof b.palette === "object") {
    const free = g.wedding.tier === "luxury" || isAdmin(g.user);
    const pal: NonNullable<typeof design.palette> = {};
    for (const k of ["accent", "ink", "bg"] as const) {
      const c = b.palette[k];
      if (isHex(c) && (free || (k === "accent" && CURATED_ACCENTS.includes(c.toLowerCase())))) pal[k] = c.toLowerCase();
    }
    if (Object.keys(pal).length) design.palette = { ...(doc.design.palette ?? {}), ...pal };
    else if (!free) return Response.json({ error: "Free colour choice comes with the Luxury package — pick one of the curated colours." }, { status: 402 });
  }
  if (typeof b.photoKey === "string" && b.photoKey.startsWith(`workspaces/${g.wedding.workspace_id}/`)) design.photoKey = b.photoKey;
  if (b.photoKey === null) (design as Record<string, unknown>).photoKey = null;
  if (doc.kind === "website") {
    const sections = cleanSections(b.sections);
    if (sections) design.sections = sections;
    if (Array.isArray(b.gallery)) design.gallery = b.gallery.filter((k: unknown) => typeof k === "string" && k.startsWith(`workspaces/${g.wedding.workspace_id}/`)).slice(0, 60);
  }
  const versionId = await snapshot(doc, typeof b.log === "string" ? b.log.slice(0, 120) : null, g.user.id);
  const updated = await patchDoc(doc, design);
  const message = typeof b.log === "string" && b.log.trim() ? await logEdit(id, b.log) : null;
  return Response.json({ doc: updated, versionId, message });
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
