import { sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { canEdit, roleIn } from "@/lib/workspace";

export async function DELETE(_req: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId } = await params;
  const [a] = (await sql`SELECT workspace_id FROM assets WHERE id = ${assetId}`) as { workspace_id: string }[];
  if (!a || !canEdit(await roleIn(user, a.workspace_id))) return Response.json({ error: "Not found" }, { status: 404 });
  await sql`DELETE FROM assets WHERE id = ${assetId}`;
  return Response.json({ ok: true });
}
