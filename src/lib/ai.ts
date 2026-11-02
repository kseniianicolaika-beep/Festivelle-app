import type { Profile } from "./profile";
import { THEMES } from "./themes";
import { MOTIFS, INVOCATIONS, isMotif } from "./motifs";
import { KINDS, PAPER_LAYOUTS, SITE_LAYOUTS, isKind, type Design, type Doc, type Kind } from "./templates";

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
      "X-Title": "Festivelle",
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

The couple is editing ONE piece at a time (shown as "Active piece"). Pieces: ${Object.entries(KINDS).map(([k, v]) => `${k} (${v.name})`).join(", ")}.
You may restyle the active piece via "design": {layout, motif, invocation, theme, texts {eyebrow, headline, body, footer, hashtag},
 items [{title, detail}] (menu courses or ceremony steps — write them in the guest language, culturally right), align (center|left),
 scale (0.8–1.3, name size), number (table number), eventIndex (which event an event card shows)}.
Paper layouts: ${Object.keys(PAPER_LAYOUTS).join(", ")}. Website layouts: ${Object.keys(SITE_LAYOUTS).join(", ")}.
Motifs (curated line art): ${MOTIFS.map((m) => `${m.id} (${m.name})`).join(", ")}.
Invocations (ONLY if the couple asks or clearly wants one; never assume religion): ${Object.keys(INVOCATIONS).join(", ")}, or null to remove.
If they ask for a new piece (e.g. "make a menu", "I need a welcome sign"), set "addPiece" to its kind.

Respond ONLY with JSON:
{"reply": string, "chips": string[] (2–6 short tappable suggested answers for the next question; [] if none),
 "patch": partial profile {partner1, partner2, culture, tradition, date "YYYY-MM-DD", city, venue,
   events [{name, date "YYYY-MM-DD", time, venue}] (always the FULL list when changing events), vibe, language, story, inviteLine, blessing},
 "theme": theme id for the WHOLE suite or null, "design": partial design for the active piece or null, "addPiece": kind or null,
 "complete": boolean (true once names, culture, venue/city, events, vibe and language are known)}`;

// Only whitelisted, validated design fields ever reach the database.
export function cleanDesign(d: unknown, kind?: Kind): Partial<Design> | undefined {
  if (!d || typeof d !== "object") return undefined;
  const x = d as Record<string, unknown>;
  const out: Partial<Design> = {};
  const layouts: string[] = kind === "website" ? Object.keys(SITE_LAYOUTS) : Object.keys(PAPER_LAYOUTS);
  if (typeof x.layout === "string" && layouts.includes(x.layout)) (out as Record<string, unknown>).layout = x.layout;
  if (isMotif(x.motif)) out.motif = x.motif;
  if (x.invocation === null) out.invocation = null;
  else if (typeof x.invocation === "string" && x.invocation in INVOCATIONS) out.invocation = x.invocation as Design["invocation"];
  if (typeof x.theme === "string" && THEMES.some((t) => t.id === x.theme)) out.theme = x.theme;
  if (x.texts && typeof x.texts === "object") {
    const t: Record<string, string> = {};
    for (const k of ["eyebrow", "headline", "body", "footer", "hashtag"]) {
      const v = (x.texts as Record<string, unknown>)[k];
      if (typeof v === "string") t[k] = v.slice(0, 400);
    }
    out.texts = t;
  }
  if (Array.isArray(x.items)) out.items = x.items.slice(0, 12).filter((i) => i && typeof i === "object" && typeof (i as { title?: unknown }).title === "string").map((i) => ({ title: String((i as { title: string }).title).slice(0, 80), detail: (i as { detail?: unknown }).detail ? String((i as { detail: string }).detail).slice(0, 200) : undefined }));
  if (x.align === "center" || x.align === "left") out.align = x.align;
  if (typeof x.scale === "number") out.scale = Math.min(Math.max(x.scale, 0.7), 1.4);
  if (typeof x.number === "number") out.number = Math.max(1, Math.min(999, Math.round(x.number)));
  if (typeof x.eventIndex === "number") out.eventIndex = Math.max(0, Math.round(x.eventIndex));
  return Object.keys(out).length ? out : undefined;
}

export async function aiTurn(profile: Profile, theme: string, history: { role: string; content: string }[], message: string, doc?: Doc | null) {
  const today = new Date().toISOString().slice(0, 10);
  const piece = doc ? `\nActive piece: ${doc.kind} (${KINDS[doc.kind].name}), layout ${doc.layout}, design ${JSON.stringify(doc.design)}` : "";
  const out = await complete(SYSTEM, `Today is ${today}. Current suite theme: ${theme}.${piece}\nCurrent profile: ${JSON.stringify(profile)}\n\nCouple says: ${message}`, history);
  if (!out || typeof out.reply !== "string") return null;
  const themeOk = THEMES.some((t) => t.id === out.theme);
  return {
    reply: out.reply as string,
    chips: Array.isArray(out.chips) ? (out.chips as unknown[]).map(String).slice(0, 6) : [],
    patch: clean(out.patch ?? {}),
    theme: themeOk ? (out.theme as string) : undefined,
    design: cleanDesign(out.design, doc?.kind),
    addPiece: isKind(out.addPiece) ? (out.addPiece as Kind) : undefined,
    complete: !!out.complete,
  };
}
