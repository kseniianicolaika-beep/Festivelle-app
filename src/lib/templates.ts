import type { Profile } from "./profile";
import type { MotifId, InvocationId } from "./motifs";
import { CATALOG } from "./catalog";

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
  deco: "Art deco",
  jharokha: "Jharokha window",
  lace: "Russian lace",
  polaroid: "Polaroid scrapbook",
  confetti: "Confetti pop",
  watercolour: "Watercolour wash",
  split: "Split photograph",
  fullbleed: "Full-bleed photograph",
  letterpress: "Letterpress",
} as const;
export const SITE_LAYOUTS = {
  romance: "Romance",
  editorial: "Editorial",
  arch: "Palace arch",
  cinematic: "Cinematic",
  magazine: "Magazine",
  letter: "Love letter",
  timeline: "Timeline story",
  gallery: "Gallery first",
  deco: "Art deco",
  playful: "Playful",
} as const;
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
  fonts?: string; // font pairing id (see lib/editor-options.ts FONT_PAIRS)
  palette?: { accent?: string; ink?: string; bg?: string }; // colour overrides (hex); curated unless Luxury
  reveal?: string; // signature animation override
  template?: string; // catalog template id this piece was created from
};

export type Doc = { id: string; kind: Kind; layout: string; design: Design; position: number };

// Named templates for the gallery derive from the catalog (lib/catalog.ts): one suite → every piece kind.
type T = { id: string; name: string; kind: Kind; layout: string; theme: string; motif?: MotifId; fonts?: string; template: string };

export function templatesFor(kind: Kind, occasion: string = "wedding"): T[] {
  const list = CATALOG.filter((t) => t.occasion === occasion);
  const src = list.length ? list : CATALOG.filter((t) => t.occasion === "wedding");
  return src.map((t) => ({ id: `${kind}-${t.id}`, name: t.name, kind, layout: kind === "website" ? t.siteLayout : t.paperLayout, theme: t.theme, motif: t.motif, fonts: t.fonts, template: t.id }));
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
