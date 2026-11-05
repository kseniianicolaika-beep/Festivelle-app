// Solitaire — hand-built art: a brilliant-cut solitaire in perspective, blush silk drapery, a hairline villa door.
import type { CSSProperties } from "react";

const s = (c: string): CSSProperties => ({ stopColor: c });

/** The solitaire ring: rose-gold band in perspective, four claws, a faceted brilliant with refracted blush light. */
export function Ring({ className = "", id = "sr", glint = true }: { className?: string; id?: string; glint?: boolean }) {
  return (
    <svg viewBox="0 0 200 190" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-band`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={s("var(--foil-a)")} />
          <stop offset=".28" style={s("var(--foil-b)")} />
          <stop offset=".5" style={s("color-mix(in oklab, var(--foil-a) 70%, black)")} />
          <stop offset=".72" style={s("var(--foil-b)")} />
          <stop offset="1" style={s("var(--foil-a)")} />
        </linearGradient>
        <linearGradient id={`${id}-in`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={s("color-mix(in oklab, var(--foil-a) 60%, black)")} />
          <stop offset="1" style={s("var(--foil-b)")} />
        </linearGradient>
        <linearGradient id={`${id}-f1`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" style={s("color-mix(in oklab, var(--t-accent) 22%, white)")} />
        </linearGradient>
        <linearGradient id={`${id}-f2`} x1="1" x2="0" y1="0" y2="1">
          <stop offset="0" style={s("color-mix(in oklab, var(--t-accent) 30%, white)")} />
          <stop offset="1" stopColor="#f3f1ff" />
        </linearGradient>
        <linearGradient id={`${id}-f3`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" style={s("color-mix(in oklab, var(--foil-b) 40%, white)")} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".4" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* band: outer ellipse minus inner, then the near rim highlight */}
      <path fillRule="evenodd" fill={`url(#${id}-band)`} d="M100 112c-44 0-68 14-68 34s24 34 68 34 68-14 68-34-24-34-68-34Zm0 7c-38 0-60 11-60 27s22 27 60 27 60-11 60-27-22-27-60-27Z" />
      <path fill={`url(#${id}-in)`} opacity=".55" d="M40 146c0-16 22-27 60-27s60 11 60 27c-6-12-30-20-60-20s-54 8-60 20Z" />
      <path d="M36 150c8 16 34 25 64 25s56-9 64-25" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth=".8" />
      <g transform="translate(100 113) scale(1.5) translate(-100 -106)">
      {/* claws */}
      <g fill="none" stroke={`url(#${id}-band)`} strokeWidth="2.6" strokeLinecap="round">
        <path d="M86 106c-3-10-6-16-10-22" />
        <path d="M114 106c3-10 6-16 10-22" />
        <path d="M95 106c-1-8-1-14-2-20" />
        <path d="M105 106c1-8 1-14 2-20" />
      </g>
      <path d="M84 106c4 3 28 3 32 0" fill="none" stroke={`url(#${id}-band)`} strokeWidth="3" />
      {/* brilliant: crown + pavilion facets */}
      <g stroke="color-mix(in oklab, var(--foil-a) 55%, white)" strokeWidth=".5" strokeLinejoin="round">
        <path fill={`url(#${id}-f3)`} d="M84 58h32l14 16H70Z" />
        <path fill={`url(#${id}-f1)`} d="M84 58l-14 16h22Z" />
        <path fill={`url(#${id}-f2)`} d="M116 58l14 16h-22Z" />
        <path fill="#fff" d="M92 74l8-16 8 16Z" opacity=".9" />
        <path fill={`url(#${id}-f2)`} d="M70 74l30 30-14-30Z" />
        <path fill={`url(#${id}-f1)`} d="M86 74l14 30 0-30Z" />
        <path fill={`url(#${id}-f3)`} d="M100 74v30l14-30Z" />
        <path fill={`url(#${id}-f1)`} d="M114 74l-14 30 30-30Z" />
      </g>
      <path d="M86 61l-6 7M98 60l-3 9" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".9" />
      {glint && (
        <g className="sol-glint" style={{ transformOrigin: "106px 62px" }}>
          <circle cx="106" cy="62" r="16" fill={`url(#${id}-glow)`} />
          <path d="M106 40l2.2 19.8L128 62l-19.8 2.2L106 84l-2.2-19.8L84 62l19.8-2.2Z" fill="#fff" />
        </g>
      )}
      </g>
    </svg>
  );
}

/** Blush silk drapery — layered folds with sheen. Slice-fills its box. */
export function Silk({ className = "", id = "silk" }: { className?: string; id?: string }) {
  const tone = (p: number) => `color-mix(in oklab, var(--t-accent) ${p}%, var(--t-bg))`;
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-a`} x1="0" x2="1" y1="0" y2=".3">
          <stop offset="0" style={s(tone(10))} />
          <stop offset=".35" style={s("var(--t-surface)")} />
          <stop offset=".6" style={s(tone(16))} />
          <stop offset="1" style={s(tone(6))} />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" x2="1" y1=".2" y2="0">
          <stop offset="0" style={s(tone(18))} />
          <stop offset=".45" style={s(tone(4))} />
          <stop offset=".55" style={s("#fff")} />
          <stop offset=".7" style={s(tone(14))} />
          <stop offset="1" style={s(tone(22))} />
        </linearGradient>
        <linearGradient id={`${id}-c`} x1="1" x2="0" y1="0" y2="1">
          <stop offset="0" style={s(tone(8))} />
          <stop offset=".5" style={s("var(--t-surface)")} />
          <stop offset="1" style={s(tone(20))} />
        </linearGradient>
        <filter id={`${id}-soft`}><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="1000" height="1000" fill={`url(#${id}-a)`} />
      <g filter={`url(#${id}-soft)`}>
        <path className="sol-fold1" fill={`url(#${id}-b)`} d="M-50 620C160 520 300 700 520 610S860 420 1060 520V1050H-50Z" opacity=".9" />
        <path className="sol-fold2" fill={`url(#${id}-c)`} d="M-50 780C200 700 380 860 600 780S900 640 1060 720V1050H-50Z" opacity=".85" />
        <path className="sol-fold1" fill={`url(#${id}-b)`} d="M-50 -40C120 80 260 20 420 140S760 120 1060 40V-50H-50Z" opacity=".7" />
        <path d="M-20 650C190 560 320 730 530 640S860 470 1040 560" fill="none" stroke="#fff" strokeWidth="5" opacity=".6" />
        <path d="M-20 805C210 730 390 880 610 805S900 670 1040 745" fill="none" stroke="#fff" strokeWidth="4" opacity=".45" />
      </g>
    </svg>
  );
}

/** Hairline arched doorway with a bougainvillea spray — the venue vignette. */
export function Doorway({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 300" className={className} aria-hidden fill="none" stroke="var(--t-gold)" strokeWidth="1" strokeLinecap="round" data-draw>
      <path d="M50 290V120a70 70 0 0 1 140 0v170" />
      <path d="M62 290V122a58 58 0 0 1 116 0v168" />
      <path d="M120 64v226M62 180h116" strokeOpacity=".5" />
      <path d="M30 290h180M24 296h192" />
      <path d="M78 120a42 42 0 0 1 84 0" strokeOpacity=".6" />
      <path d="M190 110c18-8 30-30 26-52M200 96c12 4 22 0 30-10M206 74c-6-10-4-22 6-28" stroke="var(--t-accent)" />
      {[[214, 58], [226, 84], [204, 88], [222, 44], [196, 72]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y}c-5-6-1-12 4-10 2-6 10-4 9 2 6 2 4 10-2 10-1 6-9 6-11 0Z`} stroke="var(--t-accent)" />
      ))}
      <circle cx="152" cy="200" r="3" />
    </svg>
  );
}

/** Thin gold rule with a centred brilliant. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 16" className={className} aria-hidden>
      <path d="M0 8h104M136 8h104" stroke="var(--t-gold)" strokeWidth=".7" />
      <path d="M120 1l7 7-7 7-7-7Z" fill="none" stroke="var(--t-gold)" strokeWidth=".8" />
      <path d="M120 4l4 4-4 4-4-4Z" fill="var(--t-gold)" opacity=".6" />
    </svg>
  );
}
