// Falling rose petals — pure CSS, deterministic (no hydration mismatch), pointer-transparent.
const rand = (i: number, s: number) => {
  // Integer hash (no Math.sin) so server and browser produce identical values — no hydration mismatch.
  let h = (i * 374761393 + s * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return Math.round((((h ^ (h >>> 16)) >>> 0) / 4294967296) * 1000) / 1000;
};

export function Petals({ count = 18, colors = ["#f2c6c8", "#e8a3ab", "#f6dcd2", "#d98c96"], className = "fixed" }: { count?: number; colors?: string[]; className?: string }) {
  return (
    <div aria-hidden className={`${className} pointer-events-none inset-0 z-0 overflow-hidden`}>
      {Array.from({ length: count }, (_, i) => {
        const size = 10 + rand(i, 1) * 16;
        const style = {
          left: `${rand(i, 2) * 100}%`,
          width: size,
          height: size * 0.8,
          animation: `petal-fall ${14 + rand(i, 3) * 16}s linear ${-rand(i, 4) * 30}s infinite, petal-sway ${4 + rand(i, 5) * 4}s ease-in-out infinite`,
          "--x": `${(rand(i, 6) - 0.5) * 240}px`,
          "--r": `${360 + rand(i, 7) * 540}deg`,
          "--sway": `${20 + rand(i, 8) * 50}px`,
          "--o": 0.45 + rand(i, 9) * 0.45,
        } as React.CSSProperties;
        return (
          <span key={i} className="absolute top-0" style={style}>
            <svg viewBox="0 0 20 16" width="100%" height="100%">
              <path d="M10 15C3 12 0 7 2 3c2-3 6-3 8 0 2-3 6-3 8 0 2 4-1 9-8 12Z" fill={colors[i % colors.length]} />
              <path d="M10 14C9 9 9 6 10 3" stroke="#fff" strokeOpacity=".35" strokeWidth=".6" fill="none" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
