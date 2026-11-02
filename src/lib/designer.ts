import type { Profile, WeddingEvent } from "./profile";
import { pickTheme, THEMES } from "./themes";
import { aiEnabled, aiTurn } from "./ai";

export type Turn = { reply: string; chips: string[]; profile: Profile; step: number; theme?: string };

export const DONE = 9;

const EVENTS: Record<string, string[]> = {
  indian: ["Haldi", "Mehendi", "Sangeet", "Wedding ceremony", "Reception"],
  russian: ["ZAGS registration", "Vykup", "Ceremony", "Banquet", "Day-two brunch"],
  fusion: ["Mehendi", "Sangeet", "Wedding ceremony", "Vykup", "Banquet"],
  other: ["Welcome drinks", "Ceremony", "Dinner & dancing", "Farewell brunch"],
};

const TRADITIONS: Record<string, string[]> = {
  indian: ["Goan Catholic", "Goan Hindu", "Punjabi", "Gujarati", "Marathi", "Bengali", "Tamil", "Malayali", "Muslim", "Something else"],
  russian: ["Civil (ZAGS) & banquet", "Orthodox venchanie", "Both", "Modern & non-religious"],
  fusion: ["Both traditions, side by side", "One blended ceremony", "Mostly Indian", "Mostly Russian"],
  other: ["Religious", "Civil", "Symbolic"],
};

export const VIBES = ["Sunset beach", "Portuguese villa", "Royal heritage", "White Nights classic", "Quiet & minimal"];

export function opening(): Omit<Turn, "profile" | "step"> {
  return {
    reply: "Congratulations — let’s make something beautiful. I’ll ask a few gentle questions and design your invitation and wedding website as we talk.\n\nFirst, what are your names?",
    chips: [],
  };
}

function parseNames(m: string) {
  const parts = m.split(/\s*(?:&|\+|,|\band\b|\bи\b|\bऔर\b)\s*/i).map((s) => s.trim()).filter(Boolean);
  return parts.length >= 2 ? [cap(parts[0]), cap(parts[1])] : null;
}
const cap = (s: string) => s.replace(/^\p{L}/u, (c) => c.toUpperCase());

export function parseDate(m: string): string | null {
  const iso = m.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const dmy = m.match(/\b(\d{1,2})[./](\d{1,2})[./](\d{4})\b/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  const months = "jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec";
  const clean = m.toLowerCase().replace(/(\d)(st|nd|rd|th)\b/g, "$1").replace(/\bof\b/g, " ");
  const dm = clean.match(new RegExp(`\\b(\\d{1,2})\\s+(${months})[a-z]*\\.?,?\\s+(\\d{4})`)) ?? clean.match(new RegExp(`\\b(${months})[a-z]*\\.?\\s+(\\d{1,2}),?\\s+(\\d{4})`));
  if (dm) {
    const [day, mon] = /\d/.test(dm[1]) ? [dm[1], dm[2]] : [dm[2], dm[1]];
    const mi = months.split("|").indexOf(mon.slice(0, 3)) + 1;
    return `${dm[3]}-${String(mi).padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  const d = new Date(clean);
  if (!Number.isNaN(d.getTime()) && d.getFullYear() > 2000) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return null;
}

function ask(step: number, p: Profile): Omit<Turn, "profile" | "step"> {
  const c = p.culture ?? "other";
  switch (step) {
    case 1:
      return { reply: `${p.partner1} & ${p.partner2} — it already looks lovely in type. Which traditions will your wedding honour?`, chips: ["Indian", "Russian", "Russian–Indian fusion", "Something else"] };
    case 2:
      return { reply: "Tell me a little more, so the details feel like yours.", chips: TRADITIONS[c] };
    case 3:
      return { reply: "When is the big day? Any format works — “14 Feb 2027” is perfect. If you’re still deciding, say “not sure yet”.", chips: ["Not sure yet"] };
    case 4:
      return { reply: "Where will it be? Goa is our home, so I know it well — but anywhere in the world is wonderful.", chips: ["Beach in North Goa", "Portuguese villa, South Goa", "Heritage hotel, Panjim", "Somewhere else"] };
    case 5:
      return { reply: "Which celebrations should guests be invited to? Tap any that apply, or type your own.", chips: [...EVENTS[c], "Just one celebration"] };
    case 6:
      return { reply: "Now the feeling. Which of these is closest to the wedding in your head?", chips: VIBES };
    case 7:
      return { reply: "Which language should your guests read first? (You can add more later.)", chips: ["English", "Русский", "हिन्दी"] };
    case 8:
      return { reply: "Last one, and it’s optional: a line or two about how you met. I’ll put it on your website.", chips: ["Skip for now"] };
    default:
      return {
        reply: "Your invitation, save-the-date and wedding website are ready — have a look on the right. ✨\n\nYou can keep talking to change anything: “make it more royal”, “move the sangeet to the 13th at 7pm”, “switch to Russian”. When you’re happy, publish and send it to your guests.",
        chips: ["Try another style", "Switch language", "Publish & send"],
      };
  }
}

export async function converse(profile: Profile, step: number, message: string, theme: string, history: { role: string; content: string }[] = []): Promise<Turn> {
  // AI-first: OpenRouter drives the whole conversation; the rule engine below is the graceful fallback.
  if (aiEnabled()) {
    const ai = await aiTurn(profile, theme, history, message).catch((e) => (console.error("aiTurn", e), null));
    if (ai) {
      const p = { ...profile, ...ai.patch };
      const done = ai.complete || step >= DONE;
      const nextTheme = ai.theme ?? (p.vibe || p.culture ? pickTheme(p.vibe, p.culture) : theme);
      return { reply: ai.reply, chips: done && !ai.chips.length ? ["Try another style", "Publish & send"] : ai.chips, profile: p, step: done ? DONE : Math.max(step, 1), theme: step >= DONE && !ai.theme ? theme : nextTheme };
    }
  }
  return converseRules(profile, step, message, theme);
}

async function converseRules(profile: Profile, step: number, message: string, theme: string): Promise<Turn> {
  const m = message.trim();
  const p: Profile = { ...profile };
  let next = step;

  switch (step) {
    case 0: {
      const n = parseNames(m);
      if (!n) return { reply: "Could you write both names, like “Anya & Rohan”?", chips: [], profile: p, step };
      [p.partner1, p.partner2] = n;
      next = 1;
      break;
    }
    case 1:
      p.culture = /fusion|–|-|both|mix/i.test(m) && /russ/i.test(m) ? "fusion" : /russ|рус/i.test(m) ? "russian" : /ind|भार/i.test(m) ? "indian" : "other";
      next = 2;
      break;
    case 2:
      p.tradition = m;
      next = 3;
      break;
    case 3: {
      const d = parseDate(m);
      if (!d && !/not sure|later|tbd/i.test(m)) return { reply: "I didn’t quite catch the date — try “14 Feb 2027” or “2027-02-14”.", chips: ["Not sure yet"], profile: p, step };
      p.date = d ?? undefined;
      next = 4;
      break;
    }
    case 4:
      p.venue = m === "Somewhere else" ? undefined : m;
      p.city = /goa|panjim|panaji/i.test(m) ? "Goa, India" : m;
      next = 5;
      break;
    case 5: {
      const names = /just one/i.test(m) ? ["Wedding"] : m.split(/\s*,\s*|\s+and\s+/).filter(Boolean);
      p.events = names.map((name, i): WeddingEvent => ({ name: cap(name), date: p.date && shiftDate(p.date, i - names.length + 1), venue: p.venue }));
      next = 6;
      break;
    }
    case 6:
      p.vibe = m;
      next = 7;
      break;
    case 7:
      p.language = /рус|russ/i.test(m) ? "ru" : /हिन|hindi/i.test(m) ? "hi" : "en";
      next = 8;
      break;
    case 8:
      p.story = /^skip/i.test(m) ? undefined : m;
      next = DONE;
      break;
    default:
      return refine(p, m, theme);
  }

  // During onboarding the design evolves live with every answer.
  const newTheme = next >= 6 || p.culture ? pickTheme(p.vibe, p.culture) : theme;
  return { ...ask(next, p), profile: p, step: next, theme: newTheme };
}

function shiftDate(iso: string, days: number) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// After onboarding: free-form edits. Uses an LLM when configured, otherwise a careful rule-based editor.
async function refine(p: Profile, m: string, theme: string): Promise<Turn> {
  const lower = m.toLowerCase();
  const named = THEMES.find((t) => lower.includes(t.name.toLowerCase()) || lower.includes(t.id));
  if (named) return { reply: `Done — everything is now in ${named.name}: ${named.mood.toLowerCase()}.`, chips: THEMES.filter((t) => t.id !== named.id).map((t) => t.name), profile: p, step: DONE, theme: named.id };
  if (/another style|different|change (the )?(style|design|look)/.test(lower)) {
    const i = THEMES.findIndex((t) => t.id === theme);
    const nt = THEMES[(i + 1) % THEMES.length];
    return { reply: `How about ${nt.name} — ${nt.mood.toLowerCase()}? Say any style name to switch, or keep going.`, chips: THEMES.map((t) => t.name), profile: p, step: DONE, theme: nt.id };
  }
  const vibeTheme = pickTheme(m, "");
  if (/royal|beach|minimal|villa|birch|white nights|modern|tile/.test(lower) && vibeTheme !== theme)
    return { reply: "Reworked the whole suite in that direction.", chips: ["Try another style", "Publish & send"], profile: { ...p, vibe: m }, step: DONE, theme: vibeTheme };
  if (/switch language|language/.test(lower) && !/russ|hindi|english|рус|हिन/.test(lower))
    return { reply: "Which language should guests see?", chips: ["English", "Русский", "हिन्दी"], profile: p, step: DONE, theme };
  if (/russ|русск/.test(lower)) return { reply: "Готово — your guests will now read everything in Russian.", chips: [], profile: { ...p, language: "ru" }, step: DONE, theme };
  if (/hindi|हिन/.test(lower)) return { reply: "हो गया — guests will now read in Hindi.", chips: [], profile: { ...p, language: "hi" }, step: DONE, theme };
  if (/english/.test(lower)) return { reply: "Back to English.", chips: [], profile: { ...p, language: "en" }, step: DONE, theme };
  if (/publish/.test(lower)) return { reply: "Lovely. Use “Publish” above the preview, then add guests under “Send” — by email, WhatsApp or Telegram.", chips: [], profile: p, step: DONE, theme };

  // "move the sangeet to 13 Feb 2027 at 7pm"
  const ev = (p.events ?? []).find((e) => lower.includes(e.name.toLowerCase()));
  if (ev) {
    const d = parseDate(m.replace(new RegExp(ev.name, "i"), ""));
    const time = m.match(/\b(\d{1,2}(:\d{2})?\s?(am|pm))\b/i)?.[1];
    const events = (p.events ?? []).map((e) => (e === ev ? { ...e, date: d ?? e.date, time: time ?? e.time } : e));
    return { reply: `Updated the ${ev.name}${d ? ` to ${d}` : ""}${time ? ` at ${time}` : ""} — invitation and website both reflect it.`, chips: [], profile: { ...p, events }, step: DONE, theme };
  }
  const d = parseDate(m);
  if (d && /date|day|move|wedding/.test(lower)) return { reply: "New date saved everywhere.", chips: [], profile: { ...p, date: d }, step: DONE, theme };
  if (/story|we met/.test(lower)) return { reply: "Your story is on the website now.", chips: [], profile: { ...p, story: m.replace(/^.*?(story|:)\s*/i, "") }, step: DONE, theme };

  return { reply: "I can change the style (try “Azulejo” or “more royal”), the language, any event’s date or time, or your story. What would you like?", chips: THEMES.map((t) => t.name), profile: p, step: DONE, theme };
}
