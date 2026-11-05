import { sql } from "@/lib/db";

// RSVP 2.0: optional personal guest token, per-event answers, meal / dietary, plus-one name.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? "").trim().slice(0, 120);
  if (!name || typeof b.attending !== "boolean" || typeof b.slug !== "string") return Response.json({ error: "Please add your name." }, { status: 400 });
  const [w] = (await sql`SELECT id FROM weddings WHERE slug = ${b.slug} AND published AND (expires_at IS NULL OR expires_at > now())`) as { id: string }[];
  if (!w) return Response.json({ error: "This celebration isn't accepting replies." }, { status: 404 });

  const guest = typeof b.g === "string" && b.g
    ? ((await sql`SELECT id, plus_ones, events FROM guests WHERE wedding_id = ${w.id} AND token = ${b.g}`) as { id: string; plus_ones: number; events: string[] | null }[])[0]
    : undefined;
  const maxParty = guest ? 1 + guest.plus_ones : 20;
  const party = b.attending ? Math.min(Math.max(Number(b.party) || 1, 1), maxParty) : 0;
  let events: Record<string, boolean> | null = null;
  if (b.events && typeof b.events === "object") {
    events = {};
    for (const [k, v] of Object.entries(b.events as Record<string, unknown>).slice(0, 20)) {
      if (typeof v === "boolean" && (!guest?.events || guest.events.includes(k))) events[k.slice(0, 80)] = v;
    }
  }
  const s = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n) || null;
  await sql`
    INSERT INTO rsvps (wedding_id, guest_id, guest_name, email, attending, party_size, message, events, meal, dietary, plus_one_name)
    VALUES (${w.id}, ${guest?.id ?? null}, ${name}, ${s(b.email, 200)}, ${b.attending}, ${Math.max(party, 1)}, ${s(b.message, 1000)},
      ${events ? JSON.stringify(events) : null}::jsonb, ${s(b.meal, 60)}, ${s(b.dietary, 200)}, ${b.attending ? s(b.plusOne, 120) : null})`;
  if (guest) await sql`UPDATE guests SET status = ${b.attending ? "attending" : "declined"} WHERE id = ${guest.id}`;
  return Response.json({ ok: true });
}
