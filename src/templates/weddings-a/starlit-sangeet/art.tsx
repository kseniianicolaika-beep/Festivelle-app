"use client";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import { r1, rng } from "../_shared/data";

// Starlit Sangeet — midnight-blue night of music. Hand-built SVG: a constellation that joins two names,
// shisha mirrorwork, fairy-light swags, a dhol in fine gold line, deco sunbursts, a crescent moon.
const GOLD = "var(--t-gold)";
const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

/** Static twinkling star dust (SVG) — always present, the WebGL field layers on top for full sites. */
export function StarDust({ count = 90, seed = 3, className = "", still = false, h = 1000 }: { count?: number; seed?: number; className?: string; still?: boolean; h?: number }) {
  const R = rng(seed);
  const pts = Array.from({ length: count }, () => ({ x: r1(R() * 1000), y: r1(R() * h), r: r1(0.5 + R() * R() * 2.6), d: r1(R() * 5), gold: R() > 0.8 }));
  return (
    <svg viewBox={`0 0 1000 ${h}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      {pts.map((p, i) => (
        <g key={i} style={still ? undefined : { animation: `wa-twinkle ${2.5 + p.d}s ease-in-out ${-p.d}s infinite` }}>
          <circle cx={p.x} cy={p.y} r={p.r} fill={p.gold ? "#f6d68a" : "#f4ecff"} />
          {p.r > 2 && <path d={`M${p.x - p.r * 4} ${p.y}H${p.x + p.r * 4}M${p.x} ${p.y - p.r * 4}V${p.y + p.r * 4}`} stroke="#fff6dc" strokeWidth=".6" opacity=".7" />}
        </g>
      ))}
    </svg>
  );
}

// Two small constellations (one per partner) joined by a single bright line — the "&".
const LEFT: [number, number][] = [[90, 300], [170, 210], [260, 250], [300, 150], [380, 190], [420, 300], [330, 360], [210, 390]];
const RIGHT: [number, number][] = [[580, 300], [620, 180], [700, 140], [790, 210], [880, 170], [910, 280], [820, 370], [690, 360]];
const LINKS_L = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 6]];
const LINKS_R = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [3, 7]];
export function Constellation({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const seg = (a: [number, number], b: [number, number]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
  return (
    <svg viewBox="0 0 1000 520" className={className} style={style} aria-hidden fill="none">
      <g stroke="#e9d9ff" strokeOpacity=".45" strokeWidth="1">
        {LINKS_L.map(([a, b], i) => <path key={"l" + i} data-cline d={seg(LEFT[a], LEFT[b])} />)}
        {LINKS_R.map(([a, b], i) => <path key={"r" + i} data-cline d={seg(RIGHT[a], RIGHT[b])} />)}
      </g>
      <path data-clink d={seg(LEFT[5], RIGHT[0])} stroke={GOLD} strokeWidth="1.4" strokeDasharray="2 6" strokeLinecap="round" />
      {[...LEFT, ...RIGHT].map(([x, y], i) => (
        <g key={i} data-cstar style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}>
          <circle cx={x} cy={y} r={i % 3 === 0 ? 9 : 6} fill="#fff4cf" opacity=".18" />
          <circle cx={x} cy={y} r={i % 3 === 0 ? 3.2 : 2.2} fill="#fffaf0" />
          {i % 3 === 0 && <path d={`M${x - 14} ${y}H${x + 14}M${x} ${y - 14}V${y + 14}`} stroke="#fff4cf" strokeWidth=".7" />}
        </g>
      ))}
    </svg>
  );
}

/** Shisha — a little round mirror held by chain-stitch and buttonhole embroidery. */
export function Shisha({ className = "", style, petals = 12 }: { className?: string; style?: CSSProperties; petals?: number }) {
  const id = uidOf(useId());
  return (
    <svg viewBox="-50 -50 100 100" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`${id}m`} cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".35" stopColor="#c9cfe8" />
          <stop offset=".7" stopColor="#6b6f9a" />
          <stop offset="1" stopColor="#dfe3ff" />
        </radialGradient>
      </defs>
      {Array.from({ length: petals }, (_, i) => (
        <path key={i} d="M0 -26 C6 -32 6 -42 0 -47 C-6 -42 -6 -32 0 -26Z" fill="none" stroke={GOLD} strokeWidth="1.3" transform={`rotate(${(i * 360) / petals})`} />
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <circle key={"d" + i} cx="0" cy="-36" r="1.6" fill="#e9a3c9" transform={`rotate(${(i * 360) / petals + 180 / petals})`} />
      ))}
      <circle r="24" fill="none" stroke={GOLD} strokeWidth="3.5" strokeDasharray="1.2 1.6" />
      <circle r="19" fill={`url(#${id}m)`} />
      <path d="M-12 -8 A15 15 0 0 1 4 -16" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".9" />
    </svg>
  );
}

/** A swag of fairy lights. width units = 1000, sag in units. */
export function FairyLights({ className = "", sag = 80, bulbs = 26, still = false, seed = 5 }: { className?: string; sag?: number; bulbs?: number; still?: boolean; seed?: number }) {
  const R = rng(seed);
  const id = uidOf(useId());
  const y = (t: number) => 10 + 4 * sag * t * (1 - t);
  const d = Array.from({ length: 41 }, (_, i) => { const t = i / 40; return `${i ? "L" : "M"}${r1(t * 1000)} ${r1(y(t))}`; }).join("");
  return (
    <svg viewBox={`0 0 1000 ${sag + 50}`} preserveAspectRatio="none" className={className} aria-hidden>
      <defs><radialGradient id={`${id}h`}><stop offset="0" stopColor="#ffd88a" stopOpacity=".75" /><stop offset=".4" stopColor="#ffc861" stopOpacity=".2" /><stop offset="1" stopColor="#ffc861" stopOpacity="0" /></radialGradient></defs>
      <path d={d} fill="none" stroke="#3a3f70" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      {Array.from({ length: bulbs }, (_, i) => {
        const t = (i + 0.5) / bulbs, x = r1(t * 1000), yy = r1(y(t) + 5), dl = r1(R() * 3);
        return (
          <g key={i} style={still ? undefined : { animation: `wa-twinkle ${1.8 + dl}s ease-in-out ${-dl}s infinite` }}>
            <circle cx={x} cy={yy + 4} r="13" fill={`url(#${id}h)`} />
            <path d={`M${x} ${yy - 3}v3`} stroke="#3a3f70" strokeWidth="1.5" />
            <ellipse cx={x} cy={yy + 4} rx="2.6" ry="3.8" fill={i % 4 === 1 ? "#ffd98a" : "#fff3d6"} />
          </g>
        );
      })}
    </svg>
  );
}

/** Dhol — barrel drum in fine gold line with rope lacing, strap and the two sticks (dagga & tilli). */
export function Dhol({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const lace = Array.from({ length: 9 }, (_, i) => { const x0 = 40 + i * 15, bul = 7 * Math.sin((i / 8) * Math.PI); return `M${x0} ${r1(44 - bul)} L${x0 + 7.5} ${r1(106 + bul)} L${x0 + 15} ${r1(44 - bul)}`; }).join(" ");
  return (
    <svg viewBox="0 0 240 170" className={className} style={style} aria-hidden fill="none" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round">
      <ellipse cx="34" cy="75" rx="14" ry="33" />
      <ellipse cx="34" cy="75" rx="9" ry="26" strokeOpacity=".5" />
      <path d="M34 42 C 90 24, 150 24, 206 42 M34 108 C 90 126, 150 126, 206 108" />
      <ellipse cx="206" cy="75" rx="14" ry="33" />
      <path d={lace} strokeWidth=".8" strokeOpacity=".85" />
      <path d="M40 44 C 100 28, 140 28, 200 44 M40 106 C 100 122, 140 122, 200 106" strokeWidth="2.2" strokeOpacity=".7" />
      <path d="M30 40 C 60 -4, 180 -4, 210 40" strokeDasharray="3 3" strokeOpacity=".7" />
      <path d="M150 128 L226 156" strokeWidth="2.4" /><path d="M222 154 a5 5 0 1 0 6 -4" />
      <path d="M86 132 C 60 140, 30 150, 12 164" strokeWidth="1.6" />
      {[[120, 26], [118, 124], [64, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill={GOLD} stroke="none" />)}
    </svg>
  );
}

/** Art-deco sunburst fan rising from the bottom edge. */
export function Fan({ className = "", rays = 23, style }: { className?: string; rays?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 200" className={className} style={style} aria-hidden fill="none" stroke={GOLD} strokeWidth=".9">
      {[190, 160, 128, 96].map((r, i) => <path key={i} d={`M${200 - r} 200 A${r} ${r} 0 0 1 ${200 + r} 200`} strokeOpacity={0.35 + i * 0.18} />)}
      {Array.from({ length: rays }, (_, i) => {
        const a = Math.PI + ((i + 1) / (rays + 1)) * Math.PI;
        return <path key={i} d={`M${r1(200 + Math.cos(a) * 60)} ${r1(200 + Math.sin(a) * 60)}L${r1(200 + Math.cos(a) * (i % 2 ? 160 : 190))} ${r1(200 + Math.sin(a) * (i % 2 ? 160 : 190))}`} strokeOpacity={i % 2 ? 0.5 : 0.9} />;
      })}
      <path d="M140 200 A60 60 0 0 1 260 200" fill={GOLD} fillOpacity=".12" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${170 + i * 0} 200`} />)}
    </svg>
  );
}

export function Moon({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = uidOf(useId());
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <defs><radialGradient id={`${id}g`}><stop offset="0" stopColor="#fff1c2" stopOpacity=".45" /><stop offset="1" stopColor="#fff1c2" stopOpacity="0" /></radialGradient></defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${id}g)`} />
      <path d="M58 18a33 33 0 1 0 24 52A27 27 0 0 1 58 18z" fill="#f6e2a8" />
    </svg>
  );
}

/** Stepped deco corner ornament (place 4 copies rotated). */
export function DecoCorner({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden fill="none" stroke={GOLD} strokeWidth="1">
      <path d="M2 58V20h8V10h10V2h38" />
      <path d="M8 58V26h8V16h10V8h32" strokeOpacity=".55" />
      <path d="M14 14l6 6M2 2l10 10" strokeOpacity=".7" />
      <circle cx="22" cy="22" r="2" fill={GOLD} />
    </svg>
  );
}

/** WebGL starfield (ogl): soft points that twinkle and drift with scroll/pointer. Pauses offscreen. */
export function GlStars({ className = "", count = 420 }: { className?: string; count?: number }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, alive = true, visible = true, dispose = () => {};
    (async () => {
      try {
        const { Renderer, Program, Geometry, Mesh } = await import("ogl");
        if (!alive) return;
        const renderer = new Renderer({ dpr: Math.min(2, window.devicePixelRatio || 1), alpha: true, antialias: false });
        const gl = renderer.gl;
        gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
        el.appendChild(gl.canvas);
        const R = rng(11), pos = new Float32Array(count * 3), rnd = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          pos.set([R() * 2 - 1, R() * 2 - 1, R()], i * 3);
          rnd.set([1 + R() * R() * 5, R() * 6.28, R() > 0.82 ? 1 : 0], i * 3);
        }
        const geometry = new Geometry(gl, { position: { size: 3, data: pos }, random: { size: 3, data: rnd } });
        const program = new Program(gl, {
          vertex: `attribute vec3 position; attribute vec3 random; uniform float uTime; uniform vec2 uShift; uniform float uDpr; varying float vA; varying float vGold;
            void main(){ vec2 p = position.xy + uShift * (0.2 + position.z); p = mod(p + 1.0, 2.0) - 1.0;
              float tw = 0.55 + 0.45 * sin(uTime * (0.6 + position.z * 1.4) + random.y);
              vA = tw * (0.35 + position.z * 0.65); vGold = random.z;
              gl_Position = vec4(p, 0.0, 1.0); gl_PointSize = random.x * uDpr * (0.8 + tw * 0.6); }`,
          fragment: `precision mediump float; varying float vA; varying float vGold;
            void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); float a = smoothstep(0.5, 0.0, d); a *= a;
              vec3 col = mix(vec3(0.96, 0.93, 1.0), vec3(1.0, 0.84, 0.5), vGold); gl_FragColor = vec4(col, a * vA); }`,
          uniforms: { uTime: { value: 0 }, uShift: { value: [0, 0] }, uDpr: { value: renderer.dpr } },
          transparent: true, depthTest: false,
        });
        const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
        const size = () => renderer.setSize(el.clientWidth, el.clientHeight);
        size();
        const ro = new ResizeObserver(size); ro.observe(el);
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }); io.observe(el);
        let px = 0, py = 0, tx = 0, ty = 0;
        const onMove = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * 0.06; ty = (e.clientY / window.innerHeight - 0.5) * -0.06; };
        window.addEventListener("pointermove", onMove);
        const t0 = performance.now();
        function loop(now: number) {
          raf = 0;
          if (!alive || !visible) return;
          px += (tx - px) * 0.05; py += (ty - py) * 0.05;
          program.uniforms.uTime.value = (now - t0) / 1000;
          program.uniforms.uShift.value = [px, py + window.scrollY * 0.00025];
          renderer.render({ scene: mesh });
          raf = requestAnimationFrame(loop);
        }
        raf = requestAnimationFrame(loop);
        dispose = () => { ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", onMove); gl.getExtension("WEBGL_lose_context")?.loseContext(); gl.canvas.remove(); };
      } catch { /* no WebGL: the SVG star dust carries the scene */ }
    })();
    return () => { alive = false; cancelAnimationFrame(raf); dispose(); };
  }, [count]);
  return <div ref={host} className={className} aria-hidden />;
}
