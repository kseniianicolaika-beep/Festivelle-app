import { useId, type CSSProperties } from "react";
import { leaf, petal, Bloom, Branch, Paint, type Pal } from "../_shared/botanic";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

/** Damask wallpaper as a CSS background-image (inline SVG, offset half-drop repeat). */
export function damask(fg = "#4a2a2c", bg = "#33191b") {
  const motif = (x: number, y: number) => `<g fill='${fg}' transform='translate(${x} ${y})'>
  <path d='${petal(46, 18)}'/><path d='${petal(30, 14)}' transform='rotate(40)'/><path d='${petal(30, 14)}' transform='rotate(-40)'/>
  <path d='${leaf(34, 12)}' transform='translate(0 8) rotate(120)'/><path d='${leaf(34, 12)}' transform='translate(0 8) rotate(-120)'/>
  <path d='${petal(18, 8)}' transform='translate(0 14) rotate(180)'/><circle cy='-52' r='3'/><circle cy='34' r='3'/></g>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='140'><rect width='120' height='140' fill='${bg}'/>${motif(60, 64)}${motif(0, 134)}${motif(120, 134)}${motif(0, -6)}${motif(120, -6)}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

/** Rococo gilt corner scroll (top-left). */
export function GiltCorner({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6E4E1C" /><stop offset=".3" stopColor="#F6DE9A" /><stop offset=".55" stopColor="#B8893A" /><stop offset=".75" stopColor="#FFF0C0" /><stop offset="1" stopColor="#8A6428" /></linearGradient>
        <filter id={`${id}s`}><feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#2a1400" floodOpacity=".6" /></filter>
      </defs>
      <g fill={`url(#${id}g)`} filter={`url(#${id}s)`}>
        <path d="M6 6C30 2 52 8 60 22C50 16 38 16 30 22C42 22 48 30 46 40C40 32 30 30 22 34C26 42 22 52 14 56C16 46 12 38 6 34C10 26 8 16 6 6Z" />
        <path d="M60 22C70 18 80 22 84 30C76 26 68 28 64 34C62 30 62 26 60 22Z" />
        <path d="M34 22C24 26 20 36 22 46C14 38 14 26 22 18Z" />
        <circle cx="12" cy="12" r="5" />
        <path d={leaf(18, 6)} transform="translate(46 40) rotate(140)" />
        <path d={leaf(18, 6)} transform="translate(40 46) rotate(130)" />
      </g>
    </svg>
  );
}

const DRIED: Pal = { light: "#F3D9CC", mid: "#C98B8B", deep: "#7A3B42", leaf: "#A7A88A", leafDeep: "#5D5E45" };

/** A still life of dried roses — shown in the frame when no photograph is set. */
export function StillLife({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Paint pal={DRIED} viewBox="0 0 300 380" className={className} style={style}>
      {(id) => (
        <g>
          <rect width="300" height="380" fill="#E9DCC6" />
          <rect width="300" height="380" fill="#A8865A" opacity=".18" />
          <Branch id={id} x={150} y={330} len={240} rot={-20} n={11} pal={DRIED} seed={4} />
          <Branch id={id} x={150} y={330} len={220} rot={24} n={10} pal={DRIED} seed={6} />
          <Bloom id={id} x={120} y={150} r={46} seed={3} pal={DRIED} />
          <Bloom id={id} x={190} y={190} r={38} seed={8} pal={DRIED} ruffle />
          <Bloom id={id} x={140} y={240} r={30} seed={11} pal={DRIED} />
          <path d="M100 300h100l-10 70h-80Z" fill="#8A7A60" opacity=".85" />
          <ellipse cx="150" cy="300" rx="50" ry="8" fill="#6E604A" />
        </g>
      )}
    </Paint>
  );
}

/** Dried-rose sprig divider. */
export function RoseRule({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Paint pal={DRIED} viewBox="0 0 260 70" className={className} style={style}>
      {(id) => (
        <g>
          <path d="M0 40H92M168 40H260" stroke="#C9A35A" strokeWidth="1" />
          <Branch id={id} x={130} y={44} len={70} rot={-80} n={6} pal={DRIED} seed={2} />
          <Branch id={id} x={130} y={44} len={70} rot={80} n={6} pal={DRIED} seed={5} />
          <Bloom id={id} x={130} y={40} r={17} seed={9} pal={DRIED} />
        </g>
      )}
    </Paint>
  );
}
