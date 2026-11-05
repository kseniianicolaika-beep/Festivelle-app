import { requireWedding } from "@/lib/guard";
import { createDoc } from "@/lib/docs";
import { isKind } from "@/lib/templates";
import { cleanDesign } from "@/lib/ai";

// Add a piece (optionally from a gallery template: layout + theme + motif).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const b = await req.json();
  if (!isKind(b.kind)) return Response.json({ error: "Unknown piece" }, { status: 400 });
  const doc = await createDoc(id, b.kind, g.wedding.profile, b.layout, cleanDesign({ theme: b.theme, motif: b.motif, fonts: b.fonts }, b.kind) ?? {});
  return Response.json({ doc });
}
