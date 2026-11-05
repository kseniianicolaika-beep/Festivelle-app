import { useId, type CSSProperties } from "react";
import { petal, leaf } from "../_shared/botanic";
import { r2, rng } from "../_shared/kit";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
export const FOLK = { red: "#D4372C", deep: "#8E1B14", gold: "#F2B33A", ochre: "#E08A1E", green: "#3E7A3A", blue: "#2F5DA8", cream: "#FFF4E0", ink: "#3A140C" };

/** Yarilo — the folk spring sun with a sleepy smiling face and petal rays. */
export function FolkSun({ className, style, face = true }: { className?: string; style?: CSSProperties; face?: boolean }) {
  const id = useUid();
  return (
    <svg viewBox="-200 -200 400 400" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}s`} cx=".42" cy=".38" r=".7"><stop offset="0" stopColor="#FFE58A" /><stop offset=".6" stopColor="#F7B733" /><stop offset="1" stopColor="#E08A1E" /></radialGradient>
      </defs>
      <g className="ms-rays">
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={petal(i % 2 ? 150 : 190, i % 2 ? 26 : 34)} transform={`rotate(${i * 22.5}) translate(0 -70)`} fill={i % 2 ? FOLK.gold : FOLK.red} />)}
        {Array.from({ length: 16 }, (_, i) => <path key={"w" + i} d={petal(i % 2 ? 90 : 120, 9)} transform={`rotate(${i * 22.5}) translate(0 -80)`} fill={i % 2 ? FOLK.red : FOLK.gold} opacity=".9" />)}
      </g>
      <circle r="96" fill={FOLK.deep} />
      <circle r="88" fill={`url(#${id}s)`} />
      {Array.from({ length: 24 }, (_, i) => <circle key={"d" + i} cx={r2(Math.cos((i / 24) * Math.PI * 2) * 78)} cy={r2(Math.sin((i / 24) * Math.PI * 2) * 78)} r="3" fill={FOLK.red} />)}
      {face && (
        <g fill="none" stroke={FOLK.ink} strokeWidth="5" strokeLinecap="round">
          <path d="M-42-10Q-28-24-14-10M14-10Q28-24 42-10" />
          <path d="M-26 26Q0 46 26 26" />
          <circle cx="-48" cy="18" r="13" fill="#F26B5B" stroke="none" opacity=".75" />
          <circle cx="48" cy="18" r="13" fill="#F26B5B" stroke="none" opacity=".75" />
        </g>
      )}
    </svg>
  );
}

/** One golden lacy blin seen from above (perspective squashed). */
export function blinShape(id: string, seed: number, w = 200, h = 70) {
  const R = rng(seed);
  return (
    <g>
      <ellipse rx={w / 2} ry={h / 2} fill={`url(#${id}b)`} />
      {Array.from({ length: 26 }, (_, i) => {
        const a = R() * Math.PI * 2;
        const d = Math.sqrt(R()) * 0.85;
        return <ellipse key={i} cx={r2(Math.cos(a) * d * w * 0.5)} cy={r2(Math.sin(a) * d * h * 0.5)} rx={r2(2 + R() * 7)} ry={r2(1 + R() * 2.5)} fill="#B4621A" opacity={r2(0.25 + R() * 0.4)} />;
      })}
      <ellipse rx={w / 2} ry={h / 2} fill="none" stroke="#B4621A" strokeWidth="3" opacity=".55" />
    </g>
  );
}

/** A tall stack of blini on a painted Gorodets plate, butter melting on top. `n` = blini. */
export function Blini({ className, style, n = 9, butter = true }: { className?: string; style?: CSSProperties; n?: number; butter?: boolean }) {
  const id = useUid();
  const N = Math.min(Math.max(n, 1), 16);
  const top = 250 - N * 12;
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}b`} cx=".45" cy=".4" r=".7"><stop offset="0" stopColor="#FFE08A" /><stop offset=".6" stopColor="#F2B33A" /><stop offset="1" stopColor="#D17A1A" /></radialGradient>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9A23A" /><stop offset="1" stopColor="#B4621A" /></linearGradient>
      </defs>
      <ellipse cx="150" cy="268" rx="140" ry="30" fill={FOLK.deep} />
      <ellipse cx="150" cy="262" rx="140" ry="30" fill={FOLK.red} />
      <ellipse cx="150" cy="262" rx="118" ry="23" fill={FOLK.cream} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={r2(150 + Math.cos(a) * 129)} cy={r2(262 + Math.sin(a) * 26.5)} r="4" fill={FOLK.gold} />;
      })}
      {Array.from({ length: N }, (_, i) => (
        <g key={i} className="ms-blin" transform={`translate(${r2(150 + Math.sin(i * 1.7) * 5)} ${250 - i * 12})`}>
          <path d="M-100 0V9A100 30 0 0 0 100 9V0Z" fill={`url(#${id}e)`} />
          {blinShape(id, i + 3, 200, 60)}
        </g>
      ))}
      {butter && (
        <g transform={`translate(150 ${top + 2})`}>
          <path d="M-26-8L0-20L28-8L26 6L0 16L-28 6Z" fill="#FFF0A8" />
          <path d="M-26-8L0 2L28-8M0 2V16" stroke="#E9C85A" strokeWidth="1.5" fill="none" />
          <path d="M-30 8Q-40 14-34 20Q-26 16-24 10Z" fill="#FFE98A" opacity=".85" />
        </g>
      )}
    </svg>
  );
}

/** Gorodets rosette (folk painted flower). */
export function rosette(x: number, y: number, r: number, c: string, key: string) {
  return (
    <g key={key} transform={`translate(${r2(x)} ${r2(y)})`}>
      <circle r={r} fill={c} />
      <path d={`M${-r * 0.7} ${-r * 0.1}A${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.7} ${-r * 0.1}`} stroke="#fff" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
      <path d={`M${-r * 0.45} ${r * 0.2}A${r * 0.45} ${r * 0.45} 0 0 1 ${r * 0.45} ${r * 0.2}`} stroke="#fff" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      <circle r={r * 0.25} fill={FOLK.ink} cy={r * 0.25} />
      {[-1, 0, 1].map((k) => <circle key={k} cx={k * r * 0.25} cy={r * 0.55} r={r * 0.07} fill="#fff" />)}
    </g>
  );
}

/** A folk border band of rosettes, leaves and berries — tiles horizontally. */
export function FolkBand({ className, style, n = 6, seed = 2 }: { className?: string; style?: CSSProperties; n?: number; seed?: number }) {
  const R = rng(seed);
  const W = n * 160;
  return (
    <svg viewBox={`0 0 ${W} 120`} className={className} style={style} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width={W} height="120" fill={FOLK.ink} />
      <path d={`M0 10H${W}M0 110H${W}`} stroke={FOLK.gold} strokeWidth="3" />
      {Array.from({ length: n }, (_, i) => {
        const x = i * 160 + 80;
        return (
          <g key={i}>
            <path d={`M${x - 80} 60Q${x - 40} ${30 + R() * 10} ${x} 60T${x + 80} 60`} stroke={FOLK.gold} strokeWidth="2.4" fill="none" />
            {[-1, 1].map((s) => <path key={s} d={leaf(34, 11)} transform={`translate(${x + s * 40} 58) rotate(${s * 60 + 180})`} fill={FOLK.green} stroke="#fff" strokeWidth="1.2" />)}
            {[-1, 1].map((s) => <circle key={"b" + s} cx={x + s * 62} cy={44 + R() * 8} r="7" fill={FOLK.gold} stroke={FOLK.deep} />)}
            {rosette(x, 60, 26, i % 2 ? FOLK.blue : FOLK.red, "r" + i)}
          </g>
        );
      })}
    </svg>
  );
}

/** Ribbons streaming down from the top edge (a Maslenitsa pole's lenty). */
export function Ribbons({ className, style, n = 9, seed = 5 }: { className?: string; style?: CSSProperties; n?: number; seed?: number }) {
  const R = rng(seed);
  const cols = [FOLK.red, FOLK.gold, FOLK.green, FOLK.blue, "#E8628A"];
  return (
    <svg viewBox="0 0 1000 400" className={className} style={style} aria-hidden preserveAspectRatio="none">
      {Array.from({ length: n }, (_, i) => {
        const x = (i + 0.5) * (1000 / n) + (R() - 0.5) * 30;
        const L = 160 + R() * 200;
        const w = 14 + R() * 8;
        const sway = 30 + R() * 30;
        const d = `M${r2(x)} 0C${r2(x + sway)} ${r2(L * 0.3)} ${r2(x - sway)} ${r2(L * 0.6)} ${r2(x + sway * 0.4)} ${r2(L)}L${r2(x + sway * 0.4 + w)} ${r2(L - 10)}C${r2(x - sway + w)} ${r2(L * 0.6)} ${r2(x + sway + w)} ${r2(L * 0.3)} ${r2(x + w)} 0Z`;
        return <path key={i} className="ms-rib" d={d} fill={cols[i % cols.length]} style={{ animationDelay: `${-R() * 4}s`, transformOrigin: `${x}px 0px` }} />;
      })}
    </svg>
  );
}

/** Khokhloma berry sprig divider. */
export function Berries({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 260 70" className={className} style={style} aria-hidden>
      <path d="M10 40Q70 10 130 36T250 34" stroke={FOLK.ink} strokeWidth="2.4" fill="none" />
      {[[50, 26, 1], [96, 40, -1], [164, 30, 1], [210, 42, -1]].map(([x, y, s], i) => <path key={i} d={leaf(26, 9)} transform={`translate(${x} ${y}) rotate(${(s as number) * 50})`} fill={FOLK.green} />)}
      {[[124, 30], [136, 40], [130, 22], [72, 30], [188, 38]].map(([x, y], i) => <circle key={"b" + i} cx={x} cy={y} r="7" fill={FOLK.red} stroke={FOLK.deep} />)}
      {[[124, 30], [136, 40], [130, 22], [72, 30], [188, 38]].map(([x, y], i) => <circle key={"h" + i} cx={x - 2} cy={y - 2} r="2" fill="#fff" />)}
    </svg>
  );
}
