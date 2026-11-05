"use client";
import { useEffect, useLayoutEffect, useState, useSyncExternalStore, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
let registered = false;
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase);
    registered = true;
  }
  return gsap;
}
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type SceneKit = { gsap: typeof gsap; ST: typeof ScrollTrigger; Split: typeof SplitText; root: HTMLElement; q: (sel: string) => HTMLElement[] };

/**
 * Runs a gsap scene scoped to `ref`, cleaned up on unmount. Elements marked [data-in] are hidden by CSS
 * (only while the root still has .wa-pre and motion is allowed) so there is no flash before the intro runs.
 * Returns `ready` – put `wa-pre` on the root while !ready.
 */
export function useScene(ref: RefObject<HTMLElement | null>, build: (k: SceneKit) => void, deps: unknown[], enabled = true) {
  const [ready, setReady] = useState(false);
  useIso(() => {
    const root = ref.current;
    if (!root) return;
    if (!enabled || reducedMotion()) { setReady(true); return; }
    ensureGsap();
    const ctx = gsap.context(() => build({ gsap, ST: ScrollTrigger, Split: SplitText, root, q: (s) => Array.from(root.querySelectorAll<HTMLElement>(s)) }), root);
    setReady(true);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ready;
}

/** Lenis smooth scrolling wired into ScrollTrigger (full sites only). */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || reducedMotion()) return;
    ensureGsap();
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, [enabled]);
}

const noop = () => () => {};
/** Days until the date — client only so SSR and hydration agree. */
export function useDaysLeft(iso?: string) {
  return useSyncExternalStore(noop, () => (iso ? Math.ceil((new Date(iso + "T12:00:00Z").getTime() - Date.now()) / 864e5) : null), () => null);
}

/** Standard scroll reveal for [data-reveal] children (skip it in compact previews). */
export function revealOnScroll(k: SceneKit, opts: { y?: number; blur?: boolean } = {}) {
  k.q("[data-reveal]").forEach((el) => {
    k.gsap.from(el, { y: opts.y ?? 36, opacity: 0, filter: opts.blur === false ? undefined : "blur(6px)", duration: 1.3, ease: "power3.out", delay: Number(el.dataset.reveal) || 0, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
}
