"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { Table, Sprig, Taper, LT_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Grain, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../_shared/motion";
import { standardSections } from "../_shared/kit";
import { words, fmt, lineOf, eyebrowOf } from "../_shared/words";

export const LT_VARS = { "--t-bg": "#f6efe4", "--t-surface": "#fffaf2", "--t-ink": "#3b2a22", "--t-muted": "#8a6d55", "--t-accent": "#b5562f", "--t-gold": "#c9a25a" };

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(profile);
  const L = words(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const flames = q("[data-hero-table] [data-flame]");
    gsap.set(flames, { opacity: 0, scale: 0.2 });
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-hero-table]"), { y: 50, opacity: 0, duration: 1.6, ease: "power3.out" })
      .to(flames, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.28, ease: "back.out(2)" }, "-=.6")
      .from(q("[data-hero-in]"), { y: 26, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.1, ease: "power3.out" }, 0.4);
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} lt-root lt-linen relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("long-table", theme, design, LT_VARS), fontFamily: F.cormG }}>
      <style href="soc-lt" precedence="default">{LT_CSS}</style>

      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[680px] pb-10 pt-14" : "min-h-[100svh] justify-center pb-14 pt-16"}`}>
        <Grain opacity={0.08} freq={0.9} />
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{eyebrowOf(profile)}</p>
        <Sprig className="relative mt-5 w-40" />
        <h1 className={`relative mt-4 italic leading-[0.94] text-[#6e1e2b] ${compact ? "text-[56px]" : "text-[clamp(3.4rem,10vw,7.6rem)]"}`} style={{ fontFamily: F.fraun }}>
          <E path="profile.partner1">{a}</E>
          {b && <><span className="mx-3 text-[0.55em] text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2">{b}</E></>}
        </h1>
        <p data-hero-in className={`relative mt-2 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.3rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>

        <div data-hero-table className="relative mt-10 flex w-full justify-center overflow-hidden">
          <Table className={compact ? "w-[150%] max-w-none" : "w-[170%] max-w-none md:w-[min(1100px,92vw)]"} style={{ filter: "drop-shadow(0 26px 30px rgba(80,40,10,.18))" }} />
        </div>

        <div data-hero-in className="relative mt-10 flex items-center gap-4 text-[var(--t-accent)]"><span className="h-px w-12 bg-current opacity-60" /><p className="text-2xl italic text-[#6e1e2b]" style={{ fontFamily: F.fraun }}>{fmt(profile)}</p><span className="h-px w-12 bg-current opacity-60" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <Sections design={design} className="relative" render={standardSections({ profile, design, heroUrl, calendarUrl, children, compact, ornament: <Sprig className="w-36" />, photoRadius: "4px" })} />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <div className="flex items-end justify-center gap-6"><Taper className="w-6" /><Taper className="w-7" /><Taper className="w-6" /></div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{L.dinner}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-3 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
