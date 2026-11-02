import { sql } from "@/lib/db";
import { requireOwner } from "@/lib/guard";
import { THEMES } from "@/lib/themes";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireOwner(id);
  if ("error" in g) return g.error;
  const body = await req.json();
  if (typeof body.theme === "string" && THEMES.some((t) => t.id === body.theme)) await sql`UPDATE weddings SET theme = ${body.theme}, updated_at = now() WHERE id = ${id}`;
  if (typeof body.published === "boolean") await sql`UPDATE weddings SET published = ${body.published}, updated_at = now() WHERE id = ${id}`;
  if (typeof body.heroKey === "string" && body.heroKey.startsWith(`weddings/${id}/`))
    await sql`UPDATE weddings SET profile = profile || jsonb_build_object('heroKey', ${body.heroKey}::text), updated_at = now() WHERE id = ${id}`;
  return Response.json({ ok: true });
}
