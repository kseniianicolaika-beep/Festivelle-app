import type { Theme } from "@/lib/themes";

// Hand-tuned line ornaments — restrained, never clip-art.
export function Motif({ theme, className = "" }: { theme: Theme; className?: string }) {
  const s = { stroke: theme.gold, fill: "none", strokeWidth: 1.1, strokeLinecap: "round" as const };
  switch (theme.motif) {
    case "palms":
      return (
        <svg viewBox="0 0 200 60" className={className} aria-hidden>
          <path {...s} d="M20 52h160" />
          <circle {...s} cx="100" cy="40" r="12" />
          <path {...s} d="M70 52c4-10 4-22 0-34M70 18c-10-2-18 2-22 8M70 18c8-6 18-6 24 0M70 18c-4-8-12-10-18-8M70 18c6-7 14-9 20-6" />
          <path {...s} d="M132 52c-3-8-3-18 0-27M132 25c8-2 15 1 18 6M132 25c-7-5-15-5-20 0M132 25c3-6 10-8 15-6" />
          <path {...s} d="M40 46c8-3 16-3 24 0M136 46c8-3 16-3 24 0" opacity=".6" />
        </svg>
      );
    case "azulejo":
      return (
        <svg viewBox="0 0 200 60" className={className} aria-hidden>
          {[60, 100, 140].map((x) => (
            <g key={x} transform={`translate(${x} 30)`}>
              <rect {...s} x="-16" y="-16" width="32" height="32" stroke={theme.accent} />
              <path {...s} stroke={theme.accent} d="M0-12C6-6 6 6 0 12C-6 6-6-6 0-12M-12 0C-6-6 6-6 12 0C6 6-6 6-12 0" />
              <circle cx="0" cy="0" r="2" fill={theme.gold} />
            </g>
          ))}
        </svg>
      );
    case "arch":
      return (
        <svg viewBox="0 0 200 60" className={className} aria-hidden>
          <path {...s} d="M70 58V30c0-16 30-26 30-26s30 10 30 26v28" />
          <path {...s} d="M80 58V33c0-11 20-19 20-19s20 8 20 19v25" opacity=".7" />
          <circle {...s} cx="100" cy="36" r="5" />
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((i) => <circle key={i} cx={100 + i * 20 + (i > 0 ? 10 : -10)} cy="50" r="2.2" fill={theme.accent} />)}
        </svg>
      );
    case "birch":
      return (
        <svg viewBox="0 0 200 60" className={className} aria-hidden>
          {[70, 84, 116, 130].map((x, i) => (
            <g key={x}>
              <path {...s} d={`M${x} 58V${8 + i * 4}`} />
              <path {...s} d={`M${x - 3} ${24 + i * 3}h4M${x} ${38 - i}h4M${x - 4} ${48}h3`} />
            </g>
          ))}
          <path {...s} d="M100 18l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 60" className={className} aria-hidden>
          <path {...s} d="M40 30h45M115 30h45" />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} {...s} cx="100" cy="22" rx="4" ry="8" transform={`rotate(${r} 100 30)`} />
          ))}
          <circle cx="100" cy="30" r="2" fill={theme.gold} />
        </svg>
      );
  }
}
