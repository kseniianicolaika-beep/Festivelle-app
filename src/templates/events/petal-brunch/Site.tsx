"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Bouquet, Coupe, Petals, Sprig, PB_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt } from "../_shared/words";

export const PB_VARS = { "--t-bg": "#fbf4ef", "--t-surface": "#fffaf6", "--t-ink": "#4a1d2e", "--t-muted": "#9a6f72", "--t-accent": "#b23a52", "--t-gold": "#c9a36a" };

export const PB_LOOK: Look = {
  display: F.bodoni, script: F.vibes, body: F.cormG, foil: "evpb-foil", accent: "text-[var(--t-accent)]", italic: true,
  panel: "rounded-[32px] border border-[#e8c9c4] bg-white/80 shadow-[0_40px_80px_-50px_rgba(158,47,76,.45)]",
  tile: "rounded-[28px] border border-[#ecd2cc] bg-white/70",
  line: "border-[#d9b3ad]",
  button: "inline-block rounded-full bg-[var(--t-accent)] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-white transition hover:brightness-110",
  Frame: ({ children }) => <div className="aspect-[4/5] overflow-hidden rounded-t-[200px] rounded-b-[24px] border-[6px] border-white shadow-[0_30px_60px_-30px_rgba(158,47,76,.5)]">{children}</div>,
  ornament: <Sprig className="w-28" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = ew(profile);
  const n = names(profile);
  useLenis(!compact);

  // Opening: the ribbon tails swing loose, the bouquet settles, petals start to fall, the name blooms in.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-bouquet]"), { y: 80, scale: 0.86, opacity: 0, duration: 1.8, ease: "power3.out" })
      .from(q("[data-ribbon='l']"), { rotate: -38, duration: 1.6, ease: "elastic.out(1,0.4)" }, "<.6")
      .from(q("[data-ribbon='r']"), { rotate: 38, duration: 1.6, ease: "elastic.out(1,0.4)" }, "<")
      .from(q("[data-coupe]"), { y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: "back.out(1.6)" }, "<.2")
      .from(q("[data-hero-in]"), { y: 26, opacity: 0, filter: "blur(8px)", stagger: 0.14, duration: 1.2, ease: "power3.out" }, "<.1");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evpb-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("petal-brunch", theme, design, PB_VARS), fontFamily: F.cormG }}>
      <style href="ev-pb" precedence="default">{PB_CSS}</style>
      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[720px] evpb-10 pt-12" : "min-h-[100svh] evpb-14 pt-16"}`}>
        {!compact && <Petals />}
        <Grain opacity={0.08} freq={0.9} />
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.kicker}</p>
        <h1 className={`relative mt-4 italic leading-[0.95] ${compact ? "text-[56px]" : "text-[clamp(3.4rem,11vw,8rem)]"}`} style={{ fontFamily: F.bodoni }}>
          <E path="profile.partner1" className="evpb-foil evpb-shine">{n.a}</E>
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.4rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.title}</p>
        <div className={`relative mt-2 flex items-end justify-center ${compact ? "w-[340px]" : "w-[min(92vw,560px)]"}`}>
          <div data-coupe className="w-[22%] -rotate-6 self-end"><Coupe tilt={-8} className="w-full" /></div>
          <div data-bouquet className="w-[56%]"><Bouquet className="w-full drop-shadow-[0_24px_30px_rgba(158,47,76,.25)]" /></div>
          <div data-coupe className="w-[22%] rotate-6 self-end"><Coupe tilt={8} className="w-full" /></div>
        </div>
        <div data-hero-in className="relative mt-6 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current" /><p className="text-2xl italic text-[var(--t-ink)]" style={{ fontFamily: F.bodoni }}>{fmt(profile)}</p><span className="h-px w-12 bg-current" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <EventSections look={PB_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 evpb-14 pt-10 text-center">
        <Coupe className="mx-auto w-16" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
