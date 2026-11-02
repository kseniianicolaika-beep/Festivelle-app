import { sql } from "@/lib/db";
import { requireWedding } from "@/lib/guard";
import { THEMES } from "@/lib/themes";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const body = await req.json();
  if (typeof body.theme === "string" && THEMES.some((t) => t.id === body.theme)) await sql`UPDATE weddings SET theme = ${body.theme}, updated_at = now() WHERE id = ${id}`;
  if (typeof body.published === "boolean") await sql`UPDATE weddings SET published = ${body.published}, updated_at = now() WHERE id = ${id}`;
  if (typeof body.clientName === "string") await sql`UPDATE weddings SET client_name = ${body.clientName.slice(0, 120) || null} WHERE id = ${id}`;
  // Hero photo must come from this wedding's workspace asset library (or the legacy per-wedding prefix).
  if (typeof body.heroKey === "string" && (body.heroKey.startsWith(`workspaces/${g.wedding.workspace_id}/`) || body.heroKey.startsWith(`weddings/${id}/`)))
    await sql`UPDATE weddings SET profile = profile || jsonb_build_object('heroKey', ${body.heroKey}::text), updated_at = now() WHERE id = ${id}`;
  if (body.heroKey === null) await sql`UPDATE weddings SET profile = profile - 'heroKey' WHERE id = ${id}`;
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  if (g.wedding.role !== "owner" && g.wedding.role !== "admin") return Response.json({ error: "Only owners can delete a wedding." }, { status: 403 });
  await sql`DELETE FROM weddings WHERE id = ${id}`;
  return Response.json({ ok: true });
}
