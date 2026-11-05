import type { Profile } from "./profile";
import type { MotifId, InvocationId } from "./motifs";

// ── Everything a wedding needs, as editable "pieces" ──
export const KINDS = {
  website: { name: "Wedding website", group: "Online", ratio: "web", blurb: "Your story, events, travel and RSVP" },
  invite: { name: "Invitation", group: "Stationery", ratio: "5/7", blurb: "The main wedding invitation" },
  save: { name: "Save the date", group: "Stationery", ratio: "5/7", blurb: "Announce the date early" },
  event: { name: "Event card", group: "Stationery", ratio: "5/7", blurb: "Haldi, mehendi, sangeet, ZAGS, banquet…" },
  story: { name: "Story / Status", group: "Social", ratio: "9/16", blurb: "Instagram story & WhatsApp status" },
  post: { name: "Square post", group: "Social", ratio: "1/1", blurb: "Instagram & Telegram announcement" },
  welcome: { name: "Welcome sign", group: "On the day", ratio: "2/3", blurb: "Large sign at the entrance" },
  program: { name: "Order of ceremony", group: "On the day", ratio: "5/7", blurb: "The rituals, explained for guests" },
  menu: { name: "Menu", group: "On the day", ratio: "4/9", blurb: "Dinner or banquet menu" },
  table: { name: "Table number", group: "On the day", ratio: "1/1", blurb: "Numbered table cards" },
  hashtag: { name: "Photo & hashtag sign", group: "On the day", ratio: "4/5", blurb: "Invite guests to share photos" },
  thankyou: { name: "Thank-you card", group: "After", ratio: "7/5", blurb: "Gratitude after the celebrations" },
  greeting: { name: "Greeting card", group: "Greetings", ratio: "5/7", blurb: "A heartfelt card to download or share" },
} as const;

// Website sections (the brief's list). Order and visibility live in the website piece's design.sections.
export const SECTIONS = {
  invitation: "Invitation message",
  story: "Our story",
  details: "Event details",
  schedule: "Schedule",
  venue: "Venue & location",
  gallery: "Photo gallery",
  rsvp: "RSVP",
  info: "Additional information",
} as const;
export type SectionId = keyof typeof SECTIONS;
export const SECTION_IDS = Object.keys(SECTIONS) as SectionId[];
export const isSection = (s: unknown): s is SectionId => typeof s === "string" && s in SECTIONS;

/** Resolved order (every known section exactly once) + hidden set. */
export function sectionLayout(d?: Design["sections"]) {
  const order = [...(d?.order ?? []).filter(isSection), ...SECTION_IDS].filter((s, i, all) => all.indexOf(s) === i);
  return { order, hidden: new Set((d?.hidden ?? []).filter(isSection)) };
}

/** Validate a sections patch from the client or chat. */
export function cleanSections(x: unknown): Design["sections"] | undefined {
  if (!x || typeof x !== "object") return undefined;
  const o = x as { order?: unknown; hidden?: unknown };
  return {
    order: Array.isArray(o.order) ? o.order.filter(isSection) : undefined,
    hidden: Array.isArray(o.hidden) ? o.hidden.filter(isSection) : [],
  };
}
export type Kind = keyof typeof KINDS;
export const isKind = (k: unknown): k is Kind => typeof k === "string" && k in KINDS;

// Paper layouts (cards, signs, social) and website layouts
export const PAPER_LAYOUTS = {
  classic: "Classic frame",
  arch: "Palace arch",
  editorial: "Editorial",
  monogram: "Monogram wreath",
  botanical: "Botanical border",
  photo: "Photograph",
} as const;
export const SITE_LAYOUTS = { romance: "Romance", editorial: "Editorial", arch: "Palace arch" } as const;
export type PaperLayout = keyof typeof PAPER_LAYOUTS;
export type SiteLayout = keyof typeof SITE_LAYOUTS;

// Per-piece design overrides. The AI can change any of these — never raw HTML — so designs stay beautiful.
export type Design = {
  theme?: string;
  motif?: MotifId;
  invocation?: InvocationId | null;
  photoKey?: string;
  eventIndex?: number; // event card: which event
  number?: number; // table number
  texts?: Partial<Record<"eyebrow" | "headline" | "body" | "footer" | "hashtag", string>>;
  items?: { title: string; detail?: string }[]; // menu courses / ceremony steps
  align?: "center" | "left";
  scale?: number; // 0.8–1.3 name size
  sections?: { order?: SectionId[]; hidden?: SectionId[] }; // website only
  gallery?: string[]; // website only: object-storage keys, in order
};

export type Doc = { id: string; kind: Kind; layout: string; design: Design; position: number };

// Curated named templates for the gallery: kind × layout × theme × motif.
type T = { id: string; name: string; kind: Kind; layout: string; theme: string; motif?: MotifId };
const POETRY: [string, string, MotifId | undefined, string][] = [
  ["Ashwem Dusk", "konkan-sunset", "palms", "classic"],
  ["Lisbon Letter", "azulejo", "azulejo", "editorial"],
  ["Maharani", "rajwada", "arch", "arch"],
  ["Neva Monogram", "belaya-noch", "birch", "monogram"],
  ["Mogra Bloom", "mogra", "jasmine", "botanical"],
  ["Haldi Sun", "gulmohar", "marigold", "botanical"],
  ["Noor Lantern", "noor", "lattice", "arch"],
  ["Starlit Sangeet", "sangeet-night", "stars", "monogram"],
  ["Assagao Portrait", "azulejo", "doves", "photo"],
  ["Moscow Folk", "belaya-noch", "khokhloma", "classic"],
  ["Mehendi Ambi", "gulmohar", "paisley", "classic"],
  ["Lotus Vows", "mogra", "lotus", "arch"],
];

// Per-occasion collections. [name, theme, motif, layout]
const COLLECTIONS: Record<string, [string, string, MotifId | undefined, string][]> = {
  engagement: [
    ["Solitaire", "rose-quartz", "rings", "monogram"],
    ["Champagne Toast", "champagne-noir", "champagne", "classic"],
    ["Fontainhas Letter", "azulejo", "azulejo", "editorial"],
    ["Roka Marigold", "gulmohar", "marigold", "botanical"],
    ["Starlit Promise", "sangeet-night", "stars", "arch"],
    ["Jasmine Yes", "mogra", "jasmine", "botanical"],
    ["Our Portrait", "rose-quartz", "doves", "photo"],
    ["Moscow Evening", "belaya-noch", "birch", "classic"],
  ],
  anniversary: [
    ["Pearl Years", "pearl", "doves", "classic"],
    ["Ruby Devotion", "ruby", "rings", "monogram"],
    ["Silver Birch", "belaya-noch", "birch", "botanical"],
    ["Golden Arch", "rajwada", "arch", "arch"],
    ["Love Letters", "love-letter", "ribbon", "editorial"],
    ["Then & Now", "pearl", "rings", "photo"],
    ["Emerald Evening", "noor", "lattice", "arch"],
    ["Tiered Toast", "champagne-noir", "cake", "classic"],
  ],
  birthday: [
    ["Champagne Noir", "champagne-noir", "champagne", "classic"],
    ["Midnight Thirty", "sangeet-night", "stars", "monogram"],
    ["Blush Soirée", "rose-quartz", "cake", "arch"],
    ["Sundowner", "konkan-sunset", "palms", "editorial"],
    ["Marigold Fiesta", "gulmohar", "confetti", "botanical"],
    ["Portrait Party", "champagne-noir", "champagne", "photo"],
    ["Garden Lunch", "mogra", "jasmine", "botanical"],
    ["Velvet Cake", "ruby", "cake", "classic"],
  ],
  kids: [
    ["Balloon Parade", "confetti-garden", "balloons", "classic"],
    ["Confetti Cake", "confetti-garden", "cake", "arch"],
    ["Sleepy Moon", "cloud-nursery", "moon", "monogram"],
    ["Starship", "sangeet-night", "stars", "classic"],
    ["Sunshine Picnic", "gulmohar", "confetti", "botanical"],
    ["Party Portrait", "confetti-garden", "balloons", "photo"],
    ["Beach Day", "konkan-sunset", "palms", "editorial"],
  ],
  baby_shower: [
    ["Cloud Nine", "cloud-nursery", "moon", "classic"],
    ["Little Star", "cloud-nursery", "rattle", "monogram"],
    ["Blush Bundle", "rose-quartz", "ribbon", "arch"],
    ["Godh Bharai", "gulmohar", "marigold", "botanical"],
    ["Jasmine Lullaby", "mogra", "jasmine", "botanical"],
    ["Bump Portrait", "pearl", "moon", "photo"],
    ["Doves & Blessings", "pearl", "doves", "editorial"],
  ],
  greeting: [
    ["Love Letter", "love-letter", "ribbon", "classic"],
    ["Many Happy Returns", "champagne-noir", "cake", "monogram"],
    ["With Gratitude", "pearl", "doves", "editorial"],
    ["Welcome, Little One", "cloud-nursery", "rattle", "arch"],
    ["Festival of Lights", "rajwada", "lotus", "arch"],
    ["Starry Wishes", "sangeet-night", "stars", "classic"],
    ["Blush Bouquet", "rose-quartz", "jasmine", "botanical"],
    ["Eid Lanterns", "noor", "lattice", "arch"],
    ["Snowy Birch", "belaya-noch", "birch", "botanical"],
    ["Memory Portrait", "love-letter", "ribbon", "photo"],
  ],
};

const SITE_COLLECTIONS: Record<string, [string, string, string][]> = {
  engagement: [["Solitaire", "romance", "rose-quartz"], ["Champagne Evening", "editorial", "champagne-noir"], ["Fontainhas", "arch", "azulejo"]],
  anniversary: [["Pearl Years", "romance", "pearl"], ["Ruby Devotion", "arch", "ruby"], ["Love Letters", "editorial", "love-letter"]],
  birthday: [["Champagne Noir", "editorial", "champagne-noir"], ["Midnight Party", "romance", "sangeet-night"], ["Blush Soirée", "arch", "rose-quartz"]],
  kids: [["Balloon Parade", "romance", "confetti-garden"], ["Sleepy Moon", "arch", "cloud-nursery"], ["Sunshine", "editorial", "gulmohar"]],
  baby_shower: [["Cloud Nine", "romance", "cloud-nursery"], ["Blush Bundle", "arch", "rose-quartz"], ["Jasmine", "editorial", "mogra"]],
  greeting: [["Love Letter", "romance", "love-letter"], ["Champagne", "editorial", "champagne-noir"]],
};

const slug = (s: string) => s.toLowerCase().replace(/\W+/g, "-");

export function templatesFor(kind: Kind, occasion: string = "wedding"): T[] {
  if (occasion !== "wedding") {
    if (kind === "website" && SITE_COLLECTIONS[occasion]) return SITE_COLLECTIONS[occasion].map(([name, layout, theme]) => ({ id: `web-${occasion}-${slug(name)}`, name, kind, layout, theme }));
    if (kind !== "website" && COLLECTIONS[occasion]) return COLLECTIONS[occasion].map(([name, theme, motif, layout]) => ({ id: `${kind}-${occasion}-${slug(name)}`, name, kind, layout, theme, motif }));
  }
  if (kind === "greeting") return COLLECTIONS.greeting.map(([name, theme, motif, layout]) => ({ id: `${kind}-${slug(name)}`, name, kind, layout, theme, motif }));
  if (kind === "website")
    return [
      { id: "web-romance", name: "Romance", kind, layout: "romance", theme: "konkan-sunset" },
      { id: "web-editorial", name: "Editorial", kind, layout: "editorial", theme: "azulejo" },
      { id: "web-arch", name: "Palace Arch", kind, layout: "arch", theme: "rajwada" },
      { id: "web-noor", name: "Noor Evening", kind, layout: "arch", theme: "noor" },
      { id: "web-neva", name: "White Nights", kind, layout: "editorial", theme: "belaya-noch" },
      { id: "web-haldi", name: "Haldi Sunshine", kind, layout: "romance", theme: "gulmohar" },
    ];
  return POETRY.map(([name, theme, motif, layout]) => ({ id: `${kind}-${name.toLowerCase().replace(/\W+/g, "-")}`, name, kind, layout, theme, motif }));
}

// Sensible, culturally aware default content for each new piece.
export function defaultDesign(kind: Kind, p: Profile): Design {
  const ru = p.language === "ru";
  const hi = p.language === "hi";
  switch (kind) {
    case "menu":
      return {
        texts: { headline: ru ? "Меню" : hi ? "भोजन" : "Menu" },
        items: ru
          ? [{ title: "Закуски", detail: "Канапе с лососем · Тикка из панира" }, { title: "Горячее", detail: "Гоанское рыбное карри · Бефстроганов" }, { title: "Десерт", detail: "Свадебный торт · Бебинка" }]
          : [{ title: "To begin", detail: "Paneer tikka · Prawn rissoles · Blini with smetana" }, { title: "The feast", detail: "Goan fish curry · Dal makhani · Beef stroganoff · Saffron pulao" }, { title: "Something sweet", detail: "Bebinca · Gulab jamun · Medovik" }],
      };
    case "program":
      return {
        texts: { headline: ru ? "Программа церемонии" : "Order of ceremony" },
        items:
          p.culture === "russian"
            ? [{ title: "Выкуп невесты", detail: "Игры и смех у дверей" }, { title: "Регистрация", detail: "Обмен кольцами" }, { title: "Каравай", detail: "Хлеб и соль от родителей" }, { title: "Банкет", detail: "Тосты, танцы и «Горько!»" }]
            : p.culture === "indian" || p.culture === "fusion"
              ? [{ title: "Baraat", detail: "The groom arrives with music and dancing" }, { title: "Jaimala", detail: "Exchange of flower garlands" }, { title: "Pheras", detail: "Seven vows around the sacred fire" }, { title: "Vidaai", detail: "A tender farewell to the bride's family" }]
              : [{ title: "Processional" }, { title: "Vows & rings" }, { title: "First kiss" }, { title: "Recessional" }],
      };
    case "table":
      return { number: 1 };
    case "hashtag":
      return { texts: { hashtag: `#${(p.partner1 ?? "Love").split(" ")[0]}Weds${(p.partner2 ?? "Forever").split(" ")[0]}`, body: ru ? "Делитесь снимками с нашим хэштегом" : "Share your moments with us" } };
    case "thankyou":
      return { texts: { headline: ru ? "Спасибо" : hi ? "धन्यवाद" : "Thank you", body: ru ? "за то, что были с нами в самый счастливый день" : "for celebrating the beginning of our forever with us" } };
    case "event":
      return { eventIndex: 0 };
    case "greeting": {
      const g = (p.tradition ?? "").toLowerCase();
      const head = ru
        ? /birth|рожд/.test(g) ? "С днём рождения" : /thank|спас/.test(g) ? "Спасибо" : /new year|нов/.test(g) ? "С Новым годом" : "С любовью"
        : hi
          ? /birth/.test(g) ? "जन्मदिन मुबारक" : /diwali/.test(g) ? "शुभ दीपावली" : "शुभकामनाएँ"
          : /birth/.test(g) ? "Happy birthday" : /anniv/.test(g) ? "Happy anniversary" : /thank/.test(g) ? "Thank you" : /baby|born/.test(g) ? "Welcome, little one" : /diwali/.test(g) ? "Happy Diwali" : /new year/.test(g) ? "Happy New Year" : /christmas/.test(g) ? "Merry Christmas" : /eid/.test(g) ? "Eid Mubarak" : /congrat/.test(g) ? "Congratulations" : "With love";
      return { texts: { headline: head } };
    }
    default:
      return {};
  }
}
