import { useId, type CSSProperties } from "react";

// Chapel Doves — a whitewashed Goan Baroque chapel (twin bell towers, a scrolled gable, the zig-zag stair) whose
// doors (data-door="l|r") open on golden light; doves (data-dove) rise from it. Plus a dove-with-olive emblem.

const DOVE_D = "M6 26c8 0 14-2 20-6 2-10 10-18 22-20-4 6-6 12-6 18 6-2 10 0 14 2-6 2-10 6-14 8-6 4-14 6-22 4-6-1-10-3-14-6z";
/** Dove paths only (for use inside another SVG). 60×40 units. */
function DoveG({ fill = "#ffffff" }: { fill?: string }) {
  return (
    <>
      <path d={DOVE_D} fill={fill} stroke="#9fb5cc" strokeWidth=".8" />
      <circle cx="47" cy="17" r=".9" fill="#263a52" />
      <path d="M52 18l5 1-5 1.4" fill="#e3b45a" />
    </>
  );
}

/** One dove in flight. viewBox 60×40. */
export function DoveShape({ className = "", style, fill = "#ffffff" }: { className?: string; style?: CSSProperties; fill?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} style={style} aria-hidden overflow="visible">
      <DoveG fill={fill} />
    </svg>
  );
}

/** The chapel. viewBox 320×360. */
export function Chapel({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 320 360" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`w${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#ece6da" /></linearGradient>
        <radialGradient id={`l${u}`} cx=".5" cy=".7"><stop offset="0" stopColor="#fff2c4" /><stop offset=".6" stopColor="#f2cf7a" /><stop offset="1" stopColor="#d9a84a" /></radialGradient>
      </defs>
      {/* glow behind the door */}
      <ellipse cx="160" cy="250" rx="70" ry="60" fill="#f2cf7a" opacity=".25" />
      {/* towers */}
      {[60, 260].map((x) => (
        <g key={x}>
          <rect x={x - 26} y="90" width="52" height="200" fill={`url(#w${u})`} stroke="#c9bfae" />
          <rect x={x - 12} y="120" width="24" height="34" rx="12" fill="#3b5674" />
          <path d={`M${x - 12} 138h24`} stroke="#c9a36a" strokeWidth="2" />
          <rect x={x - 30} y="82" width="60" height="10" fill="#fff" stroke="#c9bfae" />
          <path d={`M${x - 22} 82c0-26 44-26 44 0z`} fill={`url(#w${u})`} stroke="#c9bfae" />
          <path d={`M${x} 52v-22M${x - 8} 40h16`} stroke="#c9a36a" strokeWidth="3" strokeLinecap="round" />
          <circle cx={x} cy="58" r="4" fill="#c9a36a" />
          <rect x={x - 10} y="190" width="20" height="40" rx="10" fill="#cfdbe6" stroke="#9fb5cc" />
        </g>
      ))}
      {/* central body + scrolled gable */}
      <path d="M86 140h148v150H86z" fill={`url(#w${u})`} stroke="#c9bfae" />
      <path d="M86 140c10-10 22-10 30-24 10-18 30-28 44-28s34 10 44 28c8 14 20 14 30 24z" fill={`url(#w${u})`} stroke="#c9bfae" />
      <path d="M160 72v-26M150 58h20" stroke="#c9a36a" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="160" cy="118" r="14" fill="#cfdbe6" stroke="#9fb5cc" />
      <path d="M160 106v24M148 118h24" stroke="#9fb5cc" />
      <path d="M94 160h132M94 168h132" stroke="#d8cfbe" />
      {/* door: light inside, two leaves that open */}
      <path d="M134 290v-62c0-16 12-26 26-26s26 10 26 26v62z" fill={`url(#l${u})`} />
      <g data-door="l" style={{ transformOrigin: "134px 260px", transformBox: "view-box" }}>
        <path d="M134 290v-62c0-16 12-26 26-26v88z" fill="#3b5674" stroke="#2a4058" />
        <path d="M140 236h14M140 256h14M140 276h14" stroke="#c9a36a" strokeWidth="1" />
      </g>
      <g data-door="r" style={{ transformOrigin: "186px 260px", transformBox: "view-box" }}>
        <path d="M186 290v-62c0-16-12-26-26-26v88z" fill="#3b5674" stroke="#2a4058" />
        <path d="M166 236h14M166 256h14M166 276h14" stroke="#c9a36a" strokeWidth="1" />
      </g>
      {/* zig-zag stair */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${70 + i * 8} ${290 + i * 16}h${180 - i * 16}v16H${70 + i * 8}z`} fill={i % 2 ? "#f4efe6" : "#fff"} stroke="#c9bfae" />)}
      <path d="M40 354h240" stroke="#c9bfae" />
      {/* doves rising */}
      {[[146, 196, 0.62], [176, 176, 0.5], [118, 172, 0.44]].map(([x, y, s], i) => (
        <g key={i} data-dove transform={`translate(${x} ${y}) scale(${s})`}><DoveG /></g>
      ))}
    </svg>
  );
}

/** Dove with an olive sprig — emblem. viewBox 120×90. */
export function DoveOlive({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 90" className={className} style={style} aria-hidden overflow="visible">
      <g transform="translate(10 6) scale(1.6)"><path d="M6 26c8 0 14-2 20-6 2-10 10-18 22-20-4 6-6 12-6 18 6-2 10 0 14 2-6 2-10 6-14 8-6 4-14 6-22 4-6-1-10-3-14-6z" fill="#fff" stroke="#9fb5cc" strokeWidth=".8" /><circle cx="47" cy="17" r=".9" fill="#263a52" /></g>
      <path d="M100 38c-6 10-14 18-26 22" stroke="#7d8c55" strokeWidth="1.6" fill="none" />
      {[[96, 44], [90, 51], [83, 56]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="6" ry="2.4" fill="#93a46a" transform={`rotate(${-40 + i * 10} ${x} ${y})`} />)}
    </svg>
  );
}

/** Gold cross-and-scroll divider. viewBox 160×24. */
export function CrossRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 24" className={className} aria-hidden>
      <path d="M4 12h60c4 0 6-4 10-4M156 12H96c-4 0-6-4-10-4" stroke="#c9a36a" strokeWidth="1" fill="none" />
      <path d="M80 3v18M74 9h12" stroke="#c9a36a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const CD_CSS = `
.evcd-root{background-color:#fbf8f1;background-image:radial-gradient(70% 50% at 50% 0%,rgba(159,181,204,.28),transparent 70%),radial-gradient(40% 30% at 50% 60%,rgba(242,207,122,.12),transparent 70%)}
.evcd-foil{background:linear-gradient(100deg,#263a52 0%,#4d6f94 35%,#b8873a 52%,#263a52 75%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evcd-shine{animation:evcdShine 9s ease-in-out infinite}
@keyframes evcdShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evcd-fly{animation:evcdFly 7s ease-in-out infinite}
@keyframes evcdFly{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (prefers-reduced-motion: reduce){.evcd-shine,.evcd-fly{animation:none!important}}
`;
