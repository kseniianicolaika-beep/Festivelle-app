import { customAlphabet } from "nanoid";
import { sql, type Wedding } from "@/lib/db";
import { siteUrl } from "@/lib/commerce";

export const newToken = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 12);

export type Guest = {
  id: string; name: string; email: string | null; phone: string | null; household: string | null; token: string | null;
  events: string[] | null; plus_ones: number; lang: string | null; notes: string | null; status: string;
  sent_at: string | null; reminded_at: string | null; opened_at: string | null;
};

export const guestLink = (w: Pick<Wedding, "slug" | "subdomain" | "custom_domain">, origin: string, token: string) => {
  const u = siteUrl(w, origin);
  return `${u}${u.includes("?") ? "&" : "?"}g=${token}`;
};

export async function ensureTokens(weddingId: string) {
  const missing = (await sql`SELECT id FROM guests WHERE wedding_id = ${weddingId} AND token IS NULL`) as { id: string }[];
  for (const g of missing) await sql`UPDATE guests SET token = ${newToken()} WHERE id = ${g.id} AND token IS NULL`;
}

// Minimal RFC-4180 CSV.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === "," || c === ";" || c === "\t") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

export const toCsv = (rows: (string | number | null | undefined)[][]) =>
  rows.map((r) => r.map((v) => { const s = v == null ? "" : String(v); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(",")).join("\r\n");

export type GuestInput = { name: string; email?: string | null; phone?: string | null; household?: string | null; events?: string[] | null; plus_ones?: number; lang?: string | null; notes?: string | null };

export function cleanGuest(x: Record<string, unknown>): GuestInput | null {
  const name = String(x.name ?? "").trim().slice(0, 120);
  if (!name) return null;
  const email = String(x.email ?? "").trim().toLowerCase().slice(0, 200);
  const phone = String(x.phone ?? "").replace(/[^\d+]/g, "").slice(0, 20);
  const events = Array.isArray(x.events) ? x.events.map(String).map((s) => s.trim()).filter(Boolean).slice(0, 20) : typeof x.events === "string" && x.events.trim() ? x.events.split(/[|/]/).map((s) => s.trim()).filter(Boolean) : null;
  return {
    name,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
    phone: phone.length >= 7 ? phone : null,
    household: String(x.household ?? "").trim().slice(0, 120) || null,
    events: events?.length ? events : null,
    plus_ones: Math.min(Math.max(Number(x.plus_ones ?? x.plusOnes ?? 0) || 0, 0), 10),
    lang: ["en", "ru", "hi"].includes(String(x.lang)) ? String(x.lang) : null,
    notes: String(x.notes ?? "").trim().slice(0, 500) || null,
  };
}

export async function upsertGuest(weddingId: string, g: GuestInput) {
  const [row] = (g.email
    ? await sql`INSERT INTO guests (wedding_id, name, email, phone, household, events, plus_ones, lang, notes, token)
        VALUES (${weddingId}, ${g.name}, ${g.email}, ${g.phone ?? null}, ${g.household ?? null}, ${g.events ?? null}, ${g.plus_ones ?? 0}, ${g.lang ?? null}, ${g.notes ?? null}, ${newToken()})
        ON CONFLICT (wedding_id, email) DO UPDATE SET name = EXCLUDED.name, phone = COALESCE(EXCLUDED.phone, guests.phone), household = COALESCE(EXCLUDED.household, guests.household),
          events = COALESCE(EXCLUDED.events, guests.events), plus_ones = EXCLUDED.plus_ones, lang = COALESCE(EXCLUDED.lang, guests.lang), notes = COALESCE(EXCLUDED.notes, guests.notes)
        RETURNING *`
    : await sql`INSERT INTO guests (wedding_id, name, phone, household, events, plus_ones, lang, notes, token)
        VALUES (${weddingId}, ${g.name}, ${g.phone ?? null}, ${g.household ?? null}, ${g.events ?? null}, ${g.plus_ones ?? 0}, ${g.lang ?? null}, ${g.notes ?? null}, ${newToken()}) RETURNING *`) as Guest[];
  return row;
}
