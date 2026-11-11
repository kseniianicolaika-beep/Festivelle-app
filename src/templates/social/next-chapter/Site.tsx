"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import type { Profile } from "@/lib/profile";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { OpenBook, Pressed, Flourish, NC_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Grain, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../_shared/motion";
import { standardSections } from "../_shared/kit";
import { fmt, lineOf, eyebrowOf, langOf } from "../_shared/words";

export const NC_VARS = { "--t-bg": "#f5ecdc", "--t-surface": "#fbf6ec", "--t-ink": "#3a2a26", "--t-muted": "#7a6658", "--t-accent": "#5e1a26", "--t-gold": "#9a7a3e" };

/** The suite's default occasion word — the host's own tradition wins. */
export const ncWord = (p: Profile) => (langOf(p) === "ru" ? "Выход на пенсию" : langOf(p) === "hi" ? "सेवानिवृत्ति" : "Retirement");
export const ncBook = (p: Profile): { title: [string, string]; note: string } =>
  langOf(p) === "ru" ? { title: ["Новая", "глава"], note: "Последняя страница…" } : { title: ["Chapter", "the next"], note: "Chapter the last…" };

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(profile);
  const word = ncWord(profile);
  const book = ncBook(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.1 })
      .from(q("[data-hero-book]"), { y: 50, rotateX: 30, opacity: 0, duration: 1.4, ease: "power3.out" })
      .from(q("[data-stem]"), { y: 30, opacity: 0, rotation: (i) => (i ? 18 : -18), stagger: 0.15, duration: 1.2, ease: "power3.out" }, 0.3)
      .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.1, ease: "power3.out" }, 0.4);
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} nc-root nc-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("next-chapter", theme, design, NC_VARS), fontFamily: F.cormG }}>
      <style href="soc-nc" precedence="default">{NC_CSS}</style>

      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[700px] pb-10 pt-12" : "min-h-[100svh] justify-center pb-14 pt-14"}`}>
        <Grain opacity={0.08} freq={0.75} />
        <span data-stem className={`pointer-events-none absolute left-[4%] top-[8%] ${compact ? "w-10" : "w-14 md:w-20"}`}><Pressed className="w-full -rotate-12" /></span>
        <span data-stem className={`pointer-events-none absolute right-[5%] top-[14%] ${compact ? "w-9" : "w-12 md:w-16"}`}><Pressed hue="#d9b7d9" className="w-full rotate-12" /></span>
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-gold)]">{eyebrowOf(profile, word)}</p>
        <h1 className={`relative mt-3 italic leading-[0.96] text-[#5e1a26] ${compact ? "text-[50px]" : "text-[clamp(3rem,9vw,6.8rem)]"}`} style={{ fontFamily: F.fraun }}>
          <E path="profile.partner1">{a}</E>
          {b && <><span className="mx-3 text-[0.55em] text-[#7d8b6a]" style={{ fontFamily: F.caveat }}>&amp;</span><E path="profile.partner2">{b}</E></>}
        </h1>
        <p data-hero-in className={`relative mt-1 text-[#7d8b6a] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.caveat }}>{lineOf(profile, word)}</p>

        <div data-hero-book className={`relative mt-8 ${compact ? "w-[330px]" : "w-[min(90vw,560px)]"}`} style={{ perspective: "900px" }}>
          <OpenBook still={compact} title={book.title} note={book.note} className="w-full drop-shadow-[0_24px_30px_rgba(60,20,20,.2)]" />
        </div>

        <div data-hero-in className="relative mt-8 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current opacity-60" /><p className="text-2xl italic text-[#5e1a26]" style={{ fontFamily: F.fraun }}>{fmt(profile)}</p><span className="h-px w-12 bg-current opacity-60" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <Sections design={design} className="relative" render={standardSections({ profile, design, heroUrl, calendarUrl, children, compact, tradition: word, ornament: <Flourish className="w-44" />, photoRadius: "0px" })} />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Flourish className="mx-auto w-40" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[#7d8b6a]" style={{ fontFamily: F.caveat }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
