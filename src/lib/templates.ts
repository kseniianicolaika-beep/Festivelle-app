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
} as const;
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

export function templatesFor(kind: Kind): T[] {
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
    default:
      return {};
  }
}
