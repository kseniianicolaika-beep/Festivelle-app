import type { Profile, WeddingEvent } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import { nameParts, occasionInvite, occasionLine, occasionOf } from "@/lib/occasions";
import { KINDS, defaultDesign, sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";
import { INVOCATIONS } from "@/lib/motifs";

// Shared, template-agnostic words + data resolution for the weddings-a bespoke suite.
export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");
export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;
export const mapUrl = (p: Profile) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.venue, p.city].filter(Boolean).join(", "))}`;

const WORDS = {
  en: { save: "Save the date", welcome: "Welcome to the wedding of", welcomeShort: "Welcome", table: "Table", join: "invite you to", tag: "Share your moments", order: "Order of ceremony", menu: "Menu", thanks: "Thank you", thanksBody: "for celebrating the beginning of our forever with us", more: "Details to follow", scene: "Scene", chapter: "Chapter", wedding: "The wedding of", together: "together with their families", reply: "Kindly reply", days: "days to go", photo: "Our photograph" },
  ru: { save: "Сохраните дату", welcome: "Добро пожаловать на свадьбу", welcomeShort: "Добро пожаловать", table: "Стол", join: "приглашают вас на", tag: "Делитесь снимками", order: "Программа дня", menu: "Меню", thanks: "Спасибо", thanksBody: "за то, что были с нами в самый счастливый день", more: "Подробности позже", scene: "Сцена", chapter: "Глава", wedding: "Свадьба", together: "вместе с семьями", reply: "Пожалуйста, ответьте", days: "дней осталось", photo: "Наш снимок" },
  hi: { save: "तिथि सुरक्षित करें", welcome: "विवाह में आपका स्वागत है", welcomeShort: "स्वागत है", table: "मेज़", join: "आपको आमंत्रित करते हैं", tag: "अपनी तस्वीरें साझा करें", order: "कार्यक्रम", menu: "भोजन", thanks: "धन्यवाद", thanksBody: "हमारे जीवन के इस नए अध्याय में साथ होने के लिए", more: "विवरण शीघ्र", scene: "दृश्य", chapter: "अध्याय", wedding: "शुभ विवाह", together: "परिवारों के साथ", reply: "कृपया उत्तर दें", days: "दिन शेष", photo: "हमारी तस्वीर" },
} as const;
export const words = (p: Profile) => WORDS[langOf(p)];

const locale = (l: Lang) => (l === "ru" ? "ru-RU" : l === "hi" ? "hi-IN" : "en-GB");
/** Split date pieces for typographic layouts. All UTC so server/client agree. */
export function dateParts(iso: string | undefined, lang: Lang) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const f = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(locale(lang), { timeZone: "UTC", ...o });
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return {
    day: String(d.getUTCDate()),
    dd, mm,
    month: lang === "ru" ? f({ day: "numeric", month: "long" }).replace(/^\d+\s*/, "") : f({ month: "long" }),
    monthShort: f({ month: "short" }).replace(".", ""),
    year: String(d.getUTCFullYear()),
    weekday: f({ weekday: "long" }),
    full: formatDate(iso, lang),
    dots: `${dd} · ${mm} · ${String(d.getUTCFullYear()).slice(2)}`,
    roman: `${toRoman(d.getUTCDate())} · ${toRoman(d.getUTCMonth() + 1)} · ${toRoman(d.getUTCFullYear())}`,
  };
}
export type DateParts = NonNullable<ReturnType<typeof dateParts>>;
export function toRoman(n: number) {
  const m: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  for (const [v, r] of m) while (n >= v) { s += r; n -= v; }
  return s;
}

/** Everything a bespoke Site needs, resolved once. */
export function siteData(profile: Profile, design?: Design) {
  const [a, b] = nameParts(profile);
  const L = t(profile.language);
  const lang = langOf(profile);
  const occ = occasionOf(profile);
  const { order, hidden } = sectionLayout(design?.sections);
  const visible = order.filter((id) => !hidden.has(id)) as SectionId[];
  const where = profile.venue || profile.city || "";
  return {
    a, b, L, W: words(profile), lang, occ,
    line: occasionLine(profile),
    invite: profile.inviteLine || (occ === "wedding" ? L.invite : occasionInvite(profile)),
    date: dateParts(profile.date, lang),
    where,
    wherePath: profile.venue ? "profile.venue" : "profile.city",
    events: (profile.events ?? []) as WeddingEvent[],
    gallery: (design?.gallery ?? []).map((k) => ({ key: k, src: media(k) })),
    info: design?.texts?.body,
    visible,
    map: mapUrl(profile),
    goa: /goa|panjim|vagator|anjuna|ashwem|assagao|morjim|mandrem/i.test(`${profile.city} ${profile.venue}`),
    invocation: design?.invocation ? INVOCATIONS[design.invocation] : null,
  };
}
export type SiteData = ReturnType<typeof siteData>;
export const eventWhen = (e: WeddingEvent, lang: Lang) => [formatDate(e.date, lang), e.time].filter(Boolean).join(" · ");

/** Text for every paper/social piece; couples override via design.texts. */
export function cardText(kind: Kind, d: Design, p: Profile) {
  const L = t(p.language);
  const W = words(p);
  const lang = langOf(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const occ = occasionOf(p);
  const wed = occ === "wedding";
  const where = p.venue || p.city || "";
  const base = {
    eyebrow: "", lead: "", headline: "", names: true, sub: "", date: formatDate(p.date, p.language), where, body: "", footer: "",
    items: d.items?.length ? d.items : defaultDesign(kind, p).items ?? [], number: undefined as number | undefined, hashtag: "",
    leadPath: "" as string, footerPath: "texts.footer" as string, wherePath: p.venue ? "profile.venue" : "profile.city",
  };
  const c = (() => {
    switch (kind) {
      case "invite": return { ...base, eyebrow: wed ? W.wedding : occasionLine(p), lead: p.inviteLine || (wed ? L.invite : occasionInvite(p)), leadPath: "profile.inviteLine", sub: p.tradition ?? "", footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "greeting": return { ...base, eyebrow: occasionLine(p), body: p.story ?? "", footer: p.blessing ?? "", footerPath: "profile.blessing", date: "", where: "" };
      case "save": return { ...base, eyebrow: W.save, where: p.city || where, wherePath: p.city ? "profile.city" : base.wherePath };
      case "event": return { ...base, lead: W.join, headline: ev?.name ?? (lang === "ru" ? "Торжество" : lang === "hi" ? "समारोह" : "Celebration"), date: [formatDate(ev?.date ?? p.date, p.language), ev?.time].filter(Boolean).join(" · "), where: ev?.venue || where };
      case "story": return { ...base, eyebrow: wed ? W.save : occasionLine(p), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "post": return { ...base, eyebrow: wed ? L.getting : occasionLine(p) };
      case "welcome": return { ...base, eyebrow: wed ? W.welcome : W.welcomeShort };
      case "program": return { ...base, headline: W.order, names: false };
      case "menu": return { ...base, headline: W.menu, names: false };
      case "table": return { ...base, headline: W.table, names: false, number: d.number ?? 1, date: "", where: "" };
      case "hashtag": return { ...base, hashtag: d.texts?.hashtag ?? `#${(p.partner1 ?? "Love").split(" ")[0]}Weds${(p.partner2 ?? "Forever").split(" ")[0]}`, body: W.tag, names: false, date: "", where: "" };
      case "thankyou": return { ...base, headline: W.thanks, names: false, body: W.thanksBody, date: "" };
      default: return base;
    }
  })();
  const x = d.texts ?? {};
  return { ...c, eyebrow: x.eyebrow ?? c.eyebrow, headline: x.headline ?? c.headline, body: x.body ?? c.body, footer: x.footer ?? c.footer, footerPath: x.footer !== undefined ? "texts.footer" : c.footerPath, hashtag: x.hashtag ?? c.hashtag };
}
export type CardText = ReturnType<typeof cardText>;

/** Layout family of a piece by its aspect ratio. */
export function shapeOf(kind: Kind): "portrait" | "tall" | "square" | "wide" | "sign" {
  const r = KINDS[kind].ratio;
  if (r === "9/16" || r === "4/9") return "tall";
  if (r === "1/1") return "square";
  if (r === "7/5") return "wide";
  if (r === "2/3" || r === "4/5") return "sign";
  return "portrait";
}
export const ratioOf = (kind: Kind) => (KINDS[kind].ratio === "web" ? "5/7" : KINDS[kind].ratio);

/** Deterministic PRNG so procedural art is identical on server and client. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let x = Math.imul(s ^ (s >>> 15), 1 | s); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}
export const r1 = (n: number) => Math.round(n * 10) / 10;
/** Name size factor: long names shrink so Cyrillic/Devanagari never overflow. */
export const fit = (s: string, base: number, at = 7) => (s.length > at ? base * Math.max(0.5, at / s.length) : base);
