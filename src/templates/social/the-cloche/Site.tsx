"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { Cloche, Cutlery, Fan, CL_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Grain, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../_shared/motion";
import { standardSections } from "../_shared/kit";
import { words, fmt, lineOf, eyebrowOf, langOf } from "../_shared/words";

export const CL_VARS = { "--t-bg": "#1b0b0f", "--t-surface": "#2a0d15", "--t-ink": "#f5e8d4", "--t-muted": "#cdb7a8", "--t-accent": "#e6a3ad", "--t-gold": "#d7b46e" };

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [a, b] = nameParts(profile);
  const L = words(profile);
  const ru = langOf(profile) === "ru";
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-fan]"), { scale: 0, opacity: 0, transformOrigin: "0 0", stagger: 0.08, duration: 1, ease: "power3.out" })
      .from(q("[data-cloche]"), { y: 40, opacity: 0, duration: 1.3, ease: "power3.out" }, "<.2")
      .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.1, ease: "power3.out" }, "<.3")
      .add(() => setOpen(true), "+=.2");
  }, [compact]);

  const fans = (cls: string) => (["left-4 top-4", "right-4 top-4 -scale-x-100", "bottom-4 left-4 -scale-y-100", "bottom-4 right-4 -scale-100"].map((pos) => (
    <span key={pos} data-fan className={`pointer-events-none absolute text-[#d7b46e]/70 ${pos} ${cls}`}><Fan className="w-full" /></span>
  )));

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} cl-root cl-noir relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("the-cloche", theme, design, CL_VARS), fontFamily: F.cormG }}>
      <style href="soc-cl" precedence="default">{CL_CSS}</style>

      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[700px] pb-12 pt-14" : "min-h-[100svh] justify-center pb-14 pt-16"}`}>
        <Grain opacity={0.14} blend="overlay" freq={1.1} />
        {fans(compact ? "w-16" : "w-20 md:w-32")}
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.55em] text-[var(--t-gold)]" style={{ fontFamily: F.tenor }}>{eyebrowOf(profile)}</p>

        <button type="button" data-cloche onClick={compact ? undefined : () => setOpen((o) => !o)} aria-label={ru ? "Поднять клош" : "Lift the cloche"} className={`relative mt-6 outline-none ${compact ? "w-[250px] cursor-default" : "w-[min(70vw,330px)] cursor-pointer"}`}>
          <Cloche open={open} className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.55)]" />
        </button>

        <h1 className={`relative mt-4 italic leading-[0.95] ${compact ? "text-[54px]" : "text-[clamp(3.2rem,10vw,7.4rem)]"}`} style={{ fontFamily: F.bodoni }}>
          <E path="profile.partner1" className="cl-foil cl-shine">{a}</E>
          {b && <><span className="mx-3 text-[0.5em] text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2" className="cl-foil cl-shine">{b}</E></>}
        </h1>
        <p data-hero-in className={`relative mt-1 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>
        <div data-hero-in className="relative mt-7 flex items-center gap-4 text-[var(--t-gold)]"><Cutlery className="w-7 opacity-80" /><p className="text-2xl italic text-[var(--t-ink)]" style={{ fontFamily: F.bodoni }}>{fmt(profile)}</p><Cutlery className="w-7 -scale-x-100 opacity-80" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        {!compact && <p data-hero-in className="relative mt-5 text-sm italic text-[var(--t-muted)]">{open ? (ru ? "✦ Ужин подан ✦" : "✦ Dinner is served ✦") : ru ? "Нажмите на клош" : "Lift the cloche"}</p>}
      </header>

      <Sections design={design} className="relative" render={standardSections({ profile, design, heroUrl, calendarUrl, children, compact, ornament: <Cutlery className="w-12 text-[var(--t-gold)]" />, photoRadius: "160px 160px 6px 6px" })} />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Cloche className="mx-auto w-24 opacity-90" />
        <p className="mt-4 text-[11px] uppercase tracking-[0.5em] text-[var(--t-gold)]" style={{ fontFamily: F.tenor }}>{L.dinner}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-3 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
