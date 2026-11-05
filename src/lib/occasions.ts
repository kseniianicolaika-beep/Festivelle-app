import type { Profile } from "./profile";
import type { Kind } from "./templates";
import type { MotifId } from "./motifs";

type Lang = "en" | "ru" | "hi";
type L3 = Record<Lang, string>;

// Every celebration Festivelle designs. `pair` = two honourees ("Anna & Mark"); otherwise one ("Mia turns 7").
// `pairable` = one or two names both read naturally (a baby shower for "Anna & Mark").
// CONTRACT (shared): OCCASIONS, OccasionId, isOccasion, occasionOf, displayNames, priceGroup, occasionBrief.
export const OCCASIONS = {
  wedding: {
    name: "Wedding", pair: true, pairable: true, group: "wedding", theme: "konkan-sunset", motif: "rings",
    blurb: "Invitations, a wedding website and live RSVPs — for every ritual from haldi to ZAGS.",
    sample: { partner1: "Anya", partner2: "Rohan", date: "2027-02-14", venue: "Ashwem Beach, Goa" },
  },
  engagement: {
    name: "Engagement", pair: true, pairable: true, group: "wedding", theme: "rose-quartz", motif: "rings",
    blurb: "Announce the yes — ring ceremony, roka or an evening of champagne.",
    sample: { partner1: "Maya", partner2: "Arjun", date: "2027-01-09", venue: "Villa Fontainhas, Panjim" },
  },
  anniversary: {
    name: "Anniversary", pair: true, pairable: true, group: "celebration", theme: "pearl", motif: "doves",
    blurb: "Twenty-five years, or the first — a love story retold for the people who watched it grow.",
    sample: { partner1: "Elena", partner2: "Vikram", date: "2027-03-20", venue: "The Lisbon Room, Goa", age: 25 },
  },
  birthday: {
    name: "Birthday", pair: false, pairable: false, group: "celebration", theme: "champagne-noir", motif: "champagne",
    blurb: "A grown-up evening of candlelight, music and the people who matter.",
    sample: { partner1: "Natasha", date: "2027-04-18", venue: "Thalassa, Vagator", age: 30 },
  },
  kids: {
    name: "Children's party", pair: false, pairable: false, group: "celebration", theme: "confetti-garden", motif: "balloons",
    blurb: "Balloons, cake and wonder — an invitation as joyful as the party.",
    sample: { partner1: "Mia", date: "2027-05-02", venue: "Our garden, Assagao", age: 7 },
  },
  baby_shower: {
    name: "Baby shower", pair: false, pairable: true, group: "celebration", theme: "cloud-nursery", motif: "moon",
    blurb: "Soft as a lullaby — welcome the little one with the people who'll love them most.",
    sample: { partner1: "Priya", partner2: "Sam", date: "2027-06-12", venue: "Casa Susegad, Loutolim" },
  },
  greeting: {
    name: "Digital greeting", pair: false, pairable: false, group: "greeting", theme: "love-letter", motif: "ribbon",
    blurb: "A handwritten-feeling card — birthdays, thank-yous, new babies, festivals.",
    sample: { partner1: "Grandma Olga", tradition: "Birthday" },
  },
} as const satisfies Record<string, { name: string; pair: boolean; pairable: boolean; group: string; theme: string; motif: MotifId; blurb: string; sample: Partial<Profile> }>;

export type OccasionId = keyof typeof OCCASIONS;
export type PriceGroup = (typeof OCCASIONS)[OccasionId]["group"];
export const OCCASION_IDS = Object.keys(OCCASIONS) as OccasionId[];
export const isOccasion = (o: unknown): o is OccasionId => typeof o === "string" && o in OCCASIONS;
export const occasionOf = (p: Profile): OccasionId => (isOccasion(p.occasion) ? p.occasion : "wedding");
export const priceGroup = (p: Profile): PriceGroup => OCCASIONS[occasionOf(p)].group;

/** Whether a second name is shown ("Anna & Mark"). */
export const isPair = (p: Profile) => !!p.partner2 && OCCASIONS[occasionOf(p)].pairable;

export function displayNames(p: Profile) {
  const o = OCCASIONS[occasionOf(p)];
  if (!p.partner1) return o.name;
  return isPair(p) ? `${p.partner1} & ${p.partner2}` : p.partner1;
}

/** [first, second | ""] — second is empty for single-honouree celebrations. */
export const nameParts = (p: Profile): [string, string] => [p.partner1 || (OCCASIONS[occasionOf(p)].pair ? "Partner" : "You"), isPair(p) ? p.partner2! : OCCASIONS[occasionOf(p)].pair ? "Partner" : ""];

const lang = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

/** The short line under/over the names — never "getting married" on a birthday. */
export function occasionLine(p: Profile): string {
  const n = p.age;
  const L = lang(p);
  const lines: Record<OccasionId, L3> = {
    wedding: { en: "are getting married", ru: "женятся", hi: "विवाह बंधन में बंध रहे हैं" },
    engagement: { en: "are engaged", ru: "помолвлены", hi: "की सगाई है" },
    anniversary: n ? { en: `celebrate ${n} years together`, ru: `отмечают ${n} лет вместе`, hi: `साथ के ${n} वर्ष मना रहे हैं` } : { en: "celebrate their anniversary", ru: "отмечают годовщину", hi: "वैवाहिक वर्षगांठ मना रहे हैं" },
    birthday: n ? { en: `turns ${n}`, ru: `— нам ${n}!`, hi: `${n} वर्ष के हो रहे हैं` } : { en: "is celebrating a birthday", ru: "празднует день рождения", hi: "का जन्मदिन है" },
    kids: n ? { en: `is turning ${n}`, ru: `— мне ${n}!`, hi: `${n} साल के हो रहे हैं` } : { en: "is having a party", ru: "приглашает на праздник", hi: "की पार्टी है" },
    baby_shower: { en: "a baby shower for", ru: "бэйби-шавер для", hi: "गोद भराई —" },
    greeting: { en: "with love, for", ru: "с любовью для", hi: "स्नेह सहित" },
  };
  return lines[occasionOf(p)][L];
}

/** Default invitation wording when the AI hasn't written one yet. */
export function occasionInvite(p: Profile): string {
  const L = lang(p);
  const lines: Record<OccasionId, L3> = {
    wedding: { en: "Together with their families, request the pleasure of your company", ru: "Вместе с семьями приглашают вас разделить с ними этот день", hi: "अपने परिवारों के साथ, आपकी उपस्थिति का सादर निवेदन करते हैं" },
    engagement: { en: "She said yes. Come and raise a glass with us", ru: "Она сказала «да». Поднимем бокалы вместе", hi: "हमारी सगाई की खुशी में शामिल होइए" },
    anniversary: { en: "The years have only made it sweeter — celebrate with us", ru: "Годы сделали её только нежнее — разделите этот вечер с нами", hi: "सालों ने इसे और मधुर बनाया है — हमारे साथ जश्न मनाइए" },
    birthday: { en: "An evening of candlelight, music and dear friends — you're invited", ru: "Вечер свечей, музыки и близких друзей — ждём вас", hi: "रोशनी, संगीत और प्यारे दोस्तों की शाम — आप आमंत्रित हैं" },
    kids: { en: "Balloons, cake and plenty of giggles — come and play!", ru: "Шарики, торт и море смеха — приходите играть!", hi: "गुब्बारे, केक और ढेर सारी मस्ती — खेलने आइए!" },
    baby_shower: { en: "A little one is on the way — join us to shower them with love", ru: "Скоро нас станет больше — приходите осыпать малыша любовью", hi: "नन्हा मेहमान आने वाला है — अपना आशीर्वाद देने आइए" },
    greeting: { en: "Thinking of you today, with all our love", ru: "Думаем о тебе сегодня — с любовью", hi: "आज आपको ढेर सारा प्यार" },
  };
  return lines[occasionOf(p)][L];
}

/** Events suggested during the conversation (rule-engine chips). */
export const OCCASION_EVENTS: Record<Exclude<OccasionId, "wedding">, string[]> = {
  engagement: ["Ring ceremony", "Roka", "Cocktail evening", "Engagement dinner"],
  anniversary: ["Dinner", "Vow renewal", "Party", "Family lunch"],
  birthday: ["Welcome drinks", "Dinner", "Party", "Morning-after brunch"],
  kids: ["Games", "Cake cutting", "Magic show", "Treasure hunt"],
  baby_shower: ["Godh bharai", "Afternoon tea", "Games", "Blessings"],
  greeting: [],
};

/** The pieces a new celebration starts with. */
export function starterFor(o: OccasionId): { kind: Kind; layout: string }[] {
  if (o === "greeting") return [{ kind: "greeting", layout: "classic" }, { kind: "story", layout: "classic" }];
  if (o === "wedding") return [{ kind: "invite", layout: "classic" }, { kind: "website", layout: "romance" }, { kind: "save", layout: "classic" }];
  return [{ kind: "invite", layout: "classic" }, { kind: "website", layout: "romance" }, { kind: "story", layout: "classic" }];
}

/** Injected into the AI system prompt so the concierge speaks to the right celebration. */
export function occasionBrief(id: OccasionId): string {
  const briefs: Record<OccasionId, string> = {
    wedding: "OCCASION: a wedding. partner1/partner2 are the couple. Learn names, culture & tradition, date, venue, the celebrations (mehendi, haldi, sangeet, pheras, nikah, ZAGS, vykup, banquet…), mood, guest language and their love story.",
    engagement: "OCCASION: an engagement. partner1/partner2 are the couple. Learn names, date, venue, the gatherings (ring ceremony, roka, cocktail evening, dinner), mood, guest language and how they got engaged (put it in \"story\"). inviteLine announces the engagement — never call it a wedding.",
    anniversary: "OCCASION: a wedding anniversary. partner1/partner2 are the couple; \"age\" = number of years married. Learn names, years, date, venue, plans (dinner, vow renewal, party), mood, language and a memory from their years together (\"story\"). Celebrate longevity tenderly.",
    birthday: "OCCASION: an adult birthday. partner1 = the person celebrating, partner2 = null; \"age\" = the age they turn (only if they want it shown). Learn name, age, date, venue, plan for the evening, mood, guest language and a line about them (\"story\"). Elegant, warm, a little playful — never \"getting married\".",
    kids: "OCCASION: a children's party. partner1 = the child, partner2 = null; \"age\" = the age they turn. \"vibe\" = the party theme (unicorns, space, jungle, dinosaurs, under the sea, princesses…). Learn the child's name, age, theme, date, venue, activities (games, cake, magic show), guest language. Parents are writing: joyful, simple wording that children and parents both love.",
    baby_shower: "OCCASION: a baby shower / godh bharai. partner1 = the mother-to-be (partner2 = partner, optional). \"tradition\" = boy, girl or surprise. Learn names, date, venue, activities, mood (soft, dreamy), guest language. Gentle, tender, joyful wording.",
    greeting: "OCCASION: a digital greeting card (no event, no RSVP, no date needed). partner1 = the recipient, \"tradition\" = the kind of greeting (birthday, anniversary, congratulations, thank you, new baby, Diwali, New Year, Christmas, Eid…), \"story\" = the heartfelt message itself (3–5 sentences, personal, never generic), \"blessing\" = the sign-off (\"With love, Anna\"). Ask who it's for, the occasion, a detail or memory about them, and who it's from — then WRITE the message for them and offer to make it funnier, shorter or more tender. Mark complete once recipient, greeting type, message and sign-off are known.",
  };
  return briefs[id];
}
