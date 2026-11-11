"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Palm, Toran, Posy, Paisleys, MM_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt } from "../_shared/words";

export const MM_VARS = { "--t-bg": "#fff6e8", "--t-surface": "#fffbf3", "--t-ink": "#4a1222", "--t-muted": "#8c5a4a", "--t-accent": "#b8460c", "--t-gold": "#c99a4a" };

export const MM_LOOK: Look = {
  display: F.prata, script: F.vibes, body: F.cormG, foil: "evmm-foil", accent: "text-[var(--t-accent)]",
  panel: "rounded-[28px] border-2 border-[#e8c48a] bg-[#fffbf3] shadow-[0_40px_80px_-50px_rgba(107,21,48,.45)]",
  tile: "rounded-t-[120px] rounded-b-[18px] border border-[#e8c48a] bg-white/70",
  line: "border-[#d9a85a]",
  button: "inline-block rounded-full border-2 border-[#6b1530] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#6b1530] transition hover:bg-[#6b1530] hover:text-[#fff6e8]",
  Frame: ({ children }) => <div className="aspect-[4/5] overflow-hidden rounded-t-full border-[3px] border-[#c99a4a] p-2"><div className="h-full w-full overflow-hidden rounded-t-full">{children}</div></div>,
  ornament: <Paisleys className="w-32" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = ew(profile);
  const n = names(profile);
  useLenis(!compact);

  // Opening: the toran drops and swings, then the henna inks itself across the palm, stroke by stroke.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-toran-wrap]"), { yPercent: -120, duration: 1.4, ease: "bounce.out" })
      .from(q("[data-palm]"), { y: 60, opacity: 0, rotate: -6, duration: 1.4, ease: "power3.out" }, "<.4")
      .from(q("[data-palm] [data-draw]"), { drawSVG: "0%", duration: 0.9, stagger: 0.04, ease: "power1.inOut" }, "<.5")
      .from(q("[data-hero-in]"), { x: -30, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out" }, "<");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evmm-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("mehndi-mimosa", theme, design, MM_VARS), fontFamily: F.cormG }}>
      <style href="ev-mm" precedence="default">{MM_CSS}</style>
      <header className={`relative px-5 ${compact ? "min-h-[740px] pb-10 pt-40" : "min-h-[100svh] pb-14 pt-36 md:pt-44"}`}>
        <div data-toran-wrap className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"><Toran className="evmm-sway w-full max-w-[620px]" /></div>
        <Grain opacity={0.08} freq={0.9} />
        <div className={`relative mx-auto grid max-w-6xl items-center gap-6 ${compact ? "" : "md:grid-cols-[1.1fr_1fr]"}`}>
          <div className={`text-center ${compact ? "" : "md:text-left"}`}>
            <p data-hero-in className="text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.kicker}</p>
            <h1 className={`mt-4 leading-[0.95] ${compact ? "text-[54px]" : "text-[clamp(3.4rem,9vw,7rem)]"}`} style={{ fontFamily: F.prata }}>
              <E path="profile.partner1" className="evmm-foil evmm-shine">{n.a}</E>
            </h1>
            <p data-hero-in className={`text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.4rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.title}</p>
            <div data-hero-in className={`mt-6 flex items-center justify-center gap-4 text-[var(--t-gold)] ${compact ? "" : "md:justify-start"}`}><span className="h-px w-10 bg-current" /><p className="text-2xl text-[var(--t-ink)]" style={{ fontFamily: F.prata }}>{fmt(profile)}</p></div>
            {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
          </div>
          <div data-palm className={`mx-auto ${compact ? "w-[220px]" : "w-[min(64vw,340px)]"}`}><Palm className="w-full drop-shadow-[0_20px_30px_rgba(107,21,48,.2)]" /></div>
        </div>
      </header>

      <EventSections look={MM_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Posy className="mx-auto w-20" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
