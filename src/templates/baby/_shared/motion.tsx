"use client";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Motion primitives for the baby group. Openings run as CSS keyframes (they start from the SSR paint, so no
// flash and no hydration wait); scroll storytelling below the fold runs on GSAP + ScrollTrigger (+ Lenis).
let registered = false;
export function gsapReady() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
    registered = true;
  }
  return gsap;
}
export { gsap, ScrollTrigger, SplitText };

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scoped GSAP context; skipped entirely (final states stay) when disabled or reduced motion. */
export function useStory(scope: RefObject<HTMLElement | null>, build: (g: typeof gsap, root: HTMLElement) => void, enabled = true) {
  const fn = useRef(build);
  fn.current = build;
  useIso(() => {
    const root = scope.current;
    if (!root || !enabled || reducedMotion()) return;
    const g = gsapReady();
    const ctx = g.context(() => fn.current(g, root), root);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(id); ctx.revert(); };
  }, [enabled]);
}

/** Lenis smooth scroll for the published site only (never in compact/studio previews). */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || reducedMotion()) return;
    let off = () => {};
    let alive = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      const g = gsapReady();
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      g.ticker.add(tick);
      g.ticker.lagSmoothing(0);
      off = () => { g.ticker.remove(tick); lenis.destroy(); };
    });
    return () => { alive = false; off(); };
  }, [enabled]);
}

/** Days until an ISO date, computed after mount (no hydration mismatch). */
export function useDaysUntil(iso?: string) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!iso) return;
    const d = new Date(iso + "T12:00:00Z").getTime();
    if (Number.isNaN(d)) return;
    const f = () => setN(Math.max(0, Math.ceil((d - Date.now()) / 864e5)));
    f();
    const id = setInterval(f, 36e5);
    return () => clearInterval(id);
  }, [iso]);
  return n;
}

/** Reveal-on-scroll helper used inside useStory builders. */
export function rise(g: typeof gsap, targets: gsap.TweenTarget, trigger: Element | string, opts: gsap.TweenVars = {}) {
  return g.from(targets, { y: 40, opacity: 0, filter: "blur(6px)", duration: 1.2, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger, start: "top 82%", once: true }, ...opts });
}
