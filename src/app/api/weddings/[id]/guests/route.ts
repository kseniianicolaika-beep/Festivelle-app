import { sql } from "@/lib/db";
import { appUrl, requireWedding } from "@/lib/guard";
import { cleanGuest, ensureTokens, guestLink, parseCsv, toCsv, upsertGuest, type Guest } from "../../../guests/_lib";

type Row = Guest & { attending: boolean | null; party_size: number | null; meal: string | null; dietary: string | null; plus_one_name: string | null; rsvp_events: Record<string, boolean> | null; message: string | null; replied_at: string | null };

async function list(id: string) {
  await ensureTokens(id);
  return (await sql`
    SELECT g.*, r.attending, r.party_size, r.meal, r.dietary, r.plus_one_name, r.events AS rsvp_events, r.message, r.created_at AS replied_at
    FROM guests g
    LEFT JOIN LATERAL (SELECT * FROM rsvps r WHERE r.guest_id = g.id OR (r.guest_id IS NULL AND g.email IS NOT NULL AND lower(r.email) = g.email AND r.wedding_id = g.wedding_id) ORDER BY r.created_at DESC LIMIT 1) r ON true
    WHERE g.wedding_id = ${id} ORDER BY coalesce(g.household, g.name), g.created_at`) as Row[];
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id, { edit: false });
  if ("error" in g) return g.error;
  const rows = await list(id);
  const origin = appUrl(req);
  if (new URL(req.url).searchParams.get("format") === "csv") {
    const csv = toCsv([
      ["name", "email", "phone", "household", "events", "plus_ones", "lang", "notes", "status", "attending", "party_size", "meal", "dietary", "plus_one_name", "message", "link"],
      ...rows.map((r) => [r.name, r.email, r.phone, r.household, r.events?.join("|"), r.plus_ones, r.lang, r.notes, r.status, r.attending == null ? "" : r.attending ? "yes" : "no", r.party_size, r.meal, r.dietary, r.plus_one_name, r.message, r.token ? guestLink(g.wedding, origin, r.token) : ""]),
    ]);
    return new Response("﻿" + csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="guests-${g.wedding.slug}.csv"` } });
  }
  return Response.json({ guests: rows.map((r) => ({ ...r, link: r.token ? guestLink(g.wedding, origin, r.token) : null })) });
}

// Add one guest, many guests, or import a CSV (header row: name,email,phone,household,events,plus_ones,lang,notes).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  let input: Record<string, unknown>[] = Array.isArray(b.guests) ? b.guests : b.guest ? [b.guest] : [];
  if (typeof b.csv === "string") {
    const rows = parseCsv(b.csv.slice(0, 500_000));
    const head = rows[0]?.map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_")) ?? [];
    const hasHeader = head.includes("name");
    const cols = hasHeader ? head : ["name", "email", "phone", "household", "events", "plus_ones"];
    input = (hasHeader ? rows.slice(1) : rows).map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i] ?? ""])));
  }
  const clean = input.slice(0, 2000).map(cleanGuest).filter((x): x is NonNullable<typeof x> => !!x);
  if (!clean.length) return Response.json({ error: "No guests found — each needs at least a name." }, { status: 400 });
  for (const x of clean) await upsertGuest(id, x);
  return Response.json({ added: clean.length });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const c = cleanGuest(b);
  if (!c || typeof b.id !== "string") return Response.json({ error: "Name required" }, { status: 400 });
  await sql`UPDATE guests SET name = ${c.name}, email = ${c.email ?? null}, phone = ${c.phone ?? null}, household = ${c.household ?? null}, events = ${c.events ?? null},
    plus_ones = ${c.plus_ones ?? 0}, lang = ${c.lang ?? null}, notes = ${c.notes ?? null} WHERE id = ${b.id} AND wedding_id = ${id}`;
  return Response.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const gid = new URL(req.url).searchParams.get("guest") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(gid)) return Response.json({ error: "Unknown guest" }, { status: 400 });
  await sql`DELETE FROM guests WHERE id = ${gid} AND wedding_id = ${id}`;
  return Response.json({ ok: true });
}
