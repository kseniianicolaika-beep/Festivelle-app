"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Church, Rushnyk, Cross, KK_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt } from "../_shared/words";

export const KK_VARS = { "--t-bg": "#fbf7ee", "--t-surface": "#ffffff", "--t-ink": "#2c3b55", "--t-muted": "#76829a", "--t-accent": "#a8323a", "--t-gold": "#c99a4a" };

export const KK_LOOK: Look = {
  display: F.ruslan, text: F.prata, script: F.vibes, body: F.kurale, foil: "evkk-foil", accent: "text-[var(--t-accent)]",
  panel: "border border-[#e2d6bd] bg-white shadow-[0_30px_70px_-40px_rgba(44,59,85,.35)] [border-image:none]",
  tile: "border-y-[3px] border-double border-[#c99a4a] bg-white/80",
  line: "border-[#c99a4a]",
  button: "inline-block bg-[#2c3b55] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#fbf7ee] transition hover:bg-[#a8323a]",
  Frame: ({ children }) => <div className="aspect-[4/5] overflow-hidden rounded-t-[50%_30%] border-[3px] border-double border-[#c99a4a] p-2"><div className="h-full w-full overflow-hidden rounded-t-[50%_30%]">{children}</div></div>,
  ornament: <Rushnyk className="h-4 w-40" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = ew(profile);
  const n = names(profile);
  useLenis(!compact);

  // Opening: the church rises, a band of light sweeps across the gilded domes, and the bells swing.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-church]"), { y: 50, opacity: 0, duration: 1.4, ease: "power3.out" })
      .from(q("[data-church] [data-dome]"), { y: 16, opacity: 0, stagger: 0.18, duration: 1, ease: "power2.out" }, "<.4")
      .fromTo(q("[data-church] [data-sweep]"), { x: 0, opacity: 0.9 }, { x: 520, duration: 1.8, ease: "power2.inOut" }, ">")
      .fromTo(q("[data-church] [data-bell]"), { rotate: 0 }, { keyframes: [{ rotate: 18 }, { rotate: -14 }, { rotate: 9 }, { rotate: -5 }, { rotate: 0 }], duration: 2.2, stagger: 0.2, ease: "sine.inOut" }, "<")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out" }, "<");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evkk-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("kupol-krestiny", theme, design, KK_VARS), fontFamily: F.kurale }}>
      <style href="ev-kk" precedence="default">{KK_CSS}</style>
      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[760px] pb-10 pt-10" : "min-h-[100svh] pb-14 pt-12"}`}>
        <Rushnyk className="absolute inset-x-0 top-0 h-6 w-full" />
        <Grain opacity={0.06} freq={0.9} />
        <div data-church className={`relative mt-6 ${compact ? "w-[250px]" : "w-[min(72vw,360px)]"}`}><Church className="w-full" /></div>
        <p data-hero-in className="relative mt-4 max-w-md text-[11px] uppercase tracking-[0.42em] text-[var(--t-muted)]">{L.kicker}</p>
        <h1 className={`relative mt-3 leading-[1] ${compact ? "text-[52px]" : "text-[clamp(3rem,9vw,6.8rem)]"}`} style={{ fontFamily: F.ruslan }}>
          <E path="profile.partner1" className="evkk-foil evkk-shine inline-block pt-[0.16em] pb-[0.06em]">{n.a}</E>
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.line}</p>
        <div data-hero-in className="relative mt-4 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current" /><p className="text-2xl text-[var(--t-ink)]">{fmt(profile)}</p><span className="h-px w-12 bg-current" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block max-w-xl text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        <Rushnyk className="absolute inset-x-0 bottom-0 h-6 w-full" />
      </header>

      <EventSections look={KK_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Cross className="mx-auto w-12" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
