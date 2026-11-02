import type { Profile } from "./profile";
import { THEMES } from "./themes";

// Any OpenAI-compatible endpoint. Neon AI Gateway is preferred (NEON_AI_GATEWAY_*, needs a paid Neon plan);
// AI_BASE_URL / AI_API_KEY / AI_MODEL can point at any other provider.
function config() {
  const base = process.env.NEON_AI_GATEWAY_BASE_URL || process.env.AI_BASE_URL;
  const key = process.env.NEON_AI_GATEWAY_TOKEN || process.env.AI_API_KEY;
  if (!base || !key) return null;
  return { base: base.replace(/\/$/, ""), key, model: process.env.AI_MODEL || "claude-sonnet-5-5" };
}

export const aiEnabled = () => !!config();

export async function aiEdit(profile: Profile, theme: string, message: string) {
  const c = config();
  if (!c) return null;
  const system = `You are the design concierge of a luxury wedding builder serving Indian and Russian couples (with deep knowledge of Goa).
The couple sends an edit request. Respond ONLY with JSON: {"reply": string (warm, one or two sentences, in English unless they wrote in another language), "patch": partial profile object, "theme": optional theme id}.
Profile schema: partner1, partner2, culture (indian|russian|fusion|other), tradition, date (YYYY-MM-DD), city, venue, events [{name,date,time,venue}], vibe, language (en|ru|hi), story.
Themes: ${THEMES.map((t) => `${t.id} (${t.mood})`).join("; ")}.
Be culturally precise and respectful. Never invent facts about the couple.`;
  const res = await fetch(`${c.base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${c.key}` },
    body: JSON.stringify({
      model: c.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Current theme: ${theme}\nProfile: ${JSON.stringify(profile)}\nRequest: ${message}` },
      ],
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const text: string = json.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const themeOk = THEMES.some((t) => t.id === parsed.theme);
  return { reply: String(parsed.reply ?? "Done."), patch: (parsed.patch ?? {}) as Partial<Profile>, theme: themeOk ? (parsed.theme as string) : undefined };
}
