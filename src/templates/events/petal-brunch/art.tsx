import { useId, type CSSProperties } from "react";

// Petal Brunch — a loose garden bouquet (peonies, garden roses, sweet peas, eucalyptus) tied with a long silk
// ribbon (data-ribbon tails for the untie), two champagne coupes, and drifting petals.

function Peony({ x, y, r, c1, c2, id, rot = 0 }: { x: number; y: number; r: number; c1: string; c2: string; id: string; rot?: number }) {
  const petals = 9;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * 360;
        return <ellipse key={i} cx="0" cy={-r * 0.48} rx={r * 0.42} ry={r * 0.6} transform={`rotate(${a})`} fill={`url(#${id})`} stroke={c2} strokeOpacity=".35" strokeWidth=".8" />;
      })}
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx="0" cy={-r * 0.24} rx={r * 0.26} ry={r * 0.36} transform={`rotate(${i * 60 + 20})`} fill={c1} stroke={c2} strokeOpacity=".4" strokeWidth=".7" />)}
      <circle r={r * 0.2} fill={c2} opacity=".55" />
    </g>
  );
}

function Rose({ x, y, r, fill, line }: { x: number; y: number; r: number; fill: string; line: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={fill} />
      <path d={`M${-r * 0.55} ${-r * 0.1}c${r * 0.2} ${-r * 0.6} ${r * 0.9} ${-r * 0.6} ${r * 1.05} 0M${-r * 0.7} ${r * 0.3}c${r * 0.4} ${r * 0.45} ${r} ${r * 0.45} ${r * 1.35} 0M${-r * 0.25} ${-r * 0.05}c${r * 0.15} ${-r * 0.3} ${r * 0.45} ${-r * 0.3} ${r * 0.5} 0`} stroke={line} strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </g>
  );
}

const Leaf = ({ d, fill }: { d: string; fill: string }) => <path d={d} fill={fill} />;

/** The bouquet. viewBox 300×380. */
export function Bouquet({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 300 380" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`pa${u}`} cx=".5" cy=".7"><stop offset="0" stopColor="#fff4f1" /><stop offset=".55" stopColor="#f6c9cf" /><stop offset="1" stopColor="#e39aa8" /></radialGradient>
        <radialGradient id={`pb${u}`} cx=".5" cy=".7"><stop offset="0" stopColor="#fffaf3" /><stop offset=".6" stopColor="#f6e2cf" /><stop offset="1" stopColor="#e2bf9c" /></radialGradient>
        <radialGradient id={`pc${u}`} cx=".5" cy=".7"><stop offset="0" stopColor="#f7b9c3" /><stop offset=".6" stopColor="#d76b83" /><stop offset="1" stopColor="#9e2f4c" /></radialGradient>
        <linearGradient id={`rb${u}`} x1="0" x2="1"><stop offset="0" stopColor="#c25a72" /><stop offset=".5" stopColor="#f2b6c1" /><stop offset="1" stopColor="#b23a52" /></linearGradient>
      </defs>
      {/* stems */}
      {[[-14, 0], [-6, 0], [2, 0], [10, 0], [16, 0]].map(([dx], i) => <path key={i} d={`M${150 + dx} 230 L${146 + dx * 0.4} 352`} stroke="#6e8a62" strokeWidth="3.2" strokeLinecap="round" />)}
      {/* eucalyptus + greenery */}
      <Leaf d="M70 150c-30-30-34-70-20-96 22 24 30 62 20 96z" fill="#9db394" />
      <Leaf d="M232 150c30-32 32-72 16-98-20 26-28 66-16 98z" fill="#8aa582" />
      {[[58, 196], [44, 176], [40, 152], [246, 196], [258, 172], [262, 148]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="11" ry="8" fill={i % 2 ? "#a9bfa1" : "#b9cdb1"} stroke="#7f9877" strokeWidth=".6" />)}
      <path d="M50 200c20-6 40-6 60 10M250 200c-20-6-40-6-60 10" stroke="#7f9877" strokeWidth="1.4" fill="none" />
      {/* blooms */}
      <Peony x={110} y={150} r={46} c1="#fbe3e3" c2="#c56a7f" id={`pa${u}`} rot={-12} />
      <Peony x={196} y={142} r={42} c1="#fff3e8" c2="#c79a73" id={`pb${u}`} rot={18} />
      <Peony x={152} y={96} r={40} c1="#f7cbd3" c2="#9e2f4c" id={`pc${u}`} />
      <Rose x={150} y={186} r={22} fill="#fbe9e4" line="#c9877f" />
      <Rose x={84} y={198} r={16} fill="#f3bcc6" line="#a54a62" />
      <Rose x={222} y={194} r={17} fill="#f8ded2" line="#b98463" />
      {/* sweet peas */}
      {[[70, 112], [236, 100], [124, 52], [186, 58]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40 - 30})`}>
          <path d="M0 0c-8-10-2-20 6-18 6 2 6 12-6 18zM0 0c8-10 18-6 16 2-2 6-10 6-16-2z" fill={i % 2 ? "#e9c6e4" : "#f6d1d8"} stroke="#b07aa0" strokeWidth=".6" />
        </g>
      ))}
      {/* the ribbon bow + tails (tails animate) */}
      <g transform="translate(150 262)">
        <path d="M0 0c-26-22-58-18-60-2s32 18 60 2z" fill={`url(#rb${u})`} />
        <path d="M0 0c26-22 58-18 60-2s-32 18-60 2z" fill={`url(#rb${u})`} />
        <path data-ribbon="l" className="evpb-tail" d="M-4 4c-14 30-34 56-44 98 10-4 18-2 24 4 4-38 14-66 26-98z" fill={`url(#rb${u})`} />
        <path data-ribbon="r" className="evpb-tail evpb-tail-r" d="M4 4c14 30 30 56 36 98-8-4-16-2-22 4-2-38-6-66-14-98z" fill={`url(#rb${u})`} />
        <ellipse rx="9" ry="8" fill="#b23a52" />
      </g>
    </svg>
  );
}

/** A champagne coupe with a petal floating in it. viewBox 120×160. */
export function Coupe({ className = "", style, tilt = 0 }: { className?: string; style?: CSSProperties; tilt?: number }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`ch${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbe6b4" /><stop offset="1" stopColor="#e2b766" /></linearGradient>
      </defs>
      <g transform={`rotate(${tilt} 60 150)`}>
        <path d="M14 30h92c0 26-20 40-46 40S14 56 14 30z" fill={`url(#ch${u})`} opacity=".9" />
        <path d="M14 30h92c0 26-20 40-46 40S14 56 14 30z" fill="none" stroke="#c9a36a" strokeWidth="1.6" />
        <ellipse cx="60" cy="30" rx="46" ry="6" fill="#fff4d8" stroke="#c9a36a" strokeWidth="1.2" />
        {[[40, 50], [68, 56], [54, 44], [80, 46]].map(([x, y], i) => <circle key={i} className="evpb-bub" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy={y} r="1.6" fill="#fff" opacity=".8" />)}
        <path d="M60 70v66" stroke="#c9a36a" strokeWidth="2.4" />
        <ellipse cx="60" cy="140" rx="28" ry="5" fill="none" stroke="#c9a36a" strokeWidth="2" />
        <path d="M66 26c6-6 14-4 14 2s-10 6-14-2z" fill="#f2a5b4" />
      </g>
    </svg>
  );
}

/** Drifting petals layer (pure CSS). */
export function Petals({ n = 14, className = "" }: { n?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="evpb-petal" style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i * 1.7) % 11}s`, animationDuration: `${11 + (i % 5) * 2}s`, width: `${10 + (i % 4) * 4}px`, height: `${8 + (i % 3) * 4}px`, background: i % 3 ? "#f3b7c2" : "#fbe0d6" }} />
      ))}
    </div>
  );
}

/** Small sprig for dividers. viewBox 120×30. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 30" className={className} aria-hidden>
      <path d="M6 15h108" stroke="#c9a36a" strokeWidth="1" />
      {[22, 40, 80, 98].map((x, i) => <ellipse key={i} cx={x} cy={i % 2 ? 10 : 20} rx="6" ry="3.4" fill="#a9bfa1" transform={`rotate(${i % 2 ? -25 : 25} ${x} ${i % 2 ? 10 : 20})`} />)}
      <circle cx="60" cy="15" r="6" fill="#f3b7c2" stroke="#b23a52" strokeWidth=".8" />
    </svg>
  );
}

export const PB_CSS = `
.evpb-root{background-color:#fbf4ef;background-image:radial-gradient(70% 50% at 50% 0%,rgba(246,201,207,.45),transparent 70%),radial-gradient(60% 40% at 100% 100%,rgba(233,198,228,.25),transparent 70%)}
.evpb-foil{background:linear-gradient(100deg,#9e2f4c 0%,#c25a72 30%,#b8865a 52%,#9e2f4c 74%,#c25a72 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evpb-shine{animation:evpbShine 8s ease-in-out infinite}
@keyframes evpbShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evpb-petal{position:absolute;top:-20px;border-radius:70% 0 70% 0;opacity:.75;animation:evpbFall 13s linear infinite}
@keyframes evpbFall{0%{transform:translate3d(0,-10vh,0) rotate(0)}100%{transform:translate3d(60px,120vh,0) rotate(540deg)}}
.evpb-tail{transform-origin:0 0;animation:evpbSway 5s ease-in-out infinite}
.evpb-tail-r{animation-delay:-2.5s}
@keyframes evpbSway{0%,100%{transform:rotate(0)}50%{transform:rotate(4deg)}}
.evpb-bub{animation:evpbBub 3s ease-in infinite}
@keyframes evpbBub{0%{transform:translateY(0);opacity:0}30%{opacity:.9}100%{transform:translateY(-22px);opacity:0}}
@media (prefers-reduced-motion: reduce){.evpb-petal,.evpb-tail,.evpb-bub,.evpb-shine{animation:none!important}.evpb-petal{display:none}}
`;
