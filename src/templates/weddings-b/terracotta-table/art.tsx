"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useGid } from "../_shared/kit";

// Terracotta Table — golden hour in an Assagao garden. Painted in layers: dusk sky and a low sun, the clay
// villa with its lamp-lit arcade, rain-tree canopies strung with bulbs, the long dinner table with candles,
// and pampas plumes in the foreground. Hooks for the stage: [data-sun] [data-plume] (data-o pivot)
// [data-flame] [data-bulb] [data-draw].

const r1 = (n: number) => Math.round(n * 10) / 10;
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** One pampas plume: a bowed stem with a feathery head of short strokes, plus two blades. */
function plume(x: number, base: number, h: number, lean: number, seed: number, color: string, key: string, w = 1) {
  const rand = rng(seed);
  const tipX = x + lean, tipY = base - h;
  const cx = x + lean * 0.2, cy = base - h * 0.55;
  const at = (t: number): [number, number] => { const u = 1 - t; return [u * u * x + 2 * u * t * cx + t * t * tipX, u * u * base + 2 * u * t * cy + t * t * tipY]; };
  const feathers: ReactNode[] = [];
  const n = Math.round(38 * w);
  for (let i = 0; i < n; i++) {
    const t = 0.55 + 0.45 * (i / n) + rand() * 0.02;
    const [px, py] = at(Math.min(t, 1));
    const spread = (1 - Math.abs(t - 0.8) * 2.6) * 26 * w + 6;
    const side = rand() > 0.5 ? 1 : -1;
    const len = spread * (0.6 + rand() * 0.6);
    const ex = px + side * len * 0.9 + lean * 0.06, ey = py - len * (0.35 + rand() * 0.5);
    feathers.push(<path key={i} d={`M${r1(px)} ${r1(py)}Q${r1((px + ex) / 2 + side * 3)} ${r1((py + ey) / 2 + 6)} ${r1(ex)} ${r1(ey)}`} />);
  }
  return (
    <g key={key} data-plume data-o={`${r1(x)} ${base}`}>
      <path d={`M${x} ${base}Q${r1(cx)} ${r1(cy)} ${r1(tipX)} ${r1(tipY)}`} stroke="#a88a62" strokeWidth={1.4 * w} fill="none" />
      <g stroke={color} strokeWidth={1.5 * w} strokeLinecap="round" fill="none" opacity={0.85}>{feathers}</g>
    </g>
  );
}
function blades(x: number, base: number, seed: number, key: string, s = 1) {
  const rand = rng(seed);
  return (
    <g key={key} stroke="#6f6a3f" strokeWidth={1.6 * s} fill="none" strokeLinecap="round" opacity={0.85}>
      {Array.from({ length: 7 }, (_, i) => {
        const lean = (rand() - 0.5) * 220 * s, h = (90 + rand() * 120) * s;
        return <path key={i} d={`M${r1(x + (rand() - 0.5) * 30 * s)} ${base}Q${r1(x + lean * 0.3)} ${r1(base - h * 0.8)} ${r1(x + lean)} ${r1(base - h * 0.55)}`} />;
      })}
    </g>
  );
}

/** A clump of pampas (cards, dividers). viewBox 0 0 200 400. */
export function Pampas({ className, style, seed = 3, color = "#efdcbc" }: { className?: string; style?: CSSProperties; seed?: number; color?: string }) {
  return (
    <svg viewBox="0 0 200 400" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      {blades(100, 400, seed + 1, "b", 0.8)}
      {plume(96, 400, 330, -46, seed, color, "a", 0.9)}
      {plume(104, 400, 370, 18, seed + 2, color, "b2", 1)}
      {plume(100, 400, 290, 62, seed + 4, color, "c", 0.8)}
    </svg>
  );
}

function canopy(cx: number, cy: number, rx: number, ry: number, seed: number, key: string) {
  const rand = rng(seed);
  const blobs: ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand());
    const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
    blobs.push(<circle key={i} cx={r1(x)} cy={r1(y)} r={r1(40 + rand() * 70)} fill={i % 3 ? "#4a4428" : "#5d5530"} fillOpacity={0.92} />);
  }
  return <g key={key}>{blobs}</g>;
}

/** The full golden-hour scene. viewBox 0 0 1600 900; crops from the bottom-centre. */
export function Scene({ className, style, lights = true }: { className?: string; style?: CSSProperties; lights?: boolean }) {
  const sky = useGid("tsky"), sun = useGid("tsun"), glow = useGid("tglow"), cloth = useGid("tcloth"), earth = useGid("tearth"), lamp = useGid("tlamp"), soft = useGid("tsoft");
  const arches = [0, 1, 2, 3, 4];
  const ts = [0.08, 0.26, 0.44, 0.6, 0.74, 0.86];
  // table: far end (800..900 @ y700) → near end (430..1270 @ y900)
  const tl = (t: number) => 800 - 370 * t, tr = (t: number) => 900 + 370 * t, ty = (t: number) => 700 + 200 * t;
  const bulbs = (x0: number, y0: number, x1: number, y1: number, sag: number, n: number, k: string) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n, u = 1 - t, mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag;
      const x = u * u * x0 + 2 * u * t * mx + t * t * x1, y = u * u * y0 + 2 * u * t * my + t * t * y1;
      return <g key={k + i} data-bulb><circle cx={r1(x)} cy={r1(y)} r="11" fill="#ffd48a" fillOpacity="0.25" /><circle cx={r1(x)} cy={r1(y)} r="3.4" fill="#fff0c8" /></g>;
    });
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7b39c" /><stop offset="0.38" stopColor="#f0c59a" /><stop offset="0.66" stopColor="#f6d9a6" /><stop offset="0.8" stopColor="#f2c487" />
        </linearGradient>
        <radialGradient id={sun}><stop offset="0" stopColor="#fff7e2" /><stop offset="0.6" stopColor="#fde3a6" /><stop offset="1" stopColor="#f6c372" /></radialGradient>
        <radialGradient id={glow}><stop offset="0" stopColor="#fff1c9" stopOpacity="0.9" /><stop offset="1" stopColor="#f7c98a" stopOpacity="0" /></radialGradient>
        <linearGradient id={cloth} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3dcc0" /><stop offset="1" stopColor="#fbefe0" /></linearGradient>
        <linearGradient id={earth} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a5634" /><stop offset="1" stopColor="#4d2716" /></linearGradient>
        <radialGradient id={lamp} cy="0.75"><stop offset="0" stopColor="#ffd08a" /><stop offset="1" stopColor="#8a3b20" /></radialGradient>
        <filter id={soft}><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <rect width="1600" height="900" fill={`url(#${sky})`} />
      <g data-sun>
        <circle cx="1060" cy="600" r="300" fill={`url(#${glow})`} />
        <circle cx="1060" cy="600" r="74" fill={`url(#${sun})`} />
      </g>
      <path d="M0 640Q300 588 610 628T1200 606T1600 628V900H0Z" fill="#cf8b69" fillOpacity="0.55" />
      <path d="M0 676Q420 640 820 668T1600 660V900H0Z" fill="#b8704c" fillOpacity="0.55" />
      {/* coconut palm behind the villa */}
      <g stroke="#5a4528" strokeLinecap="round" fill="none">
        <path d="M560 600Q546 510 576 440" strokeWidth="9" />
        {[[-150, -10], [-110, 40], [-60, -70], [40, -60], [110, -10], [140, 45], [10, 30]].map(([dx, dy], i) => <path key={i} d={`M576 440q${dx * 0.45} ${dy * 0.8 - 34} ${dx * 0.9} ${dy * 0.8 + 26}`} strokeWidth="5" />)}
      </g>
      {/* villa: clay walls, tiled roof, lamp-lit arcade */}
      <path d="M96 566L470 468L846 566Z" fill="#9c4a2b" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${r1(140 + i * 20)} ${r1(556 - i * 14)}H${r1(800 - i * 20)}`} stroke="#7f3b22" strokeWidth="2" />)}
      <rect x="128" y="566" width="686" height="178" fill="#c8734a" />
      <rect x="128" y="566" width="686" height="12" fill="#e2a172" />
      {arches.map((i) => { const x = 172 + i * 128; return <path key={i} d={`M${x} 744V636A46 46 0 0 1 ${x + 92} 636V744Z`} fill={`url(#${lamp})`} />; })}
      {arches.map((i) => <rect key={i} x={160 + i * 128} y="590" width="6" height="154" fill="#e2a172" fillOpacity="0.6" />)}
      <path d="M128 744H814V758H128Z" fill="#a85a36" />
      <rect x="0" y="744" width="1600" height="156" fill={`url(#${earth})`} />
      {/* rain trees */}
      <path d="M150 900L176 520L196 420L214 520L236 900Z" fill="#3e3420" />
      <path d="M1420 900L1440 520L1452 400L1468 520L1490 900Z" fill="#3e3420" />
      {canopy(160, 170, 300, 170, 5, "cl")}
      {canopy(1470, 150, 300, 160, 9, "cr")}
      {lights && <g>{bulbs(300, 300, 1360, 270, 150, 22, "a")}{bulbs(340, 360, 1300, 340, 110, 18, "b")}</g>}
      {/* the long table */}
      <path d={`M${tl(0)} ${ty(0)}H${tr(0)}L${tr(1)} ${ty(1)}H${tl(1)}Z`} fill={`url(#${cloth})`} />
      <path d={`M${tl(0)} ${ty(0)}L${tl(1)} ${ty(1)}H${tl(1) - 26}L${tl(0) - 4} ${ty(0) + 6}Z`} fill="#d9b591" />
      <path d={`M${tr(0)} ${ty(0)}L${tr(1)} ${ty(1)}H${tr(1) + 26}L${tr(0) + 4} ${ty(0) + 6}Z`} fill="#d9b591" />
      {ts.map((t, i) => {
        const s = 0.3 + 0.9 * t, y = ty(t), x = 850, lx = tl(t) - 14 * s, rx = tr(t) + 14 * s;
        return (
          <g key={i}>
            {/* chairs */}
            <path d={`M${r1(lx - 10 * s)} ${r1(y + 2)}V${r1(y - 52 * s)}H${r1(lx + 6 * s)}V${r1(y + 2)}`} fill="#4a2c1c" />
            <path d={`M${r1(rx + 10 * s)} ${r1(y + 2)}V${r1(y - 52 * s)}H${r1(rx - 6 * s)}V${r1(y + 2)}`} fill="#4a2c1c" />
            {/* plates */}
            <ellipse cx={r1(tl(t) + 46 * s)} cy={r1(y - 3 * s)} rx={r1(18 * s)} ry={r1(5 * s)} fill="#fffaf2" stroke="#d6b48f" strokeWidth="1" />
            <ellipse cx={r1(tr(t) - 46 * s)} cy={r1(y - 3 * s)} rx={r1(18 * s)} ry={r1(5 * s)} fill="#fffaf2" stroke="#d6b48f" strokeWidth="1" />
            {/* candle */}
            <circle cx={x} cy={r1(y - 46 * s)} r={r1(26 * s)} fill="#ffd48a" fillOpacity="0.28" filter={`url(#${soft})`} />
            <rect x={r1(x - 4 * s)} y={r1(y - 36 * s)} width={r1(8 * s)} height={r1(34 * s)} fill="#fbf1e2" />
            <path data-flame d={`M${x} ${r1(y - 52 * s)}q${r1(6 * s)} ${r1(9 * s)} 0 ${r1(15 * s)}q${r1(-6 * s)} ${r1(-6 * s)} 0 ${r1(-15 * s)}z`} fill="#ffcf6e" />
            {/* greenery runner */}
            <ellipse cx={r1(x + 26 * s)} cy={r1(y - 4 * s)} rx={r1(16 * s)} ry={r1(5 * s)} fill="#6f7444" />
            <ellipse cx={r1(x - 24 * s)} cy={r1(y - 3 * s)} rx={r1(14 * s)} ry={r1(5 * s)} fill="#7d7a4a" />
          </g>
        );
      })}
      {/* foreground pampas */}
      {blades(110, 900, 31, "bl", 1.6)}
      {blades(1490, 900, 37, "br", 1.6)}
      {plume(70, 900, 360, -40, 3, "#f2e1c3", "p1", 1.5)}
      {plume(140, 900, 430, 30, 5, "#f6e7cc", "p2", 1.7)}
      {plume(220, 900, 330, 80, 7, "#ead6b4", "p3", 1.3)}
      {plume(1420, 900, 350, -70, 11, "#ead6b4", "p4", 1.4)}
      {plume(1500, 900, 440, -20, 13, "#f6e7cc", "p5", 1.7)}
      {plume(1560, 900, 340, 40, 17, "#f2e1c3", "p6", 1.3)}
    </svg>
  );
}

/** Goan villa facade in ink + clay wash: Mangalore-tile roof, columned balcão, oyster-shell windows. */
export function Villa({ className, style }: { className?: string; style?: CSSProperties }) {
  const ink = "#4a2a1c";
  const win = (x: number) => (
    <g key={x}>
      <path data-draw d={`M${x} 250V196A22 22 0 0 1 ${x + 44} 196V250Z`} fill="#f2d8bd" />
      {[1, 2, 3].map((k) => <path key={k} data-draw d={`M${x + k * 11} 252V${k === 2 ? 174 : 180}`} strokeWidth="0.6" />)}
      {[200, 216, 232].map((y) => <path key={y} data-draw d={`M${x} ${y}H${x + 44}`} strokeWidth="0.6" />)}
    </g>
  );
  return (
    <svg viewBox="0 0 520 330" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      <path d="M40 140H480V300H40Z" fill="#d98b5f" fillOpacity="0.45" />
      <path d="M20 142L260 52L500 142Z" fill="#b8572f" fillOpacity="0.55" />
      <g stroke={ink} strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
        <path data-draw d="M14 146L260 50L506 146" strokeWidth="1.6" />
        {Array.from({ length: 6 }, (_, i) => <path key={i} data-draw d={`M${r1(44 + i * 30)} ${r1(134 - i * 11.6)}H${r1(476 - i * 30)}`} strokeWidth="0.6" />)}
        <path data-draw d="M40 146V300M480 146V300M24 300H496" strokeWidth="1.3" />
        {/* pediment with a cross-window */}
        <path data-draw d="M236 108A24 24 0 0 1 284 108V128H236Z" />
        {/* balcão: columns, seats, steps */}
        <path data-draw d="M170 300V214M350 300V214M170 214H350M160 210H360" />
        <path data-draw d="M196 300V226M324 300V226" strokeWidth="0.8" />
        <path data-draw d="M170 268H196M324 268H350" strokeWidth="0.8" />
        <path data-draw d="M226 300V244A34 34 0 0 1 294 244V300" strokeWidth="1.3" />
        <path data-draw d="M214 300V306H306V300M206 306V312H314V306" strokeWidth="0.8" />
        {win(70)}{win(116)}{win(360)}{win(406)}
        {/* potted palms */}
        <path data-draw d="M150 300l4-18h14l4 18M354 300l4-18h14l4 18" strokeWidth="0.8" />
        <path data-draw d="M161 282q-14-24-28-26M161 282q2-28 16-38M161 282q-2-30-14-40M365 282q14-24 28-26M365 282q-2-28-16-38M365 282q2-30 14-40" strokeWidth="0.7" />
      </g>
    </svg>
  );
}

/** A candle in a hurricane glass — the schedule's markers. */
export function Candle({ className, style }: { className?: string; style?: CSSProperties }) {
  const g = useGid("tcg");
  return (
    <svg viewBox="0 0 40 70" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      <defs><radialGradient id={g}><stop offset="0" stopColor="#ffd48a" stopOpacity="0.7" /><stop offset="1" stopColor="#ffd48a" stopOpacity="0" /></radialGradient></defs>
      <circle cx="20" cy="26" r="18" fill={`url(#${g})`} />
      <path d="M8 66H32M12 66C6 50 6 30 12 14H28C34 30 34 50 28 66" stroke="#b8572f" strokeWidth="1" />
      <rect x="16" y="36" width="8" height="28" fill="#fbf1e2" stroke="#d9b591" strokeWidth="0.6" />
      <path data-flame d="M20 22q5 7 0 12q-5-5 0-12z" fill="#ffbf55" />
    </svg>
  );
}

/** Warm motes drifting through late light (2D canvas, paused off-screen). */
export function Dust({ className, count = 60 }: { className?: string; count?: number }) {
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
    const ps = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, vx: (Math.random() - 0.3) * 0.00012, vy: -0.00005 - Math.random() * 0.00012, ph: Math.random() * 6.28 }));
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx * 16; p.y += p.vy * 16;
        if (p.y < -0.02) p.y = 1.02; if (p.x > 1.02) p.x = -0.02; if (p.x < -0.02) p.x = 1.02;
        const a = 0.2 + 0.55 * Math.sin(t / 1100 + p.ph) ** 2;
        const x = p.x * w + Math.sin(t / 1500 + p.ph) * 8, y = p.y * h;
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 4);
        g.addColorStop(0, `rgba(255,236,190,${a})`);
        g.addColorStop(1, "rgba(255,220,160,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, p.r * 4, 0, 6.283); ctx.fill();
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
