"use client";
import { useEffect, useId, useRef } from "react";

const rd = (v: number) => Math.round(v * 100) / 100;

/** Cusped (multifoil) Mughal arch: pointed outline with inward scallops. Returns a path in a w×h box. */
export function cuspedArch(w: number, h: number, spring: number, n = 9, cusp = 0.62) {
  const rise = spring * 0.98;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI;
    const s = Math.pow(Math.sin(t), 0.62);
    const tip = Math.max(0, 1 - Math.abs(t - Math.PI / 2) / 0.5) * spring * 0.08;
    pts.push([rd(w / 2 - (w / 2) * Math.cos(t)), rd(spring - rise * s * 0.92 - tip)]);
  }
  let d = `M0 ${h} L0 ${spring}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const r = rd(Math.hypot(x1 - x0, y1 - y0) * cusp);
    d += ` A${r} ${r} 0 0 1 ${x1} ${y1}`;
  }
  return d + ` L${w} ${h}`;
}

/** Jaali lattice as a CSS background (gold line on transparent). */
export const JAALI = (stroke = "#e2b356", op = 0.35) => {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><g fill='none' stroke='${stroke}' stroke-opacity='${op}' stroke-width='.8'><path d='M18 2 L22 14 L34 18 L22 22 L18 34 L14 22 L2 18 L14 14 Z'/><circle cx='18' cy='18' r='3.2'/><path d='M0 0 L6 6 M36 0 L30 6 M0 36 L6 30 M36 36 L30 30'/></g></svg>`;
  return `url("data:image/svg+xml;utf8,${s.replace(/#/g, "%23")}")`;
};

/** The jharokha frame: three nested cusped arches in gold, with a finial and lotus at the apex. */
export function Jharokha({ className = "", w = 400, h = 560, spring = 230, draw = false, fill }: { className?: string; w?: number; h?: number; spring?: number; draw?: boolean; fill?: string }) {
  const id = useId().replace(/:/g, "");
  const outer = cuspedArch(w, h, spring, 11);
  return (
    <svg viewBox={`-14 -40 ${w + 28} ${h + 44}`} className={className} aria-hidden fill="none" preserveAspectRatio="none" data-draw={draw ? "" : undefined}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbe3a2" /><stop offset=".4" stopColor="#c8912f" /><stop offset=".7" stopColor="#f6d488" /><stop offset="1" stopColor="#9b6a1f" /></linearGradient>
      </defs>
      {fill && <path d={outer} fill={fill} />}
      <path d={outer} stroke={`url(#${id}-g)`} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      <path d={cuspedArch(w - 28, h - 14, spring - 6, 11)} transform="translate(14 14)" stroke={`url(#${id}-g)`} strokeWidth="1" strokeOpacity=".7" vectorEffect="non-scaling-stroke" />
      <path d={cuspedArch(w - 52, h - 26, spring - 10, 9, 0.5)} transform="translate(26 26)" stroke={`url(#${id}-g)`} strokeWidth=".7" strokeOpacity=".45" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
      <g transform={`translate(${w / 2} ${spring * 0.02 - 8})`} stroke={`url(#${id}-g)`} strokeWidth="1.4" vectorEffect="non-scaling-stroke">
        <path d="M0 -30 L0 -8 M-9 -12 Q0 -26 9 -12 Q0 -4 -9 -12 Z M-14 -2 Q0 -14 14 -2" />
        <circle cx="0" cy="-33" r="2.4" fill="#f6d488" />
      </g>
    </svg>
  );
}

/** Marigold toran — swags of genda phool with mango leaves; sways gently. */
export function Toran({ className = "", swags = 5, animate = true }: { className?: string; swags?: number; animate?: boolean }) {
  const id = useId().replace(/:/g, "");
  const W = 1000, sw = W / swags, sag = 70;
  const flowers: { x: number; y: number; r: number; c: number }[] = [];
  for (let s = 0; s < swags; s++) {
    const x0 = s * sw;
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      flowers.push({ x: rd(x0 + sw * t), y: rd(10 + sag * 4 * t * (1 - t)), r: k === 0 || k === 10 ? 11 : 13 - Math.abs(5 - k) * 0.5, c: (s + k) % 3 });
    }
  }
  const drops = Array.from({ length: swags + 1 }, (_, s) => s * sw);
  return (
    <svg viewBox={`-20 -10 ${W + 40} 200`} className={className} aria-hidden>
      <defs>
        {["#f7a823", "#ef7d14", "#ffc43d"].map((c, i) => (
          <radialGradient key={i} id={`${id}-m${i}`} cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#fff1a8" /><stop offset=".35" stopColor={c} /><stop offset="1" stopColor={i === 1 ? "#a8420a" : "#b8650b"} /></radialGradient>
        ))}
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5d8a2c" /><stop offset="1" stopColor="#24461a" /></linearGradient>
        <filter id={`${id}-r`}><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter>
      </defs>
      <line x1="-20" y1="6" x2={W + 20} y2="6" stroke="#8a5a14" strokeWidth="2" />
      {drops.map((x, i) => (
        <g key={i} className={animate ? "gj-sway" : ""} style={{ animationDelay: `${i * 0.37}s`, transformOrigin: `${x}px 6px` }}>
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={x} cy={22 + k * 24} r={10 - k * 0.6} fill={`url(#${id}-m${(i + k) % 3})`} filter={`url(#${id}-r)`} />)}
          <path d={`M${x} 112 q-7 14 0 30 q7 -16 0 -30z`} fill="#c0392b" />
          <circle cx={x} cy={112} r="3" fill="#e2b356" />
        </g>
      ))}
      {flowers.map((f, i) => (
        <g key={i}>
          {i % 2 === 0 && <path d={`M${f.x} ${f.y} q 10 18 -2 34 q -10 -18 2 -34z`} fill={`url(#${id}-l)`} opacity=".9" />}
          <circle cx={f.x} cy={f.y} r={f.r} fill={`url(#${id}-m${f.c})`} filter={`url(#${id}-r)`} />
        </g>
      ))}
    </svg>
  );
}

/** A clay diya with a living flame. */
export function Diya({ className = "", flicker = true, delay = 0 }: { className?: string; flicker?: boolean; delay?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 70" className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}-f`} cx="50%" cy="70%" r="60%"><stop offset="0" stopColor="#fffbe0" /><stop offset=".45" stopColor="#ffc93c" /><stop offset="1" stopColor="#ff6a00" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-h`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffb648" stopOpacity=".55" /><stop offset="1" stopColor="#ffb648" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2b356" /><stop offset=".25" stopColor="#b5542a" /><stop offset="1" stopColor="#5a1d0d" /></linearGradient>
      </defs>
      <circle cx="30" cy="30" r="30" fill={`url(#${id}-h)`} className={flicker ? "gj-glow" : ""} style={{ animationDelay: `${delay}s` }} />
      <path className={flicker ? "gj-flame" : ""} style={{ animationDelay: `${delay}s`, transformOrigin: "30px 44px", transformBox: "view-box" }} d="M30 14 C35 26 38 34 30 44 C22 34 25 26 30 14 Z" fill={`url(#${id}-f)`} />
      <path d="M6 44 Q30 40 54 44 Q50 62 30 64 Q10 62 6 44 Z" fill={`url(#${id}-c)`} />
      <path d="M8 45 Q30 50 52 45" stroke="#f6d488" strokeWidth="1" fill="none" />
      <path d="M14 54 h32" stroke="#f6d488" strokeOpacity=".5" strokeDasharray="1 3" />
    </svg>
  );
}

/** Surya — the Rajput sun, a rayed medallion that turns very slowly behind the numeral. */
export function Surya({ className = "", spin = true }: { className?: string; spin?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-s`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffe7a3" stopOpacity=".5" /><stop offset=".55" stopColor="#e2b356" stopOpacity=".18" /><stop offset="1" stopColor="#e2b356" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbe3a2" /><stop offset=".5" stopColor="#b98428" /><stop offset="1" stopColor="#f6d488" /></linearGradient>
      </defs>
      <circle cx="200" cy="200" r="200" fill={`url(#${id}-s)`} />
      <g className={spin ? "gj-spin" : ""} style={{ transformOrigin: "200px 200px", transformBox: "view-box" }}>
        {Array.from({ length: 32 }, (_, i) => (
          <path key={i} transform={`rotate(${i * 11.25} 200 200)`} d={i % 2 ? "M200 40 L206 118 L200 126 L194 118 Z" : "M200 18 Q214 70 200 120 Q186 70 200 18 Z"} fill={i % 2 ? "none" : `url(#${id}-g)`} stroke={`url(#${id}-g)`} strokeWidth=".8" opacity={i % 2 ? 0.8 : 0.9} />
        ))}
      </g>
      <circle cx="200" cy="200" r="78" fill="none" stroke={`url(#${id}-g)`} strokeWidth="2" />
      <circle cx="200" cy="200" r="70" fill="none" stroke={`url(#${id}-g)`} strokeWidth=".8" strokeDasharray="2 5" />
    </svg>
  );
}

/** Palace at dusk: central dome, chhatris, lit jharokha windows. */
export function Palace({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const chhatri = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-22" y="0" width="44" height="6" />
      <rect x="-18" y="6" width="4" height="26" /><rect x="14" y="6" width="4" height="26" /><rect x="-2" y="6" width="4" height="26" />
      <path d="M-24 0 Q-22 -26 0 -32 Q22 -26 24 0 Z" />
      <path d="M0 -32 V-44" stroke="currentColor" strokeWidth="2" /><circle cx="0" cy="-46" r="2.5" />
    </g>
  );
  return (
    <svg viewBox="0 0 1200 360" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#64202a" /><stop offset=".5" stopColor="#3a0c13" /><stop offset="1" stopColor="#1c0407" /></linearGradient>
      </defs>
      <g fill={`url(#${id}-b)`} color="#e2b356" stroke="#e2b356" strokeOpacity=".45" strokeWidth="1">
        <path d="M520 150 Q520 40 600 18 Q680 40 680 150 Z" />
        <rect x="596" y="-6" width="8" height="26" /><circle cx="600" cy="-10" r="6" />
        <rect x="500" y="148" width="200" height="40" />
        <rect x="300" y="186" width="600" height="180" />
        <rect x="160" y="236" width="140" height="130" /><rect x="900" y="236" width="140" height="130" />
        <rect x="80" y="276" width="80" height="90" /><rect x="1040" y="276" width="80" height="90" />
        {chhatri(330, 156, 1)}{chhatri(870, 156, 1)}{chhatri(190, 206, 0.8)}{chhatri(1010, 206, 0.8)}{chhatri(450, 156, 0.7)}{chhatri(750, 156, 0.7)}
        {Array.from({ length: 30 }, (_, i) => <rect key={i} x={300 + i * 20} y="178" width="10" height="9" />)}
      </g>
      {[[340, 230], [400, 230], [460, 230], [540, 230], [600, 230], [660, 230], [740, 230], [800, 230], [860, 230], [340, 300], [400, 300], [460, 300], [740, 300], [800, 300], [860, 300], [200, 280], [260, 280], [940, 280], [1000, 280], [560, 168], [640, 168]].map(([x, y], i) => (
        <path key={i} className="gj-win" style={{ animationDelay: `${(i * 0.53) % 3}s` }} d={`M${x - 9} ${y + 26} V${y + 8} Q${x - 9} ${y - 4} ${x} ${y - 8} Q${x + 9} ${y - 4} ${x + 9} ${y + 8} V${y + 26} Z`} fill="#ffc35a" />
      ))}
      <path d="M560 366 V300 Q560 262 600 250 Q640 262 640 300 V366 Z" fill="#ffcf73" opacity=".85" className="gj-win" />
    </svg>
  );
}

/** WebGL gold dust (ogl). Light: ~240 additive points; stops off-screen; no-op without WebGL. */
export function GoldDust({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop = () => {};
    let cancelled = false;
    import("ogl").then(({ Renderer, Program, Geometry, Mesh }) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof Renderer>;
      try { renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: true, premultipliedAlpha: false }); } catch { return; }
      const gl = renderer.gl;
      gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      el.appendChild(gl.canvas);
      const N = 240, pos = new Float32Array(N * 3), seed = new Float32Array(N);
      for (let i = 0; i < N; i++) { pos[i * 3] = Math.random() * 2 - 1; pos[i * 3 + 1] = Math.random() * 2 - 1; pos[i * 3 + 2] = 0; seed[i] = Math.random(); }
      const program = new Program(gl, {
        vertex: `attribute vec3 position;attribute float seed;uniform float uTime;uniform float uDpr;varying float vA;
          void main(){vec3 p=position;p.y=mod(p.y+1.+uTime*.018*(.4+seed),2.)-1.;p.x+=sin(uTime*.4+seed*30.)*.04;
          gl_Position=vec4(p,1.);gl_PointSize=(1.5+seed*seed*5.)*uDpr;vA=(.25+.75*abs(sin(uTime*1.3+seed*40.)))*smoothstep(-1.,-.6,p.y);}`,
        fragment: `precision highp float;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.0,d)*vA;gl_FragColor=vec4(1.,.82,.45,a);}`,
        uniforms: { uTime: { value: 0 }, uDpr: { value: renderer.dpr } },
        transparent: true, depthTest: false,
      });
      program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
      const mesh = new Mesh(gl, { mode: gl.POINTS, geometry: new Geometry(gl, { position: { size: 3, data: pos }, seed: { size: 1, data: seed } }), program });
      const resize = () => renderer.setSize(el.clientWidth, el.clientHeight);
      resize();
      const ro = new ResizeObserver(resize); ro.observe(el);
      let raf = 0, visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); });
      io.observe(el);
      const t0 = performance.now();
      function loop(t: number) {
        raf = 0;
        if (!visible) return;
        program.uniforms.uTime.value = (t - t0) / 1000;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
      stop = () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); gl.getExtension("WEBGL_lose_context")?.loseContext(); gl.canvas.remove(); };
    });
    return () => { cancelled = true; stop(); };
  }, []);
  return <div ref={host} aria-hidden className={`pointer-events-none ${className}`} />;
}
