import type { Profile } from "@/lib/profile";
import { nameParts, occasionInvite } from "@/lib/occasions";
import type { Design, Kind } from "@/lib/templates";
import { words as base, langOf, fmt, where, firstTime, type Lang } from "../../celebrate/_shared/words";

export { langOf, fmt, where, firstTime, shapeOf, fit, dateParts, mapHref, media, whereFull } from "../../celebrate/_shared/words";

// Holiday-party words. Hosts are the honourees (profile.partner1, e.g. "The Kapoors"); profile.tradition = the festival.
export type Fest = "diwali" | "christmas" | "new-year" | "easter" | "holi" | "eid";
type L3 = Record<Lang, string>;

const FEST: Record<Fest, { name: L3; wish: L3; hash: string; aliases: RegExp }> = {
  diwali: { name: { en: "Diwali", ru: "Дивали", hi: "दीपावली" }, wish: { en: "Shubh Deepavali", ru: "Счастливого Дивали", hi: "शुभ दीपावली" }, hash: "Diwali", aliases: /diwali|deepavali|дивали|दीपावली|दिवाली/i },
  christmas: { name: { en: "Christmas", ru: "Рождество", hi: "क्रिसमस" }, wish: { en: "Merry Christmas", ru: "С Рождеством Христовым", hi: "क्रिसमस मुबारक" }, hash: "Christmas", aliases: /christmas|xmas|рождеств|क्रिसमस/i },
  "new-year": { name: { en: "New Year’s Eve", ru: "Новый год", hi: "नव वर्ष" }, wish: { en: "Happy New Year", ru: "С Новым годом", hi: "नव वर्ष की शुभकामनाएँ" }, hash: "NYE", aliases: /new year|nye|нов(ый|ым) год|नव वर्ष/i },
  easter: { name: { en: "Easter", ru: "Пасха", hi: "ईस्टर" }, wish: { en: "Happy Easter", ru: "Христос воскресе!", hi: "ईस्टर की शुभकामनाएँ" }, hash: "Easter", aliases: /easter|пасх|ईस्टर/i },
  holi: { name: { en: "Holi", ru: "Холи", hi: "होली" }, wish: { en: "Happy Holi", ru: "Счастливого Холи", hi: "होली मुबारक" }, hash: "Holi", aliases: /holi|холи|होली/i },
  eid: { name: { en: "Eid", ru: "Ураза-байрам", hi: "ईद" }, wish: { en: "Eid Mubarak", ru: "Ид Мубарак", hi: "ईद मुबारक" }, hash: "Eid", aliases: /eid|ид |ураза|курбан|ईद/i },
};

/** The festival this piece celebrates: the template's own, unless the hosts named another one in profile.tradition. */
export function festOf(p: Profile, def: Fest) {
  const L = langOf(p);
  const tr = p.tradition?.trim();
  const f = FEST[def];
  if (!tr || f.aliases.test(tr)) return { id: def, name: f.name[L], wish: f.wish[L], hash: f.hash };
  return { id: def, name: tr, wish: L === "ru" ? `С праздником — ${tr}` : L === "hi" ? `${tr} की शुभकामनाएँ` : `Happy ${tr}`, hash: tr.replace(/[^\p{L}\p{N}]/gu, "") };
}

const W = {
  en: { invited: "You’re invited", celebrate: "invite you to celebrate", hosted: "Hosted by", save: "Save the date", welcome: "Welcome", evening: "The evening", menu: "The feast", table: "Table", tag: "Share your moments", thanks: "Thank you", thanksBody: "for celebrating with us", join: "Join us for", party: "Celebration", about: "A note from the hosts", dress: "Dress code" },
  ru: { invited: "Приглашаем вас", celebrate: "ждём вас на празднике", hosted: "Хозяева вечера", save: "Сохраните дату", welcome: "Добро пожаловать", evening: "Программа вечера", menu: "Праздничный стол", table: "Стол", tag: "Делитесь снимками", thanks: "Спасибо", thanksBody: "что праздновали вместе с нами", join: "Ждём вас на", party: "Праздник", about: "Пара слов от хозяев", dress: "Дресс-код" },
  hi: { invited: "आप आमंत्रित हैं", celebrate: "आपको उत्सव में आमंत्रित करते हैं", hosted: "मेज़बान", save: "तिथि सुरक्षित करें", welcome: "स्वागत है", evening: "कार्यक्रम", menu: "भोज", table: "मेज़", tag: "अपनी तस्वीरें साझा करें", thanks: "धन्यवाद", thanksBody: "हमारे साथ उत्सव मनाने के लिए", join: "आमंत्रण", party: "उत्सव", about: "मेज़बानों की ओर से", dress: "पोशाक" },
} as const;

export const hwords = (p: Profile) => ({ ...base(p), ...W[langOf(p)] });

type Course = { title: string; detail: string };
const MENUS: Record<Fest, Partial<Record<Lang, Course[]>> & { en: Course[] }> = {
  diwali: {
    en: [{ title: "Chaat counter", detail: "Pani puri · Dahi bhalla · Samosa" }, { title: "The thali", detail: "Paneer makhani · Dal tadka · Saffron pulao · Puri" }, { title: "Mithai", detail: "Kaju katli · Gulab jamun · Besan ladoo" }],
    ru: [{ title: "Закуски", detail: "Пани-пури · Самоса · Пакоры" }, { title: "Тали", detail: "Панир махани · Дал · Шафрановый плов" }, { title: "Сладости", detail: "Каджу катли · Гулаб джамун · Ладду" }],
  },
  christmas: {
    en: [{ title: "To begin", detail: "Prawn rissoles · Chorizo pão · Mulled wine" }, { title: "The roast", detail: "Roast chicken with xacuti · Pork sorpotel & sannas" }, { title: "Sweet things", detail: "Bebinca · Kulkuls · Plum cake" }],
    ru: [{ title: "Закуски", detail: "Сочиво · Студень · Пироги с капустой" }, { title: "Горячее", detail: "Гусь с яблоками · Утка с брусникой" }, { title: "Десерт", detail: "Имбирные пряники · Рождественский кекс · Сбитень" }],
  },
  "new-year": {
    en: [{ title: "Midnight bites", detail: "Blini & caviar · Oysters · Truffle croquettes" }, { title: "Supper", detail: "Olivier salad · Roast duck · Mushroom julienne" }, { title: "At the stroke of twelve", detail: "Champagne · Tangerines · Napoleon cake" }],
    ru: [{ title: "Закуски", detail: "Блины с икрой · Селёдка под шубой · Тарталетки" }, { title: "Горячее", detail: "Оливье · Утка с яблоками · Жульен" }, { title: "Под бой курантов", detail: "Шампанское · Мандарины · Наполеон" }],
  },
  easter: {
    en: [{ title: "Brunch", detail: "Hot cross buns · Devilled eggs · Spring salad" }, { title: "The table", detail: "Roast lamb with rosemary · New potatoes" }, { title: "Sweet things", detail: "Simnel cake · Kulich · Chocolate eggs" }],
    ru: [{ title: "Пасхальный стол", detail: "Крашеные яйца · Кулич · Творожная пасха" }, { title: "Горячее", detail: "Запечённая баранина · Молодой картофель" }, { title: "К чаю", detail: "Пирог с вишней · Мёд · Самовар" }],
  },
  holi: {
    en: [{ title: "Street bites", detail: "Dahi bhalla · Pakoras · Aloo tikki" }, { title: "Lunch", detail: "Chole bhature · Kachori · Kadhi" }, { title: "Sweet & cool", detail: "Gujiya · Malpua · Thandai" }],
    ru: [{ title: "Закуски", detail: "Дахи бхалла · Пакоры · Алу тикки" }, { title: "Обед", detail: "Чоле бхатуре · Качори" }, { title: "Сладкое", detail: "Гуджия · Малпуа · Тандай" }],
  },
  eid: {
    en: [{ title: "To break the fast", detail: "Medjool dates · Rooh Afza sherbet · Fruit chaat" }, { title: "The dawat", detail: "Mutton biryani · Haleem · Seekh kebab · Sheermal" }, { title: "Sweet", detail: "Sheer khurma · Phirni · Seviyan" }],
    ru: [{ title: "Ифтар", detail: "Финики · Шербет · Фруктовый чат" }, { title: "Дастархан", detail: "Плов с бараниной · Халим · Кебаб" }, { title: "Сладкое", detail: "Шир-хурма · Пхирни · Чак-чак" }],
  },
};

/** What each piece says for a holiday party; design.texts overrides. `*Path` = where <E> writes. */
export function holidayText(kind: Kind, d: Design, p: Profile, def: Fest) {
  const L = hwords(p);
  const f = festOf(p, def);
  const [name] = nameParts(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const lang = langOf(p);
  const items = d.items?.length
    ? d.items
    : kind === "menu"
      ? (MENUS[def][lang] ?? MENUS[def].en)
      : kind === "program"
        ? (p.events ?? []).map((e) => ({ title: e.name, detail: e.time ?? "" }))
        : [];
  const surname = name.replace(/^(the|семья)\s+/i, "").split(/\s+/)[0].replace(/s$/, "");
  const base = {
    name, fest: f.name, wish: f.wish,
    eyebrow: "", headline: "", line: L.celebrate, lead: "", body: "", footer: "",
    date: fmt(p), time: firstTime(p), where: where(p), wherePath: p.venue ? "profile.venue" : "profile.city",
    items: kind === "menu" || kind === "program" ? items : [],
    number: undefined as number | undefined, hashtag: "", showName: true, footerPath: "texts.footer",
  };
  const c = (() => {
    switch (kind) {
      case "invite": case "story": return { ...base, eyebrow: f.wish, headline: f.name, lead: p.inviteLine || occasionInvite(p), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "save": return { ...base, eyebrow: L.save, headline: f.name, where: p.city || where(p), wherePath: p.city ? "profile.city" : "profile.venue" };
      case "event": return { ...base, eyebrow: L.join, headline: ev?.name ?? f.name, date: fmt(p, ev?.date), time: ev?.time ?? "", where: ev?.venue || where(p) };
      case "post": return { ...base, eyebrow: L.save, headline: f.name };
      case "welcome": return { ...base, eyebrow: L.welcome, headline: f.wish, line: "", date: "", time: "", where: "" };
      case "program": return { ...base, headline: L.evening, showName: false, date: "", time: "", where: "" };
      case "menu": return { ...base, headline: L.menu, showName: false, date: "", time: "", where: "" };
      case "table": return { ...base, headline: L.table, showName: false, number: d.number ?? 1, date: "", time: "", where: "" };
      case "hashtag": return { ...base, hashtag: `#${surname}${f.hash}`.replace(/\s/g, ""), body: L.tag, showName: false, date: "", time: "", where: "" };
      case "thankyou": return { ...base, headline: L.thanks, body: L.thanksBody, showName: false, date: "", time: "", where: "" };
      case "greeting": return { ...base, headline: f.wish, body: p.story ?? "", footer: p.blessing ?? "", footerPath: "profile.blessing", date: "", time: "", where: "", line: "", showName: false };
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
export type HolidayText = ReturnType<typeof holidayText>;
