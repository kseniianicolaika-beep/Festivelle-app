import { useId, type CSSProperties } from "react";
import { r2 } from "../_shared/kit";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
export const BABY = { blue: "#9DB7E0", deep: "#5F7FB8", blush: "#F4C6CE", butter: "#F7DFA0", mint: "#BFE3D3", ink: "#2E3A55", cream: "#FFFDF8" };

/** Rounded five-point star. */
export const softStar = (r: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5 - Math.PI / 2; const rr = i % 2 ? r * 0.5 : r; return [Math.cos(a) * rr, Math.sin(a) * rr]; });
  return pts.map((p, i) => { const n = pts[(i + 1) % 10]; const m = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2]; return `${i ? "" : `M${r2(m[0])} ${r2(m[1])}`}Q${r2(n[0])} ${r2(n[1])} ${r2((n[0] + pts[(i + 2) % 10][0]) / 2)} ${r2((n[1] + pts[(i + 2) % 10][1]) / 2)}`; }).join("") + "Z";
};

/** A puffy cloud, soft-shaded, in a 300×140 box. */
export function Cloud({ className, style, tint = "#FFFFFF", shade = "#DCE6F4" }: { className?: string; style?: CSSProperties; tint?: string; shade?: string }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 300 140" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stopColor={tint} /><stop offset="1" stopColor={shade} /></linearGradient></defs>
      <path d="M40 130C14 130 4 108 16 92C8 70 30 52 52 60C56 30 92 16 118 34C132 6 186 4 200 36C222 22 258 32 260 62C290 64 300 100 280 116C276 128 262 132 250 130Z" fill={`url(#${id}c)`} />
      <path d="M60 64C70 58 84 60 90 70M130 40C144 34 160 38 166 52" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".8" />
    </svg>
  );
}

/** Baby rattle: a striped ball, a ring handle and a ribbon. */
export function Rattle({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 120 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}b`} cx=".38" cy=".35" r=".7"><stop offset="0" stopColor="#FFF4F6" /><stop offset=".6" stopColor={BABY.blush} /><stop offset="1" stopColor="#D995A3" /></radialGradient>
        <clipPath id={`${id}k`}><circle cx="60" cy="60" r="46" /></clipPath>
      </defs>
      <circle cx="60" cy="60" r="46" fill={`url(#${id}b)`} />
      <g clipPath={`url(#${id}k)`} opacity=".55">
        {[-30, 0, 30].map((x) => <path key={x} d={`M${60 + x - 8} 0Q${60 + x + 14} 60 ${60 + x - 8} 120`} stroke="#fff" strokeWidth="9" fill="none" />)}
      </g>
      <path d={softStar(14)} transform="translate(60 60)" fill={BABY.butter} />
      <ellipse cx="44" cy="40" rx="10" ry="6" fill="#fff" opacity=".7" transform="rotate(-30 44 40)" />
      <rect x="53" y="104" width="14" height="44" rx="7" fill={BABY.blue} />
      <circle cx="60" cy="166" r="22" fill="none" stroke={BABY.deep} strokeWidth="10" />
      <circle cx="60" cy="166" r="22" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity=".5" strokeDasharray="4 10" />
      <path d="M60 108C40 104 30 112 34 122C42 118 50 114 60 112C70 114 78 118 86 122C90 112 80 104 60 108Z" fill={BABY.butter} />
    </svg>
  );
}

/** Sleepy crescent moon. */
export function SleepyMoon({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden overflow="visible">
      <defs><radialGradient id={`${id}m`} cx=".4" cy=".4" r=".7"><stop offset="0" stopColor="#FFF6D6" /><stop offset="1" stopColor="#F2D58E" /></radialGradient></defs>
      <path d="M78 10C46 14 24 40 26 70C28 98 54 116 84 112C62 104 48 84 48 60C48 38 60 20 78 10Z" fill={`url(#${id}m)`} />
      <path d="M38 62Q44 66 50 62" stroke={BABY.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="74" r="5" fill={BABY.blush} opacity=".8" />
    </svg>
  );
}

/** The cot mobile: a wooden hoop with stars, moon, cloud and a rattle on strings. */
export function Mobile({ className, style }: { className?: string; style?: CSSProperties }) {
  const items = [
    { x: 60, len: 90, k: "star", c: BABY.butter },
    { x: 140, len: 150, k: "moon", c: "" },
    { x: 220, len: 70, k: "cloud", c: "" },
    { x: 300, len: 130, k: "star", c: BABY.blush },
    { x: 380, len: 100, k: "heart", c: BABY.mint },
  ];
  return (
    <svg viewBox="0 0 440 300" className={className} style={style} aria-hidden overflow="visible">
      <path d="M220 0V40" stroke="#C9A97A" strokeWidth="2" />
      <ellipse cx="220" cy="44" rx="200" ry="14" fill="none" stroke="#D8BC8E" strokeWidth="6" />
      <ellipse cx="220" cy="42" rx="200" ry="14" fill="none" stroke="#F1DDB8" strokeWidth="2" />
      {items.map((it, i) => (
        <g key={i} className="wl-hang" style={{ transformOrigin: `${it.x}px 50px`, animationDelay: `${-i * 0.9}s` }}>
          <path d={`M${it.x} 50V${50 + it.len}`} stroke="#B9C6DB" strokeWidth="1.2" />
          <g transform={`translate(${it.x} ${50 + it.len + 26})`}>
            {it.k === "star" && <path d={softStar(28)} fill={it.c} stroke="#fff" strokeWidth="2" />}
            {it.k === "heart" && <path d="M0 22C-30 2-26-24-8-22C-2-21 0-16 0-14C0-16 2-21 8-22C26-24 30 2 0 22Z" fill={it.c} stroke="#fff" strokeWidth="2" />}
            {it.k === "moon" && <path d="M10-28C-10-26-24-10-24 6C-24 22-8 34 12 32C-2 26-10 14-10 0C-10-12-2-22 10-28Z" fill="#F7DFA0" stroke="#fff" strokeWidth="2" />}
            {it.k === "cloud" && <path d="M-34 14C-46 14-48 0-38-4C-38-18-22-24-12-16C-6-30 18-30 22-14C34-18 44-6 38 4C46 10 40 18 32 14Z" fill="#fff" stroke={BABY.blue} strokeWidth="2" />}
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Stitched gingham ribbon divider. */
export function Stitch({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 40" className={className} style={style} aria-hidden>
      <path d="M0 20H96M144 20H240" stroke={BABY.blue} strokeWidth="1.6" strokeDasharray="5 5" strokeLinecap="round" />
      <path d={softStar(12)} transform="translate(120 20)" fill={BABY.butter} />
      <circle cx="104" cy="20" r="3" fill={BABY.blush} /><circle cx="136" cy="20" r="3" fill={BABY.blush} />
    </svg>
  );
}
