import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import { nameParts, occasionInvite, occasionLine, occasionOf } from "@/lib/occasions";
import type { Design, Kind } from "@/lib/templates";

export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

const X = {
  en: { save: "Save the date", welcome: "Welcome to the wedding of", table: "Table", join: "invite you to their", tag: "Share your moments with us", thanks: "Thank you", thanksBody: "for celebrating the beginning of our forever with us", program: "Order of ceremony", menu: "Menu", wedding: "The wedding of", days: "days", hours: "hours", minutes: "minutes", invited: "You are invited", reply: "Kindly reply", chapter: "Chapter", formal: "Formal invitation to follow", married: "We're getting married", enter: "Open", scroll: "Scroll", celebrate: "Celebrate with us", ceremony: "Ceremony", map: "Open the map" },
  ru: { save: "Сохраните дату", welcome: "Добро пожаловать на свадьбу", table: "Стол", join: "приглашают вас на", tag: "Делитесь снимками с нашим хэштегом", thanks: "Спасибо", thanksBody: "за то, что были с нами в самый счастливый день", program: "Программа", menu: "Меню", wedding: "Свадьба", days: "дней", hours: "часов", minutes: "минут", invited: "Приглашение", reply: "Пожалуйста, ответьте", chapter: "Глава", formal: "Приглашение последует", married: "Мы женимся", enter: "Открыть", scroll: "Листайте", celebrate: "Разделите этот день с нами", ceremony: "Церемония", map: "Открыть карту" },
  hi: { save: "तिथि सुरक्षित करें", welcome: "विवाह में आपका स्वागत है", table: "मेज़", join: "आपको आमंत्रित करते हैं", tag: "अपनी तस्वीरें साझा करें", thanks: "धन्यवाद", thanksBody: "हमारे जीवन के इस नए अध्याय में शामिल होने के लिए", program: "विवाह संस्कार", menu: "भोजन", wedding: "शुभ विवाह", days: "दिन", hours: "घंटे", minutes: "मिनट", invited: "आप आमंत्रित हैं", reply: "कृपया उत्तर दें", chapter: "अध्याय", formal: "औपचारिक निमंत्रण शीघ्र", married: "हम विवाह कर रहे हैं", enter: "खोलें", scroll: "नीचे देखें", celebrate: "हमारे साथ उत्सव मनाइए", ceremony: "संस्कार", map: "नक्शा खोलें" },
} as const;

/** Site + card vocabulary: the shared i18n dictionary plus the extra words these suites need. */
export const words = (p: Profile) => ({ ...t(langOf(p)), ...X[langOf(p)] });
export type Words = ReturnType<typeof words>;

export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;
export const mapUrl = (p: Profile) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.venue, p.city].filter(Boolean).join(", "))}`;

const LOC = { en: "en-GB", ru: "ru-RU", hi: "hi-IN" } as const;
/** Pieces of a date for typographic play: 15 · 05 · 2027, "May", "Saturday". */
export function dateParts(iso: string | undefined, lang: Lang) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const f = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(LOC[lang], { ...o, timeZone: "UTC" });
  return {
    day: String(d.getUTCDate()),
    dd: String(d.getUTCDate()).padStart(2, "0"),
    mm: String(d.getUTCMonth() + 1).padStart(2, "0"),
    year: String(d.getUTCFullYear()),
    month: f({ month: "long" }),
    monthShort: f({ month: "short" }).replace(".", ""),
    weekday: f({ weekday: "long" }),
    full: formatDate(iso, lang),
    roman: toRoman(d.getUTCMonth() + 1),
  };
}
export function toRoman(n: number) {
  const m: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  for (const [v, r] of m) while (n >= v) { s += r; n -= v; }
  return s;
}

/** What every paper piece says (mirrors Paper.tsx semantics; design.texts overrides). */
export function cardText(kind: Kind, d: Design, p: Profile) {
  const L = words(p);
  const lang = langOf(p);
  const occ = occasionOf(p);
  const wed = occ === "wedding";
  const ev = p.events?.[d.eventIndex ?? 0];
  const [a, b] = nameParts(p);
  const where = p.venue || p.city || "";
  const base = {
    a, b, lang, wed, L,
    eyebrow: "", lead: "", headline: "", sub: "", body: "", footer: p.blessing ?? "", hashtag: "",
    date: formatDate(p.date, p.language), iso: p.date, where, city: p.city ?? "", venue: p.venue ?? "",
    time: p.events?.[0]?.time ?? "", items: d.items ?? [], number: d.number ?? 1, ev,
  };
  const c = (() => {
    switch (kind) {
      case "invite": return { ...base, eyebrow: wed ? L.wedding : occasionLine(p), lead: p.inviteLine || (wed ? L.invite : occasionInvite(p)), sub: wed ? L.getting : occasionLine(p) };
      case "save": return { ...base, eyebrow: L.save, sub: L.formal, where: p.city || where };
      case "event": return { ...base, lead: L.join, headline: ev?.name ?? L.celebrate, date: formatDate(ev?.date ?? p.date, p.language), iso: ev?.date ?? p.date, time: ev?.time ?? "", where: ev?.venue || where };
      case "story": return { ...base, eyebrow: wed ? L.save : occasionLine(p), sub: wed ? L.getting : "" };
      case "post": return { ...base, eyebrow: wed ? L.married : occasionLine(p) };
      case "welcome": return { ...base, eyebrow: wed ? L.welcome : lang === "ru" ? "Добро пожаловать" : lang === "hi" ? "स्वागत है" : "Welcome" };
      case "program": return { ...base, headline: L.program, items: d.items?.length ? d.items : defaultProgram(p) };
      case "menu": return { ...base, headline: L.menu, items: d.items?.length ? d.items : defaultMenu(lang) };
      case "table": return { ...base, headline: L.table };
      case "hashtag": return { ...base, hashtag: `#${a.split(" ")[0]}${lang === "ru" ? "И" : "Weds"}${(b || "Forever").split(" ")[0]}`, body: L.tag };
      case "thankyou": return { ...base, headline: L.thanks, body: L.thanksBody };
      case "greeting": return { ...base, eyebrow: occasionLine(p), body: p.story ?? "", date: "", where: "" };
      default: return base;
    }
  })();
  const x = d.texts ?? {};
  return { ...c, eyebrow: x.eyebrow ?? c.eyebrow, headline: x.headline ?? c.headline, body: x.body ?? c.body, footer: x.footer ?? c.footer, hashtag: x.hashtag ?? c.hashtag };
}
export type CardText = ReturnType<typeof cardText>;

function defaultProgram(p: Profile) {
  if (p.language === "ru" || p.culture === "russian") return [{ title: "Венчание", detail: "Таинство в храме" }, { title: "Регистрация", detail: "Обмен кольцами" }, { title: "Каравай", detail: "Хлеб и соль от родителей" }, { title: "Банкет", detail: "Тосты, танцы и «Горько!»" }];
  if (p.language === "hi") return [{ title: "बारात", detail: "संगीत और नृत्य के साथ आगमन" }, { title: "जयमाला", detail: "वरमाला का आदान-प्रदान" }, { title: "फेरे", detail: "अग्नि के साक्षी सात वचन" }, { title: "विदाई", detail: "स्नेह भरी विदा" }];
  if (p.culture === "indian" || p.culture === "fusion") return [{ title: "Baraat", detail: "The groom arrives with music and dancing" }, { title: "Jaimala", detail: "Exchange of flower garlands" }, { title: "Pheras", detail: "Seven vows around the sacred fire" }, { title: "Vidaai", detail: "A tender farewell" }];
  return [{ title: "Processional", detail: "Please be seated" }, { title: "Vows & rings", detail: "Words we wrote for each other" }, { title: "First kiss", detail: "Cheer as loudly as you like" }, { title: "Recessional", detail: "Champagne awaits" }];
}
function defaultMenu(lang: Lang) {
  if (lang === "ru") return [{ title: "Закуски", detail: "Блины с икрой · Тартар из лосося" }, { title: "Горячее", detail: "Утка с вишней · Пельмени с трюфелем" }, { title: "Десерт", detail: "Свадебный торт · Медовик" }];
  if (lang === "hi") return [{ title: "शुरुआत", detail: "पनीर टिक्का · आलू चाट" }, { title: "मुख्य भोज", detail: "दाल मखनी · केसर पुलाव · बटर नान" }, { title: "मिठाई", detail: "गुलाब जामुन · रसमलाई" }];
  return [{ title: "To begin", detail: "Oysters · Blini with smetana · Paneer tikka" }, { title: "The feast", detail: "Goan fish curry · Saffron pulao · Beef Wellington" }, { title: "Something sweet", detail: "Bebinca · Medovik · Champagne sorbet" }];
}

export { nameParts, occasionInvite, occasionLine, occasionOf };
