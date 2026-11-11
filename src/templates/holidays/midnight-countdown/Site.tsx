"use client";
import { useRef, useState } from "react";
import type { Profile } from "@/lib/profile";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { F } from "../../celebrate/_shared/fonts";
import { Grain } from "../../celebrate/_shared/ui";
import { gsap, burst } from "../../celebrate/_shared/motion";
import { HolidaySite, type Skin } from "../_shared/HolidaySite";
import { hwords, festOf, fmt, langOf, dateParts } from "../_shared/words";
import { Clock, Coupes, Bloom, Fan, MC_CSS } from "./art";

const Ornament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Fan className={className} style={style} />;

export const MC_SKIN: Skin = {
  id: "midnight-countdown", fest: "new-year",
  vars: { "--t-bg": "#0c0c0e", "--t-surface": "#151517", "--t-ink": "#f1e6cf", "--t-muted": "#b3a78e", "--t-accent": "#e8c77a", "--t-gold": "#d6b36a" },
  css: MC_CSS, cssHref: "hol-mc", rootClass: "mc-onyx",
  display: F.poiret, script: F.vibes, body: F.tenor, foil: "mc-foil",
  panel: "rgba(21,21,23,.94)", line: "rgba(214,179,106,.35)", onGold: "#0c0c0e",
  Ornament,
};
const FIRE = ["#f7e2a8", "#ffffff", "#e8c77a", "#ff9f7a", "#bfe3ff"];
const TAP = { en: "Strike midnight", ru: "Пусть пробьёт полночь", hi: "आधी रात बजाइए" };

/** The year being welcomed: a 31 December party rings in the next one. */
export function yearOf(p: Profile) {
  const dp = dateParts(p);
  if (!dp) return "";
  return String(dp.mm === "12" ? dp.year + 1 : dp.year);
}

export default function Site(props: SiteProps) {
  const { profile, compact } = props;
  const root = useRef<HTMLDivElement>(null);
  const [struck, setStruck] = useState(false);
  const [name] = nameParts(profile);
  const L = hwords(profile);
  const f = festOf(profile, "new-year");
  const yr = yearOf(profile);

  const strike = () => {
    const host = root.current;
    if (!host || struck) return;
    setStruck(true);
    // The hands sweep to twelve by CSS transition when `struck` re-renders the clock.
    const w = host.clientWidth;
    [0.2, 0.5, 0.8, 0.35, 0.65].forEach((x, i) => setTimeout(() => burst(host, w * x, 120 + (i % 2) * 90, { colors: FIRE, n: 50, shapes: ["circle", "star"], velocity: [220, 520], gravity: 220, size: 5, life: 2.4 }), 1600 + i * 280));
  };

  const hero = (
    <header className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[720px] pb-12 pt-12" : "min-h-[100svh] justify-center pb-14 pt-14"}`}>
      <Bloom className="mc-bloom pointer-events-none absolute left-[6%] top-[8%] w-[22vw] max-w-[200px] opacity-70" />
      <Bloom color="#ff9f7a" className="mc-bloom pointer-events-none absolute right-[8%] top-[18%] w-[16vw] max-w-[150px] opacity-60 [animation-delay:1.6s]" />
      <Bloom color="#bfe3ff" className="mc-bloom pointer-events-none absolute right-[22%] top-[4%] w-[10vw] max-w-[110px] opacity-50 [animation-delay:3.1s]" />
      <Grain opacity={0.12} blend="overlay" freq={1.1} />
      <div className={`mc-frame pointer-events-none absolute ${compact ? "inset-3" : "inset-4 md:inset-6"}`} />

      <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
      <h1 data-hero-in className={`mc-foil relative mt-3 leading-[0.95] ${compact ? "text-[52px]" : "text-[clamp(3.4rem,9vw,7rem)]"}`} style={{ fontFamily: F.poiret }}>{f.name}</h1>
      {yr && <p data-hero-in aria-hidden className={`mc-foil relative -mt-1 leading-none tracking-[0.12em] ${compact ? "text-[44px]" : "text-[clamp(3rem,8vw,6rem)]"}`} style={{ fontFamily: F.poiret }}>{yr}</p>}

      <button type="button" data-clock onClick={compact ? undefined : strike} aria-label={TAP[langOf(profile)]} className={`relative mt-6 outline-none ${compact ? "w-[220px] cursor-default" : "w-[min(62vw,300px)] cursor-pointer"}`}>
        <Clock midnight={!!compact || struck} className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]" />
      </button>
      {!compact && <p data-hero-in className="relative mt-3 text-sm italic text-[var(--t-muted)]">{struck ? `✦ ${f.wish} ✦` : TAP[langOf(profile)]}</p>}

      <p data-hero-in className={`relative mt-6 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.hosted}</p>
      <h2 data-hero-in className={`relative uppercase tracking-[0.12em] ${compact ? "text-3xl" : "text-[clamp(1.8rem,4.6vw,3.2rem)]"}`} style={{ fontFamily: F.poiret }}><E path="profile.partner1">{name}</E></h2>
      <div data-hero-in className="relative mt-5 flex items-center gap-3 text-[var(--t-gold)]"><span className="h-px w-6 shrink-0 bg-current md:w-10" /><p className="text-lg uppercase tracking-[0.1em] text-[var(--t-ink)] md:text-xl md:tracking-[0.2em]" style={{ fontFamily: F.poiret }}>{fmt(profile)}</p><span className="h-px w-6 shrink-0 bg-current md:w-10" /></div>
      {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
    </header>
  );

  return (
    <HolidaySite
      skin={MC_SKIN}
      props={props}
      rootRef={root}
      hero={hero}
      footerArt={<Coupes className="mx-auto w-32" />}
      intro={({ q }) => {
        gsap.timeline()
          .from(q("[data-clock]"), { scale: 0.7, rotation: -20, opacity: 0, duration: 1.8, ease: "expo.out" })
          .from(q("[data-hero-in]"), { y: 22, opacity: 0, letterSpacing: "0.3em", stagger: 0.1, duration: 1.1, ease: "power3.out" }, "<.2");
      }}
    />
  );
}
