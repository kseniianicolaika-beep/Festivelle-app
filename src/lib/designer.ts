import type { Profile, WeddingEvent } from "./profile";
import { pickTheme, THEMES } from "./themes";
import { aiEnabled, aiTurn } from "./ai";
import { KINDS, PAPER_LAYOUTS, SITE_LAYOUTS, type Design, type Doc, type Kind } from "./templates";
import { MOTIFS, INVOCATIONS } from "./motifs";
import { sectionLayout, SECTIONS, type SectionId } from "./templates";
import { OCCASIONS, OCCASION_EVENTS, occasionOf, type OccasionId } from "./occasions";

export type Turn = { reply: string; chips: string[]; profile: Profile; step: number; theme?: string; design?: Partial<Design> & { layout?: string }; addPiece?: Kind };

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

export function opening(occasion: OccasionId = "wedding"): Omit<Turn, "profile" | "step"> {
  if (occasion !== "wedding") return { reply: FLOWS[occasion][0].ask({ occasion }).reply, chips: FLOWS[occasion][0].ask({ occasion }).chips };
  return {
    reply: "Congratulations — let’s make something beautiful. I’ll ask a few gentle questions and design your invitation and wedding website as we talk.\n\nFirst, what are your names?",
    chips: [],
  };
}

function parseNames(m: string) {
  // \b is ASCII-only in JS, so Cyrillic/Devanagari separators need explicit whitespace.
  const cleaned = m.replace(/^\s*(we are|we're|i am|i'm|мы|это|हम)\s+/iu, "").replace(/[!.?…]+$/u, "").trim();
  const parts = cleaned.split(/\s*(?:&|\+|,)\s*|\s+(?:and|и|और)\s+/iu).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2 || parts.some((p) => p.split(/\s+/).length > 3)) return null;
  return [cap(parts[0]), cap(parts[1])];
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

export async function converse(profile: Profile, step: number, message: string, theme: string, history: { role: string; content: string }[] = [], doc?: Doc | null, selected?: string): Promise<Turn> {
  // AI-first: OpenRouter drives the whole conversation; the rule engine below is the graceful fallback.
  if (await aiEnabled()) {
    const ai = await aiTurn(profile, theme, history, message, doc, selected).catch((e) => (console.error("aiTurn", e), null));
    if (ai) {
      const p = { ...profile, ...ai.patch };
      const done = ai.complete || step >= DONE;
      const nextTheme = ai.theme ?? (p.vibe || p.culture ? pickTheme(p.vibe, p.culture) : theme);
      return { reply: ai.reply, chips: done && !ai.chips.length ? ["Show me templates", "Add a menu", "Publish & send"] : ai.chips, profile: p, step: done ? DONE : Math.max(step, 1), theme: step >= DONE && !ai.theme ? theme : nextTheme, design: ai.design, addPiece: ai.addPiece };
    }
  }
  // Design edits on the active piece work in rules mode too, at any step.
  const de = ruleDesign(message, doc);
  if (de && step >= DONE) return { ...de, profile, step, theme };
  const occ = occasionOf(profile);
  if (occ !== "wedding" && step < DONE) return flowRules(occ, profile, step, message, theme);
  return converseRules(profile, step, message, theme);
}

// ── Rule-based conversations for every other occasion (the AI handles these natively when configured) ──
type Q = { ask: (p: Profile) => { reply: string; chips: string[] }; take: (m: string, p: Profile) => Profile | string };

const LANG_Q: Q = {
  ask: () => ({ reply: "Which language should your guests read first?", chips: ["English", "Русский", "हिन्दी"] }),
  take: (m, p) => ({ ...p, language: /рус|russ/i.test(m) ? "ru" : /हिन|hindi/i.test(m) ? "hi" : "en" }),
};
const DATE_Q = (what: string): Q => ({
  ask: () => ({ reply: `When is ${what}? “14 Feb 2027” is perfect — or say “not sure yet”.`, chips: ["Not sure yet"] }),
  take: (m, p) => { const d = parseDate(m); if (!d && !/not sure|later|tbd/i.test(m)) return "I didn’t quite catch the date — try “14 Feb 2027”."; return { ...p, date: d ?? undefined }; },
});
const VENUE_Q: Q = {
  ask: () => ({ reply: "Where will everyone gather?", chips: ["At home", "A restaurant", "A beach in Goa", "A garden"] }),
  take: (m, p) => ({ ...p, venue: m, city: /goa/i.test(m) ? "Goa, India" : p.city }),
};
const EVENTS_Q = (o: Exclude<OccasionId, "wedding">): Q => ({
  ask: () => ({ reply: "What’s planned? Tap any that apply, or type your own.", chips: [...OCCASION_EVENTS[o], "Just one celebration"] }),
  take: (m, p) => {
    const names = /just one/i.test(m) ? [OCCASIONS[o].name] : m.split(/\s*,\s*|\s+and\s+/).filter(Boolean);
    return { ...p, events: names.map((name): WeddingEvent => ({ name: cap(name), date: p.date, venue: p.venue })) };
  },
});
const VIBE_Q = (chips: string[], reply = "And the feeling — which is closest?"): Q => ({ ask: () => ({ reply, chips }), take: (m, p) => ({ ...p, vibe: m }) });
const STORY_Q = (reply: string): Q => ({ ask: () => ({ reply, chips: ["Skip for now"] }), take: (m, p) => ({ ...p, story: /^skip/i.test(m) ? undefined : m }) });
const NAME_Q = (reply: string): Q => ({
  ask: () => ({ reply, chips: [] }),
  take: (m, p) => {
    const two = parseNames(m);
    if (two) return { ...p, partner1: two[0], partner2: two[1] };
    const one = cap(m.replace(/^\s*(it'?s|for|my name is|i am|i'm)\s+/i, "").replace(/[!.?…]+$/u, "").trim());
    return one && one.split(/\s+/).length <= 4 ? { ...p, partner1: one, partner2: undefined } : "Just the name is perfect.";
  },
});
const PAIR_Q = (reply: string): Q => ({ ask: () => ({ reply, chips: [] }), take: (m, p) => { const n = parseNames(m); return n ? { ...p, partner1: n[0], partner2: n[1] } : "Could you write both names, like “Elena & Vikram”?"; } });
const AGE_Q = (reply: string, chips: string[] = []): Q => ({
  ask: () => ({ reply, chips: [...chips, "Rather not say"] }),
  take: (m, p) => { const n = Number(m.match(/\d{1,3}/)?.[0]); return Number.isFinite(n) && n > 0 ? { ...p, age: n } : { ...p, age: undefined }; },
});

const FLOWS: Record<Exclude<OccasionId, "wedding">, Q[]> = {
  engagement: [
    PAIR_Q("Congratulations — a yes deserves something beautiful. What are your names?"),
    DATE_Q("the celebration"),
    VENUE_Q,
    EVENTS_Q("engagement"),
    VIBE_Q(["Blush & romantic", "Black-tie champagne", "Portuguese villa", "Marigold roka", "Quiet & minimal"]),
    LANG_Q,
    STORY_Q("Tell me how the proposal happened — I’ll write it beautifully for your guests."),
  ],
  anniversary: [
    PAIR_Q("What a lovely thing to celebrate. Whose love story is this? (Both names, please.)"),
    AGE_Q("How many years together?", ["1", "10", "25", "40", "50"]),
    DATE_Q("the celebration"),
    VENUE_Q,
    EVENTS_Q("anniversary"),
    VIBE_Q(["Pearl & timeless", "Ruby & velvet", "White Nights classic", "Royal heritage", "Love letters"]),
    LANG_Q,
    STORY_Q("Share one memory from your years together — it will be the heart of the invitation."),
  ],
  birthday: [
    NAME_Q("Let’s make it unforgettable. Whose birthday is it?"),
    AGE_Q("Which birthday? (Only if they’d like it shown.)", ["30", "40", "50", "60"]),
    DATE_Q("the party"),
    VENUE_Q,
    EVENTS_Q("birthday"),
    VIBE_Q(["Black-tie champagne", "Midnight party", "Blush soirée", "Sunset on the beach", "Garden lunch"]),
    LANG_Q,
    STORY_Q("A line about the birthday person — I’ll turn it into something lovely."),
  ],
  kids: [
    NAME_Q("Oh, a party! What’s the birthday child’s name?"),
    AGE_Q("And how old are they turning?", ["1", "3", "5", "7", "10"]),
    VIBE_Q(["Balloons & confetti", "Space & stars", "Jungle", "Unicorns", "Dinosaurs", "Under the sea"], "What’s the party theme?"),
    DATE_Q("the party"),
    VENUE_Q,
    EVENTS_Q("kids"),
    LANG_Q,
  ],
  baby_shower: [
    NAME_Q("How wonderful. Who are we showering with love? (One name, or both parents.)"),
    { ask: () => ({ reply: "Is it a boy, a girl — or a beautiful surprise?", chips: ["Boy", "Girl", "Twins", "A surprise"] }), take: (m, p) => ({ ...p, tradition: m }) },
    DATE_Q("the shower"),
    VENUE_Q,
    EVENTS_Q("baby_shower"),
    VIBE_Q(["Clouds & moon", "Blush & ribbons", "Jasmine & white", "Marigold godh bharai"]),
    LANG_Q,
  ],
  bridal_shower: [
    NAME_Q("A shower for the bride-to-be — lovely. What's her name?"),
    DATE_Q("the shower"),
    VENUE_Q,
    EVENTS_Q("bridal_shower"),
    VIBE_Q(["Blush & petals", "Champagne brunch", "Garden tea party", "Boho beach"]),
    LANG_Q,
    STORY_Q("Tell me one thing her friends adore about her — I'll weave it in."),
  ],
  rehearsal_dinner: [
    PAIR_Q("The night before the big day — let's set the table. What are the couple's names?"),
    DATE_Q("the dinner"),
    VENUE_Q,
    EVENTS_Q("rehearsal_dinner"),
    VIBE_Q(["Candlelit long table", "Terracotta & olive", "Black-tie", "Beach shack supper"]),
    LANG_Q,
  ],
  gender_reveal: [
    PAIR_Q("Pink or blue — how exciting! What are the parents-to-be's names?"),
    DATE_Q("the reveal"),
    VENUE_Q,
    { ask: () => ({ reply: "How will the big moment happen?", chips: ["Balloons", "Cake cutting", "Confetti cannon", "Smoke & fireworks", "Not decided"] }), take: (m, p) => ({ ...p, tradition: m }) },
    VIBE_Q(["Pastel clouds", "Playful confetti", "Garden brunch", "Minimal & chic"]),
    LANG_Q,
  ],
  baptism: [
    NAME_Q("What a blessed day. What's the little one's name?"),
    { ask: () => ({ reply: "Which ceremony is it?", chips: ["Baptism", "Christening", "Naamkaran", "Naming ceremony"] }), take: (m, p) => ({ ...p, tradition: m }) },
    DATE_Q("the ceremony"),
    VENUE_Q,
    EVENTS_Q("baptism"),
    VIBE_Q(["Ivory lace", "Doves & olive", "Soft blue", "Blush & pearl"]),
    LANG_Q,
  ],
  corporate_party: [
    NAME_Q("Let's throw a party your team will talk about. Which company is hosting?"),
    { ask: () => ({ reply: "What are you celebrating?", chips: ["Year-end gala", "Team celebration", "Client evening", "Company anniversary", "Awards night"] }), take: (m, p) => ({ ...p, tradition: m }) },
    DATE_Q("the party"),
    VENUE_Q,
    EVENTS_Q("corporate_party"),
    VIBE_Q(["Black-tie gala", "Gatsby glamour", "Beach sundowner", "Clean & modern"]),
    LANG_Q,
  ],
  conference: [
    NAME_Q("Let's build your conference page. What's the conference called?"),
    STORY_Q("In a sentence — what's it about and who is it for?"),
    DATE_Q("the conference"),
    VENUE_Q,
    EVENTS_Q("conference"),
    VIBE_Q(["Clean & modern", "Bold & editorial", "Tropical Goa", "Classic & formal"]),
    LANG_Q,
  ],
  product_launch: [
    NAME_Q("A launch — exciting! What's the product or brand called?"),
    STORY_Q("One line on what it is — I'll make it irresistible."),
    DATE_Q("the launch"),
    VENUE_Q,
    EVENTS_Q("product_launch"),
    VIBE_Q(["Dark & cinematic", "Bright & minimal", "Champagne glamour", "Playful pop"]),
    LANG_Q,
  ],
  networking: [
    NAME_Q("Let's bring the right people together. What's the event or community called?"),
    STORY_Q("Who is it for? (Founders, designers, expats in Goa…)"),
    DATE_Q("the event"),
    VENUE_Q,
    EVENTS_Q("networking"),
    VIBE_Q(["Relaxed & friendly", "Clean & modern", "Sundowner", "Breakfast club"]),
    LANG_Q,
  ],
  holiday: [
    NAME_Q("Festive season! Who's hosting? (e.g. “The Kapoors”)"),
    { ask: () => ({ reply: "Which celebration?", chips: ["Diwali", "Christmas", "New Year", "Easter", "Holi", "Eid", "Maslenitsa"] }), take: (m, p) => ({ ...p, tradition: m }) },
    DATE_Q("the party"),
    VENUE_Q,
    EVENTS_Q("holiday"),
    VIBE_Q(["Golden diyas", "Snowy & cosy", "Midnight sparkle", "Spring blossoms"]),
    LANG_Q,
  ],
  dinner_party: [
    NAME_Q("A dinner party — my favourite. Who's hosting?"),
    DATE_Q("dinner"),
    VENUE_Q,
    EVENTS_Q("dinner_party"),
    VIBE_Q(["Candlelit long table", "Terracotta & olive", "Black-tie", "Garden supper"]),
    LANG_Q,
    STORY_Q("Anything guests should know — a menu, a dress code, a reason to celebrate?"),
  ],
  housewarming: [
    NAME_Q("Congratulations on the new home! Who's hosting? (One name or both.)"),
    DATE_Q("the housewarming"),
    VENUE_Q,
    EVENTS_Q("housewarming"),
    VIBE_Q(["Warm & homely", "Marigold griha pravesh", "Garden party", "Modern & minimal"]),
    LANG_Q,
  ],
  special: [
    { ask: () => ({ reply: "What are we celebrating?", chips: ["Graduation", "Retirement", "Farewell", "Welcome home", "Reunion", "Award"] }), take: (m, p) => ({ ...p, tradition: m }) },
    NAME_Q("Lovely. Who is it in honour of?"),
    DATE_Q("the celebration"),
    VENUE_Q,
    EVENTS_Q("special"),
    VIBE_Q(["Elegant & timeless", "Playful confetti", "Garden party", "Black-tie"]),
    LANG_Q,
  ],
  greeting: [
    NAME_Q("Let’s write something they’ll keep. Who is the card for?"),
    { ask: () => ({ reply: "What’s the occasion?", chips: ["Birthday", "Anniversary", "Thank you", "Congratulations", "New baby", "Diwali", "New Year", "Christmas", "Eid"] }), take: (m, p) => ({ ...p, tradition: m }) },
    { ask: (p) => ({ reply: `Write your message for ${p.partner1 ?? "them"} — or tell me one thing you love about them and I’ll write it.`, chips: ["Write it for me"] }), take: (m, p) => ({ ...p, story: /write it for me/i.test(m) ? cannedGreeting(p) : m }) },
    { ask: () => ({ reply: "Who is it from? I’ll sign it for you.", chips: [] }), take: (m, p) => ({ ...p, blessing: /^(with|love|с )/i.test(m) ? m : `With love, ${cap(m.trim())}` }) },
    VIBE_Q(["Love letter", "Champagne", "Pearl & timeless", "Starry night", "Blush"], "Choose the feeling of the card."),
    LANG_Q,
  ],
};

function cannedGreeting(p: Profile) {
  const g = (p.tradition ?? "").toLowerCase();
  const n = p.partner1 ?? "you";
  if (/birth/.test(g)) return `Happy birthday, ${n}. Another year of your laugh, your kindness and the way you make every room warmer — the world is lucky to have you in it. Here’s to a year as bright as you are.`;
  if (/anniv/.test(g)) return `To ${n} — every year you’ve shared is proof that the best love stories only get better. Wishing you many more chapters, just as beautiful.`;
  if (/thank/.test(g)) return `${n}, thank you — truly. Your kindness meant more than you know, and it will be remembered for a long, long time.`;
  if (/baby|born/.test(g)) return `Welcome to the world, little one — and congratulations, ${n}. May your home be full of lullabies, laughter and the softest kind of love.`;
  if (/diwali/.test(g)) return `Wishing you a Diwali full of light, ${n} — may every diya bring warmth, joy and good fortune to your home.`;
  return `Dear ${n}, sending you all our love today — may this moment be as wonderful as you are.`;
}

const FLOW_DONE: Record<Exclude<OccasionId, "wedding">, string> = {
  engagement: "Your engagement invitation and website are ready — have a look. ✨\n\nKeep talking to change anything: “more champagne”, “move the dinner to 8pm”, “switch to Russian”.",
  anniversary: "Your anniversary invitation and website are ready — have a look. ✨\n\nAsk for anything: “make it ruby”, “add a photo gallery”, “warmer wording”.",
  birthday: "The invitation and party page are ready — have a look. ✨\n\nAsk me to change anything: “more glamorous”, “add dress code”, “switch to Russian”.",
  kids: "The party invitation is ready — have a look! 🎈\n\nChange anything: “more colourful”, “add balloons”, “move the cake to 4pm”.",
  baby_shower: "The baby-shower invitation and page are ready — have a look. ✨\n\nAsk for anything: “softer wording”, “add a gift registry note”, “switch to Hindi”.",
  bridal_shower: "The shower invitation and page are ready — have a look. ✨\n\nAsk for anything: “more playful”, “add a dress code”, “switch to Russian”.",
  rehearsal_dinner: "The rehearsal-dinner invitation is ready — have a look. ✨\n\nAsk for anything: “add the menu”, “move dinner to 8pm”, “warmer wording”.",
  gender_reveal: "The reveal invitation and page are ready — have a look. 🎈\n\nAsk for anything: “more pastel”, “add a guessing poll note”, “switch to Russian”.",
  baptism: "The baptism invitation and page are ready — have a look. ✨\n\nAsk for anything: “add the godparents”, “softer wording”, “switch to Russian”.",
  corporate_party: "Your party invitation and event page are ready — have a look. ✨\n\nAsk for anything: “add our logo colours”, “add a dress code”, “move dinner to 8pm”.",
  conference: "Your conference website and invitation are ready — have a look. ✨\n\nAsk for anything: “add a speaker”, “add the agenda”, “switch to Russian”.",
  product_launch: "Your launch invitation and page are ready — have a look. ✨\n\nAsk for anything: “darker and more cinematic”, “add a countdown line”, “shorter wording”.",
  networking: "Your event invitation and page are ready — have a look. ✨\n\nAsk for anything: “more relaxed”, “add the agenda”, “switch to Russian”.",
  holiday: "Your festive invitation and page are ready — have a look. ✨\n\nAsk for anything: “more sparkle”, “add the menu”, “switch to Russian”.",
  dinner_party: "Your dinner invitation is ready — have a look. ✨\n\nAsk for anything: “add the menu”, “black-tie please”, “warmer wording”.",
  housewarming: "Your housewarming invitation and page are ready — have a look. ✨\n\nAsk for anything: “add directions”, “more festive”, “switch to Russian”.",
  special: "Your invitation and page are ready — have a look. ✨\n\nAsk for anything: “more formal”, “add speeches at 7pm”, “switch to Russian”.",
  greeting: "Your card is ready — have a look. ✨\n\nAsk me to make it funnier, shorter or more tender, then download or share it.",
};

function flowRules(o: Exclude<OccasionId, "wedding">, profile: Profile, step: number, message: string, theme: string): Turn {
  const flow = FLOWS[o];
  const i = Math.min(step, flow.length - 1);
  const r = flow[i].take(message.trim(), { ...profile, occasion: o });
  if (typeof r === "string") return { reply: r, chips: flow[i].ask(profile).chips, profile, step };
  const next = i + 1;
  const nextTheme = r.vibe ? pickTheme(r.vibe, "") : theme;
  if (next >= flow.length) return { reply: FLOW_DONE[o], chips: o === "greeting" ? ["Make it funnier", "Try another style", "Download"] : ["Try another style", "Show me templates", "Publish & send"], profile: r, step: DONE, theme: nextTheme };
  return { ...flow[next].ask(r), profile: r, step: next, theme: nextTheme };
}

// Rule-based piece editing: layouts, motifs, invocations, new pieces, size.
function ruleDesign(m: string, doc?: Doc | null): Pick<Turn, "reply" | "chips" | "design" | "addPiece"> | null {
  const l = m.toLowerCase();
  const ALIASES: Record<Kind, string> = {
    website: "website|wedding site", invite: "invitation|invite card", save: "save[- ]the[- ]date", event: "event card|haldi card|mehendi card|sangeet card",
    story: "story|status", post: "square post|instagram post|post", welcome: "welcome sign|welcome board", program: "programme|program|order of ceremony",
    menu: "menu", table: "table numbers?|table card", hashtag: "hashtag|photo sign", thankyou: "thank[- ]?you( card)?", greeting: "greeting( card)?|card for",
  };
  // Website sections: "move the gallery up", "hide the schedule", "show the RSVP"
  if (doc?.kind === "website") {
    const ALIAS: Record<SectionId, string> = { invitation: "invitation|message", story: "story", details: "details", schedule: "schedule|timeline|programme|program", venue: "venue|location|map|directions", gallery: "gallery|photos", rsvp: "rsvp|reply form", info: "info|information|faq" };
    const sec = (Object.keys(ALIAS) as SectionId[]).find((s) => new RegExp(`\\b(${ALIAS[s]})\\b`).test(l));
    if (sec) {
      const { order, hidden } = sectionLayout(doc.design.sections);
      const name = SECTIONS[sec].toLowerCase();
      const i = order.indexOf(sec);
      const move = (to: number) => { const o = order.filter((s) => s !== sec); o.splice(Math.max(0, Math.min(o.length, to)), 0, sec); return o; };
      if (/\b(hide|remove|delete|without)\b/.test(l)) return { reply: `The ${name} is hidden — say “show the ${name}” to bring it back.`, chips: [], design: { sections: { order, hidden: [...hidden, sec] } } };
      if (/\b(show|add|bring back|unhide)\b/.test(l) && hidden.has(sec)) return { reply: `The ${name} is back.`, chips: [], design: { sections: { order, hidden: [...hidden].filter((s) => s !== sec) } } };
      if (/\b(to the top|first)\b/.test(l)) return { reply: `The ${name} now comes first.`, chips: [], design: { sections: { order: move(0), hidden: [...hidden] } } };
      if (/\b(to the end|to the bottom|last)\b/.test(l)) return { reply: `The ${name} is now at the end.`, chips: [], design: { sections: { order: move(order.length), hidden: [...hidden] } } };
      if (/\b(up|higher|earlier)\b/.test(l)) return { reply: `Moved the ${name} up.`, chips: [], design: { sections: { order: move(i - 1), hidden: [...hidden] } } };
      if (/\b(down|lower|later)\b/.test(l)) return { reply: `Moved the ${name} down.`, chips: [], design: { sections: { order: move(i + 1), hidden: [...hidden] } } };
    }
  }
  const addKind = (Object.keys(ALIASES) as Kind[]).find((k) => new RegExp(`\\b(add|make|create|need|want|design|new)\\b[^.]*\\b(a |an |the |some )?(${ALIASES[k]})\\b`).test(l));
  if (addKind) return { reply: `A ${KINDS[addKind].name.toLowerCase()} is on its way — I've opened it for you. Tell me anything you'd like to change.`, chips: ["Try another layout", "Change the motif"], addPiece: addKind };
  if (!doc) return null;
  const layouts = doc.kind === "website" ? SITE_LAYOUTS : PAPER_LAYOUTS;
  const lay = Object.entries(layouts).find(([k, v]) => l.includes(k) || l.includes(v.toLowerCase()));
  if (lay) return { reply: `Here it is in the ${lay[1]} layout.`, chips: Object.values(layouts).filter((v) => v !== lay[1]).slice(0, 4), design: { layout: lay[0] } };
  if (/another layout|different layout|new layout/.test(l)) {
    const keys = Object.keys(layouts);
    const next = keys[(keys.indexOf(doc.layout) + 1) % keys.length];
    return { reply: `How about ${layouts[next as keyof typeof layouts]}?`, chips: ["Try another layout", "Change the motif"], design: { layout: next } };
  }
  const motif = MOTIFS.find((x) => l.includes(x.id) || l.includes(x.name.toLowerCase().split(" ")[0]));
  if (motif) return { reply: `I've drawn ${motif.name.toLowerCase()} onto it.`, chips: ["Change the motif", "Try another layout"], design: { motif: motif.id } };
  if (/change the motif|another motif|different motif/.test(l)) return { reply: "Choose a motif — each one is hand-drawn.", chips: MOTIFS.slice(0, 6).map((x) => x.name), design: undefined };
  if (/remove (the )?(invocation|blessing symbol|ganesh|om|cross|bismillah)/.test(l)) return { reply: "Removed.", chips: [], design: { invocation: null } };
  const inv = (Object.entries(INVOCATIONS) as [keyof typeof INVOCATIONS, (typeof INVOCATIONS)[keyof typeof INVOCATIONS]][]).find(([k, v]) => l.includes(k) || l.includes(v.label.toLowerCase()));
  if (inv) return { reply: `Added ${inv[1].label} at the top, with respect.`, chips: ["Remove the invocation"], design: { invocation: inv[0] } };
  if (/bigger names|larger names|names bigger/.test(l)) return { reply: "Names are a little grander now.", chips: [], design: { scale: Math.min((doc.design.scale ?? 1) + 0.15, 1.4) } };
  if (/smaller names|names smaller/.test(l)) return { reply: "A touch more delicate.", chips: [], design: { scale: Math.max((doc.design.scale ?? 1) - 0.15, 0.7) } };
  const table = l.match(/table (number )?(\d+)/);
  if (table && doc.kind === "table") return { reply: `Table ${table[2]} it is.`, chips: [], design: { number: Number(table[2]) } };
  return null;
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
