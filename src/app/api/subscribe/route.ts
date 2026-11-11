import { sql } from "@/lib/db";
import { addSubscriber, sequenzyEnabled } from "@/lib/sequenzy";
import { EMAIL_RE, clean, preflight, readJson, reply } from "@/lib/public-api";

// Newsletter ("Stay Updated") — subscriber goes to Sequenzy, a copy is kept in Neon.
export const OPTIONS = preflight;

export async function POST(req: Request) {
  const b = await readJson(req);
  const email = clean(b?.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return reply(req, { error: "Please enter a valid email address." }, 400);
  const lang = clean(b?.lang, 5) === "ru" ? "ru" : "en";
  const region = ["IN", "RU", "INTL"].includes(clean(b?.region, 5)) ? clean(b?.region, 5) : "INTL";
  try {
    await sql`INSERT INTO inquiries (kind, email, payload) VALUES ('newsletter', ${email}, ${JSON.stringify({ lang, region })}::jsonb)`;
    if (await sequenzyEnabled()) await addSubscriber({ email, tags: ["newsletter", `lang-${lang}`, `region-${region.toLowerCase()}`], attributes: { language: lang, region, source: "festivelle.love" } });
    return reply(req, { ok: true });
  } catch (e) {
    console.error("subscribe failed", (e as Error).message.slice(0, 200));
    return reply(req, { error: "We couldn't subscribe you just now — please try again in a moment." }, 502);
  }
}
