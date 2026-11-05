"use client";
import { Fragment, useEffect, useLayoutEffect, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { FONT_PAIRS, isFontPair } from "@/lib/fonts";
import { KINDS, sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";

export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");
export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;

// ── Words for the anniversary collection (EN / RU / HI) ──
const W = {
  en: { years: "years", together: "together", since: "since", then: "Then", now: "Now", story: "Our story", events: "The evening", details: "The details", when: "When", where: "Where", venue: "The venue", directions: "Get directions", calendar: "Add to calendar", gallery: "Through the years", info: "Good to know", rsvp: "Kindly reply", reply: "Will you raise a glass with us?", days: "days to go", save: "Save the date", invite: "You are invited", join: "invite you to", welcome: "Welcome to the anniversary of", program: "Order of the evening", menu: "Menu", table: "Table", share: "Share your moments", thanks: "Thank you", thanksBody: "for being part of our story — then, now and always", anniversary: "Anniversary", married: "Married", chapter: "Chapter", open: "Open", scroll: "Scroll", happy: "Happy anniversary", forever: "and the story goes on" },
  ru: { years: "лет", together: "вместе", since: "с", then: "Тогда", now: "Сейчас", story: "Наша история", events: "Программа вечера", details: "Подробности", when: "Когда", where: "Где", venue: "Место", directions: "Как добраться", calendar: "Добавить в календарь", gallery: "Сквозь годы", info: "Важно знать", rsvp: "Пожалуйста, ответьте", reply: "Поднимете бокал вместе с нами?", days: "дней осталось", save: "Сохраните дату", invite: "Приглашение", join: "приглашают вас на", welcome: "Добро пожаловать на годовщину", program: "Программа вечера", menu: "Меню", table: "Стол", share: "Делитесь снимками", thanks: "Спасибо", thanksBody: "что вы — часть нашей истории: тогда, сейчас и всегда", anniversary: "Годовщина", married: "Вместе с", chapter: "Глава", open: "Открыть", scroll: "Листайте", happy: "С годовщиной", forever: "и история продолжается" },
  hi: { years: "वर्ष", together: "साथ", since: "से", then: "तब", now: "अब", story: "हमारी कहानी", events: "शाम का कार्यक्रम", details: "विवरण", when: "कब", where: "कहाँ", venue: "स्थान", directions: "रास्ता देखें", calendar: "कैलेंडर में जोड़ें", gallery: "सालों के पल", info: "ज़रूरी जानकारी", rsvp: "कृपया उत्तर दें", reply: "क्या आप हमारे साथ जश्न मनाएँगे?", days: "दिन शेष", save: "तिथि सुरक्षित करें", invite: "आप आमंत्रित हैं", join: "आपको आमंत्रित करते हैं", welcome: "वर्षगांठ समारोह में आपका स्वागत है", program: "शाम का कार्यक्रम", menu: "भोजन", table: "मेज़", share: "अपनी तस्वीरें साझा करें", thanks: "धन्यवाद", thanksBody: "हमारी कहानी का हिस्सा बनने के लिए — तब, अब और हमेशा", anniversary: "वर्षगांठ", married: "विवाह", chapter: "अध्याय", open: "खोलें", scroll: "नीचे देखें", happy: "वर्षगांठ मुबारक", forever: "और कहानी चलती रहे" },
} as const;
export type Words = (typeof W)["en"];
export const words = (p: Profile): Words => W[langOf(p)] as Words;

/** Russian plural for years: 1 год, 2–4 года, 5+ лет. */
export function yearsWord(n: number | undefined, lang: Lang) {
  if (lang === "ru") {
    const m10 = (n ?? 0) % 10, m100 = (n ?? 0) % 100;
    return m10 === 1 && m100 !== 11 ? "год" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "года" : "лет";
  }
  return lang === "hi" ? "वर्ष" : n === 1 ? "year" : "years";
}

const DEVA_DIGITS = "०१२३४५६७८९";
/** Devanagari numerals for HI when asked (royal templates), else plain. */
export const numeral = (n: number | string, lang: Lang, deva = false) => (deva && lang === "hi" ? String(n).replace(/\d/g, (d) => DEVA_DIGITS[+d]) : String(n));

const MILESTONES: Record<number, [string, string, string]> = {
  1: ["The Paper Anniversary", "Ситцевая свадьба", "पहली वर्षगांठ"],
  5: ["The Wooden Anniversary", "Деревянная свадьба", "पाँचवीं वर्षगांठ"],
  10: ["The Tin Anniversary", "Оловянная свадьба", "दसवीं वर्षगांठ"],
  15: ["The Crystal Anniversary", "Хрустальная свадьба", "स्फटिक वर्षगांठ"],
  20: ["The China Anniversary", "Фарфоровая свадьба", "बीसवीं वर्षगांठ"],
  25: ["The Silver Anniversary", "Серебряная свадьба", "रजत जयंती"],
  30: ["The Pearl Anniversary", "Жемчужная свадьба", "मोती वर्षगांठ"],
  35: ["The Coral Anniversary", "Коралловая свадьба", "मूँगा वर्षगांठ"],
  40: ["The Ruby Anniversary", "Рубиновая свадьба", "माणिक वर्षगांठ"],
  45: ["The Sapphire Anniversary", "Сапфировая свадьба", "नीलम वर्षगांठ"],
  50: ["The Golden Anniversary", "Золотая свадьба", "स्वर्ण जयंती"],
  55: ["The Emerald Anniversary", "Изумрудная свадьба", "पन्ना वर्षगांठ"],
  60: ["The Diamond Anniversary", "Бриллиантовая свадьба", "हीरक जयंती"],
};
export function milestone(age: number | undefined, lang: Lang) {
  const m = age ? MILESTONES[age] : undefined;
  return m ? m[lang === "ru" ? 1 : lang === "hi" ? 2 : 0] : W[lang].anniversary;
}

/** Everything a template needs to say, resolved once. */
export function useAnniv(profile: Profile, design?: Design) {
  const lang = langOf(profile);
  const L = words(profile);
  const [a, b] = nameParts(profile);
  const age = profile.age && profile.age > 0 ? profile.age : undefined;
  const d = profile.date ? new Date(profile.date + "T12:00:00Z") : null;
  const year = d && !Number.isNaN(d.getTime()) ? d.getUTCFullYear() : undefined;
  const since = year && age ? year - age : undefined;
  const where = profile.venue || profile.city || "";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([profile.venue, profile.city].filter(Boolean).join(", "))}`;
  const dd = d && year ? `${String(d.getUTCDate()).padStart(2, "0")} · ${String(d.getUTCMonth() + 1).padStart(2, "0")} · ${year}` : "";
  return {
    lang, L, a, b, age, year, since, where, mapUrl, dateNum: dd,
    date: formatDate(profile.date, profile.language),
    line: occasionLine(profile),
    invite: profile.inviteLine || occasionInvite(profile),
    milestone: milestone(age, lang),
    gallery: design?.gallery ?? [],
    events: profile.events ?? [],
    info: design?.texts?.body,
    initials: b ? `${a[0] ?? ""}${b[0] ?? ""}` : a[0] ?? "",
  };
}
export type Anniv = ReturnType<typeof useAnniv>;

/** Card copy per kind — anniversary wording, overridable through design.texts. */
export function cardText(kind: Kind, d: Design, p: Profile) {
  const L = words(p);
  const lang = langOf(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const date = formatDate(p.date, p.language);
  const where = p.venue || p.city || "";
  const base = { eyebrow: "", lead: "", headline: "", names: true, sub: "", date, where, body: "", footer: "", items: d.items ?? [], number: undefined as number | undefined, hashtag: "" };
  const [a, b] = nameParts(p);
  const c = (() => {
    switch (kind) {
      case "invite": return { ...base, eyebrow: milestone(p.age, lang), lead: p.inviteLine || occasionInvite(p), sub: occasionLine(p), footer: p.blessing ?? "" };
      case "save": return { ...base, eyebrow: L.save, sub: occasionLine(p), where: p.city || where };
      case "event": return { ...base, lead: L.join, headline: ev?.name ?? L.anniversary, date: [formatDate(ev?.date ?? p.date, p.language), ev?.time].filter(Boolean).join(" · "), where: ev?.venue || where };
      case "story": return { ...base, eyebrow: milestone(p.age, lang), sub: occasionLine(p), footer: p.blessing ?? "" };
      case "post": return { ...base, eyebrow: milestone(p.age, lang), sub: occasionLine(p) };
      case "welcome": return { ...base, eyebrow: L.welcome };
      case "program": return { ...base, headline: L.program, names: false, items: d.items?.length ? d.items : PROGRAM[lang] };
      case "menu": return { ...base, headline: L.menu, names: false, items: d.items?.length ? d.items : MENU[lang] };
      case "table": return { ...base, headline: L.table, names: false, number: d.number ?? 1, date: "", where: "" };
      case "hashtag": return { ...base, hashtag: `#${a.split(" ")[0]}${b ? (lang === "ru" ? "И" : "And") + b.split(" ")[0] : ""}${p.age ?? ""}`, body: L.share, names: false, date: "", where: "" };
      case "thankyou": return { ...base, headline: L.thanks, names: false, body: L.thanksBody, date: "" };
      case "greeting": return { ...base, eyebrow: L.happy, body: p.story ?? "", footer: p.blessing ?? "", date: "", where: "" };
      default: return base;
    }
  })();
  const x = d.texts ?? {};
  return { ...c, eyebrow: x.eyebrow ?? c.eyebrow, headline: x.headline ?? c.headline, body: x.body ?? c.body, footer: x.footer ?? c.footer, hashtag: x.hashtag ?? c.hashtag };
}
export type CardText = ReturnType<typeof cardText>;
/** Which path the footer line edits. */
export const footerPath = (kind: Kind, d: Design) => (d.texts?.footer === undefined && (kind === "invite" || kind === "story" || kind === "greeting") ? "profile.blessing" : "texts.footer");
export const bodyPath = (kind: Kind, d: Design) => (kind === "greeting" && d.texts?.body === undefined ? "profile.story" : "texts.body");

const MENU: Record<Lang, { title: string; detail?: string }[]> = {
  en: [{ title: "To begin", detail: "Prawn rissoles · Burrata, fig & honey" }, { title: "From the year we met", detail: "Her mother's chicken cafreal · Saffron pulao" }, { title: "The main affair", detail: "Slow-roasted lamb · Goan fish curry · Dal makhani" }, { title: "Something sweet", detail: "Bebinca · A replica of the wedding cake" }],
  ru: [{ title: "Закуски", detail: "Блины с икрой · Сырная тарелка" }, { title: "Из года нашей встречи", detail: "Мамин оливье · Пирожки с капустой" }, { title: "Горячее", detail: "Утка с яблоками · Гоанское рыбное карри" }, { title: "Десерт", detail: "Медовик · Копия нашего свадебного торта" }],
  hi: [{ title: "शुरुआत", detail: "पनीर टिक्का · झींगा कटलेट" }, { title: "जिस साल हम मिले", detail: "माँ की रेसिपी · केसर पुलाव" }, { title: "मुख्य भोज", detail: "दाल मखनी · गोवन फ़िश करी" }, { title: "कुछ मीठा", detail: "बेबिंका · गुलाब जामुन" }],
};
const PROGRAM: Record<Lang, { title: string; detail?: string }[]> = {
  en: [{ title: "Welcome toast", detail: "Champagne as the sun goes down" }, { title: "Renewal of vows", detail: "The same promise, all these years later" }, { title: "Dinner", detail: "Stories, speeches and a long table" }, { title: "The first dance — again", detail: "Their song, then everyone's" }],
  ru: [{ title: "Приветственный тост", detail: "Шампанское на закате" }, { title: "Обновление клятв", detail: "То же обещание — спустя годы" }, { title: "Ужин", detail: "Истории, тосты и длинный стол" }, { title: "Первый танец — снова", detail: "Их песня, а потом — для всех" }],
  hi: [{ title: "स्वागत", detail: "ढलते सूरज के साथ" }, { title: "वचनों का नवीनीकरण", detail: "वही वादा, इतने वर्षों बाद" }, { title: "रात्रि भोज", detail: "कहानियाँ, शुभकामनाएँ और लंबी मेज़" }, { title: "पहला नृत्य — फिर से", detail: "उनका गीत, फिर सबका" }],
};

export const ratioOf = (kind: Kind) => KINDS[kind].ratio as string;
/** portrait (5/7, 2/3, 4/5) · tall (9/16, 4/9) · square · wide (7/5) */
export function shapeOf(kind: Kind): "portrait" | "tall" | "square" | "wide" {
  const r = ratioOf(kind);
  return r === "9/16" || r === "4/9" ? "tall" : r === "1/1" ? "square" : r === "7/5" ? "wide" : "portrait";
}

// ── Theming: fonts + palette (design overrides win) ──
type Faces = { display: string; script: string; body: string; label?: string };
export function faceVars(design: Design | undefined, defaultPair: string, mine: Faces): CSSProperties {
  const f = design?.fonts && design.fonts !== defaultPair && isFontPair(design.fonts) ? FONT_PAIRS[design.fonts] : null;
  const deva = ", var(--font-deva)";
  const s = f ? { display: f.display + deva, script: f.script + deva, body: f.body + deva, label: f.body + deva } : { ...mine, label: mine.label ?? mine.body };
  return { "--a-display": s.display, "--a-script": s.script, "--a-body": s.body, "--a-label": s.label } as CSSProperties;
}
const hex = (c?: string) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined);
export function paletteVars(design: Design | undefined, def: { bg: string; ink: string; accent: string } & Record<string, string>): CSSProperties {
  const p = design?.palette;
  const v: Record<string, string> = {};
  for (const [k, val] of Object.entries(def)) v[`--a-${k}`] = val;
  if (hex(p?.bg)) v["--a-bg"] = p!.bg!;
  if (hex(p?.ink)) v["--a-ink"] = p!.ink!;
  if (hex(p?.accent)) v["--a-accent"] = p!.accent!;
  return v as CSSProperties;
}

// ── Motion ──
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
let registered = false;
export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** gsap.context scoped to `scope`; skipped when disabled or reduced-motion; reverted on unmount. */
export function useMotion(scope: RefObject<HTMLElement | null>, enabled: boolean, setup: (g: typeof gsap) => void | (() => void)) {
  useIso(() => {
    if (!enabled || !scope.current || reduced()) return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText); registered = true; }
    let extra: void | (() => void);
    const ctx = gsap.context(() => { extra = setup(gsap); }, scope);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(t); if (typeof extra === "function") extra(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
export { gsap, ScrollTrigger, SplitText };

/** Default scroll choreography: [data-rise] fade-up, [data-draw] path drawing, [data-stagger] children cascade. */
export function standardReveals(g: typeof gsap) {
  g.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
    g.from(el, { autoAlpha: 0, y: 46, filter: "blur(6px)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  g.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
    g.from(el.children, { autoAlpha: 0, y: 34, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  g.utils.toArray<SVGGeometryElement>("[data-draw] path, [data-draw] line, [data-draw] circle, [data-draw] ellipse, [data-draw] polyline").forEach((el) => {
    const host = el.closest("[data-draw]") as Element;
    g.from(el, { drawSVG: "0%", duration: 2.4, ease: "power2.inOut", scrollTrigger: { trigger: host, start: "top 85%", once: true } });
  });
}

/** Lenis smooth scrolling (published site only), wired to ScrollTrigger. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || reduced()) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, [enabled]);
}

const noop = () => () => {};
/** Days until the date — client only (no hydration mismatch). */
export function useDaysLeft(date?: string) {
  return useSyncExternalStore(noop, () => (date ? Math.ceil((new Date(date + "T12:00:00").getTime() - Date.now()) / 864e5) : null), () => null);
}

/** Render website sections in the couple's order, skipping hidden/empty ones. */
export function Sections({ design, render, wrap }: { design?: Design; render: Partial<Record<SectionId, ReactNode>>; wrap?: (id: SectionId, node: ReactNode, i: number) => ReactNode }) {
  const { order, hidden } = sectionLayout(design?.sections);
  let i = 0;
  return (
    <>
      {order.filter((id) => !hidden.has(id) && render[id]).map((id) => {
        const node = <div key={id} data-section={id} data-edit-section={id}>{render[id]}</div>;
        return <Fragment key={id}>{wrap ? wrap(id, node, i++) : node}</Fragment>;
      })}
    </>
  );
}

/** Cotton-paper grain: fractal noise as an overlay (cheap, static). */
export function Grain({ opacity = 0.35, blend = "multiply", freq = 0.85, className = "" }: { opacity?: number; blend?: CSSProperties["mixBlendMode"]; freq?: number; className?: string }) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.35  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={{ backgroundImage: `url("data:image/svg+xml;utf8,${svg.replace(/#/g, "%23").replace(/"/g, "'")}")`, opacity, mixBlendMode: blend }} />;
}

/** Hero/photo with an editable photo slot, or artwork fallback. */
export function Photo({ src, slot = "hero", galleryKey, className = "", style, fallback, alt = "" }: { src?: string | null; slot?: "hero" | "photo" | "gallery"; galleryKey?: string; className?: string; style?: CSSProperties; fallback?: ReactNode; alt?: string }) {
  if (!src) return <div data-edit-photo={slot} className={className} style={style}>{fallback}</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img data-edit-photo={slot} data-gallery-key={galleryKey} src={src} alt={alt} className={className} style={style} draggable={false} />;
}
