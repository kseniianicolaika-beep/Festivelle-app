import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { isPair, nameParts, occasionInvite, occasionOf } from "@/lib/occasions";
import { t } from "@/lib/i18n";
import type { Design, Kind } from "@/lib/templates";

// Words for the social group: dinner parties, housewarmings and special occasions (graduation, retirement…).
// A suite may pass `tradition` as its own default ("Graduation", "Retirement") — the host's profile.tradition wins.

export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

const W = {
  en: { invited: "You're invited", save: "Save the date", dinner: "Dinner is served", toDinner: "You're invited to dinner", housewarming: "Housewarming", newHome: "Our new home", celebration: "A celebration", welcome: "Welcome", evening: "The evening", menu: "Menu", table: "Table", tag: "Share your moments", thanks: "Thank you", about: "A few words", reply: "Kindly reply", join: "Join us for", days: "days", hours: "hours" },
  ru: { invited: "Приглашаем вас", save: "Сохраните дату", dinner: "Ужин подан", toDinner: "Приглашение на ужин", housewarming: "Новоселье", newHome: "Наш новый дом", celebration: "Праздник", welcome: "Добро пожаловать", evening: "Программа вечера", menu: "Меню", table: "Стол", tag: "Делитесь снимками", thanks: "Спасибо", about: "Пару слов", reply: "Пожалуйста, ответьте", join: "Ждём вас на", days: "дней", hours: "часов" },
  hi: { invited: "आप आमंत्रित हैं", save: "तिथि सुरक्षित करें", dinner: "भोजन तैयार है", toDinner: "रात्रिभोज का निमंत्रण", housewarming: "गृह प्रवेश", newHome: "हमारा नया घर", celebration: "उत्सव", welcome: "स्वागत है", evening: "कार्यक्रम", menu: "भोजन", table: "मेज़", tag: "अपनी तस्वीरें साझा करें", thanks: "धन्यवाद", about: "कुछ शब्द", reply: "कृपया उत्तर दें", join: "आमंत्रण", days: "दिन", hours: "घंटे" },
} as const;

export const words = (p: Profile) => ({ ...t(p.language), ...W[langOf(p)] });

/** What the special occasion is: the host's word first, then the suite's default. */
export const traditionOf = (p: Profile, fallback?: string) => (p.tradition?.trim() || fallback || "").trim();

const SPECIAL: { re: RegExp; en: [string, string]; ru: [string, string]; hi: string; tag: string }[] = [
  { re: /grad|выпуск|диплом|convocation|दीक्षांत/i, en: ["has graduated", "have graduated"], ru: ["окончил(а) учёбу", "окончили учёбу"], hi: "की स्नातक उपलब्धि", tag: "Grad" },
  { re: /retire|пенси|сेवानिवृत्ति/i, en: ["is retiring — the next chapter begins", "are retiring — the next chapter begins"], ru: ["уходит на заслуженный отдых", "уходят на заслуженный отдых"], hi: "सेवानिवृत्ति — नया अध्याय", tag: "NextChapter" },
  { re: /farewell|bon voyage|прощ|прово|विदाई/i, en: ["farewell & bon voyage", "farewell & bon voyage"], ru: ["провожаем с любовью", "провожаем с любовью"], hi: "विदाई समारोह", tag: "Farewell" },
  { re: /welcome home|home at last|возвращ|स्वागत/i, en: ["is home at last", "are home at last"], ru: ["снова дома", "снова дома"], hi: "घर वापसी", tag: "WelcomeHome" },
  { re: /reunion|встреч|पुनर्मिलन/i, en: ["together again", "together again"], ru: ["снова вместе", "снова вместе"], hi: "फिर से साथ", tag: "Reunion" },
  { re: /award|prize|honou?r|наград|премия|सम्मान/i, en: ["a well-deserved honour", "a well-deserved honour"], ru: ["заслуженная награда", "заслуженная награда"], hi: "एक योग्य सम्मान", tag: "Honour" },
];
const specialOf = (s: string) => SPECIAL.find((x) => x.re.test(s));

/** The short line under the name(s), per occasion. */
export function lineOf(p: Profile, tradition?: string) {
  const L = langOf(p);
  const two = isPair(p);
  const o = occasionOf(p);
  if (o === "dinner_party") return L === "ru" ? (two ? "приглашают на ужин" : "приглашает на ужин") : L === "hi" ? "रात्रिभोज पर आमंत्रित करते हैं" : two ? "invite you to dinner" : "invites you to dinner";
  if (o === "housewarming") return L === "ru" ? (two ? "приглашают на новоселье" : "приглашает на новоселье") : L === "hi" ? "गृह प्रवेश में आपका स्वागत है" : two ? "welcome you to their new home" : "welcomes you to a new home";
  const s = specialOf(traditionOf(p, tradition));
  if (s) return L === "ru" ? s.ru[two ? 1 : 0] : L === "hi" ? s.hi : s.en[two ? 1 : 0];
  return L === "ru" ? "праздник в честь" : L === "hi" ? "के सम्मान में उत्सव" : "a celebration in their honour";
}

/** Eyebrow over the names on the invitation. */
export function eyebrowOf(p: Profile, tradition?: string) {
  const L = words(p);
  const o = occasionOf(p);
  if (o === "dinner_party") return L.toDinner;
  if (o === "housewarming") return traditionOf(p, tradition) || L.housewarming;
  return traditionOf(p, tradition) || L.invited;
}

/** Invitation wording; special occasions get wording that fits the tradition. */
export function inviteOf(p: Profile, tradition?: string) {
  if (p.inviteLine) return p.inviteLine;
  const L = langOf(p);
  if (occasionOf(p) === "special") {
    const s = traditionOf(p, tradition);
    if (/grad|выпуск|диплом/i.test(s)) return L === "ru" ? "Годы учёбы позади — приходите отпраздновать вместе с нами" : "The books are closed and the cap is on — come and celebrate with us";
    if (/retire|пенси/i.test(s)) return L === "ru" ? "После многих лет любимой работы начинается новая глава — отметим её вместе" : "After years of wonderful work, a new chapter begins — please join us to celebrate it";
    if (/farewell|прощ|прово/i.test(s)) return L === "ru" ? "Прежде чем начнётся новое путешествие — давайте соберёмся вместе" : "Before the next adventure begins, let's gather one more time";
  }
  return occasionInvite(p);
}

export function thanksOf(p: Profile) {
  const L = langOf(p);
  const o = occasionOf(p);
  if (o === "dinner_party") return L === "ru" ? "за чудесный вечер за нашим столом" : L === "hi" ? "हमारी मेज़ पर एक सुंदर शाम के लिए" : "for a beautiful evening at our table";
  if (o === "housewarming") return L === "ru" ? "что наполнили наш дом теплом" : L === "hi" ? "हमारे घर को स्नेह से भरने के लिए" : "for filling our new home with warmth";
  return L === "ru" ? "что разделили с нами этот день" : L === "hi" ? "इस दिन को साथ मनाने के लिए" : "for celebrating with us";
}

export const fmt = (p: Profile, iso?: string) => formatDate(iso ?? p.date, p.language);
export const where = (p: Profile) => p.venue || p.city || "";
export const whereFull = (p: Profile) => [p.venue, p.city].filter(Boolean).join(", ");
export const mapHref = (p: Profile) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(whereFull(p))}`;
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
    monthShort: d.toLocaleDateString(loc, { month: "short", timeZone: "UTC" }).replace(".", ""),
    weekday: d.toLocaleDateString(loc, { weekday: "long", timeZone: "UTC" }),
    year: d.getUTCFullYear(),
  };
}

type Item = { title: string; detail: string };
const MENUS: Record<"dinner_party" | "housewarming" | "special", Record<Lang, Item[]>> = {
  dinner_party: {
    en: [{ title: "Aperitivo", detail: "Negroni · Feni sour · Marinated olives" }, { title: "To the table", detail: "Burrata & charred peaches · Prawn rissoles · Slow-roast lamb" }, { title: "To finish", detail: "Bebinca with salted caramel · Coffee & digestifs" }],
    ru: [{ title: "Аперитив", detail: "Негрони · Оливки · Брускетта" }, { title: "Ужин", detail: "Буррата с персиками · Утка с вишней · Гоанские креветки" }, { title: "Десерт", detail: "Медовик · Кофе и дижестивы" }],
    hi: [{ title: "शुरुआत", detail: "पनीर टिक्का · झींगा · चाट" }, { title: "मुख्य भोजन", detail: "दाल मखनी · बिरयानी · मछली करी" }, { title: "मिठाई", detail: "रसमलाई · कॉफ़ी" }],
  },
  housewarming: {
    en: [{ title: "Welcome", detail: "Kokum cooler · Masala chai · Sweets from the pooja" }, { title: "Lunch", detail: "Puri bhaji · Goan pulao · Fish curry · Salads" }, { title: "Something sweet", detail: "Kheer · Bebinca · Coffee" }],
    ru: [{ title: "Хлеб да соль", detail: "Каравай · Морс · Пирожки" }, { title: "Застолье", detail: "Пельмени · Салаты · Запечённая рыба" }, { title: "Чай", detail: "Самовар · Медовик · Варенье" }],
    hi: [{ title: "स्वागत", detail: "कोकम शरबत · मसाला चाय · प्रसाद" }, { title: "भोजन", detail: "पूरी भाजी · पुलाव · करी" }, { title: "मिठाई", detail: "खीर · लड्डू" }],
  },
  special: {
    en: [{ title: "Canapés", detail: "Mini crab cakes · Beetroot tartlets · Cheese straws" }, { title: "Dinner", detail: "Goan roast chicken · Saffron pulao · Garden greens" }, { title: "Cake & toasts", detail: "Celebration cake · Champagne" }],
    ru: [{ title: "Закуски", detail: "Канапе · Тарталетки · Сырная тарелка" }, { title: "Ужин", detail: "Курица · Плов с шафраном · Салат" }, { title: "Торт и тосты", detail: "Праздничный торт · Шампанское" }],
    hi: [{ title: "शुरुआत", detail: "कबाब · चाट" }, { title: "भोजन", detail: "पुलाव · करी · सलाद" }, { title: "केक", detail: "उत्सव केक" }],
  },
};

/** Default list for menu / programme pieces. */
export function itemsOf(kind: Kind, d: Design, p: Profile): Item[] {
  if (d.items?.length) return d.items.map((x) => ({ title: x.title, detail: x.detail ?? "" }));
  const o = occasionOf(p);
  if (kind === "menu") return MENUS[o === "dinner_party" || o === "housewarming" ? o : "special"][langOf(p)];
  if (kind === "program") return (p.events ?? []).map((e) => ({ title: e.name, detail: e.time ?? "" }));
  return [];
}

export type CardText = ReturnType<typeof cardText>;
/** What each piece says; design.texts overrides. `*Path` = where <E> writes. */
export function cardText(kind: Kind, d: Design, p: Profile, tradition?: string) {
  const L = words(p);
  const [a, b] = nameParts(p);
  const o = occasionOf(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const tag = o === "dinner_party" ? "Supper" : o === "housewarming" ? "NewHome" : specialOf(traditionOf(p, tradition))?.tag ?? "Celebrates";
  const base = {
    a, b, eyebrow: "", headline: "", line: lineOf(p, tradition), lead: "", body: "", footer: "",
    date: fmt(p), time: firstTime(p), where: where(p), wherePath: p.venue ? "profile.venue" : "profile.city",
    items: kind === "menu" || kind === "program" ? itemsOf(kind, d, p) : [],
    number: undefined as number | undefined, hashtag: "", showName: true, footerPath: "texts.footer",
  };
  const c = (() => {
    switch (kind) {
      case "invite": return { ...base, eyebrow: eyebrowOf(p, tradition), lead: inviteOf(p, tradition), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "save": return { ...base, eyebrow: L.save };
      case "event": return { ...base, eyebrow: L.join, headline: ev?.name ?? eyebrowOf(p, tradition), date: fmt(p, ev?.date), time: ev?.time ?? "", where: ev?.venue || where(p) };
      case "story": return { ...base, eyebrow: eyebrowOf(p, tradition), lead: inviteOf(p, tradition), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "post": return { ...base, eyebrow: L.save };
      case "welcome": return { ...base, eyebrow: L.welcome, line: o === "special" ? traditionOf(p, tradition) || L.celebration : o === "housewarming" ? L.newHome : L.dinner, date: "", time: "" };
      case "program": return { ...base, headline: L.evening, showName: false, date: "", time: "", where: "" };
      case "menu": return { ...base, headline: L.menu, showName: false, date: "", time: "", where: "" };
      case "table": return { ...base, headline: L.table, showName: false, number: d.number ?? 1, date: "", time: "", where: "" };
      case "hashtag": return { ...base, hashtag: `#${a.split(" ").pop()}${tag}`.replace(/[\s.]/g, ""), body: L.tag, showName: false, date: "", time: "", where: "" };
      case "thankyou": return { ...base, headline: L.thanks, body: thanksOf(p), showName: false, date: "", time: "", where: "" };
      case "greeting": return { ...base, headline: traditionOf(p, tradition) || L.celebration, body: p.story ?? "", footer: p.blessing ?? "", footerPath: "profile.blessing", date: "", time: "", where: "", line: "" };
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

export const shapeOf = (k: Kind): "tall" | "portrait" | "square" | "wide" => (k === "story" || k === "menu" ? "tall" : k === "post" || k === "table" ? "square" : k === "thankyou" ? "wide" : "portrait");

/** Shrink a display size (cqw) for long names so they never overflow. */
export const fit = (text: string, base: number, n = 8, min = 0.42) => {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  return base * Math.max(min, Math.min(1, n / longest));
};
