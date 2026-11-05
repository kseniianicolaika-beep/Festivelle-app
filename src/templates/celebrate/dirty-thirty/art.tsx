import { useId } from "react";

// Thirty, Flirty — a mirror-tiled disco ball, wall light-flecks and neon numerals.

const TILE = ["#ffffff", "#efe9ff", "#cfc2f7", "#9d8be0", "#6a58b0", "#ffc3e3", "#ff8cc6", "#3a2c6e", "#fff2c7"];
// deterministic pseudo-random so SSR and client agree
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function DiscoBall({ className = "", style, string = true, twinkle = true }: { className?: string; style?: React.CSSProperties; string?: boolean; twinkle?: boolean }) {
  const gid = useId().replace(/:/g, "");
  const tiles: React.ReactNode[] = [];
  let k = 0;
  for (let lat = -84; lat < 84; lat += 12) {
    const a0 = (lat * Math.PI) / 180, a1 = ((lat + 12) * Math.PI) / 180;
    const y0 = 60 + 50 * Math.sin(a0), y1 = 60 + 50 * Math.sin(a1);
    const r = 50 * Math.cos((a0 + a1) / 2);
    const n = Math.max(4, Math.round(r / 3.2));
    for (let j = 0; j < n; j++) {
      // map tile across the visible hemisphere with cosine squash so edges compress
      const t0 = -1 + (2 * j) / n, t1 = -1 + (2 * (j + 1)) / n;
      const x0 = 60 + r * Math.sin((t0 * Math.PI) / 2), x1 = 60 + r * Math.sin((t1 * Math.PI) / 2);
      const centre = 1 - Math.abs((t0 + t1) / 2);
      const v = rnd(++k);
      const light = (lat < 0 ? 0.25 : 0) + centre * 0.4 + v * 0.45;
      const fill = TILE[Math.min(TILE.length - 1, Math.floor((1 - light) * 6.5 + (v > 0.86 ? 5 : 0)) % TILE.length)];
      tiles.push(
        <rect key={k} x={x0 + 0.35} y={y0 + 0.35} width={Math.max(0.3, x1 - x0 - 0.7)} height={Math.max(0.3, y1 - y0 - 0.7)} rx=".5" fill={fill} className={twinkle && v > 0.9 ? "dt-tw" : undefined} style={twinkle && v > 0.9 ? { animationDelay: `${(v * 40) % 3}s` } : undefined} />,
      );
    }
  }
  return (
    <svg viewBox={string ? "0 -60 120 180" : "0 0 120 120"} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <clipPath id={`c${gid}`}><circle cx="60" cy="60" r="50" /></clipPath>
        <radialGradient id={`h${gid}`} cx=".36" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".8" stopColor="#1a0f33" stopOpacity=".35" />
          <stop offset="1" stopColor="#0c0620" stopOpacity=".75" />
        </radialGradient>
        <radialGradient id={`g${gid}`}><stop offset="0" stopColor="#ff7ac0" stopOpacity=".55" /><stop offset="1" stopColor="#ff7ac0" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="84" fill={`url(#g${gid})`} />
      {string && <path d="M60 -60V10" stroke="#e9e3ff" strokeOpacity=".7" strokeWidth=".8" />}
      <circle cx="60" cy="60" r="50" fill="#2a1f52" />
      <g clipPath={`url(#c${gid})`}>{tiles}</g>
      <circle cx="60" cy="60" r="50" fill={`url(#h${gid})`} />
      <rect x="55" y="7" width="10" height="6" rx="1.5" fill="#d9d2f2" />
      {/* the wink: a four-point glint */}
      <path className={twinkle ? "dt-wink" : undefined} d="M40 30l1.6 6.4L48 38l-6.4 1.6L40 46l-1.6-6.4L32 38l6.4-1.6z" fill="#fff" style={{ transformOrigin: "40px 38px", transformBox: "view-box" }} />
    </svg>
  );
}

/** Wall flecks of light thrown by the ball. */
export function Flecks({ count = 46, spin = true, size = "220vmax" }: { count?: number; spin?: boolean; size?: string }) {
  const cols = ["#ffffff", "#ffc3e3", "#cfc2f7", "#fff2c7", "#9ee7ff"];
  return (
    <div aria-hidden className={`pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2 ${spin ? "dt-spin" : ""}`} style={{ width: size, height: size }}>
      {Array.from({ length: count }, (_, i) => {
        const a = rnd(i + 3) * Math.PI * 2, d = 6 + rnd(i + 99) * 44, s = 4 + rnd(i + 7) * 10;
        return <span key={i} className="absolute rounded-full" style={{ left: `${50 + Math.cos(a) * d}%`, top: `${50 + Math.sin(a) * d}%`, width: s, height: s * (0.6 + rnd(i) * 0.6), background: cols[i % cols.length], opacity: 0.35 + rnd(i + 5) * 0.5, filter: "blur(1px)", boxShadow: `0 0 ${s * 1.5}px ${cols[i % cols.length]}` }} />;
      })}
    </div>
  );
}

export function Sparkle({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden><path d="M10 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="currentColor" /></svg>;
}

export const DT_CSS = `
.dt-chrome{background:linear-gradient(180deg,#ffffff 0%,#f3e9ff 30%,#b9a6f0 48%,#ffffff 52%,#ffd1ea 75%,#ff7ac0 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.dt-neon{color:#ff5fae;text-shadow:0 0 .04em #fff,0 0 .12em #ff5fae,0 0 .3em #ff2f93,0 0 .6em rgba(255,47,147,.5)}
.dt-neon-flicker{animation:dtFlick 6s infinite}
@keyframes dtFlick{0%,18%,22%,62%,64%,100%{opacity:1}20%,63%{opacity:.55}}
.dt-spin{animation:dtSpin 60s linear infinite}
@keyframes dtSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
.dt-tw{animation:dtTw 2.6s ease-in-out infinite}
@keyframes dtTw{0%,100%{fill:#fff}50%{fill:#ff8cc6}}
.dt-wink{animation:dtWink 4s ease-in-out infinite}
@keyframes dtWink{0%,70%,100%{transform:scale(0) rotate(0)}80%{transform:scale(1.2) rotate(45deg)}90%{transform:scale(.6) rotate(90deg)}}
.dt-sway{animation:dtSway 5s ease-in-out infinite;transform-origin:50% 0}
@keyframes dtSway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
.dt-marquee{display:flex;width:max-content;animation:dtMarq 28s linear infinite}
@keyframes dtMarq{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion: reduce){.dt-spin,.dt-tw,.dt-wink,.dt-sway,.dt-marquee,.dt-neon-flicker{animation:none!important}}
`;
