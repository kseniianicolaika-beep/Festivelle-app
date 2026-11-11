"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { F } from "../../celebrate/_shared/fonts";
import { Grain } from "../../celebrate/_shared/ui";
import { gsap, burstFrom } from "../../celebrate/_shared/motion";
import { HolidaySite, type Skin } from "../_shared/HolidaySite";
import { hwords, festOf, fmt } from "../_shared/words";
import { Diya, Toran, Kandil, Kolam, DP_CSS } from "./art";

const Ornament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Diya className={className} style={style} />;

export const DP_SKIN: Skin = {
  id: "deepotsav", fest: "diwali",
  vars: { "--t-bg": "#1d0f2e", "--t-surface": "#2a1640", "--t-ink": "#fbeed2", "--t-muted": "#d4bfd8", "--t-accent": "#ffb347", "--t-gold": "#e8b04a" },
  css: DP_CSS, cssHref: "hol-dp", rootClass: "dp-night",
  display: F.yatra, script: F.vibes, body: F.cormG, foil: "dp-foil",
  panel: "rgba(42,22,64,.92)", line: "rgba(232,176,74,.35)", onGold: "#2a1208",
  Ornament,
};
const SPARKS = ["#ffe08a", "#ffb347", "#ff6f8a", "#fff6c8", "#2fc1b0"];
const N = 7;

export default function Site(props: SiteProps) {
  const { profile, compact } = props;
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [name] = nameParts(profile);
  const L = hwords(profile);
  const f = festOf(profile, "diwali");
  // Flames are driven by gsap after the tap; React only decides the initial (compact = already lit) state.
  const glowOn = !!compact;

  const light = () => {
    const host = root.current;
    if (!host || lit) return;
    setLit(true);
    const flames = host.querySelectorAll("[data-row] [data-flame]");
    const glows = host.querySelectorAll("[data-row] [data-glow]");
    gsap.to(flames, { opacity: 1, duration: 0.5, stagger: 0.18, ease: "power2.out" });
    gsap.to(glows, { opacity: 1, duration: 0.8, stagger: 0.18 });
    const kolam = host.querySelector("[data-kolam]");
    if (kolam) gsap.fromTo(kolam, { opacity: 0.25 }, { opacity: 0.9, duration: 1.8, delay: 0.6 });
    const title = host.querySelector("[data-title]");
    if (title) setTimeout(() => burstFrom(host, title, { colors: SPARKS, n: 70, shapes: ["star", "circle"], angle: [200, 340], velocity: [350, 800], gravity: 500, size: 7, life: 2.6 }), N * 180 + 200);
  };

  const hero = (
    <header className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[720px] pb-12 pt-28" : "min-h-[100svh] justify-center pb-14 pt-[clamp(7rem,16vw,10rem)]"}`}>
      <Toran className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(90px,14vw,150px)] w-full" swags={compact ? 3 : 5} />
      <Kandil className={`dp-sway pointer-events-none absolute left-[4%] top-[70px] ${compact ? "w-[54px]" : "w-[clamp(54px,8vw,104px)]"}`} />
      <Kandil hue="#d43b8c" className={`dp-sway pointer-events-none absolute right-[5%] top-[90px] ${compact ? "w-[46px]" : "w-[clamp(46px,7vw,90px)]"}`} />
      <Grain opacity={0.12} blend="overlay" freq={1.1} />

      <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
      <h1 data-title className={`dp-foil relative mt-4 leading-[0.95] ${compact ? "text-[68px]" : "text-[clamp(4.2rem,13vw,9.5rem)]"}`} style={{ fontFamily: F.yatra }}>{f.name}</h1>
      <p data-hero-in className={`relative mt-2 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.hosted}</p>
      <h2 data-hero-in className={`relative leading-tight ${compact ? "text-4xl" : "text-[clamp(2.2rem,6vw,4rem)]"}`} style={{ fontFamily: F.cinzel }}><E path="profile.partner1">{name}</E></h2>

      <button type="button" onClick={compact ? undefined : light} aria-label={L.light} className={`relative mt-8 w-full outline-none ${compact ? "max-w-[420px] cursor-default" : "max-w-[720px] cursor-pointer"}`}>
        <div data-row className="relative z-10 flex items-end justify-center">
          {Array.from({ length: N }, (_, i) => {
            const mid = Math.abs(i - (N - 1) / 2);
            return <Diya key={i} lit={glowOn} className="shrink-0" style={{ width: `${15 - mid * 1.4}%`, marginBottom: `${mid * 6}px`, transform: i > N / 2 ? "scaleX(-1)" : undefined }} />;
          })}
        </div>
        <div data-kolam className="pointer-events-none relative mx-auto -mt-[7%] w-[86%]" style={{ aspectRatio: "1/0.34", opacity: glowOn ? 0.9 : 0.25 }}><Kolam className="absolute inset-x-0 top-0 w-full" style={{ transform: "scaleY(.34)", transformOrigin: "50% 0" }} /></div>
      </button>
      {!compact && <p data-hero-in className="relative mt-4 text-sm italic text-[var(--t-muted)]">{lit ? "✦ " + f.wish + " ✦" : L.light}</p>}
      <div data-hero-in className="relative mt-6 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current" /><p className="text-2xl text-[var(--t-ink)]" style={{ fontFamily: F.cinzel }}>{fmt(profile)}</p><span className="h-px w-12 bg-current" /></div>
      {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
    </header>
  );

  return (
    <HolidaySite
      skin={DP_SKIN}
      props={props}
      rootRef={root}
      hero={hero}
      intro={({ q }) => {
        gsap.timeline()
          .from(q("svg[viewBox='0 0 1000 160']"), { yPercent: -100, duration: 1.4, ease: "power3.out" })
          .from(q(".dp-sway"), { y: -160, opacity: 0, duration: 1.6, stagger: 0.2, ease: "power3.out" }, "<.2")
          .from(q("[data-title]"), { opacity: 0, scale: 0.92, filter: "blur(10px)", duration: 1.6, ease: "power3.out" }, "<.2")
          .from(q("[data-hero-in]"), { y: 22, opacity: 0, stagger: 0.1, duration: 1.1, ease: "power3.out" }, "<.4")
          .from(q("[data-row] > svg"), { y: 30, opacity: 0, stagger: 0.07, duration: 0.9, ease: "power3.out" }, "<.2");
      }}
    />
  );
}
