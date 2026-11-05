"use client";
import { useEffect, useId, useLayoutEffect, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";
import { FONT_PAIRS, isFontPair } from "@/lib/fonts";
import { templateById } from "@/lib/catalog";
import { KINDS, sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";
import { FONT_CLASS } from "./fonts";

export { gsap, ScrollTrigger, SplitText };

let registered = false;
export function gsapReady() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
    gsap.config({ nullTargetWarn: false });
    registered = true;
  }
  return gsap;
}
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Q = (s: string) => Element[];
/** gsap.context bound to `scope`; skipped when disabled or reduced-motion (markup already shows the final state). */
export function useStage(scope: RefObject<HTMLElement | null>, setup: (g: typeof gsap, q: Q, el: HTMLElement) => void | (() => void), deps: unknown[], enabled = true) {
  useIso(() => {
    const el = scope.current;
    if (!enabled || !el || prefersReduced()) return;
    gsapReady();
    let extra: void | (() => void);
    const ctx = gsap.context(() => { extra = setup(gsap, gsap.utils.selector(el), el); }, el);
    return () => { extra?.(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Lenis smooth scroll synced to ScrollTrigger (published site only). */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReduced()) return;
    gsapReady();
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, [enabled]);
}

const every30s = (cb: () => void) => { const i = setInterval(cb, 30000); return () => clearInterval(i); };
/** Days/hours/minutes until the date (client only; null on the server or once it has passed). */
export function useUntil(date?: string) {
  const mins = useSyncExternalStore(every30s, () => (date ? Math.floor((new Date(date + "T00:00:00").getTime() - Date.now()) / 60000) : null), () => null);
  if (mins == null || Number.isNaN(mins) || mins <= 0) return null;
  return { d: Math.floor(mins / 1440), h: Math.floor((mins % 1440) / 60), m: mins % 60 };
}

/** Ordered, hideable website sections with the editor hooks the studio needs. */
export function Sections({ design, map }: { design?: Design; map: Partial<Record<SectionId, ReactNode>> }) {
  const { order, hidden } = sectionLayout(design?.sections);
  return <>{order.filter((id) => !hidden.has(id) && map[id]).map((id) => <div key={id} data-section={id} data-edit-section={id}>{map[id]}</div>)}</>;
}

export type Look = { bg: string; surface: string; ink: string; muted: string; accent: string; gold: string; foilA: string; foilB: string; display: string; script: string; body: string };

/** Root CSS variables: the template's own look, with design.palette / a non-default design.fonts honoured.
 *  Also feeds the shared --t-* / --f-* vars so the RSVP form and .display/.script classes match. */
export function lookStyle(look: Look, design: Design | undefined, templateId: string): CSSProperties {
  const hex = (c?: string) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined);
  const p = design?.palette;
  const bg = hex(p?.bg) ?? look.bg;
  const ink = hex(p?.ink) ?? look.ink;
  const accent = hex(p?.accent) ?? look.accent;
  const own = templateById(templateId)?.fonts;
  const pair = design?.fonts && design.fonts !== own && isFontPair(design.fonts) ? FONT_PAIRS[design.fonts] : null;
  const display = pair?.display ?? look.display;
  const script = pair?.script ?? look.script;
  const body = pair?.body ?? look.body;
  return {
    "--t-bg": bg, "--t-surface": hex(p?.bg) ?? look.surface, "--t-ink": ink, "--t-muted": look.muted, "--t-accent": accent, "--t-gold": look.gold,
    "--foil-a": look.foilA, "--foil-b": look.foilB,
    "--f-display": display, "--f-script": script, "--f-body": body,
    "--wd": display, "--ws": script, "--wbody": body,
    background: bg, color: ink, fontFamily: body,
  } as CSSProperties;
}
export const fontClass = FONT_CLASS;

/** A paper piece: fills its container width at the kind's aspect ratio; 1cqw = 1% of card width. */
export function CardShell({ kind, style, className = "", children, lang, innerRef }: { kind: Kind; style?: CSSProperties; className?: string; children: ReactNode; lang?: string; innerRef?: RefObject<HTMLDivElement | null> }) {
  const r = KINDS[kind].ratio;
  return (
    <div ref={innerRef} lang={lang} className={`${FONT_CLASS} relative w-full select-none overflow-hidden ${className}`} style={{ aspectRatio: r === "web" ? "5 / 7" : r.replace("/", " / "), containerType: "inline-size", ...style }}>
      {children}
    </div>
  );
}
export const ratioOf = (kind: Kind) => { const r = KINDS[kind].ratio; if (r === "web") return 1.4; const [w, h] = r.split("/").map(Number); return h / w; };

/** Fine paper grain as a tiling SVG (multiply over light stock, screen over dark). */
export const grain = (alpha = 0.35, freq = 0.85) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 ${alpha} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`;

/** Fibrous cotton-paper texture (longer fibres). */
export const fibres = (alpha = 0.18) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.18' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.35  0 0 0 ${alpha} -0.02'/></filter><rect width='100%' height='100%' filter='url(#f)'/></svg>`)}")`;

/** SVG-safe unique id (for gradients/filters/clipPaths; several cards can share one page). */
export const useGid = (p = "g") => p + useId().replace(/[^a-zA-Z0-9_-]/g, "");

/** Font size (in the caller's unit) that keeps a name of this length inside `avail` units of width. */
export const fit = (text: string, base: number, avail: number, perChar = 0.62) => Math.min(base, avail / Math.max(1, [...text].length * perChar));

/** Template stylesheet, hoisted and de-duplicated by React (CSS modules are disabled in this project's Turbopack config). */
export const StyleTag = ({ id, css }: { id: string; css: string }) => <style href={id} precedence="medium">{css}</style>;
