import { useId } from "react";

// Forty & Fabulous — jazz-age geometry: sunburst, stepped ziggurat arch, fans, chevron doors. Onyx, emerald, gold.

const G = "var(--t-gold, #d6b36a)";

export function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`gold${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f7e2a8" />
        <stop offset=".35" stopColor="#c9a04f" />
        <stop offset=".6" stopColor="#fff1c6" />
        <stop offset="1" stopColor="#8f6a2c" />
      </linearGradient>
    </defs>
  );
}

/** Sunburst rays from the bottom centre (viewBox 400×220). */
export function Sunburst({ className = "", style, rays = 36 }: { className?: string; style?: React.CSSProperties; rays?: number }) {
  const id = useId().replace(/:/g, "");
  const out: React.ReactNode[] = [];
  for (let i = 0; i <= rays; i++) {
    const a = Math.PI + (i / rays) * Math.PI;
    const w = i % 2 ? 0.012 : 0.03;
    const R = i % 2 ? 190 : 215;
    const p = (ang: number, r: number) => `${200 + Math.cos(ang) * r} ${220 + Math.sin(ang) * r}`;
    out.push(<path key={i} d={`M200 220L${p(a - w, R)}L${p(a + w, R)}Z`} fill={`url(#gold${id})`} opacity={i % 2 ? 0.45 : 0.85} />);
  }
  return (
    <svg viewBox="0 0 400 220" className={className} style={style} aria-hidden>
      <GoldDefs id={id} />
      <g data-rays>{out}</g>
      {[60, 46, 34].map((r, i) => <path key={r} d={`M${200 - r} 220A${r} ${r} 0 0 1 ${200 + r} 220`} fill="none" stroke={`url(#gold${id})`} strokeWidth={i ? 0.8 : 1.6} />)}
      <path d="M170 220A30 30 0 0 1 230 220Z" fill={`url(#gold${id})`} />
    </svg>
  );
}

/** Stepped ziggurat arch frame — fills its box (preserveAspectRatio none for the lines). */
export function ZigguratFrame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 420" preserveAspectRatio="none" className={className} aria-hidden>
      <g fill="none" stroke={G} vectorEffect="non-scaling-stroke">
        <path d="M6 414V96h24V66h30V40h40V18h100v22h40v26h30v30h24v318Z" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        <path d="M14 406V104h24V74h30V48h40V26h84v22h40v26h30v30h24v302Z" strokeWidth=".7" strokeOpacity=".55" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Quarter fan (scallop) used for corners & dividers. viewBox 100×100, pivot bottom-left. */
export function Fan({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <GoldDefs id={id} />
      <g fill="none" stroke={`url(#gold${id})`} strokeWidth="1.2">
        {[92, 74, 56].map((r) => <path key={r} d={`M0 ${100 - r}A${r} ${r} 0 0 1 ${r} 100`} />)}
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i / 6) * (Math.PI / 2);
          return <path key={i} d={`M0 100L${Math.sin(a) * 92} ${100 - Math.cos(a) * 92}`} strokeWidth=".7" />;
        })}
      </g>
      <path d="M0 100V78A22 22 0 0 1 22 100Z" fill={`url(#gold${id})`} />
    </svg>
  );
}

/** Symmetric deco divider: line – fan pair – diamond – line. */
export function DecoRule({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden>
      <GoldDefs id={id} />
      <g stroke={`url(#gold${id})`} fill="none" strokeWidth=".9">
        <path d="M0 12h92M148 12h92M0 16h80M160 16h80" />
        <path d="M96 12a16 16 0 0 1 24-10M144 12a16 16 0 0 0-24-10" />
      </g>
      <path d="M120 2l7 10-7 10-7-10z" fill={`url(#gold${id})`} />
    </svg>
  );
}

/** One door panel with chevrons & a half-sunburst; mirrored for the right door. */
export function DoorPanel({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 600" preserveAspectRatio="xMidYMid slice" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <GoldDefs id={id} />
      <rect width="200" height="600" fill="#0b1f1a" />
      <g fill="none" stroke={`url(#gold${id})`} strokeWidth="1">
        <rect x="14" y="14" width="172" height="572" />
        <rect x="22" y="22" width="156" height="556" strokeOpacity=".5" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M22 ${360 + i * 24}L100 ${330 + i * 24}L178 ${360 + i * 24}`} strokeOpacity={0.4 + (i % 2) * 0.4} />)}
        {Array.from({ length: 13 }, (_, i) => {
          const a = Math.PI + (i / 12) * (Math.PI / 2);
          return <path key={i} d={`M200 300L${200 + Math.cos(a) * 170} ${300 + Math.sin(a) * 170}`} strokeOpacity=".7" />;
        })}
        {[170, 120, 70].map((r) => <path key={r} d={`M${200 - r} 300A${r} ${r} 0 0 1 200 ${300 - r}`} />)}
      </g>
      <circle cx="186" cy="320" r="5" fill={`url(#gold${id})`} />
    </svg>
  );
}

export const FF_CSS = `
.ff-foil{background:linear-gradient(100deg,#8f6a2c 0%,#f7e2a8 20%,#c9a04f 38%,#fff1c6 50%,#a37b35 64%,#f1d38e 82%,#8f6a2c 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.ff-shine{animation:ffShine 7s ease-in-out infinite}
@keyframes ffShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.ff-rays{animation:ffRays 30s linear infinite;transform-origin:50% 100%}
@keyframes ffRays{0%,100%{opacity:.85}50%{opacity:.6}}
.ff-door-l{animation:ffDL 1.8s cubic-bezier(.7,0,.25,1) 2.4s forwards}.ff-door-r{animation:ffDR 1.8s cubic-bezier(.7,0,.25,1) 2.4s forwards}
@keyframes ffDL{to{transform:translateX(-101%)}}@keyframes ffDR{to{transform:translateX(101%)}}
.ff-pattern{background-image:linear-gradient(135deg,rgba(214,179,106,.07) 25%,transparent 25%),linear-gradient(225deg,rgba(214,179,106,.07) 25%,transparent 25%),linear-gradient(45deg,rgba(214,179,106,.07) 25%,transparent 25%),linear-gradient(315deg,rgba(214,179,106,.07) 25%,transparent 25%);background-size:36px 36px;background-position:18px 0,18px 0,0 0,0 0}
.ff-seam{animation:ffSeam .4s ease 2.4s forwards}@keyframes ffSeam{to{opacity:0}}
@media (prefers-reduced-motion: reduce){.ff-seam{display:none}.ff-shine,.ff-rays{animation:none!important}.ff-door-l,.ff-door-r{display:none}}
`;
