import { sql } from "@/lib/db";
import { appUrl, requireOwner } from "@/lib/guard";
import { emailEnabled, inviteHtml, sendEmail } from "@/lib/email";
import { displayNames } from "@/lib/occasions";
import { siteUrl } from "@/lib/commerce";
import { themeById } from "@/lib/themes";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireOwner(id);
  if ("error" in g) return g.error;
  const w = g.wedding;
  if (!w.published) return Response.json({ error: "Publish your website first." }, { status: 400 });
  const { guests } = (await req.json()) as { guests: { name: string; email: string }[] };
  const valid = (guests ?? []).filter((x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.email)).slice(0, 500);
  if (!valid.length) return Response.json({ error: "No valid email addresses found." }, { status: 400 });

  const url = siteUrl(w, appUrl(req));
  const names = displayNames(w.profile);
  const theme = themeById(w.theme);
  let sent = 0;
  const failed: string[] = [];
  for (const guest of valid) {
    let status = "saved";
    if (emailEnabled()) {
      try {
        await sendEmail(guest.email, `${names} — you're invited`, inviteHtml(w.profile, theme, url, guest.name));
        status = "sent";
        sent++;
      } catch {
        status = "failed";
        failed.push(guest.email);
      }
    }
    await sql`INSERT INTO guests (wedding_id, name, email, status, sent_at) VALUES (${id}, ${guest.name}, ${guest.email.toLowerCase()}, ${status}, ${status === "sent" ? new Date().toISOString() : null})
      ON CONFLICT (wedding_id, email) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status, sent_at = COALESCE(EXCLUDED.sent_at, guests.sent_at)`;
  }
  const message = emailEnabled()
    ? `Sent ${sent} invitation${sent === 1 ? "" : "s"}.${failed.length ? ` Couldn't reach: ${failed.join(", ")}` : ""}`
    : `Saved ${valid.length} guest${valid.length === 1 ? "" : "s"}. Email delivery will start once it's configured.`;
  return Response.json({ message, sent, saved: valid.length });
}
