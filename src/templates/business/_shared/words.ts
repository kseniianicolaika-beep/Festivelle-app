import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionOf } from "@/lib/occasions";
import { t } from "@/lib/i18n";
import type { Design, Kind } from "@/lib/templates";

// Business-event wording for the business group (corporate party, conference, product launch, networking).
// Never romantic: the website reads as agenda, about/speakers, venue and registration.

export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

const W = {
  en: {
    invited: "You're invited", save: "Save the date", welcome: "Welcome", agenda: "Agenda", programme: "The programme", menu: "Menu", table: "Table",
    tag: "Share the moment", thanks: "Thank you", thanksBody: "for being part of it — see you at the next one", about: "About", host: "A note from the host",
    register: "Registration", reserve: "Reserve your place", details: "The details", when: "When", where: "Where", time: "Doors", venue: "The venue",
    directions: "Get directions", calendar: "Add to calendar", gallery: "Highlights", info: "Good to know", days: "days to go", join: "Join us for",
    dress: "Dress code", hosted: "Hosted by", countdown: "Countdown", reveal: "Reveal", tapReveal: "Tap to reveal", revealed: "Unveiled", hello: "Hello, I'm",
    connect: "Make a connection", connected: "Connected",
  },
  ru: {
    invited: "Приглашаем вас", save: "Сохраните дату", welcome: "Добро пожаловать", agenda: "Программа", programme: "Программа", menu: "Меню", table: "Стол",
    tag: "Делитесь моментами", thanks: "Спасибо", thanksBody: "что были с нами — до встречи на следующем событии", about: "О событии", host: "Слово организатора",
    register: "Регистрация", reserve: "Забронируйте место", details: "Подробности", when: "Когда", where: "Где", time: "Начало", venue: "Место",
    directions: "Как добраться", calendar: "Добавить в календарь", gallery: "Лучшие моменты", info: "Важно знать", days: "дней осталось", join: "Ждём вас на",
    dress: "Дресс-код", hosted: "Организатор", countdown: "До события", reveal: "Премьера", tapReveal: "Нажмите, чтобы открыть", revealed: "Представлено", hello: "Привет, я",
    connect: "Познакомиться", connected: "Знакомство состоялось",
  },
  hi: {
    invited: "आप आमंत्रित हैं", save: "तिथि सुरक्षित करें", welcome: "स्वागत है", agenda: "कार्यसूची", programme: "कार्यक्रम", menu: "भोजन", table: "मेज़",
    tag: "पल साझा करें", thanks: "धन्यवाद", thanksBody: "हमारे साथ होने के लिए — अगली बार फिर मिलेंगे", about: "परिचय", host: "मेज़बान का संदेश",
    register: "पंजीकरण", reserve: "अपनी जगह सुरक्षित करें", details: "विवरण", when: "कब", where: "कहाँ", time: "समय", venue: "स्थान",
    directions: "रास्ता देखें", calendar: "कैलेंडर में जोड़ें", gallery: "झलकियाँ", info: "ज़रूरी जानकारी", days: "दिन शेष", join: "आमंत्रण",
    dress: "ड्रेस कोड", hosted: "आयोजक", countdown: "उलटी गिनती", reveal: "अनावरण", tapReveal: "अनावरण के लिए टैप करें", revealed: "अनावरण हुआ", hello: "नमस्ते, मैं",
    connect: "जुड़िए", connected: "जुड़ गए",
  },
} as const;

export const words = (p: Profile) => ({ ...t(p.language), ...W[langOf(p)] });

/** The line under the event/company name — professional, per occasion. `tradition` (what's being celebrated) wins. */
export function bizLine(p: Profile) {
  const L = langOf(p);
  const o = occasionOf(p);
  if (p.tradition && o === "corporate_party") return p.tradition;
  const year = p.date ? p.date.slice(0, 4) : "";
  const lines: Record<string, Record<Lang, string>> = {
    corporate_party: { en: "invites you to celebrate", ru: "приглашает на праздник", hi: "आपको आमंत्रित करता है" },
    conference: { en: year ? `Conference ${year}` : "Conference", ru: year ? `Конференция ${year}` : "Конференция", hi: year ? `सम्मेलन ${year}` : "सम्मेलन" },
    product_launch: { en: "Launch evening", ru: "Вечер премьеры", hi: "लॉन्च संध्या" },
    networking: { en: "An evening of good company", ru: "Вечер знакомств", hi: "मिलने-जुलने की शाम" },
  };
  return (lines[o] ?? lines.corporate_party)[L];
}

export const fmt = (p: Profile, iso?: string) => formatDate(iso ?? p.date, p.language);
export const where = (p: Profile) => p.venue || p.city || "";
export const mapHref = (p: Profile) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.venue, p.city].filter(Boolean).join(", "))}`;
export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;
export const firstTime = (p: Profile) => p.events?.find((e) => e.time)?.time ?? "";

export function dateParts(p: Profile, iso?: string) {
  const s = iso ?? p.date;
  if (!s) return null;
  const d = new Date(s + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const loc = p.language === "ru" ? "ru-RU" : p.language === "hi" ? "hi-IN" : "en-GB";
  return {
    day: d.getUTCDate(),
    dd: String(d.getUTCDate()).padStart(2, "0"),
    mm: String(d.getUTCMonth() + 1).padStart(2, "0"),
    month: d.toLocaleDateString(loc, { month: "long", timeZone: "UTC" }),
    /** "11 February" / "11 февраля" — grammatically correct day + month. */
    dayMonth: d.toLocaleDateString(loc, { day: "numeric", month: "long", timeZone: "UTC" }),
    monthShort: d.toLocaleDateString(loc, { month: "short", timeZone: "UTC" }).replace(".", ""),
    weekday: d.toLocaleDateString(loc, { weekday: "long", timeZone: "UTC" }),
    year: d.getUTCFullYear(),
  };
}

const MENU = {
  en: [{ title: "Canapés", detail: "Prawn rissoles · Burrata crostini · Chorizo pão" }, { title: "Bowl food", detail: "Goan fish curry · Saffron pulao · Charred greens" }, { title: "Bar", detail: "Feni sours · Sparkling wine · Cold-pressed juices" }],
  ru: [{ title: "Канапе", detail: "Креветки · Брускетта с бурратой · Тартар" }, { title: "Горячее", detail: "Гоанское карри · Шафрановый плов" }, { title: "Бар", detail: "Игристое · Коктейли · Свежевыжатые соки" }],
  hi: [{ title: "स्टार्टर", detail: "पनीर टिक्का · झींगा · चाट" }, { title: "मुख्य भोजन", detail: "मछली करी · केसर पुलाव" }, { title: "पेय", detail: "स्पार्कलिंग · मॉकटेल · ताज़ा जूस" }],
};

/** Agenda defaults when the event hasn't been filled in yet. */
const AGENDA: Record<string, Record<Lang, { title: string; detail: string }[]>> = {
  conference: {
    en: [{ title: "Registration & coffee", detail: "09:00" }, { title: "Opening keynote", detail: "10:00" }, { title: "Panels & workshops", detail: "11:30" }, { title: "Networking drinks", detail: "17:30" }],
    ru: [{ title: "Регистрация и кофе", detail: "09:00" }, { title: "Открытие", detail: "10:00" }, { title: "Панели и воркшопы", detail: "11:30" }, { title: "Нетворкинг", detail: "17:30" }],
    hi: [{ title: "पंजीकरण और कॉफ़ी", detail: "09:00" }, { title: "मुख्य वक्तव्य", detail: "10:00" }, { title: "पैनल और कार्यशालाएँ", detail: "11:30" }, { title: "नेटवर्किंग", detail: "17:30" }],
  },
  default: {
    en: [{ title: "Arrivals & drinks", detail: "19:00" }, { title: "Welcome", detail: "19:45" }, { title: "Dinner", detail: "20:30" }, { title: "Music & dancing", detail: "22:00" }],
    ru: [{ title: "Сбор гостей", detail: "19:00" }, { title: "Приветствие", detail: "19:45" }, { title: "Ужин", detail: "20:30" }, { title: "Музыка и танцы", detail: "22:00" }],
    hi: [{ title: "आगमन", detail: "19:00" }, { title: "स्वागत", detail: "19:45" }, { title: "रात्रिभोज", detail: "20:30" }, { title: "संगीत", detail: "22:00" }],
  },
};

/** Agenda rows for the website: the event's own events, or sensible defaults. */
export function agendaOf(p: Profile) {
  if (p.events?.length) return p.events.map((e) => ({ title: e.name, detail: e.time ?? "" }));
  const set = AGENDA[occasionOf(p)] ?? AGENDA.default;
  return set[langOf(p)];
}

/** What each paper/social piece says; design.texts overrides. `*Path` = where <E> writes. */
export function bizText(kind: Kind, d: Design, p: Profile) {
  const L = words(p);
  const [name] = nameParts(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const items = d.items?.length
    ? d.items
    : kind === "menu"
      ? MENU[langOf(p)]
      : kind === "program"
        ? agendaOf(p)
        : [];
  const base = {
    name, eyebrow: "", headline: "", line: bizLine(p), lead: "", body: "", footer: "",
    date: fmt(p), time: firstTime(p), where: where(p), wherePath: p.venue ? "profile.venue" : "profile.city",
    items: kind === "menu" || kind === "program" ? items : [], number: undefined as number | undefined,
    hashtag: "", showName: true, footerPath: "texts.footer",
  };
  const c = (() => {
    switch (kind) {
      case "invite": return { ...base, eyebrow: L.invited, lead: p.inviteLine || occasionInvite(p), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "save": return { ...base, eyebrow: L.save, where: p.city || where(p), wherePath: p.city ? "profile.city" : "profile.venue" };
      case "event": return { ...base, eyebrow: L.join, headline: ev?.name ?? L.programme, date: fmt(p, ev?.date), time: ev?.time ?? "", where: ev?.venue || where(p) };
      case "story": return { ...base, eyebrow: L.invited, lead: p.inviteLine || occasionInvite(p), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "post": return { ...base, eyebrow: L.save };
      case "welcome": return { ...base, eyebrow: L.welcome, date: "", time: "" };
      case "program": return { ...base, headline: L.agenda, showName: false, date: "", time: "", where: "" };
      case "menu": return { ...base, headline: L.menu, showName: false, date: "", time: "", where: "" };
      case "table": return { ...base, headline: L.table, showName: false, number: d.number ?? 1, date: "", time: "", where: "" };
      case "hashtag": return { ...base, hashtag: `#${name.replace(/[^\p{L}\p{N}]/gu, "")}${p.date ? p.date.slice(2, 4) : ""}`, body: L.tag, showName: false, date: "", time: "", where: "" };
      case "thankyou": return { ...base, headline: L.thanks, body: L.thanksBody, showName: false, date: "", time: "", where: "" };
      case "greeting": return { ...base, headline: L.thanks, body: p.story ?? "", footer: p.blessing ?? "", footerPath: "profile.blessing", date: "", time: "", where: "", line: "" };
      default: return base;
    }
  })();
  const x = d.texts ?? {};
  return {
    ...c,
    eyebrow: x.eyebrow ?? c.eyebrow,
    headline: x.headline ?? c.headline,
    body: x.body ?? c.body,
    footer: x.footer ?? c.footer,
    footerPath: x.footer !== undefined ? "texts.footer" : c.footerPath,
    hashtag: x.hashtag ?? c.hashtag,
  };
}
export type BizText = ReturnType<typeof bizText>;

export const shapeOf = (k: Kind): "tall" | "portrait" | "square" | "wide" => (k === "story" || k === "menu" ? "tall" : k === "post" || k === "table" ? "square" : k === "thankyou" ? "wide" : "portrait");

/** Shrink a display size (cqw) for long names so they never overflow: base at ≤ n chars (longest word), scaled beyond. */
export const fit = (text: string, base: number, n = 8, min = 0.45) => {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  return base * Math.max(min, Math.min(1, n / longest));
};
/** Like fit, but for the whole string (wide one-line names). */
export const fitLine = (text: string, base: number, n = 14, min = 0.4) => base * Math.max(min, Math.min(1, n / Math.max(text.length, 1)));
