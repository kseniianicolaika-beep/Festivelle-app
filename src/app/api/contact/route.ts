import { sql } from "@/lib/db";
import { brandedEmail, esc, OWNER_INBOX, sendTransactional, sequenzyEnabled } from "@/lib/sequenzy";
import { EMAIL_RE, clean, preflight, readJson, reply } from "@/lib/public-api";

// Contact form (festivelle.love/contact, "Request this design"). Stored in Neon, emailed to the owner.
export const OPTIONS = preflight;

export async function POST(req: Request) {
  const b = await readJson(req);
  const name = clean(b?.name, 120), email = clean(b?.email, 254).toLowerCase(), topic = clean(b?.topic, 120) || "General", message = clean(b?.message, 5000);
  const lang = clean(b?.lang, 5) === "ru" ? "ru" : "en";
  if (!name || !EMAIL_RE.test(email) || message.length < 2) return reply(req, { error: "Please add your name, a valid email and a message." }, 400);
  try {
    await sql`INSERT INTO inquiries (kind, email, name, payload) VALUES ('contact', ${email}, ${name}, ${JSON.stringify({ topic, message, lang })}::jsonb)`;
    if (await sequenzyEnabled()) {
      await sendTransactional({ to: OWNER_INBOX(), replyTo: email, subject: `[${topic}] ${name} via festivelle.love`, html: brandedEmail(`Message from ${name}`, `<p style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#9a7f78">${esc(email)} · ${esc(topic)} · ${lang.toUpperCase()}</p><p style="font-size:16px;line-height:1.6;white-space:pre-wrap">${esc(message)}</p>`) });
    }
    return reply(req, { ok: true });
  } catch (e) {
    console.error("contact failed", (e as Error).message.slice(0, 200));
    return reply(req, { error: "Something went wrong — please try again, or write to kseniia@festivelle.love." }, 502);
  }
}
