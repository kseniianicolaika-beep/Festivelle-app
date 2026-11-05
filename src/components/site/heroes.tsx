import type { ReactNode } from "react";
import type { Theme } from "@/lib/themes";

// Seven additional website hero layouts, each with a signature reveal (CSS keyframes in globals.css,
// disabled under prefers-reduced-motion). Romance / editorial / arch remain in WeddingSite.tsx.
export type HeroCtx = {
  names: ReactNode; // <h1> content (editable names)
  line: ReactNode; // occasion line
  date: ReactNode;
  where: ReactNode;
  countdown: ReactNode;
  motif: (cls: string) => ReactNode;
  photo: (cls: string) => ReactNode; // hero photo or graceful fallback (data-edit-photo="hero")
  hasPhoto: boolean;
  compact?: boolean;
  theme: Theme;
  initials: string;
};

const rnd = (i: number, s = 1) => { const x = Math.sin(i * 12.9898 * s + 78.233) * 43758.5453; return x - Math.floor(x); };
const h = (c?: boolean) => (c ? "min-h-[520px]" : "min-h-[100dvh]");

function Cinematic(x: HeroCtx) {
  return (
    <header className={`relative flex flex-col items-center justify-end overflow-hidden pb-[12vh] text-center text-white ${h(x.compact)}`}>
      <div className="absolute inset-0">{x.photo("h-full w-full object-cover [animation:kenburns_30s_ease-in-out_infinite_alternate]")}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      <div className="letterbox absolute inset-x-0 top-0 z-10 bg-black" />
      <div className="letterbox absolute inset-x-0 bottom-0 z-10 bg-black" />
      <div className="relative z-20 px-6">
        <p className="rise eyebrow mb-6 opacity-80">{x.line}</p>
        <h1 className={`display rise rise-2 leading-[0.9] ${x.compact ? "text-5xl" : "text-[4.5rem] md:text-[9rem]"}`}>{x.names}</h1>
        <div className="rise rise-3 mt-8 flex items-center justify-center gap-5 text-lg opacity-90"><span className="h-px w-10 bg-white/60" />{x.date}<span className="h-px w-10 bg-white/60" /></div>
        <div className="rise rise-4 mt-2 text-sm tracking-[.3em] uppercase opacity-70">{x.where}</div>
      </div>
    </header>
  );
}

function Magazine(x: HeroCtx) {
  return (
    <header className={`relative overflow-hidden px-6 pb-16 pt-10 md:px-12 ${x.compact ? "" : "min-h-[100dvh]"}`}>
      <div className="flex items-end justify-between border-b-2 border-[var(--t-ink)] pb-3">
        <p className="display text-[13vw] leading-[.8] tracking-tight md:text-[7rem]">{x.initials}</p>
        <div className="text-right text-[11px] uppercase tracking-[.3em] text-[var(--t-muted)]"><div>The special issue</div><div>{x.date}</div></div>
      </div>
      <div className={`mt-8 grid gap-8 ${x.compact ? "" : "md:grid-cols-[1.1fr_1fr]"}`}>
        <div className="iris relative aspect-[4/5] overflow-hidden">{x.photo("h-full w-full object-cover")}</div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-[var(--t-accent)]">Cover story</p>
          <h1 className={`display rise mt-4 leading-[.95] ${x.compact ? "text-5xl" : "text-6xl md:text-[6rem]"}`}>{x.names}</h1>
          <p className="script rise rise-2 mt-4 text-3xl text-[var(--t-accent)]">{x.line}</p>
          <div className="rise rise-3 mt-8 border-t border-[var(--t-ink)]/20 pt-4 text-sm uppercase tracking-[.25em] text-[var(--t-muted)]">{x.where}</div>
          <div className="rise rise-4">{x.countdown}</div>
        </div>
      </div>
    </header>
  );
}

function Letter(x: HeroCtx) {
  return (
    <header className={`relative flex items-center justify-center px-5 py-16 ${h(x.compact)}`}>
      <div className="unfold paper-tex relative w-full max-w-2xl bg-[var(--t-surface)] px-8 py-14 text-center shadow-[0_40px_90px_-40px_rgba(0,0,0,.45)] md:px-16">
        <div className="absolute inset-3 border border-[var(--t-gold)]/40" />
        <div className="absolute -top-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--t-accent)] text-sm text-white shadow-lg ring-4 ring-[var(--t-accent)]/30"><span className="display">{x.initials}</span></div>
        {x.motif("draw mx-auto mb-6 w-40")}
        <p className="script ink text-3xl text-[var(--t-accent)]">{x.line}</p>
        <h1 className={`display rise rise-2 mt-4 leading-[.95] ${x.compact ? "text-5xl" : "text-6xl md:text-7xl"}`}>{x.names}</h1>
        <div className="rise rise-3 mt-8 display text-2xl">{x.date}</div>
        <div className="rise rise-4 mt-1 text-sm text-[var(--t-muted)]">{x.where}</div>
        <div className="rise rise-5">{x.countdown}</div>
      </div>
    </header>
  );
}

function Timeline(x: HeroCtx) {
  return (
    <header className={`relative flex items-center overflow-hidden px-6 md:px-16 ${h(x.compact)}`}>
      <div className="absolute bottom-0 left-8 top-0 w-px bg-gradient-to-b from-transparent via-[var(--t-gold)] to-[var(--t-gold)] md:left-20" />
      <div className="relative pl-10 md:pl-20">
        <span className="pop absolute left-[-5px] top-3 h-3 w-3 rotate-45 border border-[var(--t-gold)] bg-[var(--t-bg)] md:left-[3px]" />
        <p className="eyebrow rise text-[var(--t-accent)]">Chapter one</p>
        <h1 className={`display rise rise-2 mt-4 leading-[.95] ${x.compact ? "text-5xl" : "text-6xl md:text-[7.5rem]"}`}>{x.names}</h1>
        <p className="script rise rise-3 mt-4 text-3xl text-[var(--t-accent)] md:text-4xl">{x.line}</p>
        <div className="rise rise-4 mt-8 display text-2xl">{x.date}</div>
        <div className="rise rise-4 text-sm text-[var(--t-muted)]">{x.where}</div>
        <div className="rise rise-5">{x.countdown}</div>
      </div>
      {!x.compact && <div className="absolute right-[6%] top-1/2 hidden w-[30vw] max-w-sm -translate-y-1/2 md:block">{x.motif("draw w-full opacity-70")}</div>}
    </header>
  );
}

function GalleryFirst(x: HeroCtx) {
  return (
    <header className={`relative overflow-hidden ${h(x.compact)}`}>
      <div className="grid h-full min-h-[inherit] grid-cols-3 grid-rows-2 gap-1.5 p-1.5">
        <div className="iris col-span-2 row-span-2 overflow-hidden rounded-xl">{x.photo("h-full w-full object-cover")}</div>
        <div className="flex items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--t-accent)_14%,var(--t-surface))]">{x.motif("draw w-3/4")}</div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--t-surface)] p-4 text-center">
          <p className="display text-4xl md:text-6xl">{x.initials}</p>
          <div className="mt-2 text-xs uppercase tracking-[.25em] text-[var(--t-muted)]">{x.date}</div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--t-bg)] via-[var(--t-bg)]/80 to-transparent px-6 pb-10 pt-24 text-center">
        <h1 className={`display rise leading-[.95] ${x.compact ? "text-5xl" : "text-6xl md:text-[7rem]"}`}>{x.names}</h1>
        <p className="script rise rise-2 mt-2 text-3xl text-[var(--t-accent)]">{x.line}</p>
        <div className="rise rise-3 mt-2 text-sm text-[var(--t-muted)]">{x.where}</div>
      </div>
    </header>
  );
}

function Deco(x: HeroCtx) {
  return (
    <header className={`relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${h(x.compact)}`}>
      <div className="absolute inset-0 opacity-[.12]" style={{ background: "repeating-conic-gradient(from 180deg at 50% 100%, var(--t-gold) 0deg 1.5deg, transparent 1.5deg 7deg)" }} />
      <div className="curtain-l absolute inset-y-0 left-0 z-20 w-1/2 bg-[var(--t-surface)]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 18px, color-mix(in oklab, var(--t-gold) 30%, transparent) 18px 19px)" }} />
      <div className="curtain-r absolute inset-y-0 right-0 z-20 w-1/2 bg-[var(--t-surface)]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 18px, color-mix(in oklab, var(--t-gold) 30%, transparent) 18px 19px)" }} />
      <div className="relative border-[3px] border-double border-[var(--t-gold)] px-8 py-14 md:px-20" style={{ clipPath: "polygon(24px 0,calc(100% - 24px) 0,100% 24px,100% calc(100% - 24px),calc(100% - 24px) 100%,24px 100%,0 calc(100% - 24px),0 24px)" }}>
        {x.motif("draw mx-auto mb-6 w-48")}
        <p className="eyebrow text-[var(--t-muted)]">{x.line}</p>
        <h1 className={`display foil sweep relative mt-4 uppercase leading-[.95] tracking-[.06em] ${x.compact ? "text-5xl" : "text-6xl md:text-[7rem]"}`}>{x.names}</h1>
        <div className="mt-8 flex items-center justify-center gap-4 text-[var(--t-gold)]"><span className="h-px w-16 bg-current" />◆<span className="h-px w-16 bg-current" /></div>
        <div className="mt-4 display text-2xl uppercase tracking-[.2em]">{x.date}</div>
        <div className="mt-1 text-xs uppercase tracking-[.3em] text-[var(--t-muted)]">{x.where}</div>
      </div>
    </header>
  );
}

function Playful(x: HeroCtx) {
  const colors = [x.theme.accent, x.theme.gold, ...x.theme.petals];
  return (
    <header className={`relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${h(x.compact)}`}>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} aria-hidden className="float absolute rounded-full" style={{ left: `${(rnd(i) * 92).toFixed(1)}%`, top: `${(rnd(i, 2) * 85).toFixed(1)}%`, width: 30 + rnd(i, 3) * 50, height: (30 + rnd(i, 3) * 50) * 1.18, background: colors[i % colors.length], opacity: 0.55, animationDelay: `${(i % 7) * 0.7}s`, borderRadius: "50% 50% 48% 52% / 55% 55% 45% 45%" }} />
      ))}
      <div className="relative">
        {x.motif("pop mx-auto mb-4 w-44")}
        <h1 className={`display pop leading-[.95] ${x.compact ? "text-6xl" : "text-[5rem] md:text-[9rem]"}`} style={{ animationDelay: ".2s" }}>{x.names}</h1>
        <p className="pop mt-3 inline-block rounded-full bg-[var(--t-accent)] px-6 py-2 text-xl text-white shadow-lg" style={{ animationDelay: ".4s" }}>{x.line}</p>
        <div className="rise rise-3 mt-6 display text-2xl">{x.date}</div>
        <div className="rise rise-4 text-sm text-[var(--t-muted)]">{x.where}</div>
        <div className="rise rise-5">{x.countdown}</div>
      </div>
    </header>
  );
}

export const SITE_HEROES: Record<string, (x: HeroCtx) => ReactNode> = {
  cinematic: Cinematic,
  magazine: Magazine,
  letter: Letter,
  timeline: Timeline,
  gallery: GalleryFirst,
  deco: Deco,
  playful: Playful,
};

/** Page-level wrapper class per layout (section styling beyond the hero). */
export const SITE_BODY: Record<string, string> = {
  letter: "mx-auto max-w-3xl paper-tex bg-[var(--t-surface)] shadow-[0_40px_90px_-50px_rgba(0,0,0,.4)] my-6",
  magazine: "[&_section]:md:text-left [&_.eyebrow]:!text-left [&_section]:border-t [&_section]:border-[var(--t-ink)]/15",
  deco: "[&_section+section]:before:content-['◆'] [&_section+section]:before:block [&_section+section]:before:text-center [&_section+section]:before:text-[var(--t-gold)]",
  timeline: "relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-[var(--t-gold)]/40 md:before:left-20",
};

/** Default section order when the host hasn't customised it (gallery-first moves photos up). */
export const SITE_DEFAULT_ORDER: Record<string, string[]> = {
  gallery: ["gallery", "invitation", "story", "details", "schedule", "venue", "rsvp", "info"],
  timeline: ["story", "schedule", "invitation", "details", "venue", "gallery", "rsvp", "info"],
};
