import { useId } from "react";

const rd = (v: number) => Math.round(v * 100) / 100;
const P = (r: number, a: number, c = 100): [number, number] => [rd(c + Math.cos(a) * r), rd(c + Math.sin(a) * r)];
const pts = (...p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

// A round-brilliant ruby seen from above, facet by facet. Facet tones are chosen to read as refraction:
// light table, alternating bright/dark stars and kites, glints that twinkle.
const TONES = ["#ff5a76", "#c01334", "#e8304f", "#7d0a20", "#f4708a", "#a80f2c", "#d2203f", "#5e0617"];
export function Ruby({ className = "", glint = true }: { className?: string; glint?: boolean }) {
  const id = useId().replace(/:/g, "");
  const N = 8, R = 92, rt = 44, rs = 66;
  const facets: { p: string; f: string; o?: number }[] = [];
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2 - Math.PI / 2 + Math.PI / N, a1 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2 + Math.PI / N;
    const am = (a0 + a1) / 2;
    const t0 = P(rt, a0), t1 = P(rt, a1), s = P(rs, am), g0 = P(R, a0), g1 = P(R, a1), gm = P(R, am);
    const sPrev = P(rs, a0 - Math.PI / N);
    facets.push({ p: pts(t0, t1, s), f: TONES[(i * 3) % 8] });
    facets.push({ p: pts(t0, sPrev, g0, s), f: TONES[(i * 5 + 1) % 8] });
    facets.push({ p: pts(s, g0, gm), f: TONES[(i * 7 + 2) % 8], o: 0.95 });
    facets.push({ p: pts(s, gm, g1), f: TONES[(i * 3 + 5) % 8], o: 0.95 });
  }
  const table = Array.from({ length: N }, (_, i) => P(rt, (i / N) * Math.PI * 2 - Math.PI / 2 + Math.PI / N));
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-t`} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ff9fb0" /><stop offset=".5" stopColor="#d81f42" /><stop offset="1" stopColor="#8e0b25" /></radialGradient>
        <radialGradient id={`${id}-v`} cx="50%" cy="50%" r="50%"><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#2a0008" stopOpacity=".55" /></radialGradient>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7dc9e" /><stop offset=".5" stopColor="#a8742f" /><stop offset="1" stopColor="#f0cd85" /></linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <circle cx="100" cy="104" r="86" fill="#ff2d55" opacity=".35" filter={`url(#${id}-glow)`} className="rb-pulse" />
      {/* gold bezel with milgrain */}
      <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#${id}-g)`} strokeWidth="5" />
      {Array.from({ length: 64 }, (_, i) => { const [x, y] = P(99.5, (i / 64) * Math.PI * 2); return <circle key={i} cx={x} cy={y} r=".9" fill="#f6dba0" />; })}
      {facets.map((f, i) => <polygon key={i} points={f.p} fill={f.f} opacity={f.o ?? 1} stroke="#ffb3c0" strokeOpacity=".35" strokeWidth=".4" />)}
      <polygon points={pts(...table)} fill={`url(#${id}-t)`} stroke="#ffc9d3" strokeOpacity=".5" strokeWidth=".5" />
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-v)`} />
      <path d="M62 70 Q82 50 112 52" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" strokeLinecap="round" />
      {glint && [[72, 64, 0], [128, 86, 1.3], [96, 132, 2.4], [140, 128, 3.1]].map(([x, y, d], i) => (
        <path key={i} className="rb-glint" style={{ animationDelay: `${d}s` }} d={`M${x} ${y - 9}L${x + 1.4} ${y - 1.4}L${x + 9} ${y}L${x + 1.4} ${y + 1.4}L${x} ${y + 9}L${x - 1.4} ${y + 1.4}L${x - 9} ${y}L${x - 1.4} ${y - 1.4}Z`} fill="#fff" />
      ))}
    </svg>
  );
}

/** Two interlocked gold bands. */
export function Rings({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbe6b4" /><stop offset=".35" stopColor="#b8823d" /><stop offset=".65" stopColor="#f3d18c" /><stop offset="1" stopColor="#8a5a22" /></linearGradient>
      </defs>
      <ellipse cx="62" cy="54" rx="34" ry="34" stroke={`url(#${id}-a)`} strokeWidth="5.5" />
      <ellipse cx="98" cy="54" rx="34" ry="34" stroke={`url(#${id}-a)`} strokeWidth="5.5" />
      <path d="M76.37 23.19 A34 34 0 0 1 94.84 45.2" stroke="#2a0710" strokeWidth="8.5" />
      <path d="M76.37 23.19 A34 34 0 0 1 94.84 45.2" stroke={`url(#${id}-a)`} strokeWidth="5.5" />
      <path d="M86 16 l3 -9 l3 9 l-3 3z" fill="#ff4d6d" stroke="#f6dba0" strokeWidth=".8" />
    </svg>
  );
}

/** Art-deco stepped corner in gold line. */
export function DecoCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth=".8">
      <path d="M2 58V2h56" /><path d="M8 58V8h50" /><path d="M14 40V14h26" /><path d="M14 22h8v-8" /><circle cx="22" cy="22" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Velvet folds — the curtain and all claret surfaces. */
export const VELVET = "radial-gradient(120% 70% at 50% 0%, rgba(255,90,120,.16), transparent 60%), radial-gradient(90% 60% at 50% 110%, rgba(0,0,0,.55), transparent 70%), linear-gradient(180deg, #33091a, #22050f)";
export const FOLDS = "repeating-linear-gradient(90deg, #3d0816 0px, #6e1230 22px, #8c1b3b 34px, #5a0d25 52px, #2c0410 74px)";
