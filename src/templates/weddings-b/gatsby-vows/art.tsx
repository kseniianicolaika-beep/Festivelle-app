"use client";
import { useEffect, useRef } from "react";
import { useGid } from "../_shared/kit";

// Hand-drawn art-deco line work for Gatsby Vows. All strokes are gilt gradients; paths carry
// data-draw so the stage can draw them in (DrawSVG) — markup alone is the finished drawing.

function Gilt({ id, vertical = false }: { id: string; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0.35"}>
      <stop offset="0" stopColor="#8c6a2e" />
      <stop offset="0.28" stopColor="#f6e3a8" />
      <stop offset="0.5" stopColor="#c49a4c" />
      <stop offset="0.74" stopColor="#f3d98f" />
      <stop offset="1" stopColor="#8c6a2e" />
    </linearGradient>
  );
}

const pol = (cx: number, cy: number, r: number, a: number) => [cx + Math.cos(a) * r, cy - Math.sin(a) * r] as const;
const f = (n: number) => n.toFixed(1);

/** The sunburst fan — a half-sun of alternating long/short rays over concentric rings. */
export function Fan({ rays = 36, className, style, rings = true }: { rays?: number; className?: string; style?: React.CSSProperties; rings?: boolean }) {
  const g = useGid("fan");
  const cx = 200, cy = 204;
  const lines = Array.from({ length: rays - 1 }, (_, k) => {
    const i = k + 1;
    const a = (Math.PI * i) / rays;
    const long = i % 2 === 0;
    const [x0, y0] = pol(cx, cy, 46, a);
    const [x1, y1] = pol(cx, cy, long ? 176 : 132, a);
    return { d: `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`, long, end: pol(cx, cy, 140, a) };
  });
  return (
    <svg viewBox="0 0 400 210" className={className} style={style} aria-hidden fill="none">
      <defs><Gilt id={g} /></defs>
      <g stroke={`url(#${g})`} strokeLinecap="round">
        {rings && (
          <>
            <path data-draw d={`M${cx - 196} ${cy}A196 196 0 0 1 ${cx + 196} ${cy}`} strokeWidth="1" />
            <path data-draw d={`M${cx - 186} ${cy}A186 186 0 0 1 ${cx + 186} ${cy}`} strokeWidth="2.2" />
          </>
        )}
        <path data-draw d={`M${cx - 40} ${cy}A40 40 0 0 1 ${cx + 40} ${cy}`} strokeWidth="2" />
        <path data-draw d={`M${cx - 30} ${cy}A30 30 0 0 1 ${cx + 30} ${cy}`} strokeWidth="1" />
        <path data-draw d={`M${cx - 18} ${cy}A18 18 0 0 1 ${cx + 18} ${cy}`} strokeWidth="1" />
        {lines.map((l, i) => <path key={i} data-ray d={l.d} strokeWidth={l.long ? 1.5 : 0.9} />)}
        <path data-draw d={`M2 ${cy}H398`} strokeWidth="1.2" />
      </g>
      <g fill={`url(#${g})`}>
        {lines.filter((l) => !l.long).map((l, i) => <circle key={i} data-ray cx={f(l.end[0])} cy={f(l.end[1])} r="2" />)}
      </g>
    </svg>
  );
}

/** Divider: line · stacked chevrons · diamond · chevrons · line. */
export function Chevrons({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const g = useGid("chv");
  return (
    <svg viewBox="0 0 300 24" className={className} style={style} aria-hidden fill="none">
      <defs><Gilt id={g} /></defs>
      <g stroke={`url(#${g})`} strokeWidth="1.2">
        <path data-draw d="M0 12H112M188 12H300" />
        <path data-draw d="M118 5l7 7-7 7M126 5l7 7-7 7M182 5l-7 7 7 7M174 5l-7 7 7 7" />
        <path data-draw d="M150 2l10 10-10 10-10-10z" />
      </g>
      <path d="M150 7l5 5-5 5-5-5z" fill={`url(#${g})`} />
    </svg>
  );
}

/** Corner fan — a quarter sunburst for card corners. */
export function CornerFan({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const g = useGid("cf");
  const rays = Array.from({ length: 7 }, (_, i) => {
    const a = (Math.PI / 2) * ((i + 1) / 8);
    return `M${f(Math.cos(a) * 14)} ${f(Math.sin(a) * 14)}L${f(Math.cos(a) * (i % 2 ? 40 : 54))} ${f(Math.sin(a) * (i % 2 ? 40 : 54))}`;
  });
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden fill="none">
      <defs><Gilt id={g} /></defs>
      <g stroke={`url(#${g})`} strokeWidth="1" transform="translate(2 2)">
        <path data-draw d="M0 60V0H60" strokeWidth="1.4" />
        <path data-draw d="M0 14A14 14 0 0 0 14 0" />
        <path data-draw d="M0 58A58 58 0 0 0 58 0" />
        {rays.map((d, i) => <path key={i} data-ray d={d} />)}
      </g>
    </svg>
  );
}

/** The stepped (ziggurat) arch that frames the hero, drawn as a double gilt line. */
export function StepArch({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const g = useGid("sa");
  const path = (i: number) => {
    const L = 6 + i, R = 594 - i, B = 898;
    return `M${L} ${B}V${306 + i}H${48 + i}V${252 + i}H${90 + i}V${198 + i}H${120 + i}A${180 - i} ${180 - i} 0 0 1 ${480 - i} ${198 + i}H${510 - i}V${252 + i}H${552 - i}V${306 + i}H${R}V${B}`;
  };
  return (
    <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMid meet" className={className} style={style} aria-hidden fill="none">
      <defs><Gilt id={g} vertical /></defs>
      <path d={path(0)} fill="#0b0a09" fillOpacity="0.94" />
      <g stroke={`url(#${g})`}>
        <path data-draw d={path(0)} strokeWidth="2" />
        <path data-draw d={path(12)} strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/** Venue: a set-back deco tower with a sunburst crown, spire and lit entrance. */
export function Facade({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const g = useGid("fc");
  const crownArcs = [44, 34, 24];
  const tri = crownArcs.flatMap((r, ri) =>
    Array.from({ length: 7 - ri * 2 }, (_, i) => {
      const n = 7 - ri * 2;
      const a = Math.PI * ((i + 1) / (n + 1));
      const [x, y] = pol(150, 112, r - 5, a);
      return `M${f(x)} ${f(y - 3.5)}l3 6h-6z`;
    }),
  );
  const pil = Array.from({ length: 8 }, (_, i) => 72 + i * 22);
  return (
    <svg viewBox="0 0 300 430" className={className} style={style} aria-hidden fill="none">
      <defs><Gilt id={g} vertical /></defs>
      <g stroke={`url(#${g})`} strokeWidth="1.1" strokeLinejoin="round">
        <path data-draw d="M4 420H296" strokeWidth="1.6" />
        {/* wings */}
        <path data-draw d="M18 420V300H58M282 420V300H242" />
        {Array.from({ length: 3 }, (_, i) => <path key={i} data-draw d={`M${26 + i * 11} 312V410M${274 - i * 11} 312V410`} strokeWidth="0.7" />)}
        {/* main block + setbacks */}
        <path data-draw d="M58 420V212H86V164H108V128H192V164H214V212H242V420" strokeWidth="1.5" />
        <path data-draw d="M64 420V218H92V170H114V134H186V170H208V218H236V420" strokeWidth="0.6" />
        {pil.map((x, i) => <path key={i} data-draw d={`M${x} 228V${i === 3 || i === 4 ? 372 : 404}`} strokeWidth="0.7" />)}
        <path data-draw d="M100 182V206M122 146V206M136 146V206M150 146V206M164 146V206M178 146V206M200 182V206" strokeWidth="0.6" />
        {/* crown */}
        {crownArcs.map((r) => <path key={r} data-draw d={`M${150 - r} 128V112A${r} ${r} 0 0 1 ${150 + r} 112V128`} />)}
        <path data-draw d="M147 68L150 6L153 68" strokeWidth="1" />
        <path data-draw d="M150 68V112" strokeWidth="0.6" />
        {tri.map((d, i) => <path key={i} data-draw d={d} strokeWidth="0.7" />)}
        {/* entrance with fanlight */}
        <path data-draw d="M128 420V384A22 22 0 0 1 172 384V420" strokeWidth="1.3" />
        {Array.from({ length: 7 }, (_, i) => { const a = Math.PI * ((i + 1) / 8); const [x0, y0] = pol(150, 384, 4, a); const [x1, y1] = pol(150, 384, 19, a); return <path key={i} data-draw d={`M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`} strokeWidth="0.6" />; })}
        <path data-draw d="M150 384V420" strokeWidth="0.6" />
        {/* steps */}
        <path data-draw d="M116 420V416H184V420M122 416V412H178V416" strokeWidth="0.6" />
      </g>
      <circle cx="150" cy="6" r="2.4" fill="#f6e3a8" />
    </svg>
  );
}

/** A champagne tower (4·3·2·1 coupes) with a pour from above; .fill elements rise when animated. */
export function Tower({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const g = useGid("tw");
  const liq = useGid("lq");
  const rows = [4, 3, 2, 1];
  const glasses: [number, number][] = [];
  rows.forEach((n, r) => { for (let i = 0; i < n; i++) glasses.push([120 + (i - (n - 1) / 2) * 52, 246 - r * 46]); });
  return (
    <svg viewBox="0 0 240 280" className={className} style={style} aria-hidden fill="none">
      <defs>
        <Gilt id={g} />
        <linearGradient id={liq} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbe7a6" /><stop offset="1" stopColor="#c99a45" /></linearGradient>
      </defs>
      <path data-pour d="M120 18V92" stroke="#f6e3a8" strokeWidth="1.4" strokeLinecap="round" />
      <path data-draw d="M104 2l18 14M100 7l18 14" stroke={`url(#${g})`} strokeWidth="1" />
      {glasses.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path data-fill d="M-22 2Q-21 15 0 15Q21 15 22 2Z" fill={`url(#${liq})`} opacity="0.85" />
          <g stroke={`url(#${g})`} strokeWidth="1.1" strokeLinecap="round">
            <path data-draw d="M-24 0Q-23 16 0 16Q23 16 24 0" />
            <path data-draw d="M-24 0H24" strokeWidth="0.8" />
            <path data-draw d="M0 16V30M-11 33Q0 28 11 33" />
          </g>
          {[-10, 2, 12].map((bx, j) => <circle key={j} data-bubble cx={bx} cy={-4 - j * 3} r="1.2" fill="#f6e3a8" />)}
        </g>
      ))}
      <path data-draw d="M40 276H200" stroke={`url(#${g})`} strokeWidth="1" />
    </svg>
  );
}

/** Half of the gilded gates — rays from the central medallion, stepped frame, chevron columns. */
export function DoorArt({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const g = useGid("dr");
  const cx = 200, cy = 300;
  const rays = Array.from({ length: 17 }, (_, i) => {
    const a = Math.PI / 2 + (Math.PI * (i + 1)) / 18;
    const [x0, y0] = pol(cx, cy, 78, a);
    const [x1, y1] = pol(cx, cy, i % 2 ? 150 : 230, a);
    return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
  });
  return (
    <svg viewBox="0 0 200 600" preserveAspectRatio="xMaxYMid meet" className={className} style={style} aria-hidden fill="none">
      <defs><Gilt id={g} vertical /></defs>
      <g stroke={`url(#${g})`} strokeWidth="1">
        <path data-draw d="M14 14H200M14 586H200M14 14V586" strokeWidth="1.6" />
        <path data-draw d="M26 26H200M26 574H200M26 26V574" strokeWidth="0.6" />
        <path data-draw d={`M${cx} ${cy - 70}A70 70 0 0 0 ${cx} ${cy + 70}`} strokeWidth="1.8" />
        <path data-draw d={`M${cx} ${cy - 60}A60 60 0 0 0 ${cx} ${cy + 60}`} strokeWidth="0.7" />
        {rays.map((d, i) => <path key={i} data-ray d={d} strokeWidth={i % 2 ? 0.7 : 1.2} />)}
        {Array.from({ length: 9 }, (_, i) => <path key={i} data-draw d={`M44 ${44 + i * 14}l14 9 14-9M44 ${556 - i * 14}l14-9 14 9`} strokeWidth="0.7" />)}
        <path data-draw d="M100 40V120H130V150H160V170H200M100 560V480H130V450H160V430H200" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/** Rising champagne bubbles (2D canvas, paused off-screen). */
export function Bubbles({ className, count = 46 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, on = true;
    const size = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const ps = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2.2, v: 0.12 + Math.random() * 0.45, ph: Math.random() * 6.28 }));
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= (p.v * 0.6) / Math.max(h, 1) * 2.2;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        const x = p.x * w + Math.sin(t / 900 + p.ph) * 6;
        const y = p.y * h;
        const a = 0.25 + 0.5 * Math.sin(t / 700 + p.ph) ** 2;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, 6.283);
        ctx.strokeStyle = `rgba(246,227,168,${a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.fillStyle = `rgba(246,227,168,${a * 0.25})`;
        ctx.fill();
      }
      if (on) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(draw); });
    io.observe(c);
    window.addEventListener("resize", size);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", size); };
  }, [count]);
  return <canvas ref={ref} className={className} aria-hidden />;
}
