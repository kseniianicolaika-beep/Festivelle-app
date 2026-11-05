import { darken, lighten } from "../_shared/color";

// Under the Sea — a picture-book reef. Every creature is drawn around (0,0), facing right.
export const SEA = {
  deep: "#0E3550", mid: "#1F6F87", shallow: "#58B9C2", aqua: "#9FE3DA", foam: "#ECFBF8", sand: "#F3DDB0",
  coral: "#F08A6A", orange: "#F59A4A", yellow: "#F6CF6B", pink: "#F2A7B8", lilac: "#B9A6E8", kelp: "#4E9C7E", ink: "#123B4A",
};
const line = "#123B4A";

export function Fish({ c = SEA.orange, x = 0, y = 0, s = 1, flip = false, stripes = true, cls = "" }: { c?: string; x?: number; y?: number; s?: number; flip?: boolean; stripes?: boolean; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className={`us-fish ${cls}`} data-color={c}>
        <path className="us-tail" d="M-40 0 L-66 -22 C-60 -7 -60 7 -66 22Z" fill={darken(c, 0.08)} stroke={line} strokeOpacity=".25" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M-12 -24 C-2 -40 18 -36 24 -20Z" fill={darken(c, 0.06)} stroke={line} strokeOpacity=".25" strokeWidth="1.4" />
        <path d="M-46 0 C-36 -27 10 -31 40 -9 C49 -3 49 3 40 9 C10 31 -36 27 -46 0Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="1.5" />
        <path d="M-40 6 C-20 20 14 22 36 10" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="6" strokeLinecap="round" />
        {stripes && (
          <>
            <path d="M12 -25 C19 -10 19 10 12 25 L2 26 C8 10 8 -10 2 -26Z" fill="#fff" stroke={line} strokeOpacity=".35" strokeWidth="1.2" />
            <path d="M-22 -22 C-15 -8 -15 8 -22 22 L-31 18 C-26 6 -26 -6 -31 -18Z" fill="#fff" stroke={line} strokeOpacity=".35" strokeWidth="1.2" />
          </>
        )}
        <path d="M2 6 C8 14 16 14 18 8" fill={darken(c, 0.06)} stroke={line} strokeOpacity=".25" />
        <circle cx="29" cy="-5" r="6.5" fill="#fff" stroke={line} strokeOpacity=".3" />
        <circle className="us-pupil" cx="30.5" cy="-4.5" r="3.6" fill="#1d2b33" />
        <circle cx="31.6" cy="-6" r="1.2" fill="#fff" />
        <ellipse cx="26" cy="5" rx="4" ry="2.4" fill="#F27A7A" opacity=".45" />
        <path d="M38 4 C40 6 42 6 44 4" fill="none" stroke={line} strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Puffer({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  const c = "#F4D27E";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="us-puffer">
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return <path key={i} d={`M${(Math.cos(a) * 36).toFixed(1)} ${(Math.sin(a) * 34).toFixed(1)} L${(Math.cos(a) * 46).toFixed(1)} ${(Math.sin(a) * 44).toFixed(1)}`} stroke={darken(c, 0.25)} strokeWidth="3" strokeLinecap="round" />;
        })}
        <path d="M-38 0 L-56 -14 C-52 -4 -52 4 -56 14Z" fill="#EDB85A" stroke={line} strokeOpacity=".25" />
        <ellipse cx="0" cy="0" rx="40" ry="37" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="1.5" />
        <path d="M-32 12 C-16 34 20 34 34 12 C20 22 -16 22 -32 12Z" fill="#FFF4D6" />
        {[[-14, -18], [4, -24], [-22, 0], [-4, -6], [14, -12]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="3" fill="#D9A441" opacity=".6" />)}
        <circle cx="14" cy="-4" r="9" fill="#fff" stroke={line} strokeOpacity=".3" />
        <circle className="us-pupil" cx="16" cy="-3" r="5" fill="#1d2b33" />
        <circle cx="17.5" cy="-5" r="1.6" fill="#fff" />
        <ellipse cx="30" cy="8" rx="4" ry="4.6" fill="#E77C6B" />
        <ellipse cx="6" cy="12" rx="5" ry="3" fill="#F27A7A" opacity=".45" />
        <path d="M-6 20 C2 32 14 30 16 22" fill="#EDB85A" stroke={line} strokeOpacity=".25" />
      </g>
    </g>
  );
}

export function Turtle({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  const shell = "#6FB08A";
  const skin = "#A9D7A1";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="us-turtle">
        <path className="us-flip-b" d="M-30 14 C-48 22 -62 34 -58 40 C-50 42 -36 30 -22 22Z" fill={skin} stroke={line} strokeOpacity=".25" />
        <path className="us-flip-f" d="M18 14 C30 30 46 46 54 44 C58 38 44 24 28 10Z" fill={skin} stroke={line} strokeOpacity=".25" />
        <path d="M46 -8 C60 -16 76 -10 76 2 C76 12 62 16 48 10Z" fill={skin} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <circle cx="64" cy="-3" r="3" fill="#1d2b33" />
        <circle cx="65" cy="-4" r="1" fill="#fff" />
        <path d="M66 6 C70 8 73 7 74 5" fill="none" stroke={line} strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="60" cy="4" rx="3.6" ry="2" fill="#F27A7A" opacity=".45" />
        <path d="M-50 10 C-50 -30 -14 -42 8 -40 C34 -38 52 -18 50 10Z" fill={shell} stroke={line} strokeOpacity=".3" strokeWidth="1.6" />
        <path d="M-56 12 C-20 20 20 20 56 12" fill="none" stroke="#F3E3B3" strokeWidth="7" strokeLinecap="round" />
        <path d="M-14 -30 L4 -34 L18 -22 L12 -6 L-8 -4 L-20 -16Z M-20 -16 L-38 -10 M12 -6 L30 2 M18 -22 L34 -24 M-8 -4 L-12 8 M4 -34 L2 -40" fill={lighten(shell, 0.2)} stroke={darken(shell, 0.25)} strokeWidth="1.6" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Octopus head + two waving arms; body sits at (0,0), bottom hidden by whatever is in front. */
export function Octopus({ x = 0, y = 0, s = 1, c = "#C9A2E6" }: { x?: number; y?: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="us-octo">
        <path className="us-arm-l" d="M-30 10 C-56 4 -66 -22 -56 -34 C-50 -40 -42 -34 -46 -28 C-52 -18 -42 0 -24 0Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <path className="us-arm-r" d="M30 10 C58 6 70 -26 62 -40 C56 -48 46 -40 50 -32 C56 -22 46 0 26 0Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M-36 30 C-40 -22 -22 -58 0 -58 C22 -58 40 -22 36 30Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="1.6" />
        <ellipse cx="-12" cy="-36" rx="7" ry="10" fill="#fff" opacity=".25" />
        {[[-20, -14], [22, -22], [12, -44], [-26, 6]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="3.2" fill={darken(c, 0.15)} opacity=".6" />)}
        <g className="us-octo-eyes">
          <ellipse cx="-11" cy="-12" rx="6" ry="7.5" fill="#fff" />
          <ellipse cx="11" cy="-12" rx="6" ry="7.5" fill="#fff" />
          <circle cx="-10" cy="-10" r="4" fill="#1d2b33" />
          <circle cx="12" cy="-10" r="4" fill="#1d2b33" />
          <circle cx="-8.6" cy="-12" r="1.3" fill="#fff" />
          <circle cx="13.4" cy="-12" r="1.3" fill="#fff" />
        </g>
        <ellipse cx="-20" cy="2" rx="5" ry="3" fill="#F27A9A" opacity=".5" />
        <ellipse cx="20" cy="2" rx="5" ry="3" fill="#F27A9A" opacity=".5" />
        <path d="M-5 4 C-2 9 2 9 5 4" fill="none" stroke={line} strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Kelp({ x = 0, y = 0, h = 300, s = 1, c = SEA.kelp, flip = false }: { x?: number; y?: number; h?: number; s?: number; c?: string; flip?: boolean }) {
  const n = Math.max(3, Math.round(h / 60));
  const leaves = Array.from({ length: n }, (_, i) => ({ y: -((i + 0.7) * h) / (n + 0.5), side: i % 2 ? 1 : -1 }));
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="us-kelp">
        <path d={`M0 0 C10 ${-h * 0.25} -10 ${-h * 0.5} 4 ${-h * 0.75} S -4 ${-h * 0.95} 2 ${-h}`} fill="none" stroke={darken(c, 0.15)} strokeWidth="5" strokeLinecap="round" />
        {leaves.map((l, i) => (
          <path key={i} d={`M0 ${l.y.toFixed(1)} C${l.side * 18} ${(l.y - 30).toFixed(1)} ${l.side * 40} ${(l.y - 20).toFixed(1)} ${l.side * 46} ${(l.y - 40).toFixed(1)} C${l.side * 30} ${(l.y - 4).toFixed(1)} ${l.side * 10} ${(l.y + 4).toFixed(1)} 0 ${l.y.toFixed(1)}Z`} fill={i % 2 ? c : lighten(c, 0.15)} stroke={darken(c, 0.25)} strokeOpacity=".35" />
        ))}
      </g>
    </g>
  );
}

export function Coral({ x = 0, y = 0, s = 1, c = SEA.coral }: { x?: number; y?: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0 C0 -30 -4 -50 -20 -70 M-20 -70 C-26 -80 -30 -96 -28 -106 M-20 -70 C-8 -82 -6 -96 -10 -108 M-2 -40 C10 -54 24 -60 30 -82 M30 -82 C34 -92 32 -100 28 -108 M30 -82 C40 -88 46 -96 46 -104 M0 -20 C-14 -30 -30 -34 -38 -52" stroke={darken(c, 0.2)} strokeWidth="15" />
      <path d="M0 0 C0 -30 -4 -50 -20 -70 M-20 -70 C-26 -80 -30 -96 -28 -106 M-20 -70 C-8 -82 -6 -96 -10 -108 M-2 -40 C10 -54 24 -60 30 -82 M30 -82 C34 -92 32 -100 28 -108 M30 -82 C40 -88 46 -96 46 -104 M0 -20 C-14 -30 -30 -34 -38 -52" stroke={c} strokeWidth="11" />
      <path d="M-22 -74 C-26 -84 -27 -94 -27 -100 M28 -86 C31 -94 30 -100 28 -104" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
    </g>
  );
}

export function Anemone({ x = 0, y = 0, s = 1, c = SEA.pink }: { x?: number; y?: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="us-anem">
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 15;
          const r = (a * Math.PI) / 180;
          return <path key={i} d={`M0 -8 Q ${(Math.cos(r) * 20).toFixed(1)} ${(-14 + Math.sin(r) * 20).toFixed(1)} ${(Math.cos(r) * 34).toFixed(1)} ${(-8 + Math.sin(r) * 36).toFixed(1)}`} stroke={i % 2 ? c : lighten(c, 0.25)} strokeWidth="7" strokeLinecap="round" fill="none" />;
        })}
      </g>
      <path d="M-20 0 C-20 -14 20 -14 20 0Z" fill={darken(c, 0.15)} />
    </g>
  );
}

export function Starfish({ x = 0, y = 0, s = 1, r = 0, c = "#F59A6A" }: { x?: number; y?: number; s?: number; r?: number; c?: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const R = i % 2 ? 9 : 22;
    return `${(Math.cos(a) * R).toFixed(1)},${(Math.sin(a) * R).toFixed(1)}`;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <polygon points={pts.join(" ")} fill={c} stroke={darken(c, 0.25)} strokeWidth="5" strokeLinejoin="round" />
      <polygon points={pts.join(" ")} fill={c} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={(Math.cos(a) * 11).toFixed(1)} cy={(Math.sin(a) * 11).toFixed(1)} r="1.8" fill="#fff" opacity=".6" />;
      })}
    </g>
  );
}

export function Shell({ x = 0, y = 0, s = 1, r = 0, c = "#F7C9B6" }: { x?: number; y?: number; s?: number; r?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 4 C-22 4 -30 -14 -24 -24 C-14 -38 14 -38 24 -24 C30 -14 22 4 0 4Z" fill={c} stroke={darken(c, 0.3)} strokeOpacity=".5" strokeWidth="1.4" />
      {[-16, -8, 0, 8, 16].map((dx) => <path key={dx} d={`M0 2 L${dx} -32`} stroke={darken(c, 0.25)} strokeOpacity=".45" strokeWidth="1.3" />)}
      <path d="M-6 4 L-8 10 L8 10 L6 4Z" fill={darken(c, 0.1)} />
    </g>
  );
}

/** Sandy sea floor across w, top at 0. */
export function Reef({ w = 1200, h = 200, seed = 1 }: { w?: number; h?: number; seed?: number }) {
  return (
    <g>
      <path d={`M0 ${h * 0.35} C ${w * 0.18} ${h * 0.1} ${w * 0.32} ${h * 0.4} ${w * 0.5} ${h * 0.24} S ${w * 0.82} ${h * 0.06} ${w} ${h * 0.28} L${w} ${h} L0 ${h}Z`} fill="#E9CF9C" />
      <path d={`M0 ${h * 0.55} C ${w * 0.3} ${h * 0.35} ${w * 0.55} ${h * 0.62} ${w} ${h * 0.45} L${w} ${h} L0 ${h}Z`} fill={SEA.sand} />
      {Array.from({ length: Math.round(w / 40) }, (_, i) => <circle key={i} cx={(i * 41 + seed * 13) % w} cy={h * 0.6 + ((i * 29 + seed * 7) % (h * 0.35))} r={1.4 + (i % 3) * 0.6} fill="#D7B67C" opacity=".6" />)}
    </g>
  );
}

export function Rays({ w = 1000, h = 900, n = 6, id }: { w?: number; h?: number; n?: number; id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const x = ((i + 0.5) / n) * w;
        const wd = 40 + (i % 3) * 30;
        return <path key={i} className="us-ray" d={`M${x - wd / 2} 0 L${x + wd / 2} 0 L${x + wd * 1.6 + 120} ${h} L${x + 120 - wd} ${h}Z`} fill={`url(#${id})`} opacity={0.3 + (i % 2) * 0.12} />;
      })}
    </g>
  );
}

/** A mossy rock (front of the octopus' hiding place), base at (0,0). */
export function Rock({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-110 10 C-112 -40 -80 -78 -30 -80 C20 -84 60 -70 84 -46 C104 -26 110 -6 108 10Z" fill="#86A3A3" stroke="#123B4A" strokeOpacity=".25" strokeWidth="2" />
      <path d="M-80 -48 C-60 -66 -30 -72 -4 -70" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 -78 C50 -76 66 -66 80 -50 C60 -56 44 -60 30 -78Z" fill="#7FB58E" />
      <path d="M-104 -10 C-90 -24 -70 -24 -60 -6 C-76 -14 -92 -12 -104 -10Z" fill="#7FB58E" />
      {[[-40, -30], [10, -20], [50, -36], [-70, -10], [70, -6]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3 + (i % 2) * 2} fill="#6D8C8D" />)}
    </g>
  );
}
