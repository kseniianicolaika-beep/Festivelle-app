import { requireWedding } from "@/lib/guard";
import { getDoc, listVersions, logEdit, restoreVersion } from "@/lib/docs";

type P = { params: Promise<{ id: string; docId: string }> };

// Version history for one piece.
export async function GET(_req: Request, { params }: P) {
  const { id, docId } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  if (!(await getDoc(id, docId))) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ versions: await listVersions(docId) });
}

// Restore a version (used by undo, redo and the history list). Returns the version to go back to.
export async function POST(req: Request, { params }: P) {
  const { id, docId } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const doc = await getDoc(id, docId);
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  const b = await req.json().catch(() => ({}));
  const r = await restoreVersion(doc, String(b.versionId ?? ""), g.user.id);
  if (!r) return Response.json({ error: "That version is no longer available." }, { status: 404 });
  const message = b.log ? await logEdit(id, String(b.log)) : null;
  return Response.json({ ...r, message });
}
