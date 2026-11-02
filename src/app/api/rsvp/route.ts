import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? "").trim().slice(0, 120);
  if (!name || typeof b.attending !== "boolean" || typeof b.slug !== "string") return Response.json({ error: "Please add your name." }, { status: 400 });
  const party = Math.min(Math.max(Number(b.party) || 1, 1), 20);
  const rows = await sql`
    INSERT INTO rsvps (wedding_id, guest_name, email, attending, party_size, message)
    SELECT id, ${name}, ${String(b.email ?? "").slice(0, 200) || null}, ${b.attending}, ${party}, ${String(b.message ?? "").slice(0, 1000) || null}
    FROM weddings WHERE slug = ${b.slug} AND published RETURNING id`;
  if (!rows.length) return Response.json({ error: "This wedding isn't accepting replies." }, { status: 404 });
  return Response.json({ ok: true });
}
