import { completeText } from "./ai";
import type { Profile } from "./profile";
import { displayNames, occasionOf, OCCASIONS } from "./occasions";
import { formatDate } from "./profile";

// Guest concierge on the published site. Answers ONLY from the hosts' own details; free models only, same chain
// as the designer (Experiential Labs → OpenRouter free, both direct). Returns null when no AI is reachable — the
// widget then shows a fallback.
async function chat(system: string, user: string): Promise<string | null> {
  return completeText([{ role: "system", content: system }, { role: "user", content: user }], { temperature: 0.3, maxTokens: 300 }).catch(() => null);
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
