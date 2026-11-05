import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { t } from "@/lib/i18n";
import type { Design, Kind } from "@/lib/templates";

export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

const W = {
  en: { invited: "You're invited", toCelebrate: "to celebrate", save: "Save the date", welcome: "Welcome", evening: "The evening", menu: "Menu", table: "Table", tag: "Share your moments", thanks: "Thank you", thanksBody: "for making it a night to remember", hb: "Happy birthday", about: "A few words", birthday: "birthday", years: "years", pop: "Pop the cork", blow: "Make a wish — blow out the candles", light: "Light the lamps", reply: "Kindly reply", celebrating: "Celebrating", join: "Join us for", party: "Party", evOf: "an evening for", days: "days", hours: "hours", mins: "min", wished: "Wish made" },
  ru: { invited: "Приглашаем вас", toCelebrate: "отпраздновать", save: "Сохраните дату", welcome: "Добро пожаловать", evening: "Программа вечера", menu: "Меню", table: "Стол", tag: "Делитесь снимками", thanks: "Спасибо", thanksBody: "что сделали этот вечер незабываемым", hb: "С днём рождения", about: "Пару слов", birthday: "день рождения", years: "лет", pop: "Откройте шампанское", blow: "Загадайте желание — задуйте свечи", light: "Зажгите светильники", reply: "Пожалуйста, ответьте", celebrating: "Празднуем", join: "Ждём вас на", party: "Праздник", evOf: "вечер в честь", days: "дней", hours: "часов", mins: "мин", wished: "Желание загадано" },
  hi: { invited: "आप आमंत्रित हैं", toCelebrate: "जश्न में", save: "तिथि सुरक्षित करें", welcome: "स्वागत है", evening: "कार्यक्रम", menu: "भोजन", table: "मेज़", tag: "अपनी तस्वीरें साझा करें", thanks: "धन्यवाद", thanksBody: "इस शाम को यादगार बनाने के लिए", hb: "जन्मदिन मुबारक", about: "कुछ शब्द", birthday: "जन्मदिन", years: "वर्ष", pop: "शैम्पेन खोलें", blow: "मन्नत माँगिए — मोमबत्तियाँ बुझाइए", light: "दीप जलाइए", reply: "कृपया उत्तर दें", celebrating: "उत्सव", join: "आमंत्रण", party: "पार्टी", evOf: "एक शाम", days: "दिन", hours: "घंटे", mins: "मिनट", wished: "मन्नत माँग ली" },
} as const;

export const words = (p: Profile) => ({ ...t(p.language), ...W[langOf(p)] });

export function ruYears(n: number) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return "год";
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "года";
  return "лет";
}
export function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
/** "30th birthday" / "30-летие" / "30वाँ जन्मदिन" */
export function birthdayOf(p: Profile) {
  const L = langOf(p), n = p.age;
  if (!n) return L === "ru" ? "День рождения" : L === "hi" ? "जन्मदिन" : "Birthday";
  return L === "ru" ? `${n}-летие` : L === "hi" ? `${n}वाँ जन्मदिन` : `${ordinal(n)} birthday`;
}
/** The line under the name. Russian reads "отмечает 35-летие" rather than the generic "— нам 35!". */
export function lineOf(p: Profile) {
  if (langOf(p) === "ru") return p.age ? `отмечает ${p.age}-летие` : "празднует день рождения";
  return occasionLine(p);
}
/** "years" word for the age, plural-correct in Russian. */
export const yearsWord = (p: Profile) => (langOf(p) === "ru" && p.age ? ruYears(p.age) : words(p).years);

export const fmt = (p: Profile, iso?: string) => formatDate(iso ?? p.date, p.language);
export const where = (p: Profile) => p.venue || p.city || "";
export const whereFull = (p: Profile) => [p.venue, p.city].filter(Boolean).join(", ");
export const mapHref = (p: Profile) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(whereFull(p))}`;
export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;
export const firstTime = (p: Profile) => p.events?.find((e) => e.time)?.time ?? "";
/** Day / month / year parts for split typographic dates. */
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
    yy: String(d.getUTCFullYear()).slice(2),
  };
}

const MENU = {
  en: [{ title: "To begin", detail: "Oysters · Burrata & heirloom tomato · Prawn rissoles" }, { title: "The main affair", detail: "Goan fish curry · Slow-roast lamb · Saffron pulao" }, { title: "Something sweet", detail: "Birthday cake · Bebinca · Champagne sorbet" }],
  ru: [{ title: "Закуски", detail: "Блины с икрой · Буррата · Тартар из лосося" }, { title: "Горячее", detail: "Утка с вишней · Гоанское рыбное карри" }, { title: "Десерт", detail: "Праздничный торт · Медовик · Шампанское" }],
  hi: [{ title: "शुरुआत", detail: "पनीर टिक्का · झींगा · चाट" }, { title: "मुख्य भोजन", detail: "दाल मखनी · बिरयानी · मछली करी" }, { title: "मिठाई", detail: "जन्मदिन केक · गुलाब जामुन · रसमलाई" }],
};

export type CardText = ReturnType<typeof cardText>;
/** What each piece says, birthday-first; design.texts overrides. `*Path` = where <E> writes. */
export function cardText(kind: Kind, d: Design, p: Profile) {
  const L = words(p);
  const [name] = nameParts(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const items = d.items?.length
    ? d.items
    : kind === "menu"
      ? MENU[langOf(p)]
      : kind === "program"
        ? (p.events ?? []).map((e) => ({ title: e.name, detail: e.time ?? "" }))
        : [];
  const base = {
    name,
    eyebrow: "",
    headline: "",
    line: lineOf(p),
    lead: "",
    body: "",
    footer: "",
    date: fmt(p),
    time: firstTime(p),
    where: where(p),
    wherePath: p.venue ? "profile.venue" : "profile.city",
    items: kind === "menu" || kind === "program" ? items : [],
    number: undefined as number | undefined,
    hashtag: "",
    showName: true,
    footerPath: "texts.footer",
  };
  const c = (() => {
    switch (kind) {
      case "invite": return { ...base, eyebrow: L.invited, lead: p.inviteLine || occasionInvite(p), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "save": return { ...base, eyebrow: L.save, where: p.city || where(p), wherePath: p.city ? "profile.city" : "profile.venue" };
      case "event": return { ...base, eyebrow: L.join, headline: ev?.name ?? L.party, date: fmt(p, ev?.date), time: ev?.time ?? "", where: ev?.venue || where(p) };
      case "story": return { ...base, eyebrow: L.invited, lead: p.inviteLine || occasionInvite(p), footer: p.blessing ?? "", footerPath: "profile.blessing" };
      case "post": return { ...base, eyebrow: L.save };
      case "welcome": return { ...base, eyebrow: L.welcome, line: birthdayOf(p), date: "", time: "" };
      case "program": return { ...base, headline: L.evening, showName: false, date: "", time: "", where: "" };
      case "menu": return { ...base, headline: L.menu, showName: false, date: "", time: "", where: "" };
      case "table": return { ...base, headline: L.table, showName: false, number: d.number ?? 1, date: "", time: "", where: "" };
      case "hashtag": return { ...base, hashtag: `#${name.split(" ")[0]}${p.age ?? ""}`.replace(/\s/g, ""), body: L.tag, showName: false, date: "", time: "", where: "" };
      case "thankyou": return { ...base, headline: L.thanks, body: L.thanksBody, showName: false, date: "", time: "", where: "" };
      case "greeting": return { ...base, headline: L.hb, body: p.story ?? "", footer: p.blessing ?? "", footerPath: "profile.blessing", date: "", time: "", where: "", line: "" };
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

/** Shape bucket for composition decisions. */
export const shapeOf = (k: Kind): "tall" | "portrait" | "square" | "wide" => (k === "story" || k === "menu" ? "tall" : k === "post" || k === "table" ? "square" : k === "thankyou" ? "wide" : "portrait");

/** Shrink a display size (cqw) for long names so they never overflow: base at ≤ n chars, scaled beyond. */
export const fit = (text: string, base: number, n = 8, min = 0.45) => {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  return base * Math.max(min, Math.min(1, n / longest));
};
