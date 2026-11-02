import { sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { canManage, roleIn, type Brand } from "@/lib/workspace";

// Update name, type and brand kit (agency white-label).
export async function PATCH(req: Request, { params }: { params: Promise<{ wsId: string }> }) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { wsId } = await params;
  if (!canManage(await roleIn(user, wsId))) return Response.json({ error: "Only owners and admins can change settings." }, { status: 403 });
  const b = await req.json();
  if (typeof b.name === "string" && b.name.trim()) await sql`UPDATE workspaces SET name = ${b.name.trim().slice(0, 80)} WHERE id = ${wsId}`;
  if (b.kind === "agency" || b.kind === "personal") await sql`UPDATE workspaces SET kind = ${b.kind} WHERE id = ${wsId}`;
  if (b.brand && typeof b.brand === "object") {
    const brand: Brand = {};
    if (typeof b.brand.name === "string") brand.name = b.brand.name.slice(0, 80);
    if (typeof b.brand.logoKey === "string" && b.brand.logoKey.startsWith(`workspaces/${wsId}/`)) brand.logoKey = b.brand.logoKey;
    if (typeof b.brand.accent === "string" && /^#[0-9a-f]{6}$/i.test(b.brand.accent)) brand.accent = b.brand.accent;
    if (["show", "agency", "hidden"].includes(b.brand.credit)) brand.credit = b.brand.credit;
    await sql`UPDATE workspaces SET brand = brand || ${JSON.stringify(brand)}::jsonb WHERE id = ${wsId}`;
  }
  return Response.json({ ok: true });
}
