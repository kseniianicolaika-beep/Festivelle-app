import { r2 } from "../_shared/geo";

// Constellation — an evening mixer where people are stars: points of light (data-node) joined by fine gold lines
// (data-link) into a constellation. Midnight indigo, champagne and a blush accent.

const NODES: [number, number, number][] = [
  [40, 70, 3.2], [92, 38, 2.4], [150, 62, 4], [206, 30, 2.6], [258, 74, 3.4], [300, 120, 2.4], [246, 150, 3],
  [190, 128, 2.2], [130, 150, 3.6], [72, 132, 2.4], [24, 170, 2.8], [104, 210, 2.6], [176, 206, 3.2], [240, 222, 2.4], [292, 196, 2.8],
];
const LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2], [7, 8], [8, 9], [9, 0], [9, 10], [8, 11], [11, 12], [12, 6], [12, 13], [13, 14], [14, 5], [8, 12]];

/** viewBox 320×240. Lines are drawn with pathLength=1 so they can be animated with strokeDashoffset. */
export function Network({ className = "", style, still = false }: { className?: string; style?: React.CSSProperties; still?: boolean }) {
  return (
    <svg viewBox="0 0 320 240" className={className} style={style} aria-hidden overflow="visible">
      {LINKS.map(([a, b], i) => (
        <line key={i} data-link x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke="#e9b949" strokeOpacity=".55" strokeWidth=".8" pathLength={1} />
      ))}
      {NODES.map(([x, y, r], i) => (
        <g key={i} data-node>
          <circle cx={x} cy={y} r={r2(r * 3)} fill={i % 5 === 2 ? "#f3a7b5" : "#f4ecff"} opacity=".12" />
          <circle cx={x} cy={y} r={r} fill={i % 5 === 2 ? "#f3a7b5" : "#f4ecff"} className={still ? "" : "cn-twinkle"} style={{ animationDelay: `${(i % 6) * 0.5}s` }} />
        </g>
      ))}
    </svg>
  );
}

export const CN_CSS = `
.cn-night{background-color:#141833;background-image:radial-gradient(rgba(183,176,214,.45) 1px,transparent 1.3px),radial-gradient(rgba(244,236,255,.3) .8px,transparent 1.1px),radial-gradient(60% 50% at 70% 20%,rgba(122,96,200,.25),transparent 70%),radial-gradient(50% 40% at 10% 90%,rgba(243,167,181,.12),transparent 70%);background-size:53px 61px,37px 43px,auto,auto;background-position:0 0,19px 23px,0 0,0 0}
.cn-gold{background:linear-gradient(100deg,#c79a32,#f8e3a3 45%,#e9b949 60%,#c79a32);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.cn-shine{animation:cnShine 9s ease-in-out infinite}
@keyframes cnShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.cn-twinkle{animation:cnTw 3.6s ease-in-out infinite}
@keyframes cnTw{0%,100%{opacity:.7}50%{opacity:1}}
.cn-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.cn-shine,.cn-twinkle{animation:none!important}}
`;
