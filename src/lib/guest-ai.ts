import type { Profile } from "./profile";
import { displayNames, occasionOf, OCCASIONS } from "./occasions";
import { formatDate } from "./profile";

// Guest concierge on the published site. Answers ONLY from the hosts' own details; free models only
// (Experiential Labs → OpenRouter free). Returns null when no AI is reachable — the widget then shows a fallback.
async function chat(system: string, user: string): Promise<string | null> {
  const tries: { base: string; key?: string; model: string; extra?: Record<string, unknown> }[] = [
    ...(process.env.EXPLABS_API_KEY ? ["gpt-6-luna", "deepseek-v4.1-flash"].map((model) => ({ base: process.env.EXPLABS_BASE_URL || "https://api.experientiallabs.ai/v1", key: process.env.EXPLABS_API_KEY, model })) : []),
    ...(process.env.OPENROUTER_API_KEY ? [{ base: "https://openrouter.ai/api/v1", key: process.env.OPENROUTER_API_KEY, model: "openrouter/free" }] : []),
  ];
  for (const t of tries) {
    try {
      const res = await fetch(`${t.base}/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${t.key}` },
        body: JSON.stringify({ model: t.model, temperature: 0.3, max_tokens: 300, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) continue;
      const j = await res.json();
      const text = String(j.choices?.[0]?.message?.content ?? "").trim();
      if (text) return text;
    } catch {
      /* next provider */
    }
  }
  return null;
}

export function factSheet(p: Profile, extra?: string) {
  const o = OCCASIONS[occasionOf(p)];
  const lines = [
    `Occasion: ${o.name}. Hosts/honourees: ${displayNames(p)}${p.age ? ` (${p.age})` : ""}.`,
    p.date && `Main date: ${formatDate(p.date)}.`,
    (p.venue || p.city) && `Venue: ${[p.venue, p.city].filter(Boolean).join(", ")}.`,
    p.tradition && `Tradition: ${p.tradition}.`,
    p.events?.length && `Schedule: ${p.events.map((e) => [e.name, e.date && formatDate(e.date), e.time, e.venue].filter(Boolean).join(" — ")).join("; ")}.`,
    p.vibe && `Mood / dress feel: ${p.vibe}.`,
    extra && `Additional information from the hosts: ${extra}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export async function answerGuest(p: Profile, question: string, extra?: string, guestName?: string | null) {
  const lang = p.language ?? "en";
  const system = `You are the warm, discreet concierge on a private celebration website. Answer the guest's question in 1–3 short sentences,
in the language they wrote in (default ${lang}). Use ONLY the facts below. If the answer isn't there, say kindly that the hosts
haven't shared that yet and suggest asking them directly. Never invent times, addresses, prices or policies. No markdown.

${factSheet(p, extra)}`;
  return chat(system, `${guestName ? `Guest ${guestName} asks: ` : ""}${question}`);
}
