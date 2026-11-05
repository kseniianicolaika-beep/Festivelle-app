import { sql } from "@/lib/db";
import { requireWedding } from "@/lib/guard";

// Host moderation of the guest gallery.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  const photos = await sql`SELECT id, key, uploader, caption, approved, created_at FROM guest_photos WHERE wedding_id = ${id} ORDER BY created_at DESC LIMIT 500`;
  return Response.json({ photos });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  if (typeof b.id !== "string" || typeof b.approved !== "boolean") return Response.json({ error: "Bad request" }, { status: 400 });
  await sql`UPDATE guest_photos SET approved = ${b.approved} WHERE id = ${b.id} AND wedding_id = ${id}`;
  return Response.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const pid = new URL(req.url).searchParams.get("photo") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(pid)) return Response.json({ error: "Bad request" }, { status: 400 });
  await sql`DELETE FROM guest_photos WHERE id = ${pid} AND wedding_id = ${id}`;
  return Response.json({ ok: true });
}
