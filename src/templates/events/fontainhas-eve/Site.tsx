"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Table, VillaArch, Olive, Taper, LT_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt } from "../_shared/words";

export const LT_VARS = { "--t-bg": "#f6ecdf", "--t-surface": "#fbf5ea", "--t-ink": "#3a2620", "--t-muted": "#8a6a58", "--t-accent": "#b0532c", "--t-gold": "#b78b4a" };

export const LT_LOOK: Look = {
  display: F.corm, script: F.vibes, body: F.cormG, foil: "evfe-foil", accent: "text-[var(--t-accent)]", italic: true,
  panel: "rounded-[10px] border border-[#d9c6a8] bg-[#fbf5ea] shadow-[0_40px_80px_-50px_rgba(58,38,32,.45)]",
  tile: "rounded-t-[100px] rounded-b-[6px] border border-[#d9c6a8] bg-[#fbf5ea]",
  line: "border-[#c9a77a]",
  button: "inline-block rounded-full bg-[#3a2620] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#fbf5ea] transition hover:bg-[#b0532c]",
  Frame: ({ children }) => <div className="aspect-[4/5] overflow-hidden rounded-t-full border-[10px] border-[#efe1cd] shadow-[0_0_0_2px_#c0643a]">{children}</div>,
  ornament: <Olive className="w-28" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = ew(profile);
  const n = names(profile);
  useLenis(!compact);

  // Opening: dusk falls, then the tapers light pair by pair from the near end of the table to the far one.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const flames = q("[data-table] [data-flame]").sort((a, b) => Number((a as HTMLElement).dataset.depth) - Number((b as HTMLElement).dataset.depth));
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-dusk]"), { opacity: 0, duration: 1.4, ease: "power2.out" })
      .from(q("[data-table]"), { y: 50, opacity: 0, duration: 1.4, ease: "power3.out" }, "<.3")
      .fromTo(flames, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.14, ease: "back.out(2)" }, "<.6")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, filter: "blur(6px)", stagger: 0.14, duration: 1.1, ease: "power3.out" }, "<.2");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evfe-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("fontainhas-eve", theme, design, LT_VARS), fontFamily: F.cormG }}>
      <style href="ev-fe" precedence="default">{LT_CSS}</style>
      <header className={`relative flex flex-col items-center overflow-hidden text-center ${compact ? "min-h-[740px]" : "min-h-[100svh]"}`}>
        <div data-dusk className="evfe-dusk absolute inset-0" />
        <VillaArch className="pointer-events-none absolute inset-0 h-full w-full" />
        <Grain opacity={0.1} blend="overlay" freq={1} />
        <div className={`relative z-10 flex flex-1 flex-col items-center px-14 ${compact ? "pt-24" : "pt-[16vh]"}`}>
          <p data-hero-in className="text-[11px] uppercase tracking-[0.5em] text-[#f6dcc0]">{L.kicker}</p>
          <h1 className={`mt-4 italic leading-[0.95] text-[#fff6ea] ${compact ? "text-[48px]" : "text-[clamp(3rem,8vw,6.5rem)]"}`} style={{ fontFamily: F.corm }}>
            <E path="profile.partner1">{n.a}</E>
            {n.b && <><span className="mx-3 text-[0.6em] text-[#f3c08a]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2">{n.b}</E></>}
          </h1>
          <p data-hero-in className={`text-[#f3c08a] ${compact ? "text-2xl" : "text-3xl md:text-4xl"}`} style={{ fontFamily: F.vibes }}>{L.line}</p>
          <div data-hero-in className="mt-5 flex items-center gap-4 text-[#f3c08a]"><span className="h-px w-10 bg-current" /><p className="text-2xl italic text-[#fff6ea]" style={{ fontFamily: F.corm }}>{fmt(profile)}</p><span className="h-px w-10 bg-current" /></div>
          {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[11px] uppercase tracking-[0.4em] text-[#f6dcc0]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        </div>
        <div data-table className={`relative z-10 mt-auto ${compact ? "w-[min(100%,560px)]" : "w-[min(96vw,860px)]"}`}><Table className="w-full" /></div>
      </header>

      <EventSections look={LT_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <div className="mx-auto flex w-24 justify-center gap-3"><Taper className="w-7" /><Taper className="w-7" /></div>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
