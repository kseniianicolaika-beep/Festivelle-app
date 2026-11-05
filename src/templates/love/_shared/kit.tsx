"use client";
import { useEffect, useLayoutEffect, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Profile, WeddingEvent } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { designVars, type Theme } from "@/lib/themes";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { t } from "@/lib/i18n";
import { useEdit } from "@/components/designs/Editable";
import { sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";

// ── Shared primitives for the engagement ("love") bespoke templates. Each template composes its own art & layout. ──

export const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
export const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;
export type Lang = "en" | "ru" | "hi";
export const langOf = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

const COPY = {
  en: { engaged: "are engaged", engagementOf: "The engagement of", save: "Save the date", forEng: "for our engagement", weAre: "We're engaged", saidYes: "She said yes", welcome: "Welcome to the engagement of", evening: "The evening", menu: "Menu", table: "Table", share: "Share your moments", thanks: "Thank you", thanksBody: "for celebrating our engagement with us — your love made the evening", with: "With love", and: "&", tag: "Tag us", rsvpBy: "Kindly reply", chapter: "Chapter", soon: "More soon", days: "days", hrs: "hours", min: "minutes", sec: "seconds", map: "Open the map", dress: "Dress code", toWedding: "…and next, the wedding" },
  ru: { engaged: "помолвлены", engagementOf: "Помолвка", save: "Сохраните дату", forEng: "нашей помолвки", weAre: "Мы помолвлены", saidYes: "Она сказала «да»", welcome: "Добро пожаловать на помолвку", evening: "Программа вечера", menu: "Меню", table: "Стол", share: "Делитесь снимками", thanks: "Спасибо", thanksBody: "что разделили с нами радость помолвки — ваша любовь согрела этот вечер", with: "С любовью", and: "и", tag: "Отмечайте нас", rsvpBy: "Пожалуйста, ответьте", chapter: "Глава", soon: "Скоро", days: "дней", hrs: "часов", min: "минут", sec: "секунд", map: "Открыть карту", dress: "Дресс-код", toWedding: "…а дальше — свадьба" },
  hi: { engaged: "की सगाई", engagementOf: "सगाई समारोह", save: "तिथि सुरक्षित करें", forEng: "हमारी सगाई के लिए", weAre: "हमारी सगाई हो गई", saidYes: "उसने हाँ कह दी", welcome: "सगाई में आपका स्वागत है", evening: "कार्यक्रम", menu: "भोजन", table: "मेज़", share: "अपनी तस्वीरें साझा करें", thanks: "धन्यवाद", thanksBody: "हमारी सगाई की खुशियों में शामिल होने के लिए — आपके प्यार ने इस दिन को खास बनाया", with: "स्नेह सहित", and: "&", tag: "हमें टैग करें", rsvpBy: "कृपया उत्तर दें", chapter: "अध्याय", soon: "जल्द ही", days: "दिन", hrs: "घंटे", min: "मिनट", sec: "सेकंड", map: "नक्शा खोलें", dress: "परिधान", toWedding: "…और फिर, शादी" },
} as const;
export type Copy = { [K in keyof (typeof COPY)["en"]]: string };
export const copyFor = (p: Profile): Copy => COPY[langOf(p)];

export type Flavour = "western" | "indian" | "russian";
export type Item = { title: string; detail?: string };
const PROGRAMME: Record<Flavour, Record<Lang, Item[]>> = {
  western: {
    en: [{ title: "Golden hour", detail: "Welcome drinks on the terrace" }, { title: "The question, retold", detail: "A toast to how it happened" }, { title: "Supper", detail: "A long table by candlelight" }, { title: "Dancing", detail: "Until the candles give up" }],
    ru: [{ title: "Аперитив", detail: "Шампанское на террасе" }, { title: "Тосты", detail: "История одного «да»" }, { title: "Ужин", detail: "Длинный стол при свечах" }, { title: "Танцы", detail: "До последней свечи" }],
    hi: [{ title: "स्वागत पेय", detail: "शाम की सुनहरी रोशनी में" }, { title: "शुभकामनाएँ", detail: "परिवार और दोस्तों के बोल" }, { title: "रात्रिभोज", detail: "मोमबत्तियों की रोशनी में" }, { title: "नृत्य", detail: "देर रात तक" }],
  },
  indian: {
    en: [{ title: "Ganesh vandana", detail: "A quiet prayer to begin" }, { title: "Roka & tilak", detail: "The families bless the match" }, { title: "Chunni ceremony", detail: "A red chunni, wrapped with love" }, { title: "Ring exchange", detail: "Two rings, one promise" }, { title: "Lunch", detail: "The whole family, one long table" }],
    ru: [{ title: "Ганеш-вандана", detail: "Тихая молитва в начале" }, { title: "Рока и тилак", detail: "Благословение семей" }, { title: "Чунни", detail: "Красный платок с любовью" }, { title: "Обмен кольцами", detail: "Два кольца — одно обещание" }, { title: "Обед", detail: "Вся семья за одним столом" }],
    hi: [{ title: "गणेश वंदना", detail: "मंगल शुरुआत" }, { title: "रोका और तिलक", detail: "दोनों परिवारों का आशीर्वाद" }, { title: "चुन्नी की रस्म", detail: "प्यार से ओढ़ाई लाल चुन्नी" }, { title: "अंगूठी की रस्म", detail: "दो अंगूठियाँ, एक वादा" }, { title: "भोज", detail: "पूरा परिवार, एक साथ" }],
  },
  russian: {
    en: [{ title: "Aperitif", detail: "Champagne in the winter garden" }, { title: "The rings", detail: "A promise, said out loud" }, { title: "Supper", detail: "Silver, candles and toasts" }, { title: "The waltz", detail: "And dancing until late" }],
    ru: [{ title: "Аперитив", detail: "Шампанское в зимнем саду" }, { title: "Кольца", detail: "Обещание, сказанное вслух" }, { title: "Ужин", detail: "Серебро, свечи и тосты" }, { title: "Вальс", detail: "И танцы до поздней ночи" }],
    hi: [{ title: "स्वागत", detail: "विंटर गार्डन में" }, { title: "अंगूठियाँ", detail: "एक वादा" }, { title: "रात्रिभोज", detail: "मोमबत्तियों के साथ" }, { title: "वाल्ट्ज़", detail: "देर रात तक नृत्य" }],
  },
};
const MENU: Record<Flavour, Record<Lang, Item[]>> = {
  western: {
    en: [{ title: "To begin", detail: "Oysters · Burrata & heirloom tomato · Gougères" }, { title: "The main", detail: "Line-caught fish, beurre blanc · Wild mushroom risotto" }, { title: "Something sweet", detail: "Raspberry pavlova · Dark chocolate & sea salt" }],
    ru: [{ title: "Закуски", detail: "Устрицы · Буррата с томатами · Гужеры" }, { title: "Горячее", detail: "Рыба с соусом бёр-блан · Ризотто с грибами" }, { title: "Десерт", detail: "Павлова с малиной · Шоколад и морская соль" }],
    hi: [{ title: "शुरुआत", detail: "बुराटा और टमाटर · चीज़ पफ़्स" }, { title: "मुख्य भोजन", detail: "मछली, बर्र ब्लां · मशरूम रिसोट्टो" }, { title: "मीठा", detail: "रास्पबेरी पावलोवा · डार्क चॉकलेट" }],
  },
  indian: {
    en: [{ title: "Chaat counter", detail: "Pani puri · Dahi bhalla · Aloo tikki" }, { title: "The feast", detail: "Paneer makhani · Dal Bukhara · Saffron pulao · Butter naan" }, { title: "Mithai", detail: "Kesar jalebi · Rabri · Kaju katli" }],
    ru: [{ title: "Чаат", detail: "Пани-пури · Дахи-бхалла · Алу-тикки" }, { title: "Пир", detail: "Панир макхани · Дал · Шафрановый плов · Наан" }, { title: "Сладости", detail: "Джалеби · Рабри · Каджу катли" }],
    hi: [{ title: "चाट", detail: "पानी पूरी · दही भल्ला · आलू टिक्की" }, { title: "भोज", detail: "पनीर मखनी · दाल बुखारा · केसर पुलाव · बटर नान" }, { title: "मिठाई", detail: "केसर जलेबी · रबड़ी · काजू कतली" }],
  },
  russian: {
    en: [{ title: "Zakuski", detail: "Blini with caviar · Herring under a fur coat · Pirozhki" }, { title: "The main", detail: "Beef Stroganoff · Pelmeni with smetana" }, { title: "Dessert", detail: "Medovik · Bird's milk cake · Tea from the samovar" }],
    ru: [{ title: "Закуски", detail: "Блины с икрой · Сельдь под шубой · Пирожки" }, { title: "Горячее", detail: "Бефстроганов · Пельмени со сметаной" }, { title: "Десерт", detail: "Медовик · «Птичье молоко» · Чай из самовара" }],
    hi: [{ title: "ज़कूस्की", detail: "कैवियार के साथ ब्लिनी · पिरोज़्की" }, { title: "मुख्य भोजन", detail: "बीफ़ स्ट्रोगनॉफ़ · पेल्मेनी" }, { title: "मीठा", detail: "मेदोविक · समोवार की चाय" }],
  },
};

/** Every piece of text a card shows, resolved for engagement + language, with design.texts overrides. */
export type CardCopy = {
  eyebrow: string;
  headline: string;
  lead: string;
  leadPath: string;
  date: string;
  time: string;
  where: string;
  wherePath: string;
  body: string;
  footer: string;
  footerPath: string;
  items: Item[];
  number?: number;
  hashtag: string;
  event?: WeddingEvent;
};
export function cardCopy(kind: Kind, d: Design, p: Profile, flavour: Flavour = "western"): CardCopy {
  const C = copyFor(p);
  const L = langOf(p);
  const [a, b] = nameParts(p);
  const ev = p.events?.[d.eventIndex ?? 0];
  const where = p.venue || p.city || "";
  const wherePath = p.venue ? "profile.venue" : "profile.city";
  const base: CardCopy = { eyebrow: "", headline: "", lead: "", leadPath: "texts.body", date: formatDate(p.date, p.language), time: "", where, wherePath, body: "", footer: "", footerPath: "texts.footer", items: [], hashtag: "" };
  const blessing = { footer: p.blessing ?? "", footerPath: "profile.blessing" };
  const k: Partial<CardCopy> = (() => {
    switch (kind) {
      case "invite": return { eyebrow: C.engagementOf, lead: p.inviteLine || occasionInvite(p), leadPath: "profile.inviteLine", time: p.events?.[0]?.time ?? "", ...blessing };
      case "save": return { eyebrow: C.save, lead: C.forEng, where: p.city || where, wherePath: p.city ? "profile.city" : wherePath };
      case "event": return { eyebrow: C.engagementOf, headline: ev?.name ?? C.evening, date: formatDate(ev?.date ?? p.date, p.language), time: ev?.time ?? "", where: ev?.venue || where, event: ev };
      case "story": return { eyebrow: C.weAre, ...blessing };
      case "post": return { eyebrow: occasionLine(p) };
      case "welcome": return { eyebrow: C.welcome };
      case "program": return { headline: C.evening, items: d.items?.length ? d.items : PROGRAMME[flavour][L] };
      case "menu": return { headline: C.menu, items: d.items?.length ? d.items : MENU[flavour][L] };
      case "table": return { headline: C.table, number: d.number ?? 1, date: "", where: "" };
      case "hashtag": return { body: C.share, hashtag: `#${clean(a)}${b ? (L === "ru" ? "И" : "And") + clean(b) : ""}`, date: "" };
      case "thankyou": return { headline: C.thanks, body: C.thanksBody, date: "", where: "" };
      case "greeting": return { eyebrow: "", headline: C.with, body: p.story ?? "", date: "", where: "", ...blessing };
      default: return {};
    }
  })();
  const c: CardCopy = { ...base, ...k };
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
const clean = (s: string) => s.replace(/[^\p{L}\p{N}]/gu, "");

/** Theme + palette overrides. A font pairing applies only when the couple picked one different from the template's own. */
export function vars(theme: Theme, design: Design | undefined, ownFonts?: string): React.CSSProperties {
  const fonts = design?.fonts && design.fonts !== ownFonts ? design.fonts : undefined;
  return designVars(theme, { palette: design?.palette, fonts });
}

/** Ordered, visible website sections — each wrapped with data-edit-section for the studio. */
export function Sections({ design, render, className = "" }: { design?: Design; render: Partial<Record<SectionId, ReactNode>>; className?: string }) {
  const { order, hidden } = sectionLayout(design?.sections);
  return (
    <>
      {order.filter((id) => !hidden.has(id) && render[id]).map((id) => (
        <div key={id} data-section={id} data-edit-section={id} className={className}>{render[id]}</div>
      ))}
    </>
  );
}

const noop = () => () => {};
const subTick = (cb: () => void) => { const i = setInterval(cb, 1000); return () => clearInterval(i); };
/** Client-only countdown parts (null on the server so hydration never disagrees about "now"). */
export function useCountdown(date?: string, live = true) {
  const snap = useSyncExternalStore(live ? subTick : noop, () => (date ? Math.floor((new Date(date + "T17:00:00").getTime() - Date.now()) / 1000) : -1), () => null);
  if (snap === null || snap <= 0) return null;
  return { d: Math.floor(snap / 86400), h: Math.floor((snap % 86400) / 3600), m: Math.floor((snap % 3600) / 60), s: snap % 60 };
}

export const mapUrl = (p: Profile, venue?: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venue ?? p.venue, p.city].filter(Boolean).join(", "))}`;
export const labels = (p: Profile) => ({ ...t(p.language), ...copyFor(p) });

export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll choreography for a Site. Conventions inside root:
 *  [data-rv]         fade/lift/unblur when it enters (value = y offset px)
 *  [data-rv-stagger] children reveal in sequence
 *  [data-px="0.3"]   parallax drift (fraction of own height)
 *  [data-draw]       SVG strokes inside draw as you scroll past
 * `extra` adds template-specific timelines. Skipped in compact mode and for reduced motion (final states show).
 */
export function useScrollStage(root: RefObject<HTMLElement | null>, compact: boolean | undefined, extra?: (el: HTMLElement) => void) {
  useIso(() => {
    const el = root.current;
    if (!el || compact || reduced()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-rv]").forEach((n) => {
        gsap.from(n, { autoAlpha: 0, y: Number(n.dataset.rv) || 40, filter: "blur(8px)", duration: 1.3, ease: "power3.out", clearProps: "filter", scrollTrigger: { trigger: n, start: "top 88%", once: true } });
      });
      el.querySelectorAll<HTMLElement>("[data-rv-stagger]").forEach((n) => {
        gsap.from(n.children, { autoAlpha: 0, y: 36, duration: 1.1, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: n, start: "top 85%", once: true } });
      });
      el.querySelectorAll<HTMLElement>("[data-px]").forEach((n) => {
        const f = Number(n.dataset.px) || 0.2;
        gsap.fromTo(n, { yPercent: -f * 50 }, { yPercent: f * 50, ease: "none", scrollTrigger: { trigger: n.parentElement ?? n, start: "top bottom", end: "bottom top", scrub: true } });
      });
      el.querySelectorAll<SVGSVGElement>("[data-draw]").forEach((svg) => {
        const paths = svg.querySelectorAll<SVGGeometryElement>("path,line,circle,ellipse,polyline");
        paths.forEach((p) => { const len = p.getTotalLength?.() || 300; gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }); });
        gsap.to(paths, { strokeDashoffset: 0, ease: "none", stagger: 0.02, scrollTrigger: { trigger: svg, start: "top 92%", end: "bottom 45%", scrub: 1 } });
      });
      extra?.(el);
    }, el);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [compact]);
}

/** Lenis smooth scroll for published (non-compact) sites, synced with ScrollTrigger. */
export function useLenis(on: boolean) {
  useEffect(() => {
    if (!on || reduced()) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    return () => lenis.destroy();
  }, [on]);
}

export const LENIS_CSS = `html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}`;

/** Paper grain / fibres as data-URIs (no filter cost at runtime). */
export const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .33 0 0 0 0 .28 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E")`;
export const FIBRES = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012 .35' numOctaves='2' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .44 0 0 0 0 .38 0 0 0 .06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`;

/** Card shell style: aspect ratio + container queries (all card sizing is in cqw). */
export const shellStyle = (ratio: string): React.CSSProperties => ({ aspectRatio: ratio, containerType: "inline-size" });

/** Splits text into per-letter spans (per-word for Devanagari so conjuncts never break). Plain text inside the studio editor. */
export function Split({ text, cls = "ch", delay = 0, step = 0.06 }: { text: string; cls?: string; delay?: number; step?: number }) {
  const ctx = useEdit();
  if (ctx?.editable) return <>{text}</>;
  const parts = /[ऀ-ॿ]/.test(text) ? text.split(/(\s+)/) : Array.from(text);
  return (
    <>
      {parts.map((ch, i) => (ch.trim() ? <span key={i} className={cls} style={{ animationDelay: `${delay + i * step}s` }}>{ch}</span> : <span key={i}>{ch}</span>))}
    </>
  );
}

/** Size multiplier so long names (e.g. «Константин») shrink instead of breaking mid-word. */
export function fitName(a: string, b?: string, ideal = 7, inline = false) {
  const L = inline ? a.length + (b ? b.length + 3 : 0) : Math.max(a.length, b?.length ?? 0);
  return Math.min(1, (inline ? ideal * 2 : ideal) / Math.max(L, 1));
}
