"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import type { Profile } from "@/lib/profile";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { Doorway, Toran, Kalash, Rangoli, GP_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Grain, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../_shared/motion";
import { standardSections } from "../_shared/kit";
import { words, fmt, lineOf, eyebrowOf, langOf } from "../_shared/words";

export const GP_VARS = { "--t-bg": "#fbf3e3", "--t-surface": "#fffaf0", "--t-ink": "#3e2416", "--t-muted": "#8a5a3a", "--t-accent": "#e2621d", "--t-gold": "#d7a65a" };
/** This suite's own name for the occasion, in the guest's language. */
export const gpWord = (p: Profile) => (langOf(p) === "ru" ? "Новоселье" : langOf(p) === "hi" ? "गृह प्रवेश" : "Griha Pravesh");

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(!!compact);
  const [a, b] = nameParts(profile);
  const L = words(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact) return;
    if (reduced) { setOpen(true); return; }
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-hero-toran]"), { y: -60, opacity: 0, duration: 1.2, ease: "power3.out" })
      .from(q("[data-hero-door]"), { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" }, "<.2")
      .add(() => setOpen(true), "-=.2")
      .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.1, ease: "power3.out" }, "<.4");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} gp-root gp-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("griha-pravesh", theme, design, GP_VARS), fontFamily: F.cormG }}>
      <style href="soc-gp" precedence="default">{GP_CSS}</style>
      <div className="gp-border relative h-2 w-full" />

      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[720px] pb-10 pt-4" : "min-h-[100svh] pb-14 pt-4"}`}>
        <Grain opacity={0.07} freq={0.8} />
        <div data-hero-toran className="relative -mx-5 w-[calc(100%+2.5rem)] overflow-hidden"><Toran w={1200} drops={13} className={compact ? "w-[150%] max-w-none -translate-x-[16%]" : "w-[180%] max-w-none -translate-x-[22%] md:w-full md:translate-x-0"} /></div>
        <p data-hero-in className="relative mt-4 text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{eyebrowOf(profile, gpWord(profile))}</p>
        <h1 className={`relative mt-3 leading-[1] text-[#6b1420] ${compact ? "text-[50px]" : "text-[clamp(3rem,9vw,6.6rem)]"}`} style={{ fontFamily: F.yatra }}>
          <E path="profile.partner1">{a}</E>
          {b && <><span className="mx-3 text-[0.6em] text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2">{b}</E></>}
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>

        <div data-hero-door className={`relative mt-6 flex items-end justify-center gap-2 ${compact ? "w-[340px]" : "w-[min(92vw,520px)]"}`}>
          <Kalash className="mb-2 w-[18%]" />
          <Doorway open={open} className="w-[58%] drop-shadow-[0_24px_30px_rgba(90,40,10,.3)]" />
          <Kalash className="mb-2 w-[18%] -scale-x-100" />
        </div>

        <div data-hero-in className="relative mt-6 flex items-center gap-4 text-[var(--t-accent)]"><span className="h-px w-12 bg-current opacity-60" /><p className="text-2xl italic text-[#6b1420]" style={{ fontFamily: F.corm }}>{fmt(profile)}</p><span className="h-px w-12 bg-current opacity-60" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <Sections design={design} className="relative" render={standardSections({ profile, design, heroUrl, calendarUrl, children, compact, ornament: <Rangoli className="w-20" />, photoRadius: "190px 190px 12px 12px", storyTitle: L.newHome })} />

      <footer className="relative px-6 pb-12 pt-10 text-center">
        <Rangoli className="mx-auto w-28" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
      <div className="gp-border relative h-2 w-full" />
    </div>
  );
}
