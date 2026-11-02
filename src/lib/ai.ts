import type { Profile } from "./profile";
import { THEMES } from "./themes";

// All AI runs through OpenRouter using FREE models only.
// Chosen by a side-by-side test (Nov 2026) on a Russian–Punjabi Sikh couple: Nemotron 3 Ultra gave fluent Russian,
// correctly named the Anand Karaj ceremony and kept clean structured output. The others are automatic fallbacks
// (OpenRouter tries them in order if one is rate-limited). `openrouter/free` is the final safety net.
export const FREE_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3.5-super-vl:free",
  "openrouter/free",
]; // OpenRouter accepts at most 3 models per request

const isFree = (m: string) => m.endsWith(":free") || m === "openrouter/free";

function config() {
  if (!process.env.OPENROUTER_API_KEY) return null;
  // An override is honoured only if it's a free model — paid models can never be selected by accident.
  const override = (process.env.OPENROUTER_MODEL ?? "").trim();
  const models = (override && isFree(override) ? [override, ...FREE_MODELS.filter((m) => m !== override)] : FREE_MODELS).slice(0, 3);
  return { base: "https://openrouter.ai/api/v1", key: process.env.OPENROUTER_API_KEY, models };
}

export const aiEnabled = () => !!config();

async function complete(system: string, user: string, history: { role: string; content: string }[] = []) {
  const c = config();
  if (!c) return null;
  const res = await fetch(`${c.base}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${c.key}`,
      "HTTP-Referer": process.env.APP_URL || "https://wedding-builder-two.vercel.app",
      "X-Title": "Wedding Builder",
    },
    body: JSON.stringify({
      model: c.models[0],
      models: c.models, // OpenRouter fallback routing, free models only
      temperature: 0.7,
      messages: [{ role: "system", content: system }, ...history.slice(-16), { role: "user", content: user }],
    }),
    signal: AbortSignal.timeout(55_000),
  });
  if (!res.ok) throw new Error(`AI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const text: string = json.choices?.[0]?.message?.content ?? "";
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
}

const KEYS: (keyof Profile)[] = ["partner1", "partner2", "culture", "tradition", "date", "city", "venue", "events", "vibe", "language", "story", "inviteLine", "blessing"];

function clean(patch: Record<string, unknown>): Partial<Profile> {
  const out: Record<string, unknown> = {};
  for (const k of KEYS) if (k in patch && patch[k] !== null) out[k] = patch[k];
  if (out.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(out.date))) delete out.date;
  if (out.language && !["en", "ru", "hi"].includes(String(out.language))) delete out.language;
  if (out.culture && !["indian", "russian", "fusion", "other"].includes(String(out.culture))) delete out.culture;
  if (out.events && !Array.isArray(out.events)) delete out.events;
  return out as Partial<Profile>;
}

const SYSTEM = `You are the romantic, impeccably tasteful design concierge of a luxury AI wedding builder made in Goa, India,
serving Russian couples, Indian couples (every region and faith) and Russian–Indian couples, for weddings in Goa or anywhere.

You hold a warm conversation to learn: both names, culture (indian|russian|fusion|other) and specific tradition
(e.g. Goan Catholic, Punjabi Sikh, Tamil Brahmin, Orthodox venchanie, ZAGS civil), wedding date, city and venue,
the celebrations guests attend (mehendi, haldi, sangeet, pheras, nikah, ZAGS, vykup, banquet...), the mood, the
language guests should read (en|ru|hi), and optionally their love story. Ask ONE thing at a time, briefly, like a
gifted friend — never a form. Mirror the couple's language (reply in Russian if they write Russian, etc.).
Be culturally precise and respectful; never stereotype, never invent facts about the couple.

As soon as you know enough, also write "inviteLine" (an elegant 1–2 sentence invitation in the GUEST language,
appropriate to their tradition) and "blessing" (a short closing line, e.g. a blessing or a toast, in the guest language).
Rewrite "story" beautifully (max 3 sentences) if they share one.

Design worlds (theme ids): ${THEMES.map((t) => `${t.id} = ${t.mood}`).join("; ")}. Choose the theme that fits.

After onboarding, act on any edit request (dates, times, events, wording, style, language) and confirm warmly.

Respond ONLY with JSON:
{"reply": string, "chips": string[] (2–6 short tappable suggested answers for the next question; [] if none),
 "patch": partial profile {partner1, partner2, culture, tradition, date "YYYY-MM-DD", city, venue,
   events [{name, date "YYYY-MM-DD", time, venue}] (always the FULL list when changing events), vibe, language, story, inviteLine, blessing},
 "theme": theme id or null, "complete": boolean (true once names, culture, venue/city, events, vibe and language are known)}`;

export async function aiTurn(profile: Profile, theme: string, history: { role: string; content: string }[], message: string) {
  const today = new Date().toISOString().slice(0, 10);
  const out = await complete(SYSTEM, `Today is ${today}. Current theme: ${theme}.\nCurrent profile: ${JSON.stringify(profile)}\n\nCouple says: ${message}`, history);
  if (!out || typeof out.reply !== "string") return null;
  const themeOk = THEMES.some((t) => t.id === out.theme);
  return {
    reply: out.reply as string,
    chips: Array.isArray(out.chips) ? (out.chips as unknown[]).map(String).slice(0, 6) : [],
    patch: clean(out.patch ?? {}),
    theme: themeOk ? (out.theme as string) : undefined,
    complete: !!out.complete,
  };
}
