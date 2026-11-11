import { customAlphabet } from "nanoid";
import { sql } from "@/lib/db";
import { brandedEmail, esc, OWNER_INBOX, sendTransactional, sequenzyEnabled } from "@/lib/sequenzy";
import { EMAIL_RE, clean, preflight, readJson, reply } from "@/lib/public-api";

// Partner programme application from festivelle.love/partners. Lands as an INACTIVE partner
// (approve it in /admin/partners) and notifies the owner; the applicant gets a confirmation.
const refCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);
export const OPTIONS = preflight;

export async function POST(req: Request) {
  const b = await readJson(req);
  const name = clean(b?.name, 120), email = clean(b?.email, 254).toLowerCase(), company = clean(b?.company, 160);
  const website = clean(b?.website, 300), type = clean(b?.type, 60) || "other", city = clean(b?.city, 120), message = clean(b?.message, 3000);
  const lang = clean(b?.lang, 5) === "ru" ? "ru" : "en";
  if (!name || !EMAIL_RE.test(email)) return reply(req, { error: "Please add your name and a valid email." }, 400);
  const url = /^https?:\/\//i.test(website) ? website : website ? `https://${website}` : null;
  try {
    await sql`INSERT INTO partners (name, category, city, url, blurb, ref_code, contact_email, active, agreement)
      VALUES (${company || name}, ${type}, ${city || null}, ${url}, ${message || null}, ${refCode()}, ${email}, false, ${`Applied via festivelle.love by ${name}`})`;
    await sql`INSERT INTO inquiries (kind, email, name, payload) VALUES ('partner', ${email}, ${name}, ${JSON.stringify({ company, website, type, city, message, lang })}::jsonb)`;
    if (await sequenzyEnabled()) {
      const rows = [["Name", name], ["Email", email], ["Company", company], ["Website", website], ["Type", type], ["City", city], ["Message", message]].filter(([, v]) => v);
      await Promise.allSettled([
        sendTransactional({ to: OWNER_INBOX(), replyTo: email, subject: `New partner application — ${company || name}`, html: brandedEmail("New partner application", `<table style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6">${rows.map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#9a7f78;vertical-align:top">${k}</td><td>${esc(v)}</td></tr>`).join("")}</table><p style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#9a7f78">Approve it in the admin → Partners.</p>`) }),
        sendTransactional({ to: email, subject: lang === "ru" ? "Мы получили вашу заявку — Festivelle" : "We've received your application — Festivelle", html: brandedEmail(lang === "ru" ? "Спасибо за заявку" : "Thank you for applying", `<p style="font-size:16px;line-height:1.6">${lang === "ru" ? `Здравствуйте, ${esc(name)}! Мы получили вашу заявку в партнёрскую программу Festivelle и ответим в течение двух рабочих дней.` : `Hello ${esc(name)}, we've received your application to the Festivelle partner programme and will reply within two working days.`}</p>`) }),
      ]);
    }
    return reply(req, { ok: true });
  } catch (e) {
    console.error("partner apply failed", (e as Error).message.slice(0, 200));
    return reply(req, { error: "Something went wrong — please try again, or write to kseniia@festivelle.love." }, 502);
  }
}
