import { sql } from "@/lib/db";
import { appUrl, requireOwner } from "@/lib/guard";
import { emailEnabled, inviteHtml, sendEmail } from "@/lib/email";
import { displayNames } from "@/lib/occasions";
import { guestLink, upsertGuest } from "../../../guests/_lib";
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

  const origin = appUrl(req);
  const names = displayNames(w.profile);
  const theme = themeById(w.theme);
  let sent = 0;
  const failed: string[] = [];
  for (const guest of valid) {
    let status = "saved";
    // Every guest gets a personal link (greets them by name, shows their events, pre-fills the RSVP).
    const row = await upsertGuest(id, { name: guest.name.slice(0, 120) || guest.email.split("@")[0], email: guest.email.toLowerCase() });
    const url = guestLink(w, origin, row.token!);
    if (await emailEnabled()) {
      try {
        await sendEmail(guest.email, `${names} — you're invited`, inviteHtml(w.profile, theme, url, guest.name));
        status = "sent";
        sent++;
      } catch {
        status = "failed";
        failed.push(guest.email);
      }
    }
    await sql`UPDATE guests SET status = CASE WHEN status IN ('attending','declined') THEN status ELSE ${status} END,
      sent_at = COALESCE(${status === "sent" ? new Date().toISOString() : null}::timestamptz, sent_at) WHERE id = ${row.id}`;
  }
  const message = (await emailEnabled())
    ? `Sent ${sent} invitation${sent === 1 ? "" : "s"}.${failed.length ? ` Couldn't reach: ${failed.join(", ")}` : ""}`
    : `Saved ${valid.length} guest${valid.length === 1 ? "" : "s"}. Email delivery will start once it's configured.`;
  return Response.json({ message, sent, saved: valid.length });
}
