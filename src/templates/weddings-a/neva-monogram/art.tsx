"use client";
import { useId, type CSSProperties } from "react";
import { r1, rng } from "../_shared/data";

// Neva Monogram — Petersburg White Nights. A silver monogram in a birch wreath; the Neva at midnight
// with the Palace Bridge raised and the Peter & Paul spire; silver birch branches. All line art, all procedural.

const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

/** A birch leaf: ovate with a pointed tip and a serrated edge, centred at 0,0 pointing up. */
function leafPath(L: number, W: number) {
  const n = 7; let right = "", left = "";
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), y = -L * t, w = W * Math.sin(Math.PI * Math.pow(t, 0.8)) * (1 - t * 0.25);
    const ty = y - L / (n + 1) * 0.5;
    right += `L${r1(w)} ${r1(y)}L${r1(w * 0.86)} ${r1(ty)}`;
    left = `L${r1(-w * 0.86)} ${r1(ty)}L${r1(-w)} ${r1(y)}` + left;
  }
  return `M0 0${right}L0 ${-L}${left}Z`;
}

/** Wreath of two birch sprays meeting at the bottom, with catkins. Paths only (DrawSVG-friendly). */
export function Wreath({ className = "", style, stroke = "currentColor", sw = 1.1 }: { className?: string; style?: CSSProperties; stroke?: string; sw?: number }) {
  const R = rng(17);
  const lines: string[] = [];
  const leaves: { x: number; y: number; a: number; l: number }[] = [];
  for (const side of [-1, 1]) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 40; i++) {
      const a = Math.PI / 2 + side * (0.2 + (i / 40) * 2.5);
      pts.push([100 + Math.cos(a) * 82, 100 + Math.sin(a) * 82]);
    }
    lines.push(`M${pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}`);
    for (let i = 2; i < 40; i += 2) {
      const [x, y] = pts[i], [x2, y2] = pts[i + 1];
      const tang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
      const out = (i / 2) % 2 ? 1 : -1;
      leaves.push({ x, y, a: tang + 90 + out * (40 + R() * 16), l: 14 + R() * 5 - (i / 40) * 6 });
      if (i % 10 === 6) {
        let d = `M${r1(x)} ${r1(y)}`;
        const ca = ((tang - out * 90) * Math.PI) / 180;
        for (let k = 1; k <= 5; k++) d += ` l${r1(Math.cos(ca) * 2.6)} ${r1(Math.sin(ca) * 2.6)} a1.1 1.1 0 1 0 0.1 0`;
        lines.push(d);
      }
    }
  }
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {lines.map((d, i) => <path key={i} d={d} />)}
      {leaves.map((l, i) => <path key={`l${i}`} d={`${leafPath(l.l, l.l * 0.42)} M0 0L0 ${r1(-l.l * 0.9)}`} transform={`translate(${r1(l.x)} ${r1(l.y)}) rotate(${r1(l.a + 90)})`} fill={stroke} fillOpacity={0.08 + (i % 3) * 0.06} />)}
      <path d="M92 182 C96 186 104 186 108 182 M96 180 L104 188 M104 180 L96 188" />
    </svg>
  );
}

/** Interlaced initials (stroked, then filled with silver foil). */
export function Monogram({ a, b, className = "", style, size, num }: { a: string; b?: string; className?: string; style?: CSSProperties; size?: number; num?: string | number }) {
  const u = uidOf(useId());
  const one = num !== undefined ? String(num) : b ? null : a;
  return (
    <svg viewBox="0 0 200 200" width={size} className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${u}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5f6d7c" /><stop offset=".3" stopColor="#f3f6f9" /><stop offset=".5" stopColor="#8d9aa8" /><stop offset=".72" stopColor="#eef2f6" /><stop offset="1" stopColor="#66737f" />
        </linearGradient>
      </defs>
      {one ? (
        <text data-mono-letter x="100" y={num !== undefined ? 124 : 128} textAnchor="middle" fontSize={num !== undefined ? 76 : 96} fill={`url(#${u}s)`} stroke="#7d8a97" strokeWidth=".6" style={{ fontFamily: num !== undefined ? "var(--wa-oldstd), Georgia, serif" : "var(--wa-vibes), var(--wa-amita), cursive" }}>{one}</text>
      ) : (
        <g style={{ fontFamily: "var(--wa-vibes), var(--wa-amita), cursive" }}>
          <text data-mono-letter x="84" y="124" textAnchor="middle" fontSize="92" fill={`url(#${u}s)`} stroke="#7d8a97" strokeWidth=".6">{a}</text>
          <text data-mono-letter x="122" y="140" textAnchor="middle" fontSize="92" fill={`url(#${u}s)`} stroke="#7d8a97" strokeWidth=".6">{b}</text>
        </g>
      )}
    </svg>
  );
}

/** Crest: wreath + monogram, layered. */
export function Crest({ a, b, num, className = "", style, wreath = "#8a97a5" }: { a: string; b?: string; num?: string | number; className?: string; style?: CSSProperties; wreath?: string }) {
  return (
    <div className={`relative aspect-square ${className}`} style={style}>
      <Wreath className="absolute inset-0 h-full w-full" stroke={wreath} />
      <Monogram a={a} b={b} num={num} className="absolute inset-[16%] h-[68%] w-[68%]" />
    </div>
  );
}

/** White night over the Neva: pearl-lilac sky, the raised Palace Bridge, the Peter & Paul spire. */
export function NevaScene({ className = "", style, still = false, layout = "square" }: { className?: string; style?: CSSProperties; still?: boolean; layout?: "square" | "wide" | "tall" }) {
  const u = uidOf(useId());
  const W = layout === "wide" ? 1600 : layout === "tall" ? 900 : 1000;
  const H = layout === "wide" ? 900 : layout === "tall" ? 1600 : 1000;
  const hz = layout === "tall" ? 1000 : layout === "wide" ? 560 : 600;
  const cx = W / 2;
  const s = layout === "wide" ? 1.15 : 1;
  const R = rng(5);
  const deck = hz - 22 * s;
  const line = "#6f7f93";
  const ripples = Array.from({ length: 34 }, () => ({ x: r1(R() * W), y: r1(hz + 8 + Math.pow(R(), 1.6) * (H - hz - 20)), w: r1(20 + R() * 90), o: r1(0.15 + R() * 0.35) }));
  // far bank skyline: low classical facades, a dome, the fortress wall
  let sky = `M0 ${hz - 14}`;
  for (let x = 0; x <= W; x += 18 + Math.floor(R() * 26)) sky += `L${x} ${r1(hz - 12 - R() * 16)}`;
  sky += `L${W} ${hz}L0 ${hz}Z`;
  const spireX = cx - 300 * s;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9cbe0" />
          <stop offset=".45" stopColor="#e5ddea" />
          <stop offset=".8" stopColor="#f5e3e2" />
          <stop offset="1" stopColor="#fbefe4" />
        </linearGradient>
        <linearGradient id={`${u}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe2e6" />
          <stop offset=".35" stopColor="#cfd3e2" />
          <stop offset="1" stopColor="#aab4c8" />
        </linearGradient>
        <radialGradient id={`${u}g`} cx=".5" cy="1" r=".7">
          <stop offset="0" stopColor="#fff4e8" stopOpacity=".95" /><stop offset="1" stopColor="#fff4e8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}gold`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#efe2b8" /><stop offset="1" stopColor="#b9a26a" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${u}sky)`} />
      <ellipse cx={cx + 120 * s} cy={hz} rx={W * 0.55} ry={(hz) * 0.45} fill={`url(#${u}g)`} />
      {/* faint stars that never quite come out */}
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={r1(R() * W)} cy={r1(R() * hz * 0.4)} r={r1(0.8 + R())} fill="#fff" opacity=".7" style={still ? undefined : { animation: `wa-twinkle ${4 + (i % 4)}s ease-in-out ${-i}s infinite` }} />)}
      {/* far bank */}
      <path d={sky} fill="#b9bccf" opacity=".7" />
      <g fill="#a9adc3" stroke={line} strokeWidth="1" strokeOpacity=".5">
        {/* Peter & Paul Cathedral: bell tower + needle spire with the angel */}
        <path d={`M${spireX - 26 * s} ${hz - 10}V${hz - 70 * s}H${spireX + 26 * s}V${hz - 10}Z`} />
        <path d={`M${spireX - 18 * s} ${hz - 70 * s}V${hz - 104 * s}H${spireX + 18 * s}V${hz - 70 * s}Z`} />
        <path d={`M${spireX - 11 * s} ${hz - 104 * s}V${hz - 132 * s}H${spireX + 11 * s}V${hz - 104 * s}Z`} />
        <path d={`M${spireX - 8 * s} ${hz - 132 * s}L${spireX} ${hz - 300 * s}L${spireX + 8 * s} ${hz - 132 * s}Z`} fill={`url(#${u}gold)`} stroke="#a8925a" />
        <path d={`M${spireX} ${hz - 300 * s}v-10m-6 3l6 -3l6 3`} stroke="#a8925a" strokeWidth="1.4" fill="none" />
        <path d={`M${spireX - 120 * s} ${hz - 10}V${hz - 26 * s}H${spireX + 140 * s}V${hz - 10}Z`} />
        {/* a dome on the far bank */}
        <path d={`M${cx + 250 * s} ${hz - 30 * s}a${34 * s} ${36 * s} 0 0 1 ${68 * s} 0Z`} />
        <path d={`M${cx + 240 * s} ${hz - 10}V${hz - 30 * s}H${cx + 328 * s}V${hz - 10}Z M${cx + 284 * s} ${hz - 66 * s}v-14`} />
      </g>
      {/* the river */}
      <rect y={hz} width={W} height={H - hz} fill={`url(#${u}w)`} />
      <rect y={hz} width={W} height="1.5" fill="#fff" opacity=".7" />
      <g stroke="#fff" strokeLinecap="round">
        {ripples.map((r, i) => <path key={i} d={`M${r.x} ${r.y}h${r.w}`} strokeOpacity={r.o} strokeWidth="1.4" style={still ? undefined : { animation: `wa-glint ${3 + (i % 5)}s ease-in-out ${-i * 0.4}s infinite`, transformOrigin: `${r.x + r.w / 2}px ${r.y}px`, transformBox: "view-box" }} />)}
      </g>
      {/* spire reflection */}
      <path d={`M${spireX} ${hz + 4}L${spireX} ${hz + 160 * s}`} stroke="#d9c58e" strokeOpacity=".5" strokeWidth={6 * s} strokeDasharray="10 7" />
      {/* Palace Bridge: arched side spans + the raised bascule leaves */}
      <g data-bridge fill="none" stroke={line} strokeWidth={1.6 * s} strokeLinejoin="round">
        <path d={`M${cx - 520 * s} ${deck}H${cx - 70 * s} M${cx + 70 * s} ${deck}H${cx + 520 * s}`} strokeWidth={2.4 * s} />
        {[-1, 1].map((sd) => (
          <g key={sd}>
            {[0, 1, 2].map((k) => {
              const x1 = cx + sd * (520 - k * 150) * s, x2 = cx + sd * (370 - k * 150) * s;
              return <path key={k} d={`M${x1} ${hz + 8}Q${(x1 + x2) / 2} ${deck - 6 * s} ${x2} ${hz + 8}`} />;
            })}
            {[0, 1, 2, 3].map((k) => <path key={`p${k}`} d={`M${cx + sd * (520 - k * 150) * s} ${deck}V${hz + 14}`} strokeWidth={3 * s} />)}
            {/* lamps */}
            {[0, 1, 2, 3, 4, 5].map((k) => { const x = cx + sd * (500 - k * 75) * s; return <path key={`l${k}`} d={`M${x} ${deck}v${-18 * s}m-4 0h8`} strokeWidth={1 * s} />; })}
            {/* raised leaf */}
            <path d={`M${cx + sd * 70 * s} ${deck}L${cx + sd * 34 * s} ${deck - 150 * s}L${cx + sd * 18 * s} ${deck - 146 * s}L${cx + sd * 52 * s} ${deck + 4 * s}Z`} fill="#c3c8d8" fillOpacity=".6" />
            <path d={`M${cx + sd * 62 * s} ${deck - 30 * s}L${cx + sd * 30 * s} ${deck - 36 * s} M${cx + sd * 56 * s} ${deck - 70 * s}L${cx + sd * 26 * s} ${deck - 74 * s} M${cx + sd * 48 * s} ${deck - 110 * s}L${cx + sd * 22 * s} ${deck - 112 * s} M${cx + sd * 66 * s} ${deck - 14 * s}L${cx + sd * 26 * s} ${deck - 112 * s}`} strokeWidth={1 * s} />
          </g>
        ))}
      </g>
      {/* a little boat passing under the open bridge */}
      <g transform={`translate(${cx} ${hz + 26 * s}) scale(${s})`} style={still ? undefined : { animation: "wa-bob 6s ease-in-out infinite" }}>
        <path d="M-26 0 Q0 8 26 0 L22 -5 H-22Z" fill="#7c8aa0" />
        <path d="M-10 -5V-14H8V-5" fill="#9aa6b8" />
      </g>
    </svg>
  );
}

/** Silver birch branch hanging from a corner: thin wands, small serrated leaves, catkins. */
export function BirchBranch({ className = "", style, seed = 2, color = "#8a97a5", flip = false }: { className?: string; style?: CSSProperties; seed?: number; color?: string; flip?: boolean }) {
  const R = rng(seed);
  const wands: string[] = [], leaves: { x: number; y: number; a: number; l: number }[] = [], cat: string[] = [];
  for (let w = 0; w < 4; w++) {
    let x = 10 + w * 18, y = 0, ang = 70 + w * 6 + R() * 8;
    let d = `M${x} ${y}`;
    for (let i = 0; i < 22; i++) {
      ang += (R() - 0.35) * 5;
      const st = 9 + R() * 3;
      x += Math.cos((ang * Math.PI) / 180) * st; y += Math.sin((ang * Math.PI) / 180) * st;
      d += `L${r1(x)} ${r1(y)}`;
      if (i > 2 && i % 2 === 0) leaves.push({ x, y, a: ang + (i % 4 ? 50 : -50) - 90 + 180, l: 10 + R() * 5 });
      if (i % 7 === 6) { let c = `M${r1(x)} ${r1(y)}`; for (let k = 0; k < 6; k++) c += ` m0 3.2 a1.6 1.6 0 1 0 0.1 0`; cat.push(c); }
    }
    wands.push(d);
  }
  return (
    <svg viewBox="0 0 200 260" className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {wands.map((d, i) => <path key={i} d={d} strokeWidth={1.4 - i * 0.15} />)}
      {leaves.map((l, i) => <path key={`l${i}`} d={leafPath(l.l, l.l * 0.45)} transform={`translate(${r1(l.x)} ${r1(l.y)}) rotate(${r1(l.a)})`} strokeWidth=".8" fill={color} fillOpacity={0.12 + (i % 3) * 0.08} />)}
      {cat.map((d, i) => <path key={`c${i}`} d={d} strokeWidth=".8" />)}
    </svg>
  );
}

/** Thin silver rule with a small diamond. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-[#97a3b0] ${className}`} aria-hidden>
      <span className="h-px w-16 bg-current" /><span className="h-1.5 w-1.5 rotate-45 border border-current" /><span className="h-px w-16 bg-current" />
    </div>
  );
}
