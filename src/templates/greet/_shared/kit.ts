import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { FONT_PAIRS, isFontPair } from "@/lib/fonts";
import { KINDS, type Design, type Kind } from "@/lib/templates";
import { templateById } from "@/lib/catalog";

export type Lang = "en" | "ru" | "hi";
export type L3 = Record<Lang, string>;
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");
export const pick = (l: L3, p: Profile | Lang) => l[typeof p === "string" ? p : langOf(p)];

// UI words for the greeting experience.
const W = {
  open: { en: "Tap to open", ru: "Нажмите, чтобы открыть", hi: "खोलने के लिए छुएँ" },
  forYou: { en: "A greeting for", ru: "Поздравление для", hi: "के लिए एक संदेश" },
  letter: { en: "A letter for you", ru: "Письмо для тебя", hi: "आपके लिए एक पत्र" },
  wish: { en: "The wish", ru: "Пожелание", hi: "शुभकामना" },
  day: { en: "The day", ru: "Дата", hi: "दिन" },
  plans: { en: "Plans", ru: "Планы", hi: "कार्यक्रम" },
  where: { en: "Where", ru: "Где", hi: "स्थान" },
  map: { en: "Open map", ru: "Открыть карту", hi: "नक्शा खोलें" },
  cal: { en: "Add to calendar", ru: "В календарь", hi: "कैलेंडर में जोड़ें" },
  days: { en: "days to go", ru: "дней осталось", hi: "दिन बाकी" },
  gallery: { en: "Memories", ru: "Воспоминания", hi: "यादें" },
  reply: { en: "Send your love back", ru: "Ответить с любовью", hi: "प्यार भरा जवाब भेजें" },
  info: { en: "Good to know", ru: "Важно знать", hi: "ज़रूरी जानकारी" },
  again: { en: "Open it again", ru: "Открыть снова", hi: "फिर से खोलें" },
  scroll: { en: "Scroll", ru: "Листайте", hi: "नीचे देखें" },
  from: { en: "From", ru: "От", hi: "प्रेषक" },
  save: { en: "Save the date", ru: "Сохраните дату", hi: "तिथि सुरक्षित करें" },
  welcome: { en: "Welcome", ru: "Добро пожаловать", hi: "स्वागत है" },
  table: { en: "Table", ru: "Стол", hi: "मेज़" },
  share: { en: "Share your moments", ru: "Делитесь снимками", hi: "अपनी तस्वीरें साझा करें" },
  thanks: { en: "Thank you", ru: "Спасибо", hi: "धन्यवाद" },
  program: { en: "Order of the day", ru: "Программа", hi: "कार्यक्रम" },
  menu: { en: "Menu", ru: "Меню", hi: "भोजन" },
  join: { en: "you are invited to", ru: "приглашаем на", hi: "आप आमंत्रित हैं" },
} satisfies Record<string, L3>;
export type Words = { [K in keyof typeof W]: string };
export const words = (p: Profile): Words => Object.fromEntries(Object.entries(W).map(([k, v]) => [k, v[langOf(p)]])) as Words;

export type GreetDefaults = {
  headline: L3; // the big wish
  message: L3; // default letter body when profile.story is empty
  signoff: L3; // default sign-off when profile.blessing is empty
};

/** Shrink display text gently as it gets longer (names like "The Sharma family"). */
export const fit = (text: string, base: number, chars = 9, min = 0.45) => base * Math.max(min, Math.min(1, Math.pow(chars / Math.max(text.length, 1), 0.75)));

/** Palette + font overrides from the visual editor, mapped onto a template's own tokens. */
export function overrides(design: Design | undefined, templateId: string): Record<string, string> {
  const v: Record<string, string> = {};
  const hex = (c?: string) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined);
  const pal = design?.palette;
  if (hex(pal?.accent)) v["--g-accent"] = pal!.accent!;
  if (hex(pal?.bg)) v["--g-bg"] = pal!.bg!;
  if (hex(pal?.ink)) v["--g-ink"] = pal!.ink!;
  // A pairing equal to the catalog default is the template's own type — only honour a deliberate change.
  const def = templateById(templateId)?.fonts;
  if (design?.fonts && design.fonts !== def && isFontPair(design.fonts)) {
    const f = FONT_PAIRS[design.fonts];
    v["--g-display"] = f.display;
    v["--g-script"] = f.script;
    v["--g-body"] = f.body;
  }
  return v;
}

export type Fmt = "portrait" | "tall" | "square" | "land";
export const fmtOf = (kind: Kind): Fmt => {
  const r = KINDS[kind].ratio;
  return r === "9/16" || r === "4/9" ? "tall" : r === "1/1" ? "square" : r === "7/5" ? "land" : "portrait";
};

export type Txt = { text: string; path: string } | null;
export type CardCopy = {
  kind: Kind;
  fmt: Fmt;
  eyebrow: Txt;
  headline: Txt;
  name: Txt; // recipient (partner1)
  name2: Txt;
  lead: Txt; // invitation wording / wish
  body: Txt; // the message
  meta: string[]; // date · venue lines (not editable here)
  metaPath: string | null;
  items: { title: string; detail?: string }[];
  number: number | null;
  hashtag: Txt;
  signoff: Txt;
};

/** Everything a greeting-suite card can show, resolved per kind (design.texts always wins). */
export function cardCopy(kind: Kind, design: Design, p: Profile, d: GreetDefaults): CardCopy {
  const w = words(p);
  const L = langOf(p);
  const x = design.texts ?? {};
  const [a, b] = nameParts(p);
  const T = (text: string | undefined, path: string): Txt => (text ? { text, path } : null);
  const head = (fallback: string) => T(x.headline ?? fallback, "texts.headline");
  const eyebrow = (fallback: string) => T(x.eyebrow ?? fallback, "texts.eyebrow");
  const story = x.body ?? p.story ?? d.message[L];
  const bodyT = T(story, x.body !== undefined ? "texts.body" : "profile.story");
  const sign = T(x.footer ?? p.blessing ?? d.signoff[L], x.footer !== undefined ? "texts.footer" : "profile.blessing");
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const ev = p.events?.[design.eventIndex ?? 0];
  const base: CardCopy = {
    kind, fmt: fmtOf(kind), eyebrow: null, headline: null, name: T(a, "profile.partner1"), name2: b ? T(b, "profile.partner2") : null,
    lead: null, body: null, meta: [], metaPath: null, items: design.items ?? [], number: null, hashtag: null, signoff: null,
  };
  switch (kind) {
    case "greeting":
      return { ...base, eyebrow: eyebrow(occasionLine(p)), headline: head(d.headline[L]), body: bodyT, signoff: sign };
    case "invite":
      return { ...base, headline: head(d.headline[L]), lead: T(p.inviteLine || occasionInvite(p), "profile.inviteLine"), meta: [date, where].filter(Boolean), metaPath: p.venue ? "profile.venue" : "profile.city", signoff: sign };
    case "save":
      return { ...base, eyebrow: eyebrow(w.save), headline: x.headline ? head("") : null, meta: [date, p.city || where].filter(Boolean), metaPath: p.city ? "profile.city" : "profile.venue" };
    case "event":
      return { ...base, eyebrow: eyebrow(w.join), headline: head(ev?.name || d.headline[L]), meta: [[formatDate(ev?.date || p.date, p.language), ev?.time].filter(Boolean).join(" · "), ev?.venue || where].filter(Boolean), metaPath: null };
    case "story":
      return { ...base, eyebrow: eyebrow(occasionLine(p)), headline: head(d.headline[L]), lead: T(x.body ?? (p.inviteLine || occasionInvite(p)), x.body !== undefined ? "texts.body" : "profile.inviteLine"), signoff: sign };
    case "post":
      return { ...base, eyebrow: eyebrow(occasionLine(p)), headline: head(d.headline[L]), signoff: sign };
    case "welcome":
      return { ...base, eyebrow: eyebrow(w.welcome), headline: x.headline ? head("") : null, meta: [date, where].filter(Boolean), metaPath: p.venue ? "profile.venue" : "profile.city" };
    case "program":
      return { ...base, headline: head(w.program), name: null, name2: null, items: design.items ?? [] };
    case "menu":
      return { ...base, headline: head(w.menu), name: null, name2: null, items: design.items ?? [] };
    case "table":
      return { ...base, headline: head(w.table), number: design.number ?? 1, name: null, name2: null };
    case "hashtag":
      return { ...base, eyebrow: eyebrow(w.share), hashtag: T(x.hashtag ?? `#${a.replace(/\s+/g, "")}`, "texts.hashtag"), name: null, name2: null };
    case "thankyou":
      return { ...base, headline: head(w.thanks), body: x.body ? T(x.body, "texts.body") : null, signoff: sign };
    default:
      return base;
  }
}

export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;

/** The resolved, language-aware content of a greeting website. */
export function siteCopy(p: Profile, design: Design | undefined, d: GreetDefaults) {
  const L = langOf(p);
  const x = design?.texts ?? {};
  const [a, b] = nameParts(p);
  return {
    lang: L,
    w: words(p),
    name: a,
    name2: b,
    line: x.eyebrow ?? occasionLine(p),
    linePath: "texts.eyebrow",
    headline: x.headline ?? d.headline[L],
    wish: p.inviteLine || occasionInvite(p),
    message: p.story || d.message[L],
    signoff: p.blessing || d.signoff[L],
    info: x.body ?? "",
    date: p.date ? formatDate(p.date, p.language) : "",
    events: (p.events ?? []).filter((e) => e.name && (e.date || e.time || e.venue)),
    venue: p.venue ?? "",
    city: p.city ?? "",
    gallery: (design?.gallery ?? []).map(media),
  };
}
export type SiteCopy = ReturnType<typeof siteCopy>;

/** Deterministic random (mulberry32) so SSR and client art match exactly. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const r2 = (n: number) => Math.round(n * 100) / 100;
