"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import type { Profile } from "@/lib/profile";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { Mortarboard, Laurel, Diploma, CP_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Grain, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { standardSections } from "../_shared/kit";
import { fmt, lineOf, eyebrowOf, langOf, dateParts } from "../_shared/words";

export const CP_VARS = { "--t-bg": "#faf5ec", "--t-surface": "#fffdf8", "--t-ink": "#3a2a2a", "--t-muted": "#7a6260", "--t-accent": "#6e1630", "--t-gold": "#a7802f" };
const GOLD = ["#f6dc9a", "#c9a24e", "#6e1630", "#fffaf0", "#e6a3ad"];

/** The suite's default occasion word ("Graduation") — the host's own tradition wins. */
export const cpWord = (p: Profile) => (langOf(p) === "ru" ? "Выпускной" : langOf(p) === "hi" ? "दीक्षांत समारोह" : "Graduation");
export const classOf = (p: Profile) => {
  const y = dateParts(p)?.year;
  if (!y || (p.tradition && !/grad|выпуск|диплом/i.test(p.tradition))) return "";
  return langOf(p) === "ru" ? `Выпуск ${y}` : `Class of ${y}`;
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(profile);
  const word = cpWord(profile);
  const cls = classOf(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced, el }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const cap = q("[data-hero-cap]")[0];
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-laurel] path"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", stagger: 0.02, duration: 0.5, ease: "back.out(2)" })
      .from(q("[data-fly]"), { y: 260, opacity: 0, rotation: () => gsap.utils.random(-120, 120), stagger: 0.07, duration: 1.4, ease: "power3.out" }, 0.3)
      .from(cap ?? [], { y: -140, rotation: -24, opacity: 0, duration: 1.2, ease: "bounce.out" }, 0.6)
      .add(() => { if (cap) burstFrom(el, cap, { colors: GOLD, n: 70, shapes: ["rect", "strip", "star"], angle: [220, 320], velocity: [400, 900], gravity: 700, size: 9 }); }, 1.6)
      .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.1, ease: "power3.out" }, 0.9);
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} cp-root cp-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("cap-and-laurel", theme, design, CP_VARS), fontFamily: F.cormG }}>
      <style href="soc-cp" precedence="default">{CP_CSS}</style>

      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[700px] pb-10 pt-12" : "min-h-[100svh] justify-center pb-14 pt-14"}`}>
        <Grain opacity={0.06} freq={0.8} />
        {!compact && [[12, 20, -20], [84, 16, 25], [22, 70, 10], [78, 64, -14], [50, 8, 6]].map(([x, y, r], i) => (
          <span key={i} data-fly className="pointer-events-none absolute w-12 opacity-50 md:w-16" style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${r}deg)` }}><Mortarboard className="w-full" /></span>
        ))}
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.55em] text-[var(--t-gold)]">{eyebrowOf(profile, word)}</p>
        <div className={`relative mt-4 ${compact ? "w-[330px]" : "w-[min(88vw,560px)]"}`}>
          <Laurel className="w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-[6%]">
            <span data-hero-cap className="block w-[34%]"><Mortarboard className="w-full drop-shadow-[0_14px_14px_rgba(60,10,20,.25)]" /></span>
            <h1 className={`mt-1 leading-[1] text-[#6e1630] ${compact ? "text-[34px]" : "text-[clamp(2rem,6.4vw,3.8rem)]"}`} style={{ fontFamily: F.cinzel }}>
              <E path="profile.partner1">{a}</E>
              {b && <><span className="mx-2 text-[0.7em] text-[var(--t-gold)]" style={{ fontFamily: F.vibes }}>&amp;</span><E path="profile.partner2">{b}</E></>}
            </h1>
            {cls && <p className="cp-foil mt-2 text-[11px] uppercase tracking-[0.45em]" style={{ fontFamily: F.tenor }}>{cls}</p>}
          </div>
        </div>
        <p data-hero-in className={`relative mt-3 text-[var(--t-gold)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile, word)}</p>
        <div data-hero-in className="relative mt-6 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current opacity-60" /><p className="text-2xl italic text-[#6e1630]" style={{ fontFamily: F.corm }}>{fmt(profile)}</p><span className="h-px w-12 bg-current opacity-60" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <Sections design={design} className="relative" render={standardSections({ profile, design, heroUrl, calendarUrl, children, compact, tradition: word, ornament: <Diploma className="w-40" />, photoRadius: "2px" })} />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Laurel className="mx-auto w-28" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-gold)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
