import { darken, lighten } from "../_shared/color";

// Jungle Safari — layered leaves and four friends who peek out to say hello.
export const JG = { sage: "#EEF2E6", cream: "#FBF8EE", deep: "#1F3A2B", leaf: "#3E7B4F", leaf2: "#5E9E5F", lime: "#A7C957", mustard: "#E9B44C", terra: "#D9724B", ink: "#24342A", sand: "#EAD9B0" };
const line = "#24342A";

/** Monstera leaf, stem base at (0,0), pointing up. */
export function Monstera({ x = 0, y = 0, s = 1, r = 0, c = JG.leaf, cls = "" }: { x?: number; y?: number; s?: number; r?: number; c?: string; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className={cls}>
        <path d="M0 0 C2 -40 0 -80 0 -110" stroke={darken(c, 0.2)} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M0 -100 C-60 -110 -110 -160 -100 -220 C-90 -270 -40 -300 0 -300 C40 -300 90 -270 100 -220 C110 -160 60 -110 0 -100Z" fill={c} />
        {[-1, 1].map((sd) => [-150, -195, -240].map((yy, i) => <path key={`c${sd}${i}`} d={`M${sd * 112} ${yy + 10} Q${sd * 70} ${yy} ${sd * 30} ${yy - 4} Q${sd * 70} ${yy - 6} ${sd * 112} ${yy - 8}Z`} fill={JG.sage} className="jg-cut" />))}
        {[-1, 1].map((sd) => [-170, -220].map((yy, i) => <ellipse key={`h${sd}${i}`} cx={sd * 30} cy={yy} rx="7" ry="11" fill={JG.sage} className="jg-cut" />))}
        <path d="M0 -100 C0 -170 2 -240 0 -296" stroke={lighten(c, 0.25)} strokeWidth="4" fill="none" />
        <path d="M-60 -250 C-40 -270 -20 -280 0 -282" stroke="#fff" strokeOpacity=".2" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Palm frond: rib from (0,0) curving, with leaflets. */
export function Frond({ x = 0, y = 0, s = 1, r = 0, c = JG.leaf2, n = 11, cls = "" }: { x?: number; y?: number; s?: number; r?: number; c?: string; n?: number; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className={cls}>
        <path d="M0 0 C-10 -120 30 -220 120 -280" stroke={darken(c, 0.25)} strokeWidth="5" fill="none" strokeLinecap="round" />
        {Array.from({ length: n }, (_, i) => {
          const t = (i + 1) / (n + 1);
          const px = +(-10 * 3 * t * (1 - t) ** 2 + 30 * 3 * t * t * (1 - t) + 120 * t ** 3).toFixed(1);
          const py = +(-120 * 3 * t * (1 - t) ** 2 - 220 * 3 * t * t * (1 - t) - 280 * t ** 3).toFixed(1);
          const L = 90 * (1 - t * 0.6);
          return (
            <g key={i} transform={`translate(${px} ${py})`}>
              <path d={`M0 0 Q${-L * 0.5} ${-L * 0.1} ${-L} ${L * 0.25} Q${-L * 0.5} ${L * 0.05} 0 0Z`} fill={i % 2 ? c : lighten(c, 0.1)} />
              <path d={`M0 0 Q${L * 0.2} ${-L * 0.55} ${L * 0.05} ${-L * 0.95} Q${L * 0.05} ${-L * 0.5} 0 0Z`} fill={i % 2 ? lighten(c, 0.1) : c} />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** Lion cub face, centre (0,0) ~ r 80. */
export function Lion({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const mane = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * 74).toFixed(1)},${(Math.sin(a) * 74).toFixed(1)}`;
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="jg-animal jg-lion">
        {mane.map((pt, i) => <circle key={i} cx={pt.split(",")[0]} cy={pt.split(",")[1]} r="22" fill={i % 2 ? "#C9692E" : "#D9823C"} />)}
        <circle r="70" fill="#D9823C" />
        <circle cx="-42" cy="-40" r="16" fill="#F2C46B" stroke={line} strokeOpacity=".3" strokeWidth="2" /><circle cx="-42" cy="-40" r="8" fill="#E9A38A" />
        <circle cx="42" cy="-40" r="16" fill="#F2C46B" stroke={line} strokeOpacity=".3" strokeWidth="2" /><circle cx="42" cy="-40" r="8" fill="#E9A38A" />
        <ellipse cx="0" cy="4" rx="52" ry="50" fill="#F2C46B" stroke={line} strokeOpacity=".3" strokeWidth="2" />
        <ellipse cx="0" cy="26" rx="26" ry="20" fill="#FBE3B0" />
        <g className="jg-eyes"><ellipse cx="-18" cy="-6" rx="5" ry="6.5" fill={line} /><ellipse cx="18" cy="-6" rx="5" ry="6.5" fill={line} /><circle cx="-16.5" cy="-8" r="1.8" fill="#fff" /><circle cx="19.5" cy="-8" r="1.8" fill="#fff" /></g>
        <path d="M-8 14 Q0 10 8 14 Q4 22 0 22 Q-4 22 -8 14Z" fill="#8A4B3A" />
        <path d="M0 22 V28 M0 28 C-4 34 -10 34 -12 30 M0 28 C4 34 10 34 12 30" stroke={line} strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="-34" cy="14" rx="8" ry="5" fill="#E98A6A" opacity=".55" /><ellipse cx="34" cy="14" rx="8" ry="5" fill="#E98A6A" opacity=".55" />
        <path d="M-14 -40 C-6 -48 6 -48 14 -40" stroke="#C9692E" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Giraffe head + long neck; neck base at (0,0), head up-left. */
export function Giraffe({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  const c = "#F2C46B";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="jg-animal jg-giraffe">
        <path d="M-26 0 C-30 -120 -34 -220 -44 -290 L-4 -296 C2 -220 10 -120 24 0Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="2" />
        {[[-14, -40, 12], [4, -90, 10], [-20, -130, 11], [-6, -180, 10], [-26, -220, 9], [-14, -262, 8], [8, -20, 9]].map(([cx, cy, r], i) => <path key={i} d={`M${cx - r} ${cy} q${r} ${-r * 1.1} ${r * 2} 0 q${-r * 0.2} ${r} ${-r} ${r * 0.9} q${-r * 0.8} ${-r * 0.1} ${-r} ${-r * 0.9}Z`} fill="#C9823C" />)}
        <path d="M-4 -296 C6 -240 6 -200 8 -160" stroke="#C9823C" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 8" fill="none" />
        <path d="M-56 -300 C-70 -330 -40 -350 -10 -340 C20 -330 30 -300 10 -286 C-10 -276 -44 -280 -56 -300Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="2" />
        <path d="M-70 -306 C-86 -300 -86 -284 -70 -282 C-60 -282 -56 -292 -60 -300Z" fill="#F6D9A2" stroke={line} strokeOpacity=".3" strokeWidth="2" />
        <circle cx="-76" cy="-292" r="2" fill={line} />
        <path d="M-30 -340 L-34 -366 M-14 -342 L-12 -368" stroke="#B5703A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="-34" cy="-368" r="6" fill="#8A4B3A" /><circle cx="-12" cy="-370" r="6" fill="#8A4B3A" />
        <path d="M0 -330 C14 -342 26 -338 26 -326 C20 -322 10 -322 0 -326Z" fill={c} stroke={line} strokeOpacity=".3" strokeWidth="2" />
        <g className="jg-eyes"><path d="M-40 -314 C-36 -320 -28 -320 -24 -314" stroke={line} strokeWidth="2.6" fill="none" strokeLinecap="round" /><circle cx="-32" cy="-312" r="4" fill={line} /></g>
        <ellipse cx="-44" cy="-298" rx="6" ry="3.5" fill="#E98A6A" opacity=".55" />
      </g>
    </g>
  );
}

/** Monkey hanging by its tail from a vine at (0,0). */
export function Monkey({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const fur = "#8A5A3C";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="jg-animal jg-monkey">
        <path d="M0 0 C-20 10 -20 30 0 34 C18 38 20 60 4 80" stroke={fur} strokeWidth="7" fill="none" strokeLinecap="round" />
        <ellipse cx="0" cy="110" rx="26" ry="32" fill={fur} />
        <path d="M-20 92 C-40 110 -44 130 -36 146 M20 92 C40 110 44 130 36 146" stroke={fur} strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="-36" cy="148" r="7" fill="#E9C9A0" /><circle cx="36" cy="148" r="7" fill="#E9C9A0" />
        <ellipse cx="0" cy="116" rx="15" ry="18" fill="#E9C9A0" />
        <circle cx="0" cy="170" r="32" fill={fur} />
        <circle cx="-32" cy="168" r="11" fill={fur} /><circle cx="-32" cy="168" r="6" fill="#E9C9A0" />
        <circle cx="32" cy="168" r="11" fill={fur} /><circle cx="32" cy="168" r="6" fill="#E9C9A0" />
        <path d="M-20 170 C-24 150 -6 146 0 156 C6 146 24 150 20 170 C24 190 10 198 0 196 C-10 198 -24 190 -20 170Z" fill="#E9C9A0" />
        <g className="jg-eyes"><circle cx="-9" cy="166" r="4" fill={line} /><circle cx="9" cy="166" r="4" fill={line} /><circle cx="-8" cy="164.6" r="1.3" fill="#fff" /><circle cx="10" cy="164.6" r="1.3" fill="#fff" /></g>
        <path d="M-8 184 C-3 190 3 190 8 184" stroke={line} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="-16" cy="180" rx="5" ry="3" fill="#E98A6A" opacity=".55" /><ellipse cx="16" cy="180" rx="5" ry="3" fill="#E98A6A" opacity=".55" />
      </g>
    </g>
  );
}

/** Toucan perched at (0,0) on a branch, facing right. */
export function Toucan({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="jg-animal jg-toucan">
        <path d="M-10 -10 C-30 20 -24 50 -14 70 L0 70 C-4 40 0 20 10 0Z" fill="#24342A" />
        <ellipse cx="0" cy="-20" rx="26" ry="34" fill="#24342A" />
        <ellipse cx="6" cy="-30" rx="15" ry="18" fill="#FBF0D0" />
        <path d="M14 -46 C40 -60 76 -50 84 -36 C70 -30 40 -28 18 -30Z" fill={JG.mustard} stroke={line} strokeOpacity=".4" strokeWidth="2" />
        <path d="M18 -30 C40 -28 70 -30 84 -36 C80 -26 52 -20 22 -22Z" fill={JG.terra} />
        <path d="M70 -46 C78 -44 82 -40 84 -36" stroke={line} strokeWidth="3" fill="none" />
        <circle cx="4" cy="-42" r="7" fill="#7FC6C0" /><circle cx="5" cy="-42" r="3.4" fill={line} /><circle cx="6.2" cy="-43.4" r="1.1" fill="#fff" />
        <path d="M-6 14 l-4 10 M4 14 l2 10" stroke={JG.mustard} strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Vine({ x1, y1, x2, y2, sag = 60 }: { x1: number; y1: number; x2: number; y2: number; sag?: number }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  return (
    <g>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke="#6B8E4E" strokeWidth="6" fill="none" strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
        return <path key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${i % 2 ? 30 : -150})`} d="M0 0 C6 -10 18 -12 24 -4 C16 2 6 4 0 0Z" fill={i % 2 ? JG.lime : JG.leaf2} />;
      })}
    </g>
  );
}

export function Paw({ x = 0, y = 0, s = 1, r = 0, c = JG.leaf }: { x?: number; y?: number; s?: number; r?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={c}>
      <ellipse cx="0" cy="6" rx="10" ry="8" />
      <ellipse cx="-11" cy="-6" rx="4" ry="5" /><ellipse cx="-4" cy="-11" rx="4" ry="5" /><ellipse cx="4" cy="-11" rx="4" ry="5" /><ellipse cx="11" cy="-6" rx="4" ry="5" />
    </g>
  );
}
