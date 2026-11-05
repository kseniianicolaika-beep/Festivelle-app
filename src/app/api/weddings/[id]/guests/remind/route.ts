import { sql } from "@/lib/db";
import { appUrl, requireWedding } from "@/lib/guard";
import { emailEnabled, reminderHtml, sendEmail } from "@/lib/email";
import { displayNames } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import { ensureTokens, guestLink } from "../../../../guests/_lib";

// Gentle RSVP reminder to invited guests who haven't replied yet (at most once every 3 days each).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const w = g.wedding;
  if (!w.published) return Response.json({ error: "Publish your site first." }, { status: 400 });
  if (!emailEnabled()) return Response.json({ error: "Email delivery isn’t configured yet — send reminders by WhatsApp or Telegram from the guest list." }, { status: 501 });
  await ensureTokens(id);
  const pending = (await sql`
    SELECT g.id, g.name, g.email, g.token FROM guests g
    WHERE g.wedding_id = ${id} AND g.email IS NOT NULL AND (g.reminded_at IS NULL OR g.reminded_at < now() - interval '3 days')
      AND NOT EXISTS (SELECT 1 FROM rsvps r WHERE r.wedding_id = g.wedding_id AND (r.guest_id = g.id OR lower(r.email) = g.email))
    LIMIT 500`) as { id: string; name: string; email: string; token: string }[];
  const theme = themeById(w.theme);
  const origin = appUrl(req);
  let sent = 0;
  for (const p of pending) {
    try {
      await sendEmail(p.email, `A gentle reminder — ${displayNames(w.profile)}`, reminderHtml(w.profile, theme, guestLink(w, origin, p.token), p.name));
      await sql`UPDATE guests SET reminded_at = now() WHERE id = ${p.id}`;
      sent++;
    } catch { /* keep going */ }
  }
  return Response.json({ message: sent ? `Reminded ${sent} guest${sent === 1 ? "" : "s"} ♥` : "Everyone with an email has replied or was reminded recently." });
}
