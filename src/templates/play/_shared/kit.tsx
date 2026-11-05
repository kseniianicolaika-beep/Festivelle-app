"use client";
import { useEffect, useLayoutEffect, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { FONT_PAIRS, isFontPair } from "@/lib/fonts";
import { KINDS, sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import { playFontVars } from "./fonts";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, Physics2DPlugin, DrawSVGPlugin, MotionPathPlugin, CustomEase);
export { gsap, ScrollTrigger };

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** gsap.context scoped to `scope`, reverted on unmount. fn may return extra cleanup. */
export function useAnim(scope: RefObject<HTMLElement | null>, fn: (o: { reduce: boolean }) => void | (() => void), deps: unknown[] = []) {
  useIsoLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    let extra: void | (() => void);
    const ctx = gsap.context(() => {
      extra = fn({ reduce: prefersReduced() });
    }, el);
    return () => {
      if (typeof extra === "function") extra();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Smooth scroll for the full site only (never in compact previews). */
export function useLenis(on: boolean) {
  useEffect(() => {
    if (!on || prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [on]);
}

/** Bouncy scroll reveals for every [data-pop] inside the current gsap context. */
export function popOnScroll(compact?: boolean, reduce?: boolean) {
  if (compact || reduce) return;
  const items = gsap.utils.toArray<HTMLElement>("[data-pop]");
  items.forEach((el) => gsap.set(el, { autoAlpha: 0, y: 38, scale: 0.94, rotate: Number(el.dataset.pop || 0) }));
  ScrollTrigger.batch(items, {
    start: "top 90%",
    once: true,
    onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.62)", stagger: 0.09, overwrite: true }),
  });
}

// ── words ──
type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");
export const tr = (p: Profile, s: { en: string; ru: string; hi: string }) => s[langOf(p)];

const KL = {
  en: { invited: "You're invited!", party: "Party time", plan: "The party plan", about: "All about", when: "When", where: "Where", rsvp: "Will you come and play?", rsvpSub: "Tell us you're coming so we save you a slice of cake", gallery: "Snapshots", info: "Good to know", directions: "Show me the way", calendar: "Add to calendar", until: "sleeps to go", save: "Save the date", thanks: "Thank you for coming!", thanksBody: "You made my party extra special", welcome: "Welcome to the party", menu: "Party treats", program: "Party plan", table: "Table", share: "Share your photos", hello: "Happy birthday!", time: "Time", from: "from", age: "turns", years: "years old", see: "See you there!" },
  ru: { invited: "Приглашаем!", party: "Праздник", plan: "Программа праздника", about: "Немного о", when: "Когда", where: "Где", rsvp: "Придёшь на праздник?", rsvpSub: "Ответь нам — и мы оставим тебе кусочек торта", gallery: "Мгновения", info: "Важно знать", directions: "Как добраться", calendar: "В календарь", until: "дней до праздника", save: "Сохраните дату", thanks: "Спасибо, что пришли!", thanksBody: "С вами мой праздник стал волшебным", welcome: "Добро пожаловать на праздник", menu: "Угощения", program: "Программа", table: "Стол", share: "Делитесь фото", hello: "С днём рождения!", time: "Время", from: "от", age: "", years: "", see: "Ждём тебя!" },
  hi: { invited: "आप आमंत्रित हैं!", party: "पार्टी", plan: "पार्टी का कार्यक्रम", about: "कुछ बातें", when: "कब", where: "कहाँ", rsvp: "क्या आप खेलने आएँगे?", rsvpSub: "बताइए कि आप आ रहे हैं — केक का एक टुकड़ा आपके लिए", gallery: "यादें", info: "ज़रूरी जानकारी", directions: "रास्ता देखें", calendar: "कैलेंडर में जोड़ें", until: "दिन बाकी", save: "तारीख़ याद रखें", thanks: "आने के लिए धन्यवाद!", thanksBody: "आपने मेरी पार्टी को खास बना दिया", welcome: "पार्टी में स्वागत है", menu: "पार्टी के पकवान", program: "कार्यक्रम", table: "मेज़", share: "अपनी तस्वीरें साझा करें", hello: "जन्मदिन मुबारक!", time: "समय", from: "से", age: "", years: "", see: "ज़रूर आइए!" },
} as const;
export const kl = (p: Profile) => KL[langOf(p)];

export const firstName = (p: Profile) => (p.partner1 || "").trim() || (langOf(p) === "ru" ? "Именинник" : langOf(p) === "hi" ? "जन्मदिन" : "Birthday star");
export const aboutTitle = (p: Profile) => (langOf(p) === "hi" ? `${firstName(p)} के बारे में ${KL.hi.about}` : `${kl(p).about} ${firstName(p)}`);

export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;
export const mapUrl = (p: Profile) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.venue, p.city].filter(Boolean).join(", "))}`;

/** Days until the party, client-only (no hydration mismatch). */
const noop = () => () => {};
export function useDaysToGo(date?: string) {
  return useSyncExternalStore(noop, () => (date ? Math.ceil((new Date(date + "T12:00:00").getTime() - Date.now()) / 864e5) : null), () => null);
}

/** Template palette + fonts, overridable by design.palette / a non-default design.fonts. */
export function worldVars(design: Design | undefined, own: Record<string, string> & { bg: string; ink: string; accent: string; display: string; body: string }): CSSProperties {
  const hex = (c?: string) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined);
  const p = design?.palette;
  const f = design?.fonts && design.fonts !== "playful" && isFontPair(design.fonts) ? FONT_PAIRS[design.fonts] : null;
  const v: Record<string, string> = {};
  for (const [k, val] of Object.entries(own)) v[`--w-${k}`] = val;
  v["--w-bg"] = hex(p?.bg) ?? own.bg;
  v["--w-ink"] = hex(p?.ink) ?? own.ink;
  v["--w-accent"] = hex(p?.accent) ?? own.accent;
  v["--w-display"] = f ? f.display : own.display;
  v["--w-body"] = f ? f.body : own.body;
  return v as CSSProperties;
}
export const fontClass = playFontVars;

// Paper grain — one cheap tiled noise layer, never a live filter.
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .28 0 0 0 0 .22 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
export function Grain({ opacity = 0.35, blend = "multiply", className = "" }: { opacity?: number; blend?: CSSProperties["mixBlendMode"]; className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute inset-0 z-[60] ${className}`} style={{ backgroundImage: NOISE, opacity, mixBlendMode: blend }} />;
}

/** Ordered visible sections. */
export function orderedSections(design?: Design) {
  const { order, hidden } = sectionLayout(design?.sections);
  return order.filter((s) => !hidden.has(s));
}
export function Sec({ id, className = "", style, children }: { id: SectionId; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <section data-edit-section={id} id={`s-${id}`} className={`relative ${className}`} style={style}>
      {children}
    </section>
  );
}

export const fmtDate = (p: Profile, d?: string) => formatDate(d ?? p.date, p.language);
export function dateBits(p: Profile, d?: string) {
  const iso = d ?? p.date;
  if (!iso) return null;
  const x = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(x.getTime())) return null;
  const loc = langOf(p) === "ru" ? "ru-RU" : langOf(p) === "hi" ? "hi-IN" : "en-GB";
  return {
    day: x.getUTCDate(),
    month: x.toLocaleDateString(loc, { month: "long", timeZone: "UTC" }),
    monthShort: x.toLocaleDateString(loc, { month: "short", timeZone: "UTC" }).replace(".", ""),
    weekday: x.toLocaleDateString(loc, { weekday: "long", timeZone: "UTC" }),
    year: x.getUTCFullYear(),
  };
}

// ── card content ──
export type Line = { text: string; path?: string };
export type CardText = {
  eyebrow?: Line; name: Line; line?: Line; lead?: Line; headline?: Line; body?: Line; footer?: Line; hashtag?: Line;
  date?: string; time?: string; where?: Line; city?: string; items: { title: string; detail?: string }[]; number?: number; mode: "names" | "list" | "number" | "hashtag" | "thanks" | "greeting";
};
const WEDDING_THANKS = /beginning of our forever|самый счастливый день/i;
const kidMenu = (p: Profile) =>
  langOf(p) === "ru"
    ? [{ title: "Мини-пицца", detail: "и овощи-смешарики" }, { title: "Фруктовые шпажки", detail: "клубника · дыня · виноград" }, { title: "Праздничный торт", detail: "со свечами и желанием" }, { title: "Лимонад", detail: "розовый и пузырчатый" }]
    : langOf(p) === "hi"
      ? [{ title: "मिनी पिज़्ज़ा", detail: "और रंग-बिरंगे सैंडविच" }, { title: "फलों की सीख", detail: "आम · अंगूर · तरबूज़" }, { title: "जन्मदिन का केक", detail: "मोमबत्तियों और एक इच्छा के साथ" }, { title: "नींबू पानी", detail: "ठंडा और मीठा" }]
      : [{ title: "Mini pizzas", detail: "and rainbow sandwiches" }, { title: "Fruit wands", detail: "strawberry · melon · grape" }, { title: "The birthday cake", detail: "with candles and a wish" }, { title: "Pink lemonade", detail: "fizzy and very cold" }];
const isWeddingItems = (items?: { title: string }[]) => !!items?.some((i) => /processional|vows|baraat|pheras|выкуп|регистрация|paneer tikka|goan fish curry|закуски/i.test(i.title));

export function cardText(kind: Kind, d: Design, p: Profile): CardText {
  const L = kl(p);
  const x = d.texts ?? {};
  const name: Line = { text: firstName(p), path: "profile.partner1" };
  const where: Line | undefined = p.venue || p.city ? { text: p.venue || p.city || "", path: p.venue ? "profile.venue" : "profile.city" } : undefined;
  const ev = p.events?.[d.eventIndex ?? 0];
  const T = (k: "eyebrow" | "headline" | "body" | "footer" | "hashtag", fallback?: string): Line | undefined => (x[k] ?? fallback) ? { text: (x[k] ?? fallback)!, path: `texts.${k}` } : undefined;
  const base: CardText = { name, items: [], mode: "names", date: fmtDate(p), time: p.events?.[0]?.time, where, city: p.venue ? p.city : undefined, line: { text: occasionLine(p) } };
  const evItems = (p.events ?? []).map((e) => ({ title: e.name, detail: e.time }));
  switch (kind) {
    case "invite":
      return { ...base, eyebrow: T("eyebrow", L.invited), lead: { text: p.inviteLine || occasionInvite(p), path: "profile.inviteLine" }, footer: x.footer ? T("footer") : p.blessing ? { text: p.blessing, path: "profile.blessing" } : undefined };
    case "save":
      return { ...base, eyebrow: T("eyebrow", L.save), footer: T("footer") };
    case "event":
      return { ...base, eyebrow: T("eyebrow", L.invited), headline: T("headline", ev?.name ?? L.party), date: fmtDate(p, ev?.date), time: ev?.time, where: ev?.venue ? { text: ev.venue } : where };
    case "story":
      return { ...base, eyebrow: T("eyebrow", L.invited), footer: T("footer", L.see) };
    case "post":
      return { ...base, eyebrow: T("eyebrow", L.save) };
    case "welcome":
      return { ...base, eyebrow: T("eyebrow", L.welcome) };
    case "program":
      return { ...base, mode: "list", headline: T("headline", L.program), items: d.items?.length && !isWeddingItems(d.items) ? d.items : evItems };
    case "menu":
      return { ...base, mode: "list", headline: T("headline", L.menu), items: d.items?.length && !isWeddingItems(d.items) ? d.items : kidMenu(p) };
    case "table":
      return { ...base, mode: "number", headline: T("headline", L.table), number: d.number ?? 1 };
    case "hashtag": {
      const tag = x.hashtag ?? `#${firstName(p).replace(/\s+/g, "")}${p.age ? (langOf(p) === "ru" ? p.age : `Turns${p.age}`) : "Party"}`;
      return { ...base, mode: "hashtag", hashtag: { text: tag, path: "texts.hashtag" }, body: T("body", L.share) };
    }
    case "thankyou": {
      const body = x.body && !WEDDING_THANKS.test(x.body) ? x.body : L.thanksBody;
      const head = x.headline && !/^(thank you|спасибо|धन्यवाद)$/i.test(x.headline.trim()) ? x.headline : L.thanks;
      return { ...base, mode: "thanks", headline: { text: head, path: "texts.headline" }, body: { text: body, path: "texts.body" } };
    }
    case "greeting":
      return { ...base, mode: "greeting", headline: T("headline", L.hello), body: p.story ? { text: p.story, path: "profile.story" } : undefined, footer: p.blessing ? { text: p.blessing, path: "profile.blessing" } : undefined };
    default:
      return base;
  }
}
export const ratioOf = (k: Kind) => {
  const r = KINDS[k]?.ratio ?? "5/7";
  return r === "web" ? "5/7" : r;
};
export const ratioNum = (k: Kind) => {
  const [a, b] = ratioOf(k).split("/").map(Number);
  return a / b;
};
/** Card shape bucket: tall (story/menu), wide (thankyou), square (post/table/hashtag), portrait (rest). */
export const shapeOf = (k: Kind): "tall" | "wide" | "square" | "portrait" => {
  const r = ratioNum(k);
  return r < 0.6 ? "tall" : r > 1.2 ? "wide" : r > 0.78 ? "square" : "portrait";
};

/** A seeded random so SSR + client agree. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Grapheme segments for animation, or null when it must stay whole (Devanagari, editing). */
export function segments(text: string, editable?: boolean): string[] | null {
  if (editable || /[\u0900-\u097F]/.test(text)) return null;
  return typeof Intl !== "undefined" && "Segmenter" in Intl ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((s) => s.segment) : [...text];
}

/** Splits text into animatable glyph spans (.ch) — whole words for Devanagari, never while editing. */
export function glyphs(text: string, editable?: boolean): ReactNode {
  if (editable) return text;
  const seg = segments(text);
  if (!seg) return text.split(/(\s+)/).map((w, i) => (/^\s+$/.test(w) ? w : <span key={i} className="ch inline-block">{w}</span>));
  return seg.map((c, i) => <span key={i} className="ch inline-block" style={{ whiteSpace: "pre" }}>{c}</span>);
}
