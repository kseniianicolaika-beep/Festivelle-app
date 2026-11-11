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
import { Fanoos, Crescent, Lattice, Mihrab, ED_CSS } from "./art";

const Ornament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Lattice n={3} className={className} style={style} />;

export const ED_SKIN: Skin = {
  id: "eid-dawat", fest: "eid",
  vars: { "--t-bg": "#0f2e28", "--t-surface": "#143a33", "--t-ink": "#f3e9d2", "--t-muted": "#bfb59a", "--t-accent": "#e6c46a", "--t-gold": "#d4af37" },
  css: ED_CSS, cssHref: "hol-ed", rootClass: "ed-emerald",
  display: F.prata, script: F.vibes, body: F.cormG, foil: "ed-foil",
  panel: "rgba(20,58,51,.94)", line: "rgba(212,175,55,.35)", onGold: "#0f2e28",
  Ornament,
};
const STARS = ["#fbe7a6", "#d4af37", "#ffffff", "#f3e9d2"];
const TAP = { en: "Touch the moon to light the lanterns", ru: "Коснитесь луны, чтобы зажечь фонари", hi: "लालटेन जलाने के लिए चाँद को छुएँ" };
const LAMPS = [
  { left: "6%", chain: 30, w: "clamp(52px,8vw,96px)" }, { left: "20%", chain: 110, w: "clamp(44px,6vw,80px)" },
  { left: "74%", chain: 90, w: "clamp(44px,6vw,80px)" }, { left: "87%", chain: 20, w: "clamp(52px,8vw,96px)" },
];

export default function Site(props: SiteProps) {
  const { profile, compact } = props;
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [name] = nameParts(profile);
  const L = hwords(profile);
  const f = festOf(profile, "eid");

  const light = () => {
    const host = root.current;
    if (!host || lit) return;
    setLit(true);
    gsap.to(host.querySelectorAll("header [data-lamp]"), { opacity: 1, duration: 0.9, stagger: 0.25, ease: "power2.out" });
    const moon = host.querySelector("[data-moon]");
    if (moon) burstFrom(host, moon, { colors: STARS, n: 50, shapes: ["star"], angle: [0, 360], velocity: [150, 420], gravity: 60, size: 7, life: 3 });
  };

  const hero = (
    <header className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[720px] pb-12 pt-16" : "min-h-[100svh] justify-center pb-14 pt-20"}`}>
      {LAMPS.map((l, i) => (compact && (i === 1 || i === 2) ? null : (
        <div key={i} className="ed-swing pointer-events-none absolute top-0" style={{ left: l.left, width: compact ? 48 : l.w, animationDelay: `${i * 0.7}s` }}>
          <Fanoos chain={l.chain} lit={!!compact} className="w-full" />
        </div>
      )))}
      <Mihrab className={`pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 opacity-70 ${compact ? "h-[88%] w-[76%]" : "h-[88%] w-[min(86vw,620px)]"}`} />
      <Grain opacity={0.1} blend="overlay" freq={1.1} />

      <button type="button" data-moon onClick={compact ? undefined : light} aria-label={TAP[langOf(profile)]} className={`relative outline-none ${compact ? "w-[90px] cursor-default" : "w-[min(26vw,130px)] cursor-pointer"}`}>
        <Crescent className="w-full" />
      </button>
      <p data-hero-in className="relative mt-4 text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
      <h1 data-hero-in className={`ed-foil relative mt-3 leading-[1] ${compact ? "text-[60px]" : "text-[clamp(3.8rem,10vw,7.5rem)]"}`} style={{ fontFamily: F.prata }}>{f.wish}</h1>
      <p data-hero-in className={`relative mt-2 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{L.hosted}</p>
      <h2 data-hero-in className={`relative leading-tight ${compact ? "text-3xl" : "text-[clamp(2rem,4.6vw,3.4rem)]"}`} style={{ fontFamily: F.prata }}><E path="profile.partner1">{name}</E></h2>
      <Lattice n={7} className={`relative mt-6 ${compact ? "w-[220px]" : "w-[min(70vw,320px)]"}`} />
      {!compact && <p data-hero-in className="relative mt-3 text-sm italic text-[var(--t-muted)]">{lit ? `✦ ${f.wish} ✦` : TAP[langOf(profile)]}</p>}
      <div data-hero-in className="relative mt-5 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-10 bg-current" /><p className="text-2xl text-[var(--t-ink)]" style={{ fontFamily: F.prata }}>{fmt(profile)}</p><span className="h-px w-10 bg-current" /></div>
      {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
    </header>
  );

  return (
    <HolidaySite
      skin={ED_SKIN}
      props={props}
      rootRef={root}
      hero={hero}
      footerArt={<Crescent className="mx-auto w-16" />}
      intro={({ q }) => {
        gsap.timeline()
          .from(q(".ed-swing"), { yPercent: -100, duration: 1.8, stagger: 0.15, ease: "power3.out" })
          .from(q("[data-moon]"), { scale: 0.5, opacity: 0, rotation: -30, duration: 1.6, ease: "expo.out" }, "<.2")
          .from(q("[data-hero-in]"), { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.1, duration: 1.1, ease: "power3.out" }, "<.3");
      }}
    />
  );
}
