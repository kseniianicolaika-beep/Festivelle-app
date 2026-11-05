"use client";
import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { prefersReducedMotion } from "../../_kit/motion";

let registered = false;
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Physics2DPlugin);
    registered = true;
  }
  return gsap;
}
export { gsap, ScrollTrigger, SplitText };

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export const reduced = prefersReducedMotion;

type Q = (sel: string) => Element[];
export type SceneApi = { q: Q; reduced: boolean; el: HTMLElement };

/** gsap.context scoped to ref; everything created inside is reverted on unmount. */
export function useScene(ref: RefObject<HTMLElement | null>, build: (api: SceneApi) => void | (() => void), deps: unknown[] = []) {
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    ensureGsap();
    let extra: void | (() => void);
    const ctx = gsap.context(() => {
      extra = build({ q: gsap.utils.selector(el) as Q, reduced: prefersReducedMotion(), el });
    }, el);
    return () => {
      if (typeof extra === "function") extra();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Scroll-in reveals for [data-r] (rise), [data-r="fade"|"left"|"right"|"scale"]. Skipped when compact/reduced. */
export function revealAll(q: Q, opts: { compact?: boolean; reduced?: boolean } = {}) {
  if (opts.compact || opts.reduced) return;
  q("[data-r]").forEach((node) => {
    const kind = (node as HTMLElement).dataset.r;
    const from: gsap.TweenVars = { opacity: 0, duration: 1.2, ease: "power3.out", delay: Number((node as HTMLElement).dataset.d ?? 0) };
    if (kind === "left") from.x = -60;
    else if (kind === "right") from.x = 60;
    else if (kind === "scale") from.scale = 0.9;
    else if (kind !== "fade") from.y = 40;
    gsap.from(node, { ...from, scrollTrigger: { trigger: node, start: "top 92%", once: true } });
  });
}

/** Smooth scrolling on the published page only. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void; on: (e: string, f: () => void) => void } | null = null;
    let dead = false;
    import("lenis").then(({ default: Lenis }) => {
      if (dead) return;
      ensureGsap();
      lenis = new Lenis({ lerp: 0.09 }) as unknown as typeof lenis;
      lenis!.on("scroll", () => ScrollTrigger.update());
      const tick = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [enabled]);
}

type BurstOpts = { colors: string[]; n?: number; shapes?: ("rect" | "circle" | "strip" | "star")[]; velocity?: [number, number]; gravity?: number; angle?: [number, number]; size?: number; life?: number };
/** A burst of DOM confetti/particles from (x, y) inside `host` (position:relative). */
export function burst(host: HTMLElement, x: number, y: number, o: BurstOpts) {
  ensureGsap();
  if (prefersReducedMotion()) return;
  const n = o.n ?? 60;
  const shapes = o.shapes ?? ["rect", "circle", "strip"];
  const s = o.size ?? 8;
  for (let i = 0; i < n; i++) {
    const d = document.createElement("i");
    const shape = shapes[i % shapes.length];
    const c = o.colors[i % o.colors.length];
    const w = shape === "strip" ? s * 0.45 : s * (0.6 + Math.random() * 0.6);
    const h = shape === "strip" ? s * 1.6 : shape === "rect" ? w * 0.6 : w;
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:${shape === "circle" ? "50%" : "1px"};pointer-events:none;z-index:50;${shape === "star" ? "clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);" : ""}`;
    host.appendChild(d);
    const [a0, a1] = o.angle ?? [0, 360];
    const [v0, v1] = o.velocity ?? [300, 700];
    gsap.to(d, {
      duration: (o.life ?? 2.4) * (0.7 + Math.random() * 0.6),
      physics2D: { velocity: gsap.utils.random(v0, v1), angle: gsap.utils.random(a0, a1), gravity: o.gravity ?? 900 },
      rotation: gsap.utils.random(-720, 720),
      rotationX: gsap.utils.random(-360, 360),
      opacity: 0,
      ease: "power1.in",
      onComplete: () => d.remove(),
    });
  }
}

/** Burst centred on an element, relative to host. */
export function burstFrom(host: HTMLElement, from: Element, o: BurstOpts, dy = 0) {
  const h = host.getBoundingClientRect();
  const r = from.getBoundingClientRect();
  burst(host, r.left - h.left + r.width / 2, r.top - h.top + r.height / 2 + dy, o);
}
