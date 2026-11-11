"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { F } from "../../celebrate/_shared/fonts";
import { Grain } from "../../celebrate/_shared/ui";
import { gsap, burstFrom } from "../../celebrate/_shared/motion";
import { HolidaySite, type Skin } from "../_shared/HolidaySite";
import { hwords, festOf, fmt, langOf } from "../_shared/words";
import { Fir, Holly, Candle, Snow, MF_CSS } from "./art";

const Ornament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Holly className={className} style={style} />;

export const MF_SKIN: Skin = {
  id: "midnight-fir", fest: "christmas",
  vars: { "--t-bg": "#0d241e", "--t-surface": "#15302a", "--t-ink": "#f4efe2", "--t-muted": "#b9c8bf", "--t-accent": "#e0645a", "--t-gold": "#d8b66a" },
  css: MF_CSS, cssHref: "hol-mf", rootClass: "mf-night",
  display: F.playfair, script: F.vibes, body: F.cormG, foil: "mf-foil", displayItalic: true,
  panel: "rgba(21,48,42,.94)", line: "rgba(216,182,106,.35)", onGold: "#0d241e",
  Ornament,
};
const SNOW = ["#ffffff", "#f6e2a6", "#e3eef0", "#ffd36a"];
const TAP = { en: "Touch the star to light the tree", ru: "Коснитесь звезды, чтобы зажечь ёлку", hi: "पेड़ जगमगाने के लिए तारे को छुएँ" };

export default function Site(props: SiteProps) {
  const { profile, compact } = props;
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [name] = nameParts(profile);
  const L = hwords(profile);
  const f = festOf(profile, "christmas");

  const light = () => {
    const host = root.current;
    if (!host || lit) return;
    setLit(true);
    const lights = [...host.querySelectorAll("[data-tree] [data-light]")].reverse();
    const star = host.querySelector("[data-tree] [data-star]");
    if (star) gsap.fromTo(star, { scale: 0.6, opacity: 0.45 }, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2)" });
    gsap.to(lights, { opacity: 1, duration: 0.25, stagger: 0.035, delay: 0.3 });
    if (star) setTimeout(() => burstFrom(host, star, { colors: SNOW, n: 60, shapes: ["star", "circle"], angle: [200, 340], velocity: [300, 700], gravity: 300, size: 6, life: 3 }), 400);
  };

  const hero = (
    <header className={`relative grid items-center overflow-hidden px-5 ${compact ? "min-h-[720px] gap-6 pb-12 pt-14" : "min-h-[100svh] gap-10 pb-14 pt-16 md:grid-cols-2 md:px-[6vw]"}`}>
      <Snow count={compact ? 24 : 48} fall={!compact} />
      <Grain opacity={0.1} blend="overlay" freq={1.1} />
      <div className={`relative z-10 flex flex-col items-center text-center ${compact ? "" : "md:items-start md:text-left"}`}>
        <p data-hero-in className="text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
        <h1 data-hero-in className={`mf-foil mt-4 italic leading-[0.92] ${compact ? "text-[64px]" : "text-[clamp(4rem,10vw,8.5rem)]"}`} style={{ fontFamily: F.playfair }}>{f.name}</h1>
        <p data-hero-in className={`mt-3 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.hosted}</p>
        <h2 data-hero-in className={`italic leading-tight ${compact ? "text-4xl" : "text-[clamp(2.2rem,5vw,3.8rem)]"}`} style={{ fontFamily: F.playfair }}><E path="profile.partner1">{name}</E></h2>
        <div data-hero-in className="mt-8 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-10 bg-current" /><p className="text-2xl italic text-[var(--t-ink)]" style={{ fontFamily: F.playfair }}>{fmt(profile)}</p><span className="h-px w-10 bg-current" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        {!compact && <Candle className="mt-10 hidden w-20 md:block" />}
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <button type="button" data-tree onClick={compact ? undefined : light} aria-label={TAP[langOf(profile)]} className={`outline-none ${compact ? "w-[240px] cursor-default" : "w-[min(70vw,420px)] cursor-pointer"}`}>
          <Fir lit={!!compact} className="w-full drop-shadow-[0_40px_50px_rgba(0,0,0,.5)]" />
        </button>
        {!compact && <p data-hero-in className="mt-3 text-sm italic text-[var(--t-muted)]">{lit ? `✦ ${f.wish} ✦` : TAP[langOf(profile)]}</p>}
      </div>
    </header>
  );

  return (
    <HolidaySite
      skin={MF_SKIN}
      props={props}
      rootRef={root}
      hero={hero}
      footerArt={<Candle className="mx-auto w-16" />}
      intro={({ q }) => {
        gsap.timeline()
          .from(q("[data-tree]"), { y: 80, opacity: 0, duration: 1.8, ease: "power3.out" })
          .from(q("[data-hero-in]"), { y: 24, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.2, ease: "power3.out" }, "<.3");
      }}
    />
  );
}
