"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { Nalichnik, Karavai, Stitch, BirchTwig, NV_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Grain, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../_shared/motion";
import { standardSections } from "../_shared/kit";
import { words, fmt, lineOf, eyebrowOf, langOf } from "../_shared/words";

export const NV_VARS = { "--t-bg": "#f8f3ea", "--t-surface": "#fffdf8", "--t-ink": "#3a2a26", "--t-muted": "#6c5a52", "--t-accent": "#a3202e", "--t-gold": "#3a5a9c" };

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(profile);
  const L = words(profile);
  const ru = langOf(profile) === "ru";
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.1 })
      .from(q("[data-hero-window]"), { y: 40, opacity: 0, duration: 1.3, ease: "power3.out" })
      .from(q("[data-cat]"), { x: 60, opacity: 0, duration: 1, ease: "power2.out" }, 2.4)
      .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.1, ease: "power3.out" }, 0.4);
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} nv-root nv-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("novoselye", theme, design, NV_VARS), fontFamily: F.kurale }}>
      <style href="soc-nv" precedence="default">{NV_CSS}</style>
      <Stitch w={1600} className="relative h-5 w-full" />

      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[700px] pb-10 pt-10" : "min-h-[100svh] justify-center pb-14 pt-12"}`}>
        <Grain opacity={0.06} freq={0.8} />
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-gold)]">{eyebrowOf(profile)}</p>
        <h1 className={`relative mt-3 leading-[1.02] text-[#6e1420] ${compact ? "text-[48px]" : "text-[clamp(2.9rem,8.5vw,6.4rem)]"}`} style={{ fontFamily: F.ruslan }}>
          <E path="profile.partner1">{a}</E>
          {b && <><span className="mx-3 text-[0.6em] text-[var(--t-gold)]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2">{b}</E></>}
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>

        <div data-hero-window className={`relative mt-6 flex items-center justify-center gap-3 ${compact ? "w-[340px]" : "w-[min(92vw,560px)]"}`}>
          <BirchTwig className="w-[24%] -rotate-12" />
          <Nalichnik className="w-[50%] drop-shadow-[0_20px_26px_rgba(30,40,80,.22)]" />
          <BirchTwig className="w-[24%] rotate-12 -scale-x-100" />
        </div>

        <div data-hero-in className="relative mt-7 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current opacity-60" /><p className="text-2xl text-[#6e1420]" style={{ fontFamily: F.prata }}>{fmt(profile)}</p><span className="h-px w-12 bg-current opacity-60" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        {!compact && <p data-hero-in className="relative mt-4 text-sm italic text-[var(--t-muted)]">{ru ? "По традиции первым в дом входит кот" : "By tradition, the cat crosses the threshold first"}</p>}
      </header>

      <Sections design={design} className="relative" render={standardSections({ profile, design, heroUrl, calendarUrl, children, compact, ornament: <Karavai className="w-36" />, photoRadius: "120px 120px 2px 2px", storyTitle: L.newHome })} />

      <footer className="relative px-6 pb-12 pt-10 text-center">
        <Karavai className="mx-auto w-40" />
        <p className="mt-4 text-sm text-[var(--t-muted)]">{ru ? "Хлеб да соль!" : "Bread and salt — welcome!"}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-3 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
      <Stitch w={1600} className="relative h-5 w-full" />
    </div>
  );
}
