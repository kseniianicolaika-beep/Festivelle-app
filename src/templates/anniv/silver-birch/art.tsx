import { useId } from "react";

const rd = (v: number) => Math.round(v * 10) / 10;
/** Deterministic PRNG (SSR/CSR identical). */
export function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** One silver-birch trunk: chalk-white bark, black lenticels, a knot and a few bare branches. */
export function Trunk({ seed = 1, h = 600, w = 34, className = "", branches = true, style, box }: { seed?: number; h?: number; w?: number; className?: string; branches?: boolean; style?: React.CSSProperties; box?: { x: number; y: number; width: number; height: number } }) {
  const id = useId().replace(/:/g, "");
  const r = rng(seed * 97 + 13);
  const lean = rd((r() - 0.5) * 18);
  const marks = Array.from({ length: Math.round(h / 26) }, (_, i) => {
    const y = rd(20 + i * 26 + r() * 12), side = r() > 0.5, len = rd(w * (0.25 + r() * 0.45)), th = rd(1.2 + r() * 2.6);
    return { y, x: side ? rd(w - len) : 0, len, th };
  });
  const brs = branches ? Array.from({ length: 4 }, (_, i) => {
    const y = rd(h * (0.08 + i * 0.13 + r() * 0.05)), right = i % 2 === 0, L = rd(60 + r() * 90);
    const x0 = right ? w - 3 : 3, x1 = right ? w + L : -L;
    return `M${x0} ${y} Q ${rd((x0 + x1) / 2)} ${rd(y - 30 - r() * 30)} ${rd(x1)} ${rd(y - 50 - r() * 50)} M${rd((x0 + x1) / 2)} ${rd(y - 26)} q ${right ? 12 : -12} -6 ${right ? 20 : -20} -34`;
  }) : [];
  return (
    <svg viewBox={`${-160} 0 ${w + 320} ${h}`} className={className} style={style} aria-hidden preserveAspectRatio="xMidYMax meet" overflow="visible" {...box}>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b9c3cc" /><stop offset=".22" stopColor="#f7f9fb" /><stop offset=".6" stopColor="#ffffff" /><stop offset="1" stopColor="#a6b1bc" /></linearGradient>
      </defs>
      <g transform={`skewX(${lean / 10})`}>
        <g stroke="#3b4652" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity=".75">{brs.map((d, i) => <path key={i} d={d} />)}</g>
        <path d={`M0 ${h} L1 0 L${w - 1} 0 L${w} ${h} Z`} fill={`url(#${id}-b)`} />
        {marks.map((m, i) => <rect key={i} x={m.x} y={m.y} width={m.len} height={m.th} rx={m.th / 2} fill="#1f262d" opacity=".85" />)}
        <path d={`M${rd(w * 0.3)} ${rd(h * 0.42)} q ${rd(w * 0.2)} -10 ${rd(w * 0.4)} 0 q ${rd(-w * 0.2)} 6 ${rd(-w * 0.4)} 0`} fill="#1f262d" />
        <path d={`M0 ${h * 0.86} L${w} ${h * 0.86} L${w} ${h} L0 ${h}Z`} fill="#2a323a" opacity=".35" />
      </g>
    </svg>
  );
}

/** A grove: several trunks at varied depth. `animate` grows them up from the snow. */
export function Grove({ count = 5, className = "", animate = true, seed = 3, h = 640, spread = 1000 }: { count?: number; className?: string; animate?: boolean; seed?: number; h?: number; spread?: number }) {
  const r = rng(seed);
  const trees = Array.from({ length: count }, (_, i) => ({ x: rd((i + 0.15 + r() * 0.7) * (spread / count)), w: rd(18 + r() * 22), hh: rd(h * (1.05 + r() * 0.3)), o: rd(0.55 + r() * 0.45), s: i + seed }));
  return (
    <svg viewBox={`0 0 ${spread} ${h}`} className={className} aria-hidden preserveAspectRatio="xMidYMax slice">
      {trees.map((t, i) => (
        <g key={i} className={animate ? "sb-grow" : ""} style={{ animationDelay: `${0.5 + i * 0.18}s`, transformOrigin: `${t.x}px ${h}px`, transformBox: "view-box", opacity: t.o }}>
          <Trunk seed={t.s} h={t.hh} w={t.w} box={{ x: t.x - 160, y: rd(h - t.hh), width: t.w + 320, height: t.hh }} />
        </g>
      ))}
      <path d={`M0 ${h - 18} Q ${spread * 0.25} ${h - 34} ${spread * 0.5} ${h - 20} T ${spread} ${h - 22} V ${h} H0Z`} fill="#fbfcfd" />
    </svg>
  );
}

/** Snowfall: deterministic flakes; CSS animation, static when `animate=false`. */
export function Snow({ count = 40, className = "", animate = true, seed = 5 }: { count?: number; className?: string; animate?: boolean; seed?: number }) {
  const r = rng(seed);
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const size = rd(2 + r() * 5), left = rd(r() * 100), top = rd(r() * 100), dur = rd(9 + r() * 12), delay = rd(-r() * 20);
        return <span key={i} className={`absolute rounded-full bg-white ${animate ? "sb-snow" : ""}`} style={{ width: size, height: size, left: `${left}%`, top: animate ? "-2%" : `${top}%`, opacity: rd(0.5 + r() * 0.5), filter: size > 5 ? "blur(1px)" : undefined, animationDuration: `${dur}s`, animationDelay: `${delay}s`, boxShadow: "0 0 4px rgba(150,170,190,.6)" }} />;
      })}
    </div>
  );
}

/** Small frost snowflake ornament. */
export function Flake({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 20 20)`}><path d="M20 3 V37 M20 9 l-4 -4 M20 9 l4 -4 M20 31 l-4 4 M20 31 l4 4 M20 15 l-3 -2 M20 15 l3 -2 M20 25 l-3 2 M20 25 l3 2" /></g>
      ))}
      <circle cx="20" cy="20" r="2" />
    </svg>
  );
}
