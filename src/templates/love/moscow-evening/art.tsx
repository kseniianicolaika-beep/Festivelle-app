// Moscow Evening — Vologda lace, silver birch, an empire-style Moscow osobnyak, a wax seal and winter snow.
import type { CSSProperties } from "react";

/** Silver birch trunk with bark marks and a few bare branches. Tall; place at page edges. */
export function Birch({ className = "", flip = false, style }: { className?: string; flip?: boolean; style?: CSSProperties }) {
  const marks = [40, 95, 130, 190, 240, 300, 345, 410, 460, 520, 575, 640, 690, 750];
  return (
    <svg viewBox="0 0 120 800" preserveAspectRatio="xMidYMax slice" className={className} style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }} aria-hidden>
      <defs>
        <linearGradient id="me-bark" x1="0" x2="1">
          <stop offset="0" stopColor="#cfcac0" />
          <stop offset=".35" stopColor="#fbfaf6" />
          <stop offset=".8" stopColor="#e6e1d6" />
          <stop offset="1" stopColor="#b9b2a4" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#6f675c" strokeLinecap="round">
        <path d="M58 300C40 250 20 230 2 222M62 180C80 140 100 128 118 126M56 90C44 60 30 48 14 44M60 420C84 390 102 384 120 386" strokeWidth="2" />
        <path d="M20 232c-4-10-2-18 2-24M98 132c4-8 10-12 16-12M30 50c0-8 4-14 8-18" strokeWidth="1" />
        {/* hanging fine twigs (catkins) */}
        {[[14, 44], [2, 222], [118, 126], [120, 386]].map(([x, y], i) => <path key={i} d={`M${x} ${y}c-2 14 0 30 -4 46M${x} ${y}c3 12 2 24 6 34`} strokeWidth=".6" strokeOpacity=".7" />)}
      </g>
      <path d="M48 800C50 520 52 260 56 0h10c2 260 6 520 8 800Z" fill="url(#me-bark)" />
      {marks.map((y, i) => (
        <path key={i} d={`M${50 + (i % 3)} ${y}c6-3 ${8 + (i % 4) * 2} -2 ${14 + (i % 3)} 0`} stroke="#3a352f" strokeWidth={i % 2 ? 2.4 : 1.4} strokeLinecap="round" fill="none" opacity=".85" />
      ))}
      {marks.filter((_, i) => i % 2).map((y, i) => <path key={`m${i}`} d={`M${58 + (i % 2) * 6} ${y + 22}h${6 + (i % 3) * 2}`} stroke="#3a352f" strokeWidth="1" opacity=".6" />)}
    </svg>
  );
}

/** Scalloped lace strip with eyelets — tile horizontally (use as a border band). */
export function LaceBand({ className = "", id = "lb", flip = false }: { className?: string; id?: string; flip?: boolean }) {
  return (
    <svg className={className} style={{ transform: flip ? "scaleY(-1)" : undefined }} aria-hidden width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <pattern id={`${id}-p`} width="40" height="34" patternUnits="userSpaceOnUse">
          <path d="M0 0h40v12c0 12-8 20-20 20S0 24 0 12Z" fill="var(--t-surface)" />
          <path d="M2 12c0 10 8 18 18 18s18-8 18-18" fill="none" stroke="var(--t-gold)" strokeWidth=".7" />
          <circle cx="20" cy="17" r="3.2" fill="none" stroke="var(--t-gold)" strokeWidth=".7" />
          <circle cx="20" cy="17" r="1.2" fill="var(--t-bg)" />
          <circle cx="8" cy="9" r="1.3" fill="var(--t-bg)" stroke="var(--t-gold)" strokeWidth=".4" />
          <circle cx="32" cy="9" r="1.3" fill="var(--t-bg)" stroke="var(--t-gold)" strokeWidth=".4" />
          <path d="M20 22v6M14 24l2 3M26 24l-2 3" stroke="var(--t-gold)" strokeWidth=".5" />
          <path d="M0 4h40" stroke="var(--t-gold)" strokeWidth=".5" strokeDasharray="1.5 2" />
        </pattern>
      </defs>
      <rect width="100%" height="34" fill={`url(#${id}-p)`} />
    </svg>
  );
}

/** Round Vologda-lace doily (rosette) for monograms & dates. */
export function Doily({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const N = 24;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="none" stroke="var(--t-gold)" strokeWidth=".7">
          {Array.from({ length: N }, (_, i) => (
            <g key={i} transform={`rotate(${(i * 360) / N} 100 100)`}>
              <path d="M100 4c8 0 10 8 5 12-3 3-7 3-10 0-5-4-3-12 5-12Z" fill="var(--t-surface)" />
              <circle cx="100" cy="10" r="1.6" fill="var(--t-bg)" />
              <path d="M100 18v12M94 26l6 6 6-6" />
              <circle cx="100" cy="38" r="2.2" />
            </g>
          ))}
          <circle cx="100" cy="100" r="82" fill="var(--t-surface)" />
          <circle cx="100" cy="100" r="78" strokeDasharray="2 3" />
          <circle cx="100" cy="100" r="66" />
          {Array.from({ length: 36 }, (_, i) => <circle key={i} cx={(100 + Math.cos((i / 36) * Math.PI * 2) * 72).toFixed(2)} cy={(100 + Math.sin((i / 36) * Math.PI * 2) * 72).toFixed(2)} r="1.8" fill="var(--t-bg)" />)}
        </g>
      </svg>
      <div className="relative flex h-full w-full items-center justify-center text-center">{children}</div>
    </div>
  );
}

/** Wax seal with an embossed monogram. */
export function Seal({ a, b, className = "", style }: { a: string; b?: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative ${className}`} style={style}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="me-wax" cx=".38" cy=".32" r=".75">
            <stop offset="0" stopColor="#a8343c" />
            <stop offset=".55" stopColor="#6e1a22" />
            <stop offset="1" stopColor="#3c0b10" />
          </radialGradient>
        </defs>
        <path d="M50 3c9 0 12 4 19 6 8 3 14 6 18 13s3 12 6 19c3 8 3 13 0 20s-6 12-11 17-12 7-19 10-13 3-20 1-12-5-18-10S9 69 6 61s-3-14-1-21 4-12 9-18 10-11 17-14c7-2 11-5 19-5Z" fill="url(#me-wax)" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#3c0b10" strokeWidth="2.4" opacity=".55" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#c4545c" strokeWidth=".8" opacity=".7" transform="translate(-.8 -.8)" />
        {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={(50 + Math.cos((i / 20) * Math.PI * 2) * 36).toFixed(2)} cy={(50 + Math.sin((i / 20) * Math.PI * 2) * 36).toFixed(2)} r="1.1" fill="#3c0b10" opacity=".5" />)}
      </svg>
      <p className="me-wax relative flex h-full w-full items-center justify-center" style={{ fontSize: "inherit" }}>{a[0]}{b ? <span className="mx-[.08em] text-[.6em]">·</span> : null}{b?.[0]}</p>
    </div>
  );
}

/** Empire-style Moscow osobnyak (mansion) — hairline drawing with warm-lit windows. */
export function Mansion({ className = "" }: { className?: string }) {
  const cols = [150, 186, 222, 258, 294, 330];
  const wins = [30, 66, 102, 378, 414, 450];
  return (
    <svg viewBox="0 0 520 300" className={className} aria-hidden>
      <g fill="none" stroke="var(--t-ink)" strokeWidth="1" strokeOpacity=".75" strokeLinejoin="round">
        <path d="M10 280h500M14 288h492" />
        <path d="M20 280V120h480v160" />
        <path d="M14 120h492M20 112h480" />
        <path d="M130 112L240 56l110 56" />
        <path d="M140 112L240 62l100 50" strokeOpacity=".45" />
        <circle cx="240" cy="90" r="12" />
        <path d="M228 90h24M240 78v24" strokeOpacity=".4" />
        <path d="M134 120v12h212v-12M134 132h212" />
        {cols.map((x) => <g key={x}><path d={`M${x - 7} 140h14M${x - 8} 132h16M${x - 7} 272h14M${x - 9} 280h18`} /><path d={`M${x - 5} 140v132M${x + 5} 140v132`} /></g>)}
        <path d="M120 280v-12h240v12" />
        {wins.map((x) => (
          <g key={x}>
            <path d={`M${x} 250v-60a18 18 0 0 1 36 0v60Z`} />
            <path d={`M${x + 18} 250v-78M${x} 214h36`} strokeOpacity=".4" />
            <path d={`M${x - 4} 254h44M${x - 2} 168h40`} />
          </g>
        ))}
        <path d="M20 160h110M370 160h130" strokeOpacity=".4" />
        <path d="M220 280v-50a20 20 0 0 1 40 0v50" />
      </g>
      {wins.map((x) => <path key={`w${x}`} className="me-window" d={`M${x + 1} 249v-59a17 17 0 0 1 34 0v59Z`} fill="#f2c46d" opacity=".32" />)}
      <path className="me-window" d="M221 279v-49a19 19 0 0 1 38 0v49Z" fill="#f2c46d" opacity=".4" />
      {/* lamp posts */}
      {[100, 400].map((x) => <g key={x} stroke="var(--t-ink)" strokeOpacity=".7" fill="none"><path d={`M${x} 280v-60M${x - 8} 220h16l-3-12h-10Z`} /><circle cx={x} cy="214" r="10" fill="#f2c46d" opacity=".25" stroke="none" /></g>)}
      {/* snow on ledges */}
      <path d="M14 119c40-4 80 2 120-1s60-3 100 0 120-3 140 0 80 3 128 1" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Falling snow (CSS-only, three parallax layers). */
export const snow = (s = 1): CSSProperties => ({
  backgroundImage: "radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 60%, #fff 50%, transparent 51%), radial-gradient(2.5px 2.5px at 45% 80%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 85% 15%, #fff 50%, transparent 51%)",
  backgroundSize: `${220 * s}px ${220 * s}px, ${160 * s}px ${160 * s}px, ${300 * s}px ${300 * s}px, ${120 * s}px ${120 * s}px`,
});
