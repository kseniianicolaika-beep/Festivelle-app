// Neon Function: serves an .ics calendar of a wedding's events, running next to the database.
import { neon } from "@neondatabase/serverless";

type Ev = { name: string; date?: string; time?: string; venue?: string };

const esc = (s: string) => s.replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");

function stamp(date: string, time?: string) {
  const m = time?.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  let h = m ? Number(m[1]) : 17;
  if (m?.[3]?.toLowerCase() === "pm" && h < 12) h += 12;
  if (m?.[3]?.toLowerCase() === "am" && h === 12) h = 0;
  return `${date.replace(/-/g, "")}T${String(h).padStart(2, "0")}${m?.[2] ?? "00"}00`;
}

export default async function calendar(req: Request): Promise<Response> {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!/^[a-z0-9]{4,32}$/.test(slug)) return new Response("Missing slug", { status: 400 });
  const sql = neon(process.env.DATABASE_URL!);
  const rows = (await sql`SELECT profile FROM weddings WHERE slug = ${slug} AND published`) as { profile: { partner1?: string; partner2?: string; events?: Ev[]; venue?: string } }[];
  if (!rows[0]) return new Response("Not found", { status: 404 });
  const p = rows[0].profile;
  const couple = `${p.partner1 ?? ""} & ${p.partner2 ?? ""}`;
  const events = (p.events ?? []).filter((e) => e.date);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Builder//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${esc(couple)}`];
  events.forEach((e, i) => {
    const start = stamp(e.date!, e.time);
    lines.push("BEGIN:VEVENT", `UID:${slug}-${i}@wedding`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART;TZID=Asia/Kolkata:${start}`, "DURATION:PT4H", `SUMMARY:${esc(`${e.name} — ${couple}`)}`, `LOCATION:${esc(e.venue ?? p.venue ?? "")}`, "END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n"), { headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": `attachment; filename="${slug}.ics"`, "access-control-allow-origin": "*" } });
}
