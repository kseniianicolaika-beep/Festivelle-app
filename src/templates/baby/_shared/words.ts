import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { t } from "@/lib/i18n";
import { KINDS, sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";

// Baby-shower wording for the whole "baby" group (EN / RU / HI). Tender, never wedding-speak.
export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

const EN = {
  save: "Save the date", welcome: "Welcome", thanks: "Thank you", thanksBody: "for every blessing, every gift and every bit of love you showered on our little one",
  menu: "Tea & treats", program: "The afternoon", table: "Table", tagBody: "Share your photos with us", babyOnWay: "a little one is on the way",
  parents: "parents-to-be", days: "days to go", day: "day to go", today: "it's today", soon: "soon",
  invitation: "You're invited", story: "Our little story", details: "The details", schedule: "The day", venue: "Where", gallery: "Moments", rsvp: "Kindly reply", info: "Good to know",
  when: "When", where: "Where", directions: "Get directions", calendar: "Add to calendar", with: "with love", open: "Open", tapToOpen: "tap to open", scroll: "scroll",
  hosted: "A baby shower", awaiting: "Waiting for you", hello: "Hello, little one", blessing: "Bring your blessings, your stories and your softest wishes",
};
type Words = { [K in keyof typeof EN]: string };
const RU: Words = {
  save: "Сохраните дату", welcome: "Добро пожаловать", thanks: "Спасибо", thanksBody: "за каждое пожелание, каждый подарок и всю любовь к нашему малышу",
  menu: "Чай и сладости", program: "Программа", table: "Стол", tagBody: "Делитесь снимками с нами", babyOnWay: "скоро нас станет больше",
  parents: "будущие родители", days: "дней осталось", day: "день остался", today: "сегодня", soon: "скоро",
  invitation: "Приглашаем вас", story: "Наша маленькая история", details: "Подробности", schedule: "Программа", venue: "Где", gallery: "Мгновения", rsvp: "Пожалуйста, ответьте", info: "Полезно знать",
  when: "Когда", where: "Где", directions: "Как добраться", calendar: "Добавить в календарь", with: "с любовью", open: "Открыть", tapToOpen: "нажмите, чтобы открыть", scroll: "листайте",
  hosted: "Бэйби-шавер", awaiting: "Ждём тебя", hello: "Здравствуй, малыш", blessing: "Приносите добрые пожелания, истории и самые нежные слова",
};
const HI: Words = {
  save: "तिथि सुरक्षित करें", welcome: "स्वागत है", thanks: "धन्यवाद", thanksBody: "हमारे नन्हे के लिए हर आशीर्वाद, हर उपहार और इतने सारे प्यार के लिए",
  menu: "जलपान", program: "कार्यक्रम", table: "मेज़", tagBody: "अपनी तस्वीरें हमारे साथ साझा करें", babyOnWay: "नन्हा मेहमान आने वाला है",
  parents: "होने वाले माता-पिता", days: "दिन शेष", day: "दिन शेष", today: "आज ही", soon: "जल्द ही",
  invitation: "आप आमंत्रित हैं", story: "हमारी नन्ही कहानी", details: "विवरण", schedule: "कार्यक्रम", venue: "स्थान", gallery: "पल", rsvp: "कृपया उत्तर दें", info: "ज़रूरी जानकारी",
  when: "कब", where: "कहाँ", directions: "रास्ता देखें", calendar: "कैलेंडर में जोड़ें", with: "स्नेह सहित", open: "खोलें", tapToOpen: "खोलने के लिए छुएँ", scroll: "नीचे देखें",
  hosted: "गोद भराई", awaiting: "तुम्हारा इंतज़ार है", hello: "स्वागत है, नन्हे", blessing: "अपना आशीर्वाद, अपनी कहानियाँ और सबसे कोमल शुभकामनाएँ लेकर आइए",
};
export const words = (p: Profile): Words => ({ en: EN, ru: RU, hi: HI })[langOf(p)];

export const isDeva = (s?: string) => !!s && /[ऀ-ॿ]/.test(s);
export const isCyr = (s?: string) => !!s && /[Ѐ-ӿ]/.test(s);

/** Fit factor for long names (Cyrillic/compound names can be long) — multiply display font sizes by it. */
export function fit(s: string, base = 9) {
  const n = [...(s || "")].length;
  return n <= base ? 1 : Math.max(0.45, base / n);
}

const DEFAULT_ITEMS: Record<Lang, { program: { title: string; detail?: string }[]; menu: { title: string; detail?: string }[] }> = {
  en: {
    program: [{ title: "Welcome", detail: "Tea, hugs and a wish for baby" }, { title: "Games", detail: "Guess the bump & baby photo match" }, { title: "Opening gifts", detail: "Every little thing, with love" }, { title: "Blessings", detail: "Words for the little one" }],
    menu: [{ title: "Little bites", detail: "Cucumber sandwiches · Mini quiches · Samosas" }, { title: "Something sweet", detail: "Lemon cake · Macarons · Bebinca" }, { title: "To sip", detail: "Rose lemonade · Masala chai · Mocktails" }],
  },
  ru: {
    program: [{ title: "Встреча гостей", detail: "Чай, объятия и пожелания малышу" }, { title: "Игры", detail: "Угадай размер животика" }, { title: "Подарки", detail: "Каждая мелочь — с любовью" }, { title: "Пожелания", detail: "Слова для малыша" }],
    menu: [{ title: "Закуски", detail: "Канапе · Тарталетки · Блины" }, { title: "Сладкое", detail: "Медовик · Макаруны · Зефир" }, { title: "Напитки", detail: "Лимонад · Чай · Морс" }],
  },
  hi: {
    program: [{ title: "स्वागत", detail: "तिलक, हल्दी-कुमकुम और मिठाई" }, { title: "गोद भराई", detail: "फल, नारियल और मेवों से गोद भरना" }, { title: "चूड़ी रस्म", detail: "हरी काँच की चूड़ियाँ" }, { title: "आशीर्वाद", detail: "बड़ों का आशीर्वाद और भोजन" }],
    menu: [{ title: "मिठाई", detail: "मोदक · लड्डू · श्रीखंड" }, { title: "भोजन", detail: "पूरन पोली · मसाले भात · कढ़ी" }, { title: "पेय", detail: "मसाला चाय · आम पन्ना" }],
  },
};
export const defaultItems = (p: Profile, which: "program" | "menu") => DEFAULT_ITEMS[langOf(p)][which];

export type CardText = {
  eyebrow: string; lead: string; headline: string; sub: string; date: string; where: string; body: string; footer: string;
  names: boolean; items: { title: string; detail?: string }[]; number: number; hashtag: string;
};

/** What each paper kind says. Couples can override via design.texts / design.items. */
export function cardText(kind: Kind, d: Design, p: Profile): CardText {
  const w = words(p);
  const date = formatDate(p.date, p.language);
  const where = [p.venue, p.city].filter(Boolean).join(", ");
  const ev = p.events?.[d.eventIndex ?? 0];
  const [a] = nameParts(p);
  const base: CardText = { eyebrow: occasionLine(p), lead: "", headline: "", sub: "", date, where, body: "", footer: p.blessing ?? "", names: true, items: [], number: d.number ?? 1, hashtag: "" };
  const c: CardText = (() => {
    switch (kind) {
      case "invite": return { ...base, lead: p.inviteLine || occasionInvite(p) };
      case "save": return { ...base, eyebrow: w.save, where: p.city || where };
      case "event": return { ...base, headline: ev?.name ?? w.hosted, date: [formatDate(ev?.date ?? p.date, p.language), ev?.time].filter(Boolean).join(" · "), where: ev?.venue || where };
      case "story": return { ...base, lead: w.babyOnWay };
      case "post": return { ...base };
      case "welcome": return { ...base, eyebrow: w.welcome, sub: occasionLine(p) };
      case "program": return { ...base, headline: w.program, names: false, items: d.items?.length ? d.items : defaultItems(p, "program") };
      case "menu": return { ...base, headline: w.menu, names: false, items: d.items?.length ? d.items : defaultItems(p, "menu") };
      case "table": return { ...base, headline: w.table, names: false, date: "", where: "" };
      case "hashtag": return { ...base, names: false, body: w.tagBody, hashtag: `#Baby${(a || "Love").split(" ")[0].replace(/[^\p{L}]/gu, "")}`, date: "" };
      case "thankyou": return { ...base, headline: w.thanks, body: w.thanksBody, names: false, date: "", where: "" };
      case "greeting": return { ...base, eyebrow: w.hello, body: p.story ?? "", date: "", where: "" };
      default: return base;
    }
  })();
  const x = d.texts ?? {};
  return { ...c, eyebrow: x.eyebrow ?? c.eyebrow, headline: x.headline ?? c.headline, body: x.body ?? c.body, footer: x.footer ?? c.footer, hashtag: x.hashtag ?? c.hashtag };
}

export const ratioOf = (kind: Kind) => KINDS[kind].ratio as string;
export const shapeOf = (kind: Kind): "portrait" | "tall" | "square" | "landscape" => {
  const r = ratioOf(kind);
  if (r === "7/5") return "landscape";
  if (r === "1/1" || r === "4/5") return "square";
  if (r === "9/16" || r === "4/9") return "tall";
  return "portrait";
};

/** Everything a Site needs, resolved once. */
export function siteData(p: Profile, d?: Design) {
  const [a, b] = nameParts(p);
  const w = words(p);
  const L = t(p.language);
  const { order, hidden } = sectionLayout(d?.sections);
  const visible = order.filter((s) => !hidden.has(s)) as SectionId[];
  const where = [p.venue, p.city].filter(Boolean).join(", ");
  const mapUrl = where ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}` : null;
  const gallery = (d?.gallery ?? []).map((k) => `/api/media?key=${encodeURIComponent(k)}`);
  const events = (p.events ?? []).filter((e) => e?.name);
  return {
    a, b, w, L, visible, where, mapUrl, gallery, events,
    date: formatDate(p.date, p.language),
    fmt: (iso?: string) => formatDate(iso, p.language),
    invite: p.inviteLine || occasionInvite(p),
    line: occasionLine(p),
    info: d?.texts?.body,
    lang: langOf(p),
  };
}
export type SiteData = ReturnType<typeof siteData>;
