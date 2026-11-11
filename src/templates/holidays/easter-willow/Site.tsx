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
import { Egg, Willow, Blossom, Nest, EW_CSS } from "./art";

const Ornament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Blossom className={className} style={style} />;

export const EW_SKIN: Skin = {
  id: "easter-willow", fest: "easter",
  vars: { "--t-bg": "#fbf6ee", "--t-surface": "#fffdf8", "--t-ink": "#3b2a3f", "--t-muted": "#7d6c80", "--t-accent": "#b0567a", "--t-gold": "#a8853a" },
  css: EW_CSS, cssHref: "hol-ew", rootClass: "ew-porcelain",
  display: F.corm, script: F.vibes, body: F.cormG, foil: "ew-foil", displayItalic: true,
  panel: "rgba(255,253,248,.92)", line: "rgba(142,107,184,.28)", onGold: "#fffdf8",
  Ornament,
};
const PETALS = ["#fff7f6", "#f2c6d6", "#e4d7f1", "#f2b544", "#c8e0bf"];
const TAP = { en: "Tap the egg", ru: "Разбейте яичко", hi: "अंडे को छुएँ" };

export default function Site(props: SiteProps) {
  const { profile, compact } = props;
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [name] = nameParts(profile);
  const L = hwords(profile);
  const f = festOf(profile, "easter");

  const crack = () => {
    const host = root.current;
    if (!host || open) return;
    setOpen(true);
    const egg = host.querySelector("[data-egg]");
    const top = host.querySelector("[data-egg] [data-top]");
    const tl = gsap.timeline();
    tl.to(egg, { rotation: -6, duration: 0.08, yoyo: true, repeat: 5, transformOrigin: "50% 90%", ease: "sine.inOut" })
      .to(top, { y: -26, x: 22, rotation: 24, transformOrigin: "100% 100%", duration: 0.8, ease: "back.out(1.7)" });
    if (egg) setTimeout(() => burstFrom(host, egg, { colors: PETALS, n: 70, shapes: ["circle", "rect"], angle: [210, 330], velocity: [300, 650], gravity: 260, size: 9, life: 3.2 }, -20), 600);
  };

  const hero = (
    <header className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[720px] pb-12 pt-16" : "min-h-[100svh] justify-center pb-14 pt-20"}`}>
      <Willow className={`ew-sway pointer-events-none absolute -left-6 top-0 ${compact ? "w-[200px]" : "w-[clamp(200px,34vw,460px)]"}`} />
      <Willow flip className={`pointer-events-none absolute -right-6 top-6 ${compact ? "w-[170px]" : "w-[clamp(170px,28vw,400px)]"}`} />
      {[["8%", "62%", 46], ["86%", "58%", 38], ["14%", "84%", 30], ["78%", "86%", 52]].map(([l, t, w], i) => <Blossom key={i} className="ew-float pointer-events-none absolute" style={{ left: l as string, top: t as string, width: w as number, animationDelay: `${i * 1.3}s` }} />)}
      <Grain opacity={0.04} blend="multiply" freq={0.9} />

      <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
      <h1 data-hero-in className={`ew-foil relative mt-3 italic leading-[0.95] ${compact ? "text-[72px]" : "text-[clamp(4.4rem,12vw,9rem)]"}`} style={{ fontFamily: F.corm }}>{f.name}</h1>
      <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.hosted}</p>
      <h2 data-hero-in className={`relative italic leading-tight ${compact ? "text-4xl" : "text-[clamp(2.2rem,5vw,3.6rem)]"}`} style={{ fontFamily: F.corm }}><E path="profile.partner1">{name}</E></h2>

      <button type="button" data-egg onClick={compact ? undefined : crack} aria-label={TAP[langOf(profile)]} className={`relative mt-6 outline-none ${compact ? "w-[120px] cursor-default" : "w-[min(36vw,170px)] cursor-pointer"}`}>
        <Egg split palette={1} className="w-full drop-shadow-[0_18px_22px_rgba(59,42,63,.25)]" />
      </button>
      {!compact && <p data-hero-in className="relative mt-3 text-sm italic text-[var(--t-muted)]">{open ? `✦ ${f.wish} ✦` : TAP[langOf(profile)]}</p>}

      <div data-hero-in className="relative mt-6 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current" /><p className="text-2xl italic text-[var(--t-ink)]" style={{ fontFamily: F.corm }}>{fmt(profile)}</p><span className="h-px w-12 bg-current" /></div>
      {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
    </header>
  );

  return (
    <HolidaySite
      skin={EW_SKIN}
      props={props}
      rootRef={root}
      hero={hero}
      footerArt={<Nest className="mx-auto w-40" />}
      intro={({ q }) => {
        gsap.timeline()
          .from(q("header > svg"), { opacity: 0, x: (i: number) => (i ? 60 : -60), duration: 1.6, ease: "power3.out" })
          .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.1, duration: 1.1, ease: "power3.out" }, "<.2")
          .from(q("[data-egg]"), { y: -40, opacity: 0, duration: 1, ease: "bounce.out" }, "<.5");
      }}
    />
  );
}
