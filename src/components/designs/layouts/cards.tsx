import type { ReactNode } from "react";
import type { Theme } from "@/lib/themes";

// Nine structurally distinct card layouts (the six originals live in Paper.tsx).
// Every layout receives pre-built, editor-aware pieces (body/footer contain <E> wrappers).
export type CardCtx = {
  body: ReactNode;
  footer: ReactNode;
  motif: (className: string, key?: string) => ReactNode;
  photoUrl?: string | null;
  a: string;
  b: string;
  age?: number;
  theme: Theme;
  draw: string;
};

const Photo = ({ url, className = "", fallback }: { url?: string | null; className?: string; fallback: ReactNode }) =>
  url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-edit-photo="photo" src={url} alt="" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div data-edit-photo="photo" className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_55%,color-mix(in_oklab,var(--t-accent)_24%,var(--t-surface)),var(--t-surface))] ${className}`}>{fallback}</div>
  );

// Deterministic pseudo-random so server and client render identically.
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 12.9898 * s + 78.233) * 43758.5453; return x - Math.floor(x); };

function Deco({ body, footer, motif, draw }: CardCtx) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 opacity-[.13]" style={{ background: "repeating-conic-gradient(from 180deg at 50% 0%, var(--t-gold) 0deg 2deg, transparent 2deg 9deg)" }} />
      <div className="absolute inset-[3.2cqw] border-[0.6cqw] border-double border-[var(--t-gold)]" style={{ clipPath: "polygon(6cqw 0,calc(100% - 6cqw) 0,100% 6cqw,100% calc(100% - 6cqw),calc(100% - 6cqw) 100%,6cqw 100%,0 calc(100% - 6cqw),0 6cqw)" }} />
      <svg viewBox="0 0 100 20" className={`absolute inset-x-[8cqw] bottom-[5cqw] ${draw}`} aria-hidden>
        {[0, 1, 2].map((i) => <path key={i} d={`M10 ${18 - i * 4}L50 ${8 - i * 3}L90 ${18 - i * 4}`} fill="none" stroke="var(--t-gold)" strokeWidth=".4" />)}
      </svg>
      <div className="relative flex h-full flex-col items-center justify-between px-[11cqw] pb-[14cqw] pt-[9cqw]">
        {motif(`${draw} w-[44cqw]`)}
        <div className="uppercase [&_.display]:tracking-[.08em]">{body}</div>
        {footer}
      </div>
    </div>
  );
}

// Mughal jharokha: cusped (multi-foil) arch with jaali in the spandrels and two chhatri domes.
function Jharokha({ body, footer, motif, draw }: CardCtx) {
  const cusps = "M10 140 V60 C10 52 14 50 18 48 C16 40 22 34 28 34 C28 26 36 20 42 22 C44 14 50 10 50 10 C50 10 56 14 58 22 C64 20 72 26 72 34 C78 34 84 40 82 48 C86 50 90 52 90 60 V140";
  return (
    <div className="relative h-full">
      <svg viewBox="0 0 100 140" preserveAspectRatio="none" className={`absolute inset-[4cqw] h-[calc(100%-8cqw)] w-[calc(100%-8cqw)] ${draw}`} aria-hidden>
        <defs>
          <pattern id="jaali" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M3 0L6 3L3 6L0 3Z" fill="none" stroke="var(--t-gold)" strokeWidth=".25" /><circle cx="3" cy="3" r=".5" fill="var(--t-gold)" /></pattern>
        </defs>
        <path d="M0 0H100V60H90C90 52 86 50 82 48C84 40 78 34 72 34C72 26 64 20 58 22C56 14 50 10 50 10C50 10 44 14 42 22C36 20 28 26 28 34C22 34 16 40 18 48C14 50 10 52 10 60H0Z" fill="url(#jaali)" opacity=".55" />
        <path d={cusps} fill="none" stroke="var(--t-gold)" strokeWidth=".7" />
        <path d={cusps} fill="none" stroke="var(--t-gold)" strokeWidth=".3" transform="translate(50 75) scale(.92) translate(-50 -75)" />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-between px-[15cqw] pb-[10cqw] pt-[30cqw]">
        {motif(`${draw} -mt-[6cqw] w-[30cqw]`)}
        {body}
        {footer}
      </div>
    </div>
  );
}

function Lace({ body, footer, motif, draw }: CardCtx) {
  return (
    <div className="relative h-full bg-[color-mix(in_oklab,var(--t-gold)_16%,var(--t-surface))]">
      <div className="lace-edge absolute inset-[3cqw] bg-[var(--t-surface)]">
        <div className="absolute inset-[3.5cqw] rounded-[2cqw] border border-dotted border-[var(--t-gold)]" />
        <svg viewBox="0 0 100 100" className="absolute left-1/2 top-[6cqw] w-[56cqw] -translate-x-1/2 opacity-60" aria-hidden>
          {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(50 + 40 * Math.cos((i / 24) * 2 * Math.PI)).toFixed(2)} cy={(50 + 40 * Math.sin((i / 24) * 2 * Math.PI)).toFixed(2)} r="6" fill="none" stroke="var(--t-gold)" strokeWidth=".4" />)}
          {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="50" cy="24" rx="3" ry="9" fill="none" stroke="var(--t-gold)" strokeWidth=".35" transform={`rotate(${i * 30} 50 50)`} />)}
        </svg>
      </div>
      <div className="relative flex h-full flex-col items-center justify-between px-[12cqw] pb-[12cqw] pt-[14cqw]">
        {motif(`${draw} w-[30cqw]`)}
        {body}
        {footer}
      </div>
    </div>
  );
}

function Polaroid({ body, footer, motif, photoUrl, draw }: CardCtx) {
  const tape = "absolute h-[4cqw] w-[16cqw] bg-[color-mix(in_oklab,var(--t-accent)_35%,white)] opacity-70 shadow-sm";
  return (
    <div className="paper-tex relative flex h-full flex-col items-center px-[8cqw] pb-[7cqw] pt-[8cqw]">
      <div className="relative mb-[5cqw] h-[46%] w-full">
        <div className="absolute left-[2cqw] top-[4cqw] h-[78%] w-[52%] -rotate-[7deg] bg-white p-[2.4cqw] pb-[9cqw] shadow-[0_2cqw_5cqw_-2cqw_rgba(0,0,0,.35)]">
          <div className="flex h-full items-center overflow-hidden bg-[var(--t-surface)]">{motif(`${draw} w-full`, "p1")}</div>
          <span className={`${tape} -top-[2cqw] left-[10cqw] rotate-[4deg]`} />
        </div>
        <div className="absolute right-[1cqw] top-0 h-[92%] w-[58%] rotate-[5deg] bg-white p-[2.4cqw] pb-[10cqw] shadow-[0_2cqw_6cqw_-2cqw_rgba(0,0,0,.4)]">
          <div className="h-full overflow-hidden"><Photo url={photoUrl} fallback={motif("w-[80%]", "p2")} /></div>
          <span className={`${tape} -top-[2cqw] right-[8cqw] -rotate-[6deg]`} />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-between">{body}{footer}</div>
    </div>
  );
}

function Confetti({ body, footer, age, theme, a }: CardCtx) {
  const colors = [theme.accent, theme.gold, ...theme.petals];
  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden px-[9cqw] py-[10cqw]">
      {Array.from({ length: 34 }, (_, i) => {
        const x = rnd(i) * 100, y = rnd(i, 2) * 100, r = rnd(i, 3) * 360, k = i % 4, size = 1.2 + rnd(i, 4) * 2.4;
        const c = colors[i % colors.length];
        return (
          <span key={i} aria-hidden className="pop absolute" style={{ left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`, width: `${size.toFixed(2)}cqw`, height: k === 1 ? `${(size * 0.4).toFixed(2)}cqw` : `${size.toFixed(2)}cqw`, background: k === 3 ? "transparent" : c, border: k === 3 ? `0.4cqw solid ${c}` : undefined, borderRadius: k === 0 || k === 3 ? "50%" : "2px", transform: `rotate(${r.toFixed(0)}deg)`, animationDelay: `${(i % 10) * 0.06}s`, opacity: y > 28 && y < 78 && x > 12 && x < 88 ? 0.22 : 0.9 }} />
        );
      })}
      <p className="display foil pop relative leading-none" style={{ fontSize: age ? "34cqw" : "24cqw" }} aria-hidden>{age ?? a[0]}</p>
      <div className="relative">{body}</div>
      <div className="relative">{footer}</div>
    </div>
  );
}

function Watercolour({ body, footer, motif, theme, draw }: CardCtx) {
  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden px-[10cqw] py-[11cqw]">
      <span aria-hidden className="wash absolute -left-[12cqw] -top-[10cqw] h-[55cqw] w-[60cqw]" style={{ background: theme.petals[0] }} />
      <span aria-hidden className="wash absolute -right-[16cqw] top-[18cqw] h-[40cqw] w-[48cqw]" style={{ background: theme.accent, opacity: 0.25 }} />
      <span aria-hidden className="wash absolute -bottom-[14cqw] -left-[6cqw] h-[46cqw] w-[70cqw]" style={{ background: theme.petals[2] ?? theme.gold }} />
      <span aria-hidden className="wash absolute -bottom-[10cqw] -right-[10cqw] h-[34cqw] w-[40cqw]" style={{ background: theme.gold, opacity: 0.3 }} />
      <div className="relative">{motif(`${draw} w-[46cqw]`)}</div>
      <div className="relative">{body}</div>
      <div className="relative">{footer}</div>
    </div>
  );
}

function Split({ body, footer, motif, photoUrl, draw }: CardCtx) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-[46%] overflow-hidden" style={{ clipPath: "polygon(0 0,100% 0,100% 82%,0 100%)" }}>
        <Photo url={photoUrl} fallback={motif(`${draw} w-[60cqw]`)} />
      </div>
      <div className="relative flex flex-1 flex-col justify-between px-[9cqw] pb-[8cqw] pt-[3cqw] [&>div]:items-start [&>div]:text-left [&_.justify-center]:justify-start">
        {body}
        {footer}
      </div>
    </div>
  );
}

function FullBleed({ body, footer, motif, photoUrl, draw }: CardCtx) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0"><Photo url={photoUrl} className="[animation:kenburns_24s_ease-in-out_infinite_alternate]" fallback={motif(`${draw} w-[80cqw] opacity-60`)} /></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="relative flex h-full flex-col justify-end gap-[4cqw] px-[8cqw] pb-[9cqw] text-white [--t-ink:#fff] [--t-muted:rgba(255,255,255,.85)] [--t-gold:rgba(255,255,255,.75)]">
        {body}
        {footer}
      </div>
    </div>
  );
}

function Letterpress({ body, footer, a, b, age }: CardCtx) {
  return (
    <div className="paper-tex relative flex h-full flex-col items-center justify-between px-[11cqw] py-[12cqw]">
      <p className="display deboss select-none leading-none" style={{ fontSize: "30cqw" }} aria-hidden>{a[0]}{b ? <span className="script mx-[1cqw]" style={{ fontSize: "16cqw" }}>&amp;</span> : null}{b ? b[0] : age ?? ""}</p>
      <span className="h-px w-[18cqw] bg-[var(--t-ink)] opacity-40" />
      {body}
      {footer}
    </div>
  );
}

export const CARD_LAYOUTS: Record<string, (c: CardCtx) => ReactNode> = {
  deco: Deco,
  jharokha: Jharokha,
  lace: Lace,
  polaroid: Polaroid,
  confetti: Confetti,
  watercolour: Watercolour,
  split: Split,
  fullbleed: FullBleed,
  letterpress: Letterpress,
};
