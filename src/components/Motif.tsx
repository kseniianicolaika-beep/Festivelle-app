import type { Theme } from "@/lib/themes";
import type { MotifId } from "@/lib/motifs";

// Curated, hand-tuned line ornaments — restrained, never clip-art. viewBox 200×60 for every motif.
export function Motif({ theme, motif, className = "" }: { theme: Theme; motif?: MotifId; className?: string }) {
  const g = theme.gold;
  const a = theme.accent;
  const s = { stroke: g, fill: "none", strokeWidth: 1.1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const svg = (children: React.ReactNode) => (
    <svg viewBox="0 0 200 60" className={className} aria-hidden>
      {children}
    </svg>
  );
  switch (motif ?? theme.motif) {
    case "palms":
      return svg(
        <>
          <path {...s} d="M20 52h160" />
          <circle {...s} cx="100" cy="40" r="12" />
          <path {...s} d="M70 52c4-10 4-22 0-34M70 18c-10-2-18 2-22 8M70 18c8-6 18-6 24 0M70 18c-4-8-12-10-18-8M70 18c6-7 14-9 20-6" />
          <path {...s} d="M132 52c-3-8-3-18 0-27M132 25c8-2 15 1 18 6M132 25c-7-5-15-5-20 0M132 25c3-6 10-8 15-6" />
          <path {...s} d="M40 46c8-3 16-3 24 0M136 46c8-3 16-3 24 0" opacity=".6" />
        </>,
      );
    case "azulejo":
      return svg(
        [60, 100, 140].map((x) => (
          <g key={x} transform={`translate(${x} 30)`}>
            <rect {...s} x="-16" y="-16" width="32" height="32" stroke={a} />
            <path {...s} stroke={a} d="M0-12C6-6 6 6 0 12C-6 6-6-6 0-12M-12 0C-6-6 6-6 12 0C6 6-6 6-12 0" />
            <circle cx="0" cy="0" r="2" fill={g} />
          </g>
        )),
      );
    case "arch":
      return svg(
        <>
          <path {...s} d="M70 58V30c0-16 30-26 30-26s30 10 30 26v28" />
          <path {...s} d="M80 58V33c0-11 20-19 20-19s20 8 20 19v25" opacity=".7" />
          <circle {...s} cx="100" cy="36" r="5" />
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((i) => <circle key={i} cx={100 + i * 20 + (i > 0 ? 10 : -10)} cy="50" r="2.2" fill={a} />)}
        </>,
      );
    case "birch":
      return svg(
        <>
          {[70, 84, 116, 130].map((x, i) => (
            <g key={x}>
              <path {...s} d={`M${x} 58V${8 + i * 4}`} />
              <path {...s} d={`M${x - 3} ${24 + i * 3}h4M${x} ${38 - i}h4M${x - 4} 48h3`} />
            </g>
          ))}
          <path {...s} d="M100 18l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" />
        </>,
      );
    case "marigold":
      return svg(
        <>
          <path {...s} d="M10 8c30 30 60 40 90 40s60-10 90-40" />
          {Array.from({ length: 9 }, (_, i) => {
            const t = (i + 0.5) / 9;
            const x = 10 + t * 180;
            const y = 8 + Math.sin(t * Math.PI) * 38;
            return (
              <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <circle r="5.5" fill={i % 2 ? a : g} opacity=".85" />
                <circle r="2.4" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth=".8" />
              </g>
            );
          })}
        </>,
      );
    case "lattice":
      return svg(
        <>
          {[40, 70, 100, 130, 160].map((x) => (
            <g key={x} transform={`translate(${x} 30)`}>
              <path {...s} d="M0-18 13 0 0 18-13 0Z" />
              <path {...s} d="M0-9 6.5 0 0 9-6.5 0Z" opacity=".7" />
            </g>
          ))}
          <path {...s} d="M100 2a8 8 0 1 0 6 13 6.5 6.5 0 1 1-6-13Z" fill={g} stroke="none" />
        </>,
      );
    case "stars":
      return svg(
        <>
          {[
            [100, 26, 9], [62, 32, 5], [138, 32, 5], [36, 22, 3], [164, 22, 3], [82, 14, 2.5], [118, 14, 2.5],
          ].map(([x, y, r], i) => (
            <path key={i} d={`M${x} ${y - r}L${x + r * 0.28} ${y - r * 0.28} ${x + r} ${y} ${x + r * 0.28} ${y + r * 0.28} ${x} ${y + r} ${x - r * 0.28} ${y + r * 0.28} ${x - r} ${y} ${x - r * 0.28} ${y - r * 0.28}Z`} fill={g} />
          ))}
          <path {...s} d="M30 48h55M115 48h55" />
          <path {...s} d="M92 48a8 8 0 0 0 16 0" />
        </>,
      );
    case "paisley":
      return svg(
        [-1, 1].map((d) => (
          <g key={d} transform={`translate(${100 + d * 30} 30) scale(${d} 1)`}>
            <path {...s} d="M0 20C-18 20-22 0-10-12 0-22 18-18 18-4 18 6 8 10 2 6" />
            <path {...s} d="M0 12C-9 12-12 2-6-6 0-12 9-9 9-2" opacity=".7" />
            <circle cx="2" cy="6" r="1.8" fill={a} />
            <path {...s} d="M18 -4c8 -4 18 -2 24 4" opacity=".6" />
          </g>
        )),
      );
    case "lotus":
      return svg(
        <>
          <path {...s} d="M100 50C92 38 92 22 100 10c8 12 8 28 0 40Z" />
          <path {...s} d="M100 50C86 44 78 30 80 18c12 6 20 18 20 32ZM100 50c14-6 22-20 20-32-12 6-20 18-20 32Z" />
          <path {...s} d="M100 50C80 50 66 40 62 30c14 0 28 8 38 20ZM100 50c20 0 34-10 38-20-14 0-28 8-38 20Z" opacity=".75" />
          <path {...s} d="M50 54h100" />
          <circle cx="100" cy="56" r="1.6" fill={a} />
        </>,
      );
    case "rings":
      return svg(
        <>
          <circle {...s} cx="90" cy="34" r="14" strokeWidth="1.4" />
          <circle {...s} cx="110" cy="34" r="14" strokeWidth="1.4" />
          <path d="M110 16l3 4-3 3-3-3Z" fill={a} />
          <path {...s} d="M30 34h40M130 34h40" opacity=".7" />
        </>,
      );
    case "doves":
      return svg(
        <>
          {[-1, 1].map((d) => (
            <g key={d} transform={`translate(${100 + d * 22} 28) scale(${-d} 1)`}>
              <path {...s} d="M-14 4C-6 -2 4 -2 10 4L16 0 14 8C8 14-6 14-14 4Z" />
              <path {...s} d="M-2 2C2-8 10-12 18-10 12-6 8-2 6 4" />
              <circle cx="10" cy="5" r="0.9" fill={g} />
            </g>
          ))}
          <path {...s} d="M60 52c20-6 60-6 80 0" />
          {[72, 86, 114, 128].map((x) => <ellipse key={x} {...s} cx={x} cy="48" rx="4" ry="2" transform={`rotate(-20 ${x} 48)`} />)}
        </>,
      );
    case "khokhloma":
      return svg(
        <>
          <path {...s} d="M30 40c20-20 50-20 70 0s50 20 70 0" />
          {[[60, 28], [100, 40], [140, 28]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y - 8} r="5" fill={a} />
              <circle cx={x + 7} cy={y - 4} r="4" fill={a} opacity=".8" />
              <path {...s} d={`M${x - 10} ${y + 2}c4-8 10-10 16-8M${x + 12} ${y + 2}c-2-6-6-8-10-8`} />
            </g>
          ))}
        </>,
      );
    case "mandala":
      return svg(
        <g transform="translate(100 30)">
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} {...s} rx="4" ry="13" cy="-12" transform={`rotate(${i * 30})`} />
          ))}
          <circle {...s} r="6" />
          <circle r="2" fill={a} />
          <path {...s} d="M-90 0h60M30 0h60" opacity=".6" />
        </g>,
      );
    case "balloons":
      return svg(
        <>
          {[[78, 20, 9, a], [100, 14, 11, g], [122, 22, 9, a]].map(([x, y, r, c], i) => (
            <g key={i}>
              <ellipse {...s} stroke={c as string} cx={x as number} cy={y as number} rx={(r as number) * 0.86} ry={r as number} />
              <path {...s} stroke={c as string} d={`M${x} ${(y as number) + (r as number)}l-1.5 2.5h3z`} />
              <path {...s} d={`M${x} ${(y as number) + (r as number) + 2.5}c-3 6 3 10 0 16s${100 - (x as number) > 0 ? 3 : -3} 8 ${(100 - (x as number)) * 0.4} 14`} opacity=".7" />
              <path {...s} stroke="#fff" d={`M${(x as number) - (r as number) * 0.4} ${(y as number) - (r as number) * 0.4}q2-3 5-3`} opacity=".8" />
            </g>
          ))}
          <path {...s} d="M30 52h40M130 52h40" opacity=".6" />
        </>,
      );
    case "cake":
      return svg(
        <>
          <path {...s} d="M72 56h56M78 56V42h44v14M84 42V32h32v10M90 32V24h20v8" />
          <path {...s} stroke={a} d="M78 47c4 3 7 3 11 0s7-3 11 0 7 3 11 0 7-3 11 0M84 36c3 2.5 6 2.5 8 0s5-2.5 8 0 5 2.5 8 0 5-2.5 8 0" />
          <path {...s} d="M100 24v-8" />
          <path fill={a} d="M100 6c3 4 3 7 0 9-3-2-3-5 0-9z" opacity=".85" />
          <path {...s} d="M30 50h34M136 50h34" opacity=".55" />
        </>,
      );
    case "moon":
      return svg(
        <>
          <path {...s} d="M108 6a18 18 0 1 0 10 32a14 14 0 1 1-10-32z" stroke={a} />
          <path {...s} d="M50 46c0-6 8-8 12-4c2-7 14-7 15 1c6-1 9 7 3 9H52c-3 0-4-3-2-6zM128 50c0-5 6-7 10-4c2-5 11-5 12 1c5 0 7 5 2 7h-22c-2 0-3-2-2-4z" />
          {[[70, 14], [140, 18], [152, 8], [60, 26]].map(([x, y], i) => (
            <path key={i} {...s} d={`M${x} ${y - 3}v6M${x - 3} ${y}h6`} opacity=".8" />
          ))}
        </>,
      );
    case "champagne":
      return svg(
        <>
          <g transform="rotate(-12 86 30)">
            <path {...s} d="M72 14h28c0 10-6 16-14 16s-14-6-14-16zM86 30v18M78 50h16" />
            <path {...s} stroke={a} d="M74 18h24" opacity=".7" />
          </g>
          <g transform="rotate(12 114 30)">
            <path {...s} d="M100 14h28c0 10-6 16-14 16s-14-6-14-16zM114 30v18M106 50h16" />
            <path {...s} stroke={a} d="M102 18h24" opacity=".7" />
          </g>
          {[[100, 6, 1.6], [94, 2, 1], [106, 3, 1.2], [100, -1, 0.8]].map(([x, y, r], i) => <circle key={i} {...s} cx={x} cy={y + 4} r={r} />)}
          <path {...s} d="M28 40h36M136 40h36" opacity=".55" />
        </>,
      );
    case "ribbon":
      return svg(
        <>
          <path {...s} d="M100 30c-10-14-30-16-30-6s20 8 30 6zM100 30c10-14 30-16 30-6s-20 8-30 6z" stroke={a} />
          <path {...s} d="M100 30c-6 8-12 18-20 26M100 30c6 8 12 18 20 26" stroke={a} />
          <circle {...s} cx="100" cy="30" r="3.5" />
          <path {...s} d="M20 30c20-6 30 6 46 0M134 30c16 6 26-6 46 0" opacity=".6" />
        </>,
      );
    case "rattle":
      return svg(
        <>
          <circle {...s} cx="92" cy="22" r="12" stroke={a} />
          <path {...s} d="M84 16c4-3 12-3 16 0M82 25c6 3 14 3 20 0" opacity=".7" />
          <path {...s} d="M100 31l14 16" />
          <circle {...s} cx="117" cy="50" r="4" />
          {[[60, 18], [140, 14], [132, 40], [66, 44]].map(([x, y], i) => (
            <path key={i} {...s} d={`M${x} ${y - 4}l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z`} />
          ))}
        </>,
      );
    case "confetti":
      return svg(
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const x = 30 + ((i * 47) % 140);
            const y = 8 + ((i * 29) % 44);
            const c = i % 3 === 0 ? a : g;
            return i % 2 ? <path key={i} {...s} stroke={c} d={`M${x} ${y}q3-4 6 0t6 0`} /> : <rect key={i} x={x} y={y} width="4" height="2" rx="1" fill={c} transform={`rotate(${i * 37} ${x} ${y})`} />;
          })}
          <path {...s} d="M60 56L82 34M140 56L118 34" opacity=".5" />
        </>,
      );
    default:
      return svg(
        <>
          <path {...s} d="M40 30h45M115 30h45" />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} {...s} cx="100" cy="22" rx="4" ry="8" transform={`rotate(${r} 100 30)`} />
          ))}
          <circle cx="100" cy="30" r="2" fill={g} />
        </>,
      );
  }
}
