"use client";
import { gsap } from "./kit";

type BurstOpts = { colors: string[]; count?: number; shapes?: ("rect" | "dot" | "star" | "ring" | "bubble")[]; spread?: number; velocity?: [number, number]; gravity?: number; size?: number; duration?: number; up?: boolean };

/** Physics confetti burst at (x, y) inside `host` (position: relative). Self-cleaning. */
export function burst(host: HTMLElement, x: number, y: number, o: BurstOpts) {
  const n = o.count ?? 26;
  const shapes = o.shapes ?? ["rect", "dot"];
  const size = o.size ?? 9;
  const nodes: HTMLElement[] = [];
  for (let i = 0; i < n; i++) {
    const d = document.createElement("span");
    const shape = shapes[i % shapes.length];
    const c = o.colors[i % o.colors.length];
    const s = size * (0.6 + Math.random() * 0.8);
    Object.assign(d.style, {
      position: "absolute", left: `${x}px`, top: `${y}px`, width: `${shape === "rect" ? s * 0.6 : s}px`, height: `${s}px`, pointerEvents: "none", zIndex: "80",
      background: shape === "ring" || shape === "bubble" ? "transparent" : c, borderRadius: shape === "rect" ? "2px" : "50%",
      border: shape === "ring" ? `2px solid ${c}` : shape === "bubble" ? `1.5px solid ${c}` : "none",
      boxShadow: shape === "bubble" ? `inset -2px -2px 0 rgba(255,255,255,.5)` : "none",
      clipPath: shape === "star" ? "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" : "none",
      marginLeft: `${-s / 2}px`, marginTop: `${-s / 2}px`,
    } as Partial<CSSStyleDeclaration>);
    host.appendChild(d);
    nodes.push(d);
    const [v0, v1] = o.velocity ?? [180, 420];
    const spread = o.spread ?? 360;
    const base = o.up ? -90 : 0;
    gsap.to(d, {
      duration: o.duration ?? 1.6 + Math.random() * 0.8,
      physics2D: { velocity: gsap.utils.random(v0, v1), angle: base + gsap.utils.random(-spread / 2, spread / 2), gravity: o.gravity ?? 520 },
      rotation: gsap.utils.random(-540, 540),
      opacity: 0,
      ease: "power1.in",
      onComplete: () => d.remove(),
    });
  }
  return nodes;
}

/** Position of an element's centre relative to host. */
export function centerIn(host: HTMLElement, el: Element) {
  const a = host.getBoundingClientRect();
  const b = el.getBoundingClientRect();
  return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
}
