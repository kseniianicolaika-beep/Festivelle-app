"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Clock, Flutes, Moon, Stars, DecoRule, MT_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt } from "../_shared/words";

export const MT_VARS = { "--t-bg": "#1d0a12", "--t-surface": "#2a0f1b", "--t-ink": "#f6e9d6", "--t-muted": "#c7a98f", "--t-accent": "#e8c27a", "--t-gold": "#d8b46a" };

export const MT_LOOK: Look = {
  display: F.poiret, script: F.vibes, body: F.tenor, foil: "evmt-foil", accent: "text-[var(--t-accent)]", upper: true,
  panel: "border border-[#d8b46a]/50 bg-[#2a0f1b]/90 shadow-[0_40px_80px_-40px_rgba(0,0,0,.7)] [clip-path:polygon(18px_0,calc(100%_-_18px)_0,100%_18px,100%_calc(100%_-_18px),calc(100%_-_18px)_100%,18px_100%,0_calc(100%_-_18px),0_18px)]",
  tile: "border border-[#d8b46a]/40 bg-[#2a0f1b] [clip-path:polygon(14px_0,calc(100%_-_14px)_0,100%_14px,100%_100%,0_100%,0_14px)]",
  line: "border-[#d8b46a]/50",
  button: "inline-block border border-[#d8b46a] px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[#f5d58f] transition hover:bg-[#d8b46a] hover:text-[#1d0a12]",
  Frame: ({ children }) => <div className="aspect-[4/5] border border-[#d8b46a] p-2 [clip-path:polygon(50%_0,100%_14%,100%_100%,0_100%,0_14%)]"><div className="h-full w-full overflow-hidden [clip-path:polygon(50%_0,100%_14%,100%_100%,0_100%,0_14%)]">{children}</div></div>,
  ornament: <DecoRule className="w-36" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = ew(profile);
  const n = names(profile);
  useLenis(!compact);

  // Opening: the hands sweep round to a minute before midnight, the flutes lean in and clink.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-clock]"), { scale: 0.7, opacity: 0, duration: 1.4, ease: "power3.out" })
      .fromTo(q("[data-hand='m']"), { rotate: -366 }, { rotate: -6, duration: 2.4, ease: "power2.inOut" }, "<.2")
      .fromTo(q("[data-hand='h']"), { rotate: -60 }, { rotate: 0, duration: 2.4, ease: "power2.inOut" }, "<")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out" }, "<.6")
      .fromTo(q("[data-flute='l']"), { rotate: -6 }, { rotate: 12, duration: 0.7, ease: "back.out(3)" }, ">-.2")
      .fromTo(q("[data-flute='r']"), { rotate: 6 }, { rotate: -12, duration: 0.7, ease: "back.out(3)" }, "<")
      .fromTo(q("[data-clink]"), { opacity: 0, scale: 0.4, transformOrigin: "100px 22px" }, { opacity: 1, scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 }, ">-.25");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evmt-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("midnight-toast", theme, design, MT_VARS), fontFamily: F.tenor }}>
      <style href="ev-mt" precedence="default">{MT_CSS}</style>
      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[760px] pb-10 pt-12" : "min-h-[100svh] pb-14 pt-16"}`}>
        <Stars />
        <Moon className={`absolute ${compact ? "right-4 top-4 w-10" : "right-[6vw] top-8 w-14 md:w-24"}`} />
        <Grain opacity={0.12} blend="overlay" freq={1.1} />
        <p data-hero-in className="relative px-10 text-[11px] uppercase tracking-[0.55em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}>{L.kicker}</p>
        <div data-clock className={`relative mt-6 ${compact ? "w-[230px]" : "w-[min(60vw,300px)]"}`}><Clock className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.5)]" /></div>
        <h1 className={`relative mt-6 uppercase leading-[1] tracking-[0.06em] ${compact ? "text-[40px]" : "text-[clamp(2.6rem,7vw,5.6rem)]"}`} style={{ fontFamily: F.poiret }}>
          <E path="profile.partner1" className="evmt-foil evmt-shine">{n.a}</E>
          {n.b && <><span className="mx-3 align-middle text-[0.7em] normal-case text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2" className="evmt-foil evmt-shine">{n.b}</E></>}
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.line}</p>
        <div data-hero-in className="relative mt-4 flex items-center gap-5"><DecoRule className="hidden w-28 sm:block" /><p className="text-lg uppercase tracking-[0.35em]" style={{ fontFamily: F.cinzel }}>{fmt(profile)}</p><DecoRule className="hidden w-28 sm:block" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        <div className={`relative mt-6 ${compact ? "w-24" : "w-28 md:w-32"}`}><Flutes className="w-full" /></div>
      </header>

      <EventSections look={MT_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Moon className="mx-auto w-12" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
