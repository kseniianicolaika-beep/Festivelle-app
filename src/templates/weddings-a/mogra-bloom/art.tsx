"use client";
import { useId, type CSSProperties } from "react";
import { r1, rng } from "../_shared/data";
import type { SceneKit } from "../_shared/motion";

// Mogra Bloom — South Indian jasmine minimalism. A gajra (jasmine string) is strung procedurally along any
// curve: tight pairs of buds with an opened five-petal star flower every few beads, the odd jasmine leaf.
// The thread is a real path so gsap can draw it; every bud/flower carries data attrs for the bloom.

type P = [number, number];
const cubic = (p0: P, p1: P, p2: P, p3: P) => (t: number): P => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
};

export type Strand = { pts: [P, P, P, P]; step?: number; seed?: number; flowerEvery?: number; leaves?: boolean; s?: number };

function beads({ pts, step = 13, seed = 1, flowerEvery = 3, leaves = true, s = 1 }: Strand) {
  const f = cubic(...pts);
  const R = rng(seed);
  const samples: { p: P; len: number }[] = [];
  let len = 0, prev = f(0);
  for (let i = 0; i <= 240; i++) { const p = f(i / 240); len += Math.hypot(p[0] - prev[0], p[1] - prev[1]); samples.push({ p, len }); prev = p; }
  const out: { x: number; y: number; a: number; kind: "f" | "b" | "l"; k: number; sc: number }[] = [];
  let next = step * s * 0.6, j = 0, n = 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].len < next) continue;
    const [x, y] = samples[i].p, [px, py] = samples[i - 1].p;
    const a = (Math.atan2(y - py, x - px) * 180) / Math.PI;
    const isF = n % flowerEvery === flowerEvery - 1;
    out.push({ x: r1(x), y: r1(y), a: r1(a + (R() - 0.5) * 40 + (n % 2 ? 90 : -90)), kind: isF ? "f" : "b", k: j++, sc: r1((isF ? 1 : 0.85 + R() * 0.25) * s) });
    if (leaves && n % 11 === 5) out.push({ x: r1(x), y: r1(y), a: r1(a + (n % 2 ? 60 : -120)), kind: "l", k: j++, sc: r1(s * (0.8 + R() * 0.3)) });
    n++; next += step * s * (isF ? 1.25 : 0.8);
  }
  const [p0, p1, p2, p3] = pts;
  return { d: `M${p0[0]} ${p0[1]}C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`, items: out };
}

/** Shared symbol defs: petal flower, bud, leaf. */
export function JasmineDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}pg`} cx="50%" cy="100%" r="100%">
        <stop offset="0" stopColor="#efe9cf" />
        <stop offset=".35" stopColor="#fbf9f0" />
        <stop offset="1" stopColor="#ffffff" />
      </radialGradient>
      <linearGradient id={`${id}bg`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#f3f0e2" />
        <stop offset=".6" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f3dfe4" />
      </linearGradient>
      <symbol id={`${id}f`} viewBox="-14 -14 28 28" overflow="visible">
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} transform={`rotate(${i * 72})`} d="M0 0C2.6-2.4 4.4-7.4 1.8-12.2C.8-13.4-1.2-13-2-11.6C-3.6-7.6-2.6-3.2 0 0Z" fill={`url(#${id}pg)`} stroke="#b9ad84" strokeWidth=".5" />
        ))}
        <circle r="1.6" fill="#e6dfa8" /><circle r=".6" fill="#a8a35a" />
      </symbol>
      <symbol id={`${id}b`} viewBox="-6 -12 12 20" overflow="visible">
        <path d="M0 5C-2.6 2-2.9-4.6 0-9.6C2.9-4.6 2.6 2 0 5Z" fill={`url(#${id}bg)`} stroke="#bdb38f" strokeWidth=".5" />
        <path d="M-1.8 4.2L0 7.2L1.8 4.2C.8 4.8-.8 4.8-1.8 4.2Z" fill="#7d8f62" />
      </symbol>
      <symbol id={`${id}l`} viewBox="0 -6 22 12" overflow="visible">
        <path d="M0 0C5-4 13-4.4 21 0C13 4.4 5 4 0 0Z" fill="#7a8e64" />
        <path d="M1 0H19" stroke="#55663f" strokeWidth=".5" />
      </symbol>
    </defs>
  );
}

/** One gajra along a cubic curve. `bloom` controls whether flowers render open (final state). */
export function Gajra({ id, strand, thread = "#8a8466" }: { id: string; strand: Strand; thread?: string }) {
  const { d, items } = beads(strand);
  return (
    <g data-gajra style={{ filter: "drop-shadow(0 1.2px 1.2px rgba(90,80,40,.28))" }}>
      <path data-thread d={d} fill="none" stroke={thread} strokeWidth={0.7 * (strand.s ?? 1)} strokeLinecap="round" />
      {items.map((it) => {
        const w = it.kind === "f" ? 26 : it.kind === "b" ? 11 : 20;
        const h = it.kind === "f" ? 26 : it.kind === "b" ? 18 : 10;
        const ox = it.kind === "l" ? 0 : -w / 2, oy = it.kind === "f" ? -h / 2 : it.kind === "b" ? -11 : -5;
        return (
          <g key={it.k} transform={`translate(${it.x} ${it.y}) rotate(${it.a}) scale(${it.sc})`}>
            <use data-bead={it.kind} href={`#${id}${it.kind}`} x={ox} y={oy} width={w} height={h} style={{ transformBox: "fill-box", transformOrigin: "center" } as CSSProperties} />
          </g>
        );
      })}
    </g>
  );
}

/** Standalone gajra drawing in its own svg. */
export function GajraArt({ strands, viewBox, className = "", style, thread }: { strands: Strand[]; viewBox: string; className?: string; style?: CSSProperties; thread?: string }) {
  const id = "j" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden overflow="visible">
      <JasmineDefs id={id} />
      {strands.map((s, i) => <Gajra key={i} id={id} strand={s} thread={thread} />)}
    </svg>
  );
}

/** A ring of jasmine — wreath for posts, table numbers, hashtags. */
export function Wreath({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const k = 0.5523, r = 100, c = 120;
  const q: [P, P, P, P][] = [
    [[c, c - r], [c + r * k, c - r], [c + r, c - r * k], [c + r, c]],
    [[c + r, c], [c + r, c + r * k], [c + r * k, c + r], [c, c + r]],
    [[c, c + r], [c - r * k, c + r], [c - r, c + r * k], [c - r, c]],
    [[c - r, c], [c - r, c - r * k], [c - r * k, c - r], [c, c - r]],
  ];
  return <GajraArt viewBox="0 0 240 240" className={className} style={style} strands={q.map((pts, i) => ({ pts, seed: 3 + i, step: 12, flowerEvery: 3 }))} />;
}

/** Brass nilavilakku — the Kerala standing lamp, five wicks lit. */
export function Lamp({ className = "", lit = true, still = false }: { className?: string; lit?: boolean; still?: boolean }) {
  const id = "l" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const flame = (x: number, y: number, s: number, i: number) => (
    <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-9" rx="9" ry="14" fill={`url(#${id}h)`} />
      <path d="M0 0C-3.4-3-3.8-8 0-16C3.8-8 3.4-3 0 0Z" fill={`url(#${id}fl)`} style={still ? undefined : { transformBox: "fill-box", transformOrigin: "50% 100%", animation: `wa-flicker ${1.6 + i * 0.23}s ease-in-out ${-i * 0.4}s infinite` }} />
    </g>
  );
  return (
    <svg viewBox="0 0 160 300" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6a32" /><stop offset=".3" stopColor="#e6c886" /><stop offset=".5" stopColor="#fff0c4" /><stop offset=".7" stopColor="#c9a25a" /><stop offset="1" stopColor="#7a5a26" />
        </linearGradient>
        <radialGradient id={`${id}h`}><stop offset="0" stopColor="#ffd98a" stopOpacity=".7" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}fl`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#e2702e" /><stop offset=".4" stopColor="#ffc34d" /><stop offset="1" stopColor="#fff6d0" /></linearGradient>
      </defs>
      <g fill={`url(#${id}g)`} stroke="#6f5222" strokeWidth=".6">
        {/* finial */}
        <path d="M80 18c4 6 6 12 4 18h-8c-2-6 0-12 4-18Z" />
        <ellipse cx="80" cy="40" rx="7" ry="3" />
        <rect x="77" y="42" width="6" height="22" />
        {/* dish with lip */}
        <path d="M24 74c8 14 104 14 112 0l-4-4c-10 8-94 8-104 0Z" />
        <ellipse cx="80" cy="70" rx="56" ry="7" />
        {/* stem with turned nodes */}
        <path d="M76 80h8l2 30h-12Z" />
        <ellipse cx="80" cy="114" rx="11" ry="5" />
        <path d="M74 118h12l-1 40h-10Z" />
        <ellipse cx="80" cy="162" rx="14" ry="6" />
        <path d="M73 166h14l2 50h-18Z" />
        <ellipse cx="80" cy="220" rx="18" ry="6" />
        {/* stepped base */}
        <path d="M58 226h44l14 28H44Z" />
        <ellipse cx="80" cy="256" rx="46" ry="8" />
        <path d="M30 262h100l8 14H22Z" />
        <ellipse cx="80" cy="278" rx="60" ry="9" />
      </g>
      {lit && [[30, 66, 0.9], [55, 70, 1], [80, 71, 1.1], [105, 70, 1], [130, 66, 0.9]].map(([x, y, s], i) => flame(x, y, s, i))}
    </svg>
  );
}

/** Kerala tharavad / kovilakam roofline — line art for the venue. */
export function Roofline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 210" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <path d="M10 130 L90 82 L330 82 L410 130 Z" />
      <path d="M90 82 L140 40 L280 40 L330 82" />
      <path d="M180 40 L210 10 L240 40 Z" />
      <path d="M190 40 L210 20 L230 40 M200 40 L210 30 L220 40" opacity=".7" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${r1(22 + i * 13)} ${r1(126 - Math.abs(i - 14.5) * 0)}l${r1((i - 14.5) * 0.8)} -36`} opacity=".25" />)}
      <path d="M40 130 V196 M380 130 V196 M110 130 V196 M310 130 V196" />
      <path d="M150 196 V150 a60 30 0 0 1 120 0 V196" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${160 + i * 12} 150 V196`} opacity=".35" />)}
      <path d="M0 196 H420 M0 202 H420" />
    </svg>
  );
}

/** Kasavu: the gold zari border of a Kerala set-mundu — thin line, gap, broad band, gap, thin line. */
export function Kasavu({ className = "", style, thin = false }: { className?: string; style?: CSSProperties; thin?: boolean }) {
  return (
    <div className={`mog-kasavu ${thin ? "mog-kasavu-thin" : ""} ${className}`} style={style} aria-hidden>
      <i /><b /><i />
    </div>
  );
}

export function JasmineMark({ className = "" }: { className?: string }) {
  const id = "m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="-16 -16 32 32" className={className} aria-hidden>
      <JasmineDefs id={id} />
      <use href={`#${id}f`} x="-14" y="-14" width="28" height="28" />
    </svg>
  );
}

/** Opening: the thread inks itself, buds string on, flowers open one by one. */
export function bloom(k: SceneKit, scope: string, at = 0) {
  const tl = k.gsap.timeline({ delay: at });
  k.q(`${scope} [data-thread]`).forEach((p, i) => tl.from(p, { drawSVG: "0%", duration: 2.2, ease: "power2.inOut" }, i * 0.15));
  k.q(`${scope} [data-gajra]`).forEach((g, gi) => {
    const beads = Array.from(g.querySelectorAll("[data-bead]"));
    const buds = beads.filter((b) => b.getAttribute("data-bead") !== "f");
    const fl = beads.filter((b) => b.getAttribute("data-bead") === "f");
    tl.from(buds, { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2.4)", stagger: { each: 1.9 / Math.max(1, buds.length) } }, 0.2 + gi * 0.15);
    tl.from(fl, { scale: 0.15, rotate: -70, opacity: 0, duration: 1.1, ease: "back.out(1.6)", stagger: { each: 2 / Math.max(1, fl.length) } }, 0.9 + gi * 0.15);
  });
  return tl;
}

